import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock admin dashboard data
	// In a real application, these would be API calls to your backend

	// Fetch system overview stats
	const systemStats = {
		totalUsers: 1247,
		activeUsers: 892,
		totalStartups: 156,
		pendingApprovals: 23,
		totalInvestments: 89,
		systemAlerts: 3
	};

	// Fetch recent platform activity
	const recentActivities = [
		{
			type: "user",
			message: "New user registered: john.doe@example.com",
			time: "2 minutes ago",
		},
		{
			type: "startup",
			message: "Startup 'TechCorp' submitted for approval",
			time: "15 minutes ago",
		},
		{
			type: "investment",
			message: "Investment of $250k recorded",
			time: "1 hour ago",
		},
		{
			type: "system",
			message: "Database backup completed",
			time: "3 hours ago",
		},
		{
			type: "user",
			message: "User role updated: jane.smith to Investor",
			time: "5 hours ago",
		},
	];

	// Fetch quick action stats
	const quickActionsStats = {
		pendingUsers: 12,
		pendingStartups: 8,
		pendingDocuments: 5,
		activeAlerts: 3
	};

	// Fetch system health metrics
	const systemHealth = {
		serverUptime: "99.8%",
		responseTime: "245ms",
		databasePerformance: "Excellent",
		userSatisfaction: "4.7/5"
	};

	return {
		systemStats,
		recentActivities,
		quickActionsStats,
		systemHealth
	};
};
