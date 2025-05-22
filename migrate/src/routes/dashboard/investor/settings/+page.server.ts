import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data

	// Fetch user profile data
	const profile = {
		id: "inv-12345",
		firstName: "Sofia",
		lastName: "Safier",
		email: "sofia.safier@example.com",
		phone: "+1 (555) 123-4567",
		avatar: "/avatars/sofia.png",
		role: "Lead Investor",
		firm: "Horizon Ventures",
		bio: "Experienced investor with focus on early-stage tech startups. Background in fintech and sustainable technologies.",
		location: "San Francisco, CA",
		linkedIn: "linkedin.com/in/sofiasafier",
		twitter: "@sofiasafier",
		timeZone: "America/Los_Angeles",
		dateJoined: "2021-05-12",
		investmentFocus: ["AI/ML", "Fintech", "Sustainability", "SaaS"],
		preferredStages: ["Seed", "Series A"],
		typicalCheckSize: "$50K - $250K",
		portfolioSize: 14,
		verifications: {
			emailVerified: true,
			phoneVerified: true,
			identityVerified: true,
			twoFactorEnabled: true
		}
	};

	// Notification preferences
	const notificationPreferences = {
		email: {
			dailyDigest: true,
			weeklyPortfolioSummary: true,
			newInvestmentOpportunities: true,
			portfolioCompanyUpdates: true,
			fundingRoundAlerts: true,
			marketInsights: false,
			eventReminders: true,
			messageNotifications: false
		},
		inApp: {
			opportunityAlerts: true,
			dueDiligenceReminders: true,
			documentRequests: true,
			portfolioMetricAlerts: true,
			teamMessages: true,
			eventNotifications: true,
			systemUpdates: false
		},
		pushNotifications: {
			enabled: true,
			importantAlertsOnly: true
		}
	};

	// Security settings
	const securitySettings = {
		lastPasswordChange: "2023-09-15",
		loginHistory: [
			{ date: "2023-10-18", time: "09:23 AM", ip: "192.168.1.1", device: "Chrome / macOS", location: "San Francisco, CA" },
			{ date: "2023-10-16", time: "02:45 PM", ip: "192.168.1.1", device: "Mobile App / iOS", location: "San Francisco, CA" },
			{ date: "2023-10-15", time: "10:12 AM", ip: "192.168.1.1", device: "Chrome / macOS", location: "San Francisco, CA" }
		],
		activeSessions: [
			{ id: "sess-1234", device: "Chrome / macOS", lastActive: "2023-10-18T09:23:00", location: "San Francisco, CA" }
		],
		twoFactorMethod: "Authenticator App"
	};

	// Privacy settings
	const privacySettings = {
		profileVisibility: "verified_only", // Options: public, network_only, verified_only, private
		showOnInvestorDirectory: true,
		shareInvestmentHistory: "anonymous", // Options: detailed, anonymous, none
		allowDataAnalytics: true,
		dataRetentionPeriod: "3_years" // Options: 1_year, 3_years, 5_years, indefinite
	};

	// Appearance settings
	const appearanceSettings = {
		theme: "system", // Options: light, dark, system
		layout: "default", // Options: default, compact, comfortable
		dashboardLayout: "standard", // Options: standard, compact, detailed
		defaultView: "portfolio", // Which page to show by default
		cardDensity: "comfortable", // Options: comfortable, compact
		showKPI: true,
		sidebarCollapsed: false,
		compactCards: false,
		chartStyle: "modern", // Options: modern, classic, minimal
		dataAnimations: true,
		reducedMotion: false,
		accentColor: "blue",
		availableAccents: [
			{ name: "Blue", value: "blue", preview: "#3b82f6" },
			{ name: "Teal", value: "teal", preview: "#14b8a6" },
			{ name: "Green", value: "green", preview: "#22c55e" },
			{ name: "Purple", value: "purple", preview: "#a855f7" },
			{ name: "Rose", value: "rose", preview: "#f43f5e" },
			{ name: "Orange", value: "orange", preview: "#f97316" },
			{ name: "Slate", value: "slate", preview: "#64748b" },
			{ name: "Gray", value: "gray", preview: "#71717a" }
		],
		chartPreferences: {
			preferredChartType: "line",
			showTooltips: true,
			colorScheme: "default"
		}
	};

	// API access
	const apiAccess = {
		enabled: true,
		apiKey: "api_sk_a1b2c3d4e5f6g7h8i9j0",
		keyVisible: false,
		keyCreatedAt: "2023-08-12",
		permissions: {
			readPortfolio: true,
			writePortfolio: false,
			readPipeline: true,
			writePipeline: false,
			readCalendar: true,
			writeCalendar: false
		},
		usage: {
			requestsThisMonth: 1254,
			monthlyLimit: 5000,
			resetDate: "2023-11-01",
			recentActivity: [
				{ endpoint: "/api/portfolio", method: "GET", timestamp: "2023-10-18 09:45 AM" },
				{ endpoint: "/api/pipeline", method: "GET", timestamp: "2023-10-18 09:42 AM" },
				{ endpoint: "/api/calendar", method: "GET", timestamp: "2023-10-17 04:30 PM" }
			]
		},
		apiKeys: [
			{
				id: "key-7890",
				name: "Dashboard Integration",
				created: "2023-08-12",
				lastUsed: "2023-10-17",
				permissions: ["read_portfolio", "read_pipeline"]
			}
		]
	};

	// Integration settings
	const integrations = {
		connectedServices: [
			{ id: "int-1", name: "Google Calendar", status: "connected", lastSync: "2023-10-18", icon: "/icons/google-calendar.svg", connectedSince: "2023-05-12" },
			{ id: "int-2", name: "Slack", status: "connected", lastSync: "2023-10-17", icon: "/icons/slack.svg", connectedSince: "2023-06-20" },
			{ id: "int-3", name: "Microsoft 365", status: "disconnected", lastSync: "2023-09-05", icon: "/icons/microsoft.svg", connectedSince: "" }
		],
		dataExports: {
			lastExport: "2023-10-10",
			scheduledExports: [
				{ frequency: "monthly", format: "csv", destination: "email" }
			]
		},
		availableIntegrations: [
			{ id: "av-int-1", name: "Google Drive", category: "Storage", icon: "/icons/gdrive.svg", description: "Connect your Google Drive to store and access documents" },
			{ id: "av-int-2", name: "QuickBooks", category: "Accounting", icon: "/icons/quickbooks.svg", description: "Integrate with QuickBooks for financial tracking" },
			{ id: "av-int-3", name: "Salesforce", category: "CRM", icon: "/icons/salesforce.svg", description: "Sync your pipeline with Salesforce CRM" },
			{ id: "av-int-4", name: "Outlook", category: "Calendar", icon: "/icons/outlook.svg", description: "Connect your Outlook calendar for meeting management" }
		],
		syncSettings: {
			autoSync: true,
			frequency: "daily",
			lastSync: "2023-10-18 02:30 PM"
		}
	};

	return {
		profile,
		notificationPreferences,
		securitySettings,
		privacySettings,
		appearanceSettings,
		apiAccess,
		integrations
	};
}; 