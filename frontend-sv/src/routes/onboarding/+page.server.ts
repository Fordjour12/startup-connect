import { auth } from '@/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, request }) => {
	// Get session from Better Auth
	const session = await auth.api.getSession({
		headers: request.headers
	});

	// Redirect to login if not authenticated
	if (!session?.user) {
		throw redirect(302, `/login?redirectTo=${url.pathname}`);
	}

	return {
		user: session.user
	};
};