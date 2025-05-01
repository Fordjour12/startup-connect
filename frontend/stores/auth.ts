import { defineStore } from "pinia";

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
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    token: null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    getUser: (state): User | null => state.user,
    isLoading: (state): boolean => state.loading,
    getError: (state): string | null => state.error
  },

  actions: {
    async login(credentials: Credentials) {
      this.loading = true;
      this.error = null;

      console.log(credentials)

      try {
        console.log("hitting login")
        const response = await $fetch<AuthResponse>('/api/login', {
          method: 'POST',
          body: credentials
        });

        this.token = response.access_token;

        console.log(response)
        // Fetch user information with the new token
        // await this.fetchUserInformation();

      } catch (error: unknown) {
        this.error = error instanceof Error ? error.message : 'Failed to login';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserInformation() {
      if (!this.token) {
        this.error = 'No authentication token';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<User>('/api/user', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

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
        if (this.token) {
          await $fetch('/api/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
        }

        // Clear the store
        this.token = null;
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
      this.token = null;
      this.user = null;
      this.loading = false;
      this.error = null;
    }
  }
});
