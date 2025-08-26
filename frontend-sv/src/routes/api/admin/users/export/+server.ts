import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

// Mock user data for export
const mockUsers = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "founder", status: "active", createdAt: "2024-01-01", lastLogin: "2024-01-20" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "investor", status: "active", createdAt: "2024-01-02", lastLogin: "2024-01-19" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "founder", status: "pending", createdAt: "2024-01-05", lastLogin: null },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "investor", status: "suspended", createdAt: "2024-01-03", lastLogin: "2024-01-15" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "founder", status: "active", createdAt: "2024-01-04", lastLogin: "2024-01-18" }
];

// GET /api/admin/users/export - Export user data
export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'json';
	const ids = url.searchParams.get('ids');
	const userIds = ids ? ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : null;

	// Filter users if specific IDs provided
	let usersToExport = mockUsers;
	if (userIds && userIds.length > 0) {
		usersToExport = mockUsers.filter(user => userIds.includes(user.id));
	}

	// Validate format
	const validFormats = ['json', 'csv', 'excel'];
	if (!validFormats.includes(format)) {
		throw error(400, `Invalid format: ${format}. Supported formats: ${validFormats.join(', ')}`);
	}

	// Prepare export data
	const exportData = {
		exportedAt: new Date().toISOString(),
		totalRecords: usersToExport.length,
		format,
		data: usersToExport.map(user => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			status: user.status,
			createdAt: user.createdAt,
			lastLogin: user.lastLogin || 'Never'
		}))
	};

	// Return data in requested format
	switch (format) {
		case 'csv':
			return new Response(generateCSV(exportData.data), {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': 'attachment; filename="users_export.csv"'
				}
			});

		case 'excel':
			return new Response(generateExcel(exportData.data), {
				headers: {
					'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'Content-Disposition': 'attachment; filename="users_export.xlsx"'
				}
			});

		case 'json':
		default:
			return json({
				...exportData,
				success: true,
				message: `Successfully exported ${usersToExport.length} user records`
			});
	}
};

function generateCSV(data: any[]): string {
	if (data.length === 0) {
		return 'No data to export';
	}

	const headers = Object.keys(data[0]);
	const csvLines = [];

	// Add headers
	csvLines.push(headers.join(','));

	// Add data rows
	for (const row of data) {
		const values = headers.map(header => {
			const value = row[header];
			// Escape commas and quotes in CSV
			if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
				return `"${value.replace(/"/g, '""')}"`;
			}
			return value;
		});
		csvLines.push(values.join(','));
	}

	return csvLines.join('\n');
}

function generateExcel(data: any[]): Buffer {
	// Mock Excel generation - in a real implementation, use exceljs or similar library
	const mockData = {
		worksheet: 'Users',
		data: data,
		generated: new Date().toISOString()
	};

	return Buffer.from(JSON.stringify(mockData));
}
