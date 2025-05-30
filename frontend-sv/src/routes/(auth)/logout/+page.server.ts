import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	// Clear authentication cookies
	cookies.delete('access_token', { path: '/' });
	cookies.delete('user', { path: '/' });

	// Redirect to login page
	throw redirect(302, '/login?message=You have been logged out successfully.');
}; 