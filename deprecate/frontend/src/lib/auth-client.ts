import { createAuthClient } from "better-auth/svelte";
import { env } from "$env/dynamic/public";
import { adminClient } from "better-auth/client/plugins";
import { writable } from "svelte/store";

export const authClient = createAuthClient({
  baseURL: env.PUBLIC_BASE_API_URL,
  fetchOptions: {},
  plugins: [
    adminClient()
  ],
});

// Session store for client-side state management
export const sessionStore = writable<any>(null);

// Helper function to get current session
export function getCurrentSession() {
  try {
    const session = authClient.useSession();
    sessionStore.set(session);
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    sessionStore.set(null);
    return null;
  }
}

// Helper function to sign out
export async function signOut() {
  try {
    await authClient.signOut();
    sessionStore.set(null);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Initialize session on client side
if (typeof window !== 'undefined') {
  getCurrentSession();
}
