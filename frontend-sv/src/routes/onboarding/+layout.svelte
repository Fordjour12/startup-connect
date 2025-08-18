<script lang="ts">
   import { onboardingState } from "@/hooks/onboarding-state.svelte";
   import ProgressIndicator from "@/components/onboarding/ProgressIndicator.svelte";
   import { beforeNavigate } from "$app/navigation";
   import { ONBOARDING_STEPS } from "@/hooks/onboarding-state.svelte";
   import { onMount } from "svelte";

   let { children } = $props();

   // Load saved progress when component mounts
   onMount(() => {
      const progressLoaded = onboardingState.loadProgress();
      if (progressLoaded) {
         console.log(
            "Resumed onboarding from step:",
            onboardingState.currentStep,
         );
      }
   });

   // Reset onboarding state when navigating away
   beforeNavigate(() => {
      // We could persist state here if needed
   });
</script>

<main class=" min-h-screen bg-background container mx-auto py-8">
   <div>
      <ProgressIndicator />
      <div class="mt-8">
         {@render children?.()}
      </div>
   </div>
</main>
