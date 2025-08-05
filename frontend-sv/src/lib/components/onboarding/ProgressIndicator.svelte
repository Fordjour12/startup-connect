<script lang="ts">
    import { Progress } from "@/components/ui/progress";
    import { onboardingState } from "@/hooks/onboarding-state.svelte";

    // Get progress from onboarding state
    let progressPercentage = $derived(onboardingState.progressPercentage);
    let currentStep = $derived(onboardingState.currentStep());
    let totalSteps = $derived(onboardingState.totalSteps);
    let currentStepIndex = $derived(onboardingState.currentStepIndex);

    // Step labels for display
    const stepLabels = [
        "Welcome",
        "Role Selection",
        "Basic Info",
        "Goals",
        "Skills",
        "Preferences",
        "Role Details",
        "Verification",
    ];
</script>

<div class="w-full space-y-4">
    <!-- Progress Header -->
    <div class="flex items-center justify-between">
        <div class="space-y-1">
            <h2 class="text-lg font-semibold text-foreground">
                {currentStep?.title || "Onboarding"}
            </h2>
            <p class="text-sm text-muted-foreground">
                {currentStep?.description || "Complete your profile setup"}
            </p>
        </div>
        <div class="text-right">
            <p class="text-sm font-medium text-foreground">
                Step {currentStepIndex + 1} of {totalSteps}
            </p>
            <p class="text-xs text-muted-foreground">
                {progressPercentage}% complete
            </p>
        </div>
    </div>

    <!-- Progress Bar -->
    <div class="space-y-2">
        <Progress value={progressPercentage} class="h-2" />

        <!-- Step Indicators -->
        <div class="flex justify-between text-xs text-muted-foreground">
            {#each stepLabels.slice(0, totalSteps) as step, index}
                <div class="flex flex-col items-center space-y-1">
                    <div
                        class="w-2 h-2 rounded-full transition-colors {index <
                        currentStepIndex
                            ? 'bg-primary'
                            : index === currentStepIndex
                              ? 'bg-primary ring-2 ring-primary/20'
                              : 'bg-muted'}"
                    ></div>
                    <span class="hidden sm:block text-center max-w-16 truncate">
                        {step}
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Current Step Info -->
    {#if currentStep}
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
                        {currentStep.title}
                    </h3>
                    <p class="text-xs text-muted-foreground">
                        {currentStep.description}
                    </p>
                </div>
                {#if currentStep.estimatedMinutes}
                    <div class="text-xs text-muted-foreground">
                        ~{currentStep.estimatedMinutes} min
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
