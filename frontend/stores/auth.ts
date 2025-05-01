import { defineStore } from "pinia";
import { toast } from "vue-sonner";

interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
}

interface Credentials {
    email: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
}

interface State {
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
}

export const useAuthStore = defineStore("auth", {
    state: (): State => ({
        user: null,
        loading: false,
        error: null,
        token: null
    }),


    getters: {
        isAuthenticated: (state): boolean => !!state.user,
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
                    // Store token in a cookie that's accessible in SSR
                    const tokenCookie = useCookie('auth_token', {
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    });
                    tokenCookie.value = response.access_token;

                    toast('Login successful', {
                        description: 'You have been logged in successfully.',
                    })
                }

                // Store token in the store
                this.token = response.access_token;

                console.log(this.token)
                // Fetch user information
                await this.fetchUserInformation(this.token);

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

        async fetchUserInformation(token: string) {
            this.loading = true;
            this.error = null;
            this.token = token;


            try {
                // Get the token from the cookie directly

                // if (!token) {
                //     throw new Error('No authentication token found');
                // }

                const response = await $fetch<User>('http://localhost:8000/api/v1/users/me', {
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

        // Reset store state
        clearStore() {
            this.user = null;
            this.loading = false;
            this.error = null;
        }
    }
});
