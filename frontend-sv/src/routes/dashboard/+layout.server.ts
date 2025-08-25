import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
   // Get data from parent layout
   const { user, isLoggedIn } = await parent();

   // Check if user is authenticated
   if (!isLoggedIn || !user) {
      throw redirect(302, '/login');
   }

   // Return user data for the dashboard layout
   return {
      user: {
         id: user.id,
         email: user.email,
         name: user.name,
         role: user.role,
         profileComplete: true // Default to true for now, can be computed based on user data
      }
   };
};
