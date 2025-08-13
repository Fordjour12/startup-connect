<script lang="ts">
    import {
        onboardingState,
        ONBOARDING_STEPS,
    } from "@/hooks/onboarding-state.svelte";
    import WelcomeStep from "@/components/onboarding/steps/WelcomeStep.svelte";
    import RoleSelection from "@/components/onboarding/steps/RoleSelection.svelte";
    import FounderSetupStep from "@/components/onboarding/steps/FounderSetupStep.svelte";
    import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep.svelte";
    import GoalsStep from "@/components/onboarding/steps/GoalsStep.svelte";
    import SkillsStep from "@/components/onboarding/steps/SkillsStep.svelte";
    import PreferencesStep from "@/components/onboarding/steps/PreferencesStep.svelte";
    import ReviewStep from "@/components/onboarding/steps/ReviewStep.svelte";
    import CompletionStep from "@/components/onboarding/steps/CompletionStep.svelte";
    import { ONBOARDING_ROLES } from "@/hooks/onboarding-state.svelte";
    import { USER_ROLES } from "@/db/schema/auth-schema";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    // Track if user should be redirected
    let shouldRedirect = $state(false);
    let redirectPath = $state<string | null>(null);

    // Check if user should be redirected to role-specific onboarding
    $effect(() => {
        if (data.user?.role) {
            if (data.user.role === USER_ROLES.INVESTOR) {
                shouldRedirect = true;
                redirectPath = "/onboarding/investor";
            } else if (data.user.role === USER_ROLES.SUPPORT) {
                shouldRedirect = true;
                redirectPath = "/onboarding/support";
            }
        }
    });

    // Perform redirect when needed
    $effect(() => {
        if (shouldRedirect && redirectPath && typeof window !== "undefined") {
            window.location.href = redirectPath;
        }
    });

    // Data for each step
    let stepData = {
        welcome: {},
        roleSelection: {
            roles: ONBOARDING_ROLES,
        },
        basicInfo: {
            user: data.user,
        },
        goals: {},
        skills: {},
        preferences: {},
        review: {
            formData: onboardingState.formData,
        },
        completion: {},
    };

    // Check if current step should be shown for the user's role
    function shouldShowCurrentStep(): boolean {
        const currentStep = onboardingState.currentStep;
        const userRole = onboardingState.formData.role;

        // Show founder-setup only for founders
        if (currentStep === "founder-setup" && userRole !== "founder") {
            return false;
        }

        return true;
    }
</script>

{#if shouldRedirect}
    <!-- Show loading state while redirecting -->
    <div class="min-h-screen bg-background flex items-center justify-center">
        <div class="text-center space-y-4">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
            ></div>
            <p class="text-muted-foreground">
                Redirecting to your onboarding...
            </p>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-background flex flex-col">
        <header class="border-b">
            <div class="container flex h-16 items-center justify-between px-4">
                <div class="flex items-center gap-2">
                    <a href="/" class="flex items-center gap-2 font-semibold">
                        <span>StartupConnect</span>
                    </a>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-muted-foreground">
                        Step {ONBOARDING_STEPS.indexOf(
                            onboardingState.currentStep,
                        ) + 1} of
                        {ONBOARDING_STEPS.length}
                    </span>
                </div>
            </div>
        </header>

        <main class="flex-1 container py-8">
            <div class="max-w-2xl mx-auto">
                <div class="mt-8">
                    {#if onboardingState.currentStep === "welcome"}
                        <WelcomeStep />
                    {:else if onboardingState.currentStep === "role-selection"}
                        <RoleSelection data={stepData.roleSelection} />
                    {:else if onboardingState.currentStep === "founder-setup" && onboardingState.formData.role === "founder"}
                        <FounderSetupStep />
                    {:else if onboardingState.currentStep === "basic-info"}
                        <BasicInfoStep data={stepData.basicInfo} />
                    {:else if onboardingState.currentStep === "goals"}
                        <GoalsStep />
                    {:else if onboardingState.currentStep === "skills"}
                        <SkillsStep />
                    {:else if onboardingState.currentStep === "preferences"}
                        <PreferencesStep />
                    {:else if onboardingState.currentStep === "review"}
                        <ReviewStep />
                    {:else if onboardingState.currentStep === "completion"}
                        <CompletionStep />
                    {/if}
                </div>
            </div>
        </main>
    </div>
{/if}
