import { auth } from '@/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { USER_ROLES } from '@/db/schema/auth-schema';

export const load: PageServerLoad = async ({ url, request }) => {
	// Get session from Better Auth
	const session = await auth.api.getSession({
		headers: request.headers
	});

	// Redirect to login if not authenticated
	if (!session?.user) {
		throw redirect(302, `/login?redirectTo=${url.pathname}`);
	}

	// Redirect investors and supporters to role-specific onboarding
	if (session.user.role === USER_ROLES.INVESTOR) {
		throw redirect(302, '/onboarding/investor');
	} else if (session.user.role === USER_ROLES.SUPPORT) {
		throw redirect(302, '/onboarding/support');
	}

	return {
		user: session.user
	};
};