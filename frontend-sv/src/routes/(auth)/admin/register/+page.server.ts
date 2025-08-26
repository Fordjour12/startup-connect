import { auth } from "@/auth";
import { registerSchema } from "@/z-schema/register-schema";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { USER_ROLES } from "@/db/schema/auth-schema";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(registerSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { name, email, password } = form.data;
    try {
      // Use Better Auth's signUp method
      const result = await auth.api.createUser({
        body: {
          email: email,
          password: password,
          name: name,
          role: USER_ROLES.ADMIN,
        },
      });

      if (!result) {
        return fail(400, {
          form,
          message:
            "An account with this email already exists. Please try logging in instead.",
        });
      }

    } catch (error) {
      console.error("Registration error:", error);
      return fail(500, {
        form,
        message: "An unexpected error occurred. Please try again.",
      });
    }

    // Redirect to admin dashboarding flow
    redirect(302, '/dashboard/admin');

  },
} satisfies Actions;
