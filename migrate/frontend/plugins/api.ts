import type { FetchOptions } from 'ofetch';
import { useAuthStore } from '@/stores/auth';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  statusMessage?: string;
}

export default defineNuxtPlugin((_nuxtApp) => {
  const { $fetch } = useNuxtApp();
  const fetchTyped = $fetch as typeof import('ofetch').$fetch;
  const authStore = useAuthStore();

  const ApiFetchWithAuth = async <T>(
    url: string,
    options: FetchOptions<'json'> = {}
  ): Promise<T> => {
    const customOptions: FetchOptions<'json'> = {
      ...options,
      method: (options.method?.toUpperCase() as HttpMethod) || 'GET',
      responseType: 'json',
    };

    // Add authorization header if token exists
    if (authStore.token) {
      customOptions.headers = {
        ...(customOptions.headers || {}),
        Authorization: `Bearer ${authStore.token}`,
      };
    }

    try {
      return await fetchTyped<T>(url, customOptions);
    } catch (error) {
      const apiError = error as ApiError;

      // Handle different error scenarios
      if (apiError.status === 401 || apiError.statusCode === 401) {
        // Clear auth store and redirect to login
        authStore.clearStore();
        navigateTo('/login');
        throw new Error('Session expired. Please login again.');
      }

      if (apiError.status === 403 || apiError.statusCode === 403) {
        throw new Error('You do not have permission to perform this action.');
      }

      if (apiError.status === 404 || apiError.statusCode === 404) {
        throw new Error('The requested resource was not found.');
      }

      if (apiError.status === 422 || apiError.statusCode === 422) {
        throw new Error('Invalid data provided. Please check your input.');
      }

      // Handle network errors
      if (!apiError.status && !apiError.statusCode) {
        throw new Error('Network error. Please check your connection.');
      }

      // Handle any other errors
      throw new Error(
        apiError.statusMessage ||
        apiError.message ||
        'An unexpected error occurred'
      );
    }
  };

  return {
    provide: {
      ApiFetchWithAuth,
    },
  };
});
