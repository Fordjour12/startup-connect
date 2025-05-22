import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { founderNotifications, type FounderNotificationType } from '$lib/data/founder-notifications'; // Assuming this exists

// Define interfaces for founder settings
export interface FounderProfileSettings {
	fullName: string;
	role: string;
	companyName: string;
	companyWebsite: string;
	companyIndustry: string;
	companyStage: string; // e.g., Idea, MVP, Seed, Series A
	profilePictureUrl?: string;
}

export interface FounderAccountSettings {
	email: string;
	// Password fields are not typically loaded, but handled via actions
	twoFactorEnabled: boolean;
}

export interface FounderNotificationSetting {
	type: FounderNotificationType;
	inApp: boolean;
	email: boolean;
	description: string; // To explain what the notification is for
}

export interface FounderAppearanceSettings {
	theme: 'light' | 'dark' | 'system';
	accentColor: string; // Hex code
	dashboardLayout: 'compact' | 'comfortable';
}

export interface FounderIntegrationSetting {
	name: string;
	connected: boolean;
	icon: string; // Placeholder for an icon or logo
	description: string;
}

export interface FounderSettingsData {
	profile: FounderProfileSettings;
	account: FounderAccountSettings;
	notificationPreferences: FounderNotificationSetting[];
	appearance: FounderAppearanceSettings;
	integrations: FounderIntegrationSetting[];
}

// Mock data - in a real app, this would come from a database
let founderSettings: FounderSettingsData = {
	profile: {
		fullName: 'Alex Founder',
		role: 'CEO & Co-founder',
		companyName: 'Innovatech Solutions Inc.',
		companyWebsite: 'https://innovatech.example.com',
		companyIndustry: 'AI & Machine Learning',
		companyStage: 'Seed',
		profilePictureUrl: '/avatars/founder-alex.jpg' // Placeholder image
	},
	account: {
		email: 'alex.founder@innovatech.example.com',
		twoFactorEnabled: true
	},
	notificationPreferences: [
		{ type: 'funding_opportunity', inApp: true, email: true, description: 'New potential investors or funding rounds.' },
		{ type: 'investor_update', inApp: true, email: false, description: 'Reminders or updates related to investor communications.' },
		{ type: 'customer_feedback', inApp: true, email: true, description: 'Important feedback or reviews from customers.' },
		{ type: 'team_update', inApp: true, email: false, description: 'Key updates from your team members.' },
		{ type: 'milestone_achieved', inApp: true, email: true, description: 'Notifications when significant company milestones are met.' },
		{ type: 'metric_alert', inApp: true, email: true, description: 'Alerts for critical changes in key business metrics.' },
		{ type: 'document_shared', inApp: false, email: true, description: 'When new documents are shared with you.' },
		{ type: 'meeting_scheduled', inApp: true, email: true, description: 'Confirmations and reminders for scheduled meetings.' },
		{ type: 'task_assigned', inApp: true, email: true, description: 'When a new task is assigned to you.' },
		{ type: 'task_completed', inApp: false, email: false, description: 'When a task assigned by you is completed.' },
		{ type: 'feature_request', inApp: true, email: true, description: 'New feature requests from users or stakeholders.' }
	],
	appearance: {
		theme: 'system',
		accentColor: '#3b82f6', // Default blue
		dashboardLayout: 'comfortable'
	},
	integrations: [
		{ name: 'Slack', connected: true, icon: 'slack-logo.svg', description: 'Receive key notifications in your Slack workspace.' },
		{ name: 'Google Calendar', connected: false, icon: 'google-calendar-logo.svg', description: 'Sync meetings and deadlines.' },
		{ name: 'GitHub', connected: true, icon: 'github-logo.svg', description: 'Track repository activity and issues.' },
		{ name: 'Stripe', connected: false, icon: 'stripe-logo.svg', description: 'Monitor revenue and subscription metrics.' }
	]
};

