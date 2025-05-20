<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import InvestorOverviewCard from "@/components/investor/InvestorOverviewCard.svelte";
    import type { PageData } from "./$types";
    import PortfolioAllocationChart from "./components/PortfolioAllocationChart.svelte";
    import PortfolioChart from "./components/PortfolioChart.svelte";

    import { formatCurrency } from "@/utils";

    // Get server-loaded data
    let { data }: { data: PageData } = $props();

    // Initialize reactive state from server data
    const portfolioData = $state(data.portfolioData);
    const recentActivity = $state(data.recentActivity);
    const watchlistAlerts = $state(data.watchlistAlerts);
    const upcomingEvents = $state(data.upcomingEvents);
    const marketInsights = $state(data.marketInsights);

    function getPriorityClass(priority: string): string {
        switch (priority) {
            case "high":
                return "bg-destructive text-destructive-foreground";
            case "medium":
                return "bg-amber-500 text-white";
            case "low":
                return "bg-muted text-muted-foreground";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    }

    function getEventTypeClass(type: string): string {
        switch (type) {
            case "pitch":
                return "bg-emerald-500 text-white";
            case "meeting":
                return "bg-blue-500 text-white";
            case "internal":
                return "bg-purple-500 text-white";
            case "conference":
                return "bg-amber-500 text-white";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
    >
        <div>
            <h1 class="text-3xl font-bold mb-2">Investor Dashboard</h1>
            <p class="text-muted-foreground mb-6">
                Overview of your portfolio, activities, and opportunities
            </p>
        </div>
        <div class="flex space-x-4">
            <a
                href="/dashboard/investor/portfolio"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                Portfolio Management
            </a>
        </div>
    </div>
    <!-- grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 -->
    <div class="">
        <div class="md:col-span-3 lg:col-span-4">
            <!-- Main dashboard grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <!-- Overview Summary -->
                <InvestorOverviewCard
                    {portfolioData}
                    class="col-span-1 md:col-span-2 lg:col-span-6"
                />

                <!-- Portfolio Summary -->
                <Card class="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Portfolio Summary</CardTitle>
                        <CardDescription>
                            Overview of your investment portfolio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <PortfolioChart
                                    portfolioData={data.portfolioData}
                                />
                            </div>
                            <div>
                                <PortfolioAllocationChart
                                    portfolioData={data.portfolioData}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Investment Activity -->
                <Card class="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Investment Activity</CardTitle>
                        <CardDescription
                            >Recent transactions and updates</CardDescription
                        >
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            {#each recentActivity as activity}
                                <div class="border-b pb-3 last:border-0">
                                    {#if activity.type === "investment"}
                                        <div class="flex justify-between">
                                            <div>
                                                <p class="font-medium">
                                                    {activity.company}
                                                </p>
                                                <p
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    New Investment
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-semibold">
                                                    {formatCurrency(
                                                        Number(activity.amount),
                                                    )}
                                                </p>
                                                <p
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    {:else if activity.type === "funding_round"}
                                        <div class="flex justify-between">
                                            <div>
                                                <p class="font-medium">
                                                    {activity.company}
                                                </p>
                                                <p
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    {activity.round} Funding Round
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <Badge
                                                    variant={activity.participation
                                                        ? "default"
                                                        : "outline"}
                                                >
                                                    {activity.participation
                                                        ? "Participated"
                                                        : "Not Participated"}
                                                </Badge>
                                                <p
                                                    class="text-xs text-muted-foreground mt-1"
                                                >
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    {:else if activity.type === "valuation_update"}
                                        <div class="flex justify-between">
                                            <div>
                                                <p class="font-medium">
                                                    {activity.company}
                                                </p>
                                                <p
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    Valuation Update
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <p
                                                    class="font-semibold text-emerald-500"
                                                >
                                                    {activity.newValuation}
                                                </p>
                                                <p
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    from {activity.previousValuation}
                                                </p>
                                                <p
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    {:else if activity.type === "exit_opportunity"}
                                        <div class="flex justify-between">
                                            <div>
                                                <p class="font-medium">
                                                    {activity.company}
                                                </p>
                                                <p
                                                    class="text-sm text-muted-foreground"
                                                >
                                                    Potential Exit
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <Badge
                                                    variant="outline"
                                                    class="bg-amber-100 text-amber-800 border-amber-300"
                                                >
                                                    {activity.potential} Potential
                                                </Badge>
                                                <p
                                                    class="text-xs text-muted-foreground mt-1"
                                                >
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a
                            href="/dashboard/investor/activity"
                            class="text-sm text-blue-500 hover:underline"
                            >View all activity</a
                        >
                    </CardFooter>
                </Card>

                <!-- Watchlist Alerts -->
                <Card class="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Watchlist Alerts</CardTitle>
                        <CardDescription
                            >Updates from startups you're watching</CardDescription
                        >
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            {#each watchlistAlerts as alert}
                                <div class="border-b pb-3 last:border-0">
                                    <div class="flex justify-between mb-1">
                                        <p class="font-medium">
                                            {alert.company}
                                        </p>
                                        <Badge
                                            class={getPriorityClass(
                                                alert.priority,
                                            )}
                                        >
                                            {alert.priority}
                                        </Badge>
                                    </div>
                                    <p class="text-sm mb-1">{alert.alert}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {alert.date}
                                    </p>
                                </div>
                            {/each}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a
                            href="/dashboard/investor/watchlist"
                            class="text-sm text-blue-500 hover:underline"
                            >Manage watchlist</a
                        >
                    </CardFooter>
                </Card>

                <!-- Upcoming Events -->
                <Card class="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription
                            >Scheduled meetings and important dates</CardDescription
                        >
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            {#each upcomingEvents as event}
                                <div class="border-b pb-3 last:border-0">
                                    <div class="flex justify-between mb-1">
                                        <p class="font-medium">{event.title}</p>
                                        <Badge
                                            class={getEventTypeClass(
                                                event.type,
                                            )}
                                        >
                                            {event.type}
                                        </Badge>
                                    </div>
                                    <div
                                        class="flex items-center text-sm text-muted-foreground mb-1"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{event.date} • {event.time}</span>
                                    </div>
                                    <div
                                        class="flex items-center text-sm text-muted-foreground"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a
                            href="/dashboard/investor/calendar"
                            class="text-sm text-blue-500 hover:underline"
                            >View calendar</a
                        >
                    </CardFooter>
                </Card>

                <!-- Market Insights -->
                <Card class="md:col-span-2 lg:col-span-6">
                    <CardHeader>
                        <CardTitle>Market Insights</CardTitle>
                        <CardDescription
                            >Industry trends and funding environment</CardDescription
                        >
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each marketInsights as insight}
                                <div class="bg-secondary p-4 rounded-lg">
                                    <h3 class="font-medium mb-2">
                                        {insight.title}
                                    </h3>
                                    <div
                                        class="flex justify-between text-sm text-muted-foreground"
                                    >
                                        <span>{insight.source}</span>
                                        <span>{insight.date}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <a
                            href="/dashboard/investor/insights"
                            class="text-sm text-blue-500 hover:underline"
                            >More insights</a
                        >
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
</div>

<style>
    /* Mobile responsiveness enhancements */
    @media (max-width: 640px) {
        .grid {
            grid-gap: 1rem;
        }
    }
</style>
