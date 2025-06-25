export interface StartupDetails {
	// Basic startup information
	id: string;
	founder_id: string;
	name: string;
	description: string;
	industry: string;
	location: string;
	funding_stage: string;
	funding_goal: number;
	founded_year: string;
	team_size: number;
	website: string;
	business_model: string;
	target_market: string;
	competitors: string[];
	is_published: boolean;

	// File URLs (enhanced with new fields)
	logo_url: string | null;
	logo_thumbnail_url?: string | null;    // NEW: thumbnail for logo
	pitch_deck_url: string | null;
	demo_video_url?: string | null;        // NEW: demo video support
	product_screenshots_urls?: string[];   // NEW: multiple screenshots

	// Enhanced metadata for files
	logo_metadata?: Record<string, string | number | boolean>;
	demo_video_metadata?: Record<string, string | number | boolean>;

	// Team and organizational data
	team_members: string[];

	// Business data (can be JSON objects)
	funding: string | null;
	metrics: string | null;
	social_media: string | null;
	contact: string | null;
	traction: string | null;
	use_of_funds: string | null;
	timeline: string | null;
}

// Form data interface for creating/updating startups
export interface StartupFormData {
	name: string;
	description: string;
	industry: string;
	location: string;
	fundingStage: string;
	fundingGoal: number;
	foundedYear: number;
	teamSize: number;
	website: string;
	businessModel: string;
	targetMarket: string;
	competitors: string[];
	isPublished: boolean;

	// Team and business data
	teamMembers?: string[];
	funding?: any;
	metrics?: any;
	socialMedia?: any;
	contact?: any;
	traction?: any;
	useOfFunds?: any;
	timeline?: any;

	// File references (handled separately through upload service)
	logoFile?: File;
	pitchDeckFile?: File;
	demoVideoFile?: File;
	productScreenshotFiles?: File[];
}

// Response from creating/updating startup
export interface StartupResponse {
	startup: StartupDetails;
	message: string;
}
