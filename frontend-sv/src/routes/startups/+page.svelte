<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import * as Card from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "@/components/ui/select";
    import { Separator } from "@/components/ui/separator";
    import { Skeleton } from "@/components/ui/skeleton";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    // Filter state
    let searchQuery = $state("");
    let selectedIndustry = $state("all");
    let selectedFundingStage = $state("all");
    let isLoading = $state(true);

    // Initialize startups from server data
    let startups = $state(data.startups);
    const industries = data.industries;
    const fundingStages = data.fundingStages;

    // Filtered startups derived value
    let filteredStartups = $derived(
        startups.filter((startup) => {
            const matchesSearch =
                startup.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                startup.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesIndustry =
                selectedIndustry === "all" ||
                startup.industry === selectedIndustry;

            const matchesFunding =
                selectedFundingStage === "all" ||
                startup.funding_stage === selectedFundingStage;

            return matchesSearch && matchesIndustry && matchesFunding;
        }),
    );

    // Initialize component and set loading to false
    $effect(() => {
        isLoading = false;
    });

    // Reset filters
    function resetFilters() {
        searchQuery = "";
        selectedIndustry = "all";
        selectedFundingStage = "all";
    }

    // Format currency
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    // Event handler for button clicks
    function handleReset() {
        resetFilters();
    }
</script>

<div class="container mx-auto py-8 px-4 md:px-6">
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">Startups</h1>
            <p class="text-muted-foreground">
                Discover and connect with innovative startups
            </p>
        </div>

        <Separator class="my-4" />

        <!-- Filters Section -->
        <div class="grid gap-4 md:grid-cols-[1fr_auto_auto] items-end">
            <!-- Search Bar -->
            <div class="relative">
                <Input
                    type="search"
                    placeholder="Search by name or description..."
                    bind:value={searchQuery}
                />
            </div>

            <!-- Using a standard select instead of shadcn select until we confirm import structure -->
            <div class="w-full md:w-[180px]">
                <!-- bind:value={selectedIndustry} -->
                <Select
                    type="single"
                    bind:value={selectedIndustry}
                    name="industry"
                >
                    <SelectTrigger class="w-full p-2 border rounded-md">
                        {selectedIndustry === "all"
                            ? "All Industry"
                            : selectedIndustry}
                    </SelectTrigger>
                    <SelectContent>
                        {#each industries as industry}
                            <SelectItem
                                value={industry}
                                label={industry.toUpperCase()}
                            />
                        {/each}
                    </SelectContent>
                </Select>
            </div>

            <div class="w-full md:w-[180px]">
                <Select
                    type="single"
                    bind:value={selectedFundingStage}
                    name="funding"
                >
                    <SelectTrigger class="w-full p-2 border rounded-md">
                        {selectedFundingStage === "all"
                            ? "All Stages"
                            : selectedFundingStage}
                    </SelectTrigger>
                    <SelectContent>
                        {#each fundingStages as stage}
                            <SelectItem
                                value={stage}
                                label={stage.toUpperCase()}
                            />
                        {/each}
                    </SelectContent>
                </Select>
            </div>

            <!-- Reset Filter Button -->
            <button
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm w-full md:w-auto"
                onclick={handleReset}
            >
                Reset Filters
            </button>
        </div>

        <!-- Results Count -->
        <div class="text-sm text-muted-foreground mt-2">
            {#if !isLoading}
                {filteredStartups.length}
                {filteredStartups.length === 1 ? "startup" : "startups"} found
            {/if}
        </div>

        <!-- Startups Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {#if isLoading}
                {#each Array(6) as _}
                    <div class="flex flex-col gap-4">
                        <Skeleton class="h-[200px] w-full rounded-lg" />
                        <div class="space-y-2">
                            <Skeleton class="h-4 w-[250px]" />
                            <Skeleton class="h-4 w-[200px]" />
                        </div>
                    </div>
                {/each}
            {:else if filteredStartups.length === 0}
                <div class="col-span-full flex justify-center py-12">
                    <div class="text-center">
                        <h3 class="text-lg font-medium">No startups found</h3>
                        <p class="text-muted-foreground mt-1">
                            Try adjusting your filters or search term
                        </p>
                        <button
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm mt-4"
                            onclick={handleReset}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            {:else}
                {#each filteredStartups as startup (startup.id)}
                    <Card.Root class="overflow-hidden h-full flex flex-col">
                        <div class="aspect-video bg-muted relative">
                            <img
                                src={startup.logo_url}
                                alt={`${startup.name} logo`}
                                class="object-cover w-full h-full"
                            />
                            <Badge class="absolute top-2 right-2"
                                >{startup.funding_stage}</Badge
                            >
                        </div>
                        <Card.Header>
                            <div class="flex justify-between items-start">
                                <Card.Title>{startup.name}</Card.Title>
                                <Badge variant="outline"
                                    >{startup.industry}</Badge
                                >
                            </div>
                            <Card.Description
                                >{startup.location} • Founded {startup.founded_year}</Card.Description
                            >
                        </Card.Header>
                        <Card.Content class="flex-grow">
                            <p>{startup.description}</p>
                            <div class="grid grid-cols-2 gap-2 mt-4 text-sm">
                                <div>
                                    <span class="text-muted-foreground"
                                        >Team:</span
                                    >
                                    {startup.team_size} people
                                </div>
                                <div>
                                    <span class="text-muted-foreground"
                                        >Goal:</span
                                    >
                                    {formatCurrency(startup.funding_goal)}
                                </div>
                                <div class="col-span-2">
                                    <span class="text-muted-foreground"
                                        >Market:</span
                                    >
                                    {startup.target_market}
                                </div>
                                <div class="col-span-2">
                                    <span class="text-muted-foreground"
                                        >Business model:</span
                                    >
                                    {startup.business_model}
                                </div>
                            </div>
                        </Card.Content>
                        <Card.Footer class="flex justify-between">
                            <a
                                href={startup.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-8 rounded-md px-3 text-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm"
                            >
                                Visit Website
                            </a>
                            <a
                                href={startup.pitch_deck_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-8 rounded-md px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow"
                            >
                                View Pitch
                            </a>
                        </Card.Footer>
                    </Card.Root>
                {/each}
            {/if}
        </div>
    </div>
</div>
