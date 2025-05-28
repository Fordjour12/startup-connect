import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { resetPasswordSchema } from "@/schemas/reset-password-schema";
import type { ApiError, PasswordResetResponse } from "@/types/auth";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        // If no token, redirect to forgot password page
        throw redirect(302, '/forgot-password');
    }

    const form = await superValidate(zod(resetPasswordSchema));
    // Pre-populate the token from URL
    form.data.token = token;

    return {
        form
    };
};

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const form = await superValidate(request, zod(resetPasswordSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { token, password } = form.data;

        try {
            const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.RESET_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    new_password: password
                })
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();

                // Handle specific error cases
                if (response.status === 400 && errorData.detail.includes("Invalid or expired")) {
                    return fail(400, {
                        form,
                        message: "Invalid or expired reset token. Please request a new password reset."
                    });
                }

                if (response.status === 404) {
                    return fail(404, {
                        form,
                        message: "User not found. Please request a new password reset."
                    });
                }

                if (response.status === 403 && errorData.detail.includes("deactivated")) {
                    return fail(403, {
                        form,
                        message: "Account is deactivated. Please contact support."
                    });
                }

                return fail(response.status, {
                    form,
                    message: errorData.detail || "Failed to reset password. Please try again."
                });
            }

            const data: PasswordResetResponse = await response.json();

            // Success - redirect to login with success message
            throw redirect(302, `/login?message=${encodeURIComponent(data.message || 'Password has been reset successfully. You can now log in with your new password.')}`);

        } catch (error) {
            // If it's a redirect, re-throw it
            if (error instanceof Response && error.status >= 300 && error.status < 400) {
                throw error;
            }

            console.error('Reset password error:', error);
            return fail(500, {
                form,
                message: "Network error. Please check your connection and try again."
            });
        }
    }
}; 