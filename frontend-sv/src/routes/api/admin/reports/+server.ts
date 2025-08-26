import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

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

// GET /api/admin/reports - List all reports
export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	const status = url.searchParams.get('status');

	let filteredReports = [...mockReports];

	if (type) {
		filteredReports = filteredReports.filter(report => report.type === type);
	}

	if (status) {
		filteredReports = filteredReports.filter(report => report.status === status);
	}

	return json({
		reports: filteredReports,
		total: filteredReports.length,
		success: true
	});
};

// POST /api/admin/reports - Create new report
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const newReport = {
		id: mockReports.length + 1,
		name: body.name,
		description: body.description || "",
		type: body.type || "custom",
		schedule: body.schedule || "manual",
		status: "active",
		metrics: body.metrics || [],
		createdBy: "admin", // In real app, get from session
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		lastRun: null
	};

	mockReports.push(newReport);

	return json({
		report: newReport,
		success: true,
		message: 'Report created successfully'
	});
};
