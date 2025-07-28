import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { USER_ROLES } from "@/db/schema/auth-schema";
import { auth } from "@/auth";
import { getUserRoles } from "@/data/user-role";

export const load: PageServerLoad = async ({ request }) => {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    throw redirect(302, "/login");
  }

  console.log("Onboarding page - User role:", session.user.role);
  console.log("Onboarding page - USER_ROLES.FOUNDER:", USER_ROLES.FOUNDER);

  // If user has a specific role (founder, investor, supporter), redirect to dashboard
  if (session.user.role && [USER_ROLES.FOUNDER, USER_ROLES.INVESTOR, USER_ROLES.SUPPORT].includes(session.user.role as any)) {
    console.log("Redirecting user with role:", session.user.role);
    // Redirect based on role
    switch (session.user.role) {
      case USER_ROLES.INVESTOR:
        throw redirect(302, "/dashboard/investor");
      case USER_ROLES.SUPPORT:
        throw redirect(302, "/dashboard/supporter");
      case USER_ROLES.FOUNDER:
        throw redirect(302, "/dashboard/founder");
    }
  }

  console.log("Showing onboarding page for user");

  return {
    user: session.user,
    roles: getUserRoles,
  };
};

export const actions: Actions = {
  selectRole: async ({ request }) => {
    const formData = await request.formData();
    const role = formData.get("role") as string;

    if (
      !role ||
      ![USER_ROLES.FOUNDER, USER_ROLES.INVESTOR, USER_ROLES.SUPPORT].includes(
        role as any,
      )
    ) {
      return {
        success: false,
        error: "Invalid role selected",
      };
    }

    try {
      // Update user role in the backend
      const response = await fetch("/api/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const result = await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to update role. Please try again.",
      };
    }

    // Redirect to success page with role info (outside try-catch)
    throw redirect(302, `/onboarding/success?role=${role}`);
  },
};
