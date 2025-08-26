import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock data for data export page
	// In a real application, these would be fetched from the database

	const exportHistory = [
		{
			id: 1,
			name: "User Export - Active Users",
			dataType: "users",
			format: "csv",
			records: 2450,
			size: "2.3 MB",
			status: "completed",
			createdAt: "2024-01-20T14:30:22Z",
			downloadUrl: "/api/admin/export/download/1",
			filters: { status: "active", dateRange: "30d" },
			fields: ["id", "name", "email", "role", "status", "createdAt", "lastLogin"]
		},
		{
			id: 2,
			name: "Startup Analytics Report",
			dataType: "startups",
			format: "excel",
			records: 890,
			size: "1.8 MB",
			status: "completed",
			createdAt: "2024-01-20T12:15:33Z",
			downloadUrl: "/api/admin/export/download/2",
			filters: { status: "approved", category: "Technology" },
			fields: ["id", "name", "founder", "status", "funding", "category", "createdAt"]
		},
		{
			id: 3,
			name: "Investment Performance",
			dataType: "investments",
			format: "json",
			records: 1200,
			size: "856 KB",
			status: "processing",
			createdAt: "2024-01-20T10:45:18Z",
			downloadUrl: null,
			filters: { status: "completed", minAmount: 5000 },
			fields: ["id", "startupName", "investorName", "amount", "status", "createdAt"]
		},
		{
			id: 4,
			name: "Weekly User Activity",
			dataType: "users",
			format: "csv",
			records: 1800,
			size: "1.2 MB",
			status: "completed",
			createdAt: "2024-01-19T09:20:15Z",
			downloadUrl: "/api/admin/export/download/4",
			filters: { lastLogin: "7d", role: "investor" },
			fields: ["id", "name", "email", "lastLogin", "role", "status"]
		}
	];

	const exportTemplates = [
		{
			id: 1,
			name: "User Overview",
			description: "Basic user information with roles and status",
			dataType: "users",
			fields: ["id", "name", "email", "role", "status", "createdAt", "lastLogin"],
			format: "csv",
			filters: { status: "active" },
			createdBy: "admin",
			usageCount: 15,
			createdAt: "2024-01-15T10:30:00Z",
			lastUsed: "2024-01-20T14:30:22Z"
		},
		{
			id: 2,
			name: "Startup Details",
			description: "Complete startup information with funding data",
			dataType: "startups",
			fields: ["id", "name", "founder", "status", "funding", "category", "createdAt"],
			format: "excel",
			filters: { status: "approved" },
			createdBy: "admin",
			usageCount: 8,
			createdAt: "2024-01-12T14:20:00Z",
			lastUsed: "2024-01-19T16:45:30Z"
		},
		{
			id: 3,
			name: "Investment Report",
			description: "Investment transactions with analytics",
			dataType: "investments",
			fields: ["id", "startupName", "investorName", "amount", "status", "createdAt"],
			format: "json",
			filters: { status: "completed" },
			createdBy: "admin",
			usageCount: 12,
			createdAt: "2024-01-10T11:15:00Z",
			lastUsed: "2024-01-20T10:45:18Z"
		},
		{
			id: 4,
			name: "Compliance Audit",
			description: "User data for compliance and audit purposes",
			dataType: "users",
			fields: ["id", "name", "email", "createdAt", "lastLogin", "verified"],
			format: "csv",
			filters: { verified: true },
			createdBy: "compliance",
			usageCount: 3,
			createdAt: "2024-01-08T09:00:00Z",
			lastUsed: "2024-01-18T13:20:45Z"
		}
	];

	const dataStats = {
		users: { total: 3240, lastUpdated: "2024-01-20T14:32:15Z" },
		startups: { total: 890, lastUpdated: "2024-01-20T14:30:45Z" },
		investments: { total: 1200, lastUpdated: "2024-01-20T14:28:30Z" },
		documents: { total: 2450, lastUpdated: "2024-01-20T14:25:15Z" }
	};

	return {
		exportHistory,
		exportTemplates,
		dataStats
	};
};
