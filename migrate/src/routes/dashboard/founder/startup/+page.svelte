<script lang="ts">
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import { 
        List,
        Search,
        AlertCircle,
        FolderOpen,
        LayoutGrid,
        Plus,
        RotateCw,
        DollarSign,
        Users,
        FileEdit,
        Rocket,
        TrendingUp,
        AlertTriangle
    } from "@lucide/svelte/icons";
    import * as Skeleton from "$lib/components/ui/skeleton";
    import StartupCard from "$lib/components/StartupCard.svelte";
    import StartupList from "$lib/components/StartupList.svelte";

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

    // Industry options
    const industryOptions = [
        { label: "All Industries", value: "all" },
        { label: "Fintech", value: "fintech" },
        { label: "Healthcare", value: "healthcare" },
        { label: "E-commerce", value: "ecommerce" },
        { label: "SaaS", value: "saas" },
        { label: "AI/ML", value: "ai-ml" },
    ];

    // Stage options
    const stageOptions = [
        { label: "All Stages", value: "all" },
        { label: "Idea", value: "idea" },
        { label: "MVP", value: "mvp" },
        { label: "Seed", value: "seed" },
        { label: "Series A", value: "series_a" },
        { label: "Series B+", value: "series_b_plus" },
    ];

    // Sort options
    const sortOptions = [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Most Funding", value: "funding" },
        { label: "Name A-Z", value: "name_asc" },
        { label: "Name Z-A", value: "name_desc" },
    ];

    // Mock data for startups (would be replaced with actual data loading)
    let startups = $state<any[]>([
        {
            id: "1",
            name: "TechFinance",
            description:
                "A revolutionary fintech platform that simplifies banking for SMEs.",
            logo: "https://via.placeholder.com/150",
            industry: "fintech",
            stage: "seed",
            location: "San Francisco, CA",
            foundedDate: "2022-05-01",
            lastUpdate: "2023-10-15",
            fundingRaised: 750000,
            fundingGoal: 1200000,
            fundingProgress: 62,
            team: 8,
            featured: true,
            metrics: {
                revenue: 25000,
                users: 1200,
                growth: 15,
            },
            tasks: [
                {
                    id: 1,
                    title: "Update financial projections",
                    completed: false,
                    dueDate: "2023-11-10",
                },
                {
                    id: 2,
                    title: "Prepare for investor meeting",
                    completed: true,
                    dueDate: "2023-10-30",
                },
            ],
        },
        {
            id: "2",
            name: "HealthAI",
            description:
                "AI-powered healthcare diagnostics for rural communities.",
            logo: "https://via.placeholder.com/150",
            industry: "healthcare",
            stage: "series_a",
            location: "Boston, MA",
            foundedDate: "2021-03-15",
            lastUpdate: "2023-10-05",
            fundingRaised: 3500000,
            fundingGoal: 5000000,
            fundingProgress: 70,
            team: 24,
            featured: false,
            metrics: {
                revenue: 180000,
                users: 45000,
                growth: 24,
            },
            tasks: [
                {
                    id: 3,
                    title: "Hire senior ML engineer",
                    completed: false,
                    dueDate: "2023-11-15",
                },
                {
                    id: 4,
                    title: "Submit FDA application",
                    completed: false,
                    dueDate: "2023-12-01",
                },
            ],
        },
        {
            id: "3",
            name: "EcoShop",
            description:
                "Sustainable e-commerce marketplace for eco-friendly products.",
            logo: "https://via.placeholder.com/150",
            industry: "ecommerce",
            stage: "mvp",
            location: "Portland, OR",
            foundedDate: "2023-01-10",
            lastUpdate: "2023-10-20",
            fundingRaised: 250000,
            fundingGoal: 500000,
            fundingProgress: 50,
            team: 5,
            featured: false,
            metrics: {
                revenue: 12000,
                users: 3500,
                growth: 32,
            },
            tasks: [
                {
                    id: 5,
                    title: "Launch mobile app beta",
                    completed: false,
                    dueDate: "2023-11-20",
                },
                {
                    id: 6,
                    title: "Onboard 10 new vendors",
                    completed: true,
                    dueDate: "2023-10-15",
                },
            ],
        },
    ]);

    // Loading and error states
    let loading = $state(false);
    let error = $state<string | null>(null);

    // Import missing icons
    import Star from "@lucide/svelte/icons/star";
    import Sparkles from "@lucide/svelte/icons/sparkles";

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
            .filter((startup) => {
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
            .sort((a, b) => {
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
    $effect(() => {
        filteredStartups = getFilteredStartups();
    });
    let filteredStartups = $state<typeof startups>([]);

    // Function to refresh data
    function refreshData() {
        loading = true;
        error = null;

        // Simulate API call
        setTimeout(() => {
            loading = false;
            // Uncomment to test error state
            // error = "Failed to load data";
        }, 1000);
    }

    // Initial data load
    refreshData();
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col space-y-6">
        <!-- Dashboard Summary KPIs -->
        {#if !loading && !error && filteredStartups.length > 0}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2 fade-in"
            >
                <div
                    class="bg-card border rounded-lg shadow-sm p-4 flex items-center justify-between"
                >
                    <div>
                        <h3 class="text-sm font-medium text-muted-foreground">
                            Total Startups
                        </h3>
                        <p class="text-2xl font-bold mt-1">{startups.length}</p>
                        <p class="text-xs text-muted-foreground mt-1">
                            {filterOptions.industry !== "all" ||
                            filterOptions.stage !== "all" ||
                            filterOptions.search
                                ? `${filteredStartups.length} matching filters`
                                : `Across ${new Set(startups.map((s) => s.industry)).size} industries`}
                        </p>
                    </div>
                    <div class="bg-primary/10 p-3 rounded-full text-primary">
                        <Rocket class="h-6 w-6" />
                    </div>
                </div>

                <div
                    class="bg-card border rounded-lg shadow-sm p-4 flex items-center justify-between"
                >
                    <div>
                        <h3 class="text-sm font-medium text-muted-foreground">
                            Total Funding
                        </h3>
                        <p class="text-2xl font-bold mt-1">
                            {formatCurrency(
                                startups.reduce(
                                    (total, s) => total + s.fundingRaised,
                                    0,
                                ),
                            )}
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                            {Math.round(
                                startups.reduce(
                                    (acc, s) => acc + (s.fundingProgress || 0),
                                    0,
                                ) / startups.length,
                            )}% of total goal
                        </p>
                    </div>
                    <div
                        class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400"
                    >
                        <DollarSign class="h-6 w-6" />
                    </div>
                </div>

                <div
                    class="bg-card border rounded-lg shadow-sm p-4 flex items-center justify-between"
                >
                    <div>
                        <h3 class="text-sm font-medium text-muted-foreground">
                            Team Members
                        </h3>
                        <p class="text-2xl font-bold mt-1">
                            {startups.reduce((total, s) => total + s.team, 0)}
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                            Avg. {Math.round(
                                startups.reduce((acc, s) => acc + s.team, 0) /
                                    startups.length,
                            )} per startup
                        </p>
                    </div>
                    <div
                        class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400"
                    >
                        <Users class="h-6 w-6" />
                    </div>
                </div>

                <div
                    class="bg-card border rounded-lg shadow-sm p-4 flex items-center justify-between"
                >
                    <div>
                        <h3 class="text-sm font-medium text-muted-foreground">
                            Performance
                        </h3>
                        <p class="text-2xl font-bold mt-1">
                            {startups.some(
                                (s) => s.metrics?.growth !== undefined,
                            )
                                ? `+${Math.round(startups.reduce((acc, s) => acc + (s.metrics?.growth || 0), 0) / startups.filter((s) => s.metrics?.growth !== undefined).length)}%`
                                : "N/A"}
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                            Avg. growth rate
                        </p>
                    </div>
                    <div
                        class="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400"
                    >
                        <TrendingUp class="h-6 w-6" />
                    </div>
                </div>
            </div>

            <!-- Actions & Insights Section -->
            <div class="flex flex-col lg:flex-row gap-4 fade-in">
                <!-- Pending Tasks Alert -->
                {#if startups.some(s => s.tasks?.some((t: {completed: boolean}) => !t.completed))}
                    <div
                        class="bg-muted/50 border rounded-lg p-4 flex-1 flex items-start gap-3"
                    >
                        <div class="text-amber-500 mt-0.5">
                            <AlertTriangle class="h-5 w-5" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-medium text-sm">Pending Tasks</h3>
                            <p class="text-sm text-muted-foreground mt-0.5">
                                You have {startups.reduce(
                                    (acc, s) =>
                                        acc +
                                        (s.tasks?.filter((t: {completed: boolean}) => !t.completed)
                                            .length || 0),
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
                                <Skeleton.Root class="h-12 w-12 rounded-full" />
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
                        <h3 class="font-medium">Insights & Recommendations</h3>
                    </div>
                    <div class="space-y-2">
                        {#if startups.some((s) => s.fundingProgress && s.fundingProgress < 30)}
                            <p class="text-sm text-muted-foreground">
                                <span class="font-medium text-foreground"
                                    >Funding Alert:</span
                                > Some of your startups are below 30% of their funding
                                goal. Consider revisiting your pitch deck or expanding
                                investor outreach.
                            </p>
                        {/if}
                        {#if startups.some((s) => s.team < 5 && (s.stage === "seed" || s.stage === "series_a"))}
                            <p class="text-sm text-muted-foreground">
                                <span class="font-medium text-foreground"
                                    >Team Growth:</span
                                >
                                Consider expanding your team to support scaling
                                in the {startups.find(
                                    (s) =>
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
                                    .filter((s) => s.metrics?.growth)
                                    .map((s) => s.metrics?.growth || 0),
                            )}% growth. Consider allocating more resources here.
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
                            onclick={() =>
                                (window.location.href =
                                    "/dashboard/founder/startup/create")}
                        >
                            <Plus class="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                            <span>Add New Startup</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            class="w-full justify-start text-left"
                        >
                            <FileEdit class="h-3.5 w-3.5 mr-2 flex-shrink-0" />
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
        {#if !loading && !error && filteredStartups.length > 12}
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
            <div class="relative">
                <Input
                    bind:value={filterOptions.search}
                    placeholder="Search startups..."
                    class="pl-10 max-w-3xl"
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
                        <Select.GroupHeading>Industries</Select.GroupHeading>
                        {#each industryOptions as option}
                            <Select.Item value={option.value}
                                >{option.label}</Select.Item
                            >
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
                        <Select.GroupHeading>Stages</Select.GroupHeading>
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
                        <Select.GroupHeading>Sort Options</Select.GroupHeading>
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
            <div class="animate-in fade-in-0 slide-in-from-top-5 duration-500">
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
                                <div class="flex justify-between items-center">
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
        {:else if error}
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
                    We encountered a problem while loading your startup data.
                    This might be due to a network issue or a server problem.
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
                <h3 class="text-xl font-semibold mb-2">No startups found</h3>
                <p class="text-muted-foreground text-center max-w-md mb-6">
                    {#if filterOptions.search || filterOptions.industry !== "all" || filterOptions.stage !== "all"}
                        We couldn't find any startups matching your current
                        filters. Try adjusting your criteria or clear filters.
                    {:else}
                        You haven't added any startups to your portfolio yet.
                        Create your first startup to begin tracking your
                        progress.
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
