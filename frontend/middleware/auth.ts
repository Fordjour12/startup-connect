import { useAuthStore } from '@/stores/auth';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware((
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
) => {
  const authStore = useAuthStore();

  // Public routes that don't need authentication check
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  
  // Routes that should redirect to dashboard if user is already authenticated
  const authRoutes = ['/login', '/register'];

  // Check if it's an auth route
  const isAuthRoute = authRoutes.includes(to.path);

  // Check if route requires authentication
  const requiresAuth = !publicRoutes.includes(to.path);

  try {
    // If user is not authenticated and trying to access a protected route
    if (!authStore.isAuthenticated && requiresAuth) {
      // Store the intended destination for post-login redirect
      const redirect = to.fullPath;
      return navigateTo(`/login?redirect=${encodeURIComponent(redirect)}`);
    }

    // If user is authenticated and trying to access auth pages (login, register)
    if (authStore.isAuthenticated && isAuthRoute) {
      // Redirect to dashboard or home
      return navigateTo('/dashboard');
    }

    // Allow navigation to proceed
    return;
  } catch (error) {
    console.error('Auth middleware error:', error);
    // On any error, redirect to login
    return navigateTo('/login');
  }
});
