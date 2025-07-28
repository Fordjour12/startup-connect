import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { auth } from "@/auth";

export const load: PageServerLoad = async ({ request }) => {
	// Use Better Auth's signOut method
	await auth.api.signOut({
		headers: request.headers
	});

	// Redirect to login page
	throw redirect(302, '/login?message=You have been logged out successfully.');
}; 