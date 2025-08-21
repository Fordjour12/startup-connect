
// import { authClient } from '$lib/auth-client';
// import { goto } from '$app/navigation';
// import { browser } from '$app/environment';
// import type { HandleClientError } from '@sveltejs/kit';

// /**
//  * SvelteKit Client-Side Hooks
//  *
//  * These hooks handle client-side navigation and error handling
//  * for role-based redirects and user experience.
//  */

// /**
//  * Client-side error handling hook
//  * Handles errors that occur during client-side navigation and rendering
//  */
// export const handleError: HandleClientError = async ({ error, event, status, message }) => {
// 	console.error('[Client Hooks] Error occurred:', { error, status, message });

// 	// Handle specific error types
// 	if (status === 404) {
// 		console.log('[Client Hooks] Page not found, checking if user should be redirected');
// 		await handleClientNavigation();
// 	}

// 	// Return error details for error page rendering
// 	return {
// 		message: 'Something went wrong',
// 		status: status || 500
// 	};
// };

// /**
//  * Client-side navigation hook
//  * Handles navigation events and applies role-based redirects
//  */
// export const handleNavigate = async ({
// 	to,
// 	from,
// 	cancel
// }: {
// 	to: any;
// 	from: any;
// 	cancel: any;
// }) => {
// 	console.log(`[Client Hooks] Navigation: ${from} → ${to}`);

// 	// Skip for auth routes and onboarding
// 	const skipPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/onboarding'];
// 	if (to?.route?.id && skipPaths.some(path => to.route.id.startsWith(path))) {
// 		return;
// 	}

// 	// Apply role-based navigation logic
// 	try {
// 		await handleClientNavigation();
// 	} catch (error) {
// 		console.error('[Client Hooks] Navigation error:', error);
// 	}
// };

/**
 * Client-side navigation guard for role-based redirects
 *
 * This function handles client-side navigation logic to ensure users are
 * redirected to appropriate pages based on their role and onboarding status.
 *
 * Usage:
 * 1. Import in a component: `import { handleClientNavigation } from '$hooks.client'`
 * 2. Call in onMount: `onMount(() => handleClientNavigation())`
 * 3. Or call after authentication state changes
 */
// async function handleClientNavigation() {
// 	if (!browser) return;

// 	try {
// 		const session = await authClient.getSession();
// 		if (!session?.data?.user) return;

// 		const user = session.data.user;
// 		const currentPath = window.location.pathname;

// 		// Skip for auth routes and onboarding
// 		const skipPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/onboarding'];
// 		if (skipPaths.some(path => currentPath.startsWith(path))) return;

// 		// Check if user has completed onboarding (has a specific role)
// 		const specificRoles = ['founder', 'investor', 'support'];
// 		const hasValidRole = user.role && specificRoles.includes(user.role);

// 		if (hasValidRole) {
// 			// Redirect users with completed profiles away from generic pages
// 			if (currentPath === '/' || currentPath === '/home' || currentPath === '/landing') {
// 				console.log(`[Client Hooks] Redirecting ${user.role} from ${currentPath} to /dashboard`);
// 				await goto('/dashboard', { replaceState: true });
// 			}
// 		} else {
// 			// Redirect users without completed profiles to onboarding
// 			if (currentPath !== '/onboarding') {
// 				console.log(`[Client Hooks] Redirecting user from ${currentPath} to /onboarding (incomplete profile)`);
// 				await goto('/onboarding', { replaceState: true });
// 			}
// 		}
// 	} catch (error) {
// 		console.error('Client navigation guard error:', error);
// 	}
// }

/**
 * Check if user should be redirected to onboarding
 * Useful for conditional rendering in components
 */
// export function shouldRedirectToOnboarding(userRole: string | null | undefined): boolean {
// 	const specificRoles = ['founder', 'investor', 'support'];
// 	return !userRole || !specificRoles.includes(userRole);
// }

/**
 * Check if user has completed onboarding
 * Useful for conditional rendering in components
 */
// export function hasCompletedOnboarding(userRole: string | null | undefined): boolean {
// 	const specificRoles = ['founder', 'investor', 'support'];
// 	return userRole ? specificRoles.includes(userRole) : false;
// }

// // Export the navigation function for use in components
// export { handleClientNavigation };
