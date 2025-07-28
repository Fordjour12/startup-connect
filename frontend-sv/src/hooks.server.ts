import { auth } from "@/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";
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

  // Get session from Better Auth context
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  // If no session, let Better Auth handle authentication
  if (!session) {
    return;
  }

  // If user doesn't have a specific role (founder, investor, supporter), redirect to onboarding
  const specificRoles = ['founder', 'investor', 'support'];
  if ((!session.user.role || session.user.role === null || !specificRoles.includes(session.user.role)) && !event.url.pathname.startsWith('/onboarding')) {
    redirect(302, '/onboarding');
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
