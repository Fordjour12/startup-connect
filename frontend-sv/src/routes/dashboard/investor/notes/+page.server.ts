import type { PageServerLoad } from './$types';
import type { Note } from '$lib/components/investor/types';

// Mock data for notes
const mockNotes: Note[] = [
	{
		id: 1,
		company: 'TechFlow AI',
		date: '2024-07-20',
		title: 'Initial Investment Analysis',
		content: 'Conducted initial analysis of TechFlow AI. Promising team and technology. Market potential is significant, but competition is fierce. Need to monitor their user acquisition strategy closely.',
		tags: ['AI', 'Deep Learning', 'Seed Round', 'Analysis'],
	},
	{
		id: 2,
		company: 'HealthNova',
		date: '2024-07-15',
		title: 'Follow-up Meeting with Founders',
		content: 'Met with HealthNova founders. Discussed their clinical trial progress and regulatory hurdles. They have a clear roadmap. Next steps: due diligence on their IP.',
		tags: ['Healthcare', 'BioTech', 'Clinical Trials', 'Founders'],
	},
	{
		id: 3,
		company: 'FinLeap',
		date: '2024-07-10',
		title: 'Product Demo and UX Review',
		content: 'Attended FinLeap product demo. The platform is intuitive and addresses a key pain point in SME financial management. UX could be slightly improved in the onboarding flow.',
		tags: ['FinTech', 'SaaS', 'UX Review', 'Product'],
	},
	{
		id: 4,
		company: 'GreenScale',
		date: '2024-06-28',
		title: 'Market Research: Renewable Energy Trends',
		content: 'Completed market research for GreenScale. The renewable energy sector is experiencing rapid growth, especially in solar and wind. Government incentives are a strong driver. GreenScale is well-positioned if they can scale their manufacturing.',
		tags: ['CleanTech', 'Renewable Energy', 'Market Research', 'Manufacturing'],
	},
	{
		id: 5,
		company: 'TechFlow AI',
		date: '2024-06-20',
		title: 'Competitive Landscape Overview',
		content: 'Reviewed the competitive landscape for AI-driven analytics. Several established players, but TechFlow AI\'s niche focus on real-time processing could be a differentiator. Key competitors: AlphaAI, BetaLogics.',
		tags: ['AI', 'Competition', 'Strategy'],
	},
	{
		id: 6,
		company: 'HealthNova',
		date: '2024-06-10',
		title: 'IP Due Diligence Report',
		content: 'IP lawyer submitted the due diligence report for HealthNova. Patents appear strong and defensible. No major red flags identified. Clears a major hurdle for investment consideration.',
		tags: ['Healthcare', 'Due Diligence', 'Intellectual Property'],
	},
	{
		id: 7,
		company: 'FinLeap',
		date: '2024-05-25',
		title: 'Financial Projections Review',
		content: 'Reviewed FinLeap\'s financial projections. Ambitious growth targets, but appear achievable if they hit their customer acquisition cost (CAC) targets. Burn rate is a concern in the short term.',
		tags: ['FinTech', 'Financials', 'Projections', 'Burn Rate'],
	},
	{
		id: 8,
		company: 'TechFlow AI',
		date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
		title: 'Quick Sync: Alpha Launch Feedback',
		content: 'Quick call with TechFlow AI CEO. Alpha launch has been positive, initial user feedback is encouraging. Some minor bugs reported, team is working on fixes. Planning a wider beta next month.',
		tags: ['AI', 'Product Launch', 'User Feedback'],
	},
	{
		id: 9,
		company: 'GreenScale',
		date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
		title: 'Supply Chain Check-in',
		content: 'Checked with GreenScale on their supply chain for critical components. Some potential bottlenecks identified with international shipping. Exploring alternative suppliers.',
		tags: ['CleanTech', 'Supply Chain', 'Manufacturing', 'Logistics'],
	},
];

export const load: PageServerLoad = async () => {
	// In a real application, you would fetch this data from a database or API
	// For now, we simulate a delay and return mock data
	await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

	return {
		notes: mockNotes,
	};
}; 