import { auth } from "@/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { type RequestEvent } from '@sveltejs/kit'
import { isOnboardingComplete } from "$lib/db/utils/user-profile-operations";

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

  // Check if user has completed onboarding
  const onboardingStatus = await isOnboardingComplete(session.user.id);

  // If user doesn't have a specific role OR hasn't completed onboarding, redirect to onboarding
  const specificRoles = ['founder', 'investor', 'support'];
  const hasValidRole = session.user.role && specificRoles.includes(session.user.role);
  const hasCompletedOnboarding = onboardingStatus.success && onboardingStatus.isComplete;

  if ((!hasValidRole || !hasCompletedOnboarding) && !event.url.pathname.startsWith('/onboarding')) {
    redirect(302, '/onboarding');
  }
}

// async function handleRoleBasedRedirects(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
//   // Helper function to check if route should be skipped
//   const shouldSkipRoute = (pathname: string) => {
//     const skipPatterns = [
//       '/login',
//       '/register',
//       '/forgot-password',
//       '/reset-password',
//       '/onboarding',
//       '/api/',
//       '/static',
//       '/_app'
//     ];
//     return skipPatterns.some(pattern => pathname.startsWith(pattern));
//   };

//   // Skip role-based redirects for auth routes, onboarding, and API routes
//   if (shouldSkipRoute(event.url.pathname)) {
//     return;
//   }

//   // Get session from Better Auth context
//   const session = await auth.api.getSession({
//     headers: event.request.headers
//   });

//   // If no session, skip role-based redirects
//   if (!session) {
//     return;
//   }

//   // Check if user has completed onboarding
//   const onboardingStatus = await isOnboardingComplete(session.user.id);
//   const hasCompletedOnboarding = onboardingStatus.success && onboardingStatus.isComplete;

//   // Only apply role-based redirects if onboarding is complete
//   if (!hasCompletedOnboarding) {
//     return;
//   }

//   const userRole = session.user.role;
//   const currentPath = event.url.pathname;
//   const specificRoles = ['founder', 'investor', 'support'];

//   // Helper functions defined at the top
//   const hasValidRole = (role: string | null | undefined): boolean => {
//     return role ? specificRoles.includes(role) : false;
//   };

//   const shouldRedirectToDashboard = (role: string | null | undefined, path: string): boolean => {
//     return hasValidRole(role) && path === '/';
//   };

//   const shouldRedirectToOnboarding = (path: string): boolean => {
//     return path === '/dashboard' && !hasCompletedOnboarding;
//   };

//   const shouldRedirectFromHome = (role: string | null | undefined, path: string): boolean => {
//     return hasCompletedOnboarding && path === '/' && hasValidRole(role);
//   };

//   const shouldRedirectFromOnboarding = (path: string): boolean => {
//     return hasCompletedOnboarding && path.startsWith('/onboarding');
//   };

//   const shouldRedirectFromGenericPages = (role: string | null | undefined, path: string): boolean => {
//     const genericPages = ['/', '/home', '/landing'];
//     return hasValidRole(role) && genericPages.includes(path);
//   };

//   // Additional role-based logic
//   const isRoleSpecificPage = (path: string): boolean => {
//     return path.startsWith('/founder') || path.startsWith('/investor') || path.startsWith('/support');
//   };

//   const shouldRedirectFromRoleSpecificPage = (role: string | null | undefined, path: string): boolean => {
//     // If user is on a role-specific page that doesn't match their role, redirect to dashboard
//     if (isRoleSpecificPage(path) && hasValidRole(role)) {
//       const pathRole = path.split('/')[1]; // Extract role from path
//       return pathRole !== role;
//     }
//     return false;
//   };

//   // Handle role-specific redirects
//   if (shouldRedirectToDashboard(userRole, currentPath)) {
//     console.log(`[Hooks] Redirecting ${userRole} from ${currentPath} to /dashboard`);
//     redirect(302, '/dashboard');
//   }

//   // Handle dashboard access - ensure users go to the main dashboard
//   if (shouldRedirectToOnboarding(currentPath)) {
//     console.log(`[Hooks] Redirecting user from ${currentPath} to /onboarding (incomplete profile)`);
//     redirect(302, '/onboarding');
//   }

//   // Handle post-onboarding redirects - if user just completed onboarding and is on home page
//   if (shouldRedirectFromHome(userRole, currentPath)) {
//     console.log(`[Hooks] Redirecting ${userRole} from ${currentPath} to /dashboard (completed onboarding)`);
//     redirect(302, '/dashboard');
//   }

//   // Prevent users who completed onboarding from accessing onboarding again
//   if (shouldRedirectFromOnboarding(currentPath)) {
//     console.log(`[Hooks] Redirecting user from ${currentPath} to /dashboard (already completed onboarding)`);
//     redirect(302, '/dashboard');
//   }

//   // Redirect users with completed profiles away from generic pages to their dashboard
//   if (hasCompletedOnboarding && shouldRedirectFromGenericPages(userRole, currentPath)) {
//     console.log(`[Hooks] Redirecting ${userRole} from generic page ${currentPath} to /dashboard`);
//     redirect(302, '/dashboard');
//   }

//   // Redirect users from role-specific pages that don't match their role
//   if (hasCompletedOnboarding && shouldRedirectFromRoleSpecificPage(userRole, currentPath)) {
//     console.log(`[Hooks] Redirecting ${userRole} from mismatched role page ${currentPath} to /dashboard`);
//     redirect(302, '/dashboard');
//   }
// }

export async function handle({ event, resolve }: { event: any; resolve: any }) {
  // Handle Better Auth first
  const response = await svelteKitHandler({ event, resolve, auth, building });

  // Add onboarding protection and role-based redirects
  if (!building) {
    await handleOnboardingProtection(event);
    // await handleRoleBasedRedirects(event);
  }

  return response;
}
