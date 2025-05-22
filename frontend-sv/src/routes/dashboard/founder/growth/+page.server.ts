import type { PageServerLoad } from './$types';
import { growthData } from '$lib/data/growth-data';

export const load: PageServerLoad = async () => {
    // In a real application, this would fetch data from an API
    // For now, we're using mock data
    
    return {
        growth: growthData
    };
}; 