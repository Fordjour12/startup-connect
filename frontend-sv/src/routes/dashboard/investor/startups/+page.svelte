<script lang="ts">
    import {
        BookmarkPlus,
        Filter,
        Save,
        Search,
        Sparkles,
        Star,
        TrendingUp,
    } from "@lucide/svelte/icons";
    // UI Components
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import * as Dialog from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import * as Sheet from "@/components/ui/sheet";
    import * as Tabs from "@/components/ui/tabs";
    // Custom Components
    import StartupCard from "@/components/startup-card.svelte";
    import { formatNumber } from "@/utils";

    // Page data using Svelte 5 runes
    interface PageData {
        startups: any[];
        recommendations: any[];
        trending: any[];
        featured: any[];
        savedSearches: any[];
    }

    let {
        startups = [],
        recommendations = [],
        trending = [],
        featured = [],
        savedSearches = [],
    } = $props();

    // State Management
    let searchQuery = $state("");
    let filtersOpen = $state(false);
    let saveSearchOpen = $state(false);
    let searchName = $state("");

    // Filter values
    let selectedIndustries = $state<string[]>([]);
    let selectedStages = $state<string[]>([]);
    let selectedLocations = $state<string[]>([]);
    let fundingMin = $state<number | null>(null);
    let fundingMax = $state<number | null>(null);

    // Available filter options
    const industries = [
        { value: "tech", label: "Technology" },
        { value: "fintech", label: "Fintech" },
        { value: "health", label: "Healthcare" },
        { value: "edtech", label: "Education Tech" },
        { value: "ecommerce", label: "E-Commerce" },
        { value: "sustainability", label: "Sustainability" },
    ];

    const stages = [
        { value: "idea", label: "Idea Stage" },
        { value: "mvp", label: "MVP" },
        { value: "seed", label: "Seed" },
        { value: "series_a", label: "Series A" },
        { value: "series_b_plus", label: "Series B+" },
    ];

    const locations = [
        { value: "san_francisco", label: "San Francisco" },
        { value: "new_york", label: "New York" },
        { value: "boston", label: "Boston" },
        { value: "chicago", label: "Chicago" },
        { value: "austin", label: "Austin" },
        { value: "remote", label: "Remote-First" },
    ];

    // Handle filter changes
    function applyFilters() {
        filtersOpen = false;
        // In a real implementation, this would update the URL params and refetch data
    }

    function resetFilters() {
        selectedIndustries = [];
        selectedStages = [];
        selectedLocations = [];
        fundingMin = null;
        fundingMax = null;
    }

    function saveCurrentSearch() {
        if (!searchName.trim()) return;

        // In a real implementation, this would save the search to the database
        saveSearchOpen = false;
        searchName = "";
    }

    // For demonstration purposes - use the props directly
    let filtered = $derived(startups);
    let recommendationsList = $derived(recommendations);
    let trendingList = $derived(trending);
    let featuredList = $derived(featured);
    let savedSearchesList = $derived(savedSearches);
</script>

