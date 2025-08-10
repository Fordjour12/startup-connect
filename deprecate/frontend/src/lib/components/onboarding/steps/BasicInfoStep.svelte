<script lang="ts">
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { User, FileText } from "@lucide/svelte";
    import { cn } from "@/utils";
    import {
        basicInfoSchema,
        type BasicInfo,
    } from "@/schemas/onboarding-schema";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import { z } from "zod";

    let { data } = $props();

    // Form data with proper typing
    let formData = $state<BasicInfo>({
        fullName: "",
        email: "",
        location: "",
        bio: "",
        linkedinUrl: "",
        website: "",
    });

    // Validation state
    let validationErrors = $state<Record<string, string>>({});

    // Initialize form with user data and saved progress
    onMount(() => {
        // Populate with user data if available
        if (data.user) {
            formData = {
                fullName: data.user.name || "",
                email: data.user.email || "",
                location: onboardingState.formData.location || "",
                bio: onboardingState.formData.bio || "",
                linkedinUrl: onboardingState.formData.linkedinUrl || "",
                website: onboardingState.formData.website || "",
            };
        } else {
            // Use saved progress if no user data
            formData = {
                fullName: onboardingState.formData.fullName || "",
                email: onboardingState.formData.email || "",
                location: onboardingState.formData.location || "",
                bio: onboardingState.formData.bio || "",
                linkedinUrl: onboardingState.formData.linkedinUrl || "",
                website: onboardingState.formData.website || "",
            };
        }
    });

    // Validate form using Zod
    function validateForm(): boolean {
        try {
            basicInfoSchema.parse(formData);
            validationErrors = {};
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const zodErrors = error.errors;
                const newErrors: Record<string, string> = {};

                zodErrors.forEach((err) => {
                    const field = err.path[0];
                    newErrors[field] = err.message;
                });

                validationErrors = newErrors;
            }
            return false;
        }
    }

    const handleNext = () => {
        if (validateForm()) {
            onboardingState.updateFormData(formData);
            onboardingState.nextStep();
            toast.success("Basic information saved successfully!");
        } else {
            toast.error("Please fix the errors before continuing.");
        }
    };

    // Get error for a specific field
    function getFieldError(field: keyof BasicInfo): string {
        return validationErrors[field] || "";
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
        <div
            class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
        >
            <User class="w-6 h-6 text-primary" />
        </div>
        <h2 class="text-2xl font-semibold">Tell us about yourself</h2>
        <p class="text-muted-foreground">
            This information helps us personalize your experience and connect
            you with the right people.
        </p>
    </div>

    <!-- Required Information -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center space-x-2">
                <User class="w-5 h-5" />
                <span>Required Information</span>
            </CardTitle>
            <CardDescription>
                These fields are required to create your profile
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Full Name -->
            <div class="space-y-2">
                <Label for="fullName">Full Name *</Label>
                <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    bind:value={formData.fullName}
                    class={cn(
                        getFieldError("fullName") && "border-destructive",
                    )}
                />
                {#if getFieldError("fullName")}
                    <p class="text-sm text-destructive">
                        {getFieldError("fullName")}
                    </p>
                {/if}
            </div>

            <!-- Email -->
            <div class="space-y-2">
                <Label for="email">Email Address *</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    bind:value={formData.email}
                    class={cn(getFieldError("email") && "border-destructive")}
                />
                {#if getFieldError("email")}
                    <p class="text-sm text-destructive">
                        {getFieldError("email")}
                    </p>
                {/if}
            </div>

            <!-- Location -->
            <div class="space-y-2">
                <Label for="location">Location *</Label>
                <Input
                    id="location"
                    type="text"
                    placeholder="City, Country (e.g., San Francisco, USA)"
                    bind:value={formData.location}
                    class={cn(
                        getFieldError("location") && "border-destructive",
                    )}
                />
                {#if getFieldError("location")}
                    <p class="text-sm text-destructive">
                        {getFieldError("location")}
                    </p>
                {/if}
            </div>
        </CardContent>
    </Card>

    <!-- Optional Information -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center space-x-2">
                <FileText class="w-5 h-5" />
                <span>Optional Information</span>
            </CardTitle>
            <CardDescription>
                Add these details to make your profile more complete
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Bio -->
            <div class="space-y-2">
                <Label for="bio">Bio</Label>
                <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself, your background, and what you're passionate about..."
                    bind:value={formData.bio}
                    rows={4}
                    maxlength={500}
                />
                <p class="text-xs text-muted-foreground">
                    {formData.bio?.length || 0}/500 characters
                </p>
                {#if getFieldError("bio")}
                    <p class="text-sm text-destructive">
                        {getFieldError("bio")}
                    </p>
                {/if}
            </div>

            <!-- LinkedIn -->
            <div class="space-y-2">
                <Label for="linkedinUrl">LinkedIn Profile</Label>
                <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    bind:value={formData.linkedinUrl}
                    class={cn(
                        getFieldError("linkedinUrl") && "border-destructive",
                    )}
                />
                {#if getFieldError("linkedinUrl")}
                    <p class="text-sm text-destructive">
                        {getFieldError("linkedinUrl")}
                    </p>
                {/if}
            </div>

            <!-- Website -->
            <div class="space-y-2">
                <Label for="website">Personal Website</Label>
                <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    bind:value={formData.website}
                    class={cn(getFieldError("website") && "border-destructive")}
                />
                {#if getFieldError("website")}
                    <p class="text-sm text-destructive">
                        {getFieldError("website")}
                    </p>
                {/if}
            </div>
        </CardContent>
    </Card>

    <!-- Tips -->
    <Card class="border-blue-200 bg-blue-50/50">
        <CardContent class="pt-6">
            <div class="flex items-start space-x-3">
                <div
                    class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5"
                >
                    <span class="text-white text-xs">💡</span>
                </div>
                <div class="text-sm">
                    <p class="font-medium text-blue-900 mb-1">Profile Tips</p>
                    <ul class="text-blue-700 space-y-1">
                        <li>
                            • Use your real name to build trust with other
                            members
                        </li>
                        <li>
                            • Add a bio to help others understand your
                            background and interests
                        </li>
                        <li>
                            • Include your LinkedIn profile to increase
                            credibility
                        </li>
                        <li>• You can always update this information later</li>
                    </ul>
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

        <Button onclick={handleNext}>Continue</Button>
    </div>
</div>
