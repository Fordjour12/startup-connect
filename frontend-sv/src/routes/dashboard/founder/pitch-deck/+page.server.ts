import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	// Mock pitch decks data - in a real app, this would come from a database
	const pitchDecks = [
		{
			id: "1",
			name: "Series A Pitch Deck v3.2",
			version: "3.2",
			uploadDate: "2024-01-15",
			size: "2.4 MB",
			status: "active",
			views: 47,
			shares: 8,
			url: "/pitch-decks/series-a-v3.2.pdf",
			thumbnailUrl: "/thumbnails/series-a-v3.2.jpg",
			feedback: {
				score: 85,
				suggestions: 3,
				strengths: [
					"Clear problem statement",
					"Strong market opportunity",
					"Compelling team presentation",
					"Well-defined competitive advantage"
				],
				improvements: [
					"Add more financial projections",
					"Strengthen team section",
					"Include customer testimonials"
				]
			},
			analytics: {
				avgTimeSpent: "4:32",
				dropOffSlide: 8,
				mostViewedSlide: 3,
				completionRate: 67,
				viewsBySlide: [12, 11, 15, 9, 8, 7, 6, 4, 3, 2]
			}
		},
		{
			id: "2",
			name: "Seed Round Deck",
			version: "2.1",
			uploadDate: "2023-12-10",
			size: "1.8 MB",
			status: "archived",
			views: 23,
			shares: 12,
			url: "/pitch-decks/seed-round-v2.1.pdf",
			thumbnailUrl: "/thumbnails/seed-round-v2.1.jpg",
			feedback: {
				score: 78,
				suggestions: 5,
				strengths: [
					"Compelling story",
					"Good traction metrics",
					"Clear problem identification"
				],
				improvements: [
					"Clarify revenue model",
					"Add competitive analysis",
					"Strengthen financial projections",
					"Improve market size validation"
				]
			},
			analytics: {
				avgTimeSpent: "3:45",
				dropOffSlide: 6,
				mostViewedSlide: 2,
				completionRate: 52,
				viewsBySlide: [8, 12, 7, 6, 5, 3, 2, 1]
			}
		},
		{
			id: "3",
			name: "MVP Demo Deck",
			version: "1.5",
			uploadDate: "2024-01-20",
			size: "3.1 MB",
			status: "active",
			views: 12,
			shares: 3,
			url: "/pitch-decks/mvp-demo-v1.5.pdf",
			thumbnailUrl: "/thumbnails/mvp-demo-v1.5.jpg",
			feedback: {
				score: 72,
				suggestions: 4,
				strengths: [
					"Strong product demo",
					"Clear value proposition",
					"Good market validation"
				],
				improvements: [
					"Add business model details",
					"Strengthen team credentials",
					"Include go-to-market strategy",
					"Add customer acquisition metrics"
				]
			},
			analytics: {
				avgTimeSpent: "2:18",
				dropOffSlide: 5,
				mostViewedSlide: 4,
				completionRate: 83,
				viewsBySlide: [12, 11, 10, 15, 8, 4, 3]
			}
		}
	];

	// Mock templates data
	const templates = [
		{
			id: "1",
			name: "SaaS Startup Template",
			slides: 12,
			category: "Technology",
			downloads: 1205,
			rating: 4.8,
			preview: "/templates/saas-preview.jpg",
			description: "Perfect for B2B SaaS startups with recurring revenue models",
			tags: ["SaaS", "B2B", "Technology", "Recurring Revenue"]
		},
		{
			id: "2",
			name: "B2B Enterprise Template",
			slides: 15,
			category: "Enterprise",
			downloads: 892,
			rating: 4.6,
			preview: "/templates/b2b-preview.jpg",
			description: "Designed for enterprise-focused startups with complex sales cycles",
			tags: ["B2B", "Enterprise", "Sales", "Corporate"]
		},
		{
			id: "3",
			name: "Consumer App Template",
			slides: 10,
			category: "Consumer",
			downloads: 756,
			rating: 4.7,
			preview: "/templates/consumer-preview.jpg",
			description: "Ideal for consumer-facing mobile and web applications",
			tags: ["Consumer", "Mobile", "B2C", "App"]
		},
		{
			id: "4",
			name: "Deep Tech Template",
			slides: 14,
			category: "Deep Tech",
			downloads: 432,
			rating: 4.5,
			preview: "/templates/deeptech-preview.jpg",
			description: "For startups with complex technology and long development cycles",
			tags: ["Deep Tech", "R&D", "Innovation", "Science"]
		},
		{
			id: "5",
			name: "Marketplace Template",
			slides: 11,
			category: "Marketplace",
			downloads: 623,
			rating: 4.4,
			preview: "/templates/marketplace-preview.jpg",
			description: "Perfect for two-sided marketplace business models",
			tags: ["Marketplace", "Platform", "Network Effects", "Scaling"]
		},
		{
			id: "6",
			name: "Healthcare Template",
			slides: 13,
			category: "Healthcare",
			downloads: 387,
			rating: 4.6,
			preview: "/templates/healthcare-preview.jpg",
			description: "Specialized for healthcare and medical technology startups",
			tags: ["Healthcare", "Medical", "Regulatory", "Clinical"]
		}
	];

	// Mock industry benchmarks
	const industryBenchmarks = {
		avgSlides: 12,
		avgViewTime: "3:45",
		avgScore: 76,
		completionRate: 64,
		successfulDecks: {
			problemSlide: 95,
			solutionSlide: 93,
			marketSlide: 89,
			teamSlide: 87,
			tractionSlide: 85,
			financialsSlide: 82
		},
		industryAverages: {
			saas: { avgScore: 78, avgSlides: 11, avgViewTime: "4:15" },
			marketplace: { avgScore: 74, avgSlides: 12, avgViewTime: "3:52" },
			deeptech: { avgScore: 72, avgSlides: 14, avgViewTime: "5:20" },
			consumer: { avgScore: 76, avgSlides: 10, avgViewTime: "3:18" }
		}
	};

	// Mock performance analytics
	const performanceAnalytics = {
		totalViews: pitchDecks.reduce((sum, deck) => sum + deck.views, 0),
		totalShares: pitchDecks.reduce((sum, deck) => sum + deck.shares, 0),
		avgScore: Math.round(
			pitchDecks.reduce((sum, deck) => sum + deck.feedback.score, 0) / pitchDecks.length
		),
		trends: {
			viewsThisMonth: 45,
			viewsLastMonth: 32,
			sharesThisMonth: 12,
			sharesLastMonth: 8,
			scoreImprovement: 3.2
		},
		mostEngagingSlides: [
			{ name: "Problem Statement", avgTime: "2:15", engagement: 92 },
			{ name: "Market Opportunity", avgTime: "1:45", engagement: 87 },
			{ name: "Solution Demo", avgTime: "1:30", engagement: 85 },
			{ name: "Business Model", avgTime: "1:20", engagement: 78 },
			{ name: "Team", avgTime: "1:10", engagement: 74 }
		]
	};

	// Mock AI feedback insights
	const aiInsights = {
		commonStrengths: [
			"Clear problem identification",
			"Strong value proposition",
			"Compelling market opportunity",
			"Good visual design",
			"Logical flow and structure"
		],
		commonWeaknesses: [
			"Insufficient financial projections",
			"Weak competitive analysis",
			"Limited go-to-market strategy",
			"Unclear team roles",
			"Missing customer validation"
		],
		industryTrends: [
			"Investors are focusing more on unit economics",
			"Sustainability and ESG factors gaining importance",
			"Remote-first business models in demand",
			"AI/ML integration becoming expected",
			"Data privacy and security increasingly critical"
		],
		recommendations: [
			"Include at least 3 years of financial projections",
			"Add customer testimonials or case studies",
			"Clearly define your competitive advantages",
			"Show evidence of product-market fit",
			"Demonstrate scalability of business model"
		]
	};

	return {
		pitchDecks,
		templates,
		industryBenchmarks,
		performanceAnalytics,
		aiInsights
	};
}; 