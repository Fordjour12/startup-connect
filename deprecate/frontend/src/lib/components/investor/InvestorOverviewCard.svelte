<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import * as Card from "@/components/ui/card";
    // Matches structure of section-cards.svelte
    import { formatCurrency } from "@/utils";
    import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
    import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";

    let {
        portfolioData = {
            totalInvested: 0,
            currentValue: 0,
            returns: 0,
        },
        class: CROWN_CLASS = "",
    }: {
        portfolioData: {
            totalInvested: number;
            currentValue: number;
            returns: number;
            // companies: number; // Assuming 7 is static for now
        };
        class?: string;
    } = $props();

    const returnsArePositive = portfolioData.returns >= 0;
    const companiesCount = 7; // As per original component and screenshot

    const cardContainerClasses =
        "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t";
</script>

<div
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 {CROWN_CLASS} {cardContainerClasses}"
>
    <!-- Total Invested Card -->
    <Card.Root class="@container/card" data-slot="card">
        <Card.Header>
            <Card.Description>Total Invested</Card.Description>
            <Card.Title
                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
            >
                {formatCurrency(portfolioData.totalInvested)}
            </Card.Title>
        </Card.Header>
        <Card.Footer class="flex-col items-start gap-1.5 text-sm">
            <div class="font-medium">Initial Capital Deployment</div>
            <div class="text-muted-foreground">
                Sum of all investments made in the portfolio.
            </div>
        </Card.Footer>
    </Card.Root>

    <!-- Current Value Card -->
    <Card.Root class="@container/card" data-slot="card">
        <Card.Header>
            <Card.Description>Current Value</Card.Description>
            <Card.Title
                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
            >
                {formatCurrency(portfolioData.currentValue)}
            </Card.Title>
        </Card.Header>
        <Card.Footer class="flex-col items-start gap-1.5 text-sm">
            <div class="font-medium">Portfolio Market Valuation</div>
            <div class="text-muted-foreground">
                Reflects the present worth of your holdings.
            </div>
        </Card.Footer>
    </Card.Root>

    <!-- Returns Card -->
    <Card.Root class="@container/card" data-slot="card">
        <Card.Header>
            <Card.Description>Returns</Card.Description>
            <Card.Title
                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
            >
                {returnsArePositive ? "+" : ""}{portfolioData.returns}%
            </Card.Title>
            <Card.Action>
                <Badge
                    variant="outline"
                    class={returnsArePositive
                        ? "border-emerald-500 text-emerald-500"
                        : "border-destructive text-destructive"}
                >
                    {#if returnsArePositive}
                        <TrendingUpIcon class="mr-1 size-4" />
                    {:else}
                        <TrendingDownIcon class="mr-1 size-4" />
                    {/if}
                    {returnsArePositive ? "Positive" : "Negative"} Trend
                </Badge>
            </Card.Action>
        </Card.Header>
        <Card.Footer class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex items-center gap-1 font-medium">
                {#if returnsArePositive}
                    <TrendingUpIcon class="size-4" />
                    Performance Trending Upwards
                {:else}
                    <TrendingDownIcon class="size-4" />
                    Performance Trending Downwards
                {/if}
            </div>
            <div class="text-muted-foreground">
                Overall percentage gain/loss on investments.
            </div>
        </Card.Footer>
    </Card.Root>

    <!-- Companies Card -->
    <Card.Root class="@container/card" data-slot="card">
        <Card.Header>
            <Card.Description>Companies</Card.Description>
            <Card.Title
                class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
            >
                {companiesCount}
            </Card.Title>
        </Card.Header>
        <Card.Footer class="flex-col items-start gap-1.5 text-sm">
            <div class="font-medium">Portfolio Diversity</div>
            <div class="text-muted-foreground">
                Number of distinct companies invested in.
            </div>
        </Card.Footer>
    </Card.Root>
</div>
