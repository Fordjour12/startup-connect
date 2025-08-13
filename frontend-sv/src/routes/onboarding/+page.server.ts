import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { isOnboardingComplete } from '$lib/db/utils/user-profile-operations';

export const load = async ({ request, url }) => {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user) {
    // Redirect to login with return URL
    throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname)}`);
  }

  // Check if user has already completed onboarding
  const onboardingStatus = await isOnboardingComplete(session.user.id);

  if (onboardingStatus.success && onboardingStatus.isComplete) {
    // User has already completed onboarding, redirect to role-specific dashboard
    const role = session.user.role;
    let dashboardRoute = '/dashboard';

    switch (role) {
      case 'investor':
        dashboardRoute = '/investor-dashboard';
        break;
      case 'founder':
        dashboardRoute = '/founder-dashboard';
        break;
      case 'support':
        dashboardRoute = '/support-dashboard';
        break;
      default:
        dashboardRoute = '/dashboard';
    }

    throw redirect(302, dashboardRoute);
  }

  return {
    user: session.user
  };
};
