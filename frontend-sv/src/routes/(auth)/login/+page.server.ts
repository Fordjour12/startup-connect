import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { superValidate, fail } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "@/schemas/login-schema";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints"

// Define the token response interface
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
}

// Define error response interface
interface ErrorResponse {
  detail: string | {
    msg: string;
    type?: string;
    loc?: string[];
  }[];
  status_code?: number;
}

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(loginSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    console.log(email, password);

    try {
      // Login request
      const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password
        }).toString(),
      });

      if (response.ok) {
        const tokenData: TokenResponse = await response.json();

        // Set tokens in cookies (secure, httpOnly)
        cookies.set('access_token', tokenData.access_token, {
          path: '/',
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          maxAge: tokenData.expires_in || 60 * 60 * 24, // Default to 1 day if expires_in not provided
          sameSite: 'strict'
        });

        if (tokenData.refresh_token) {
          cookies.set('refresh_token', tokenData.refresh_token, {
            path: '/',
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
            sameSite: 'strict'
          });
        }

        // Get user details to determine role-based redirect
        try {
          const userResponse = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_USER}`, {
            method: 'GET',
            headers: {
              'Authorization': `bearer ${tokenData.access_token}`
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();

            // Redirect based on user role
            if (userData.role === 'FOUNDER' || userData.role === 'founder') {
              throw redirect(303, '/dashboard/founder');
            } else if (userData.role === 'INVESTOR' || userData.role === 'investor') {
              throw redirect(303, '/dashboard/investor');
            } else {
              // Default fallback or handle other roles
              throw redirect(303, '/dashboard');
            }
          } else {
            // If we can't get user details, redirect to generic dashboard
            throw redirect(303, '/dashboard');
          }
        } catch (userError) {
          console.error('Error fetching user details:', userError);
          // Fallback to generic dashboard
          throw redirect(303, '/dashboard');
        }
      } else {
        // API returned an error
        let errorData: ErrorResponse;

        try {
          errorData = await response.json();
        } catch (e) {
          // If response isn't valid JSON
          errorData = {
            detail: 'An unknown error occurred',
            status_code: response.status
          };
        }

        // Extract error message from the API response
        let errorMessage = 'Login failed';

        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMessage = errorData.detail[0].msg;
        }

        // Set error message in the form
        form.message = errorMessage;

        // Return form with the error message
        return fail(response.status, { form });
      }
    } catch (error) {
      if ((error as any).status === 303) {
        // This is our redirect, not an error
        throw error;
      }

      console.error('Login error:', error);
      form.message = 'An unexpected error occurred. Please try again later.';
      return fail(500, { form });
    }
  },
};
