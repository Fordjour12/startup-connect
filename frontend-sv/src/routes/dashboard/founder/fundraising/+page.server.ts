import type { PageServerLoad } from './$types';
import { fundraisingData } from '$lib/data/fundraising-data';

export const load: PageServerLoad = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        fundraising: fundraisingData
    };
}; 