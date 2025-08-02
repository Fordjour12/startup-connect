import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "@/schemas/login-schema";
import { auth } from "@/auth";
import { USER_ROLES } from "@/db/schema/auth-schema";

export const load: PageServerLoad = async ({ request }) => {
  // Check if user is already authenticated using Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session?.user) {
    // Redirect based on role
    if (session.user.role === USER_ROLES.FOUNDER) {
      redirect(302, "/dashboard/founder");
    } else if (session.user.role === USER_ROLES.INVESTOR) {
      redirect(302, "/dashboard/investor");
    } else if (session.user.role === USER_ROLES.SUPPORT) {
      redirect(302, "/dashboard/supporter");
    } else {
      // Any other role (including 'user', null, undefined) goes to onboarding
      redirect(302, "/onboarding");
    }
  }

  const form = await superValidate(zod(loginSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    let session;

    try {
      // Use Better Auth's signInEmail method
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      console.log("Login result:", result);

      if (!result.token) {
        return fail(400, {
          form,
          message: "Invalid email or password",
        });
      }

      console.log("User logged in successfully", result.user);

      // After successful login, get the session to check the user's role
      session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return fail(500, {
          form,
          message: "Failed to get user session after login",
        });
      }

    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {
        form,
        message: "An unexpected error occurred. Please try again.",
      });
    }

    // Determine redirect path based on role (outside try-catch)
    let redirectPath: string;

    if (session.user.role === USER_ROLES.FOUNDER) {
      redirectPath = "/dashboard/founder";
    } else if (session.user.role === USER_ROLES.INVESTOR) {
      redirectPath = "/dashboard/investor";
    } else if (session.user.role === USER_ROLES.SUPPORT) {
      redirectPath = "/dashboard/supporter";
    } else {
      // Any other role (including 'user', null, undefined) goes to onboarding
      redirectPath = "/onboarding";
    }

    redirect(302, redirectPath);
  },
} satisfies Actions;
