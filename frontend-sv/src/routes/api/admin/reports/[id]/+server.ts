import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

// Mock reports storage
const mockReports = [
	{
		id: 1,
		name: "Monthly User Growth",
		description: "Track user registration and activity trends",
		type: "growth",
		schedule: "monthly",
		lastRun: "2024-01-20",
		status: "active",
		metrics: ["new_users", "active_users", "retention_rate"],
		createdBy: "admin",
		createdAt: "2024-01-01",
		updatedAt: "2024-01-20"
	},
	{
		id: 2,
		name: "Investment Performance",
		description: "Monitor investment transactions and success rates",
		type: "financial",
		schedule: "weekly",
		lastRun: "2024-01-19",
		status: "active",
		metrics: ["total_investments", "success_rate", "average_amount"],
		createdBy: "admin",
		createdAt: "2024-01-05",
		updatedAt: "2024-01-19"
	}
];

// GET /api/admin/reports/[id] - Get specific report
export const GET: RequestHandler = async ({ params }) => {
	const reportId = parseInt(params.id);
	const report = mockReports.find(r => r.id === reportId);

	if (!report) {
		throw error(404, 'Report not found');
	}

	return json({
		report,
		success: true
	});
};

// PUT /api/admin/reports/[id] - Update report
export const PUT: RequestHandler = async ({ params, request }) => {
	const reportId = parseInt(params.id);
	const body = await request.json();

	const reportIndex = mockReports.findIndex(r => r.id === reportId);

	if (reportIndex === -1) {
		throw error(404, 'Report not found');
	}

	// Update report with new data
	mockReports[reportIndex] = {
		...mockReports[reportIndex],
		...body,
		updatedAt: new Date().toISOString()
	};

	return json({
		report: mockReports[reportIndex],
		success: true,
		message: 'Report updated successfully'
	});
};

// DELETE /api/admin/reports/[id] - Delete report
export const DELETE: RequestHandler = async ({ params }) => {
	const reportId = parseInt(params.id);
	const reportIndex = mockReports.findIndex(r => r.id === reportId);

	if (reportIndex === -1) {
		throw error(404, 'Report not found');
	}

	const deletedReport = mockReports.splice(reportIndex, 1)[0];

	return json({
		report: deletedReport,
		success: true,
		message: 'Report deleted successfully'
	});
};

// POST /api/admin/reports/[id]/run - Run specific report
export const POST: RequestHandler = async ({ params }) => {
	const reportId = parseInt(params.id);
	const report = mockReports.find(r => r.id === reportId);

	if (!report) {
		throw error(404, 'Report not found');
	}

	// Mock report execution
	const reportData = {
		reportId: report.id,
		reportName: report.name,
		executedAt: new Date().toISOString(),
		status: "completed",
		data: {
			// Mock data based on report metrics
			summary: `Report executed successfully for ${report.metrics.length} metrics`,
			metrics: report.metrics,
			generatedData: {
				totalUsers: Math.floor(Math.random() * 1000) + 1000,
				activeUsers: Math.floor(Math.random() * 800) + 500,
				newUsers: Math.floor(Math.random() * 100) + 20,
				retentionRate: Math.floor(Math.random() * 30) + 70
			}
		}
	};

	// Update last run time
	const reportIndex = mockReports.findIndex(r => r.id === reportId);
	mockReports[reportIndex].lastRun = new Date().toISOString().split('T')[0];
	mockReports[reportIndex].updatedAt = new Date().toISOString();

	return json({
		reportData,
		success: true,
		message: 'Report executed successfully'
	});
};
