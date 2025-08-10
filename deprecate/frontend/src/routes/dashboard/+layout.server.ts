import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { auth } from "@/auth";

export const load: LayoutServerLoad = async ({ request }) => {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers
  });

  // Redirect to login if not authenticated
  if (!session) {
    redirect(302, '/login?message=Please log in to access the dashboard.');
  }

  return {
    user: session.user,
  };
};
