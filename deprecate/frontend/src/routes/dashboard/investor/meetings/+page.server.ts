import type { PageServerLoad } from './$types';

export interface Meeting {
	id: string;
	type: string;
	date: string;
	time: string;
	location: string;
	founder: string;
	company: string;
	agenda: string;
}

export const load: PageServerLoad = async () => {
	// In a real application, this data would be fetched from a database or API
	const meetings: Meeting[] = [
		{
			id: "1",
			type: "Board Meeting",
			date: "Oct 25, 2024",
			time: "10:00 AM",
			location: "Virtual",
			founder: "Elena Rodriguez",
			company: "TechFlow AI",
			agenda: "Q4 Strategy Review",
		},
		{
			id: "2",
			type: "Investor Update Call",
			date: "Nov 5, 2024",
			time: "2:00 PM",
			location: "Conference Call",
			founder: "Marcus Chen",
			company: "HealthNova",
			agenda: "Monthly Progress & KPIs",
		},
		{
			id: "3",
			type: "Pitch Practice",
			date: "Nov 12, 2024",
			time: "11:00 AM",
			location: "Office Hours",
			founder: "Aisha Khan",
			company: "FinLeap",
			agenda: "Series A Pitch Deck Review",
		},
	];

	return {
		meetings,
	};
}; 