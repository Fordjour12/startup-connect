<script lang="ts">
   import { Progress } from "@/components/ui/progress";
   import {
      onboardingState,
      ONBOARDING_STEPS,
   } from "@/hooks/onboarding-state.svelte";
   import { Button } from "@/components/ui/button";
   import { Check, Lock } from "@lucide/svelte";

   // Get progress from onboarding state
   let progressPercentage = $derived(onboardingState.progress);
   let currentStepIndex = $derived(
      ONBOARDING_STEPS.indexOf(onboardingState.currentStep),
   );

   // Step labels for display - must match ONBOARDING_STEPS exactly
   const stepLabels = [
      "Welcome",
      "Role Selection",
      "Founder Setup",
      "Basic Info",
      "Goals",
      "Skills",
      "Preferences",
      "Review",
      "Completion",
   ];

   // Check if a step is complete
   function isStepComplete(stepIndex: number): boolean {
      const step = ONBOARDING_STEPS[stepIndex];
      return onboardingState.isStepComplete(step);
   }

   // Check if a step can be accessed
   function canAccessStep(stepIndex: number): boolean {
      const step = ONBOARDING_STEPS[stepIndex];
      return onboardingState.canAccessStep(step);
   }

   // Navigate to a specific step
   function goToStep(stepIndex: number) {
      const step = ONBOARDING_STEPS[stepIndex];
      if (onboardingState.canAccessStep(step)) {
         onboardingState.goToStep(step);
      }
   }

   // Get step status for styling
   function getStepStatus(
      stepIndex: number,
   ): "current" | "completed" | "accessible" | "locked" {
      if (stepIndex === currentStepIndex) return "current";
      if (isStepComplete(stepIndex)) return "completed";
      if (canAccessStep(stepIndex)) return "accessible";
      return "locked";
   }
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

   <!-- Interactive Step Indicators -->
   <div class="space-y-2">
      {#each stepLabels as label, index}
         {@const status = getStepStatus(index)}
         {@const isClickable =
            status === "completed" || status === "accessible"}

         <div
            class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 {status ===
            'current'
               ? 'bg-primary/10 border border-primary/20'
               : status === 'completed'
                 ? 'bg-green-50 border border-green-200'
                 : status === 'accessible'
                   ? 'bg-muted/50 border border-muted'
                   : 'bg-muted/20 border border-muted/30'}"
         >
            <!-- Step Number/Icon -->
            <div class="flex-shrink-0">
               {#if status === "completed"}
                  <div
                     class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                     <Check class="w-4 h-4 text-white" />
                  </div>
               {:else if status === "current"}
                  <div
                     class="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                  >
                     <span class="text-sm font-medium text-primary-foreground">
                        {index + 1}
                     </span>
                  </div>
               {:else if status === "accessible"}
                  <div
                     class="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center"
                  >
                     <span class="text-sm font-medium text-muted-foreground">
                        {index + 1}
                     </span>
                  </div>
               {:else}
                  <div
                     class="w-8 h-8 bg-muted-foreground/10 rounded-full flex items-center justify-center"
                  >
                     <Lock class="w-4 h-4 text-muted-foreground" />
                  </div>
               {/if}
            </div>

            <!-- Step Info -->
            <div class="flex-1 min-w-0">
               <h3 class="text-sm font-medium text-foreground truncate">
                  {label}
               </h3>
               <p class="text-xs text-muted-foreground">
                  {#if status === "completed"}
                     ✓ Completed
                  {:else if status === "current"}
                     In progress
                  {:else if status === "accessible"}
                     Ready to start
                  {:else}
                     Complete previous steps first
                  {/if}
               </p>
            </div>

            <!-- Action Button -->
            {#if isClickable}
               <Button
                  variant={status === "completed" ? "outline" : "ghost"}
                  size="sm"
                  onclick={() => goToStep(index)}
                  class="flex-shrink-0"
               >
                  {status === "completed" ? "Edit" : "Start"}
               </Button>
            {/if}
         </div>
      {/each}
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
               {#if isStepComplete(currentStepIndex)}
                  ✓ Step completed! You can continue or go back to edit.
               {:else}
                  Complete this step to continue
               {/if}
            </p>
         </div>
         <div class="text-xs text-muted-foreground">
            {#if isStepComplete(currentStepIndex)}
               ✓ Done
            {:else}
               ~2 min
            {/if}
         </div>
      </div>
   </div>
</div>
