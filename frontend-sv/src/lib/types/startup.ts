export interface StartupDetails {
	name: string;
	description: string;
	industry: string;
	location: string;
	funding_stage: string;
	funding_goal: number;
	founded_year: string;
	team_size: number;
	website: string;
	logo_url: string | null;
	pitch_deck_url: string | null;
	business_model: string;
	target_market: string;
	competitors: string[];
	id: string;
	founder_id: string;
	is_published: boolean;
	team_members: string[];
	funding: string | null;
	metrics: string | null;
	social_media: string | null;
	contact: string | null;
	traction: string | null;
	use_of_funds: string | null;
	timeline: string | null;
}
