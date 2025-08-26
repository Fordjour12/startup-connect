import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock API management data
	// In a real application, these would be fetched from the database

	const apiMetrics = {
		totalRequests: 15420,
		avgResponseTime: 245,
		errorRate: 0.8,
		uptime: 99.9,
		requestsPerSecond: 17.8,
		topEndpoints: [
			{ path: "/api/auth/login", requests: 3240, avgTime: 180, errors: 12 },
			{ path: "/api/users/profile", requests: 2850, avgTime: 220, errors: 8 },
			{ path: "/api/startups/search", requests: 1920, avgTime: 340, errors: 25 },
			{ path: "/api/investments/create", requests: 1680, avgTime: 290, errors: 15 },
			{ path: "/api/admin/users", requests: 890, avgTime: 420, errors: 5 }
		]
	};

	const endpoints = [
		{
			id: 1,
			path: "/api/auth/*",
			method: "ALL",
			requests: 3240,
			avgResponseTime: 180,
			errorRate: 0.4,
			rateLimit: 1000,
			status: "active",
			lastRequest: "2024-01-20T14:32:15Z"
		},
		{
			id: 2,
			path: "/api/users/*",
			method: "ALL",
			requests: 2850,
			avgResponseTime: 220,
			errorRate: 0.3,
			rateLimit: 500,
			status: "active",
			lastRequest: "2024-01-20T14:31:42Z"
		},
		{
			id: 3,
			path: "/api/startups/*",
			method: "GET",
			requests: 1920,
			avgResponseTime: 340,
			errorRate: 1.3,
			rateLimit: 300,
			status: "warning",
			lastRequest: "2024-01-20T14:30:18Z"
		},
		{
			id: 4,
			path: "/api/investments/*",
			method: "ALL",
			requests: 1680,
			avgResponseTime: 290,
			errorRate: 0.9,
			rateLimit: 200,
			status: "active",
			lastRequest: "2024-01-20T14:29:33Z"
		},
		{
			id: 5,
			path: "/api/admin/*",
			method: "ALL",
			requests: 890,
			avgResponseTime: 420,
			errorRate: 0.6,
			rateLimit: 100,
			status: "active",
			lastRequest: "2024-01-20T14:28:55Z"
		}
	];

	const apiKeys = [
		{
			id: 1,
			name: "Production API Key",
			key: "sk_prod_4f3d2c1b9a8e7f6d5c4b3a2918075f4e3d2c1b9a",
			created: "2024-01-15",
			lastUsed: "2024-01-20T14:32:15Z",
			requests: 12450,
			rateLimit: 1000,
			status: "active",
			permissions: ["read", "write", "admin"]
		},
		{
			id: 2,
			name: "Mobile App Key",
			key: "sk_mob_9a8e7f6d5c4b3a2918075f4e3d2c1b9a8e7f6d5c",
			created: "2024-01-10",
			lastUsed: "2024-01-20T14:30:22Z",
			requests: 8900,
			rateLimit: 500,
			status: "active",
			permissions: ["read", "write"]
		},
		{
			id: 3,
			name: "Read-only Analytics",
			key: "sk_ana_5c4b3a2918075f4e3d2c1b9a8e7f6d5c4b3a2918",
			created: "2024-01-08",
			lastUsed: "2024-01-20T14:15:33Z",
			requests: 3450,
			rateLimit: 100,
			status: "inactive",
			permissions: ["read"]
		}
	];

	const rateLimits = [
		{
			id: 1,
			name: "Global API Limit",
			limit: 10000,
			window: "hour",
			current: 2450,
			status: "normal"
		},
		{
			id: 2,
			name: "Auth Endpoints",
			limit: 1000,
			window: "minute",
			current: 45,
			status: "normal"
		},
		{
			id: 3,
			name: "Admin Endpoints",
			limit: 100,
			window: "minute",
			current: 12,
			status: "normal"
		}
	];

	const alerts = [
		{
			id: 1,
			type: "error_rate",
			severity: "warning",
			message: "Error rate for /api/startups/search exceeded 1%",
			endpoint: "/api/startups/search",
			timestamp: "2024-01-20T13:45:22Z",
			resolved: false
		},
		{
			id: 2,
			type: "rate_limit",
			severity: "info",
			message: "Rate limit threshold reached for /api/auth/login",
			endpoint: "/api/auth/login",
			timestamp: "2024-01-20T12:30:15Z",
			resolved: true
		}
	];

	return {
		apiMetrics,
		endpoints,
		apiKeys,
		rateLimits,
		alerts
	};
};
