export interface InvestorDetails {
	id: string;
	user_id: string;
	name: string;
	email: string;
	bio?: string;
	company?: string;        // Maps to firm_name from backend
	firm_name: string;       // Direct from backend
	website?: string;
	location?: string;
	linkedin_url?: string;
	twitter_url?: string;
	investment_focus?: string[];
	preferred_stages?: string[];
	min_investment?: number;
	max_investment?: number;
	profile_picture?: string;
}

export interface Investors {
	investors: InvestorDetails[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}

export interface InvestorDetailById {
	id: string;
	user_id: string;
	name?: string;           // from user.full_name
	email?: string;          // from user.email
	firm_name: string;
	bio?: string;
	website?: string;
	location?: string;
	linkedin_url?: string;
	twitter_url?: string;
	investment_focus?: string[];
	preferred_stages?: string[];
	profile_picture?: string;
	min_investment?: number;
	max_investment?: number;
}