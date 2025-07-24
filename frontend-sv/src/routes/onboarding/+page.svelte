<script lang="ts">
   import type { PageProps } from "./$types";
   import { onboardingState } from "@/components/onboarding/onboarding-state.svelte";
   import ProgressIndicator from "@/components/onboarding/ProgressIndicator.svelte";
   import WelcomeStep from "@/components/onboarding/steps/WelcomeStep.svelte";
   import RoleSelection from "@/components/onboarding/RoleSelection.svelte";
   import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep.svelte";
   import GoalsStep from "@/components/onboarding/steps/GoalsStep.svelte";
   import CompletionStep from "@/components/onboarding/steps/CompletionStep.svelte";
   import { onMount } from "svelte";

   let { data }: PageProps = $props();

   // Initialize onboarding state with user data if available
   onMount(() => {
      if (data.user) {
         onboardingState.updateFormData({
            fullName: data.user.full_name || '',
            email: data.user.email || '',
            role: data.user.role || 'founder'
         });
      }
   });

   // Get current step ID
   let currentStepId = $derived(onboardingState.currentStep.id);
</script>

<div
   class="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
   <!-- Left Sidebar -->
   <div
      class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
   >
      <div class="absolute inset-0 bg-primary"></div>
      <div class="relative z-20 flex items-center text-lg font-medium">
         <img src="/logo.svg" alt="Logo" class="h-8 w-8 mr-2" />
         StartupConnect
      </div>
      
      <!-- Progress Indicator for Desktop -->
      <div class="relative z-20 mt-8">
         <ProgressIndicator showStepNumbers={true} showProgressBar={true} />
      </div>
      
      <div class="relative z-20 mt-auto">
         <blockquote class="space-y-2">
            <p class="text-lg">
               "Connect with founders, investors, and supporters to grow your startup ecosystem."
            </p>
            <footer class="text-sm">Your journey starts here</footer>
         </blockquote>
      </div>
   </div>

   <!-- Main Content -->
   <div class="lg:p-8">
      <div
         class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]"
      >
         <!-- Mobile Progress Indicator -->
         <div class="lg:hidden">
            <ProgressIndicator showStepNumbers={false} showProgressBar={true} />
         </div>

         <!-- Step Content -->
         <div class="space-y-6">
            {#if currentStepId === 'welcome'}
               <WelcomeStep {data} />
            {:else if currentStepId === 'role'}
               <RoleSelection {data} />
            {:else if currentStepId === 'basicInfo'}
               <BasicInfoStep {data} />
            {:else if currentStepId === 'goals'}
               <GoalsStep {data} />
            {:else if currentStepId === 'verification'}
               <CompletionStep {data} />
            {:else}
               <!-- Placeholder for steps not yet implemented -->
               <div class="text-center space-y-4">
                  <div class="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                     <span class="text-2xl">🚧</span>
                  </div>
                  <h2 class="text-2xl font-semibold">Coming Soon</h2>
                  <p class="text-muted-foreground">
                     This step is being implemented. Please check back soon!
                  </p>
                  <div class="flex justify-center space-x-2">
                     <button
                        class="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                        onclick={() => onboardingState.nextStep()}
                     >
                        Skip for now
                     </button>
                  </div>
               </div>
            {/if}
         </div>
      </div>
   </div>
</div>

<style>
   /* Add smooth transitions between steps */
   :global(.step-transition) {
      transition: opacity 0.3s ease-in-out;
   }
</style>
