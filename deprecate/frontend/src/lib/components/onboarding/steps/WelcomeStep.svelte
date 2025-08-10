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
    import { Rocket, ArrowRight, Users, Target, Clock } from "@lucide/svelte";

    const benefits = [
        {
            icon: Rocket,
            title: "Get Started Fast",
            description: "Complete your profile in just a few minutes",
        },
        {
            icon: Users,
            title: "Connect with the Right People",
            description:
                "Find founders, investors, and mentors who match your goals",
        },
        {
            icon: Target,
            title: "Personalized Experience",
            description:
                "Get recommendations tailored to your role and interests",
        },
        {
            icon: Clock,
            title: "Save Time",
            description: "Skip optional steps and complete them later",
        },
    ];
</script>

<div class="space-y-8">
    <!-- Welcome Header -->
    <div class="text-center space-y-4">
        <!-- <h1 class="text-3xl font-bold"> -->
        <h1
            class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
        >
            Welcome to StartupConnect!
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's get you set up with the perfect experience. We'll ask a few
            questions to personalize your journey and connect you with the right
            people in the startup ecosystem.
        </p>
    </div>

    <!-- Benefits Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {#each benefits as benefit}
            <Card class="border-0 shadow-sm">
                <CardHeader class="pb-3">
                    <div class="flex flex-col items-start space-x-3">
                        <div class="pb-3">
                            <benefit.icon class="size-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle class="text-base"
                                >{benefit.title}</CardTitle
                            >
                            <CardDescription class="text-sm">
                                {benefit.description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        {/each}
    </div>

    <!-- What to Expect -->
    <Card>
        <CardHeader>
            <CardTitle>What to Expect</CardTitle>
            <CardDescription>
                Here's what we'll cover in the next few steps:
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="space-y-3">
                <div class="flex items-center space-x-3">
                    <div
                        class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                    >
                        1
                    </div>
                    <span class="text-sm"
                        >Choose your role (Founder, Investor, or Supporter)</span
                    >
                </div>
                <div class="flex items-center space-x-3">
                    <div
                        class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                    >
                        2
                    </div>
                    <span class="text-sm"
                        >Tell us about yourself and your goals</span
                    >
                </div>
                <div class="flex items-center space-x-3">
                    <div
                        class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
                    >
                        3
                    </div>
                    <span class="text-sm">Complete your profile setup</span>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-center pt-6">
        <Button onclick={() => onboardingState.nextStep()}>
            Get Started
            <ArrowRight class="w-4 h-4 ml-2" />
        </Button>
    </div>

    <!-- Progress Info -->
    <div class="text-center text-sm text-muted-foreground">
        <p>This will take about 5-10 minutes</p>
        <p>Your progress will be saved automatically</p>
    </div>
</div>
