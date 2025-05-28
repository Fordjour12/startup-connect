import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { loginSchema } from "@/schemas/login-schema";
import type { ApiError } from "@/types/auth";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

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

    let redirectPath = "/dashboard";

    try {
      // Create form data for OAuth2PasswordRequestForm
      const response = await fetch(`${env.API_BASE_URL}${ApiEndpoint.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password,
        }).toString(),
      });

      if (!response.ok) {
        let errorData: ApiError;

        try {
          const responseText = await response.text();
          errorData = responseText ? JSON.parse(responseText) : { detail: "Unknown error" };
        } catch (parseError) {
          errorData = { detail: "Invalid response from server" };
        }

        // Handle specific error cases
        if (response.status === 401) {
          return fail(401, {
            form,
            message: "Incorrect email or password. Please try again.",
          });
        }

        if (
          response.status === 403 &&
          errorData.detail.includes("deactivated")
        ) {
          return fail(403, {
            form,
            message: "Account is deactivated. Please contact support.",
          });
        }

        return fail(response.status, {
          form,
          message: errorData.detail || "Login failed. Please try again.",
        });
      }

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        return fail(500, {
          form,
          message: "Invalid response from server. Please try again.",
        });
      }

      // Store the access token in a secure cookie
      cookies.set("access_token", data.access_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Get user info after successful login
      const userResponse = await fetch(
        `${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_USER}`,
        {
          headers: {
            Authorization: `bearer ${data.access_token}`,
          },
        },
      );

      if (userResponse.ok) {
        let userData;
        try {
          const userResponseText = await userResponse.text();
          userData = userResponseText ? JSON.parse(userResponseText) : {};
        } catch (parseError) {
          userData = {};
        }

        // Store user info in a separate cookie for client-side access
        cookies.set("user", JSON.stringify(userData), {
          path: "/",
          httpOnly: false,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Redirect to dashboard based on user role
        redirectPath =
          userData.role === "founder"
            ? "/dashboard/founder"
            : userData.role === "investor"
              ? "/dashboard/investor"
              : "/dashboard/supporter";
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      if (error instanceof Response && error.status === 302) {
        // Re-throw redirect
        throw error;
      }

      console.error("Login error:", error);
      return fail(500, {
        form,
        message: "Network error. Please check your connection and try again.",
      });
    }
    redirect(302, redirectPath);
  },
};
