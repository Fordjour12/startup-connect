<script lang="ts">
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Switch } from "@/components/ui/switch";
    import {
        MessageCircle,
        Bell,
        Palette,
        Phone,
        Mail,
        Video,
        Users,
        Settings,
        Moon,
        Sun,
        Monitor,
        Smartphone,
    } from "@lucide/svelte";
    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    // Form data binding
    let formData = $state({
        communicationMethods:
            onboarding.formData.preferences?.communicationMethods || [],
        communicationFrequency:
            onboarding.formData.preferences?.communicationFrequency || "",
        notificationTypes:
            onboarding.formData.preferences?.notificationTypes || [],
        themePreference:
            onboarding.formData.preferences?.themePreference || "system",
    });

    // Validation errors
    let errors = $state<Record<string, string>>({});

    // Form validation - derived value for form validity
    let isFormValid = $derived(Object.keys(errors).length === 0);

    // Effect to update validation errors when form data changes
    $effect(() => {
        const newErrors: Record<string, string> = {};

        if (formData.communicationMethods.length === 0) {
            newErrors.communicationMethods =
                "Please select at least one communication method";
        }

        errors = newErrors;
    });

    // Function to validate form (for explicit validation calls)
    function validateForm(): boolean {
        return isFormValid;
    }

    // Communication method options with descriptions

    const communicationMethodOptions: Array<{
        value: "video_calls" | "email" | "in_person" | "chat";
        label: string;
        description: string;
        icon: any;
    }> = [
        {
            value: "video_calls",
            label: "Video Calls",
            description: "Face-to-face meetings via Zoom, Meet, etc.",
            icon: Video,
        },
        {
            value: "email",
            label: "Email",
            description: "Traditional email communication",
            icon: Mail,
        },
        {
            value: "in_person",
            label: "In-Person",
            description: "Meet face-to-face when possible",
            icon: Users,
        },
        {
            value: "chat",
            label: "Chat/Messaging",
            description: "Instant messaging and chat platforms",
            icon: MessageCircle,
        },
    ];

    // Communication frequency options
    const frequencyOptions = [
        {
            value: "immediate",
            label: "Immediate",
            description: "Respond as soon as possible",
        },
        {
            value: "same_day",
            label: "Same Day",
            description: "Respond within the same business day",
        },
        {
            value: "within_week",
            label: "Within a Week",
            description: "Respond within 2-7 days",
        },
        {
            value: "flexible",
            label: "Flexible",
            description: "No specific timeline, as convenient",
        },
    ];

    // Notification types
    const notificationTypeOptions = [
        {
            value: "new_matches",
            label: "New Matches",
            description: "When we find potential connections for you",
            icon: Users,
        },
        {
            value: "messages",
            label: "New Messages",
            description: "When someone sends you a message",
            icon: MessageCircle,
        },
        {
            value: "connection_requests",
            label: "Connection Requests",
            description: "When someone wants to connect with you",
            icon: Phone,
        },
        {
            value: "opportunities",
            label: "New Opportunities",
            description: "Investment opportunities, projects, etc.",
            icon: Bell,
        },
        {
            value: "updates",
            label: "Platform Updates",
            description: "New features and important announcements",
            icon: Settings,
        },
        {
            value: "weekly_digest",
            label: "Weekly Digest",
            description: "Summary of your activity and matches",
            icon: Mail,
        },
    ];

    // Theme options
    const themeOptions = [
        {
            value: "light",
            label: "Light Mode",
            description: "Clean, bright interface",
            icon: Sun,
        },
        {
            value: "dark",
            label: "Dark Mode",
            description: "Easy on the eyes in low light",
            icon: Moon,
        },
        {
            value: "system",
            label: "System Default",
            description: "Match your device settings",
            icon: Monitor,
        },
    ];

    // Auto-save changes
    $effect(() => {
        const timeoutId = setTimeout(() => {
            onboarding.updateFormData({ preferences: formData });
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    function toggleCommunicationMethod(
        method: "email" | "video_calls" | "in_person" | "chat",
    ) {
        if (formData.communicationMethods.includes(method)) {
            formData.communicationMethods =
                formData.communicationMethods.filter((m: any) => m !== method);
        } else {
            formData.communicationMethods = [
                ...formData.communicationMethods,
                method,
            ];
        }
    }

    function toggleNotificationType(type: string) {
        if (formData.notificationTypes.includes(type)) {
            formData.notificationTypes = formData.notificationTypes.filter(
                (t: any) => t !== type,
            );
        } else {
            formData.notificationTypes = [...formData.notificationTypes, type];
        }
    }

    async function handleContinue() {
        if (validateForm()) {
            onboarding.markStepComplete("preferences");
            await onboarding.goNext();
        }
    }
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-heading">
            Communication Preferences
        </h2>
        <p class="text-body">
            Let us know how you prefer to communicate and stay updated
        </p>
    </div>

    <!-- Communication Methods -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <MessageCircle class="w-5 h-5 text-info" />
                Preferred Communication Methods *
            </CardTitle>
            <p class="text-sm text-body">
                How would you like others to reach out to you? (Select multiple)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid gap-4">
                {#each communicationMethodOptions as method}
                    <button
                        class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onclick={() => toggleCommunicationMethod(method.value)}
                    >
                        <Checkbox
                            checked={formData.communicationMethods.includes(
                                method.value,
                            )}
                            onCheckedChange={() =>
                                toggleCommunicationMethod(method.value)}
                        />
                        <div class="flex items-start gap-3 flex-1">
                            <div class="p-2 bg-info rounded-lg">
                                <method.icon class="size-4 text-info" />
                            </div>
                            <div>
                                <div class="font-medium">{method.label}</div>
                                <div class="text-sm text-muted mt-1">
                                    {method.description}
                                </div>
                            </div>
                        </div>
                    </button>
                {/each}
            </div>
            {#if errors.communicationMethods}
                <p class="text-sm text-error">
                    {errors.communicationMethods}
                </p>
            {/if}
        </CardContent>
    </Card>

    <!-- Communication Frequency -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Bell class="w-5 h-5 text-success" />
                Response Time Preference
            </CardTitle>
            <p class="text-sm text-body">
                How quickly do you typically respond to messages?
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <RadioGroup bind:value={formData.communicationFrequency}>
                {#each frequencyOptions as option}
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                        />
                        <Label for={option.value} class="flex-1 cursor-pointer">
                            <div class="flex flex-col">
                                <span class="font-medium">{option.label}</span>
                                <span class="text-sm text-muted"
                                    >{option.description}</span
                                >
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
        </CardContent>
    </Card>

    <!-- Notification Preferences -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Smartphone class="w-5 h-5 text-highlight" />
                Notification Preferences
            </CardTitle>
            <p class="text-sm text-body">
                Choose what notifications you'd like to receive
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid gap-3">
                {#each notificationTypeOptions as notification}
                    <button
                        class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onclick={() =>
                            toggleNotificationType(notification.value)}
                    >
                        <Checkbox
                            checked={formData.notificationTypes.includes(
                                notification.value,
                            )}
                            onCheckedChange={() =>
                                toggleNotificationType(notification.value)}
                        />
                        <div class="flex items-start gap-3 flex-1">
                            <div class="p-2 bg-highlight rounded-lg">
                                <notification.icon
                                    class="size-4 text-highlight"
                                />
                            </div>
                            <div>
                                <div class="font-medium">
                                    {notification.label}
                                </div>
                                <div class="text-sm text-muted mt-1">
                                    {notification.description}
                                </div>
                            </div>
                        </div>
                    </button>
                {/each}
            </div>

            <!-- Quick toggle options -->
            <div class="pt-4 border-t space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <Label class="font-medium">Email Notifications</Label>
                        <p class="text-sm text-muted">
                            Receive notifications via email
                        </p>
                    </div>
                    <Switch
                        checked={formData.notificationTypes.length > 0}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                formData.notificationTypes =
                                    notificationTypeOptions.map((n) => n.value);
                            } else {
                                formData.notificationTypes = [];
                            }
                        }}
                    />
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <Label class="font-medium">Push Notifications</Label>
                        <p class="text-sm text-muted">
                            Receive browser push notifications
                        </p>
                    </div>
                    <Switch
                        checked={formData.notificationTypes.includes(
                            "messages",
                        ) ||
                            formData.notificationTypes.includes(
                                "connection_requests",
                            )}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                const importantTypes = [
                                    "messages",
                                    "connection_requests",
                                ];
                                const newTypes = [
                                    ...new Set([
                                        ...formData.notificationTypes,
                                        ...importantTypes,
                                    ]),
                                ];
                                formData.notificationTypes = newTypes;
                            } else {
                                formData.notificationTypes =
                                    formData.notificationTypes.filter(
                                        (t: any) =>
                                            ![
                                                "messages",
                                                "connection_requests",
                                            ].includes(t),
                                    );
                            }
                        }}
                    />
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Theme Preference -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Palette class="w-5 h-5 text-orange-600" />
                Theme Preference
            </CardTitle>
            <p class="text-sm text-body">
                Choose your preferred interface theme
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <RadioGroup bind:value={formData.themePreference}>
                {#each themeOptions as theme}
                    <div
                        class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted"
                    >
                        <RadioGroupItem
                            value={theme.value}
                            id={theme.value}
                            class="mt-1"
                        />
                        <Label for={theme.value} class="flex-1 cursor-pointer">
                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-orange-50 rounded-lg">
                                    <theme.icon
                                        class="size-4 text-orange-600"
                                    />
                                </div>
                                <div>
                                    <div class="font-medium">{theme.label}</div>
                                    <div class="text-sm text-muted mt-1">
                                        {theme.description}
                                    </div>
                                </div>
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
        </CardContent>
    </Card>

    <!-- Privacy & Communication Guidelines -->
    <Card class="bg-info border-info">
        <CardHeader>
            <CardTitle class="text-info">Privacy & Communication</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm text-info">
            <div class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    Your contact information is only shared when you choose to
                    connect with someone
                </p>
            </div>
            <div class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    You can update these preferences anytime in your profile
                    settings
                </p>
            </div>
            <div class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    We respect your communication boundaries and will never spam
                    you
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Continue Button -->
    <div class="flex justify-center pt-6">
        <Button
            onclick={handleContinue}
            disabled={!isFormValid}
            size="lg"
            class="px-8"
        >
            Continue to Review
        </Button>
    </div>

    <!-- Help Text -->
    <div class="text-center text-sm text-muted space-y-2">
        <p>These settings help us communicate with you effectively</p>
        <p>
            You can always change these preferences later in your account
            settings
        </p>
    </div>
</div>
