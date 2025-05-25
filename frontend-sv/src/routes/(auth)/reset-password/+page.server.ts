import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resetPasswordSchema } from "@/schemas/reset-password-schema";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";

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
                method: 'PUT', // or PATCH, depending on your API
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    new_password: password
                })
            });

            if (response.ok) {
                // Success - redirect to login with success message
                throw redirect(302, '/login?message=Password reset successfully. You can now log in with your new password.');
            } else {
                const errorData = await response.json();
                let errorMessage = 'Failed to reset password';
                
                if (errorData.detail) {
                    if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
                        errorMessage = errorData.detail[0].msg;
                    }
                }
                
                form.message = errorMessage;
                return fail(response.status, { form });
            }
        } catch (error) {
            // If it's a redirect, re-throw it
            if (error instanceof Response && error.status >= 300 && error.status < 400) {
                throw error;
            }
            
            console.error('Reset password error:', error);
            form.message = 'An unexpected error occurred. Please try again later.';
            return fail(500, { form });
        }
    }
}; 