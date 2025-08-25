<script lang="ts">
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { goto } from "$app/navigation";
    import {
        CheckCircle,
        Rocket,
        Users,
        Target,
        TrendingUp,
        MessageCircle,
        ArrowRight,
        Star,
        Gift,
        Calendar,
        Bell,
        Settings,
    } from "@lucide/svelte";
    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    const currentRole = onboarding.formData.role;
    const userName = onboarding.formData.basicInfo?.name || "there";

    // Get role-specific information
    function getRoleInfo(role: string | undefined) {
        switch (role) {
            case "founder":
                return {
                    label: "Founder",
                    icon: Rocket,
                    color: "text-success",
                    bgColor: "bg-success",
                    borderColor: "border-success",
                    nextSteps: [
                        {
                            title: "Create your startup profile",
                            description:
                                "Add details about your company and what you're building",
                            icon: Rocket,
                        },
                        {
                            title: "Browse investors",
                            description:
                                "Find investors that match your stage and industry",
                            icon: Users,
                        },
                        {
                            title: "Connect with supporters",
                            description:
                                "Get help with marketing, legal, and technical challenges",
                            icon: Target,
                        },
                        {
                            title: "Join founder community",
                            description:
                                "Network with other entrepreneurs and share experiences",
                            icon: MessageCircle,
                        },
                    ],
                    dashboardUrl: "/dashboard",
                };
            case "investor":
                return {
                    label: "Investor",
                    icon: TrendingUp,
                    color: "text-highlight",
                    bgColor: "bg-highlight",
                    borderColor: "border-purple-200",
                    nextSteps: [
                        {
                            title: "Browse startup deals",
                            description:
                                "Discover startups that match your investment criteria",
                            icon: Target,
                        },
                        {
                            title: "Set up deal alerts",
                            description:
                                "Get notified when relevant opportunities become available",
                            icon: Bell,
                        },
                        {
                            title: "Connect with founders",
                            description:
                                "Reach out to entrepreneurs building interesting companies",
                            icon: Users,
                        },
                        {
                            title: "Network with other investors",
                            description:
                                "Find co-investment opportunities and share deal flow",
                            icon: MessageCircle,
                        },
                    ],
                    dashboardUrl: "/dashboard",
                };
            case "support":
                return {
                    label: "Supporter",
                    icon: Users,
                    color: "text-info",
                    bgColor: "bg-info",
                    borderColor: "border-info",
                    nextSteps: [
                        {
                            title: "Browse startup projects",
                            description:
                                "Find startups that need your specific expertise",
                            icon: Target,
                        },
                        {
                            title: "Showcase your services",
                            description:
                                "Highlight your skills and past work to attract clients",
                            icon: Star,
                        },
                        {
                            title: "Set your availability",
                            description:
                                "Manage when and how you're available to help startups",
                            icon: Calendar,
                        },
                        {
                            title: "Build your reputation",
                            description:
                                "Get reviews and build credibility in the ecosystem",
                            icon: TrendingUp,
                        },
                    ],
                    dashboardUrl: "/dashboard",
                };
            default:
                return {
                    label: "User",
                    icon: Users,
                    color: "text-body",
                    bgColor: "bg-muted",
                    borderColor: "border-gray-200",
                    nextSteps: [],
                    dashboardUrl: "/dashboard",
                };
        }
    }

    const roleInfo = getRoleInfo(currentRole);

    // Platform features
    const platformFeatures = [
        {
            title: "Smart Matching",
            description:
                "AI-powered connections based on your goals and preferences",
            icon: Target,
        },
        {
            title: "Secure Messaging",
            description: "Direct communication with verified members",
            icon: MessageCircle,
        },
        {
            title: "Community Events",
            description: "Networking events, workshops, and startup meetups",
            icon: Calendar,
        },
        {
            title: "Resource Library",
            description: "Access to guides, templates, and expert content",
            icon: Gift,
        },
    ];

    async function handleGetStarted() {
        // Clear onboarding state
        onboarding.clearProgress();

        // Navigate to role-specific dashboard
        await goto(roleInfo.dashboardUrl);
    }

    async function handleExploreMore() {
        await goto("/");
    }

    async function handleSettings() {
        await goto("/settings");
    }
</script>

