import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Simulate notifications data API call
	// In a real application, this would fetch from a database or API

	const notifications = [
		{
			id: 1,
			type: "startup_update",
			title: "TechFlow AI released new product",
			company: "TechFlow AI",
			description: "TechFlow AI has launched their new AI-powered analytics platform, reaching a major milestone in their roadmap.",
			timestamp: "2023-11-02T09:23:45Z",
			read: false,
			priority: "high",
			actionRequired: true,
			actionText: "Review Update",
			actionUrl: "/dashboard/investor/startups/techflow-ai",
			image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 2,
			type: "funding_opportunity",
			title: "EcoSolutions opening Series A round",
			company: "EcoSolutions",
			description: "EcoSolutions is opening their Series A funding round. You previously expressed interest in their green technology solutions.",
			timestamp: "2023-11-01T14:35:20Z",
			read: true,
			priority: "high",
			actionRequired: true,
			actionText: "View Details",
			actionUrl: "/dashboard/investor/pipeline/ecosolutions",
			image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 3,
			type: "market_insight",
			title: "AI Sector Funding Report Available",
			description: "The Q3 AI Sector Funding Report is now available. Contains valuable insights on current market trends and opportunities.",
			timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
			read: false,
			priority: "medium",
			actionRequired: false,
			actionText: "Read Report",
			actionUrl: "/dashboard/investor/reports/ai-q3"
		},
		{
			id: 4,
			type: "meeting_reminder",
			title: "Upcoming pitch meeting: MediTech Solutions",
			company: "MediTech Solutions",
			description: "Reminder for your scheduled pitch meeting with MediTech Solutions tomorrow at 2:00 PM.",
			timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
			read: true,
			priority: "medium",
			actionRequired: false,
			actionText: "View Calendar",
			actionUrl: "/dashboard/investor/calendar",
			image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 5,
			type: "portfolio_update",
			title: "FinLeap reached $2M ARR",
			company: "FinLeap",
			description: "Your portfolio company FinLeap has reached $2M in Annual Recurring Revenue, a 40% increase from last quarter.",
			timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
			read: false,
			priority: "high",
			actionRequired: false,
			actionText: "View Portfolio",
			actionUrl: "/dashboard/investor/portfolio",
			image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 6,
			type: "document_share",
			title: "New pitch deck from ArtificialMinds",
			company: "ArtificialMinds",
			description: "ArtificialMinds has shared their updated pitch deck with you for review.",
			timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
			read: true,
			priority: "medium",
			actionRequired: true,
			actionText: "View Document",
			actionUrl: "/dashboard/investor/documents/artificialminds",
			image: "https://images.unsplash.com/photo-1581094794329-c8112a89f47f?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 7,
			type: "industry_news",
			title: "Major acquisition in HealthTech space",
			description: "Breaking news: BigHealth has acquired StartupX for $500M, signaling increased M&A activity in the HealthTech sector.",
			timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
			read: false,
			priority: "low",
			actionRequired: false,
			actionText: "Read More",
			actionUrl: "/dashboard/investor/news/health-acquisition"
		},
		{
			id: 8,
			type: "portfolio_update",
			title: "CloudSecure featured in TechCrunch",
			company: "CloudSecure",
			description: "Your portfolio company CloudSecure was featured in a TechCrunch article highlighting emerging cybersecurity solutions.",
			timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
			read: true,
			priority: "low",
			actionRequired: false,
			actionText: "Read Article",
			actionUrl: "/dashboard/investor/news/cloudsecure-feature",
			image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 9,
			type: "funding_opportunity",
			title: "GreenEnergy seeking seed investment",
			company: "GreenEnergy",
			description: "GreenEnergy is looking for seed investors for their renewable energy storage solution. Matches your investment criteria.",
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
			read: false,
			priority: "medium",
			actionRequired: true,
			actionText: "Explore Opportunity",
			actionUrl: "/dashboard/investor/pipeline/greenenergy",
			image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 10,
			type: "system_notification",
			title: "Profile information updated",
			description: "Your investor profile information has been updated successfully.",
			timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
			read: true,
			priority: "low",
			actionRequired: false,
			actionText: "View Profile",
			actionUrl: "/dashboard/investor/settings/profile"
		},
		{
			id: 11,
			type: "startup_update",
			title: "DataMesh expanding to European market",
			company: "DataMesh",
			description: "DataMesh has announced their expansion to the European market, opening a new office in Berlin.",
			timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
			read: false,
			priority: "medium",
			actionRequired: false,
			actionText: "View Details",
			actionUrl: "/dashboard/investor/startups/datamesh",
			image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 12,
			type: "meeting_reminder",
			title: "Quarterly portfolio review meeting",
			description: "Reminder for the upcoming quarterly portfolio review meeting with your team.",
			timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
			read: true,
			priority: "high",
			actionRequired: true,
			actionText: "Prepare Report",
			actionUrl: "/dashboard/investor/reports/generate"
		},
		{
			id: 13,
			type: "personal_message",
			title: "Message from Sarah Chen, CEO of TechFlow AI",
			company: "TechFlow AI",
			description: "Thanks for your continued support! I'd love to discuss our upcoming expansion plans with you next week if you're available.",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
			read: false,
			priority: "high",
			actionRequired: true,
			actionText: "Reply",
			actionUrl: "/dashboard/investor/messages/techflow-ai",
			image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 14,
			type: "portfolio_milestone",
			title: "MediTech Solutions crossed 10k users",
			company: "MediTech Solutions",
			description: "Your portfolio company MediTech Solutions has crossed 10,000 active users, growing 85% since your investment.",
			timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
			read: false,
			priority: "medium",
			actionRequired: false,
			actionText: "View Metrics",
			actionUrl: "/dashboard/investor/portfolio/meditech-metrics",
			image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 15,
			type: "co_investment",
			title: "Co-investment opportunity with Sequoia",
			description: "Sequoia Capital is leading a round for Quantum Computing Inc. and has invited you to co-invest based on your previous interest in deep tech.",
			timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 75 minutes ago
			read: false,
			priority: "high",
			actionRequired: true,
			actionText: "Review Opportunity",
			actionUrl: "/dashboard/investor/pipeline/quantum-computing",
			image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100&h=100&auto=format&fit=crop"
		},
		{
			id: 16,
			type: "due_diligence",
			title: "Due diligence completed for NanoMed",
			company: "NanoMed",
			description: "The due diligence process for NanoMed has been completed. All reports are ready for your review.",
			timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
			read: false,
			priority: "high",
			actionRequired: true,
			actionText: "View Reports",
			actionUrl: "/dashboard/investor/due-diligence/nanomed",
			image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=100&h=100&auto=format&fit=crop"
		}
	];

	// Get notification stats
	const stats = {
		total: notifications.length,
		unread: notifications.filter(n => !n.read).length,
		highPriority: notifications.filter(n => n.priority === "high").length,
		actionRequired: notifications.filter(n => n.actionRequired).length,
		todayCount: notifications.filter(n => {
			const notifDate = new Date(n.timestamp);
			const today = new Date();
			return notifDate.getDate() === today.getDate() &&
				notifDate.getMonth() === today.getMonth() &&
				notifDate.getFullYear() === today.getFullYear();
		}).length
	};

	// Get notification types for filtering
	const notificationTypes = [...new Set(notifications.map(n => n.type))].map(type => ({
		value: type,
		label: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	}));

	return {
		notifications,
		stats,
		notificationTypes
	};
}; 