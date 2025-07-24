import { auth } from "@/auth";
// mapUserTypeToRole
import { registerSchema } from "@/schemas/register-schema";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(registerSchema));
  return { form };
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { name, email, password } = form.data;

    try {
      // Use Better Auth's signUp method
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });

      console.log("Registration result:", result);

      if (!result.token) {
        return fail(400, {
          form,
          message:
            "An account with this email already exists. Please try logging in instead.",
        });
      }

      console.log("User registered successfully", result.user);

      // Set authentication cookies
      if (result.token) {
        cookies.set('access_token', result.token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
      }

      // Set user cookie with basic info
      const userData = {
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.name,
        role: 'founder', // Default role, will be updated in onboarding
        is_active: true,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      cookies.set('user', JSON.stringify(userData), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      // Redirect to onboarding flow
      return redirect(302, '/onboarding');

    } catch (error) {
      console.error("Registration error:", error);
      return fail(500, {
        form,
        message: "An unexpected error occurred. Please try again.",
      });
    }
  },
} satisfies Actions;
