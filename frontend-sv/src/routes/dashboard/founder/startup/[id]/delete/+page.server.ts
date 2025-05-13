import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Mock database - in a real app, this would be your database service
// For the delete page, we only strictly need a structure that can be "deleted"
// and enough info for the confirmation text (name).
// Let's assume a structure similar to what other pages expect for consistency,
// even if not all fields are displayed on the delete confirmation page.
interface Startup {
    name: string;
    description: string;
    industry: string;
    location: string;
    // Add other fields if needed for consistency or future display on this page
}

const mockStartups: Record<string, Startup> = {
    '1': {
        name: 'Innovatech Solutions',
        description: 'Pioneering AI-driven solutions for the future of sustainable energy.',
        industry: 'Clean Energy',
        location: 'San Francisco, USA',
    },
    '2': {
        name: 'HealthPlus Connect',
        description: 'A platform connecting patients with specialized healthcare providers.',
        industry: 'Healthcare',
        location: 'New York, USA',
    },
    // Add more mock startups if needed
};


export const load: PageServerLoad = async ({ params }) => {
    const startupId = params.id;
    const startupData = mockStartups[startupId];

    if (!startupData) {
        error(404, { message: 'Startup not found. Cannot proceed with deletion.' });
    }

    // In a real app, username might come from session/auth state
    const username = 'currentfounder'; // Placeholder username

    return {
        startup: startupData,
        startupId: startupId,
        username: username, // To be used for confirmation text: username/startup_name
    };
};

export const actions: Actions = {
    default: async ({ params }) => {
        const startupId = params.id;

        if (!mockStartups[startupId]) {
            return fail(404, { message: 'Startup not found. Deletion failed.' });
        }

        // Simulate deletion
        try {
            delete mockStartups[startupId];
            // In a real application, you would call your database service here
            // e.g., await db.deleteStartup(startupId);
        } catch (e: any) {
            return fail(500, { message: `Error deleting startup: ${e.message}` });
        }

        // Redirect to a relevant page after deletion
        redirect(303, '/dashboard/founder'); // Or a list of startups, etc.
    },
}; 