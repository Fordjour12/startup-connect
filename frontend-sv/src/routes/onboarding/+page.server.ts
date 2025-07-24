import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { USER_ROLES } from '@/db/schema/auth-schema';

export const load: PageServerLoad = async ({ cookies, locals }) => {
   // Check if user is authenticated
   const userCookie = cookies.get('user');
   const accessToken = cookies.get('access_token');

   if (!userCookie || !accessToken) {
      throw redirect(302, '/login');
   }

   let user = null;
   try {
      user = JSON.parse(userCookie);
   } catch (error) {
      // Clear invalid cookie and redirect to login
      cookies.delete('user', { path: '/' });
      cookies.delete('access_token', { path: '/' });
      throw redirect(302, '/login');
   }

   console.log('Onboarding page - User role:', user.role);
   console.log('Onboarding page - USER_ROLES.FOUNDER:', USER_ROLES.FOUNDER);

   // If user already has a role other than the default founder role, redirect to dashboard
   if (user.role && user.role !== USER_ROLES.FOUNDER) {
      console.log('Redirecting user with role:', user.role);
      // Redirect based on role
      switch (user.role) {
         case USER_ROLES.INVESTOR:
            throw redirect(302, '/dashboard/investor');
         case USER_ROLES.SUPPORT:
            throw redirect(302, '/dashboard/supporter');
         default:
            throw redirect(302, '/dashboard/founder');
      }
   }

   console.log('Showing onboarding page for user');

   return {
      user,
      roles: [
         {
            id: USER_ROLES.FOUNDER,
            title: 'Founder',
            description: 'I\'m building a startup and looking for investors, mentors, and resources',
            icon: '🚀',
            features: [
               'Connect with investors and mentors',
               'Access fundraising tools and resources',
               'Build your startup profile',
               'Get AI-powered insights and feedback'
            ]
         },
         {
            id: USER_ROLES.INVESTOR,
            title: 'Investor',
            description: 'I\'m an investor looking to discover and support promising startups',
            icon: '💰',
            features: [
               'Discover promising startups',
               'Access detailed startup profiles',
               'Connect with founders directly',
               'Track your investment pipeline'
            ]
         },
         {
            id: USER_ROLES.SUPPORT,
            title: 'Supporter',
            description: 'I want to support the startup ecosystem as a mentor, advisor, or service provider',
            icon: '🤝',
            features: [
               'Offer mentorship and guidance',
               'Provide professional services',
               'Connect with the startup community',
               'Share your expertise'
            ]
         }
      ]
   };
};

export const actions: Actions = {
   selectRole: async ({ request, cookies, fetch }) => {
      const formData = await request.formData();
      const role = formData.get('role') as string;

      if (!role || !['founder', 'investor', 'support'].includes(role)) {
         return {
            success: false,
            error: 'Invalid role selected'
         };
      }

      try {
         // Update user role in the backend
         const response = await fetch('/api/update-role', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role })
         });

         if (!response.ok) {
            throw new Error('Failed to update role');
         }

         const result = await response.json();

         // Update user cookie with new role
         const userCookie = cookies.get('user');
         if (userCookie) {
            const user = JSON.parse(userCookie);
            user.role = role;
            cookies.set('user', JSON.stringify(user), {
               path: '/',
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'lax'
            });
         }

         // Redirect to success page with role info
         throw redirect(302, `/onboarding/success?role=${role}`);
      } catch (error) {
         return {
            success: false,
            error: 'Failed to update role. Please try again.'
         };
      }
   }
}; 
