import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data with mock data

	// Calendar events data
	const events = [
		{
			id: 1,
			title: "Pitch Meeting: TechFlow AI",
			date: "2023-10-25",
			time: "10:00 AM - 11:30 AM",
			location: "Virtual (Zoom)",
			type: "pitch",
			description: "Initial pitch meeting with TechFlow AI team to discuss their machine learning platform",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 2, name: "Lisa Chen", role: "Technical Advisor", avatar: "https://ui-avatars.com/api/?name=LC&background=8B5CF6&color=fff" }
			],
			company: {
				name: "TechFlow AI",
				logo: "https://ui-avatars.com/api/?name=TF&background=6366F1&color=fff"
			},
			status: "confirmed",
			priority: "high"
		},
		{
			id: 2,
			title: "Due Diligence Review: HealthNova",
			date: "2023-10-28",
			time: "2:00 PM - 4:00 PM",
			location: "Conference Room A",
			type: "internal",
			description: "Team meeting to review due diligence findings for HealthNova investment opportunity",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 3, name: "Sarah Johnson", role: "Healthcare Specialist", avatar: "https://ui-avatars.com/api/?name=SJ&background=2DD4BF&color=fff" },
				{ id: 4, name: "Michael Brown", role: "Financial Analyst", avatar: "https://ui-avatars.com/api/?name=MB&background=F43F5E&color=fff" }
			],
			company: {
				name: "HealthNova",
				logo: "https://ui-avatars.com/api/?name=HN&background=2DD4BF&color=fff"
			},
			status: "confirmed",
			priority: "high"
		},
		{
			id: 3,
			title: "Q3 Portfolio Review",
			date: "2023-11-05",
			time: "9:00 AM - 12:00 PM",
			location: "Conference Room B",
			type: "internal",
			description: "Quarterly review of all portfolio companies' performance",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 5, name: "Alex Wong", role: "Portfolio Manager", avatar: "https://ui-avatars.com/api/?name=AW&background=0EA5E9&color=fff" },
				{ id: 4, name: "Michael Brown", role: "Financial Analyst", avatar: "https://ui-avatars.com/api/?name=MB&background=F43F5E&color=fff" },
				{ id: 6, name: "Emily Williams", role: "Operations Director", avatar: "https://ui-avatars.com/api/?name=EW&background=10B981&color=fff" }
			],
			status: "confirmed",
			priority: "medium",
			materials: [
				{ id: 1, name: "Q3 Financial Summary", type: "spreadsheet" },
				{ id: 2, name: "Portfolio Performance Slides", type: "presentation" }
			]
		},
		{
			id: 4,
			title: "Tech Startup Conference",
			date: "2023-11-10",
			time: "All day",
			location: "City Convention Center",
			type: "conference",
			description: "Annual tech startup conference with networking opportunities and startup showcases",
			status: "confirmed",
			priority: "medium",
			notes: "Potential to meet new investment prospects and reconnect with portfolio founders"
		},
		{
			id: 5,
			title: "Follow-up with FinEdge",
			date: "2023-10-29",
			time: "11:00 AM - 12:00 PM",
			location: "Virtual (Google Meet)",
			type: "meeting",
			description: "Follow-up meeting to discuss questions from initial pitch",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 5, name: "Alex Wong", role: "Portfolio Manager", avatar: "https://ui-avatars.com/api/?name=AW&background=0EA5E9&color=fff" }
			],
			company: {
				name: "FinEdge",
				logo: "https://ui-avatars.com/api/?name=FE&background=0EA5E9&color=fff"
			},
			status: "tentative",
			priority: "medium"
		},
		{
			id: 6,
			title: "Investment Committee Meeting",
			date: "2023-11-02",
			time: "3:00 PM - 5:00 PM",
			location: "Board Room",
			type: "committee",
			description: "Discuss and vote on current investment opportunities",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 7, name: "David Lee", role: "Managing Partner", avatar: "https://ui-avatars.com/api/?name=DL&background=FB7185&color=fff" },
				{ id: 6, name: "Emily Williams", role: "Operations Director", avatar: "https://ui-avatars.com/api/?name=EW&background=10B981&color=fff" },
				{ id: 8, name: "Robert Chen", role: "Senior Partner", avatar: "https://ui-avatars.com/api/?name=RC&background=8B5CF6&color=fff" }
			],
			status: "confirmed",
			priority: "high",
			materials: [
				{ id: 3, name: "Investment Proposals", type: "document" },
				{ id: 4, name: "Due Diligence Reports", type: "document" }
			]
		},
		{
			id: 7,
			title: "Founder Check-in: AgriSense",
			date: "2023-11-07",
			time: "1:00 PM - 2:00 PM",
			location: "Virtual (Zoom)",
			type: "check-in",
			description: "Monthly check-in with AgriSense founders to discuss progress and challenges",
			participants: [
				{ id: 6, name: "Emily Williams", role: "Operations Director", avatar: "https://ui-avatars.com/api/?name=EW&background=10B981&color=fff" }
			],
			company: {
				name: "AgriSense",
				logo: "https://ui-avatars.com/api/?name=AS&background=10B981&color=fff"
			},
			status: "confirmed",
			priority: "medium"
		},
		{
			id: 8,
			title: "Limited Partners Meeting",
			date: "2023-11-15",
			time: "2:00 PM - 5:00 PM",
			location: "Grand Hotel Conference Center",
			type: "investor",
			description: "Quarterly meeting with limited partners to review fund performance and strategy",
			participants: [
				{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
				{ id: 7, name: "David Lee", role: "Managing Partner", avatar: "https://ui-avatars.com/api/?name=DL&background=FB7185&color=fff" },
				{ id: 8, name: "Robert Chen", role: "Senior Partner", avatar: "https://ui-avatars.com/api/?name=RC&background=8B5CF6&color=fff" }
			],
			status: "confirmed",
			priority: "high",
			materials: [
				{ id: 5, name: "Quarterly Fund Report", type: "presentation" },
				{ id: 6, name: "Investment Pipeline Overview", type: "document" }
			]
		}
	];

	// Get team members data for the calendar
	const teamMembers = [
		{ id: 1, name: "John Smith", role: "Lead Investor", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
		{ id: 2, name: "Lisa Chen", role: "Technical Advisor", avatar: "https://ui-avatars.com/api/?name=LC&background=8B5CF6&color=fff" },
		{ id: 3, name: "Sarah Johnson", role: "Healthcare Specialist", avatar: "https://ui-avatars.com/api/?name=SJ&background=2DD4BF&color=fff" },
		{ id: 4, name: "Michael Brown", role: "Financial Analyst", avatar: "https://ui-avatars.com/api/?name=MB&background=F43F5E&color=fff" },
		{ id: 5, name: "Alex Wong", role: "Portfolio Manager", avatar: "https://ui-avatars.com/api/?name=AW&background=0EA5E9&color=fff" },
		{ id: 6, name: "Emily Williams", role: "Operations Director", avatar: "https://ui-avatars.com/api/?name=EW&background=10B981&color=fff" },
		{ id: 7, name: "David Lee", role: "Managing Partner", avatar: "https://ui-avatars.com/api/?name=DL&background=FB7185&color=fff" },
		{ id: 8, name: "Robert Chen", role: "Senior Partner", avatar: "https://ui-avatars.com/api/?name=RC&background=8B5CF6&color=fff" }
	];

	// Portfolio companies for scheduling meetings
	const portfolioCompanies = [
		{ id: 1, name: "TechFlow AI", industry: "Enterprise SaaS", logo: "https://ui-avatars.com/api/?name=TF&background=6366F1&color=fff" },
		{ id: 2, name: "HealthNova", industry: "Healthcare", logo: "https://ui-avatars.com/api/?name=HN&background=2DD4BF&color=fff" },
		{ id: 3, name: "EcoLogistics", industry: "Logistics", logo: "https://ui-avatars.com/api/?name=EL&background=4ADE80&color=fff" },
		{ id: 4, name: "FinEdge", industry: "Fintech", logo: "https://ui-avatars.com/api/?name=FE&background=0EA5E9&color=fff" },
		{ id: 5, name: "RetailAI", industry: "Retail Tech", logo: "https://ui-avatars.com/api/?name=RA&background=F43F5E&color=fff" },
		{ id: 6, name: "CloudSecure", industry: "Cybersecurity", logo: "https://ui-avatars.com/api/?name=CS&background=8B5CF6&color=fff" },
		{ id: 7, name: "EduVR", industry: "EdTech", logo: "https://ui-avatars.com/api/?name=EV&background=FB7185&color=fff" },
		{ id: 8, name: "AgriSense", industry: "AgTech", logo: "https://ui-avatars.com/api/?name=AS&background=10B981&color=fff" }
	];

	// Meeting locations
	const meetingLocations = [
		{ id: 1, name: "Conference Room A", type: "internal" },
		{ id: 2, name: "Conference Room B", type: "internal" },
		{ id: 3, name: "Board Room", type: "internal" },
		{ id: 4, name: "Virtual (Zoom)", type: "virtual" },
		{ id: 5, name: "Virtual (Google Meet)", type: "virtual" },
		{ id: 6, name: "Virtual (Microsoft Teams)", type: "virtual" },
		{ id: 7, name: "City Convention Center", type: "external" },
		{ id: 8, name: "Grand Hotel Conference Center", type: "external" }
	];

	// Event categories/types with colors
	const eventCategories = [
		{ id: "pitch", name: "Pitch Meeting", color: "bg-blue-500" },
		{ id: "meeting", name: "Meeting", color: "bg-indigo-500" },
		{ id: "internal", name: "Internal Meeting", color: "bg-purple-500" },
		{ id: "conference", name: "Conference", color: "bg-emerald-500" },
		{ id: "committee", name: "Committee Meeting", color: "bg-amber-500" },
		{ id: "check-in", name: "Founder Check-in", color: "bg-rose-500" },
		{ id: "investor", name: "Investor Meeting", color: "bg-slate-500" }
	];

	return {
		events,
		teamMembers,
		portfolioCompanies,
		meetingLocations,
		eventCategories
	};
}; 