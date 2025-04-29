import { useAuthStore } from '@/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Get the auth store instance
  const auth = useAuthStore();

  // Add auth store to nuxtApp for easier access
  nuxtApp.provide('auth', auth);

  try {
    // Check if we have a token in storage
    const token = useCookie('auth_token').value;
    
    if (token) {
      // Set the token in store
      auth.token = token;
      // Fetch user information
      await auth.fetchUserInformation();
    }
  } catch (error) {
    // If there's an error, clear the auth state
    auth.clearStore();
    console.error('Failed to initialize auth:', error);
  }
}); 