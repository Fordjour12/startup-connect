import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data

	// Mock user data
	const users = [
		{
			id: 1,
			name: "John Doe",
			email: "john.doe@example.com",
			role: "founder",
			status: "active",
			createdAt: "2024-01-15",
			lastLogin: "2024-01-20"
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane.smith@example.com",
			role: "investor",
			status: "active",
			createdAt: "2024-01-10",
			lastLogin: "2024-01-19"
		},
		{
			id: 3,
			name: "Mike Johnson",
			email: "mike.johnson@example.com",
			role: "support",
			status: "inactive",
			createdAt: "2024-01-05",
			lastLogin: "2024-01-18"
		},
		{
			id: 4,
			name: "Sarah Wilson",
			email: "sarah.wilson@example.com",
			role: "investor",
			status: "active",
			createdAt: "2024-01-08",
			lastLogin: "2024-01-21"
		},
		{
			id: 5,
			name: "David Brown",
			email: "david.brown@example.com",
			role: "founder",
			status: "active",
			createdAt: "2024-01-12",
			lastLogin: "2024-01-19"
		}
	];

	// User statistics
	const userStats = {
		totalUsers: users.length,
		activeUsers: users.filter(u => u.status === "active").length,
		founders: users.filter(u => u.role === "founder").length,
		investors: users.filter(u => u.role === "investor").length,
		support: users.filter(u => u.role === "support").length,
		newThisWeek: 3
	};

	return {
		users,
		userStats
	};
};
