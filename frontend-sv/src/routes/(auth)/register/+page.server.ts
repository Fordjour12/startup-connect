// import { auth } from "@/auth";
// import { registerSchema } from "@/z-schema/register-schema";
// import { fail, redirect } from "@sveltejs/kit";
// import { superValidate } from "sveltekit-superforms";
// import { zod } from "sveltekit-superforms/adapters";
// import type { Actions, PageServerLoad } from "./$types";

// export const load: PageServerLoad = async () => {
//   const form = await superValidate(zod(registerSchema));
//   return { form };
// };

// export const actions = {
//   default: async ({ request }) => {
//     const form = await superValidate(request, zod(registerSchema));

//     if (!form.valid) {
//       return fail(400, { form });
//     }

//     const { name, email, password } = form.data;

//     try {
//       // Use Better Auth's signUp method
//       const result = await auth.api.signUpEmail({
//         body: {
//           email,
//           password,
//           name,
//         },
//       });

//       console.log("Registration result:", result);

//       if (!result.token) {
//         return fail(400, {
//           form,
//           message:
//             "An account with this email already exists. Please try logging in instead.",
//         });
//       }

//       console.log("User registered successfully", result.user);

//     } catch (error) {
//       console.error("Registration error:", error);
//       return fail(500, {
//         form,
//         message: "An unexpected error occurred. Please try again.",
//       });
//     }

//     // Redirect to onboarding flow (outside try-catch)
//     redirect(302, '/onboarding');
//   },
// } satisfies Actions;
