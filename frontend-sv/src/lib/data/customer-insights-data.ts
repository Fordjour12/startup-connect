// Mock data for Customer & Market Insights dashboard section
export const customerInsightsData = {
	nps: {
		score: 42,
		trend: 8,
		responses: 245,
		history: [18, 22, 25, 30, 34, 42],
	},
	csat: {
		score: 87,
		trend: 3,
		responses: 312,
	},
	featureRequests: {
		total: 48,
		new: 7,
		topRequests: [
			{
				id: "FR-108",
				feature: "API Integration with Salesforce",
				votes: 38,
				status: "in-progress" as "in-progress" | "planned" | "requested" | "completed",
			},
			{
				id: "FR-112",
				feature: "Advanced Analytics Dashboard",
				votes: 24,
				status: "planned" as "in-progress" | "planned" | "requested" | "completed",
			},
			{
				id: "FR-115",
				feature: "Mobile App Support",
				votes: 19,
				status: "requested" as "in-progress" | "planned" | "requested" | "completed",
			},
			{
				id: "FR-101",
				feature: "Dark Mode",
				votes: 15,
				status: "completed" as "in-progress" | "planned" | "requested" | "completed",
			},
		],
	},
	interviews: {
		scheduled: 5,
		completed: 12,
		upcoming: [
			{
				customer: "Enterprise Solutions Inc.",
				date: "Nov 3, 2023",
				time: "2:00 PM",
			},
			{
				customer: "TechStart Labs",
				date: "Nov 8, 2023",
				time: "11:30 AM",
			},
			{
				customer: "Global Innovations",
				date: "Nov 10, 2023",
				time: "3:15 PM",
			},
		],
	},
	marketNews: [
		{
			id: "N-001",
			title: "New AI Regulations Impact SaaS Startups",
			source: "Tech Insider",
			date: "2023-10-28",
			relevance: 4,
			url: "#",
		},
		{
			id: "N-002",
			title: "Venture Capital Funding Increases for B2B SaaS in Q3",
			source: "Startup Journal",
			date: "2023-10-22",
			relevance: 5,
			url: "#",
		},
		{
			id: "N-003",
			title: "Remote Work Tools See 30% Growth YoY",
			source: "Business Tech",
			date: "2023-10-15",
			relevance: 3,
			url: "#",
		},
		{
			id: "N-004",
			title: "Cloud Services Market Expected to Double by 2025",
			source: "Market Watch",
			date: "2023-10-05",
			relevance: 4,
			url: "#",
		},
	],
	competitorUpdates: [
		{
			competitor: "CompeteX",
			update: "Launched new enterprise pricing tier with advanced features",
			date: "2023-10-24",
			impact: "negative" as "positive" | "neutral" | "negative",
		},
		{
			competitor: "TechRival",
			update: "Experiencing downtime issues affecting customer trust",
			date: "2023-10-18",
			impact: "positive" as "positive" | "neutral" | "negative",
		},
		{
			competitor: "SaaSLeader",
			update: "Acquired smaller competitor for market expansion",
			date: "2023-10-12",
			impact: "neutral" as "positive" | "neutral" | "negative",
		},
		{
			competitor: "Innovate Solutions",
			update: "Released API with similar functionality to our roadmap",
			date: "2023-10-03",
			impact: "negative" as "positive" | "neutral" | "negative",
		},
	],
	marketSize: {
		tam: 42000000, // $42M
		sam: 18000000, // $18M
		som: 3800000,  // $3.8M
	},
	trends: [
		{
			name: "AI-Powered Analytics",
			description: "Growing adoption of artificial intelligence for business intelligence and analytics applications.",
			relevance: 5,
			growth: 32,
		},
		{
			name: "No-Code Development",
			description: "Rising popularity of platforms enabling non-technical users to build applications without coding.",
			relevance: 3,
			growth: 45,
		},
		{
			name: "Cybersecurity Solutions",
			description: "Increased demand for robust security measures in SaaS applications due to rising threats.",
			relevance: 4,
			growth: 28,
		},
		{
			name: "Remote Collaboration Tools",
			description: "Continued growth of tools supporting distributed teams and hybrid work environments.",
			relevance: 4,
			growth: 18,
		},
	],
}; 