<div class="space-y-8">
    <!-- Success Header -->
    <div class="text-center space-y-6">
        <!-- Welcome Message -->
        <div class="space-y-4">
            <h1
                class="text-4xl font-bold text-heading flex flex-col items-center"
            >
                Welcome to Startup Connect,
                <span>{userName}! 🎉 </span>
            </h1>
            <p class="text-xl text-body max-w-2xl mx-auto">
                Your profile is complete and you're ready to start connecting
                with the startup ecosystem as a
            </p>
            <p class="text-3xl uppercase font-bold text-accent">
                {roleInfo.label.toLowerCase()}.
            </p>
        </div>
    </div>

    <!-- What's Next Section -->
    <Card class="border-2 bg-muted">
        <CardHeader>
            <CardTitle class="text-center text-2xl ">
                What's next for you?
            </CardTitle>
            <p class="text-center text-body">
                Here are some recommended next steps to get the most out of
                Startup Connect
            </p>
        </CardHeader>
        <CardContent class="space-y-6">
            <!-- Next Steps Grid -->
            <div class="grid md:grid-cols-2 gap-4">
                {#each roleInfo.nextSteps as step}
                    <div
                        class="flex items-start gap-4 p-4 bg-info rounded-xl border hover:shadow-md transition-shadow"
                    >
                        <div class="p-3 bg-muted rounded-lg">
                            <step.icon class="size-5 text-accent" />
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-heading mb-1">
                                {step.title}
                            </h4>
                            <p class="text-sm text-body">
                                {step.description}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>

    <!-- Platform Features -->
    <Card>
        <CardHeader>
            <CardTitle class="text-center text-xl">
                Explore Platform Features
            </CardTitle>
            <p class="text-center text-body">
                Discover what makes Startup Connect special
            </p>
        </CardHeader>
        <CardContent>
            <div class="grid md:grid-cols-2 gap-4">
                {#each platformFeatures as feature}
                    <div class="flex items-start gap-3 p-3">
                        <div class="p-2 bg-muted rounded-lg">
                            <feature.icon class="size-5 text-body" />
                        </div>
                        <div>
                            <h4 class="font-medium text-heading">
                                {feature.title}
                            </h4>
                            <p class="text-sm text-body">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>

    <!-- Pro Tips -->
    <Card class="bg-info">
        <CardHeader>
            <CardTitle class="flex items-center gap-2 text-info">
                <Star class="size-5 text-accent" />
                Pro Tips for Success
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm text-info">
            <div class="flex items-start gap-2">
                <div class="szie-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    <strong>Complete your profile:</strong> Add a profile photo and
                    detailed bio to increase connection rates by 3x
                </p>
            </div>
            <div class="flex items-start gap-2">
                <div class="size-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    <strong>Be active:</strong> Regular engagement helps our matching
                    algorithm find better connections for you
                </p>
            </div>
            <div class="flex items-start gap-2">
                <div class="size-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    <strong>Quality over quantity:</strong> Focus on meaningful connections
                    rather than connecting with everyone
                </p>
            </div>
            <div class="flex items-start gap-2">
                <div class="size-1.5 bg-info rounded-full mt-2"></div>
                <p>
                    <strong>Update regularly:</strong> Keep your goals and availability
                    current as your situation evolves
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div
        class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
    >
        <Button
            onclick={handleGetStarted}
            class="bg-accet px-8 py-3 text-lg"
        >
            Go to My Dashboard
            <ArrowRight class="size-5 ml-2" />
        </Button>

        <div class="flex gap-3">
            <Button
                variant="outline"
                onclick={handleExploreMore}
                class="flex items-center gap-2"
            >
                Explore Platform
            </Button>

            <Button
                variant="outline"
                onclick={handleSettings}
                class="flex items-center gap-2"
            >
                <Settings class="size-4" />
                Settings
            </Button>
        </div>
    </div>

    <!-- Welcome Stats -->
    <Card class="bg-muted">
        <CardContent class="pt-6">
            <div class="grid grid-cols-3 gap-6 text-center">
                <div>
                    <div class="text-2xl font-bold text-info">10,000+</div>
                    <div class="text-sm text-body">Active Members</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-success">2,500+</div>
                    <div class="text-sm text-body">Startups</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-highlight">$50M+</div>
                    <div class="text-sm text-body">Funding Raised</div>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Footer Message -->
    <div class="text-center space-y-4 pt-8">
        <p class="text-body">
            Thank you for joining our community! We're excited to see what
            you'll build and achieve.
        </p>
        <p class="text-sm text-muted">
            If you need any help getting started, don't hesitate to reach out to
            our support team.
        </p>

        <!-- Contact Links -->
        <div class="flex justify-center gap-4 text-sm">
            <a href="/help" class="text-info hover:underline"> Help Center </a>
            <span class="text-gray-300">•</span>
            <a href="/contact" class="text-info hover:underline">
                Contact Support
            </a>
            <span class="text-gray-300">•</span>
            <a href="/community" class="text-info hover:underline">
                Join Community
            </a>
        </div>
    </div>
</div>
