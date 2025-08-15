<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { useOnboarding } from "@/hooks/onboarding-state.svelte";
    import { Button } from "@/components/ui/button";
    import { Progress } from "@/components/ui/progress";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { ArrowLeft, ArrowRight, Save, CheckCircle } from "@lucide/svelte";

    // Step components (we'll create these next)
    import WelcomeStep from "./steps/WelcomeStep.svelte";
    import RoleSelectionStep from "./steps/RoleSelectionStep.svelte";
    import BasicInfoStep from "./steps/BasicInfoStep.svelte";
    import RoleSpecificStep from "./steps/RoleSpecificStep.svelte";
    import GoalsStep from "./steps/GoalsStep.svelte";
    import SkillsStep from "./steps/SkillsStep.svelte";
    import PreferencesStep from "./steps/PreferencesStep.svelte";
    import ReviewStep from "./steps/ReviewStep.svelte";
    import CompletionStep from "./steps/CompletionStep.svelte";

    const onboarding = useOnboarding(
        page.data.user
            ? { name: page.data.user.name, email: page.data.user.email }
            : undefined,
    );

    let isLoading = $state(false);
    let showSaveIndicator = $state(false);

    // Auto-save functionality
    $effect(() => {
        if (onboarding.isSaving) {
            $inspect("saving-state", true);
            showSaveIndicator = true;
            setTimeout(() => {
                showSaveIndicator = false;
            }, 2000);
        }
    });

    // Handle browser back/forward buttons
    onMount(() => {
        const handlePopState = (event: PopStateEvent) => {
            const urlStep = page.url.searchParams.get("step");
            if (urlStep && urlStep !== onboarding.currentStep) {
                onboarding.currentStep = urlStep as any;
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    });

    // Update URL when step changes
    $effect(() => {
        const url = new URL(page.url);
        url.searchParams.set("step", onboarding.currentStep);
        history.replaceState(history.state, "", url);
    });

    async function handleNext() {
        isLoading = true;
        try {
            await onboarding.goNext();
        } finally {
            isLoading = false;
        }
    }

    async function handleBack() {
        isLoading = true;
        try {
            await onboarding.goBack();
        } finally {
            isLoading = false;
        }
    }

    async function handleStepClick(step: typeof onboarding.currentStep) {
        if (onboarding.canNavigateToStep(step)) {
            isLoading = true;
            try {
                await onboarding.goToStep(step);
            } finally {
                isLoading = false;
            }
        }
    }

    function getStepComponent(step: typeof onboarding.currentStep) {
        switch (step) {
            case "welcome":
                return WelcomeStep;
            case "role-selection":
                return RoleSelectionStep;
            case "basic-info":
                return BasicInfoStep;
            case "role-specific":
                return RoleSpecificStep;
            case "goals":
                return GoalsStep;
            case "skills":
                return SkillsStep;
            case "preferences":
                return PreferencesStep;
            case "review":
                return ReviewStep;
            case "completion":
                return CompletionStep;
            default:
                return WelcomeStep;
        }
    }

    // Prevent accidental navigation away
    onMount(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (
                onboarding.hasUnsavedChanges() &&
                onboarding.currentStep !== "completion"
            ) {
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    });
</script>

<svelte:head>
    <title>Get Started - Startup Connect</title>
    <meta
        name="description"
        content="Set up your Startup Connect profile in just a few minutes"
    />
</svelte:head>

<div class="min-h-screen bg-background">
    <!-- Header with Progress -->
    <header
        class="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
    >
        <div class="max-w-6xl mx-auto px-4 py-2">
            <!-- Progress Section -->
            <div class="mb-3">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-bold text-foreground">
                        {onboarding.getStepTitle(onboarding.currentStep)}
                    </h1>

                    <!-- Save Indicator -->
                    {#if showSaveIndicator}
                        <div
                            class="flex items-center gap-2 text-sm text-accent"
                        >
                            <CheckCircle class="w-4 h-4" />
                            Progress saved
                        </div>
                    {/if}
                </div>

                <p class="text-muted-foreground mb-4">
                    {onboarding.getStepDescription(onboarding.currentStep)}
                </p>

                <!-- Progress Bar -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-muted-foreground">
                            Step {onboarding.currentStepIndex + 1} of {onboarding.totalSteps}
                        </span>
                        <span class="text-muted-foreground">
                            {onboarding.progressPercentage}% complete
                        </span>
                    </div>
                    <Progress
                        value={onboarding.progressPercentage}
                        class="h-2"
                    />
                </div>
            </div>

            <!-- Step Navigation Pills -->
            <div class="flex flex-wrap gap-2">
                {#each onboarding.availableSteps as step, index}
                    <button
                        onclick={() => handleStepClick(step)}
                        disabled={!onboarding.canNavigateToStep(step) ||
                            isLoading}
                        class="group relative"
                    >
                        <Badge
                            variant={step === onboarding.currentStep
                                ? "default"
                                : onboarding.stepCompletion[step]
                                  ? "secondary"
                                  : "outline"}
                            class="cursor-pointer transition-all duration-200 {onboarding.canNavigateToStep(
                                step,
                            )
                                ? 'hover:scale-105'
                                : 'opacity-50 cursor-not-allowed'}"
                        >
                            <span class="flex items-center gap-1">
                                {#if onboarding.stepCompletion[step]}
                                    <CheckCircle class="w-3 h-3" />
                                {/if}
                                {index + 1}. {onboarding.getStepTitle(step)}
                            </span>
                        </Badge>

                        <!-- Tooltip -->
                        {#if !onboarding.canNavigateToStep(step)}
                            <div
                                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                            >
                                Complete previous steps first
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
        <Card>
            <CardContent class="p-8">
                <!-- Step Content -->
                <div class="min-h-[400px] flex flex-col">
                    {#if isLoading}
                        <div class="flex-1 flex items-center justify-center">
                            <div
                                class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                            ></div>
                        </div>
                    {:else if getStepComponent(onboarding.currentStep)}
                        {@const StepComponent = getStepComponent(
                            onboarding.currentStep,
                        )}
                        <StepComponent {onboarding} />
                    {/if}
                </div>

                <!-- Navigation Buttons -->
                {#if onboarding.currentStep !== "completion"}
                    <div
                        class="flex items-center justify-between pt-8 border-t"
                    >
                        <Button
                            variant="outline"
                            onclick={handleBack}
                            disabled={!onboarding.canGoBack || isLoading}
                            class="flex items-center gap-2"
                        >
                            <ArrowLeft class="w-4 h-4" />
                            Back
                        </Button>

                        <div class="flex items-center gap-3">
                            <!-- Manual Save Button -->
                            <Button
                                variant="ghost"
                                onclick={() => onboarding.saveProgress()}
                                disabled={onboarding.isSaving}
                                class="flex items-center gap-2"
                            >
                                <Save class="w-4 h-4" />
                                {onboarding.isSaving
                                    ? "Saving..."
                                    : "Save Progress"}
                            </Button>

                            <!-- Next/Submit Button -->
                            {#if onboarding.currentStep === "review"}
                                <Button
                                    onclick={() =>
                                        onboarding.submitOnboarding()}
                                    disabled={!onboarding.canGoForward ||
                                        onboarding.isLoading}
                                    class="flex items-center gap-2 bg-accent hover:bg-accent/90"
                                >
                                    {onboarding.isLoading
                                        ? "Submitting..."
                                        : "Complete Setup"}
                                    <CheckCircle class="w-4 h-4" />
                                </Button>
                            {:else}
                                <Button
                                    onclick={handleNext}
                                    disabled={!onboarding.canGoForward ||
                                        isLoading}
                                    class="flex items-center gap-2"
                                >
                                    Continue
                                    <ArrowRight class="w-4 h-4" />
                                </Button>
                            {/if}
                        </div>
                    </div>
                {/if}
            </CardContent>
        </Card>

        <!-- Help Text -->
        <div class="mt-8 text-center">
            <p class="text-sm text-muted-foreground">
                Need help?
                <a href="/support" class="text-primary hover:underline"
                    >Contact our support team</a
                >
                or check out our
                <a href="/help" class="text-primary hover:underline"
                    >help center</a
                >.
            </p>
            <p class="text-xs text-muted-foreground mt-2">
                Your progress is automatically saved as you go.
            </p>
        </div>
    </main>
</div>