export const load: PageServerLoad = async ({ cookies }) => {
	// In a real app, fetch user-specific settings
	// For now, return the mock data
	// Potentially load theme from cookies if saved there
	const theme = cookies.get('theme') || founderSettings.appearance.theme;
	return {
		settings: JSON.parse(JSON.stringify({ ...founderSettings, appearance: { ...founderSettings.appearance, theme } })),
		seo: {
			title: 'Founder Settings',
			description: 'Manage your profile, account, and notification preferences.'
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData();
		const fullName = data.get('fullName') as string;
		const role = data.get('role') as string;
		const companyName = data.get('companyName') as string;
		const companyWebsite = data.get('companyWebsite') as string;
		const companyIndustry = data.get('companyIndustry') as string;
		const companyStage = data.get('companyStage') as string;

		if (!fullName || !role || !companyName) {
			return fail(400, { error: 'Full name, role, and company name are required.', data: founderSettings.profile });
		}

		// Update mock data (in real app, update database)
		founderSettings.profile = {
			...founderSettings.profile,
			fullName,
			role,
			companyName,
			companyWebsite,
			companyIndustry,
			companyStage
		};

		return { success: true, message: 'Profile updated successfully.' };
	},

	updateAccount: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const twoFactorEnabled = data.get('twoFactorEnabled') === 'on'; // Checkbox value

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'A valid email is required.', data: founderSettings.account });
		}

		// Simulate password change - in a real app, this is more complex
		const currentPassword = data.get('currentPassword') as string;
		const newPassword = data.get('newPassword') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (newPassword && newPassword !== confirmPassword) {
			return fail(400, { error: 'New passwords do not match.', data: founderSettings.account });
		}
		if (newPassword && !currentPassword) {
			return fail(400, { error: 'Current password is required to set a new password.', data: founderSettings.account });
		}
		// "Validate" currentPassword - placeholder
		if (currentPassword && currentPassword !== 'password123') { // Dummy check
			return fail(400, { error: 'Incorrect current password.', data: founderSettings.account });
		}


		founderSettings.account = {
			...founderSettings.account,
			email,
			twoFactorEnabled
		};

		let message = 'Account settings updated.';
		if (newPassword) {
			message = 'Password changed and account settings updated.';
		}

		return { success: true, message };
	},

	updateNotificationPreferences: async ({ request }) => {
		const data = await request.formData();
		const updatedPreferences: FounderNotificationSetting[] = [];

		founderSettings.notificationPreferences.forEach(pref => {
			const inApp = data.get(`${pref.type}-inApp`) === 'on';
			const email = data.get(`${pref.type}-email`) === 'on';
			updatedPreferences.push({ ...pref, inApp, email });
		});

		founderSettings.notificationPreferences = updatedPreferences;
		return { success: true, message: 'Notification preferences updated.' };
	},

	updateAppearance: async ({ request, cookies }) => {
		const data = await request.formData();
		const theme = data.get('theme') as 'light' | 'dark' | 'system';
		const accentColor = data.get('accentColor') as string;
		const dashboardLayout = data.get('dashboardLayout') as 'compact' | 'comfortable';

		founderSettings.appearance = { theme, accentColor, dashboardLayout };

		// Save theme to cookie for persistence across sessions
		cookies.set('theme', theme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 year
			httpOnly: false, // Allow client-side JS to read for initial theme setting
			sameSite: 'lax'
		});

		return { success: true, message: 'Appearance settings updated.' };
	},

	manageIntegration: async ({ request }) => {
		const data = await request.formData();
		const integrationName = data.get('integrationName') as string;
		const connect = data.get('connect') === 'true'; // string 'true' or 'false'

		const integration = founderSettings.integrations.find(int => int.name === integrationName);
		if (integration) {
			integration.connected = connect;
			// In a real app, handle OAuth flow or API key input here
			return { success: true, message: `${integrationName} ${connect ? 'connected' : 'disconnected'}.` };
		}
		return fail(400, { error: 'Integration not found.' });
	},

	exportData: async () => {
		// Simulate data export
		const dataToExport = JSON.stringify(founderSettings, null, 2);
		// In a real app, this would generate a file download
		console.log("Data export requested:", dataToExport);
		return { success: true, message: 'Data export initiated. Check your downloads or email.' };
	},

	deleteAccount: async () => {
		// Simulate account deletion
		console.warn("Account deletion requested for:", founderSettings.account.email);
		// In a real app, this would be a multi-step process with confirmation
		// and actual data removal or anonymization.
		// For now, we can just reset the mock data or parts of it.
		// founderSettings = { ... initial empty state ... };
		return { success: true, message: 'Account deletion process initiated. You will receive a confirmation email.' };
	}
}; 