import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiEndpoint } from '@/endpoints';

export const getUserDetails: Handle = async ({ event, resolve }) => {
  // Skip authentication check for login page and other auth-related routes
  if (event.url.pathname.startsWith('/login') ||
    event.url.pathname.startsWith('/register') ||
    event.url.pathname.startsWith('/forgot-password') ||
    event.url.pathname.startsWith('/reset-password')) {
    return resolve(event);
  }

  const accessToken = event.cookies.get('access_token');

  // If no access token, redirect to login
  if (!accessToken) {
    throw redirect(302, '/login');
  }

  try {
    const user = await event.fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_USER}`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${accessToken}`
      }
    });

    if (!user.ok) {
      // Clear the invalid token
      event.cookies.delete('access_token', { path: '/' });
      throw redirect(302, '/login');
    }

    const userData = await user.json();

    // Check for specific error message
    if (userData.detail === 'Invalid Credentials Validation') {
      // Clear the invalid token
      event.cookies.delete('access_token', { path: '/' });
      throw redirect(302, '/login');
    }

    console.log("hook user", userData);
    event.locals.user = userData;

  } catch (error) {
    // If it's already a redirect, re-throw it
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }

    // For any other error, clear token and redirect to login
    console.error('Authentication error:', error);
    event.cookies.delete('access_token', { path: '/' });
    throw redirect(302, '/login');
  }

  return resolve(event);
};

export const roleBasedRouteProtection: Handle = async ({ event, resolve }) => {
  const user = event.locals.user;

  // Only apply role-based protection to dashboard routes
  if (event.url.pathname.startsWith('/dashboard/')) {
    if (!user) {
      throw redirect(302, '/login');
    }

    // Protect founder dashboard
    if (event.url.pathname.startsWith('/dashboard/founder')) {
      if (user.role !== 'FOUNDER' && user.role !== 'founder') {
        // Redirect to their correct dashboard or unauthorized page
        if (user.role === 'INVESTOR' || user.role === 'investor') {
          throw redirect(302, '/dashboard/investor');
        } else {
          throw redirect(302, '/unauthorized');
        }
      }
    }

    // Protect investor dashboard
    if (event.url.pathname.startsWith('/dashboard/investor')) {
      if (user.role !== 'INVESTOR' && user.role !== 'investor') {
        // Redirect to their correct dashboard or unauthorized page
        if (user.role === 'FOUNDER' || user.role === 'founder') {
          throw redirect(302, '/dashboard/founder');
        } else {
          throw redirect(302, '/unauthorized');
        }
      }
    }
  }

  return resolve(event);
};

export const handle = sequence(getUserDetails, roleBasedRouteProtection);
