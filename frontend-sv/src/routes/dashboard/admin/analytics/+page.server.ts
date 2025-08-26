import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock analytics data
	// In a real application, these would be API calls to your backend

	const metrics = {
		totalUsers: 1247,
		activeUsers: 892,
		totalStartups: 156,
		totalInvestments: 89,
		totalInvestmentValue: 12450000,
		monthlyGrowth: 12.5,
		userRetention: 78.3,
		conversionRate: 15.7
	};

	const monthlyData = [
		{ month: "Jan", users: 1200, startups: 140, investments: 75 },
		{ month: "Feb", users: 1180, startups: 142, investments: 78 },
		{ month: "Mar", users: 1220, startups: 145, investments: 82 },
		{ month: "Apr", users: 1190, startups: 148, investments: 79 },
		{ month: "May", users: 1210, startups: 152, investments: 84 },
		{ month: "Jun", users: 1247, startups: 156, investments: 89 }
	];

	const topStartups = [
		{ name: "TechCorp", investments: 2500000, investors: 15 },
		{ name: "GreenEnergy", investments: 1800000, investors: 12 },
		{ name: "FinTech Solutions", investments: 3200000, investors: 18 },
		{ name: "HealthTech", investments: 1500000, investors: 10 },
		{ name: "AI Startup", investments: 2800000, investors: 16 }
	];

	const userActivity = [
		{ hour: "00:00", active: 45 },
		{ hour: "04:00", active: 23 },
		{ hour: "08:00", active: 234 },
		{ hour: "12:00", active: 456 },
		{ hour: "16:00", active: 567 },
		{ hour: "20:00", active: 345 }
	];

	const platformHealth = {
		serverUptime: "99.8%",
		responseTime: "245ms",
		databasePerformance: "Excellent",
		userSatisfaction: "4.7/5"
	};

	return {
		metrics,
		monthlyData,
		topStartups,
		userActivity,
		platformHealth
	};
};
