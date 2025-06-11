/**
 * Recommendation Summary:
 * Best Approach: Keep +page.server.ts + Optional Client Store
 * Keep your current +page.server.ts - This gives you:
 * Fast initial page load with server-rendered content
 * SEO benefits
 * No loading spinners on first visit
 * Add the optional client-side store (like I just showed) if you need:
 * Real-time data updates
 * Client-side state management
 * Optimistic updates
 * Refresh functionality
 * When to use each approach:
 * Approach	Use When
 * +page.server.ts	✅ Public page
 * +page.ts	❌ Avoid for startup profiles
 * Hybrid (both)	✅ Need both SSR + real-time updates
 * 
 */

import { ApiEndpoint } from '@/endpoints';
import type { StartupDetails } from '@/types/startup';
import { writable } from 'svelte/store';

interface StartupStore {
	startup: StartupDetails | null;
	isLoading: boolean;
	error: string | null;
}

function createStartupStore() {
	const { subscribe, set, update } = writable<StartupStore>({
		startup: null,
		isLoading: false,
		error: null
	});

	return {
		subscribe,

		// Initialize with server data
		initialize: (startup: StartupDetails) => {
			set({ startup, isLoading: false, error: null });
		},

		// Fetch startup data client-side
		async fetch(startupId: string) {
			update(state => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await fetch(
					ApiEndpoint.GET_STARTUP_DETAILS.replace('{startup_id}', startupId),
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch startup: ${response.statusText}`);
				}

				const startup: StartupDetails = await response.json();
				set({ startup, isLoading: false, error: null });
				return startup;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to fetch startup';
				update(state => ({ ...state, isLoading: false, error }));
				throw err;
			}
		},

		// Update specific fields
		updateField: (field: keyof StartupDetails, value: any) => {
			update(state => ({
				...state,
				startup: state.startup ? { ...state.startup, [field]: value } : null
			}));
		},

		// Clear store
		clear: () => {
			set({ startup: null, isLoading: false, error: null });
		}
	};
}

export const startupStore = createStartupStore();