<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Rocket, Users, DollarSign, CheckCircle2 } from "@lucide/svelte";
    import type { UserRole } from "@/z-schema/onboarding-schema";
    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    let selectedRole = $state<UserRole | null>(
        onboarding.formData.role || null,
    );

    const roles = [
        {
            id: "founder" as UserRole,
            title: "Founder",
            subtitle: "Building the next big thing",
            description:
                "Share your startup, connect with investors, find co-founders, and get the support you need to grow your business.",
            icon: Rocket,
            benefits: [
                "Showcase your startup to investors",
                "Find co-founders and team members",
                "Access mentorship and guidance",
                "Connect with potential customers",
            ],
            examples: [
                "Early-stage startup founder",
                "Solo entrepreneur with an idea",
                "Team looking for investment",
                "Established startup seeking growth",
            ],
        },
        {
            id: "investor" as UserRole,
            title: "Investor",
            subtitle: "Funding tomorrow's innovations",
            description:
                "Discover promising startups, review pitches, and invest in companies that align with your investment strategy and portfolio goals.",
            icon: DollarSign,
            benefits: [
                "Access curated startup deals",
                "Filter by investment criteria",
                "Direct communication with founders",
                "Track your portfolio companies",
            ],
            examples: [
                "Angel investor",
                "Venture capital partner",
                "Private equity professional",
                "Corporate venture arm",
            ],
        },
        {
            id: "support" as UserRole,
            title: "Supporter",
            subtitle: "Empowering startup success",
            description:
                "Offer your expertise, services, or support to help startups succeed. Connect with founders who need your specific skills and experience.",
            icon: Users,
            benefits: [
                "Monetize your expertise",
                "Build your professional network",
                "Support innovative companies",
                "Gain diverse project experience",
            ],
            examples: [
                "Marketing consultant",
                "Legal advisor",
                "Technical mentor",
                "Business development expert",
            ],
        },
    ];

    let selectedRoleData = $derived(
        selectedRole ? roles.find((r) => r.id === selectedRole) : null,
    );

    function selectRole(role: UserRole) {
        selectedRole = role;
        onboarding.updateFormData({ role });
    }

    async function handleContinue() {
        if (selectedRole) {
            onboarding.markStepComplete("role-selection");
            await onboarding.goNext();
        }
    }
</script>

<!---->
<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold text-foreground font-head">
            How would you like to participate?
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto font-body">
            Choose the role that best describes how you want to engage with the
            startup community. You can always update this later.
        </p>
    </div>
    <!--    <!-- Role Selection Cards -->
    <div class="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {#each roles as role}
            <Card
                class="cursor-pointer transition-all duration-300 hover:shadow-lg border-border hover:border-primary/30 {selectedRole ===
                role.id
                    ? 'ring-2 ring-primary shadow-md border-primary'
                    : 'hover:border-primary/30'}"
                onclick={() => selectRole(role.id)}
            >
                <!-- Header -->
                <CardHeader>
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="bg-primary/10 p-3 rounded-lg">
                                <role.icon class="size-6 text-primary" />
                            </div>
                            <div>
                                <h3
                                    class="font-semibold text-lg text-foreground font-head"
                                >
                                    {role.title}
                                </h3>
                                <p
                                    class="text-sm text-muted-foreground font-body"
                                >
                                    {role.subtitle}
                                </p>
                            </div>
                        </div>

                        {#if selectedRole === role.id}
                            <CheckCircle2
                                class="size-6 text-primary flex-shrink-0"
                            />
                        {/if}
                    </div>
                </CardHeader>
                <CardContent class="p-2  flex flex-col">
                    <p
                        class="text-muted-foreground text-sm mb-6 leading-relaxed font-body"
                    >
                        {role.description}
                    </p>

                    <!-- Benefits -->
                    <div class="mb-6">
                        <h4
                            class="font-medium text-foreground mb-3 text-sm font-head"
                        >
                            What you can do:
                        </h4>
                        <ul class="space-y-2">
                            {#each role.benefits as benefit}
                                <li
                                    class="flex items-start gap-2 text-sm text-muted-foreground font-body"
                                >
                                    <CheckCircle2
                                        class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                                    />
                                    <span>{benefit}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <!-- Examples -->
                    <div class="mt-auto">
                        <h4
                            class="font-medium text-foreground mb-3 text-sm font-head"
                        >
                            Perfect for:
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            {#each role.examples.slice(0, 2) as example}
                                <Badge
                                    variant="outline"
                                    class="text-xs border-border bg-muted text-muted-foreground"
                                >
                                    {example}
                                </Badge>
                            {/each}
                            {#if role.examples.length > 2}
                                <Badge
                                    variant="outline"
                                    class="text-xs border-border bg-muted text-muted-foreground"
                                >
                                    +{role.examples.length - 2} more
                                </Badge>
                            {/if}
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>

    <!-- Selection Confirmation -->
    {#if selectedRoleData}
        <Card class="bg-primary/5 border-2 border-primary/20">
            <CardContent class="p-6">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/20 p-3 rounded-lg">
                        <selectedRoleData.icon class="w-6 h-6 text-primary" />
                    </div>
                    <div class="flex-1">
                        <h3
                            class="font-semibold text-lg text-foreground mb-2 font-head"
                        >
                            Great choice! You selected{" "}
                            {selectedRoleData.title}
                        </h3>
                        <p class="text-muted-foreground text-sm mb-4 font-body">
                            We'll customize your experience based on your role
                            as a {selectedRoleData.title.toLowerCase()}. Next,
                            we'll ask for some {selectedRoleData.title.toLowerCase()}-specific
                            information to better match you with relevant
                            opportunities.
                        </p>
                        <div class="flex flex-wrap gap-2">
                            {#each selectedRoleData.examples as example}
                                <Badge
                                    variant="outline"
                                    class="text-xs border-primary/30 bg-background text-foreground"
                                >
                                    {example}
                                </Badge>
                            {/each}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    {/if}

    <!-- Help Text -->
    <div class="text-center">
        <p class="text-sm text-muted-foreground font-body">
            Not sure which role fits you best?
            <button
                class="text-primary hover:underline font-medium"
                onclick={() => {
                    // TODO: Open help modal or tooltip
                }}
            >
                Learn more about each role
            </button>
        </p>
    </div>
</div>
