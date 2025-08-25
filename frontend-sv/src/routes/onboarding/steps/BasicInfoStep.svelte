<script lang="ts">
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Badge } from "@/components/ui/badge";
    import {
        User,
        Mail,
        MapPin,
        Phone,
        Camera,
        Globe,
        Briefcase,
        GraduationCap,
        Languages,
        Clock,
    } from "@lucide/svelte";
    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    // Form data binding
    let formData = $state({
        name: onboarding.formData.basicInfo?.name || "",
        email: onboarding.formData.basicInfo?.email || "",
        profileImage: onboarding.formData.basicInfo?.profileImage || null,
        location: onboarding.formData.basicInfo?.location || "",
        city: onboarding.formData.basicInfo?.city || "",
        timezone: onboarding.formData.basicInfo?.timezone || "",
        bio: onboarding.formData.basicInfo?.bio || "",
        jobTitle: onboarding.formData.basicInfo?.jobTitle || "",
        industry: onboarding.formData.basicInfo?.industry || "",
        education: onboarding.formData.basicInfo?.education || "",
        phone: onboarding.formData.basicInfo?.phone || "",
        twitterHandle: onboarding.formData.basicInfo?.twitterHandle || "",
        linkedinUrl: onboarding.formData.basicInfo?.linkedinUrl || "",
        githubProfile: onboarding.formData.basicInfo?.githubProfile || "",
        portfolioWebsite: onboarding.formData.basicInfo?.portfolioWebsite || "",
        languages: onboarding.formData.basicInfo?.languages || [],
        employmentStatus: onboarding.formData.basicInfo?.employmentStatus || "",
    });

    // Current sub-step for multi-step form
    let currentSubStep = $state(0);
    const totalSubSteps = 3;

    // Form validation errors
    let errors = $state<Record<string, string>>({});
    let isValidating = $state(false);

    // Form validation - derived value for step validity
    let isCurrentStepValid = $derived(
        // Only validate the current sub-step
        currentSubStep === 0
            ? // Required fields for sub-step 1
              formData.name.trim().length >= 2 &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
            : // For other sub-steps, only validate URL fields if they have content
              !["linkedinUrl", "githubProfile", "portfolioWebsite"].some(
                  (field) => {
                      const value = formData[
                          field as keyof typeof formData
                      ] as string;
                      return (
                          value && value.trim() && !/^https?:\/\/.+/.test(value)
                      );
                  },
              ),
    );

    // Effect to update validation errors when form data changes
    $effect(() => {
        const newErrors: Record<string, string> = {};

        if (currentSubStep === 0) {
            // Required fields for sub-step 1
            if (!formData.name.trim()) {
                newErrors.name = "Name is required";
            } else if (formData.name.trim().length < 2) {
                newErrors.name = "Name must be at least 2 characters";
            }

            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
            }
        }

        // URL validation for social links (only show errors for current step)
        if (currentSubStep === 2) {
            const urlFields = [
                "linkedinUrl",
                "githubProfile",
                "portfolioWebsite",
            ];
            urlFields.forEach((field) => {
                const value = formData[
                    field as keyof typeof formData
                ] as string;
                if (value && value.trim() && !/^https?:\/\/.+/.test(value)) {
                    newErrors[field] =
                        "Please enter a valid URL (starting with http:// or https://)";
                }
            });
        }

        errors = newErrors;
        isValidating = false;
    });

    // Function to validate current step (for explicit validation calls)
    function validateCurrentStep(): boolean {
        const result = isCurrentStepValid;
        console.log("validateCurrentStep returning:", result);
        return result;
    }

    // Language input state
    let languageInput = $state("");

    // Industry suggestions
    const industryOptions = [
        "Technology",
        "Healthcare",
        "Finance",
        "E-commerce",
        "Education",
        "Manufacturing",
        "Marketing",
        "Real Estate",
        "Food & Beverage",
        "Entertainment",
        "Transportation",
        "Energy",
        "Other",
    ];

    // Employment status options
    const employmentOptions = [
        "Full-time employed",
        "Part-time employed",
        "Self-employed",
        "Freelancer",
        "Student",
        "Between jobs",
        "Retired",
        "Other",
    ];

    // Timezone options (simplified)
    const timezoneOptions = [
        "UTC-12:00",
        "UTC-11:00",
        "UTC-10:00",
        "UTC-09:00",
        "UTC-08:00",
        "UTC-07:00",
        "UTC-06:00",
        "UTC-05:00",
        "UTC-04:00",
        "UTC-03:00",
        "UTC-02:00",
        "UTC-01:00",
        "UTC+00:00",
        "UTC+01:00",
        "UTC+02:00",
        "UTC+03:00",
        "UTC+04:00",
        "UTC+05:00",
        "UTC+06:00",
        "UTC+07:00",
        "UTC+08:00",
        "UTC+09:00",
        "UTC+10:00",
        "UTC+11:00",
        "UTC+12:00",
    ];

    // Auto-save changes
    $effect(() => {
        const timeoutId = setTimeout(() => {
            onboarding.updateFormData({ basicInfo: formData });
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    function nextSubStep() {
        if (validateCurrentStep() && currentSubStep < totalSubSteps - 1) {
            currentSubStep++;
        }
    }

    function previousSubStep() {
        if (currentSubStep > 0) {
            currentSubStep--;
        }
    }

    function addLanguage() {
        if (
            languageInput.trim() &&
            !formData.languages.includes(languageInput.trim())
        ) {
            formData.languages = [...formData.languages, languageInput.trim()];
            languageInput = "";
        }
    }

    function removeLanguage(language: string) {
        formData.languages = formData.languages.filter(
            (lang: string) => lang !== language,
        );
    }

    function handleLanguageKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addLanguage();
        }
    }

    async function handleContinue() {
        console.log("handleContinue called");

        if (validateCurrentStep()) {
            console.log("Validation passed, proceeding...");

            // Mark the basic-info step as complete
            onboarding.markStepComplete("basic-info");
            console.log("Step marked as complete");

            // Update the form data one final time
            onboarding.updateFormData({ basicInfo: formData });
            console.log("Form data updated");

            // Navigate to the next step using the parent's navigation
            console.log("About to call onboarding.goNext()...");
            console.log("Current onboarding step:", onboarding.currentStep);
            console.log("Available steps:", onboarding.availableSteps);
            console.log("Next step:", onboarding.nextStep);

            await onboarding.goNext();
            console.log("onboarding.goNext() completed");
            console.log("New current step:", onboarding.currentStep);
        } else {
            console.log("Validation failed, cannot continue");
        }
    }

    function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            // TODO: Implement actual image upload
            const reader = new FileReader();
            reader.onload = (e) => {
                formData.profileImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
</script>

<div class="space-y-8 animate-fadeInUp">
    <!-- Progress indicator for sub-steps -->
    <div class="flex items-center justify-center space-x-2">
        {#each Array(totalSubSteps) as _, index}
            <div
                class="w-8 h-2 rounded-full transition-all duration-300 ease-out {index <=
                currentSubStep
                    ? 'bg-primary shadow-sm'
                    : 'bg-muted'}"
            ></div>
        {/each}
    </div>

    <!-- Sub-step 1: Essential Information -->
    {#if currentSubStep === 0}
        <Card
            class="animate-sectionIn animation-delay-200 shadow-md border-border"
        >
            <CardHeader
                class="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border"
            >
                <CardTitle
                    class="flex items-center gap-3 text-foreground font-head text-xl"
                >
                    <div class="p-2 bg-primary/10 rounded-lg">
                        <User class="w-6 h-6 text-primary" />
                    </div>
                    Essential Information
                </CardTitle>
                <p class="text-muted-foreground font-body">
                    Let's start with the basics
                </p>
            </CardHeader>
            <CardContent class="space-y-6 p-6">
                <!-- Profile Image Upload -->
                <div class="flex flex-col items-center space-y-4">
                    <div class="relative group">
                        <div
                            class="w-24 h-24 bg-muted rounded-full flex items-center justify-center overflow-hidden border-2 border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg"
                        >
                            {#if formData.profileImage}
                                <img
                                    src={formData.profileImage}
                                    alt="Profile"
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <Camera class="w-8 h-8 text-muted-foreground" />
                            {/if}
                        </div>
                        <label
                            for="profile-image"
                            class="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Camera class="w-3 h-3" />
                        </label>
                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            onchange={handleImageUpload}
                        />
                    </div>
                    <p class="text-xs text-muted-foreground font-body">
                        Optional: Add a profile photo
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Full Name -->
                    <div class="space-y-2">
                        <Label
                            for="name"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <User class="w-4 h-4 text-primary" />
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            bind:value={formData.name}
                            placeholder="Enter your full name"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 {errors.name
                                ? 'border-destructive ring-destructive/20'
                                : ''}"
                        />
                        {#if errors.name}
                            <p class="text-sm text-destructive font-body">
                                {errors.name}
                            </p>
                        {/if}
                    </div>

                    <!-- Email -->
                    <div class="space-y-2">
                        <Label
                            for="email"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <Mail class="w-4 h-4 text-primary" />
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            bind:value={formData.email}
                            placeholder="your.email@example.com"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 {errors.email
                                ? 'border-destructive ring-destructive/20'
                                : ''}"
                        />
                        {#if errors.email}
                            <p class="text-sm text-destructive font-body">
                                {errors.email}
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- Bio -->
                <div class="space-y-2">
                    <Label for="bio" class="text-foreground font-body">
                        About You
                        <span class="text-xs text-muted-foreground"
                            >(optional)</span
                        >
                    </Label>
                    <Textarea
                        id="bio"
                        bind:value={formData.bio}
                        placeholder="Tell us a bit about yourself, your background, and what you're passionate about..."
                        rows={3}
                        maxlength={500}
                        class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 resize-none"
                    />
                    <p class="text-xs text-muted-foreground font-body">
                        {formData.bio.length}/500 characters
                    </p>
                </div>
            </CardContent>
        </Card>
    {/if}

    <!-- Sub-step 2: Location & Professional Info -->
    {#if currentSubStep === 1}
        <Card
            class="animate-sectionIn animation-delay-400 shadow-md border-border"
        >
            <CardHeader
                class="bg-gradient-to-r from-secondary/5 to-accent/5 border-b border-border"
            >
                <CardTitle
                    class="flex items-center gap-3 text-foreground font-head text-xl"
                >
                    <div class="p-2 bg-secondary/10 rounded-lg">
                        <MapPin class="w-6 h-6 text-secondary-foreground" />
                    </div>
                    Location & Professional Details
                </CardTitle>
                <p class="text-muted-foreground font-body">
                    Help others find and connect with you
                </p>
            </CardHeader>
            <CardContent class="space-y-6 p-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Location -->
                    <div class="space-y-2">
                        <Label
                            for="location"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <MapPin class="w-4 h-4 text-secondary-foreground" />
                            Country/Region
                        </Label>
                        <Input
                            id="location"
                            bind:value={formData.location}
                            placeholder="e.g., United States, Ghana, Nigeria"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- City -->
                    <div class="space-y-2">
                        <Label for="city" class="text-foreground font-body"
                            >City</Label
                        >
                        <Input
                            id="city"
                            bind:value={formData.city}
                            placeholder="e.g., San Francisco, Accra, Lagos"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- Job Title -->
                    <div class="space-y-2">
                        <Label
                            for="job-title"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <Briefcase class="w-4 h-4 text-accent" />
                            Current Position
                        </Label>
                        <Input
                            id="job-title"
                            bind:value={formData.jobTitle}
                            placeholder="e.g., Software Engineer, Founder, Student"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- Industry -->
                    <div class="space-y-2">
                        <Label for="industry" class="text-foreground font-body"
                            >Industry</Label
                        >
                        <select
                            id="industry"
                            bind:value={formData.industry}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                        >
                            <option value="">Select an industry</option>
                            {#each industryOptions as industry}
                                <option value={industry}>{industry}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Education -->
                    <div class="space-y-2">
                        <Label
                            for="education"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <GraduationCap class="w-4 h-4 text-accent" />
                            Education
                        </Label>
                        <Input
                            id="education"
                            bind:value={formData.education}
                            placeholder="e.g., MIT Computer Science, Self-taught"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- Employment Status -->
                    <div class="space-y-2">
                        <Label
                            for="employment"
                            class="text-foreground font-body"
                            >Employment Status</Label
                        >
                        <select
                            id="employment"
                            bind:value={formData.employmentStatus}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                        >
                            <option value="">Select status</option>
                            {#each employmentOptions as status}
                                <option value={status}>{status}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <!-- Timezone -->
                <div class="space-y-2">
                    <Label
                        for="timezone"
                        class="flex items-center gap-2 text-foreground font-body"
                    >
                        <Clock class="w-4 h-4 text-accent" />
                        Timezone
                    </Label>
                    <select
                        id="timezone"
                        bind:value={formData.timezone}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                    >
                        <option value="">Select your timezone</option>
                        {#each timezoneOptions as tz}
                            <option value={tz}>{tz}</option>
                        {/each}
                    </select>
                </div>

                <!-- Languages -->
                <div class="space-y-2">
                    <Label
                        for="languages"
                        class="flex items-center gap-2 text-foreground font-body"
                    >
                        <Languages class="w-4 h-4 text-accent" />
                        Languages Spoken
                    </Label>
                    <div class="space-y-3">
                        <div class="flex gap-2">
                            <Input
                                id="languages"
                                bind:value={languageInput}
                                placeholder="Add a language (press Enter or comma to add)"
                                onkeydown={handleLanguageKeydown}
                                class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onclick={addLanguage}
                                disabled={!languageInput.trim()}
                                class="border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                            >
                                Add
                            </Button>
                        </div>
                        {#if formData.languages.length > 0}
                            <div class="flex flex-wrap gap-2">
                                {#each formData.languages as language}
                                    <Badge
                                        variant="secondary"
                                        class="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 font-body"
                                        onclick={() => removeLanguage(language)}
                                    >
                                        {language} ×
                                    </Badge>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </CardContent>
        </Card>
    {/if}

    <!-- Sub-step 3: Contact & Social Links -->
    {#if currentSubStep === 2}
        <Card
            class="animate-sectionIn animation-delay-600 shadow-md border-border"
        >
            <CardHeader
                class="bg-gradient-to-r from-accent/5 to-accent2/5 border-b border-border"
            >
                <CardTitle
                    class="flex items-center gap-3 text-foreground font-head text-xl"
                >
                    <div class="p-2 bg-accent/10 rounded-lg">
                        <Globe class="w-6 h-6 text-accent" />
                    </div>
                    Contact & Social Links
                </CardTitle>
                <p class="text-muted-foreground font-body">
                    Let people know how to reach you (all optional)
                </p>
            </CardHeader>
            <CardContent class="space-y-6 p-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Phone -->
                    <div class="space-y-2">
                        <Label
                            for="phone"
                            class="flex items-center gap-2 text-foreground font-body"
                        >
                            <Phone class="w-4 h-4 text-accent" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            bind:value={formData.phone}
                            placeholder="+1 (555) 123-4567"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- Twitter -->
                    <div class="space-y-2">
                        <Label for="twitter" class="text-foreground font-body"
                            >Twitter Handle</Label
                        >
                        <Input
                            id="twitter"
                            bind:value={formData.twitterHandle}
                            placeholder="@yourusername"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200"
                        />
                    </div>

                    <!-- LinkedIn -->
                    <div class="space-y-2">
                        <Label for="linkedin" class="text-foreground font-body"
                            >LinkedIn Profile</Label
                        >
                        <Input
                            id="linkedin"
                            bind:value={formData.linkedinUrl}
                            placeholder="https://linkedin.com/in/yourprofile"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 {errors.linkedinUrl
                                ? 'border-destructive ring-destructive/20'
                                : ''}"
                        />
                        {#if errors.linkedinUrl}
                            <p class="text-sm text-destructive font-body">
                                {errors.linkedinUrl}
                            </p>
                        {/if}
                    </div>

                    <!-- GitHub -->
                    <div class="space-y-2">
                        <Label for="github" class="text-foreground font-body"
                            >GitHub Profile</Label
                        >
                        <Input
                            id="github"
                            bind:value={formData.githubProfile}
                            placeholder="https://github.com/yourusername"
                            class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 {errors.githubProfile
                                ? 'border-destructive ring-destructive/20'
                                : ''}"
                        />
                        {#if errors.githubProfile}
                            <p class="text-sm text-destructive font-body">
                                {errors.githubProfile}
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- Portfolio Website -->
                <div class="space-y-2">
                    <Label for="portfolio" class="text-foreground font-body"
                        >Portfolio/Website</Label
                    >
                    <Input
                        id="portfolio"
                        bind:value={formData.portfolioWebsite}
                        placeholder="https://yourportfolio.com"
                        class="border-input focus:ring-ring focus:border-ring transition-colors duration-200 {errors.portfolioWebsite
                            ? 'border-destructive ring-destructive/20'
                            : ''}"
                    />
                    {#if errors.portfolioWebsite}
                        <p class="text-sm text-destructive font-body">
                            {errors.portfolioWebsite}
                        </p>
                    {/if}
                </div>
            </CardContent>
        </Card>
    {/if}

    <!-- Navigation -->
    <div class="flex justify-between pt-6 animate-fadeIn animation-delay-800">
        <!-- Sub-step navigation -->
        {#if totalSubSteps > 1}
            <div class="flex gap-2">
                {#if currentSubStep > 0}
                    <Button
                        variant="outline"
                        onclick={previousSubStep}
                        class="border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    >
                        Previous
                    </Button>
                {/if}

                {#if currentSubStep < totalSubSteps - 1}
                    <Button
                        onclick={nextSubStep}
                        disabled={!isCurrentStepValid}
                        class="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Next
                    </Button>
                {:else}
                    <Button
                        onclick={handleContinue}
                        disabled={!isCurrentStepValid}
                        class="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Continue to Role-Specific Details
                    </Button>
                {/if}
            </div>
        {:else}
            <Button
                onclick={handleContinue}
                disabled={!isCurrentStepValid}
                class="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
            >
                Continue
            </Button>
        {/if}

        <div></div>
        <!-- Spacer for flex justify-between -->
    </div>

    <!-- Help text -->
    <div
        class="text-center text-sm text-muted-foreground space-y-2 animate-fadeIn animation-delay-1000"
    >
        <p class="font-body">
            All information is optional except name and email
        </p>
        <p class="font-body">You can always update your profile later</p>
    </div>
</div>
