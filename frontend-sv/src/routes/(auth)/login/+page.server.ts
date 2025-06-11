import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { loginSchema } from "@/schemas/login-schema";
import type { ApiError, Token } from "@/types/auth";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  // Redirect if already logged in
  const token = cookies.get('access_token');
  if (token) {
    throw redirect(302, '/dashboard');
  }

  const form = await superValidate(zod(loginSchema));
  return { form };
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { email, password } = form.data;
      // Create URL-encoded form data for OAuth2PasswordRequestForm
      const response = await fetch(`${env.BACKEND_URL}${ApiEndpoint.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password
        }).toString(),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();

        if (response.status === 401) {
          return fail(401, {
            form,
            error: 'Invalid email or password'
          });
        }

        if (response.status === 403) {
          return fail(403, {
            form,
            error: 'Account is deactivated. Please contact support.'
          });
        }

        return fail(response.status, {
          form,
          error: errorData.detail || 'Login failed. Please try again.'
        });
      }

      const tokenData: Token = await response.json();

      // Set secure HTTP-only cookie
      cookies.set('access_token', tokenData.access_token, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

    } catch (error) {
      // Handle network errors or other unexpected errors
      if (error instanceof Response && error.status >= 300) {
        // This is a redirect, re-throw it
        throw error;
      }

      console.error('Login error:', error);
      return fail(500, {
        form,
        error: 'Network error. Please check your connection and try again.'
      });
    }

    // Redirect to dashboard on successful login
    redirect(302, '/dashboard');
  },
};