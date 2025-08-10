import type { PageServerLoad } from './$types';
import { customerInsightsData } from '$lib/data/customer-insights-data';

export const load: PageServerLoad = async () => {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 500));

	return {
		customerInsights: customerInsightsData
	};
}; 