import type { State, User, Credentials, AuthResponse } from "@/types";
import { defineStore } from "pinia";
import { toast } from "vue-sonner";



export const useAuthStore = defineStore("auth", {
    state: (): State => ({
        user: null,
        loading: false,
        error: null,
        token: null,
        authenticated: false,
        ready: false
    }),


    getters: {
        isAuthenticated: (state): boolean => state.authenticated,
        getUser: (state): User | null => state.user,
        isLoading: (state): boolean => state.loading,
        getError: (state): string | null => state.error,
        getToken: (state): string | null => state.token
    },

    actions: {
        async login(credentials: Credentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await $fetch<AuthResponse>('/api/login', {
                    method: 'POST',
                    body: credentials
                });

                if (response) {
                    this.token = response.access_token;
                    this.authenticated = true;
                    sessionStorage.setItem('authToken', this.token);

                    toast('Login successful', {
                        description: 'You have been logged in successfully.',
                    })
                    // Fetch user information
                    await this.fetchUserInformation();
                    return true;
                }

            } catch (error: unknown) {
                this.error = error instanceof Error ? error.message : 'Failed to login';
                toast.error('Login failed', {
                    description: this.error,
                })
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUserInformation() {
            this.loading = true;
            this.error = null;
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {

                const response = await $fetch<User>("/api/me", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(JSON.stringify(response))

                this.user = response;
            } catch (error: unknown) {
                this.error = error instanceof Error ? error.message : 'Failed to fetch user information';
                throw error;
            } finally {
                this.loading = false;
                this.ready = true;
            }
        },

        async logout() {
            this.loading = true;
            this.error = null;

            try {
                // Clear the token cookie
                const tokenCookie = useCookie('auth_token');
                tokenCookie.value = null;

                // Clear the store
                this.user = null;
            } catch (error: unknown) {
                this.error = error instanceof Error ? error.message : 'Failed to logout';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async initializeFromSessionStorage() {
            const token = sessionStorage.getItem('authToken');
            if (token) {
                this.token = token;
                this.authenticated = true;
                try {
                    await this.fetchUserInformation();
                    console.log('Auth store initialized with token, authenticated:', this.authenticated);
                } catch (error) {
                    console.error('Failed to fetch user information:', error);
                    this.authenticated = false;
                    this.token = null;
                    sessionStorage.removeItem('authToken');
                }
            } else {
                console.log('No auth token found in sessionStorage');
                this.authenticated = false;
                this.token = null;
            }
            this.ready = true;
        },

        // Reset store state
        clearStore() {
            this.user = null;
            this.loading = false;
            this.error = null;
        }
    }
});
