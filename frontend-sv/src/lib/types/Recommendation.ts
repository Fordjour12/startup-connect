export interface RecommendationReason {
	type: string;
	description: string;
	score?: number;
}

export interface InvestorRecommendation {
	id: string;
	name: string;
	firm: string;
	title?: string;
	avatar?: string;
	score: number;
	investment_focus: string[];
	preferred_stages: string[];
	location?: string;
	funding_range?: {
		min_amount: number;
		max_amount: number;
	};
	reasons: RecommendationReason[];
	total_investments?: number;
	bio?: string;
}

export interface RecommendationResponse {
	recommendations: InvestorRecommendation[];
	startup_profile: {
		name: string;
		industry: string;
		funding_stage: string;
		location?: string;
	};
	total_count: number;
	algorithm_version: string;
}