import { useAuthStore } from '@/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Add auth store to nuxtApp for easier access
    const auth = useAuthStore();
    nuxtApp.provide('auth', auth);
    
    // Initialize auth state from sessionStorage/localStorage on client side only
    if (process.client) {
        // Use nextTick to ensure this happens after hydration is complete
        await nextTick();
        await auth.initializeFromSessionStorage?.();
    }
});
