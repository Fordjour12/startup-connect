<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { Card, CardContent } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import {
        Rocket,
        Users,
        TrendingUp,
        Clock,
        CheckCircle,
        ArrowRight,
        Globe,
        MessageCircle,
        DollarSign,
    } from "@lucide/svelte";

    interface Props {
        onboarding: any;
    }

    let { onboarding }: Props = $props();

    const benefits = [
        {
            icon: Users,
            title: "Connect with the Right People",
            description:
                "Find co-founders, investors, or supporters based on your specific needs and goals.",
        },
        {
            icon: TrendingUp,
            title: "Get Personalized Recommendations",
            description:
                "Our algorithm will match you with opportunities that align with your profile.",
        },
        {
            icon: MessageCircle,
            title: "Direct Communication",
            description:
                "Message and collaborate with other members of the startup community.",
        },
        {
            icon: Globe,
            title: "Discover Local Startups",
            description:
                "Find and support startups in your country and region.",
        },
    ];

    const whatToExpect = [
        "Choose your role (Founder, Investor, or Supporter)",
        "Share your basic information and goals",
        "Tell us about your skills and experience",
        "Set your communication preferences",
        "Review and confirm your profile",
    ];

    async function handleGetStarted() {
        onboarding.markStepComplete("welcome");
        await onboarding.goNext();
    }
</script>

<div class="space-y-4">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
        <div class="flex justify-center mb-6">
            <div class="p-4 bg-primary/10 rounded-full">
                <Rocket class="w-12 h-12 text-primary" />
            </div>
        </div>

        <h2 class="text-3xl font-bold text-foreground">
            Welcome to Startup Connect!
        </h2>

        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community where startups, investors, and supporters
            come together to build the future. Let's create your profile to get
            you connected with the right opportunities.
        </p>

        <div
            class="flex items-center justify-center gap-4 text-sm text-muted-foreground"
        >
            <div class="flex items-center gap-2">
                <Clock class="w-4 h-4" />
                <span>5-7 minutes</span>
            </div>
            <div class="w-1 h-1 bg-muted rounded-full"></div>
            <div class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4" />
                <span>Auto-saved progress</span>
            </div>
        </div>
    </div>

    <!-- Benefits Grid -->
    <div class="grid md:grid-cols-2 gap-6">
        {#each benefits as benefit}
            <Card
                class="border-2 border-border hover:border-primary/30 transition-colors duration-200"
            >
                <CardContent class="p-6">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-primary/10 rounded-lg">
                            <benefit.icon class="w-6 h-6 text-primary" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-foreground mb-2">
                                {benefit.title}
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {benefit.description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>

    <!-- What to Expect -->
    <Card class="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent class="p-6">
            <h3
                class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
            >
                <CheckCircle class="w-5 h-5 text-primary" />
                What to expect during setup:
            </h3>

            <div class="space-y-3">
                {#each whatToExpect as item, index}
                    <div class="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            class="min-w-6 h-6 p-0 flex items-center justify-center text-xs"
                        >
                            {index + 1}
                        </Badge>
                        <span class="text-sm text-foreground">{item}</span>
                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>

    <!-- Role Preview -->
    <div class="bg-muted rounded-lg p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4 text-center">
            Choose Your Journey
        </h3>

        <div class="grid md:grid-cols-3 gap-4">
            <div
                class="text-center p-4 bg-card rounded-lg border border-border"
            >
                <div
                    class="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                    <Rocket class="w-6 h-6 text-accent" />
                </div>
                <h4 class="font-medium text-foreground mb-2">Founder</h4>
                <p class="text-xs text-muted-foreground">
                    Get your startup discovered and find the support you need to
                    grow.
                </p>
            </div>

            <div
                class="text-center p-4 bg-card rounded-lg border border-border"
            >
                <div
                    class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                    <DollarSign class="w-6 h-6 text-primary" />
                </div>
                <h4 class="font-medium text-foreground mb-2">Investor</h4>
                <p class="text-xs text-muted-foreground">
                    Discover promising startups that match your investment
                    criteria.
                </p>
            </div>

            <div
                class="text-center p-4 bg-card rounded-lg border border-border"
            >
                <div
                    class="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                    <Users class="w-6 h-6 text-secondary" />
                </div>
                <h4 class="font-medium text-foreground mb-2">Supporter</h4>
                <p class="text-xs text-muted-foreground">
                    Offer your skills and expertise to help startups succeed.
                </p>
            </div>
        </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center pt-6">
        <Button
            onclick={handleGetStarted}
            size="lg"
            class="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
            Let's Get Started
            <ArrowRight class="w-5 h-5 ml-2" />
        </Button>

        <p class="text-xs text-muted-foreground mt-3">
            Your information is secure and will only be shared with your
            consent.
        </p>
    </div>
</div>
