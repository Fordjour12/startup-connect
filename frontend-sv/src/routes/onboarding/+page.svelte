<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { useOnboarding } from "@/hooks/onboarding-state.svelte";
    import type { OnboardingStep } from "@/hooks/onboarding-state.svelte";
    import { Button } from "@/components/ui/button";
    import { Progress } from "@/components/ui/progress";
    import { Card, CardContent } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { ArrowLeft, ArrowRight, Save, CheckCircle } from "@lucide/svelte";
    import * as Tooltip from "@/components/ui/tooltip";

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

    // Debug validation data
    let validationData = $derived(onboarding.validateLocalStorageData());

    // Step navigation data
    let stepNavigationData = $derived({
        stepData: onboarding.availableSteps.find(
            (s) => s === onboarding.currentStep,
        ),
        isAccessible: (step: string) =>
            onboarding.isStepAccessible(step as any),
        isCompleted: (step: string) => onboarding.isStepCompleted(step as any),
        isCurrent: (step: string) => step === onboarding.currentStep,
    });

    // Auto-save functionality - simplified
    $effect(() => {
        // Show save indicator briefly when step changes
        showSaveIndicator = true;
        setTimeout(() => {
            showSaveIndicator = false;
        }, 1000);
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
        if (onboarding.isStepAccessible(step)) {
            isLoading = true;
            try {
                await onboarding.goToStep(step);
            } finally {
                isLoading = false;
            }
        } else {
            console.warn(`Cannot navigate to step ${step} - not accessible`);
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
            // Simple check - if user has started filling out the form
            if (
                onboarding.formData.role &&
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

    const stepOrder = $state([
        "welcome",
        "role-selection",
        "basic-info",
        "role-specific",
        "goals",
        "skills",
        "preferences",
        "review",
        "completion",
    ]);

    // Helper function to get tooltip message
    function getTooltipMessage(
        step: string,
        completedSteps: Set<string>,
    ): string {
        for (const requiredStep of stepOrder) {
            if (!completedSteps.has(requiredStep) && step !== requiredStep) {
                return `Complete ${requiredStep.replace("-", " ")} step first`;
            }
        }
        return "Complete previous steps first";
    }
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
                            {onboarding.completedSteps.size} of {onboarding.totalSteps}
                            steps completed
                        </span>
                    </div>
                    <Progress
                        value={(onboarding.completedSteps.size /
                            onboarding.totalSteps) *
                            100}
                        class="h-2"
                    />
                </div>
            </div>

            <!-- Step Navigation Pills -->
            <div class="flex flex-wrap gap-2">
                {#each stepOrder as step, index}
                    {@const stepData = stepNavigationData.stepData}
                    {@const isAccessible =
                        stepNavigationData.isAccessible(step)}
                    {@const isCompleted = stepNavigationData.isCompleted(step)}
                    {@const isCurrent = stepNavigationData.isCurrent(step)}

                    {#if !isAccessible}
                        <!-- Tooltip for inaccessible steps -->
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger
                                    onclick={() =>
                                        handleStepClick(step as OnboardingStep)}
                                    disabled={!isAccessible || isLoading}
                                    class="group relative"
                                >
                                    <!-- <button> -->
                                    <Badge
                                        variant={isCurrent
                                            ? "default"
                                            : isCompleted
                                              ? "secondary"
                                              : isAccessible
                                                ? "outline"
                                                : "outline"}
                                        class="cursor-pointer transition-all duration-200 {isAccessible
                                            ? 'hover:scale-105'
                                            : 'opacity-50 cursor-not-allowed'}"
                                    >
                                        <span class="flex items-center gap-1">
                                            {index + 1}. {onboarding.getStepTitle(
                                                step as OnboardingStep,
                                            )}
                                            {#if isCompleted}
                                                <CheckCircle class="w-3 h-3" />
                                            {/if}
                                        </span>
                                    </Badge>
                                    <!-- </button> -->
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>
                                        {getTooltipMessage(
                                            step,
                                            onboarding.completedSteps,
                                        )}
                                    </p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    {:else}
                        <!-- Regular button for accessible steps -->
                        <button
                            onclick={() =>
                                handleStepClick(step as OnboardingStep)}
                            disabled={!isAccessible || isLoading}
                            class="group relative"
                        >
                            <Badge
                                variant={isCurrent
                                    ? "default"
                                    : isCompleted
                                      ? "secondary"
                                      : isAccessible
                                        ? "outline"
                                        : "outline"}
                                class="cursor-pointer transition-all duration-200 {isAccessible
                                    ? 'hover:scale-105'
                                    : 'opacity-50 cursor-not-allowed'}"
                            >
                                <span class="flex items-center gap-1">
                                    {index + 1}. {onboarding.getStepTitle(
                                        step as OnboardingStep,
                                    )}
                                    {#if isCompleted}
                                        <CheckCircle class="w-3 h-3" />
                                    {/if}
                                </span>
                            </Badge>
                        </button>
                    {/if}
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
                        <!-- //TODO: Display loading skeleton -->
                        <div class="flex-1 flex items-center justify-center">
                            <div
                                class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                            ></div>
                        </div>
                    {:else if getStepComponent(onboarding.currentStep)}
                        <!-- Step Completion Warning -->
                        {#if !onboarding.isStepCompleted(onboarding.currentStep) && onboarding.currentStep !== "welcome"}
                            <div
                                class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                            >
                                <div
                                    class="flex items-center gap-2 text-yellow-800"
                                >
                                    <div
                                        class="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center"
                                    >
                                        <span class="text-xs font-bold">!</span>
                                    </div>
                                    <span class="font-medium"
                                        >Complete this step to continue</span
                                    >
                                </div>
                                <p class="text-sm text-yellow-700 mt-1 ml-7">
                                    Please fill out all required information
                                    before proceeding to the next step.
                                </p>
                            </div>
                        {/if}

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
                                disabled={isLoading}
                                class="flex items-center gap-2"
                            >
                                <Save class="w-4 h-4" />
                                Save Progress
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
                                <div class="relative group">
                                    <Button
                                        onclick={handleNext}
                                        disabled={!onboarding.canGoForward ||
                                            isLoading}
                                        class="flex items-center gap-2"
                                    >
                                        Continue
                                        <ArrowRight class="w-4 h-4" />
                                    </Button>

                                    <!-- Tooltip for disabled state -->
                                    {#if !onboarding.canGoForward && !isLoading}
                                        <div
                                            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground/30 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                                        >
                                            {#if !onboarding.isStepCompleted(onboarding.currentStep)}
                                                Complete this step to continue
                                            {:else}
                                                Cannot proceed to next step
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
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

            <!-- Reset Progress Button -->
            <div class="mt-4 pt-4 border-t border-border">
                <div
                    class="flex flex-col sm:flex-row gap-2 justify-center items-center"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onclick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to reset your onboarding progress? This will clear all your data and start you from the beginning.",
                                )
                            ) {
                                onboarding.resetOnboarding();
                            }
                        }}
                        class="text-xs"
                    >
                        Reset Progress & Start Over
                    </Button>

                    <!-- Export Data Button -->
                    <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => {
                            const data = onboarding.exportOnboardingData();
                            const blob = new Blob([data], {
                                type: "application/json",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `onboarding-data-${new Date().toISOString().split("T")[0]}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                        class="text-xs"
                    >
                        Export My Data
                    </Button>
                </div>

                <p class="text-xs text-muted-foreground mt-2 text-center">
                    Having issues? Export your data first, then reset to start
                    fresh.
                </p>
            </div>

            <!-- Debug Panel (Development Only) -->
            {#if import.meta.env.DEV}
                <div class="mt-6 p-4 bg-muted rounded-lg text-left">
                    <h4 class="font-medium text-sm mb-2">
                        Debug Info (Development)
                    </h4>
                    <div class="text-xs space-y-1">
                        <div>
                            <strong>Current Step:</strong>
                            {onboarding.currentStep}
                        </div>
                        <div>
                            <strong>Completed Steps:</strong>
                            {Array.from(onboarding.completedSteps).join(", ")}
                        </div>
                        <div>
                            <strong>Available Steps:</strong>
                            {onboarding.availableSteps.join(", ")}
                        </div>
                        <div>
                            <strong>Current Step Index:</strong>
                            {onboarding.currentStepIndex}
                        </div>
                        <div>
                            <strong>Total Steps:</strong>
                            {onboarding.totalSteps}
                        </div>
                        <div>
                            <strong>Can Go Forward:</strong>
                            {onboarding.canGoForward}
                        </div>
                        <div>
                            <strong>Role:</strong>
                            {onboarding.formData.role || "None"}
                        </div>
                    </div>

                    <!-- LocalStorage Data -->
                    <div class="mt-4 pt-4 border-t border-border">
                        <h5 class="font-medium text-sm mb-2">
                            LocalStorage Data
                        </h5>
                        <div class="text-xs space-y-1">
                            <div>
                                <strong>Raw localStorage:</strong>
                                <pre
                                    class="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                                    {JSON.stringify(
                                        onboarding.getRawLocalStorageData() ||
                                            {},
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                            <div>
                                <strong>Form Data:</strong>
                                <pre
                                    class="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                                    {JSON.stringify(
                                        onboarding.formData,
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                            <div>
                                <strong>Completed Steps Set:</strong>
                                <pre
                                    class="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                                    {JSON.stringify(
                                        Array.from(onboarding.completedSteps),
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <!-- Data Validation -->
                    <div class="mt-4 pt-4 border-t border-border">
                        <h5 class="font-medium text-sm mb-2">
                            Data Validation
                        </h5>
                        <div class="text-xs space-y-1">
                            <div>
                                <strong>Data Valid:</strong>
                                <span
                                    class={validationData.isValid
                                        ? "text-green-600"
                                        : "text-red-600"}
                                >
                                    {validationData.isValid
                                        ? "✅ Yes"
                                        : "❌ No"}
                                </span>
                            </div>
                            {#if validationData.errors.length > 0}
                                <div>
                                    <strong class="text-red-600">Errors:</strong
                                    >
                                    <ul class="mt-1 ml-4 text-red-600">
                                        {#each validationData.errors as error}
                                            <li>• {error}</li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                            {#if validationData.warnings.length > 0}
                                <div>
                                    <strong class="text-yellow-600"
                                        >Warnings:</strong
                                    >
                                    <ul class="mt-1 ml-4 text-yellow-600">
                                        {#each validationData.warnings as warning}
                                            <li>• {warning}</li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Step Accessibility -->
                    <div class="mt-4 pt-4 border-t border-border">
                        <h5 class="font-medium text-sm mb-2">
                            Step Accessibility
                        </h5>
                        <div class="text-xs space-y-1">
                            <div>
                                <strong>Welcome Accessible:</strong>
                                {onboarding.isStepAccessible("welcome")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Role Selection Accessible:</strong>
                                {onboarding.isStepAccessible("role-selection")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Basic Info Accessible:</strong>
                                {onboarding.isStepAccessible("basic-info")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Role Specific Accessible:</strong>
                                {onboarding.isStepAccessible("role-specific")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Goals Accessible:</strong>
                                {onboarding.isStepAccessible("goals")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Skills Accessible:</strong>
                                {onboarding.isStepAccessible("skills")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Preferences Accessible:</strong>
                                {onboarding.isStepAccessible("preferences")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Review Accessible:</strong>
                                {onboarding.isStepAccessible("review")
                                    ? "✅"
                                    : "❌"}
                            </div>
                            <div>
                                <strong>Completion Accessible:</strong>
                                {onboarding.isStepAccessible("completion")
                                    ? "✅"
                                    : "❌"}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-4 pt-4 border-t border-border">
                        <h5 class="font-medium text-sm mb-2">Debug Actions</h5>
                        <div class="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={() => {
                                    console.log(
                                        "=== ONBOARDING STATE DEBUG ===",
                                    );
                                    console.log("Current State:", {
                                        currentStep: onboarding.currentStep,
                                        completedSteps: Array.from(
                                            onboarding.completedSteps,
                                        ),
                                        formData: onboarding.formData,
                                        availableSteps:
                                            onboarding.availableSteps,
                                    });
                                    console.log(
                                        "LocalStorage:",
                                        localStorage.getItem(
                                            "startup_connect_onboarding_progress",
                                        ),
                                    );
                                }}
                                class="text-xs"
                            >
                                Log State to Console
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={() => {
                                    const data = localStorage.getItem(
                                        "startup_connect_onboarding_progress",
                                    );
                                    if (data) {
                                        const parsed = JSON.parse(data);
                                        console.log(
                                            "=== PARSED LOCALSTORAGE ===",
                                        );
                                        console.log(parsed);
                                    } else {
                                        console.log(
                                            "No localStorage data found",
                                        );
                                    }
                                }}
                                class="text-xs"
                            >
                                Log localStorage to Console
                            </Button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </main>
</div>
