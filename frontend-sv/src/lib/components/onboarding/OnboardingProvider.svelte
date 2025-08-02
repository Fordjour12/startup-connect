<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { onboardingState } from "@/hooks/onboarding-state.svelte";

	// Props
	let { children } = $props();

	onMount(() => {
		// Initialize onboarding state
		onboardingState.loadProgress().catch((error) => {
			console.error("Failed to load onboarding progress:", error);
		});
	});

	onDestroy(() => {
		// Clean up the onboarding state when component is destroyed
		onboardingState.destroy();
	});
</script>

{@render children()}
