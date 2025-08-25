<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Separator } from "$lib/components/ui/separator";
    import {
        CheckCircle,
        Edit,
        User,
        Mail,
        MapPin,
        Briefcase,
        Target,
        Award,
        Settings,
        Globe,
        Phone,
        Github,
        Linkedin,
        Twitter,
        Languages,
        Clock,
        DollarSign,
        Users,
        TrendingUp,
        MessageCircle,
        Bell,
        Palette,
        AlertCircle,
        Rocket,
    } from "@lucide/svelte";

    interface Props {
        onboarding: any;
    }

    let { onboarding }: Props = $props();

    const formData = onboarding.formData;
    const currentRole = formData.role;

    let isSubmitting = $state(false);
    let submitError = $state("");

    // Get role display info
    function getRoleInfo(role: string) {
        switch (role) {
            case "founder":
                return {
                    label: "Founder",
                    icon: Rocket,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                };
            case "investor":
                return {
                    label: "Investor",
                    icon: DollarSign,
                    color: "text-purple-600",
                    bgColor: "bg-purple-50",
                };
            case "support":
                return {
                    label: "Supporter",
                    icon: Users,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                };
            default:
                return {
                    label: "Unknown",
                    icon: User,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                };
        }
    }

    const roleInfo = getRoleInfo(currentRole);

    function formatCommunicationMethod(method: string) {
        const methods = {
            video_calls: "Video Calls",
            email: "Email",
            in_person: "In-Person",
            chat: "Chat/Messaging",
        };
        return methods[method as keyof typeof methods] || method;
    }

    function formatNotificationType(type: string) {
        const types = {
            new_matches: "New Matches",
            messages: "New Messages",
            connection_requests: "Connection Requests",
            opportunities: "New Opportunities",
            updates: "Platform Updates",
            weekly_digest: "Weekly Digest",
        };
        return types[type as keyof typeof types] || type;
    }

    function formatTimeCommitment(commitment: string) {
        const commitments = {
            casual: "Casual (1-5 hours/week)",
            regular: "Regular (5-15 hours/week)",
            intensive: "Intensive (15+ hours/week)",
            full_time: "Full-time focus",
        };
        return (
            commitments[commitment as keyof typeof commitments] || commitment
        );
    }

    function formatExperienceLevel(level: string) {
        const levels = {
            beginner: "Beginner",
            intermediate: "Intermediate",
            expert: "Expert",
        };
        return levels[level as keyof typeof levels] || level;
    }

    function formatTheme(theme: string) {
        const themes = {
            light: "Light Mode",
            dark: "Dark Mode",
            system: "System Default",
        };
        return themes[theme as keyof typeof themes] || theme;
    }

    async function handleEditStep(step: string) {
        await onboarding.goToStep(step);
    }

    async function handleSubmit() {
        isSubmitting = true;
        submitError = "";

        try {
            const result = await onboarding.submitOnboarding();

            if (!result.success) {
                submitError = result.error || "Failed to complete onboarding";
                isSubmitting = false;
            }
            // If successful, the onboarding state will automatically navigate to completion
        } catch (error) {
            console.error("Submit error:", error);
            submitError = "An unexpected error occurred. Please try again.";
            isSubmitting = false;
        }
    }
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
        <div class="flex justify-center mb-4">
            <div class="{roleInfo.bgColor} p-4 rounded-full">
                <roleInfo.icon class="size-8 {roleInfo.color}" />
            </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
            Please review all the information below. You can edit any section by
            clicking the edit button. Once you submit, we'll create your profile
            and get you started!
        </p>
    </div>

    <!-- Role Selection Review -->
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="flex items-center gap-2">
                <roleInfo.icon class="size-5 {roleInfo.color}" />
                Role Selection
            </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onclick={() => handleEditStep("role-selection")}
            >
                <Edit class="w-4 h-4 mr-1" />
                Edit
            </Button>
        </CardHeader>
        <CardContent>
            <div class="flex items-center gap-3">
                <Badge variant="secondary" class="text-base px-4 py-2">
                    {roleInfo.label}
                </Badge>
                <CheckCircle class="w-5 h-5 text-green-500" />
            </div>
        </CardContent>
    </Card>

    <!-- Basic Information Review -->
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="flex items-center gap-2">
                <User class="w-5 h-5 text-blue-600" />
                Basic Information
            </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onclick={() => handleEditStep("basic-info")}
            >
                <Edit class="w-4 h-4 mr-1" />
                Edit
            </Button>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Essential Info -->
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-900">
                        Essential Information
                    </h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center gap-2">
                            <User class="w-4 h-4 text-gray-500" />
                            <span class="font-medium">Name:</span>
                            <span
                                >{formData.basicInfo?.name ||
                                    "Not provided"}</span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <Mail class="w-4 h-4 text-gray-500" />
                            <span class="font-medium">Email:</span>
                            <span
                                >{formData.basicInfo?.email ||
                                    "Not provided"}</span
                            >
                        </div>
                        {#if formData.basicInfo?.bio}
                            <div class="flex items-start gap-2">
                                <MessageCircle
                                    class="w-4 h-4 text-gray-500 mt-0.5"
                                />
                                <div>
                                    <span class="font-medium">Bio:</span>
                                    <p class="text-gray-600 mt-1">
                                        {formData.basicInfo.bio}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Location & Professional -->
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-900">
                        Location & Professional
                    </h4>
                    <div class="space-y-2 text-sm">
                        {#if formData.basicInfo?.location || formData.basicInfo?.city}
                            <div class="flex items-center gap-2">
                                <MapPin class="w-4 h-4 text-gray-500" />
                                <span class="font-medium">Location:</span>
                                <span>
                                    {[
                                        formData.basicInfo?.city,
                                        formData.basicInfo?.location,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "Not provided"}
                                </span>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.jobTitle}
                            <div class="flex items-center gap-2">
                                <Briefcase class="w-4 h-4 text-gray-500" />
                                <span class="font-medium">Position:</span>
                                <span>{formData.basicInfo.jobTitle}</span>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.industry}
                            <div class="flex items-center gap-2">
                                <TrendingUp class="w-4 h-4 text-gray-500" />
                                <span class="font-medium">Industry:</span>
                                <span>{formData.basicInfo.industry}</span>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.languages && formData.basicInfo.languages.length > 0}
                            <div class="flex items-start gap-2">
                                <Languages
                                    class="w-4 h-4 text-gray-500 mt-0.5"
                                />
                                <div>
                                    <span class="font-medium">Languages:</span>
                                    <div class="flex flex-wrap gap-1 mt-1">
                                        {#each formData.basicInfo.languages as language}
                                            <Badge
                                                variant="outline"
                                                class="text-xs"
                                                >{language}</Badge
                                            >
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Contact & Social Links -->
            {#if formData.basicInfo?.phone || formData.basicInfo?.linkedinUrl || formData.basicInfo?.githubProfile || formData.basicInfo?.portfolioWebsite}
                <Separator />
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-900">
                        Contact & Social Links
                    </h4>
                    <div class="grid md:grid-cols-2 gap-3 text-sm">
                        {#if formData.basicInfo?.phone}
                            <div class="flex items-center gap-2">
                                <Phone class="w-4 h-4 text-gray-500" />
                                <span>{formData.basicInfo.phone}</span>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.linkedinUrl}
                            <div class="flex items-center gap-2">
                                <Linkedin class="w-4 h-4 text-gray-500" />
                                <a
                                    href={formData.basicInfo.linkedinUrl}
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                >
                                    LinkedIn Profile
                                </a>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.githubProfile}
                            <div class="flex items-center gap-2">
                                <Github class="w-4 h-4 text-gray-500" />
                                <a
                                    href={formData.basicInfo.githubProfile}
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                >
                                    GitHub Profile
                                </a>
                            </div>
                        {/if}
                        {#if formData.basicInfo?.portfolioWebsite}
                            <div class="flex items-center gap-2">
                                <Globe class="w-4 h-4 text-gray-500" />
                                <a
                                    href={formData.basicInfo.portfolioWebsite}
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                >
                                    Portfolio Website
                                </a>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Role-Specific Details Review -->
    {#if (currentRole === "investor" && formData.investorInfo) || (currentRole === "support" && formData.supporterInfo)}
        <Card>
            <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    <roleInfo.icon class="size-5 {roleInfo.color}" />
                    {roleInfo.label} Details
                </CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => handleEditStep("role-specific")}
                >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                </Button>
            </CardHeader>
            <CardContent class="space-y-4">
                {#if currentRole === "investor" && formData.investorInfo}
                    <div class="grid md:grid-cols-2 gap-6 text-sm">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <DollarSign class="w-4 h-4 text-gray-500" />
                                <span class="font-medium">Investment Size:</span
                                >
                                <Badge variant="outline"
                                    >{formData.investorInfo
                                        .investmentSize}</Badge
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Target class="w-4 h-4 text-gray-500" />
                                <span class="font-medium">Risk Appetite:</span>
                                <Badge variant="outline"
                                    >{formData.investorInfo.riskAppetite}</Badge
                                >
                            </div>
                            {#if formData.investorInfo.portfolioCompanies}
                                <div class="flex items-center gap-2">
                                    <TrendingUp class="w-4 h-4 text-gray-500" />
                                    <span class="font-medium"
                                        >Portfolio Companies:</span
                                    >
                                    <span
                                        >{formData.investorInfo
                                            .portfolioCompanies}</span
                                    >
                                </div>
                            {/if}
                        </div>
                        <div class="space-y-2">
                            {#if formData.investorInfo.preferredStages?.length > 0}
                                <div class="flex items-start gap-2">
                                    <TrendingUp
                                        class="w-4 h-4 text-gray-500 mt-0.5"
                                    />
                                    <div>
                                        <span class="font-medium"
                                            >Preferred Stages:</span
                                        >
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            {#each formData.investorInfo.preferredStages as stage}
                                                <Badge
                                                    variant="secondary"
                                                    class="text-xs"
                                                    >{stage}</Badge
                                                >
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    {#if formData.investorInfo.investmentHistory}
                        <Separator />
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Investment History:</span
                            >
                            <p class="text-sm text-gray-600">
                                {formData.investorInfo.investmentHistory}
                            </p>
                        </div>
                    {/if}
                {:else if currentRole === "support" && formData.supporterInfo}
                    <div class="grid md:grid-cols-2 gap-6 text-sm">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <Clock class="size-4 text-gray-500" />
                                <span class="font-medium">Availability:</span>
                                <Badge variant="outline"
                                    >{formData.supporterInfo
                                        .availability}</Badge
                                >
                            </div>
                            {#if formData.supporterInfo.hourlyRate}
                                <div class="flex items-center gap-2">
                                    <DollarSign class="w-4 h-4 text-gray-500" />
                                    <span class="font-medium">Hourly Rate:</span
                                    >
                                    <span
                                        >${formData.supporterInfo
                                            .hourlyRate}</span
                                    >
                                </div>
                            {/if}
                        </div>
                        <div class="space-y-2">
                            {#if formData.supporterInfo.supportType?.length > 0}
                                <div class="flex items-start gap-2">
                                    <Users
                                        class="size-4 text-gray-500 mt-0.5"
                                    />
                                    <div>
                                        <span class="font-medium"
                                            >Support Types:</span
                                        >
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            {#each formData.supporterInfo.supportType as type}
                                                <Badge
                                                    variant="secondary"
                                                    class="text-xs"
                                                    >{type}</Badge
                                                >
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    {#if formData.supporterInfo.expertise}
                        <Separator />
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Areas of Expertise:</span
                            >
                            <p class="text-sm text-gray-600">
                                {formData.supporterInfo.expertise}
                            </p>
                        </div>
                    {/if}
                {/if}
            </CardContent>
        </Card>
    {/if}

    <!-- Goals Review -->
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="flex items-center gap-2">
                <Target class="size-5 text-green-600" />
                Goals & Objectives
            </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onclick={() => handleEditStep("goals")}
            >
                <Edit class="size-4 mr-1" />
                Edit
            </Button>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-6 text-sm">
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Target class="size-4 text-gray-500" />
                        <span class="font-medium">Primary Goal:</span>
                        <Badge variant="default"
                            >{formData.goals?.primaryGoal || "Not set"}</Badge
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <Clock class="size-4 text-gray-500" />
                        <span class="font-medium">Time Commitment:</span>
                        <span
                            >{formatTimeCommitment(
                                formData.goals?.timeCommitment || "",
                            )}</span
                        >
                    </div>
                </div>
                <div class="space-y-3">
                    {#if formData.goals?.specificNeeds?.length > 0}
                        <div class="flex items-start gap-2">
                            <Users class="size-4 text-gray-500 mt-0.5" />
                            <div>
                                <span class="font-medium">Specific Needs:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    {#each formData.goals.specificNeeds as need}
                                        <Badge variant="outline" class="text-xs"
                                            >{need}</Badge
                                        >
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            {#if formData.goals?.personalGoals?.length > 0 || formData.goals?.platformGoals?.length > 0}
                <Separator />
                <div class="grid md:grid-cols-2 gap-6">
                    {#if formData.goals?.personalGoals?.length > 0}
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Personal Goals:</span
                            >
                            <div class="flex flex-wrap gap-1">
                                {#each formData.goals.personalGoals as goal}
                                    <Badge variant="secondary" class="text-xs"
                                        >{goal}</Badge
                                    >
                                {/each}
                            </div>
                        </div>
                    {/if}
                    {#if formData.goals?.platformGoals?.length > 0}
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Platform Goals:</span
                            >
                            <div class="flex flex-wrap gap-1">
                                {#each formData.goals.platformGoals as goal}
                                    <Badge variant="secondary" class="text-xs"
                                        >{goal}</Badge
                                    >
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}

            {#if formData.goals?.additionalGoals}
                <Separator />
                <div class="space-y-2">
                    <span class="font-medium text-sm">Additional Goals:</span>
                    <p class="text-sm text-gray-600">
                        {formData.goals.additionalGoals}
                    </p>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Skills Review -->
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="flex items-center gap-2">
                <Award class="size-5 text-purple-600" />
                Skills & Experience
            </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onclick={() => handleEditStep("skills")}
            >
                <Edit class="size-4 mr-1" />
                Edit
            </Button>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-6 text-sm">
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Award class="size-4 text-gray-500" />
                        <span class="font-medium">Experience Level:</span>
                        <Badge variant="outline"
                            >{formatExperienceLevel(
                                formData.skills?.experienceLevel || "",
                            )}</Badge
                        >
                    </div>
                </div>
                <div class="space-y-3">
                    {#if formData.skills?.industries?.length > 0}
                        <div class="flex items-start gap-2">
                            <TrendingUp class="size-4 text-gray-500 mt-0.5" />
                            <div>
                                <span class="font-medium">Industries:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    {#each formData.skills.industries as industry}
                                        <Badge variant="outline" class="text-xs"
                                            >{industry}</Badge
                                        >
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            {#if formData.skills?.skills?.length > 0}
                <Separator />
                <div class="space-y-2">
                    <span class="font-medium text-sm">Skills:</span>
                    <div class="flex flex-wrap gap-1">
                        {#each formData.skills.skills as skill}
                            <Badge variant="secondary" class="text-xs"
                                >{skill}</Badge
                            >
                        {/each}
                    </div>
                </div>
            {/if}

            {#if formData.skills?.expertiseAreas || formData.skills?.achievements || formData.skills?.certifications}
                <Separator />
                <div class="space-y-4">
                    {#if formData.skills?.expertiseAreas}
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Areas of Expertise:</span
                            >
                            <p class="text-sm text-gray-600">
                                {formData.skills.expertiseAreas}
                            </p>
                        </div>
                    {/if}
                    {#if formData.skills?.achievements}
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Achievements:</span
                            >
                            <p class="text-sm text-gray-600">
                                {formData.skills.achievements}
                            </p>
                        </div>
                    {/if}
                    {#if formData.skills?.certifications}
                        <div class="space-y-2">
                            <span class="font-medium text-sm"
                                >Certifications:</span
                            >
                            <p class="text-sm text-gray-600">
                                {formData.skills.certifications}
                            </p>
                        </div>
                    {/if}
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Preferences Review -->
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="flex items-center gap-2">
                <Settings class="size-5 text-orange-600" />
                Communication Preferences
            </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onclick={() => handleEditStep("preferences")}
            >
                <Edit class="size-4 mr-1" />
                Edit
            </Button>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-6 text-sm">
                <div class="space-y-3">
                    {#if formData.preferences?.communicationMethods?.length > 0}
                        <div class="flex items-start gap-2">
                            <MessageCircle
                                class="size-4 text-gray-500 mt-0.5"
                            />
                            <div>
                                <span class="font-medium"
                                    >Communication Methods:</span
                                >
                                <div class="flex flex-wrap gap-1 mt-1">
                                    {#each formData.preferences.communicationMethods as method}
                                        <Badge variant="outline" class="text-xs"
                                            >{formatCommunicationMethod(
                                                method,
                                            )}</Badge
                                        >
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                    {#if formData.preferences?.themePreference}
                        <div class="flex items-center gap-2">
                            <Palette class="size-4 text-gray-500" />
                            <span class="font-medium">Theme:</span>
                            <Badge variant="outline"
                                >{formatTheme(
                                    formData.preferences.themePreference,
                                )}</Badge
                            >
                        </div>
                    {/if}
                </div>
                <div class="space-y-3">
                    {#if formData.preferences?.notificationTypes?.length > 0}
                        <div class="flex items-start gap-2">
                            <Bell class="size-4 text-gray-500 mt-0.5" />
                            <div>
                                <span class="font-medium">Notifications:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    {#each formData.preferences.notificationTypes as type}
                                        <Badge variant="outline" class="text-xs"
                                            >{formatNotificationType(
                                                type,
                                            )}</Badge
                                        >
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Submit Section -->
    <Card class="border-green-200 bg-green-50">
        <CardContent class="pt-6">
            <div class="text-center space-y-6">
                <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-green-900">
                        Ready to Join Startup Connect?
                    </h3>
                    <p class="text-sm text-green-700">
                        By submitting, you agree to our Terms of Service and
                        Privacy Policy. You can always update your profile
                        information later.
                    </p>
                </div>

                {#if submitError}
                    <div
                        class="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                        <AlertCircle class="w-5 h-5" />
                        <span class="text-sm">{submitError}</span>
                    </div>
                {/if}

                <Button
                    onclick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    class="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                    {#if isSubmitting}
                        <div
                            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        ></div>
                        Creating Your Profile...
                    {:else}
                        <CheckCircle class="w-5 h-5 mr-2" />
                        Complete Setup & Join Startup Connect
                    {/if}
                </Button>

                <p class="text-xs text-green-600">
                    This will create your profile and give you access to the
                    full platform
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Help Text -->
    <div class="text-center text-sm text-gray-500 space-y-2">
        <p>
            Need to make changes? Click any "Edit" button above to go back to
            that step
        </p>
        <p>
            Your information is secure and will only be shared according to your
            privacy preferences
        </p>
    </div>
</div>
