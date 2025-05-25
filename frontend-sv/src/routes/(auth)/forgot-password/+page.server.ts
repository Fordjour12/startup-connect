import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { forgotPasswordSchema } from "@/schemas/forgot-password-schema";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(forgotPasswordSchema))
    };
};

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const form = await superValidate(request, zod(forgotPasswordSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { email } = form.data;

        try {
            const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.FORGOT_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });

            // For security reasons, we always show the same message regardless of whether 
            // the email exists or not. This prevents email enumeration attacks.
            form.message = 'If an account with that email exists, we\'ve sent you a password reset link.';
            return { form };
            
        } catch (error) {
            console.error('Forgot password error:', error);
            // Still show the same message for security
            form.message = 'If an account with that email exists, we\'ve sent you a password reset link.';
            return { form };
        }
    }
}; 