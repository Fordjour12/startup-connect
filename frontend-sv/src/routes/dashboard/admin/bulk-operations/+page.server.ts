import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock data for bulk operations page
	// In a real application, these would be fetched from the database

	const users = [
		{
			id: 1,
			name: "John Doe",
			email: "john@example.com",
			role: "founder",
			status: "active",
			lastLogin: "2024-01-20",
			createdAt: "2024-01-01"
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			role: "investor",
			status: "active",
			lastLogin: "2024-01-19",
			createdAt: "2024-01-02"
		},
		{
			id: 3,
			name: "Bob Johnson",
			email: "bob@example.com",
			role: "founder",
			status: "pending",
			lastLogin: null,
			createdAt: "2024-01-05"
		},
		{
			id: 4,
			name: "Alice Brown",
			email: "alice@example.com",
			role: "investor",
			status: "suspended",
			lastLogin: "2024-01-15",
			createdAt: "2024-01-03"
		},
		{
			id: 5,
			name: "Charlie Wilson",
			email: "charlie@example.com",
			role: "founder",
			status: "active",
			lastLogin: "2024-01-18",
			createdAt: "2024-01-04"
		}
	];

	const startups = [
		{
			id: 1,
			name: "TechStart Inc",
			founder: "John Doe",
			status: "pending",
			submitted: "2024-01-15",
			funding: 50000,
			description: "AI-powered startup platform"
		},
		{
			id: 2,
			name: "GreenEnergy Co",
			founder: "Jane Smith",
			status: "approved",
			submitted: "2024-01-10",
			funding: 250000,
			description: "Renewable energy solutions"
		},
		{
			id: 3,
			name: "AI Solutions",
			founder: "Bob Johnson",
			status: "rejected",
			submitted: "2024-01-08",
			funding: 100000,
			description: "Machine learning consulting"
		},
		{
			id: 4,
			name: "HealthTech Pro",
			founder: "Alice Brown",
			status: "pending",
			submitted: "2024-01-12",
			funding: 75000,
			description: "Healthcare technology platform"
		}
	];

	const systemStats = {
		totalUsers: users.length,
		totalStartups: startups.length,
		pendingUsers: users.filter(u => u.status === "pending").length,
		pendingStartups: startups.filter(s => s.status === "pending").length,
		systemHealth: "healthy"
	};

	const bulkOperations = [
		{
			id: 1,
			name: "User Approval Batch",
			category: "users",
			operation: "approve",
			items: [3, 5],
			status: "completed",
			executedAt: "2024-01-20T10:00:00Z",
			executedBy: "admin"
		},
		{
			id: 2,
			name: "Startup Review",
			category: "startups",
			operation: "review",
			items: [1, 4],
			status: "in_progress",
			executedAt: null,
			executedBy: "admin"
		}
	];

	return {
		users,
		startups,
		systemStats,
		bulkOperations
	};
};
