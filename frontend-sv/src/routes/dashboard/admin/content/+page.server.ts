import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Mock content management data

	const pendingStartups = [
		{
			id: 1,
			name: "TechCorp Solutions",
			founder: "John Doe",
			description: "AI-powered business analytics platform",
			submittedDate: "2024-01-20",
			status: "pending"
		},
		{
			id: 2,
			name: "GreenEnergy Corp",
			founder: "Jane Smith",
			description: "Sustainable energy solutions",
			submittedDate: "2024-01-19",
			status: "pending"
		},
		{
			id: 3,
			name: "FinTech Innovations",
			founder: "Mike Johnson",
			description: "Digital banking platform",
			submittedDate: "2024-01-18",
			status: "under_review"
		}
	];

	const recentInvestments = [
		{
			id: 1,
			startup: "TechCorp Solutions",
			investor: "Sarah Wilson",
			amount: 150000,
			date: "2024-01-20",
			status: "completed"
		},
		{
			id: 2,
			startup: "GreenEnergy Corp",
			investor: "David Brown",
			amount: 250000,
			date: "2024-01-19",
			status: "pending"
		},
		{
			id: 3,
			startup: "FinTech Innovations",
			investor: "Lisa Davis",
			amount: 500000,
			date: "2024-01-18",
			status: "completed"
		}
	];

	const documents = [
		{
			id: 1,
			name: "TechCorp Pitch Deck.pdf",
			startup: "TechCorp Solutions",
			type: "pitch_deck",
			uploadedDate: "2024-01-20",
			status: "approved"
		},
		{
			id: 2,
			name: "GreenEnergy Financials.xlsx",
			startup: "GreenEnergy Corp",
			type: "financial",
			uploadedDate: "2024-01-19",
			status: "pending"
		}
	];

	const contentStats = {
		pendingStartups: pendingStartups.length,
		recentInvestments: recentInvestments.length,
		totalDocuments: documents.length,
		approvalRate: 94
	};

	return {
		pendingStartups,
		recentInvestments,
		documents,
		contentStats
	};
};
