<script lang="ts">
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Check, Edit, Loader2 } from "@lucide/svelte";
    import { goto } from "$app/navigation";

    let isSubmitting = $state(false);
    let submissionError = $state<string | null>(null);

    // Get role display name
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "founder":
                return "Founder";
            case "investor":
                return "Investor";
            case "support":
                return "Supporter";
            default:
                return role;
        }
    };

    // Get goal display name
    const getGoalDisplayName = (goal: string) => {
        const goalMap: Record<string, string> = {
            find_cofounders: "Find Co-founders",
            raise_funding: "Raise Funding",
            find_investors: "Find Investors",
            offer_mentorship: "Offer Mentorship",
            provide_services: "Provide Services",
            invest_in_startups: "Invest in Startups",
            network: "Network",
            learn: "Learn",
        };
        return goalMap[goal] || goal;
    };

    const handleEditStep = (stepId: string) => {
        const stepIndex = onboardingState.steps.findIndex(
            (s) => s.id === stepId,
        );
        if (stepIndex !== -1) {
            onboardingState.goToStep(stepIndex);
        }
    };

    const handleSubmit = async () => {
        isSubmitting = true;
        submissionError = null;

        try {
            const result = await onboardingState.submit();

            if (result.success) {
                // Redirect to appropriate dashboard
                const role = onboardingState.formData.role;
                let redirectPath = "/dashboard/founder";

                switch (role) {
                    case "investor":
                        redirectPath = "/dashboard/investor";
                        break;
                    case "support":
                        redirectPath = "/dashboard/supporter";
                        break;
                }

                await goto(redirectPath);
            } else {
                submissionError =
                    result.error?.message || "Failed to complete onboarding";
            }
        } catch (error) {
            submissionError =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred";
        } finally {
            isSubmitting = false;
        }
    };
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-4">
        <div
            class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
            <Check class="w-8 h-8 text-green-600" />
        </div>
        <h1 class="text-3xl font-bold">Almost Done!</h1>
        <p class="text-lg text-muted-foreground">
            Review your information and complete your profile setup
        </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid gap-4">
        <!-- Basic Information -->
        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handleEditStep("basicInfo")}
                >
                    <Edit class="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </CardHeader>
            <CardContent class="space-y-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                        <span class="font-medium">Name:</span>
                        {onboardingState.formData.fullName}
                    </div>
                    <div>
                        <span class="font-medium">Email:</span>
                        {onboardingState.formData.email}
                    </div>
                    <div>
                        <span class="font-medium">Location:</span>
                        {onboardingState.formData.location}
                    </div>
                    <div>
                        <span class="font-medium">Role:</span>
                        {getRoleDisplayName(
                            onboardingState.formData.role || "",
                        )}
                    </div>
                </div>
                {#if onboardingState.formData.bio}
                    <div class="pt-2">
                        <span class="font-medium">Bio:</span>
                        <p class="text-sm text-muted-foreground mt-1">
                            {onboardingState.formData.bio}
                        </p>
                    </div>
                {/if}
            </CardContent>
        </Card>

        <!-- Goals -->
        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <div>
                    <CardTitle>Goals & Objectives</CardTitle>
                    <CardDescription>What you want to achieve</CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handleEditStep("goals")}
                >
                    <Edit class="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </CardHeader>
            <CardContent class="space-y-2">
                <div class="text-sm">
                    <div>
                        <span class="font-medium">Primary Goal:</span>
                        {getGoalDisplayName(
                            onboardingState.formData.primaryGoal || "",
                        )}
                    </div>
                    <div>
                        <span class="font-medium">Time Commitment:</span>
                        {onboardingState.formData.timeCommitment?.replace(
                            "_",
                            " ",
                        )}
                    </div>
                </div>
                {#if onboardingState.formData.specificNeeds?.length}
                    <div class="pt-2">
                        <span class="font-medium">Specific Needs:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            {#each onboardingState.formData.specificNeeds as need}
                                <span
                                    class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                                >
                                    {need.replace("_", " ")}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/if}
            </CardContent>
        </Card>

        <!-- Skills (if provided) -->
        {#if onboardingState.formData.skills?.length}
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <div>
                        <CardTitle>Skills & Expertise</CardTitle>
                        <CardDescription
                            >What you bring to the table</CardDescription
                        >
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => handleEditStep("skills")}
                    >
                        <Edit class="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-wrap gap-2">
                        {#each onboardingState.formData.skills as skill}
                            <span
                                class="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        {/each}
                    </div>
                </CardContent>
            </Card>
        {/if}

        <!-- Preferences (if provided) -->
        {#if onboardingState.formData.geographicPreference}
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <div>
                        <CardTitle>Matching Preferences</CardTitle>
                        <CardDescription
                            >How you prefer to connect</CardDescription
                        >
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => handleEditStep("preferences")}
                    >
                        <Edit class="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent class="space-y-2 text-sm">
                    <div>
                        <span class="font-medium">Geographic Preference:</span>
                        {onboardingState.formData.geographicPreference}
                    </div>
                    <div>
                        <span class="font-medium">Working Style:</span>
                        {onboardingState.formData.workingStyle?.replace(
                            "_",
                            " ",
                        )}
                    </div>
                </CardContent>
            </Card>
        {/if}
    </div>

    <!-- Terms and Privacy -->
    <Card class="border-blue-200 bg-blue-50/50">
        <CardContent class="pt-6">
            <div class="space-y-4">
                <div class="flex items-start space-x-3">
                    <Check class="w-5 h-5 text-blue-600 mt-0.5" />
                    <div class="text-sm">
                        <p class="font-medium text-blue-900">
                            Terms & Conditions
                        </p>
                        <p class="text-blue-700">
                            By completing your profile, you agree to our <a
                                href="/terms"
                                class="underline">Terms of Service</a
                            >
                            and
                            <a href="/privacy" class="underline"
                                >Privacy Policy</a
                            >.
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <Check class="w-5 h-5 text-blue-600 mt-0.5" />
                    <div class="text-sm">
                        <p class="font-medium text-blue-900">Data Privacy</p>
                        <p class="text-blue-700">
                            Your information is secure and will only be used to
                            improve your experience and connect you with
                            relevant people.
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Error Display -->
    {#if submissionError}
        <div
            class="bg-destructive/10 border border-destructive/20 rounded-md p-4"
        >
            <p class="text-sm text-destructive">
                {submissionError}
            </p>
        </div>
    {/if}

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4">
        <Button
            variant="outline"
            onclick={() => onboardingState.previousStep()}
        >
            Back
        </Button>

        <Button
            onclick={handleSubmit}
            disabled={isSubmitting}
            class="min-w-[120px]"
        >
            {#if isSubmitting}
                <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                Completing...
            {:else}
                Complete Setup
            {/if}
        </Button>
    </div>

    <!-- Final Note -->
    <div class="text-center">
        <p class="text-xs text-muted-foreground">
            You can always update your profile information later in your account
            settings
        </p>
    </div>
</div>
