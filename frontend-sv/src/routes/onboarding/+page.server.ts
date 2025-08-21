import { redirect } from '@sveltejs/kit';
import { auth } from '@/auth';
import { isOnboardingComplete } from '@/db/utils/user-profile-operations';

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

    // All roles use the same dashboard route - role-based content is handled dynamically
    dashboardRoute = '/dashboard';

    throw redirect(302, dashboardRoute);
  }

  return {
    user: session.user
  };
};
