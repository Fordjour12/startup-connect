<script lang="ts">
    import type { PageProps } from "./$types";
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import ProgressIndicator from "@/components/onboarding/ProgressIndicator.svelte";
    import WelcomeStep from "@/components/onboarding/steps/WelcomeStep.svelte";
    import RoleSelection from "@/components/onboarding/steps/RoleSelection.svelte";
    import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep.svelte";
    import GoalsStep from "@/components/onboarding/steps/GoalsStep.svelte";
    import SkillsStep from "@/components/onboarding/steps/SkillsStep.svelte";
    import PreferencesStep from "@/components/onboarding/steps/PreferencesStep.svelte";
    import RoleDetailsStep from "@/components/onboarding/steps/RoleDetailsStep.svelte";
    import VerificationStep from "@/components/onboarding/steps/VerificationStep.svelte";
    import ReviewStep from "@/components/onboarding/steps/ReviewStep.svelte";
    import CompletionStep from "@/components/onboarding/steps/CompletionStep.svelte";

    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";

    let { data }: PageProps = $props();

    // Initialize onboarding state with user data if available
    onMount(() => {
        // Load saved progress
        onboardingState.loadProgress().catch((error) => {
            console.error("Failed to load onboarding progress:", error);
            toast.error("Failed to load saved progress. Starting fresh.");
        });

        // Listen for errors from onboarding state
        $effect(() => {
            if (onboardingState.hasErrors()) {
                const errors = Object.values(onboardingState.errors);
                if (errors.length > 0) {
                    const firstError = errors[0];
                    toast.error(firstError.message);
                }
            }
        });
    });

    // Get current step ID for conditional rendering
    let currentStepId = $derived(
        onboardingState.currentStep()?.id || "welcome",
    );

    // Check if we're on the completion step (which has its own navigation)
    // let isCompletionStep = $derived(currentStepId === "completion");
</script>

<div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <!-- Progress Indicator -->
            <ProgressIndicator />

            <!-- Main Content -->
            <div class="mt-8">
                <!-- Loading State -->
                {#if onboardingState.isLoading}
                    <div class="flex items-center justify-center py-12">
                        <div
                            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                        ></div>
                        <span class="ml-3 text-muted-foreground">
                            Loading...
                        </span>
                    </div>
                {:else}
                    <!-- Step Content -->
                    <div class="space-y-6">
                        {#if currentStepId === "welcome"}
                            <WelcomeStep />
                        {:else if currentStepId === "role"}
                            <RoleSelection {data} />
                        {:else if currentStepId === "basicInfo"}
                            <BasicInfoStep {data} />
                        {:else if currentStepId === "goals"}
                            <GoalsStep />
                        {:else if currentStepId === "skills"}
                            <SkillsStep />
                        {:else if currentStepId === "preferences"}
                            <PreferencesStep />
                        {:else if currentStepId === "roleSpecific"}
                            <RoleDetailsStep />
                        {:else if currentStepId === "verification"}
                            <VerificationStep />
                        {:else if currentStepId === "review"}
                            <ReviewStep />
                        {:else if currentStepId === "completion"}
                            <CompletionStep />
                        {:else}
                            <!-- Placeholder for steps not yet implemented -->
                            <div class="text-center space-y-4">
                                <div
                                    class="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center"
                                >
                                    <span class="text-2xl">🚧</span>
                                </div>
                                <h3 class="text-lg font-semibold">
                                    Step in Development
                                </h3>
                                <p class="text-muted-foreground">
                                    This step is currently being implemented.
                                </p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
