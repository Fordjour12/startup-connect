import { env } from '$env/dynamic/private';
import { ApiEndpoint } from '@/endpoints';
import type { StartupDetails } from '@/types/startup';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params,locals }) => {
    const startupId = params.id;
    const username = String(locals.user?.name);
    const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_STARTUP_DETAILS.replace('{startup_id}', startupId)}`);
    const startupData: StartupDetails = await response.json();


    return {
        startup: startupData,
        startupId: startupId,
        username: username,
    };
};

export const actions: Actions = {
    default: async ({ params }) => {
        const startupId = params.id;

        try {
            const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.DELETE_STARTUP.replace('{startup_id}', startupId)}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                return fail(500, { message: 'Failed to delete startup.' });
            }
        } catch (e: any) {
            return fail(500, { message: `Error deleting startup: ${e.message}` });
        }

        redirect(303, '/dashboard/founder');
    },
}; 