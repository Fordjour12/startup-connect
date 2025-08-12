<script lang="ts">
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Check, PartyPopper, Users, Globe, Target } from "@lucide/svelte";
    import { goto } from "$app/navigation";
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import { toast } from "svelte-sonner";

    // Auto-redirect after 5 seconds
    let countdown = $state(5);
    let timer: ReturnType<typeof setInterval> | null = null;
    let isSubmitting = $state(false);

    // Send onboarding data to API when component mounts
    $effect(() => {
        completeOnboarding();
    });

    async function completeOnboarding() {
        isSubmitting = true;
        
        try {
            // Use the onboarding state's submit method
            const result = await onboardingState.submit();

            if (!result.success) {
                throw new Error(result.error || "Failed to complete onboarding");
            }

            // Start countdown only after successful submission
            startCountdown();
        } catch (error) {
            console.error("Onboarding completion error:", error);
            toast.error("Failed to complete onboarding. Please try again.");
            isSubmitting = false;
        }
    }

    function startCountdown() {
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }

        // Start countdown
        timer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(timer!);
                redirectToDashboard();
            }
        }, 1000);

        // Cleanup function
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }

    function redirectToDashboard() {
        // Clear the timer when navigating
        if (timer) {
            clearInterval(timer);
        }
        
        // Redirect based on user role
        const role = onboardingState.formData.role;
        switch (role) {
            case "founder":
                goto("/founder-dashboard");
                break;
            case "investor":
                goto("/investor-dashboard");
                break;
            case "support":
                goto("/support-dashboard");
                break;
            default:
                goto("/dashboard");
        }
    }

    function goToDashboard() {
        // Clear the timer when manually navigating
        if (timer) {
            clearInterval(timer);
        }
        redirectToDashboard();
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
        <div
            class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
        >
            <PartyPopper class="w-6 h-6 text-green-600" />
        </div>
        <h2 class="text-2xl font-semibold">Welcome to StartupConnect! 🎉</h2>
        <p class="text-muted-foreground">
            Your profile has been successfully created. You're now ready to
            connect with the startup community.
        </p>
    </div>

    <!-- Success Card -->
    <Card class="border-green-200 bg-green-50/50">
        <CardHeader>
            <CardTitle class="flex items-center space-x-2">
                <Check class="w-5 h-5 text-green-600" />
                <span>Profile Successfully Created</span>
            </CardTitle>
            <CardDescription>
                Your profile is now live and visible to the community
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <Check class="w-4 h-4 text-green-500" />
                    <span class="text-sm">Profile verification completed</span>
                </div>
                <div class="flex items-center space-x-2">
                    <Check class="w-4 h-4 text-green-500" />
                    <span class="text-sm">Account activated</span>
                </div>
                <div class="flex items-center space-x-2">
                    <Check class="w-4 h-4 text-green-500" />
                    <span class="text-sm">Welcome email sent</span>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Next Steps -->
    <Card>
        <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
                Here's what you can do to get started
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start space-x-3">
                    <Users class="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <h4 class="font-medium">Connect with Others</h4>
                        <p class="text-sm text-muted-foreground">
                            Browse profiles and send connection requests
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <Target class="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <h4 class="font-medium">Set Your Goals</h4>
                        <p class="text-sm text-muted-foreground">
                            Update your goals and preferences
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <Globe class="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <h4 class="font-medium">Join Events</h4>
                        <p class="text-sm text-muted-foreground">
                            Discover upcoming events and webinars
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <Check class="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <h4 class="font-medium">Complete Profile</h4>
                        <p class="text-sm text-muted-foreground">
                            Add more details to your profile
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <Button variant="outline" onclick={() => onboardingState.previousStep()}>
        Back
    </Button>

    <div class="flex justify-center space-x-4">
        <Button variant="outline" onclick={goToDashboard}>
            Go to Dashboard
        </Button>
        <Button onclick={goToDashboard}>Start Exploring</Button>
    </div>

    <!-- Auto-redirect notice -->
    <div class="text-center text-sm text-muted-foreground">
        Redirecting to dashboard in {countdown} seconds...
    </div>
</div>
