import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, parent }) => {
	const { user, isAuthenticated } = await parent();

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		throw redirect(302, '/login?message=Please log in to access the dashboard.');
	}

	return {
		user
	};
}; 