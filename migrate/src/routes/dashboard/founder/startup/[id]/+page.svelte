<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Briefcase,
        Building,
        Calendar,
        DollarSign,
        ExternalLink,
        Facebook,
        Handshake,
        Instagram,
        Lightbulb,
        Linkedin,
        Mail,
        MapPin,
        Phone,
        Rocket,
        ShoppingCart,
        TrendingUp,
        Trophy,
        Twitter,
        Users,
    } from "@lucide/svelte";
    import type { PageData } from "./$types";
    // For potential date formatting

    let { data }: { data: PageData } = $props();
    const { startup } = data;

    // Helper function to format optional fields
    function displayValue(
        value: string | number | undefined | null,
        placeholder = "Not specified",
    ) {
        return value ? String(value) : placeholder;
    }

    // Helper to render social links
    function renderSocialLink(
        url: string | undefined | null,
        IconComponent: any,
        label: string,
    ) {
        if (!url) return null;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-primary hover:underline">
                    <svelte:component this={IconComponent} class="h-4 w-4" />
                    <span>${label}</span>
                </a>`;
    }

    // Map timeline types to icons (example)
    const timelineIcons = {
        achievement: Trophy,
        funding: DollarSign,
        partnership: Handshake,
        product: Rocket,
        launch: Rocket,
        other: Lightbulb,
    };

    const useOfFundsIcons = {
        product: Rocket,
        marketing: ShoppingCart,
        operations: Building,
        team: Users,
        other: Lightbulb,
    };
</script>

<div class="container mx-auto py-8">
    <div class="mx-auto max-w-4xl">
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="flex justify-between items-start gap-4">
                <div>
                    <h1 class="text-3xl font-bold mb-1">{startup.name}</h1>
                    <p class="text-muted-foreground text-lg">
                        {startup.industry}
                    </p>
                    <p
                        class="text-sm text-muted-foreground flex items-center gap-1 mt-1"
                    >
                        <MapPin class="h-3 w-3" />
                        {startup.location}
                    </p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    {#if startup.website}
                        <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            Website <ExternalLink class="h-4 w-4" />
                        </a>
                    {/if}
                    <span class="text-xs text-muted-foreground"
                        >Founded: {startup.foundedYear}</span
                    >
                    <span class="text-xs text-muted-foreground"
                        >Team Size: {startup.teamSize}</span
                    >
                </div>
            </div>
            <Separator />

            <!-- Description -->
            <Card>
                <CardHeader>
                    <CardTitle>About {startup.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p class="text-muted-foreground whitespace-pre-wrap">
                        {startup.description}
                    </p>
                </CardContent>
            </Card>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="space-y-8">
                    <!-- Key Metrics -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Metrics</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            <div class="flex items-center gap-2">
                                <DollarSign
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Revenue: {displayValue(
                                        startup.metrics.revenue,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <TrendingUp
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Growth: {displayValue(
                                        startup.metrics.growth,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Users class="h-4 w-4 text-muted-foreground" />
                                <span
                                    >Customers: {displayValue(
                                        startup.metrics.customers,
                                    )}</span
                                >
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Funding Information -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Funding</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            <div class="flex items-center gap-2">
                                <Briefcase
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Stage: {displayValue(
                                        startup.fundingStage,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <DollarSign
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Total Raised: {displayValue(
                                        startup.funding.total,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Calendar
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Last Round: {displayValue(
                                        startup.funding.lastRound,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-start gap-2">
                                <Handshake
                                    class="h-4 w-4 text-muted-foreground mt-1"
                                />
                                <span class="flex-1"
                                    >Investors: {displayValue(
                                        startup.funding.investors,
                                    )}</span
                                >
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Traction -->
                    {#if startup.traction}
                        <Card>
                            <CardHeader>
                                <CardTitle>Traction</CardTitle>
                                <CardDescription
                                    >Recent progress and milestones</CardDescription
                                >
                            </CardHeader>
                            <CardContent class="space-y-3">
                                {#if startup.traction.users}
                                    <div class="flex items-center gap-2">
                                        <Users
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Users: {displayValue(
                                                startup.traction.users,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if startup.traction.revenue}
                                    <div class="flex items-center gap-2">
                                        <DollarSign
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Revenue: {displayValue(
                                                startup.traction.revenue,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if startup.traction.growth}
                                    <div class="flex items-center gap-2">
                                        <TrendingUp
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Growth: {displayValue(
                                                startup.traction.growth,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if startup.traction.partnerships}
                                    <div class="flex items-start gap-2">
                                        <Handshake
                                            class="h-4 w-4 text-muted-foreground mt-1"
                                        />
                                        <span class="flex-1"
                                            >Partnerships: {displayValue(
                                                startup.traction.partnerships,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>
                    {/if}

                    <!-- Contact Information -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            <a
                                href={`mailto:${startup.contact.email}`}
                                class="flex items-center gap-2 text-primary hover:underline"
                            >
                                <Mail class="h-4 w-4" />
                                <span>{startup.contact.email}</span>
                            </a>
                            {#if startup.contact.phone}
                                <a
                                    href={`tel:${startup.contact.phone}`}
                                    class="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Phone class="h-4 w-4" />
                                    <span>{startup.contact.phone}</span>
                                </a>
                            {/if}
                            {#if startup.contact.address}
                                <div class="flex items-start gap-2">
                                    <MapPin
                                        class="h-4 w-4 text-muted-foreground mt-1"
                                    />
                                    <span class="flex-1"
                                        >{startup.contact.address}</span
                                    >
                                </div>
                            {/if}
                        </CardContent>
                    </Card>

                    <!-- Social Media -->
                    {#if startup.socialMedia}
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-3">
                                {@html renderSocialLink(
                                    startup.socialMedia.twitter,
                                    Twitter,
                                    "Twitter",
                                )}
                                {@html renderSocialLink(
                                    startup.socialMedia.linkedin,
                                    Linkedin,
                                    "LinkedIn",
                                )}
                                {@html renderSocialLink(
                                    startup.socialMedia.facebook,
                                    Facebook,
                                    "Facebook",
                                )}
                                {@html renderSocialLink(
                                    startup.socialMedia.instagram,
                                    Instagram,
                                    "Instagram",
                                )}
                            </CardContent>
                        </Card>
                    {/if}
                </div>

                <!-- Right Column -->
                <div class="space-y-8">
                    <!-- Team -->
                    {#if startup.teamMembers && startup.teamMembers.length > 0}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                {#each startup.teamMembers as member}
                                    <div class="flex items-start gap-4">
                                        <!-- Placeholder for Avatar -->
                                        <div
                                            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium"
                                        >
                                            {member.name.substring(0, 1)}
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-medium">
                                                {member.name}
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                    >({member.role})</span
                                                >
                                            </p>
                                            <p
                                                class="text-sm text-muted-foreground mb-1"
                                            >
                                                {member.bio}
                                            </p>
                                            {#if member.linkedin}
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                >
                                                    <Linkedin class="h-3 w-3" />
                                                    LinkedIn
                                                </a>
                                            {/if}
                                        </div>
                                    </div>
                                    {#if startup.teamMembers.length > 1}<Separator
                                            class="my-4"
                                        />{/if}
                                {/each}
                            </CardContent>
                        </Card>
                    {/if}

                    <!-- Business Model -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Model</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                class="text-muted-foreground whitespace-pre-wrap"
                            >
                                {startup.businessModel}
                            </p>
                        </CardContent>
                    </Card>

                    <!-- Target Market -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Target Market</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                class="text-muted-foreground whitespace-pre-wrap"
                            >
                                {startup.targetMarket}
                            </p>
                        </CardContent>
                    </Card>

                    <!-- Competitors -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Competitors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                class="text-muted-foreground whitespace-pre-wrap"
                            >
                                {startup.competitors}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <!-- Use of Funds -->
            <Card>
                <CardHeader>
                    <CardTitle>Use of Funds</CardTitle>
                    <CardDescription
                        >How the next funding round will be utilized</CardDescription
                    >
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each Object.entries(startup.useOfFunds) as [key, value]}
                        {#if value}
                            {@const Icon =
                                useOfFundsIcons[
                                    key as keyof typeof useOfFundsIcons
                                ] || Lightbulb}
                            <div class="flex items-start gap-3">
                                <div class="mt-1">
                                    <Icon class="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <h4 class="font-medium capitalize">
                                        {key}
                                    </h4>
                                    <p class="text-sm text-muted-foreground">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </CardContent>
            </Card>

            <!-- Timeline -->
            {#if startup.timeline && (startup.timeline.past?.length || startup.timeline.future?.length)}
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                        <CardDescription
                            >Key milestones and future plans</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <!-- Past Milestones -->
                        {#if startup.timeline.past && startup.timeline.past.length > 0}
                            <div>
                                <h3 class="text-lg font-medium mb-4">
                                    Past Milestones
                                </h3>
                                <div class="relative pl-6">
                                    <div
                                        class="absolute left-0 top-0 bottom-0 w-0.5 bg-border"
                                    ></div>
                                    {#each startup.timeline.past as milestone, index}
                                        {@const Icon =
                                            // timelineIcons[milestone.type] ||
                                            Lightbulb}
                                        <div class="mb-6 relative">
                                            <div
                                                class="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                                            >
                                                <Icon class="h-3 w-3 text-primary"/>
                                            </div>
                                            <p
                                                class="text-sm font-medium text-primary mb-0.5"
                                            >
                                                {milestone.date} - {milestone.title}
                                            </p>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <!-- Future Milestones -->
                        {#if startup.timeline.future && startup.timeline.future.length > 0}
                            <div>
                                <h3 class="text-lg font-medium mb-4">
                                    Future Plans
                                </h3>
                                <div class="relative pl-6">
                                    <div
                                        class="absolute left-0 top-0 bottom-0 w-0.5 bg-border border-dashed"
                                    ></div>
                                    {#each startup.timeline.future as milestone, index}
                                        {@const Icon =
                                            // timelineIcons[milestone.type] ||
                                            Lightbulb}
                                        <div class="mb-6 relative">
                                            <div
                                                class="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center"
                                            >
                                                    <Icon class="h-3 w-3 text-muted-foreground"/>
                                            </div>
                                            <p
                                                class="text-sm font-medium mb-0.5"
                                            >
                                                {milestone.date} - {milestone.title}
                                            </p>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </CardContent>
                </Card>
            {/if}
        </div>
    </div>
</div>
