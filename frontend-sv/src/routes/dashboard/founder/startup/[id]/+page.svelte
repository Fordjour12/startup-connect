<script lang="ts">
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import { useStartupActions } from "@/hooks/use-startup-actions.svelte";
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

    let { data }: { data: PageData } = $props();
    // Wrap startup in a reactive object to avoid reassignment issues
    let state = $state({ startup: data.startup });

    // Initialize startup actions - now uses Svelte 5 runes internally
    const startupActions = useStartupActions();

    // Helper function to safely parse JSON strings
    function parseJsonField<T>(field: string | null): T | null {
        if (!field) return null;
        try {
            return JSON.parse(field) as T;
        } catch {
            return null;
        }
    }

    // Parse complex fields using derived values that will update when state.startup changes
    const metrics = $derived(
        parseJsonField<{
            revenue?: string;
            growth?: string;
            customers?: string;
        }>(state.startup.metrics),
    );

    const funding = $derived(
        parseJsonField<{
            total?: string;
            lastRound?: string;
            investors?: string;
        }>(state.startup.funding),
    );

    const socialMedia = $derived(
        parseJsonField<{
            twitter?: string;
            linkedin?: string;
            facebook?: string;
            instagram?: string;
        }>(state.startup.social_media),
    );

    const contact = $derived(
        parseJsonField<{
            email: string;
            phone?: string;
            address?: string;
        }>(state.startup.contact),
    );

    const traction = $derived(
        parseJsonField<{
            users?: string;
            revenue?: string;
            growth?: string;
            partnerships?: string;
        }>(state.startup.traction),
    );

    const useOfFunds = $derived(
        parseJsonField<{
            product?: string;
            marketing?: string;
            operations?: string;
            team?: string;
            other?: string;
        }>(state.startup.use_of_funds),
    );

    const timeline = $derived(
        parseJsonField<{
            past?: Array<{
                date: string;
                title: string;
                description: string;
                type?: string;
            }>;
            future?: Array<{
                date: string;
                title: string;
                description: string;
                type?: string;
            }>;
        }>(state.startup.timeline),
    );

    // team_members is already an array of strings, not a JSON field
    const teamMembers = $derived(state.startup.team_members);

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

    // Action handlers
    async function handlePublish() {
        const updatedStartup = await startupActions.publishStartup(
            state.startup.id,
        );
        if (updatedStartup) {
            state.startup = updatedStartup;
        }
    }

    async function handleUnpublish() {
        const updatedStartup = await startupActions.unpublishStartup(
            state.startup.id,
        );
        if (updatedStartup) {
            state.startup = updatedStartup;
        }
    }

    async function handleDelete() {
        // if (
        //     confirm(
        //         "Are you sure you want to delete this startup? This action cannot be undone.",
        //     )
        // ) {
        //     const success = await startupActions.deleteStartup(
        //         state.startup.id,
        //     );
        //     if (success) {
        goto(`/dashboard/founder/startup/${state.startup.id}/delete`);
        // }
        // }
    }

    function handleEdit() {
        goto(`/dashboard/founder/startup/${state.startup.id}/edit`);
    }
</script>

