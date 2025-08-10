<script lang="ts">
    import { page } from "$app/stores";
    import * as Card from "@/components/ui/card";
    import * as Tabs from "@/components/ui/tabs";
    import { Button } from "@/components/ui/button";
    import { Separator } from "@/components/ui/separator";
    import * as Avatar from "@/components/ui/avatar";
    import { Badge } from "@/components/ui/badge";
    import * as Skeleton from "@/components/ui/skeleton";
    import Calendar from "@lucide/svelte/icons/calendar";
    import Users from "@lucide/svelte/icons/users";
    import DollarSign from "@lucide/svelte/icons/dollar-sign";
    import Globe from "@lucide/svelte/icons/globe";
    import LineChart from "@lucide/svelte/icons/line-chart";
    import BarChart from "@lucide/svelte/icons/bar-chart";
    import Building from "@lucide/svelte/icons/building";
    import Target from "@lucide/svelte/icons/target";
    import FileText from "@lucide/svelte/icons/file-text";
    import Bookmark from "@lucide/svelte/icons/bookmark";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import ExternalLink from "@lucide/svelte/icons/external-link";

    // Define interface for startup data
    interface Startup {
        id: string;
        name: string;
        logo_url?: string;
        description: string;
        industry: string;
        stage: string;
        location: string;
        website?: string;
        founding_date?: string;
        team_size?: number;
        founder_name?: string;
        business_model?: string;
        market_opportunity?: string;
        competitors?: string;
        funding_raised: number;
        funding_goal: number;
        funding_round?: string;
        min_investment?: number;
        equity_offered?: string;
        pitch_deck_url?: string;
    }

    // Define interface for page data
    interface PageData {
        startup: Startup | null;
    }

    // Get startup data from page data provided by +page.server.ts
    let { data }: { data: PageData } = $props();

    // Active tab state
    let selectedTab = $state("overview");

    // Metrics loading state simulation
    let isMetricsLoaded = $state(false);
    $effect(() => {
        if (selectedTab === "metrics" && !isMetricsLoaded) {
            setTimeout(() => {
                isMetricsLoaded = true;
            }, 1500);
        }
    });

    // Formatting helpers
    function formatCurrency(amount: number | undefined): string {
        if (!amount) return "$0";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function getInitials(name: string): string {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    // Funding progress calculation based on actual data
    let fundingProgress = $derived(
        data.startup
            ? Math.min(
                  Math.round(
                      (data.startup.funding_raised /
                          data.startup.funding_goal) *
                          100,
                  ),
                  100,
              )
            : 0,
    );
</script>

{#if !data.startup}
    <!-- Loading Skeleton State -->
    <div class="container mx-auto py-8 px-4">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-2/3 space-y-6">
                <div class="flex items-center gap-4">
                    <Skeleton.Root class="h-16 w-16 rounded-full" />
                    <div class="space-y-2">
                        <Skeleton.Root class="h-8 w-48" />
                        <Skeleton.Root class="h-4 w-36" />
                    </div>
                </div>
                <Skeleton.Root class="h-32 w-full" />
            </div>
            <div class="w-full md:w-1/3">
                <Skeleton.Root class="h-64 w-full rounded-lg" />
            </div>
        </div>
        <div class="mt-8">
            <Skeleton.Root class="h-10 w-full max-w-md mb-6" />
            <Skeleton.Root class="h-96 w-full" />
        </div>
    </div>
{:else}
    <!-- Main Content -->
    <div class="container mx-auto py-8 px-4">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">Startup Details</h1>
            <p class="text-muted-foreground">
                Discover and connect with innovative startups
            </p>
        </div>
        <Separator class="my-4" />

        <div class="flex flex-col md:flex-row gap-8">
            <!-- Main Content Area -->
            <div class="w-full md:w-2/3 space-y-8">
                <!-- Startup Header -->
                <div
                    class="p-6 rounded-lg bg-card border border-border shadow-sm relative overflow-hidden"
                >
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-50"
                    ></div>
                    <div class="relative flex items-start gap-6">
                        <div class="flex-shrink-0">
                            {#if data.startup.logo_url}
                                <img
                                    src={data.startup.logo_url}
                                    alt={`${data.startup.name} logo`}
                                    class="h-20 w-20 rounded-lg object-cover"
                                />
                            {:else}
                                <div
                                    class="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center text-xl font-bold text-primary"
                                >
                                    {getInitials(data.startup.name)}
                                </div>
                            {/if}
                        </div>
                        <div class="flex-1">
                            <div
                                class="flex flex-wrap items-start justify-between gap-4"
                            >
                                <div>
                                    <h1
                                        class="text-3xl font-bold tracking-tight"
                                    >
                                        {data.startup.name}
                                    </h1>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <Badge
                                            variant="outline"
                                            class="bg-primary/10 px-3 py-1"
                                            >{data.startup.industry}</Badge
                                        >
                                        <Badge
                                            variant="outline"
                                            class="bg-secondary/10 px-3 py-1"
                                            >{data.startup.stage}</Badge
                                        >
                                        <Badge
                                            variant="outline"
                                            class="bg-accent/10 px-3 py-1"
                                            >{data.startup.location}</Badge
                                        >
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="gap-2"
                                    >
                                        <Bookmark class="h-4 w-4" />
                                        <span>Save</span>
                                    </Button>
                                    <Button size="sm" class="gap-2">
                                        <MessageSquare class="h-4 w-4" />
                                        <span>Contact</span>
                                    </Button>
                                </div>
                            </div>
                            <p
                                class="mt-4 text-muted-foreground leading-relaxed"
                            >
                                {data.startup.description}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Tabs Content -->
                <Tabs.Root
                    value={selectedTab}
                    onValueChange={(val) => (selectedTab = val)}
                >
                    <!-- w-full border-b bg-card p-0 rounded-t-lg -->
                    <Tabs.List>
                        <div class="flex w-full overflow-x-auto hide-scrollbar">
                            <Tabs.Trigger value="overview" class="flex-1"
                                >Overview</Tabs.Trigger
                            >
                            <Tabs.Trigger value="team" class="flex-1"
                                >Team</Tabs.Trigger
                            >
                            <Tabs.Trigger value="funding" class="flex-1"
                                >Funding</Tabs.Trigger
                            >
                            <Tabs.Trigger value="metrics" class="flex-1"
                                >Metrics</Tabs.Trigger
                            >
                            <Tabs.Trigger value="documents" class="flex-1"
                                >Documents</Tabs.Trigger
                            >
                        </div>
                    </Tabs.List>

                    <div class="mt-6">
                        <!-- Overview Tab -->
                        <Tabs.Content value="overview" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card.Root class="h-full">
                                    <Card.Header class="pb-3">
                                        <Card.Title
                                            class="text-base flex items-center gap-2"
                                        >
                                            <Building
                                                class="h-5 w-5 text-primary"
                                            />
                                            <span>Business Model</span>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Content>
                                        <p
                                            class="text-sm text-muted-foreground leading-relaxed"
                                        >
                                            {data.startup.business_model ||
                                                "This startup operates on a subscription-based model, offering tiered services to both individual users and enterprise clients. With a focus on recurring revenue, they've achieved a stable growth pattern over the last two quarters."}
                                        </p>
                                    </Card.Content>
                                </Card.Root>

                                <Card.Root class="h-full">
                                    <Card.Header class="pb-3">
                                        <Card.Title
                                            class="text-base flex items-center gap-2"
                                        >
                                            <Target
                                                class="h-5 w-5 text-primary"
                                            />
                                            <span>Market Opportunity</span>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Content>
                                        <p
                                            class="text-sm text-muted-foreground leading-relaxed"
                                        >
                                            {data.startup.market_opportunity ||
                                                "Targeting a $5.7B market that's growing at 23% annually, the startup has positioned itself uniquely by focusing on an underserved segment that larger competitors have overlooked, creating a significant opportunity for market penetration."}
                                        </p>
                                    </Card.Content>
                                </Card.Root>

                                <Card.Root class="h-full md:col-span-2">
                                    <Card.Header class="pb-3">
                                        <Card.Title
                                            class="text-base flex items-center gap-2"
                                        >
                                            <Users
                                                class="h-5 w-5 text-primary"
                                            />
                                            <span>Competitive Landscape</span>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Content>
                                        <div
                                            class="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        >
                                            {#if data.startup.competitors}
                                                {#each data.startup.competitors
                                                    .split(",")
                                                    .map( (c: string) => c.trim(), ) as competitor}
                                                    <div
                                                        class="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                                    >
                                                        <p class="font-medium">
                                                            {competitor}
                                                        </p>
                                                    </div>
                                                {/each}
                                            {:else}
                                                <div
                                                    class="p-4 rounded-lg border bg-card/50 md:col-span-3"
                                                >
                                                    <p
                                                        class="text-muted-foreground text-center"
                                                    >
                                                        No competitor
                                                        information available
                                                    </p>
                                                </div>
                                            {/if}
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            </div>
                        </Tabs.Content>

                        <!-- Team Tab -->
                        <Tabs.Content value="team">
                            <Card.Root>
                                <Card.Header>
                                    <Card.Title>Leadership Team</Card.Title>
                                    <Card.Description>
                                        Meet the talented individuals behind {data
                                            .startup.name}'s innovation and
                                        growth.
                                    </Card.Description>
                                </Card.Header>
                                <Card.Content class="pt-6">
                                    <div
                                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {#if data.startup.founder_name}
                                            <div
                                                class="flex flex-col items-center p-6 rounded-lg border bg-card/50 text-center"
                                            >
                                                <div
                                                    class="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                                                >
                                                    <Users
                                                        class="size-12 text-primary"
                                                    />
                                                </div>
                                                <h3
                                                    class="font-semibold text-lg"
                                                >
                                                    {data.startup.founder_name}
                                                </h3>
                                                <p
                                                    class="text-muted-foreground mt-1"
                                                >
                                                    Founder & CEO
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    class="mt-4"
                                                    >View Profile</Button
                                                >
                                            </div>
                                        {/if}

                                        <!-- Placeholder team members -->
                                        {#each Array(Math.min(data.startup.team_size || 3, 5) - 1) as _, i}
                                            <div
                                                class="flex flex-col items-center p-6 rounded-lg border border-dashed text-center"
                                            >
                                                <div
                                                    class="size-24 rounded-full bg-muted flex items-center justify-center mb-4"
                                                >
                                                    <Users
                                                        class="size-8 text-muted-foreground/50"
                                                    />
                                                </div>
                                                <h3
                                                    class="font-semibold text-lg text-muted-foreground/70"
                                                >
                                                    Team Member
                                                </h3>
                                                <p
                                                    class="text-muted-foreground/50 mt-1"
                                                >
                                                    Role not specified
                                                </p>
                                            </div>
                                        {/each}
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </Tabs.Content>

                        <!-- Funding Tab -->
                        <Tabs.Content value="funding">
                            <Card.Root>
                                <Card.Header>
                                    <Card.Title>Funding Status</Card.Title>
                                    <Card.Description>
                                        Current fundraising round and investment
                                        opportunities.
                                    </Card.Description>
                                </Card.Header>
                                <Card.Content class="pt-6">
                                    <div class="space-y-8">
                                        <div>
                                            <div
                                                class="flex justify-between mb-2"
                                            >
                                                <span
                                                    class="text-sm font-medium"
                                                    >Funding Progress</span
                                                >
                                                <span
                                                    class="text-sm font-medium"
                                                    >{fundingProgress}%</span
                                                >
                                            </div>
                                            <div
                                                class="h-2 bg-muted rounded-full overflow-hidden"
                                            >
                                                <div
                                                    class="bg-primary h-full rounded-full"
                                                    style="width: {fundingProgress}%"
                                                ></div>
                                            </div>
                                            <div
                                                class="flex justify-between mt-2"
                                            >
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    Raised: {formatCurrency(
                                                        data.startup
                                                            .funding_raised,
                                                    )}
                                                </span>
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    Goal: {formatCurrency(
                                                        data.startup
                                                            .funding_goal,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            class="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        >
                                            <div class="p-4 rounded-lg border">
                                                <h3 class="font-medium mb-1">
                                                    Current Round
                                                </h3>
                                                <p class="text-2xl font-bold">
                                                    {data.startup
                                                        .funding_round ||
                                                        "Seed"}
                                                </p>
                                            </div>
                                            <div class="p-4 rounded-lg border">
                                                <h3 class="font-medium mb-1">
                                                    Min Investment
                                                </h3>
                                                <p class="text-2xl font-bold">
                                                    {formatCurrency(
                                                        data.startup
                                                            .min_investment ||
                                                            25000,
                                                    )}
                                                </p>
                                            </div>
                                            <div class="p-4 rounded-lg border">
                                                <h3 class="font-medium mb-1">
                                                    Equity Offered
                                                </h3>
                                                <p class="text-2xl font-bold">
                                                    {data.startup
                                                        .equity_offered ||
                                                        "10-15"}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </Tabs.Content>

                        <!-- Metrics Tab -->
                        <Tabs.Content value="metrics">
                            <Card.Root>
                                <Card.Header>
                                    <Card.Title>Performance Metrics</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    {#if isMetricsLoaded}
                                        <div class="space-y-8">
                                            <div
                                                class="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                {#each [{ title: "User Growth", value: "+127%", subtitle: "Year over year" }, { title: "Retention Rate", value: "84%", subtitle: "Last 30 days" }, { title: "Avg. Revenue", value: "$4.2k", subtitle: "Per customer" }] as metric}
                                                    <div
                                                        class="p-6 rounded-lg border"
                                                    >
                                                        <h3
                                                            class="text-sm font-medium text-muted-foreground"
                                                        >
                                                            {metric.title}
                                                        </h3>
                                                        <p
                                                            class="text-3xl font-bold mt-2"
                                                        >
                                                            {metric.value}
                                                        </p>
                                                        <p
                                                            class="text-sm text-muted-foreground mt-1"
                                                        >
                                                            {metric.subtitle}
                                                        </p>
                                                    </div>
                                                {/each}
                                            </div>

                                            <div
                                                class="grid grid-cols-1 md:grid-cols-2 gap-6"
                                            >
                                                <div
                                                    class="p-6 rounded-lg border"
                                                >
                                                    <div
                                                        class="flex flex-col items-center justify-center"
                                                    >
                                                        <BarChart
                                                            class="h-48 w-full text-muted-foreground"
                                                        />
                                                        <h3
                                                            class="font-medium mt-4"
                                                        >
                                                            Monthly Growth Rate
                                                        </h3>
                                                        <p
                                                            class="text-sm text-muted-foreground text-center max-w-sm mt-2"
                                                        >
                                                            Showing consistent
                                                            growth pattern over
                                                            the last 6 months
                                                            with a compound
                                                            monthly growth rate
                                                            of 12.4%.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="p-6 rounded-lg border"
                                                >
                                                    <div
                                                        class="flex flex-col items-center justify-center"
                                                    >
                                                        <LineChart
                                                            class="h-48 w-full text-muted-foreground"
                                                        />
                                                        <h3
                                                            class="font-medium mt-4"
                                                        >
                                                            Revenue Trajectory
                                                        </h3>
                                                        <p
                                                            class="text-sm text-muted-foreground text-center max-w-sm mt-2"
                                                        >
                                                            Annual recurring
                                                            revenue has
                                                            increased by 3.2x
                                                            compared to the
                                                            previous fiscal
                                                            year.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {:else}
                                        <div
                                            class="flex items-center justify-center h-48"
                                        >
                                            <div class="text-center">
                                                <BarChart
                                                    class="h-12 w-12 text-muted-foreground mx-auto mb-4"
                                                />
                                                <p
                                                    class="text-muted-foreground"
                                                >
                                                    Loading metrics data...
                                                </p>
                                            </div>
                                        </div>
                                    {/if}
                                </Card.Content>
                            </Card.Root>
                        </Tabs.Content>

                        <!-- Documents Tab -->
                        <Tabs.Content value="documents">
                            <Card.Root>
                                <Card.Header>
                                    <Card.Title>Key Documents</Card.Title>
                                </Card.Header>
                                <Card.Content class="pt-6">
                                    <div class="space-y-4">
                                        {#each [{ title: "Pitch Deck", description: "Latest company presentation for investors", date: "Updated 2 weeks ago" }, { title: "Business Plan", description: "Detailed 3-year growth strategy and market analysis", date: "Updated 1 month ago" }, { title: "Financial Projections", description: "Revenue and expense forecasts with key metrics", date: "Updated 3 weeks ago" }] as document, i}
                                            <div
                                                class="p-4 rounded-lg border hover:bg-card/80 transition-colors group"
                                            >
                                                <div
                                                    class="flex items-start gap-4"
                                                >
                                                    <div
                                                        class="p-3 rounded-md bg-primary/10 text-primary"
                                                    >
                                                        <FileText
                                                            class="h-6 w-6"
                                                        />
                                                    </div>
                                                    <div class="flex-1">
                                                        <h3 class="font-medium">
                                                            {document.title}
                                                        </h3>
                                                        <p
                                                            class="text-sm text-muted-foreground mt-1"
                                                        >
                                                            {document.description}
                                                        </p>
                                                        <div class="mt-4">
                                                            <button
                                                                type="button"
                                                                class="text-sm text-primary inline-flex items-center hover:underline"
                                                            >
                                                                View Document
                                                                <ExternalLink
                                                                    class="ml-1 h-3.5 w-3.5"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>

            <!-- Sidebar -->
            <div class="w-full md:w-1/3">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Company Details</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <Calendar class="h-4 w-4 text-primary" />
                                    <span class="text-sm">Founded</span>
                                </div>
                                <span class="text-sm font-medium"
                                    >{data.startup.founding_date ||
                                        "2020"}</span
                                >
                            </div>

                            <Separator />

                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <Globe class="h-4 w-4 text-primary" />
                                    <span class="text-sm">Location</span>
                                </div>
                                <span class="text-sm font-medium"
                                    >{data.startup.location}</span
                                >
                            </div>

                            <Separator />

                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <Users class="h-4 w-4 text-primary" />
                                    <span class="text-sm">Team Size</span>
                                </div>
                                <span class="text-sm font-medium"
                                    >{data.startup.team_size || "5-10"} people</span
                                >
                            </div>

                            <Separator />

                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <DollarSign class="h-4 w-4 text-primary" />
                                    <span class="text-sm">Total Funding</span>
                                </div>
                                <span class="text-sm font-medium"
                                    >{formatCurrency(
                                        data.startup.funding_raised,
                                    )}</span
                                >
                            </div>

                            <Separator />

                            <div>
                                {#if data.startup.website}
                                    <a
                                        href={data.startup.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                                    >
                                        <div class="flex items-center gap-2">
                                            <Globe class="h-4 w-4" />
                                            <span class="text-sm"
                                                >Visit Website</span
                                            >
                                        </div>
                                        <ExternalLink class="h-3.5 w-3.5" />
                                    </a>
                                {/if}
                            </div>

                            <div class="pt-4">
                                <Button class="w-full"
                                    >Request Introduction</Button
                                >
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Investment Card -->
                <Card.Root class="bg-primary text-primary-foreground mt-6">
                    <Card.Header>
                        <Card.Title class="text-primary-foreground"
                            >Investment Opportunity</Card.Title
                        >
                        <Card.Description class="text-primary-foreground/80">
                            Join other investors in funding {data.startup
                                .name}'s growth
                        </Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            <Button variant="secondary" class="w-full"
                                >Express Interest</Button
                            >
                            <Button
                                variant="outline"
                                class="w-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                            >
                                Schedule Call
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Share Card -->
                <div class="p-4 rounded-lg border bg-card mt-6">
                    <h3 class="text-sm font-medium mb-2">Share this Startup</h3>
                    <div class="flex gap-2">
                        {#each [{ icon: "twitter", label: "Twitter" }, { icon: "linkedin", label: "LinkedIn" }, { icon: "facebook", label: "Facebook" }, { icon: "mail", label: "Email" }] as socialLink}
                            <button
                                class="flex-1 p-2 rounded-md bg-muted hover:bg-muted/70 transition-colors"
                                aria-label={`Share on ${socialLink.label}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="h-4 w-4 mx-auto"
                                >
                                    {#if socialLink.icon === "twitter"}
                                        <path
                                            d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                                        />
                                    {:else if socialLink.icon === "linkedin"}
                                        <path
                                            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                                        />
                                        <rect
                                            x="2"
                                            y="9"
                                            width="4"
                                            height="12"
                                        />
                                        <circle cx="4" cy="4" r="2" />
                                    {:else if socialLink.icon === "facebook"}
                                        <path
                                            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                                        />
                                    {:else if socialLink.icon === "mail"}
                                        <rect
                                            x="2"
                                            y="4"
                                            width="20"
                                            height="16"
                                            rx="2"
                                        />
                                        <path
                                            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                                        />
                                    {/if}
                                </svg>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Hide scrollbar for modern browsers */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge, and Firefox */
    .hide-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
