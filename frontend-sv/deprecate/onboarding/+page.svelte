<script lang="ts">
    import type { PageProps } from "./$types";
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import ProgressIndicator from "@/components/onboarding/ProgressIndicator.svelte";
    import WelcomeStep from "@/components/onboarding/steps/WelcomeStep.svelte";
    import RoleSelection from "@/components/onboarding/RoleSelection.svelte";
    import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep.svelte";
    import GoalsStep from "@/components/onboarding/steps/GoalsStep.svelte";
    import SkillsStep from "@/components/onboarding/steps/SkillsStep.svelte";
    import PreferencesStep from "@/components/onboarding/steps/PreferencesStep.svelte";
    import RoleDetailsStep from "@/components/onboarding/steps/RoleDetailsStep.svelte";
    import VerificationStep from "@/components/onboarding/steps/VerificationStep.svelte";
    import CompletionStep from "@/components/onboarding/steps/CompletionStep.svelte";
    import Toast from "@/components/ui/toast.svelte";
    import { onMount } from "svelte";

    let { data } = $props();

    // Error handling state
    let showToast = $state(false);
    let toastMessage = $state("");
    let toastType = $state<"success" | "error" | "warning" | "info">("info");

    // Initialize onboarding state with user data if available
    onMount(() => {
        if (data.user) {
            // Map database role to onboarding role
            const roleMapping: Record<
                string,
                "founder" | "investor" | "supporter"
            > = {
                founder: "founder",
                investor: "investor",
                support: "supporter", // Map database 'support' to onboarding 'supporter'
                user: "founder", // Map 'user' role to 'founder' as default for onboarding
            };

            const userRole = data.user.role || "founder";
            const mappedRole = roleMapping[userRole] || "founder";

            onboardingState.updateFormData({
                fullName: data.user.name || "",
                email: data.user.email || "",
                role: mappedRole,
            });
        }

        // Load saved progress
        onboardingState.loadProgress().catch((error) => {
            console.error("Failed to load onboarding progress:", error);
            showError("Failed to load saved progress. Starting fresh.");
        });

        // Listen for errors from onboarding state
        $effect(() => {
            if (onboardingState.hasErrors()) {
                const errors = Object.values(onboardingState.errors);
                if (errors.length > 0) {
                    const firstError = errors[0];
                    showError(firstError.message);
                }
            }
        });
    });

    function showError(message: string) {
        toastMessage = message;
        toastType = "error";
        showToast = true;
    }

    function showSuccess(message: string) {
        toastMessage = message;
        toastType = "success";
        showToast = true;
    }

    function handleToastClose() {
        showToast = false;
    }

    // Get current step ID for conditional rendering
    let currentStepId = $derived(
        onboardingState.currentStep()?.id || "welcome",
    );

    // Check if we're on the completion step (which has its own navigation)
    let isCompletionStep = $derived(currentStepId === "completion");
</script>

<!-- Toast Notification -->
<Toast
    bind:show={showToast}
    message={toastMessage}
    type={toastType}
    on:close={handleToastClose}
/>

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
                        <span class="ml-3 text-muted-foreground"
                            >Loading...</span
                        >
                    </div>
                {:else}
                    <!-- Step Content -->
                    <div class="space-y-6">
                        {#if currentStepId === "welcome"}
                            <WelcomeStep />
                        {:else if currentStepId === "role"}
                            <RoleSelection {data} />
                        {:else if currentStepId === "basicInfo"}
                            <BasicInfoStep />
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

                    <!-- Navigation - Only show if not on completion step -->
                    {#if !isCompletionStep}
                        <div
                            class="flex justify-between items-center mt-8 pt-6 border-t"
                        >
                            <button
                                class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                onclick={() => onboardingState.previousStep()}
                                disabled={!onboardingState.canGoPrevious}
                            >
                                ← Previous
                            </button>

                            <div class="flex items-center space-x-3">
                                {#if onboardingState.currentStep()?.canSkip}
                                    <button
                                        class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        onclick={() =>
                                            onboardingState.skipCurrentStep()}
                                    >
                                        Skip for now
                                    </button>
                                {/if}

                                <button
                                    class="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onclick={() => onboardingState.nextStep()}
                                    disabled={!onboardingState.canGoNext}
                                >
                                    {onboardingState.isComplete
                                        ? "Complete"
                                        : "Next"}
                                </button>
                            </div>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>
