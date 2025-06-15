import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "@/schemas/login-schema";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { type Token } from "@/types/auth"



export const load: PageServerLoad = async ({ cookies }) => {
   const token = cookies.get('access_token');
   if (token) {
      redirect(302, '/dashbaord');
   }

   const form = await superValidate(zod(loginSchema))
   return { form }
}


export const actions = {
   default: async ({ request, fetch, cookies }) => {
      const form = await superValidate(request, zod(loginSchema))

      if (!form.valid) {
         return fail(400, { form })
      }

      const { email, password } = form.data;


      const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.LOGIN}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: new URLSearchParams({
            username: email,
            password: password
         }).toString(),
      });

      if (!response.ok) {
         return fail(400, {
            message: "Invalid email or password"
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

      const accessToken = tokenData.access_token;

      // Get user info after successful login
      const userResponse = await fetch(
         `${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_USER}`,
         {
            headers: {
               Authorization: `bearer ${accessToken}`,
            },
         },
      );

      let redirectPath = '/dashboard';
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
         let redirectPath =
            userData.role === "founder"
               ? "/dashboard/founder"
               : userData.role === "investor"
                  ? "/dashboard/investor"
                  : "/dashboard/supporter";
      }

      redirect(302, redirectPath);
   }
} satisfies Actions;



