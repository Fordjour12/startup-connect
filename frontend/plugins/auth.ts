import { useAuthStore } from '@/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Get the auth store instance
    const auth = useAuthStore();

    // Add auth store to nuxtApp for easier access
    nuxtApp.provide('auth', auth);

    try {
        // Check if we have a token in cookies
        const tokenCookie = useCookie('auth_token');
        console.log("puligin auth", tokenCookie.value);

        if (tokenCookie.value) {
            // Fetch user information
            await auth.fetchUserInformation(tokenCookie.value);
        }
    } catch (error) {
        // If there's an error, clear the auth state
        auth.clearStore();
        console.error('Failed to initialize auth:', error);
    }
});
