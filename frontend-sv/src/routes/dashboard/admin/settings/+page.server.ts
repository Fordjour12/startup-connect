import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock settings data
	// In a real application, these would be API calls to your backend

	const platformSettings = {
		name: "StartupConnect",
		description: "Connecting startups with investors",
		contactEmail: "admin@startupconnect.com",
		maintenanceMode: false,
		allowRegistrations: true
	};

	const emailSettings = {
		smtpHost: "smtp.gmail.com",
		smtpPort: 587,
		smtpUser: "noreply@startupconnect.com",
		emailTemplates: true,
		notificationEmails: true
	};

	const securitySettings = {
		twoFactorRequired: false,
		sessionTimeout: 30,
		passwordMinLength: 8,
		requireStrongPasswords: true
	};

	const featureFlags = {
		startupApprovals: true,
		investmentTracking: true,
		analyticsDashboard: true,
		messagingSystem: true
	};

	return {
		platformSettings,
		emailSettings,
		securitySettings,
		featureFlags
	};
};
