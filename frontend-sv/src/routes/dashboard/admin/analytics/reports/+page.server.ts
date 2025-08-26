import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock reports data
	// In a real application, these would be fetched from the database

	const reports = [
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
		},
		{
			id: 3,
			name: "Platform Health",
			description: "System performance and uptime metrics",
			type: "system",
			schedule: "daily",
			lastRun: "2024-01-20",
			status: "active",
			metrics: ["uptime", "response_time", "error_rate"],
			createdBy: "admin",
			createdAt: "2024-01-10",
			updatedAt: "2024-01-20"
		}
	];

	return {
		reports
	};
};
