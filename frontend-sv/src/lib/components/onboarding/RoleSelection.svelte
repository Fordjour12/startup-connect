<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Check } from "@lucide/svelte";
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import type { UserRole } from "@/schemas/onboarding-schema";

    let { data } = $props();

    // Get selected role from onboarding state
    let selectedRole = $derived(onboardingState.formData.role || null);

    // Map onboarding role back to database role for UI comparison
    const reverseRoleMapping: Record<string, string> = {
        founder: "founder",
        investor: "investor",
        supporter: "support", // Map onboarding 'supporter' back to database 'support'
    };

    // Validation
    let isValid = $derived(selectedRole !== null);

    const handleRoleSelect = (roleId: string) => {
        // Map database role to onboarding role
        const roleMapping: Record<string, UserRole> = {
            founder: "founder",
            investor: "investor",
            support: "supporter", // Map database 'support' to onboarding 'supporter'
            user: "founder", // Map Better Auth default 'user' to 'founder'
        };

        const mappedRole = roleMapping[roleId] || "founder";

        onboardingState.updateFormData({ role: mappedRole });
    };

    const handleNext = () => {
        if (isValid) {
            onboardingState.nextStep();
        }
    };
</script>

<div class="space-y-6">
    <div class="text-center space-y-2">
        <h2 class="text-xl font-semibold">Choose your role</h2>
        <p class="text-sm text-muted-foreground">
            Select the role that best describes you to customize your experience
        </p>
    </div>

    <div class="grid gap-4 md:grid-cols-1">
        {#each data.roles as role}
            <Card
                class="cursor-pointer transition-all duration-200 hover:shadow-md {reverseRoleMapping[
                    selectedRole || ''
                ] === role.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'}"
                onclick={() => handleRoleSelect(role.id)}
            >
                <CardHeader class="pb-3">
                    <div class="flex items-start space-x-4">
                        <div class="text-3xl">{role.icon}</div>
                        <div class="flex-1">
                            <CardTitle class="text-lg">{role.title}</CardTitle>
                            <CardDescription class="mt-1">
                                {role.description}
                            </CardDescription>
                        </div>
                        {#if reverseRoleMapping[selectedRole || ""] === role.id}
                            <div class="flex-shrink-0">
                                <div
                                    class="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <Check
                                        class="w-4 h-4 text-primary-foreground"
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>
                </CardHeader>
                <CardContent class="pt-0">
                    <ul class="space-y-2">
                        {#each role.features as feature}
                            <li
                                class="flex items-center space-x-2 text-sm text-muted-foreground"
                            >
                                <Check
                                    class="w-4 h-4 text-primary flex-shrink-0"
                                />
                                <span>{feature}</span>
                            </li>
                        {/each}
                    </ul>
                </CardContent>
            </Card>
        {/each}
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4">
        <Button
            variant="outline"
            onclick={() => onboardingState.previousStep()}
        >
            Back
        </Button>

        <Button onclick={handleNext} disabled={!isValid}>
            Continue with {selectedRole
                ? data.roles.find(
                      (r: any) => r.id === reverseRoleMapping[selectedRole],
                  )?.title
                : "role"}
        </Button>
    </div>

    <div class="text-center">
        <p class="text-xs text-muted-foreground">
            You can change your role later in your account settings
        </p>
    </div>
</div>
