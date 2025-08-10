<script lang="ts">
    import { page } from "$app/state";
    import StartupCard from "$lib/components/StartupCard.svelte";
    import StartupList from "$lib/components/StartupList.svelte";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import * as Skeleton from "$lib/components/ui/skeleton";
    import {
        AlertCircle,
        AlertTriangle,
        DollarSign,
        FileEdit,
        FolderOpen,
        LayoutGrid,
        List,
        Plus,
        Rocket,
        RotateCw,
        Search,
        Sparkles,
        TrendingUp,
        Users,
    } from "@lucide/svelte/icons";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let { startups, industryOptions, stageOptions, sortOptions } = data;

    // View mode state (persisted in localStorage if available)
    let viewMode = $state<"grid" | "list">(
        typeof localStorage !== "undefined" &&
            localStorage.getItem("founderDashboardView")
            ? (localStorage.getItem("founderDashboardView") as "grid" | "list")
            : "grid",
    );

    // Save view mode preference
    $effect(() => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("founderDashboardView", viewMode);
        }
    });

    // Filter options
    let filterOptions = $state({
        search: "",
        industry: "all",
        stage: "all",
        sortBy: "newest",
    });

    // Loading and error states
    let loading = $state(false); // This will be true while navigating, SvelteKit handles this
    let error = $state<string | null>(null); // Errors from load function can be accessed via page.error

    // Format currency
    function formatCurrency(amount: number): string {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount}`;
    }

    // Function to get filtered startups
    function getFilteredStartups() {
        return startups
            .filter((startup: any) => {
                // Filter by search term
                if (
                    filterOptions.search &&
                    !startup.name
                        .toLowerCase()
                        .includes(filterOptions.search.toLowerCase()) &&
                    !startup.description
                        .toLowerCase()
                        .includes(filterOptions.search.toLowerCase())
                ) {
                    return false;
                }

                // Filter by industry
                if (
                    filterOptions.industry !== "all" &&
                    startup.industry !== filterOptions.industry
                ) {
                    return false;
                }

                // Filter by stage
                if (
                    filterOptions.stage !== "all" &&
                    startup.stage !== filterOptions.stage
                ) {
                    return false;
                }

                return true;
            })
            .sort((a: any, b: any) => {
                // Sort based on selected option
                switch (filterOptions.sortBy) {
                    case "newest":
                        return (
                            new Date(b.foundedDate).getTime() -
                            new Date(a.foundedDate).getTime()
                        );
                    case "oldest":
                        return (
                            new Date(a.foundedDate).getTime() -
                            new Date(b.foundedDate).getTime()
                        );
                    case "funding":
                        return b.fundingRaised - a.fundingRaised;
                    case "name_asc":
                        return a.name.localeCompare(b.name);
                    case "name_desc":
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
    }

    // Get filtered startups (reactive)
    let filteredStartups = $derived(getFilteredStartups());
</script>

<div class="@container/main">
    <div class="container max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col space-y-6">
            <!-- Dashboard Summary KPIs - Section Cards Style -->
            {#if !loading && !page.error && filteredStartups.length > 0}
                <div
                    class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t mb-8"
                >
                    <Card.Root class="@container/card">
                        <Card.Header>
                            <Card.Description>Total Startups</Card.Description>
                            <Card.Title
                                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                            >
                                {startups.length}
                            </Card.Title>
                            <Card.Action>
                                <Badge variant="outline">
                                    <Rocket class="size-4" />
                                    Active
                                </Badge>
                            </Card.Action>
                        </Card.Header>
                        <Card.Footer
                            class="flex-col items-start gap-1.5 text-sm"
                        >
                            <div class="line-clamp-1 flex gap-2 font-medium">
                                Portfolio overview <Rocket class="size-4" />
                            </div>
                            <div class="text-muted-foreground">
                                {filterOptions.industry !== "all" ||
                                filterOptions.stage !== "all" ||
                                filterOptions.search
                                    ? `${filteredStartups.length} matching filters`
                                    : `Across ${new Set(startups.map((s: any) => s.industry)).size} industries`}
                            </div>
                        </Card.Footer>
                    </Card.Root>

                    <Card.Root class="@container/card">
                        <Card.Header>
                            <Card.Description>Total Funding</Card.Description>
                            <Card.Title
                                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                            >
                                {formatCurrency(
                                    startups.reduce(
                                        (total: any, s: any) =>
                                            total + s.fundingRaised,
                                        0,
                                    ),
                                )}
                            </Card.Title>
                            <Card.Action>
                                <Badge variant="outline">
                                    <TrendingUp />
                                    +{Math.round(
                                        startups.reduce(
                                            (acc: any, s: any) =>
                                                acc + (s.fundingProgress || 0),
                                            0,
                                        ) / startups.length,
                                    )}%
                                </Badge>
                            </Card.Action>
                        </Card.Header>
                        <Card.Footer
                            class="flex-col items-start gap-1.5 text-sm"
                        >
                            <div class="line-clamp-1 flex gap-2 font-medium">
                                Strong funding progress <TrendingUp
                                    class="size-4"
                                />
                            </div>
                            <div class="text-muted-foreground">
                                {Math.round(
                                    startups.reduce(
                                        (acc: any, s: any) =>
                                            acc + (s.fundingProgress || 0),
                                        0,
                                    ) / startups.length,
                                )}% of total goal achieved
                            </div>
                        </Card.Footer>
                    </Card.Root>

                    <Card.Root class="@container/card">
                        <Card.Header>
                            <Card.Description>Team Members</Card.Description>
                            <Card.Title
                                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                            >
                                {startups.reduce(
                                    (total: number, s: any) => total + s.team,
                                    0,
                                )}
                            </Card.Title>
                            <Card.Action>
                                <Badge variant="outline">
                                    <Users class="size-4" />
                                    Avg. {Math.round(
                                        startups.reduce(
                                            (acc: number, s: any) =>
                                                acc + s.team,
                                            0,
                                        ) / startups.length,
                                    )}
                                </Badge>
                            </Card.Action>
                        </Card.Header>
                        <Card.Footer
                            class="flex-col items-start gap-1.5 text-sm"
                        >
                            <div class="line-clamp-1 flex gap-2 font-medium">
                                Growing team size <Users class="size-4" />
                            </div>
                            <div class="text-muted-foreground">
                                Average {Math.round(
                                    startups.reduce(
                                        (acc:any, s:any) => acc + s.team,
                                        0,
                                    ) / startups.length,
                                )} members per startup
                            </div>
                        </Card.Footer>
                    </Card.Root>

                    <Card.Root class="@container/card">
                        <Card.Header>
                            <Card.Description>Performance</Card.Description>
                            <Card.Title
                                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                            >
                                {startups.some(
                                    (s:any) => s.metrics?.growth !== undefined,
                                )
                                    ? `+${Math.round(startups.reduce((acc:any, s:any) => acc + (s.metrics?.growth || 0), 0) / startups.filter((s:any) => s.metrics?.growth !== undefined).length)}%`
                                    : "N/A"}
                            </Card.Title>
                            <Card.Action>
                                <Badge variant="outline">
                                    <TrendingUp />
                                    Growth
                                </Badge>
                            </Card.Action>
                        </Card.Header>
                        <Card.Footer
                            class="flex-col items-start gap-1.5 text-sm"
                        >
                            <div class="line-clamp-1 flex gap-2 font-medium">
                                Accelerating growth rate <TrendingUp
                                    class="size-4"
                                />
                            </div>
                            <div class="text-muted-foreground">
                                Average growth rate across portfolio
                            </div>
                        </Card.Footer>
                    </Card.Root>
                </div>

                <!-- Actions & Insights Section -->
                <div class="flex flex-col lg:flex-row gap-4 fade-in">
                    <!-- Pending Tasks Alert -->
                    {#if startups.some( (s:any) => s.tasks?.some((t: { completed: boolean }) => !t.completed), )}
                        <div
                            class="bg-muted/50 border rounded-lg p-4 flex-1 flex items-start gap-3"
                        >
                            <div class="text-amber-500 mt-0.5">
                                <AlertTriangle class="h-5 w-5" />
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium text-sm">
                                    Pending Tasks
                                </h3>
                                <p class="text-sm text-muted-foreground mt-0.5">
                                    You have {startups.reduce(
                                        (acc:any, s:any) =>
                                            acc +
                                            (s.tasks?.filter(
                                                (t: { completed: boolean }) =>
                                                    !t.completed,
                                            ).length || 0),
                                        0,
                                    )} pending tasks across your startups
                                </p>
                                <div class="mt-2 space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-xs h-8"
                                    >
                                        View All Tasks
                                    </Button>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Loading Skeleton for summary section -->
                    {#if loading}
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2 fade-in"
                        >
                            {#each Array(4) as _}
                                <div
                                    class="bg-card border rounded-lg shadow-sm p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <Skeleton.Root class="h-4 w-24 mb-2" />
                                        <Skeleton.Root class="h-8 w-16 mb-2" />
                                        <Skeleton.Root class="h-3 w-28" />
                                    </div>
                                    <Skeleton.Root
                                        class="h-12 w-12 rounded-full"
                                    />
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Insights Card -->
                    <div
                        class="bg-primary/5 border-primary/20 border rounded-lg p-4 flex-1"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <Sparkles class="h-5 w-5 text-primary" />
                            <h3 class="font-medium">
                                Insights & Recommendations
                            </h3>
                        </div>
                        <div class="space-y-2">
                            {#if startups.some((s:any) => s.fundingProgress && s.fundingProgress < 30)}
                                <p class="text-sm text-muted-foreground">
                                    <span class="font-medium text-foreground"
                                        >Funding Alert:</span
                                    > Some of your startups are below 30% of their
                                    funding goal. Consider revisiting your pitch
                                    deck or expanding investor outreach.
                                </p>
                            {/if}
                            {#if startups.some((s:any) => s.team < 5 && (s.stage === "seed" || s.stage === "series_a"))}
                                <p class="text-sm text-muted-foreground">
                                    <span class="font-medium text-foreground"
                                        >Team Growth:</span
                                    >
                                    Consider expanding your team to support scaling
                                    in the {startups.find(
                                        (s:any) =>
                                            s.team < 5 &&
                                            (s.stage === "seed" ||
                                                s.stage === "series_a"),
                                    )?.name} startup.
                                </p>
                            {/if}
                            <p class="text-sm text-muted-foreground">
                                <span class="font-medium text-foreground"
                                    >Growth Opportunity:</span
                                >
                                Your highest performing startup is showing {Math.max(
                                    ...startups
                                        .filter((s:any) => s.metrics?.growth)
                                        .map((s:any) => s.metrics?.growth || 0),
                                )}% growth. Consider allocating more resources
                                here.
                            </p>
                        </div>
                    </div>

                    <!-- Quick Actions Card -->
                    <div class="bg-card border rounded-lg p-4 lg:w-72">
                        <h3 class="font-medium mb-3 flex items-center gap-2">
                            <Rocket class="h-4 w-4 text-primary" />
                            Quick Actions
                        </h3>
                        <div class="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                class="w-full justify-start text-left"
                            >
                                <FileEdit
                                    class="h-3.5 w-3.5 mr-2 flex-shrink-0"
                                />
                                <span>Update Metrics</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                class="w-full justify-start text-left"
                            >
                                <Users class="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span>Manage Team Members</span>
                            </Button>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Pagination (if needed in the future) -->
            {#if !loading && !page.error && filteredStartups.length > 12}
                <div class="flex justify-center mt-8">
                    <div class="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled
                            >Previous</Button
                        >
                        <span
                            class="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                            >1</span
                        >
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">3</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            {/if}

            <!-- Header -->
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">Your Startups</h1>
                <div class="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        class="hidden md:flex"
                        onclick={() =>
                            (viewMode = viewMode === "grid" ? "list" : "grid")}
                    >
                        {#if viewMode === "grid"}
                            <List class="w-5 h-5 mr-2" />
                            List View
                        {:else}
                            <LayoutGrid class="w-5 h-5 mr-2" />
                            Grid View
                        {/if}
                    </Button>
                    <Button class="hidden md:flex">
                        <a
                            href="/dashboard/founder/startup/create"
                            class="flex items-center"
                        >
                            <Plus class="size-5 mr-2" />
                            Add Startup
                        </a>
                    </Button>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-4">
                <div class="relative flex-1 min-w-0 max-w-lg">
                    <Input
                        bind:value={filterOptions.search}
                        placeholder="Search startups..."
                        class="pl-10 w-full"
                    />
                    <Search
                        class="size-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
                    />
                </div>

                <Select.Root type="single" bind:value={filterOptions.industry}>
                    <Select.Trigger class="w-full md:w-40">
                        <span
                            >{industryOptions.find(
                                (i) => i.value === filterOptions.industry,
                            )?.label || "Industry"}</span
                        >
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Industries</Select.Label>
                            {#each industryOptions as option}
                                <Select.Item value={option.value}>
                                    {option.label}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                <Select.Root type="single" bind:value={filterOptions.stage}>
                    <Select.Trigger class="w-full md:w-40">
                        <span
                            >{stageOptions.find(
                                (s) => s.value === filterOptions.stage,
                            )?.label || "Stage"}</span
                        >
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Stages</Select.Label>
                            {#each stageOptions as option}
                                <Select.Item value={option.value}>
                                    {option.label}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                <Select.Root type="single" bind:value={filterOptions.sortBy}>
                    <Select.Trigger class="w-full md:w-40">
                        <span
                            >{sortOptions.find(
                                (s) => s.value === filterOptions.sortBy,
                            )?.label || "Sort by"}</span
                        >
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Sort Options</Select.Label>
                            {#each sortOptions as option}
                                <Select.Item value={option.value}>
                                    {option.label}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>

            <!-- Loading State -->
            {#if loading}
                <div
                    class="animate-in fade-in-0 slide-in-from-top-5 duration-500"
                >
                    {#if viewMode === "grid"}
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {#each Array(6) as _, i}
                                <div class="border rounded-lg p-6 space-y-4">
                                    <div class="flex items-center gap-4">
                                        <Skeleton.Root
                                            class="h-16 w-16 rounded-lg"
                                        />
                                        <div class="space-y-2">
                                            <Skeleton.Root class="h-5 w-40" />
                                            <Skeleton.Root class="h-4 w-24" />
                                        </div>
                                    </div>
                                    <Skeleton.Root class="h-20 w-full" />
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <div class="flex items-center gap-2">
                                            <DollarSign
                                                class="h-4 w-4 text-muted-foreground"
                                            />
                                            <Skeleton.Root class="h-4 w-20" />
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <Users
                                                class="h-4 w-4 text-muted-foreground"
                                            />
                                            <Skeleton.Root class="h-4 w-12" />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each Array(6) as _, i}
                                <div
                                    class="border rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div class="flex items-center gap-4">
                                        <Skeleton.Root
                                            class="h-12 w-12 rounded-lg"
                                        />
                                        <div class="space-y-2">
                                            <Skeleton.Root class="h-5 w-40" />
                                            <Skeleton.Root class="h-4 w-60" />
                                        </div>
                                    </div>
                                    <Skeleton.Root class="h-8 w-24" />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
                <!-- Error State -->
            {:else if page.error}
                <div
                    class="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg animate-in fade-in slide-in-from-bottom-10 duration-500"
                >
                    <div
                        class="bg-destructive/10 p-3 rounded-full mb-4 text-destructive"
                    >
                        <AlertCircle class="w-10 h-10" />
                    </div>
                    <h3 class="text-xl font-semibold mb-2">
                        Unable to Load Startups
                    </h3>
                    <p class="text-muted-foreground text-center max-w-md mb-6">
                        {page.error.message ||
                            "We encountered a problem while loading your startup data. This might be due to a network issue or a server problem."}
                    </p>
                    <Button onclick={refreshData} class="gap-2">
                        <RotateCw class="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
                <!-- Empty State -->
            {:else if filteredStartups.length === 0}
                <div
                    class="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg animate-in fade-in slide-in-from-bottom-10 duration-500"
                >
                    <div
                        class="bg-muted p-3 rounded-full mb-4 text-muted-foreground"
                    >
                        <FolderOpen class="w-10 h-10" />
                    </div>
                    <h3 class="text-xl font-semibold mb-2">
                        No startups found
                    </h3>
                    <p class="text-muted-foreground text-center max-w-md mb-6">
                        {#if filterOptions.search || filterOptions.industry !== "all" || filterOptions.stage !== "all"}
                            We couldn't find any startups matching your current
                            filters. Try adjusting your criteria or clear
                            filters.
                        {:else}
                            You haven't added any startups to your portfolio
                            yet. Create your first startup to begin tracking
                            your progress.
                        {/if}
                    </p>
                    <div class="flex flex-wrap gap-3 justify-center">
                        {#if filterOptions.search || filterOptions.industry !== "all" || filterOptions.stage !== "all"}
                            <Button
                                variant="outline"
                                onclick={() => {
                                    filterOptions.search = "";
                                    filterOptions.industry = "all";
                                    filterOptions.stage = "all";
                                    filterOptions.sortBy = "newest";
                                }}
                            >
                                <RotateCw class="h-3.5 w-3.5 mr-2" />
                                Clear Filters
                            </Button>
                        {/if}
                        <Button
                            class={!filterOptions.search &&
                            filterOptions.industry === "all" &&
                            filterOptions.stage === "all"
                                ? "animate-pulse"
                                : ""}
                        >
                            <a
                                href="/dashboard/founder/startup/create"
                                class="flex items-center gap-2"
                            >
                                <Plus class="w-4 h-4" />
                                Add {filterOptions.search ||
                                filterOptions.industry !== "all" ||
                                filterOptions.stage !== "all"
                                    ? "New"
                                    : "Your First"} Startup
                            </a>
                        </Button>
                    </div>
                </div>
                <!-- Startup Grid/List -->
            {:else if viewMode === "grid"}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in animate-in slide-in-from-bottom-8 duration-500 stagger-[100ms]"
                >
                    {#each filteredStartups as startup (startup.id)}
                        <div class="card-hover">
                            <StartupCard {startup} />
                        </div>
                    {/each}
                </div>
            {:else}
                <div
                    class="flex flex-col space-y-4 fade-in animate-in slide-in-from-bottom-5 duration-500 stagger-[75ms]"
                >
                    {#each filteredStartups as startup (startup.id)}
                        <div class="card-hover">
                            <StartupList {startup} />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Animation classes */
    .fade-in {
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Ensure these styles apply to all instances */
    :global(.hide-scrollbar::-webkit-scrollbar) {
        display: none;
    }

    :global(.hide-scrollbar) {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* Hover effects - apply globally */
    :global(.card-hover) {
        transition: all 0.2s ease-in-out;
    }

    :global(.card-hover:hover) {
        transform: translateY(-2px);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
</style>
