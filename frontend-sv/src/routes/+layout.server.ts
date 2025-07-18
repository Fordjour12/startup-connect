// import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = async ({ cookies }) => {
//   // this is stupid use locals
//   // Get user data from cookie
//   const userCookie = cookies.get('user');
//   const accessToken = cookies.get('access_token');

//   let user = null;

//   if (userCookie) {
//     try {
//       user = JSON.parse(userCookie);
//     } catch (error) {
//       console.error('Error parsing user cookie:', error);
//       // Clear invalid cookie
//       cookies.delete('user', { path: '/' });
//     }
//   }

//   return {
//     user,
//     isAuthenticated: !!accessToken && !!user
//   };
// }
