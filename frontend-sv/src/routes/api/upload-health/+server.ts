import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies }) => {
	try {
		const access_token = cookies.get('access_token');
		if (!access_token) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const response = await fetch(`${env.DEPLOYMENT_API_URL}/upload/health`, {
			headers: {
				'Authorization': `Bearer ${access_token}`
			}
		});

		if (response.ok) {
			const health = await response.json();
			return json(health);
		} else {
			const error = await response.json();
			return json(error, { status: response.status });
		}
	} catch (error) {
		console.error('Upload health check error:', error);
		return json({ error: 'Health check failed' }, { status: 500 });
	}
}; 