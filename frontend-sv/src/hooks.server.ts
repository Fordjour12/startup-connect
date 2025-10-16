import { auth } from "@/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { type RequestEvent } from '@sveltejs/kit'
import { isOnboardingComplete } from "$lib/db/utils/user-profile-operations";
import { USER_ROLES } from "@/db/schema/auth-schema";

async function handleOnboardingProtection(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
  // Skip onboarding protection for auth routes, onboarding itself, admin routes, and API routes
  if (event.url.pathname.startsWith('/login') ||
    event.url.pathname.startsWith('/register') ||
    event.url.pathname.startsWith('/forgot-password') ||
    event.url.pathname.startsWith('/reset-password') ||
    event.url.pathname.startsWith('/onboarding') ||
    event.url.pathname.startsWith('/admin') ||
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

  // Check if user has completed onboarding
  const onboardingStatus = await isOnboardingComplete(session.user.id);

  // If user doesn't have a specific role OR hasn't completed onboarding, redirect to onboarding
  const specificRoles = ['founder', 'investor', 'support', 'admin'];
  const hasValidRole = session.user.role && specificRoles.includes(session.user.role);
  const hasCompletedOnboarding = onboardingStatus.success && onboardingStatus.isComplete;

  // Admins don't need onboarding - skip the check for them
  if (session.user.role === 'admin') {
    return;
  }

  if ((!hasValidRole || !hasCompletedOnboarding) && !event.url.pathname.startsWith('/onboarding')) {
    redirect(302, '/onboarding');
  }
}


async function handleAdminProtection(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
  // Only protect admin routes
  if (!event.url.pathname.startsWith('/dashboard/admin')) {
    return;
  }

  // Skip protection for admin auth routes
  if (event.url.pathname.startsWith('/admin/login') ||
    event.url.pathname.startsWith('/admin/register') ||
    event.url.pathname.startsWith('/forgot-password')) {
    return;
  }

  // Get session from Better Auth context
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  // Check if user has admin role
  const specificRoles = [USER_ROLES.ADMIN];
  const hasValidRole = session?.user?.role && specificRoles.includes(session?.user?.role as any);

  if (!hasValidRole) {
    redirect(302, '/admin/login');
  }
}



export async function handle({ event, resolve }: { event: any; resolve: any }) {
  // Handle Better Auth first
  const response = await svelteKitHandler({ event, resolve, auth, building });

  // Add onboarding protection and role-based redirects
  if (!building) {
    await handleOnboardingProtection(event);
    await handleAdminProtection(event);
    // await handleRoleBasedRedirects(event);
  }

  return response;
}