<div class="container mx-auto py-8">
    <div class="mx-auto max-w-4xl">
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="flex justify-between items-start gap-4">
                <div>
                    <h1 class="text-3xl font-bold mb-1">
                        {state.startup.name}
                    </h1>
                    <p class="text-muted-foreground text-lg">
                        {state.startup.industry}
                    </p>
                    <p
                        class="text-sm text-muted-foreground flex items-center gap-1 mt-1"
                    >
                        <MapPin class="h-3 w-3" />
                        {state.startup.location}
                    </p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    {#if state.startup.website}
                        <a
                            href={state.startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            Website <ExternalLink class="h-4 w-4" />
                        </a>
                    {/if}
                    <span class="text-xs text-muted-foreground"
                        >Founded: {state.startup.founded_year}</span
                    >
                    <span class="text-xs text-muted-foreground"
                        >Team Size: {state.startup.team_size}</span
                    >
                </div>
            </div>
            <Separator />

            <!-- Description -->
            <Card>
                <CardHeader>
                    <CardTitle>About {state.startup.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p class="text-muted-foreground whitespace-pre-wrap">
                        {state.startup.description}
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
                                        metrics?.revenue,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <TrendingUp
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Growth: {displayValue(
                                        metrics?.growth,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Users class="h-4 w-4 text-muted-foreground" />
                                <span
                                    >Customers: {displayValue(
                                        metrics?.customers,
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
                                        state.startup.funding_stage,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <DollarSign
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Total Raised: {displayValue(
                                        funding?.total,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-center gap-2">
                                <Calendar
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <span
                                    >Last Round: {displayValue(
                                        funding?.lastRound,
                                    )}</span
                                >
                            </div>
                            <div class="flex items-start gap-2">
                                <Handshake
                                    class="h-4 w-4 text-muted-foreground mt-1"
                                />
                                <span class="flex-1"
                                    >Investors: {displayValue(
                                        funding?.investors,
                                    )}</span
                                >
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Traction -->
                    {#if traction}
                        <Card>
                            <CardHeader>
                                <CardTitle>Traction</CardTitle>
                                <CardDescription
                                    >Recent progress and milestones</CardDescription
                                >
                            </CardHeader>
                            <CardContent class="space-y-3">
                                {#if traction.users}
                                    <div class="flex items-center gap-2">
                                        <Users
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Users: {displayValue(
                                                traction.users,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if traction.revenue}
                                    <div class="flex items-center gap-2">
                                        <DollarSign
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Revenue: {displayValue(
                                                traction.revenue,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if traction.growth}
                                    <div class="flex items-center gap-2">
                                        <TrendingUp
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span
                                            >Growth: {displayValue(
                                                traction.growth,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                                {#if traction.partnerships}
                                    <div class="flex items-start gap-2">
                                        <Handshake
                                            class="h-4 w-4 text-muted-foreground mt-1"
                                        />
                                        <span class="flex-1"
                                            >Partnerships: {displayValue(
                                                traction.partnerships,
                                            )}</span
                                        >
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>
                    {/if}

                    <!-- Contact Information -->
                    {#if contact}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-3">
                                <a
                                    href={`mailto:${contact.email}`}
                                    class="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Mail class="h-4 w-4" />
                                    <span>{contact.email}</span>
                                </a>
                                {#if contact.phone}
                                    <a
                                        href={`tel:${contact.phone}`}
                                        class="flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <Phone class="h-4 w-4" />
                                        <span>{contact.phone}</span>
                                    </a>
                                {/if}
                                {#if contact.address}
                                    <div class="flex items-start gap-2">
                                        <MapPin
                                            class="h-4 w-4 text-muted-foreground mt-1"
                                        />
                                        <span class="flex-1"
                                            >{contact.address}</span
                                        >
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>
                    {/if}

                    <!-- Social Media -->
                    {#if socialMedia}
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-3">
                                {@html renderSocialLink(
                                    socialMedia.twitter,
                                    Twitter,
                                    "Twitter",
                                )}
                                {@html renderSocialLink(
                                    socialMedia.linkedin,
                                    Linkedin,
                                    "LinkedIn",
                                )}
                                {@html renderSocialLink(
                                    socialMedia.facebook,
                                    Facebook,
                                    "Facebook",
                                )}
                                {@html renderSocialLink(
                                    socialMedia.instagram,
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
                    {#if teamMembers && teamMembers.length > 0}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                {#each teamMembers as member, index}
                                    <div class="flex items-start gap-4">
                                        <!-- Placeholder for Avatar -->
                                        <div
                                            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium"
                                        >
                                            {member.substring(0, 1)}
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-medium">
                                                {member}
                                            </p>
                                        </div>
                                    </div>
                                    {#if index < teamMembers.length - 1}<Separator
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
                                {state.startup.business_model}
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
                                {state.startup.target_market}
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
                                {Array.isArray(state.startup.competitors)
                                    ? state.startup.competitors.join(", ")
                                    : state.startup.competitors}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <!-- Use of Funds -->
            {#if useOfFunds}
                <Card>
                    <CardHeader>
                        <CardTitle>Use of Funds</CardTitle>
                        <CardDescription
                            >How the next funding round will be utilized</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#each Object.entries(useOfFunds) as [key, value]}
                            {#if value}
                                {@const Icon =
                                    useOfFundsIcons[
                                        key as keyof typeof useOfFundsIcons
                                    ] || Lightbulb}
                                <div class="flex items-start gap-3">
                                    <div class="mt-1">
                                        <Icon class="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 class="font-medium capitalize">
                                            {key}
                                        </h4>
                                        <p
                                            class="text-sm text-muted-foreground"
                                        >
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </CardContent>
                </Card>
            {/if}

            <!-- Timeline -->
            {#if timeline && (timeline.past?.length || timeline.future?.length)}
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                        <CardDescription
                            >Key milestones and future plans</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <!-- Past Milestones -->
                        {#if timeline.past && timeline.past.length > 0}
                            <div>
                                <h3 class="text-lg font-medium mb-4">
                                    Past Milestones
                                </h3>
                                <div class="relative pl-6">
                                    <div
                                        class="absolute left-0 top-0 bottom-0 w-0.5 bg-border"
                                    ></div>
                                    {#each timeline.past as milestone, index}
                                        {@const Icon =
                                            // timelineIcons[milestone.type] ||
                                            Lightbulb}
                                        <div class="mb-6 relative">
                                            <div
                                                class="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                                            >
                                                <Icon
                                                    class="h-3 w-3 text-primary"
                                                />
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
                        {#if timeline.future && timeline.future.length > 0}
                            <div>
                                <h3 class="text-lg font-medium mb-4">
                                    Future Plans
                                </h3>
                                <div class="relative pl-6">
                                    <div
                                        class="absolute left-0 top-0 bottom-0 w-0.5 bg-border border-dashed"
                                    ></div>
                                    {#each timeline.future as milestone, index}
                                        {@const Icon =
                                            // timelineIcons[milestone.type] ||
                                            Lightbulb}
                                        <div class="mb-6 relative">
                                            <div
                                                class="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center"
                                            >
                                                <Icon
                                                    class="h-3 w-3 text-muted-foreground"
                                                />
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

        <!-- Action Messages -->
        {#if startupActions.error}
            <div
                class="bg-destructive/10 border border-destructive/20 rounded-md p-4"
            >
                <p class="text-sm text-destructive">{startupActions.error}</p>
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => startupActions.clearMessages()}
                    class="mt-2"
                >
                    Dismiss
                </Button>
            </div>
        {/if}

        {#if startupActions.success}
            <div class="bg-green-50 border border-green-200 rounded-md p-4">
                <p class="text-sm text-green-800">{startupActions.success}</p>
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => startupActions.clearMessages()}
                    class="mt-2"
                >
                    Dismiss
                </Button>
            </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex justify-between items-center">
            <!-- Publication Status -->
            <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">Status:</span>
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    class:bg-green-100={state.startup.is_published}
                    class:text-green-800={state.startup.is_published}
                    class:bg-gray-100={!state.startup.is_published}
                    class:text-gray-800={!state.startup.is_published}
                >
                    {state.startup.is_published ? "Published" : "Draft"}
                </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
                <!-- Publish/Unpublish Button -->
                {#if state.startup.is_published}
                    <Button
                        variant="outline"
                        onclick={handleUnpublish}
                        disabled={startupActions.isUnpublishing}
                    >
                        {startupActions.isUnpublishing
                            ? "Unpublishing..."
                            : "Unpublish"}
                    </Button>
                {:else}
                    <Button
                        onclick={handlePublish}
                        disabled={startupActions.isPublishing}
                    >
                        {startupActions.isPublishing
                            ? "Publishing..."
                            : "Publish"}
                    </Button>
                {/if}

                <!-- Edit Button -->
                <Button variant="outline" onclick={handleEdit}>Edit</Button>

                <!-- Delete Button -->
                <Button variant="destructive" onclick={handleDelete}>
                    Delete
                    <!-- {startupActions.isLoading ? "Deleting..." : "Delete"} -->
                </Button>
                <!-- disabled={startupActions.isLoading} -->
            </div>
        </div>
    </div>
</div>
