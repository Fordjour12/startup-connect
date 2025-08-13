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
    import { Label } from "@/components/ui/label";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Settings, Bell, Palette, Inbox } from "@lucide/svelte";
    import { preferencesSchema } from "@/z-schema/onboarding-schema";
    import type { Preferences as StatePreferences } from "@/hooks/onboarding-state.svelte";
    import { toast } from "svelte-sonner";
    import { z } from "zod";

    // Form data (hydrated from onboarding state)
    let formData = $state<StatePreferences>({
        communicationMethods:
            onboardingState.formData.preferences.communicationMethods ?? [],
        communicationFrequency:
            onboardingState.formData.preferences.communicationFrequency ?? "",
        notificationTypes:
            onboardingState.formData.preferences.notificationTypes ?? [],
        themePreference:
            onboardingState.formData.preferences.themePreference ?? "",
    });

    // Validation state
    let validationErrors = $state<Record<string, string>>({});

    // Validate form using Zod
    function validateForm(): boolean {
        try {
            preferencesSchema.parse(formData);
            validationErrors = {};
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                for (const err of error.errors) {
                    const field = String(err.path[0] ?? "");
                    if (field) newErrors[field] = err.message;
                }
                validationErrors = newErrors;
            }
            return false;
        }
    }

    // Get error for a specific field
    function getFieldError(field: keyof StatePreferences): string {
        return validationErrors[field] || "";
    }

    // Notification type options
    const notificationTypeOptions = [
        { value: "email", label: "Email" },
        { value: "in_app", label: "In-app" },
        { value: "push", label: "Push" },
    ] as const;

    // Frequency options
    const frequencyOptions = [
        { value: "daily", label: "Daily", description: "Daily notifications" },
        { value: "weekly", label: "Weekly", description: "Weekly digest" },
        { value: "monthly", label: "Monthly", description: "Monthly summary" },
    ] as const;

    // Theme options
    const themeOptions = [
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
    ] as const;

    // Communication method options
    const communicationMethodOptions = [
        { value: "video_calls", label: "Video Calls", icon: "📹" },
        { value: "email", label: "Email", icon: "📧" },
        { value: "in_person", label: "In Person", icon: "🤝" },
        { value: "chat", label: "Chat", icon: "💬" },
    ] as const;

    function toggleCommunicationMethod(
        method: (typeof communicationMethodOptions)[number]["value"],
    ) {
        if (formData.communicationMethods.includes(method)) {
            formData.communicationMethods =
                formData.communicationMethods.filter((m) => m !== method);
        } else {
            formData.communicationMethods = [
                ...formData.communicationMethods,
                method,
            ];
        }
    }

    function toggleNotificationType(
        type: (typeof notificationTypeOptions)[number]["value"],
    ) {
        if (formData.notificationTypes.includes(type)) {
            formData.notificationTypes = formData.notificationTypes.filter(
                (t) => t !== type,
            );
        } else {
            formData.notificationTypes = [...formData.notificationTypes, type];
        }
    }

    // Debounced effect to reduce update frequency
    let updateTimeout: ReturnType<typeof setTimeout> | null = null;

    $effect(() => {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            onboardingState.updateFormData({ preferences: { ...formData } });
        }, 300);
    });

    const handleNext = () => {
        if (validateForm()) {
            onboardingState.updateFormData({ preferences: { ...formData } });
            onboardingState.nextStep();
            toast.success("Preferences saved successfully!");
        } else {
            toast.error("Please fix the errors before continuing.");
        }
    };
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
        <div
            class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
            <Settings class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Matching Preferences</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us how you prefer to connect and collaborate. This helps us
            find the perfect matches for you.
        </p>
    </div>

    <!-- Communication Methods -->
    <Card class="border-2 border-primary/10">
        <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
                <Settings class="w-6 h-6 text-primary" />
                Communication Methods
            </CardTitle>
            <CardDescription>
                How do you prefer to communicate? Select all that apply.
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each communicationMethodOptions as option}
                    <label
                        class="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <Checkbox
                            checked={formData.communicationMethods.includes(
                                option.value,
                            )}
                            onCheckedChange={() =>
                                toggleCommunicationMethod(option.value)}
                        />
                        <span class="text-xl">{option.icon}</span>
                        <div class="font-medium">{option.label}</div>
                    </label>
                {/each}
            </div>
            {#if getFieldError("communicationMethods")}
                <p class="text-sm text-destructive flex items-center gap-2">
                    {getFieldError("communicationMethods")}
                </p>
            {/if}
        </CardContent>
    </Card>

    <!-- Notification Types -->
    <Card class="border-2 border-primary/10">
        <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
                <Inbox class="w-6 h-6 text-primary" />
                Notification Types
            </CardTitle>
            <CardDescription>
                Choose how you want to receive notifications.
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each notificationTypeOptions as option}
                    <label
                        class="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <Checkbox
                            checked={formData.notificationTypes.includes(
                                option.value,
                            )}
                            onCheckedChange={() =>
                                toggleNotificationType(option.value)}
                        />
                        <div class="font-medium">{option.label}</div>
                    </label>
                {/each}
            </div>
            {#if getFieldError("notificationTypes")}
                <p class="text-sm text-destructive flex items-center gap-2">
                    {getFieldError("notificationTypes")}
                </p>
            {/if}
        </CardContent>
    </Card>

    <!-- Communication Frequency -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
                <Bell class="w-6 h-6 text-primary" />
                Notification Frequency
            </CardTitle>
            <CardDescription>
                How often would you like to receive updates?
            </CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup
                bind:value={formData.communicationFrequency}
                class="space-y-4"
            >
                {#each frequencyOptions as option}
                    <div
                        class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                        />
                        <Label for={option.value} class="flex-1 cursor-pointer">
                            <div class="font-medium">{option.label}</div>
                            <div class="text-sm text-muted-foreground">
                                {option.description}
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
            {#if getFieldError("communicationFrequency")}
                <p
                    class="text-sm text-destructive mt-2 flex items-center gap-2"
                >
                    {getFieldError("communicationFrequency")}
                </p>
            {/if}
        </CardContent>
    </Card>

    <!-- Theme Preference -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
                <Palette class="w-6 h-6 text-primary" />
                Theme Preference
            </CardTitle>
            <CardDescription>Choose your display theme.</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup bind:value={formData.themePreference} class="space-y-3">
                {#each themeOptions as option}
                    <div
                        class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                        <RadioGroupItem
                            value={option.value}
                            id={`theme-${option.value}`}
                        />
                        <Label
                            for={`theme-${option.value}`}
                            class="flex-1 cursor-pointer"
                        >
                            <div class="font-medium">{option.label}</div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
            {#if getFieldError("themePreference")}
                <p
                    class="text-sm text-destructive mt-2 flex items-center gap-2"
                >
                    {getFieldError("themePreference")}
                </p>
            {/if}
        </CardContent>
    </Card>

    <!-- Tips Section -->
    <Card class="border-2 border-border bg-primary/5">
        <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
                <Settings class="w-6 h-6 text-primary" />
                Preferences
            </CardTitle>
            <CardDescription>
                Configure how and when we reach you, plus your visual theme.
            </CardDescription>
        </CardHeader>
    </Card>

    <Card class="border-foreground bg-foreground/30">
        <CardContent class="pt-6">
            <div class="flex items-start space-x-3">
                <div
                    class="w-8 h-8 bg-foreground rounded-full flex items-center justify-center mt-0.5"
                >
                    <span class="text-white text-sm">💡</span>
                </div>
                <div class="space-y-2">
                    <p class="font-medium font-head">Pro Tips</p>
                    <ul class="space-y-1 text-sm">
                        <li>
                            • Select at least one notification type to stay
                            informed
                        </li>
                        <li>
                            • Pick a frequency that matches your inbox tolerance
                        </li>
                        <li>• Theme can be changed anytime in settings</li>
                    </ul>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-6">
        <Button
            variant="outline"
            onclick={() => onboardingState.previousStep()}
            class="px-8"
        >
            Back
        </Button>

        <Button onclick={handleNext} class="px-8">Continue</Button>
    </div>
</div>
