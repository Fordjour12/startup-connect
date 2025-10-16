import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock API monitoring data
	// In a real application, these would be fetched from monitoring systems and databases

	const apiMetrics = {
		totalRequests: 15420,
		requestsPerSecond: 17.8,
		avgResponseTime: 245,
		errorRate: 0.8,
		uptime: 99.9,
		activeConnections: 45,
		peakConcurrentUsers: 234,
		totalBandwidth: 2.3, // GB
		cacheHitRate: 87.5,
		throttlingEvents: 12
	};

	const endpoints = [
		{
			path: "/api/auth/login",
			method: "POST",
			requests: 3240,
			avgResponseTime: 180,
			errorRate: 0.4,
			rateLimit: 1000,
			currentUsage: 245,
			trend: "up",
			status: "healthy",
			lastSpike: "2024-01-20T14:30:00Z"
		},
		{
			path: "/api/users/profile",
			method: "GET",
			requests: 2850,
			avgResponseTime: 220,
			errorRate: 0.3,
			rateLimit: 500,
			currentUsage: 89,
			trend: "stable",
			status: "healthy",
			lastSpike: "2024-01-20T13:15:00Z"
		},
		{
			path: "/api/startups/search",
			method: "GET",
			requests: 1920,
			avgResponseTime: 340,
			errorRate: 1.3,
			rateLimit: 300,
			currentUsage: 156,
			trend: "down",
			status: "warning",
			lastSpike: "2024-01-20T14:45:00Z"
		},
		{
			path: "/api/investments/create",
			method: "POST",
			requests: 1680,
			avgResponseTime: 290,
			errorRate: 0.9,
			rateLimit: 200,
			currentUsage: 45,
			trend: "up",
			status: "healthy",
			lastSpike: "2024-01-20T12:30:00Z"
		},
		{
			path: "/api/admin/*",
			method: "ALL",
			requests: 890,
			avgResponseTime: 420,
			errorRate: 0.6,
			rateLimit: 100,
			currentUsage: 23,
			trend: "stable",
			status: "healthy",
			lastSpike: "2024-01-20T11:00:00Z"
		}
	];

	const rateLimits = [
		{
			id: 1,
			name: "Global API Limit",
			scope: "global",
			limit: 10000,
			window: "hour",
			currentUsage: 2450,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z"
		},
		{
			id: 2,
			name: "Auth Endpoints",
			scope: "endpoint",
			limit: 1000,
			window: "minute",
			currentUsage: 245,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z"
		},
		{
			id: 3,
			name: "User Endpoints",
			scope: "endpoint",
			limit: 500,
			window: "minute",
			currentUsage: 89,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z"
		},
		{
			id: 4,
			name: "Admin Endpoints",
			scope: "endpoint",
			limit: 100,
			window: "minute",
			currentUsage: 23,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z"
		}
	];

	const usagePatterns = [
		{ hour: "00:00", requests: 450, errors: 2 },
		{ hour: "01:00", requests: 320, errors: 1 },
		{ hour: "02:00", requests: 280, errors: 0 },
		{ hour: "03:00", requests: 250, errors: 1 },
		{ hour: "04:00", requests: 290, errors: 0 },
		{ hour: "05:00", requests: 380, errors: 2 },
		{ hour: "06:00", requests: 520, errors: 3 },
		{ hour: "07:00", requests: 780, errors: 5 },
		{ hour: "08:00", requests: 1200, errors: 8 },
		{ hour: "09:00", requests: 1450, errors: 12 },
		{ hour: "10:00", requests: 1680, errors: 15 },
		{ hour: "11:00", requests: 1820, errors: 18 },
		{ hour: "12:00", requests: 2100, errors: 22 },
		{ hour: "13:00", requests: 1950, errors: 20 },
		{ hour: "14:00", requests: 1780, errors: 16 },
		{ hour: "15:00", requests: 1650, errors: 14 },
		{ hour: "16:00", requests: 1520, errors: 12 },
		{ hour: "17:00", requests: 1380, errors: 10 },
		{ hour: "18:00", requests: 1200, errors: 8 },
		{ hour: "19:00", requests: 950, errors: 6 },
		{ hour: "20:00", requests: 720, errors: 4 },
		{ hour: "21:00", requests: 580, errors: 3 },
		{ hour: "22:00", requests: 480, errors: 2 },
		{ hour: "23:00", requests: 420, errors: 1 }
	];

	const alerts = [
		{
			id: 1,
			type: "rate_limit",
			severity: "warning",
			message: "Rate limit threshold exceeded on /api/auth/login",
			endpoint: "/api/auth/login",
			threshold: 80,
			currentValue: 87,
			timestamp: "2024-01-20T14:45:22Z",
			resolved: false
		},
		{
			id: 2,
			type: "error_rate",
			severity: "error",
			message: "Error rate spike detected on /api/startups/search",
			endpoint: "/api/startups/search",
			threshold: 1.0,
			currentValue: 1.3,
			timestamp: "2024-01-20T14:30:15Z",
			resolved: false
		},
		{
			id: 3,
			type: "response_time",
			severity: "info",
			message: "Response time increased on /api/admin/users",
			endpoint: "/api/admin/users",
			threshold: 400,
			currentValue: 420,
			timestamp: "2024-01-20T14:15:33Z",
			resolved: true
		}
	];

	return {
		apiMetrics,
		endpoints,
		rateLimits,
		usagePatterns,
		alerts
	};
};
