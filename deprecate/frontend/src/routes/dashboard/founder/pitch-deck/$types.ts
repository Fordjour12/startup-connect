import type { PageServerLoad } from './$types.generated';

export interface PitchDeck {
	id: string;
	name: string;
	version: string;
	uploadDate: string;
	size: string;
	status: 'active' | 'archived' | 'draft';
	views: number;
	shares: number;
	url: string;
	thumbnailUrl: string;
	feedback: {
		score: number;
		suggestions: number;
		strengths: string[];
		improvements: string[];
	};
	analytics: {
		avgTimeSpent: string;
		dropOffSlide: number;
		mostViewedSlide: number;
		completionRate: number;
		viewsBySlide: number[];
	};
}

export interface Template {
	id: string;
	name: string;
	slides: number;
	category: string;
	downloads: number;
	rating: number;
	preview: string;
	description: string;
	tags: string[];
}

export interface IndustryBenchmarks {
	avgSlides: number;
	avgViewTime: string;
	avgScore: number;
	completionRate: number;
	successfulDecks: {
		problemSlide: number;
		solutionSlide: number;
		marketSlide: number;
		teamSlide: number;
		tractionSlide: number;
		financialsSlide: number;
	};
	industryAverages: {
		saas: { avgScore: number; avgSlides: number; avgViewTime: string };
		marketplace: { avgScore: number; avgSlides: number; avgViewTime: string };
		deeptech: { avgScore: number; avgSlides: number; avgViewTime: string };
		consumer: { avgScore: number; avgSlides: number; avgViewTime: string };
	};
}

export interface PerformanceAnalytics {
	totalViews: number;
	totalShares: number;
	avgScore: number;
	trends: {
		viewsThisMonth: number;
		viewsLastMonth: number;
		sharesThisMonth: number;
		sharesLastMonth: number;
		scoreImprovement: number;
	};
	mostEngagingSlides: {
		name: string;
		avgTime: string;
		engagement: number;
	}[];
}

export interface AIInsights {
	commonStrengths: string[];
	commonWeaknesses: string[];
	industryTrends: string[];
	recommendations: string[];
}

export interface PageData {
	pitchDecks: PitchDeck[];
	templates: Template[];
	industryBenchmarks: IndustryBenchmarks;
	performanceAnalytics: PerformanceAnalytics;
	aiInsights: AIInsights;
}

export type { PageServerLoad };
