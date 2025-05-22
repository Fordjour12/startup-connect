import type { PageServerLoad } from './$types';
import { collaborationData } from '$lib/data/collaboration-data';

export const load: PageServerLoad = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        collaboration: collaborationData
    };
}; 