import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { USER_ROLES } from '@/db/schema/auth-schema';

export const load: PageServerLoad = async ({ cookies, url }) => {
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

   // Get role from URL params or user data
   const role = url.searchParams.get('role') || user.role;

   // Determine redirect path based on role
   let redirectPath: string;
   let roleDisplayName: string;

   switch (role) {
      case USER_ROLES.INVESTOR:
         redirectPath = '/dashboard/investor';
         roleDisplayName = 'Investor';
         break;
      case USER_ROLES.SUPPORT:
         redirectPath = '/dashboard/supporter';
         roleDisplayName = 'Supporter';
         break;
      default:
         redirectPath = '/dashboard/founder';
         roleDisplayName = 'Founder';
         break;
   }

   return {
      role: roleDisplayName,
      redirectPath
   };
}; 
