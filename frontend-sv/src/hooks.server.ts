import { auth } from "@/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { USER_ROLES } from "@/db/schema/auth-schema";
import { type RequestEvent } from '@sveltejs/kit'


async function handleOnboardingProtection(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
   // Skip onboarding protection for auth routes and onboarding itself
   if (event.url.pathname.startsWith('/login') ||
      event.url.pathname.startsWith('/register') ||
      event.url.pathname.startsWith('/forgot-password') ||
      event.url.pathname.startsWith('/reset-password') ||
      event.url.pathname.startsWith('/onboarding') ||
      event.url.pathname.startsWith('/api/')) {
      return;
   }

   // Check if user is authenticated
   const userCookie = event.cookies.get('user');
   const accessToken = event.cookies.get('access_token');

   if (!userCookie || !accessToken) {
      return; // Let Better Auth handle this
   }

   try {
      const user = JSON.parse(userCookie);

      // If user has default role (founder), redirect to onboarding
      if (user.role === USER_ROLES.FOUNDER && !event.url.pathname.startsWith('/onboarding')) {
         throw redirect(302, '/onboarding');
      }
   } catch (error) {
      // If it's a redirect, re-throw it
      if (error instanceof Response && error.status >= 300 && error.status < 400) {
         throw error;
      }
      // For other errors, just continue
      console.error('Onboarding protection error:', error);
   }
}

export async function handle({ event, resolve }) {
   // Handle Better Auth first
   const response = await svelteKitHandler({ event, resolve, auth, building });

   // Add onboarding protection
   if (!building) {
      await handleOnboardingProtection(event);
   }

   return response;
}



