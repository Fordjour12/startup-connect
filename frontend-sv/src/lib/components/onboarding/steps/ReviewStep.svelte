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
    import { Badge } from "@/components/ui/badge";
    import { Separator } from "@/components/ui/separator";
    import {
        Check,
        Edit,
        User,
        Target,
        Briefcase,
        Settings,
        Shield,
        Building2,
        TrendingUp,
        Users,
        Mail,
        MapPin,
        Globe,
        FileText,
    } from "@lucide/svelte";
    import { cn } from "@/utils";
    import {
        type OnboardingData,
        ONBOARDING_STEPS,
    } from "@/hooks/onboarding-state.svelte";
    import { type UserRole, USER_ROLES } from "@/db/schema/auth-schema";
    import { toast } from "svelte-sonner";

    // Get current form data
    let formData = $derived(onboardingState.formData);
    let currentRole = $derived(formData.role as UserRole);

    // Edit mode state
    let isEditing = $state(false);
    let editingSection = $state<string | null>(null);

    // Helper function to get role display name
    function getRoleDisplayName(role: UserRole): string {
        const roleNames = {
            [USER_ROLES.FOUNDER]: "Founder",
            [USER_ROLES.INVESTOR]: "Investor",
            [USER_ROLES.SUPPORT]: "Supporter",
            [USER_ROLES.USER]: "User",
        };
        return roleNames[role] || "Unknown";
    }

    // Helper function to get role icon
    function getRoleIcon(role: UserRole) {
        const icons = {
            [USER_ROLES.FOUNDER]: Building2,
            [USER_ROLES.INVESTOR]: TrendingUp,
            [USER_ROLES.SUPPORT]: Users,
            [USER_ROLES.USER]: User,
        };
        return icons[role] || User;
    }

    // Helper function to format data for display
    function formatValue(value: any, type: string): string {
        if (!value) return "Not provided";

        switch (type) {
            case "array":
                return Array.isArray(value) ? value.join(", ") : "Not provided";
            case "boolean":
                return value ? "Yes" : "No";
            case "number":
                return value.toString();
            case "url":
                return value ? value : "Not provided";
            default:
                return value.toString();
        }
    }

    // Handle edit section
    function editSection(section: string) {
        isEditing = true;
        editingSection = section;
        // Navigate to the appropriate step
        const stepMap = {
            basic: "basic-info",
            goals: "goals",
            skills: "skills",
            preferences: "preferences",
            role: "role-selection",
        };
        const targetStep = stepMap[section as keyof typeof stepMap];
        if (targetStep) {
            const stepIndex = ONBOARDING_STEPS.indexOf(targetStep as any);
            if (stepIndex !== -1) {
                onboardingState.goToStep(targetStep as any);
            }
        }
    }

    // Handle complete onboarding
    async function completeOnboarding() {
        try {
            const result = await onboardingState.submit();
            if (result.success) {
                toast.success("Onboarding completed successfully!");
                // Navigate to completion step
                onboardingState.nextStep();
            } else {
                toast.error(result.error || "Failed to complete onboarding");
            }
        } catch (error) {
            toast.error("An error occurred while completing onboarding");
        }
    }

    // Get completion percentage
    let completionPercentage = $derived(() => {
        const currentIndex = ONBOARDING_STEPS.indexOf(
            onboardingState.currentStep,
        );
        return Math.round((currentIndex / (ONBOARDING_STEPS.length - 1)) * 100);
    });

    // Check if all required fields are filled
    let isComplete = $derived(() => {
        return completionPercentage() >= 100;
    });
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
        <div
            class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
        >
            <Check class="w-6 h-6 text-primary" />
        </div>
        <h2 class="text-2xl font-semibold">Review Your Profile</h2>
        <p class="text-muted-foreground">
            Review all your information before completing your profile setup
        </p>
    </div>

    <!-- Progress Overview -->
    <Card>
        <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
                Your profile is {completionPercentage()}% complete
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Overall Progress</span>
                    <span class="text-sm text-muted-foreground"
                        >{completionPercentage()}%</span
                    >
                </div>
                <div class="w-full bg-muted rounded-full h-2">
                    <div
                        class="bg-primary h-2 rounded-full transition-all duration-300"
                        style="width: {completionPercentage()}%"
                    ></div>
                </div>
                <div class="flex items-center space-x-2">
                    {#if isComplete()}
                        <Check class="w-4 h-4 text-green-500" />
                        <span class="text-sm text-green-600"
                            >Ready to complete</span
                        >
                    {:else}
                        <div
                            class="w-4 h-4 border-2 border-muted rounded-full"
                        ></div>
                        <span class="text-sm text-muted-foreground"
                            >Complete all sections</span
                        >
                    {/if}
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Basic Information -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <User class="w-5 h-5" />
                    <span>Basic Information</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("basic")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="name"
                        class="text-sm font-medium text-muted-foreground"
                        >Full Name</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.name, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="email"
                        class="text-sm font-medium text-muted-foreground"
                        >Email</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.email, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="location"
                        class="text-sm font-medium text-muted-foreground"
                        >Location</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.location, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="bio"
                        class="text-sm font-medium text-muted-foreground"
                        >Bio</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.bio, "string")}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Role Information -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                {#if currentRole}
                    {@const IconComponent = getRoleIcon(currentRole)}
                    <div class="flex items-center space-x-2">
                        <IconComponent class="w-5 h-5" />

                        <span>Role: {getRoleDisplayName(currentRole)}</span>
                        <Badge variant="secondary"
                            >{getRoleDisplayName(currentRole)}</Badge
                        >
                    </div>
                {/if}
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("role")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {#if currentRole === "founder"}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="startupName"
                            class="text-sm font-medium text-muted-foreground"
                            >Startup Name</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).startupName,
                                "string",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="startupStage"
                            class="text-sm font-medium text-muted-foreground"
                            >Startup Stage</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).startupStage,
                                "string",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="teamSize"
                            class="text-sm font-medium text-muted-foreground"
                            >Team Size</label
                        >
                        <p class="text-sm">
                            {formatValue((formData as any).teamSize, "number")}
                        </p>
                    </div>
                    <div>
                        <label
                            for="fundingNeeds"
                            class="text-sm font-medium text-muted-foreground"
                            >Funding Needs</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).fundingNeeds,
                                "number",
                            )}
                        </p>
                    </div>
                </div>
            {:else if currentRole === "investor"}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="investmentSize"
                            class="text-sm font-medium text-muted-foreground"
                            >Investment Size</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).investmentSize,
                                "string",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="riskAppetite"
                            class="text-sm font-medium text-muted-foreground"
                            >Risk Appetite</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).riskAppetite,
                                "string",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="preferredStages"
                            class="text-sm font-medium text-muted-foreground"
                            >Preferred Stages</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).preferredStages,
                                "array",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="portfolioCompanies"
                            class="text-sm font-medium text-muted-foreground"
                            >Portfolio Companies</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).portfolioCompanies,
                                "number",
                            )}
                        </p>
                    </div>
                </div>
            {:else if currentRole === "support"}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="supportTypes"
                            class="text-sm font-medium text-muted-foreground"
                            >Support Types</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).supportType,
                                "array",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="availability"
                            class="text-sm font-medium text-muted-foreground"
                            >Availability</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).availability,
                                "string",
                            )}
                        </p>
                    </div>
                    <div>
                        <label
                            for="hourlyRate"
                            class="text-sm font-medium text-muted-foreground"
                            >Hourly Rate</label
                        >
                        <p class="text-sm">
                            {formatValue(
                                (formData as any).hourlyRate,
                                "number",
                            )}
                        </p>
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Goals & Objectives -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Target class="w-5 h-5" />
                    <span>Goals & Objectives</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("goals")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="primaryGoal"
                        class="text-sm font-medium text-muted-foreground"
                        >Primary Goal</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.goals.primaryGoal, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="timeCommitment"
                        class="text-sm font-medium text-muted-foreground"
                        >Time Commitment</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.goals.timeCommitment, "string")}
                    </p>
                </div>
                <div class="md:col-span-2">
                    <label
                        for="specificNeeds"
                        class="text-sm font-medium text-muted-foreground"
                        >Specific Needs</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.goals.specificNeeds, "array")}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Skills & Expertise -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Briefcase class="w-5 h-5" />
                    <span>Skills & Expertise</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("skills")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="experienceLevel"
                        class="text-sm font-medium text-muted-foreground"
                        >Experience Level</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.skills.experienceLevel, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="industries"
                        class="text-sm font-medium text-muted-foreground"
                        >Industries</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.skills.industries, "array")}
                    </p>
                </div>
                <div class="md:col-span-2">
                    <label
                        for="skills"
                        class="text-sm font-medium text-muted-foreground"
                        >Skills</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.skills.skills, "array")}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Preferences -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Settings class="w-5 h-5" />
                    <span>Matching Preferences</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("preferences")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="communicationMethods"
                        class="text-sm font-medium text-muted-foreground"
                        >Communication Methods</label
                    >
                    <p class="text-sm">
                        {formatValue(
                            formData.preferences.communicationMethods,
                            "array",
                        )}
                    </p>
                </div>
                <div>
                    <label
                        for="communicationFrequency"
                        class="text-sm font-medium text-muted-foreground"
                        >Communication Frequency</label
                    >
                    <p class="text-sm">
                        {formatValue(
                            formData.preferences.communicationFrequency,
                            "string",
                        )}
                    </p>
                </div>
                <div>
                    <label
                        for="notificationTypes"
                        class="text-sm font-medium text-muted-foreground"
                        >Notification Types</label
                    >
                    <p class="text-sm">
                        {formatValue(
                            formData.preferences.notificationTypes,
                            "array",
                        )}
                    </p>
                </div>
                <div>
                    <label
                        for="themePreference"
                        class="text-sm font-medium text-muted-foreground"
                        >Theme Preference</label
                    >
                    <p class="text-sm">
                        {formatValue(
                            formData.preferences.themePreference,
                            "string",
                        )}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Additional Basic Info -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <FileText class="w-5 h-5" />
                    <span>Additional Information</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => editSection("basic")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="jobTitle"
                        class="text-sm font-medium text-muted-foreground"
                        >Job Title</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.jobTitle, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="industry"
                        class="text-sm font-medium text-muted-foreground"
                        >Industry</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.industry, "string")}
                    </p>
                </div>
                <div>
                    <label
                        for="linkedinUrl"
                        class="text-sm font-medium text-muted-foreground"
                        >LinkedIn</label
                    >
                    <p class="text-sm">
                        {formatValue(formData.basicInfo.linkedinUrl, "url")}
                    </p>
                </div>
                <div>
                    <label
                        for="portfolioWebsite"
                        class="text-sm font-medium text-muted-foreground"
                        >Portfolio Website</label
                    >
                    <p class="text-sm">
                        {formatValue(
                            formData.basicInfo.portfolioWebsite,
                            "url",
                        )}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4">
        <Button
            variant="outline"
            onclick={() => onboardingState.previousStep()}
        >
            Back
        </Button>

        <div class="flex space-x-2">
            <Button variant="outline" onclick={() => window.location.reload()}>
                Refresh Data
            </Button>
            <Button
                onclick={completeOnboarding}
                disabled={!isComplete()}
                class={cn(!isComplete() && "opacity-50 cursor-not-allowed")}
            >
                Complete Onboarding
            </Button>
        </div>
    </div>

    <!-- Completion Requirements -->
    {#if !isComplete()}
        <Card class="border-foreground bg-foreground/30">
            <CardContent class="pt-6">
                <div class="flex items-start space-x-3">
                    <div
                        class="size-6 bg-background rounded-full flex items-center justify-center mt-0.5"
                    >
                        <span class="text-white text-xs">⚠️</span>
                    </div>
                    <div class="text-sm">
                        <p class="font-medium mb-1 font-head">
                            Complete Required Fields
                        </p>
                        <ul class="space-y-1">
                            {#if completionPercentage() < 100}
                                <li>• Complete all required sections</li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    {/if}
</div>
