import type { StartupDetails } from '@/types/startup';

interface StartupActionsState {
	isPublishing: boolean;
	isUnpublishing: boolean;
	isDeleting: boolean;
	error: string | null;
	success: string | null;
}

// Create shared reactive state using $state rune
const state = $state<StartupActionsState>({
	isPublishing: false,
	isUnpublishing: false,
	isDeleting: false,
	error: null,
	success: null,
});

// Helper functions to manage state
function clearMessages() {
	state.error = null;
	state.success = null;
}

function setError(error: string) {
	state.error = error;
	state.success = null;
}

function setSuccess(success: string) {
	state.success = success;
	state.error = null;
}

// Main actions
async function publishStartup(startupId: string): Promise<StartupDetails | null> {
	try {
		state.isPublishing = true;
		state.error = null;
		state.success = null;

		const response = await fetch(`/api/publish`, {
			method: 'PUT',
			body: JSON.stringify({
				startup_id: startupId,
				// is_published: true,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to publish startup');
		}

		const data = await response.json();

		setSuccess(data.message || 'Startup published successfully!');
		state.isPublishing = false;

		return data.startup;
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Failed to publish startup';
		setError(errorMessage);
		state.isPublishing = false;
		return null;
	}
}

async function unpublishStartup(startupId: string): Promise<StartupDetails | null> {
	try {
		state.isUnpublishing = true;
		state.error = null;
		state.success = null;

		const response = await fetch(`/api/unpublish`, {
			method: 'PUT',
			body: JSON.stringify({
				startup_id: startupId,
				// is_published: false,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to unpublish startup');
		}

		const data = await response.json();

		setSuccess(data.message || 'Startup unpublished successfully!');
		state.isUnpublishing = false;

		return data.startup;
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Failed to unpublish startup';
		setError(errorMessage);
		state.isUnpublishing = false;
		return null;
	}
}

// async function deleteStartup(startupId: string): Promise<boolean> {
// 	try {
// 		state.isDeleting = true;
// 		state.error = null;
// 		state.success = null;

// 		const response = await StartupApi.delete(startupId);

// 		setSuccess(response.message || 'Startup deleted successfully!');
// 		state.isDeleting = false;

// 		return true;
// 	} catch (err) {
// 		const errorMessage = err instanceof Error ? err.message : 'Failed to delete startup';
// 		setError(errorMessage);
// 		state.isDeleting = false;
// 		return false;
// 	}
// }

// Derived state for convenience (if needed)
const isLoading = $derived(state.isPublishing || state.isUnpublishing);
const hasError = $derived(!!state.error);
const hasSuccess = $derived(!!state.success);

// Export the state and actions
export function useStartupActions() {
	return {
		// Reactive state - components can directly access these
		get isPublishing() { return state.isPublishing; },
		get isUnpublishing() { return state.isUnpublishing; },
		// get isDeleting() { return state.isDeleting; },
		get error() { return state.error; },
		get success() { return state.success; },
		get isLoading() { return isLoading; },
		get hasError() { return hasError; },
		get hasSuccess() { return hasSuccess; },

		// Actions
		publishStartup,
		unpublishStartup,
		// deleteStartup,
		clearMessages,
	};
} 