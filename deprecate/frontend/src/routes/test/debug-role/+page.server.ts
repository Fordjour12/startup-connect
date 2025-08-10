import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { USER_ROLES } from '@/db/schema/auth-schema';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if user is authenticated
	const userCookie = cookies.get('user');
	const accessToken = cookies.get('access_token');

	if (!userCookie || !accessToken) {
		throw redirect(302, '/login');
	}

	let user = null;
	try {
		user = JSON.parse(userCookie);
	} catch (error) {
		return {
			error: 'Invalid user cookie',
			userCookie: userCookie
		};
	}

	return {
		user,
		userRole: user.role,
		founderRole: USER_ROLES.FOUNDER,
		isFounder: user.role === USER_ROLES.FOUNDER,
		shouldShowOnboarding: user.role === USER_ROLES.FOUNDER,
		allRoles: USER_ROLES
	};
}; 