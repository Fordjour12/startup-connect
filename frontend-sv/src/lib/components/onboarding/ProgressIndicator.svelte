<script lang="ts">
   import { Progress } from "@/components/ui/progress";
   import {
      onboardingState,
      ONBOARDING_STEPS,
   } from "@/hooks/onboarding-state.svelte";

   // Get progress from onboarding state
   let progressPercentage = $derived(onboardingState.progress);
   let currentStepIndex = $derived(
      ONBOARDING_STEPS.indexOf(onboardingState.currentStep),
   );

   // Step labels for display
   const stepLabels = [
      "Welcome",
      "Role Selection",
      "Role Details",
      "Basic Info",
      "Goals",
      "Skills",
      "Preferences",
      "Review",
      "Completion",
   ];
</script>

<div class="w-full space-y-4">
   <!-- Progress Header -->
   <div class="flex items-center justify-between">
      <div class="space-y-1">
         <h2 class="text-lg font-semibold text-foreground">
            {stepLabels[currentStepIndex] || "Onboarding"}
         </h2>
         <p class="text-sm text-muted-foreground">
            Complete your profile setup
         </p>
      </div>
      <div class="text-right">
         <p class="text-sm font-medium text-foreground">
            Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
         </p>
         <p class="text-xs text-muted-foreground">
            {progressPercentage}% complete
         </p>
      </div>
   </div>

   <!-- Progress Bar -->

   <div class="space-y-2">
      <Progress value={progressPercentage} class="h-2" />
   </div>

   <!-- Current Step Info -->
   <div class="mt-4 p-4 bg-muted/50 rounded-lg">
      <div class="flex items-center space-x-2">
         <div
            class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
         >
            <span class="text-sm font-medium text-primary">
               {currentStepIndex + 1}
            </span>
         </div>
         <div class="flex-1">
            <h3 class="text-sm font-medium text-foreground">
               {stepLabels[currentStepIndex]}
            </h3>
            <p class="text-xs text-muted-foreground">
               Complete this step to continue
            </p>
         </div>
         <div class="text-xs text-muted-foreground">~2 min</div>
      </div>
   </div>
</div>
