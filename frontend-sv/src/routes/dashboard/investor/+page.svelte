<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Chart } from "$lib/components/ui/chart";
    import type { PageData } from "./$types";

    // Get server-loaded data
    let { data }: { data: PageData } = $props();

    // Initialize reactive state from server data
    const portfolioData = $state(data.portfolioData);
    const recentActivity = $state(data.recentActivity);
    const watchlistAlerts = $state(data.watchlistAlerts);
    const upcomingEvents = $state(data.upcomingEvents);
    const marketInsights = $state(data.marketInsights);

    // Chart data for portfolio value
    const portfolioChartData = $state({
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
        ],
        datasets: [
            {
                label: "Portfolio Value",
                data: portfolioData.historicalValues,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.3,
                fill: true,
            },
        ],
    });

    // Chart data for portfolio allocation
    const allocationChartData = $state({
        labels: ["Tech", "Health", "Fintech", "Consumer"],
        datasets: [
            {
                data: [
                    portfolioData.allocation.tech,
                    portfolioData.allocation.health,
                    portfolioData.allocation.fintech,
                    portfolioData.allocation.consumer,
                ],
                backgroundColor: [
                    "rgb(59, 130, 246)",
                    "rgb(34, 197, 94)",
                    "rgb(168, 85, 247)",
                    "rgb(251, 191, 36)",
                ],
            },
        ],
    });

    // Chart options
    const lineChartOptions = {
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: (value: number) =>
                        `$${(value / 1000).toFixed(0)}k`,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `Value: $${(context.raw / 1000).toFixed(0)}k`,
                },
            },
        },
    };

    const doughnutChartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        cutout: "70%",
    };

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

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
    <h1 class="text-3xl font-bold mb-2">Investor Dashboard</h1>
    <p class="text-muted-foreground mb-6">
        Overview of your portfolio, activities, and opportunities
    </p>

    <!-- Main dashboard grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Portfolio Summary -->
        <Card class="lg:col-span-2">
            <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
                <CardDescription>
                    Overview of your investment portfolio
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Chart
                            type="line"
                            data={portfolioChartData}
                            options={lineChartOptions}
                            height="200px"
                            width="100%"
                            className=""
                        />
                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <div class="bg-secondary rounded-lg p-4">
                                <p class="text-sm text-muted-foreground">
                                    Total Invested
                                </p>
                                <p class="text-2xl font-bold">
                                    {formatCurrency(
                                        portfolioData.totalInvested,
                                    )}
                                </p>
                            </div>
                            <div class="bg-secondary rounded-lg p-4">
                                <p class="text-sm text-muted-foreground">
                                    Current Value
                                </p>
                                <p class="text-2xl font-bold">
                                    {formatCurrency(portfolioData.currentValue)}
                                </p>
                            </div>
                            <div class="bg-secondary rounded-lg p-4">
                                <p class="text-sm text-muted-foreground">
                                    Returns
                                </p>
                                <p class="text-2xl font-bold text-emerald-500">
                                    +{portfolioData.returns}%
                                </p>
                            </div>
                            <div class="bg-secondary rounded-lg p-4">
                                <p class="text-sm text-muted-foreground">
                                    Companies
                                </p>
                                <p class="text-2xl font-bold">7</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2">
                            Portfolio Allocation
                        </h3>
                        <Chart
                            type="doughnut"
                            data={allocationChartData}
                            options={doughnutChartOptions}
                            height="200px"
                            className=""
                            width=""
                        />

                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <div class="flex items-center">
                                <div
                                    class="w-3 h-3 rounded-full bg-blue-500 mr-2"
                                ></div>
                                <span class="text-sm"
                                    >Tech ({portfolioData.allocation
                                        .tech}%)</span
                                >
                            </div>
                            <div class="flex items-center">
                                <div
                                    class="w-3 h-3 rounded-full bg-green-500 mr-2"
                                ></div>
                                <span class="text-sm"
                                    >Health ({portfolioData.allocation
                                        .health}%)</span
                                >
                            </div>
                            <div class="flex items-center">
                                <div
                                    class="w-3 h-3 rounded-full bg-purple-500 mr-2"
                                ></div>
                                <span class="text-sm"
                                    >Fintech ({portfolioData.allocation
                                        .fintech}%)</span
                                >
                            </div>
                            <div class="flex items-center">
                                <div
                                    class="w-3 h-3 rounded-full bg-amber-500 mr-2"
                                ></div>
                                <span class="text-sm"
                                    >Consumer ({portfolioData.allocation
                                        .consumer}%)</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Investment Activity -->
        <Card>
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
        <Card>
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
                                <p class="font-medium">{alert.company}</p>
                                <Badge class={getPriorityClass(alert.priority)}>
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
        <Card>
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
                                <Badge class={getEventTypeClass(event.type)}>
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
        <Card class="lg:col-span-2">
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
                            <h3 class="font-medium mb-2">{insight.title}</h3>
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

<style>
    /* Mobile responsiveness enhancements */
    @media (max-width: 640px) {
        .grid {
            grid-gap: 1rem;
        }
    }
</style>
