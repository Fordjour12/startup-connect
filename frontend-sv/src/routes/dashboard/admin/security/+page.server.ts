import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock security data

	const securityAlerts = [
		{
			id: 1,
			type: "failed_login",
			message: "Multiple failed login attempts from IP 192.168.1.100",
			severity: "medium",
			timestamp: "2024-01-20T10:30:00Z",
			resolved: false
		},
		{
			id: 2,
			type: "suspicious_activity",
			message: "Unusual login pattern detected for user john.doe",
			severity: "low",
			timestamp: "2024-01-20T09:15:00Z",
			resolved: true
		},
		{
			id: 3,
			type: "data_access",
			message: "Admin accessed user data without proper authorization",
			severity: "high",
			timestamp: "2024-01-20T08:45:00Z",
			resolved: false
		}
	];

	const auditLogs = [
		{
			id: 1,
			action: "User Login",
			user: "john.doe@example.com",
			timestamp: "2024-01-20T10:30:00Z",
			ipAddress: "192.168.1.100",
			status: "success"
		},
		{
			id: 2,
			action: "User Created",
			user: "admin",
			timestamp: "2024-01-20T10:15:00Z",
			ipAddress: "192.168.1.1",
			status: "success"
		},
		{
			id: 3,
			action: "Settings Updated",
			user: "admin",
			timestamp: "2024-01-20T09:45:00Z",
			ipAddress: "192.168.1.1",
			status: "success"
		},
		{
			id: 4,
			action: "Failed Login",
			user: "unknown",
			timestamp: "2024-01-20T09:30:00Z",
			ipAddress: "10.0.0.50",
			status: "failed"
		}
	];

	const systemHealth = {
		firewall: "active",
		encryption: "enabled",
		backup: "completed",
		monitoring: "online"
	};

	const securityMetrics = {
		successfulLogins: 1247,
		failedLogins: 23,
		successRate: 98.2,
		recordsAccessed: 15423,
		unauthorizedAttempts: 3,
		complianceRate: 99.98,
		highPriority: 1,
		mediumPriority: 2,
		lowPriority: 5
	};

	return {
		securityAlerts,
		auditLogs,
		systemHealth,
		securityMetrics
	};
};
