import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

// Mock data for export functionality
const mockUsers = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "founder", status: "active", createdAt: "2024-01-01", lastLogin: "2024-01-20", phone: "+1234567890", location: "New York", verified: true },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "investor", status: "active", createdAt: "2024-01-02", lastLogin: "2024-01-19", phone: "+1987654321", location: "California", verified: true },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "founder", status: "pending", createdAt: "2024-01-05", lastLogin: null, phone: "+1122334455", location: "Texas", verified: false },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "investor", status: "suspended", createdAt: "2024-01-03", lastLogin: "2024-01-15", phone: "+1555666777", location: "Florida", verified: true }
];

const mockStartups = [
	{ id: 1, name: "TechStart Inc", founder: "John Doe", status: "pending", funding: 50000, category: "Technology", createdAt: "2024-01-15", description: "AI-powered startup platform", website: "https://techstart.com", teamSize: 5 },
	{ id: 2, name: "GreenEnergy Co", founder: "Jane Smith", status: "approved", funding: 250000, category: "Energy", createdAt: "2024-01-10", description: "Renewable energy solutions", website: "https://greenenergy.com", teamSize: 8 },
	{ id: 3, name: "AI Solutions", founder: "Bob Johnson", status: "rejected", funding: 100000, category: "AI", createdAt: "2024-01-08", description: "Machine learning consulting", website: "https://ai-solutions.com", teamSize: 3 },
	{ id: 4, name: "HealthTech Pro", founder: "Alice Brown", status: "pending", funding: 75000, category: "Healthcare", createdAt: "2024-01-12", description: "Healthcare technology platform", website: "https://healthtechpro.com", teamSize: 6 }
];

const mockInvestments = [
	{ id: 1, startupId: 2, investorId: 2, startupName: "GreenEnergy Co", investorName: "Jane Smith", amount: 50000, status: "completed", createdAt: "2024-01-18", returnRate: 12.5, duration: 24, riskLevel: "Medium" },
	{ id: 2, startupId: 3, investorId: 4, startupName: "AI Solutions", investorName: "Alice Brown", amount: 25000, status: "pending", createdAt: "2024-01-16", returnRate: 18.0, duration: 18, riskLevel: "High" },
	{ id: 3, startupId: 2, investorId: 1, startupName: "GreenEnergy Co", investorName: "John Doe", amount: 75000, status: "completed", createdAt: "2024-01-15", returnRate: 10.0, duration: 36, riskLevel: "Low" }
];

const mockDocuments = [
	{ id: 1, name: "Business_Plan_TechStart.pdf", type: "PDF", size: 2048576, uploadedBy: "John Doe", uploadedAt: "2024-01-15", status: "approved" },
	{ id: 2, name: "Financials_GreenEnergy.xlsx", type: "XLS", size: 1572864, uploadedBy: "Jane Smith", uploadedAt: "2024-01-14", status: "approved" },
	{ id: 3, name: "Pitch_Deck_AI_Solutions.pdf", type: "PDF", size: 3145728, uploadedBy: "Bob Johnson", uploadedAt: "2024-01-13", status: "pending" }
];

