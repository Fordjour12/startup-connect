import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "$lib/endpoints";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const { id } = params;

	try {
		// Forward cookies for authentication
		const accessToken = cookies.get('access_token');

		const response = await fetch(
			`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_INVESTOR_DETAILS.replace('{investor_id}', id)}`,
			{
				headers: {
					Authorization: `bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Investor not found');
			}
			if (response.status === 401) {
				throw error(401, 'Unauthorized - Please log in');
			}
			if (response.status === 403) {
				throw error(403, 'Forbidden - Access denied');
			}
			throw error(response.status, 'Failed to load investor');
		}

		const investor = await response.json();

		return {
			investor
		};
	} catch (err) {
		console.error('Failed to load investor:', err);

		// If it's already a SvelteKit error, re-throw it
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		// Otherwise, throw a generic error
		throw error(500, 'Failed to load investor');
	}
};
