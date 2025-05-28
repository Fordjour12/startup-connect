import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { registerSchema } from "@/schemas/register-schema";
import type { ApiError, UserRegistrationResponse } from "@/types/auth";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(registerSchema));
  return { form };
};

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { fullName, email, password, userType } = form.data;
    let redirectPath;

    try {
      const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: userType
        })
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();

        // Handle specific error cases
        if (response.status === 400 && errorData.detail.includes("already exists")) {
          return fail(400, {
            form,
            message: "An account with this email already exists. Please try logging in instead."
          });
        }

        return fail(response.status, {
          form,
          message: errorData.detail || "Registration failed. Please try again."
        });
      }

      const data: UserRegistrationResponse = await response.json();

      // Store the access token in a secure cookie
      cookies.set('access_token', data.access_token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      // Store user info in a separate cookie for client-side access
      cookies.set('user', JSON.stringify(data.user), {
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      // Redirect to dashboard or appropriate page based on user role
      redirectPath = data.user.role === 'founder' ? '/dashboard/founder' :
        data.user.role === 'investor' ? '/dashboard/investor' :
          '/dashboard/supporter';

    } catch (error) {
      // Handle network errors or other unexpected errors
      // if (error instanceof Response && error.status === 302) {
      //   // Re-throw redirect
      //   throw error;
      // }

      // console.error('Registration error:', error);
      return fail(500, {
        form,
        message: "Network error. Please check your connection and try again."
      });
    }

    return redirect(302, redirectPath);
  }
} satisfies Actions;