// POST /api/admin/export - Generate and return export data
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const {
		dataType,
		fields,
		format,
		dateRange = "all",
		filters = {},
		templateName = null
	} = body;

	// Validate required fields
	if (!dataType || !fields || !Array.isArray(fields) || fields.length === 0) {
		throw error(400, {
			message: 'Missing required fields: dataType, fields (must be non-empty array)'
		});
	}

	// Validate data type
	const validDataTypes = ['users', 'startups', 'investments', 'documents'];
	if (!validDataTypes.includes(dataType)) {
		throw error(400, {
			message: `Invalid dataType. Must be one of: ${validDataTypes.join(', ')}`
		});
	}

	// Validate format
	const validFormats = ['csv', 'excel', 'json', 'xml'];
	if (!validFormats.includes(format)) {
		throw error(400, {
			message: `Invalid format. Must be one of: ${validFormats.join(', ')}`
		});
	}

	// Get data based on type
	let rawData = [];
	switch (dataType) {
		case 'users':
			rawData = mockUsers;
			break;
		case 'startups':
			rawData = mockStartups;
			break;
		case 'investments':
			rawData = mockInvestments;
			break;
		case 'documents':
			rawData = mockDocuments;
			break;
	}

	// Apply filters
	let filteredData = rawData;
	if (Object.keys(filters).length > 0) {
		filteredData = rawData.filter(item => {
			return Object.entries(filters).every(([key, value]) => {
				if (value === null || value === undefined || value === '') return true;
				return item[key] === value;
			});
		});
	}

	// Apply date range filter
	if (dateRange !== 'all') {
		const now = new Date();
		let startDate: Date;

		switch (dateRange) {
			case '7d':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case '30d':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case '90d':
				startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
				break;
			case '1y':
				startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
				break;
			default:
				startDate = new Date(0); // Beginning of time
		}

		filteredData = filteredData.filter(item => {
			const itemDate = new Date(item.createdAt || item.uploadedAt);
			return itemDate >= startDate;
		});
	}

	// Select only requested fields
	const processedData = filteredData.map(item => {
		const result: any = {};
		fields.forEach(field => {
			if (item.hasOwnProperty(field)) {
				result[field] = item[field];
			}
		});
		return result;
	});

	// Generate response based on format
	const exportId = `export_${Date.now()}`;
	const exportName = templateName || `${dataType}_export_${new Date().toISOString().split('T')[0]}`;

	switch (format) {
		case 'csv':
			return new Response(generateCSV(processedData, fields), {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="${exportName}.csv"`
				}
			});

		case 'excel':
			return new Response(generateExcel(processedData, fields), {
				headers: {
					'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'Content-Disposition': `attachment; filename="${exportName}.xlsx"`
				}
			});

		case 'xml':
			return new Response(generateXML(processedData, dataType), {
				headers: {
					'Content-Type': 'application/xml',
					'Content-Disposition': `attachment; filename="${exportName}.xml"`
				}
			});

		case 'json':
		default:
			return json({
				exportId,
				exportName,
				dataType,
				format,
				totalRecords: processedData.length,
				fields,
				data: processedData,
				generatedAt: new Date().toISOString(),
				filters,
				dateRange
			});
	}
};

function generateCSV(data: any[], fields: string[]): string {
	const lines = [];

	// Add header row
	lines.push(fields.join(','));

	// Add data rows
	for (const row of data) {
		const values = fields.map(field => {
			const value = row[field];
			if (value === null || value === undefined) return '';

			// Escape commas and quotes in CSV
			const stringValue = String(value);
			if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
				return `"${stringValue.replace(/"/g, '""')}"`;
			}
			return stringValue;
		});
		lines.push(values.join(','));
	}

	return lines.join('\n');
}

function generateExcel(data: any[], fields: string[]): Buffer {
	// Mock Excel generation - in a real implementation, use exceljs or similar library
	const mockData = {
		worksheet: 'Export',
		headers: fields,
		data: data,
		generated: new Date().toISOString()
	};

	return Buffer.from(JSON.stringify(mockData));
}

function generateXML(data: any[], rootElement: string): string {
	let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
	xml += `<${rootElement}s>\n`;

	for (const item of data) {
		xml += `  <${rootElement}>\n`;
		for (const [key, value] of Object.entries(item)) {
			const safeValue = String(value).replace(/[<>&'"]/g, (match) => {
				const escapeChars: { [key: string]: string } = {
					'<': '&lt;',
					'>': '&gt;',
					'&': '&amp;',
					"'": '&apos;',
					'"': '&quot;'
				};
				return escapeChars[match];
			});
			xml += `    <${key}>${safeValue}</${key}>\n`;
		}
		xml += `  </${rootElement}>\n`;
	}

	xml += `</${rootElement}s>`;
	return xml;
}
