import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "@/schemas/login-schema";
import { auth } from "@/auth";
import { USER_ROLES } from "@/db/schema/auth-schema";

export const load: PageServerLoad = async ({ cookies }) => {
   // Check if user is already authenticated
   const userCookie = cookies.get('user');
   const accessToken = cookies.get('access_token');

   if (userCookie && accessToken) {
      try {
         const user = JSON.parse(userCookie);
         // Redirect based on role
         if (user.role === USER_ROLES.FOUNDER) {
            redirect(302, '/onboarding');
         } else if (user.role === USER_ROLES.INVESTOR) {
            redirect(302, '/dashboard/investor');
         } else if (user.role === USER_ROLES.SUPPORT) {
            redirect(302, '/dashboard/supporter');
         } else {
            redirect(302, '/dashboard/founder');
         }
      } catch (error) {
         // Clear invalid cookies
         cookies.delete('user', { path: '/' });
         cookies.delete('access_token', { path: '/' });
      }
   }

   const form = await superValidate(zod(loginSchema))
   return { form }
}

export const actions = {
   default: async ({ request, cookies }) => {
      const form = await superValidate(request, zod(loginSchema))

      if (!form.valid) {
         return fail(400, { form })
      }

      const { email, password } = form.data;

      let result;
      let userData;

      try {
         // Use Better Auth's signInEmail method
         result = await auth.api.signInEmail({
            body: {
               email,
               password,
            },
         });

         console.log("Login result:", result);

         if (!result.token) {
            return fail(400, {
               form,
               message: "Invalid email or password"
            });
         }

         console.log("User logged in successfully", result.user);

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

         // Set user cookie with user info
         userData = {
            id: result.user.id,
            email: result.user.email,
            full_name: result.user.name,
            role: result.user.role || USER_ROLES.FOUNDER,
            is_active: true,
            is_verified: result.user.emailVerified || false,
            created_at: result.user.createdAt || new Date().toISOString(),
            updated_at: result.user.updatedAt || new Date().toISOString()
         };

         cookies.set('user', JSON.stringify(userData), {
            path: '/',
            httpOnly: false, // Allow client-side access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
         });

      } catch (error) {
         console.error("Login error:", error);
         return fail(500, {
            form,
            message: "An unexpected error occurred. Please try again."
         });
      }

      // Determine redirect path based on role (outside try-catch)
      let redirectPath: string;

      if (userData.role === USER_ROLES.FOUNDER) {
         redirectPath = '/onboarding';
      } else if (userData.role === USER_ROLES.INVESTOR) {
         redirectPath = '/dashboard/investor';
      } else if (userData.role === USER_ROLES.SUPPORT) {
         redirectPath = '/dashboard/supporter';
      } else {
         redirectPath = '/dashboard/founder';
      }

      redirect(302, redirectPath);
   }
} satisfies Actions;