<div class="px-4 py-8">
    <div>
        <div class="flex flex-col gap-8">
            <!-- Page Header -->
            <div>
                <h1 class="text-3xl font-bold tracking-tight">
                    Startup Discovery
                </h1>
                <p class="text-muted-foreground mt-2">
                    Find your next investment opportunity with our powerful
                    search and recommendation tools.
                </p>
            </div>

            <!-- Search and Filters -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="relative flex-grow">
                    <Search
                        class="absolute left-3 top-3 size-4 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        placeholder="Search startups by name, industry, or keyword..."
                        class="pl-10"
                        bind:value={searchQuery}
                    />
                </div>

                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        class="flex gap-2 items-center"
                        onclick={() => (filtersOpen = true)}
                    >
                        <Filter class="size-4" />
                        <span>Filters</span>
                    </Button>

                    <Button
                        variant="outline"
                        class="flex gap-2 items-center"
                        onclick={() => (saveSearchOpen = true)}
                    >
                        <Save class="size-4" />
                        <span>Save Search</span>
                    </Button>
                </div>
            </div>

            <!-- Saved Searches -->
            {#if savedSearchesList && savedSearchesList.length > 0}
                <div class="flex flex-wrap gap-2 items-center">
                    <span class="text-sm font-medium">Saved Searches:</span>
                    {#each savedSearchesList as search}
                        <Badge
                            variant="outline"
                            class="flex gap-1 items-center cursor-pointer hover:bg-secondary"
                        >
                            <BookmarkPlus class="h-3 w-3" />
                            <span>{search.name}</span>
                        </Badge>
                    {/each}
                </div>
            {/if}

            <!-- Main Content Tabs -->
            <Tabs.Root value="all" class="space-y-6">
                <Tabs.List>
                    <Tabs.Trigger
                        value="all"
                        class="flex gap-2 items-center justify-center"
                    >
                        <Search class="h-4 w-4" />
                        <span>All Startups</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="recommended"
                        class="flex gap-2 items-center justify-center"
                    >
                        <Sparkles class="h-4 w-4" />
                        <span>For You</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="trending"
                        class="flex gap-2 items-center justify-center"
                    >
                        <TrendingUp class="h-4 w-4" />
                        <span>Trending</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="featured"
                        class="flex gap-2 items-center justify-center"
                    >
                        <Star class="h-4 w-4" />
                        <span>Featured</span>
                    </Tabs.Trigger>
                </Tabs.List>

                <!-- All Startups Tab -->
                <Tabs.Content value="all" class="space-y-6">
                    <!-- Active Filters -->
                    {#if selectedIndustries.length > 0 || selectedStages.length > 0 || selectedLocations.length > 0 || fundingMin || fundingMax}
                        <div class="flex flex-wrap gap-2 items-center">
                            <span class="text-sm font-medium"
                                >Active Filters:</span
                            >

                            {#each selectedIndustries as industry}
                                <Badge variant="secondary" class="flex gap-1">
                                    <span
                                        >{industries.find(
                                            (i) => i.value === industry,
                                        )?.label || industry}</span
                                    >
                                </Badge>
                            {/each}

                            {#each selectedStages as stage}
                                <Badge variant="secondary" class="flex gap-1">
                                    <span
                                        >{stages.find((s) => s.value === stage)
                                            ?.label || stage}</span
                                    >
                                </Badge>
                            {/each}

                            {#each selectedLocations as location}
                                <Badge variant="secondary" class="flex gap-1">
                                    <span
                                        >{locations.find(
                                            (l) => l.value === location,
                                        )?.label || location}</span
                                    >
                                </Badge>
                            {/each}

                            {#if fundingMin}
                                <Badge variant="secondary" class="flex gap-1">
                                    <span>Min: {formatNumber(fundingMin)}</span>
                                </Badge>
                            {/if}

                            {#if fundingMax}
                                <Badge variant="secondary" class="flex gap-1">
                                    <span>Max: {formatNumber(fundingMax)}</span>
                                </Badge>
                            {/if}

                            <Button
                                variant="ghost"
                                size="sm"
                                onclick={resetFilters}>Clear All</Button
                            >
                        </div>
                    {/if}

                    <!-- Startup Grid -->
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {#each filtered as startup}
                            <StartupCard {startup} />
                        {/each}
                    </div>
                </Tabs.Content>

                <!-- Recommended Tab -->
                <Tabs.Content value="recommended" class="space-y-6">
                    <div class="flex items-center gap-2">
                        <Sparkles class="h-5 w-5 text-primary" />
                        <h2 class="text-xl font-semibold">
                            Recommended for You
                        </h2>
                    </div>
                    <p class="text-muted-foreground">
                        Based on your investment history and preferences, we
                        think these startups might interest you.
                    </p>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {#each recommendationsList as startup}
                            <StartupCard {startup} />
                        {/each}
                    </div>
                </Tabs.Content>

                <!-- Trending Tab -->
                <Tabs.Content value="trending" class="space-y-6">
                    <div class="flex items-center gap-2">
                        <TrendingUp class="h-5 w-5 text-primary" />
                        <h2 class="text-xl font-semibold">Trending Startups</h2>
                    </div>
                    <p class="text-muted-foreground">
                        Startups gaining momentum in their sectors based on
                        recent growth, funding, and market attention.
                    </p>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {#each trendingList as startup}
                            <StartupCard {startup} />
                        {/each}
                    </div>
                </Tabs.Content>

                <!-- Featured Tab -->
                <Tabs.Content value="featured" class="space-y-6">
                    <div class="flex items-center gap-2">
                        <Star class="h-5 w-5 text-primary" />
                        <h2 class="text-xl font-semibold">
                            Featured Opportunities
                        </h2>
                    </div>
                    <p class="text-muted-foreground">
                        High-potential startups curated by our investment
                        experts.
                    </p>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {#each featuredList as startup}
                            <StartupCard {startup} />
                        {/each}
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    </div>

    <!-- Filter Sheet -->
    <Sheet.Root bind:open={filtersOpen}>
        <Sheet.Content side="right" class="w-full sm:max-w-md">
            <Sheet.Header>
                <Sheet.Title>Startup Filters</Sheet.Title>
                <Sheet.Description>
                    Refine your search with these filters
                </Sheet.Description>
            </Sheet.Header>

            <div class="py-6 space-y-6">
                <!-- Industry Filter -->
                <div class="space-y-2">
                    <h3 class="text-sm font-medium">Industry</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each industries as industry}
                            <Badge
                                variant={selectedIndustries.includes(
                                    industry.value,
                                )
                                    ? "default"
                                    : "outline"}
                                class="cursor-pointer"
                                onclick={() => {
                                    if (
                                        selectedIndustries.includes(
                                            industry.value,
                                        )
                                    ) {
                                        selectedIndustries =
                                            selectedIndustries.filter(
                                                (i) => i !== industry.value,
                                            );
                                    } else {
                                        selectedIndustries = [
                                            ...selectedIndustries,
                                            industry.value,
                                        ];
                                    }
                                }}
                            >
                                {industry.label}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <!-- Stage Filter -->
                <div class="space-y-2">
                    <h3 class="text-sm font-medium">Funding Stage</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each stages as stage}
                            <Badge
                                variant={selectedStages.includes(stage.value)
                                    ? "default"
                                    : "outline"}
                                class="cursor-pointer"
                                onclick={() => {
                                    if (selectedStages.includes(stage.value)) {
                                        selectedStages = selectedStages.filter(
                                            (s) => s !== stage.value,
                                        );
                                    } else {
                                        selectedStages = [
                                            ...selectedStages,
                                            stage.value,
                                        ];
                                    }
                                }}
                            >
                                {stage.label}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <!-- Location Filter -->
                <div class="space-y-2">
                    <h3 class="text-sm font-medium">Location</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each locations as location}
                            <Badge
                                variant={selectedLocations.includes(
                                    location.value,
                                )
                                    ? "default"
                                    : "outline"}
                                class="cursor-pointer"
                                onclick={() => {
                                    if (
                                        selectedLocations.includes(
                                            location.value,
                                        )
                                    ) {
                                        selectedLocations =
                                            selectedLocations.filter(
                                                (l) => l !== location.value,
                                            );
                                    } else {
                                        selectedLocations = [
                                            ...selectedLocations,
                                            location.value,
                                        ];
                                    }
                                }}
                            >
                                {location.label}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <!-- Funding Needs Filter -->
                <div class="space-y-2">
                    <h3 class="text-sm font-medium">Funding Range</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label
                                class="text-xs text-muted-foreground"
                                for="min-funding">Minimum</label
                            >
                            <Input
                                id="min-funding"
                                type="number"
                                placeholder="$0"
                                bind:value={fundingMin}
                            />
                        </div>
                        <div class="space-y-1">
                            <label
                                class="text-xs text-muted-foreground"
                                for="max-funding">Maximum</label
                            >
                            <Input
                                id="max-funding"
                                type="number"
                                placeholder="No maximum"
                                bind:value={fundingMax}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Sheet.Footer>
                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        onclick={resetFilters}
                        class="flex-1">Reset</Button
                    >
                    <Button onclick={applyFilters} class="flex-1"
                        >Apply Filters</Button
                    >
                </div>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>

    <!-- Save Search Dialog -->
    <Dialog.Root bind:open={saveSearchOpen}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Save Search</Dialog.Title>
                <Dialog.Description>
                    Save your current search criteria for quick access later.
                </Dialog.Description>
            </Dialog.Header>

            <div class="py-4">
                <Input
                    placeholder="Enter a name for this search"
                    bind:value={searchName}
                />
            </div>

            <Dialog.Footer>
                <Button
                    variant="outline"
                    onclick={() => (saveSearchOpen = false)}>Cancel</Button
                >
                <Button onclick={saveCurrentSearch}>Save</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</div>
