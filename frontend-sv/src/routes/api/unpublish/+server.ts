import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { startup_id } = await request.json();

	// The Python backend expects PUT /startups/{startup_id}/unpublish with no body
	const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.UNPUBLISH_STARTUP.replace('{startup_id}', startup_id)}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `bearer ${cookies.get('access_token')}`
		}
		// No body needed - the Python backend determines publication status from the endpoint
	});

	if (!response.ok) {
		const errorData = await response.text();
		return json({ message: 'Failed to unpublish startup', error: errorData }, { status: response.status });
	}

	const updatedStartup = await response.json();
	return json({
		message: 'Startup unpublished successfully',
		startup: updatedStartup
	});
};
