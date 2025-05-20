import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data with mock data

	// Pipeline stages
	const pipelineStages = [
		{ id: "lead", name: "Lead", color: "bg-slate-400" },
		{ id: "screening", name: "Screening", color: "bg-blue-400" },
		{ id: "due_diligence", name: "Due Diligence", color: "bg-amber-400" },
		{ id: "term_sheet", name: "Term Sheet", color: "bg-purple-400" },
		{ id: "closing", name: "Closing", color: "bg-emerald-400" }
	];

	// Pipeline deals
	const pipelineDeals = [
		{
			id: 1,
			name: "DataMesh",
			industry: "Enterprise SaaS",
			stage: "lead",
			raisedAmount: "$2M",
			targetAmount: "$5M",
			valuation: "$25M",
			lastActivity: "2023-10-18",
			location: "San Francisco, CA",
			logo: "https://ui-avatars.com/api/?name=DM&background=6366F1&color=fff",
			tags: ["SaaS", "Data", "AI"],
			assignee: "John Smith",
			priority: "high"
		},
		{
			id: 2,
			name: "MedTech Solutions",
			industry: "Healthcare",
			stage: "lead",
			raisedAmount: "$1.5M",
			targetAmount: "$8M",
			valuation: "$40M",
			lastActivity: "2023-10-16",
			location: "Boston, MA",
			logo: "https://ui-avatars.com/api/?name=MT&background=2DD4BF&color=fff",
			tags: ["Healthcare", "MedTech", "Platform"],
			assignee: "Lisa Chen",
			priority: "medium"
		},
		{
			id: 3,
			name: "EcoLogistics",
			industry: "Logistics",
			stage: "screening",
			raisedAmount: "$4M",
			targetAmount: "$10M",
			valuation: "$50M",
			lastActivity: "2023-10-15",
			location: "Seattle, WA",
			logo: "https://ui-avatars.com/api/?name=EL&background=4ADE80&color=fff",
			tags: ["Logistics", "Sustainability", "Software"],
			assignee: "John Smith",
			priority: "medium"
		},
		{
			id: 4,
			name: "FinEdge",
			industry: "Fintech",
			stage: "screening",
			raisedAmount: "$2.5M",
			targetAmount: "$7M",
			valuation: "$35M",
			lastActivity: "2023-10-12",
			location: "New York, NY",
			logo: "https://ui-avatars.com/api/?name=FE&background=0EA5E9&color=fff",
			tags: ["Fintech", "Payments", "B2B"],
			assignee: "Alex Wong",
			priority: "high"
		},
		{
			id: 5,
			name: "RetailAI",
			industry: "Retail Tech",
			stage: "due_diligence",
			raisedAmount: "$5M",
			targetAmount: "$12M",
			valuation: "$60M",
			lastActivity: "2023-10-10",
			location: "Chicago, IL",
			logo: "https://ui-avatars.com/api/?name=RA&background=F43F5E&color=fff",
			tags: ["Retail", "AI", "Analytics"],
			assignee: "Sarah Johnson",
			priority: "high"
		},
		{
			id: 6,
			name: "CloudSecure",
			industry: "Cybersecurity",
			stage: "due_diligence",
			raisedAmount: "$6M",
			targetAmount: "$15M",
			valuation: "$75M",
			lastActivity: "2023-10-08",
			location: "Austin, TX",
			logo: "https://ui-avatars.com/api/?name=CS&background=8B5CF6&color=fff",
			tags: ["Security", "Cloud", "Enterprise"],
			assignee: "Michael Brown",
			priority: "medium"
		},
		{
			id: 7,
			name: "EduVR",
			industry: "EdTech",
			stage: "term_sheet",
			raisedAmount: "$3M",
			targetAmount: "$6M",
			valuation: "$30M",
			lastActivity: "2023-10-05",
			location: "Portland, OR",
			logo: "https://ui-avatars.com/api/?name=EV&background=FB7185&color=fff",
			tags: ["Education", "VR", "Content"],
			assignee: "David Lee",
			priority: "medium"
		},
		{
			id: 8,
			name: "AgriSense",
			industry: "AgTech",
			stage: "closing",
			raisedAmount: "$7M",
			targetAmount: "$7M",
			valuation: "$45M",
			lastActivity: "2023-10-03",
			location: "Denver, CO",
			logo: "https://ui-avatars.com/api/?name=AS&background=10B981&color=fff",
			tags: ["Agriculture", "IoT", "Sustainability"],
			assignee: "Emily Williams",
			priority: "high"
		}
	];

	// Due diligence templates/checklists
	const dueDiligenceTemplates = [
		{
			id: 1,
			name: "Seed Stage SaaS",
			categories: [
				{
					name: "Team",
					items: [
						{ name: "Founder background check", required: true },
						{ name: "Team composition analysis", required: true },
						{ name: "Reference calls", required: true },
						{ name: "Prior startup experience", required: false }
					]
				},
				{
					name: "Product",
					items: [
						{ name: "Product demo", required: true },
						{ name: "Technical architecture review", required: true },
						{ name: "IP protection status", required: true },
						{ name: "Product roadmap review", required: false }
					]
				},
				{
					name: "Market",
					items: [
						{ name: "Market size analysis", required: true },
						{ name: "Competitive landscape", required: true },
						{ name: "Growth potential assessment", required: true },
						{ name: "Industry expert interviews", required: false }
					]
				},
				{
					name: "Financial",
					items: [
						{ name: "Revenue model review", required: true },
						{ name: "Customer acquisition cost", required: true },
						{ name: "Burn rate analysis", required: true },
						{ name: "Financial projections review", required: true },
						{ name: "Prior funding details", required: false }
					]
				}
			]
		},
		{
			id: 2,
			name: "Series A Healthcare",
			categories: [
				{
					name: "Team",
					items: [
						{ name: "Management team assessment", required: true },
						{ name: "Clinical expertise verification", required: true },
						{ name: "Key hires planning", required: true }
					]
				},
				{
					name: "Product",
					items: [
						{ name: "Clinical validation data", required: true },
						{ name: "Regulatory approval status", required: true },
						{ name: "Patient outcomes data", required: true },
						{ name: "IP portfolio review", required: true }
					]
				},
				{
					name: "Market",
					items: [
						{ name: "Reimbursement landscape", required: true },
						{ name: "Provider adoption barriers", required: true },
						{ name: "Market size validation", required: true }
					]
				},
				{
					name: "Financial",
					items: [
						{ name: "Unit economics", required: true },
						{ name: "Revenue projections", required: true },
						{ name: "Cost structure analysis", required: true },
						{ name: "Funding history", required: true }
					]
				}
			]
		},
		{
			id: 3,
			name: "Hardware Startup",
			categories: [
				{
					name: "Team",
					items: [
						{ name: "Engineering team assessment", required: true },
						{ name: "Manufacturing expertise", required: true },
						{ name: "Supply chain experience", required: true }
					]
				},
				{
					name: "Product",
					items: [
						{ name: "Prototype evaluation", required: true },
						{ name: "Manufacturing plan review", required: true },
						{ name: "BOM cost analysis", required: true },
						{ name: "Quality control processes", required: true },
						{ name: "Certification requirements", required: true }
					]
				},
				{
					name: "Market",
					items: [
						{ name: "Go-to-market strategy", required: true },
						{ name: "Distribution channels", required: true },
						{ name: "Competitive pricing analysis", required: true }
					]
				},
				{
					name: "Financial",
					items: [
						{ name: "COGS breakdown", required: true },
						{ name: "Margin analysis", required: true },
						{ name: "Cash flow projections", required: true },
						{ name: "Capital requirements", required: true }
					]
				}
			]
		}
	];

	// Active due diligence processes
	const activeDueDiligence = [
		{
			dealId: 5, // RetailAI
			templateId: 1, // Seed Stage SaaS
			progress: 65,
			startDate: "2023-10-01",
			targetDate: "2023-10-25",
			completedItems: 12,
			totalItems: 18,
			notes: "Need to schedule final technical review and complete financial projections analysis.",
			team: ["Sarah Johnson", "Michael Brown", "David Lee"]
		},
		{
			dealId: 6, // CloudSecure
			templateId: 3, // Hardware Startup
			progress: 40,
			startDate: "2023-10-05",
			targetDate: "2023-10-30",
			completedItems: 8,
			totalItems: 19,
			notes: "Team assessment complete. Working on product evaluation and market analysis.",
			team: ["Michael Brown", "John Smith", "Lisa Chen"]
		}
	];

	// Team members for collaboration
	const teamMembers = [
		{ id: 1, name: "John Smith", role: "Investment Associate", avatar: "https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff" },
		{ id: 2, name: "Lisa Chen", role: "Partner", avatar: "https://ui-avatars.com/api/?name=LC&background=8B5CF6&color=fff" },
		{ id: 3, name: "Sarah Johnson", role: "Investment Manager", avatar: "https://ui-avatars.com/api/?name=SJ&background=EC4899&color=fff" },
		{ id: 4, name: "Michael Brown", role: "Technical Advisor", avatar: "https://ui-avatars.com/api/?name=MB&background=F43F5E&color=fff" },
		{ id: 5, name: "David Lee", role: "Financial Analyst", avatar: "https://ui-avatars.com/api/?name=DL&background=10B981&color=fff" },
		{ id: 6, name: "Emily Williams", role: "Partner", avatar: "https://ui-avatars.com/api/?name=EW&background=0EA5E9&color=fff" },
		{ id: 7, name: "Alex Wong", role: "Investment Associate", avatar: "https://ui-avatars.com/api/?name=AW&background=FB7185&color=fff" }
	];

	// External collaborators
	const externalCollaborators = [
		{ id: 101, name: "Pacific Ventures", type: "VC Firm", contactName: "Robert Garcia", email: "robert@pacificventures.com" },
		{ id: 102, name: "Horizon Capital", type: "VC Firm", contactName: "Jennifer Taylor", email: "jtaylor@horizoncap.com" },
		{ id: 103, name: "Dr. Mark Wilson", type: "Technical Advisor", contactName: "Mark Wilson", email: "mark.wilson@expertnet.com" },
		{ id: 104, name: "Thompson & Partners", type: "Legal Firm", contactName: "Sandra Thompson", email: "sthompson@tplegal.com" }
	];

	// Shared deals
	const sharedDeals = [
		{
			dealId: 5, // RetailAI
			sharedWith: [
				{ id: 101, name: "Pacific Ventures", access: "full", sharedOn: "2023-10-05" }
			],
			notes: "Potential co-investment partner for Series A"
		},
		{
			dealId: 6, // CloudSecure
			sharedWith: [
				{ id: 103, name: "Dr. Mark Wilson", access: "view", sharedOn: "2023-10-08" }
			],
			notes: "Technical review of cybersecurity architecture"
		}
	];

	// Investment committee meetings
	const committeeMeetings = [
		{
			id: 1,
			date: "2023-10-25",
			time: "10:00 AM - 12:00 PM",
			deals: [5, 7], // RetailAI, EduVR
			status: "scheduled",
			location: "Conference Room A",
			requiredAttendees: [2, 3, 6], // Lisa, Sarah, Emily
			optionalAttendees: [1, 4, 5], // John, Michael, David
			materials: [
				{ id: 1, dealId: 5, type: "Investment Memo", status: "in_progress", assignee: 3 }, // Sarah
				{ id: 2, dealId: 5, type: "Financial Analysis", status: "completed", assignee: 5 }, // David
				{ id: 3, dealId: 7, type: "Investment Memo", status: "completed", assignee: 1 }, // John
				{ id: 4, dealId: 7, type: "Market Analysis", status: "in_progress", assignee: 7 } // Alex
			]
		},
		{
			id: 2,
			date: "2023-11-08",
			time: "2:00 PM - 4:00 PM",
			deals: [6, 8], // CloudSecure, AgriSense
			status: "planned",
			location: "Virtual",
			requiredAttendees: [2, 6], // Lisa, Emily
			optionalAttendees: [1, 3, 4, 5, 7], // John, Sarah, Michael, David, Alex
			materials: [
				{ id: 5, dealId: 6, type: "Investment Memo", status: "not_started", assignee: 4 }, // Michael
				{ id: 6, dealId: 6, type: "Technical Assessment", status: "in_progress", assignee: 4 }, // Michael
				{ id: 7, dealId: 8, type: "Investment Memo", status: "not_started", assignee: 6 }, // Emily
				{ id: 8, dealId: 8, type: "Financial Analysis", status: "not_started", assignee: 5 } // David
			]
		}
	];

	// Decision support data
	const comparisonMetrics = [
		{ id: "market_size", name: "Market Size", description: "Total addressable market in USD" },
		{ id: "team_score", name: "Team Score", description: "Rating of the founding team (1-10)" },
		{ id: "product_score", name: "Product Score", description: "Rating of the product (1-10)" },
		{ id: "traction", name: "Traction", description: "Current traction metrics" },
		{ id: "capital_efficiency", name: "Capital Efficiency", description: "How efficiently the company uses capital" },
		{ id: "valuation", name: "Valuation", description: "Current valuation" },
		{ id: "expected_return", name: "Expected Return", description: "Projected multiple on investment" },
		{ id: "risk_score", name: "Risk Score", description: "Overall risk assessment (1-10, lower is less risky)" }
	];

	// Deal evaluations (for comparison)
	const dealEvaluations = [
		{
			dealId: 5, // RetailAI
			metrics: {
				market_size: "$18B",
				team_score: 8,
				product_score: 9,
				traction: "$250K ARR, 15% MoM growth",
				capital_efficiency: "High",
				valuation: "$60M",
				expected_return: "4.5x",
				risk_score: 5
			},
			strengths: [
				"Strong founding team with prior exits",
				"Product already achieving product-market fit",
				"Scalable business model with high margins"
			],
			weaknesses: [
				"Competitive market with established players",
				"High customer acquisition costs",
				"Regulatory concerns in some markets"
			]
		},
		{
			dealId: 6, // CloudSecure
			metrics: {
				market_size: "$22B",
				team_score: 7,
				product_score: 9,
				traction: "$180K ARR, 20% MoM growth",
				capital_efficiency: "Medium",
				valuation: "$75M",
				expected_return: "3.5x",
				risk_score: 6
			},
			strengths: [
				"Unique technology with strong IP protection",
				"Enterprise customers with high retention",
				"Growing market with increasing demand"
			],
			weaknesses: [
				"Technical founder, less business experience",
				"Long sales cycles with enterprises",
				"Requires significant capital for growth"
			]
		},
		{
			dealId: 7, // EduVR
			metrics: {
				market_size: "$8B",
				team_score: 9,
				product_score: 7,
				traction: "$100K ARR, 25% MoM growth",
				capital_efficiency: "Very High",
				valuation: "$30M",
				expected_return: "5.0x",
				risk_score: 4
			},
			strengths: [
				"Exceptional team with domain expertise",
				"Capital efficient with clear path to profitability",
				"First-mover advantage in emerging market"
			],
			weaknesses: [
				"Product still requires development",
				"Education market adoption can be slow",
				"Uncertain regulatory environment"
			]
		}
	];

	return {
		pipelineStages,
		pipelineDeals,
		dueDiligenceTemplates,
		activeDueDiligence,
		teamMembers,
		externalCollaborators,
		sharedDeals,
		committeeMeetings,
		comparisonMetrics,
		dealEvaluations
	};
}; 