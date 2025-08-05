import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { USER_ROLES } from "@/db/schema/auth-schema";
import { auth } from "@/auth";
import { getUserRoles } from "@/data/user-role";
import { getRoleDashboardPath } from "@/utils"

export const load: PageServerLoad = async ({ request }) => {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/login");
  }

  // Check if user has completed onboarding by checking if they have a specific role
  // Users with "user" role should continue with onboarding
  if (session.user.role && session.user.role !== "user" && [USER_ROLES.FOUNDER, USER_ROLES.INVESTOR, USER_ROLES.SUPPORT].includes(session.user.role as any)) {
    const dashboardPath = getRoleDashboardPath(session?.user?.role);
    redirect(302, dashboardPath);

  }


  console.log("Showing onboarding page for user");

  return {
    user: session.user,
    roles: getUserRoles,
  };
};
