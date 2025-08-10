// import { env } from "$env/dynamic/private";
// import { ApiEndpoint } from "@/endpoints";
// import { forgotPasswordSchema } from "@/z-schema/forgot-password-schema";
// import type { ApiError, PasswordResetResponse } from "@/types/auth";
// import { fail } from "@sveltejs/kit";
// import { superValidate } from "sveltekit-superforms";
// import { zod } from "sveltekit-superforms/adapters";
// import type { Actions, PageServerLoad } from "./$types";

// export const load: PageServerLoad = async () => {
//    return {
//       form: await superValidate(zod(forgotPasswordSchema))
//    };
// };

// export const actions: Actions = {
//    default: async ({ request, fetch }) => {
//       const form = await superValidate(request, zod(forgotPasswordSchema));

//       if (!form.valid) {
//          return fail(400, { form });
//       }

//       const { email } = form.data;

//       try {
//          const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.FORGOT_PASSWORD}`, {
//             method: 'POST',
//             headers: {
//                'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                email: email
//             })
//          });

//          if (!response.ok) {
//             const errorData: ApiError = await response.json();

//             // Handle specific error cases
//             if (response.status === 403 && errorData.detail.includes("deactivated")) {
//                return fail(403, {
//                   form,
//                   message: "Account is deactivated. Please contact support."
//                });
//             }

//             // For other errors, still show generic message for security
//             return {
//                form,
//                message: "If an account with that email exists, we've sent you a password reset link."
//             };
//          }

//          const data: PasswordResetResponse = await response.json();

//          // Always show the same message for security (prevents email enumeration)
//          return {
//             form,
//             message: data.message || "If an account with that email exists, we've sent you a password reset link."
//          };

//       } catch (error) {
//          console.error('Forgot password error:', error);
//          // Still show the same message for security
//          return {
//             form,
//             message: "If an account with that email exists, we've sent you a password reset link."
//          };
//       }
//    }
// };
