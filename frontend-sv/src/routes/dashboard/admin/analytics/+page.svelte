<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import {
        IconChartBar,
        IconTrendingUp,
        IconUser,
        IconBuilding,
        IconCurrencyDollar,
        IconActivity,
        IconCalendar,
        IconDownload,
        IconFileText
    } from "@tabler/icons-svelte";
    import { Button } from "@/components/ui/button";

    let { data } = $props<{
        data: {
            user: any;
            metrics: any;
            monthlyData: any[];
            topStartups: any[];
            userActivity: any[];
            platformHealth: any;
        };
    }>();

    const {
        user,
        metrics,
        monthlyData,
        topStartups,
        userActivity,
        platformHealth,
    } = data;

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }
</script>

<svelte:head>
    <title>Analytics Dashboard - StartupConnect</title>
    <meta
        name="description"
        content="Platform analytics and metrics dashboard"
    />
</svelte:head>

<div class="px-4 py-8">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
    >
        <div>
            <h1 class="text-3xl font-bold">Analytics Dashboard</h1>
            <p class="text-muted-foreground">
                Monitor platform performance and user engagement
            </p>
        </div>
        <div class="mt-4 md:mt-0 flex gap-2">
            <a href="/dashboard/admin/analytics/reports">
                <Button variant="outline">
                    <IconFileText class="h-4 w-4 mr-2" />
                    Custom Reports
                </Button>
            </a>
            <select class="px-3 py-2 border rounded-md text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last year</option>
            </select>
            <button
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
                <IconDownload class="h-4 w-4" />
                Export
            </button>
        </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium">Total Users</CardTitle>
                <IconUser class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">
                    {metrics.totalUsers.toLocaleString()}
                </div>
                <p class="text-xs text-muted-foreground">
                    +{formatPercentage(metrics.monthlyGrowth)} from last month
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium">Active Users</CardTitle>
                <IconActivity class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">
                    {metrics.activeUsers.toLocaleString()}
                </div>
                <p class="text-xs text-muted-foreground">
                    {formatPercentage(metrics.userRetention)} retention rate
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium">Total Startups</CardTitle
                >
                <IconBuilding class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">
                    {metrics.totalStartups.toLocaleString()}
                </div>
                <p class="text-xs text-muted-foreground">
                    +{metrics.totalStartups - 140} this month
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium"
                    >Total Investments</CardTitle
                >
                <IconCurrencyDollar class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">
                    {formatCurrency(metrics.totalInvestmentValue)}
                </div>
                <p class="text-xs text-muted-foreground">
                    {formatPercentage(metrics.conversionRate)} conversion rate
                </p>
            </CardContent>
        </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Growth Trends -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <IconTrendingUp class="h-5 w-5" />
                    <span>Growth Trends</span>
                </CardTitle>
                <CardDescription
                    >Monthly platform growth metrics</CardDescription
                >
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    {#each monthlyData as month}
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium"
                                >{month.month}</span
                            >
                            <div class="flex items-center space-x-4">
                                <span class="text-sm text-muted-foreground"
                                    >{month.users} users</span
                                >
                                <span class="text-sm text-muted-foreground"
                                    >{month.startups} startups</span
                                >
                                <span class="text-sm text-muted-foreground"
                                    >{month.investments} investments</span
                                >
                            </div>
                        </div>
                        <div class="w-full bg-muted rounded-full h-2">
                            <div
                                class="bg-primary h-2 rounded-full"
                                style="width: {((month.users - 1150) /
                                    (1300 - 1150)) *
                                    100}%"
                            ></div>
                        </div>
                    {/each}
                </div>
            </CardContent>
        </Card>

        <!-- User Activity -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <IconCalendar class="h-5 w-5" />
                    <span>User Activity</span>
                </CardTitle>
                <CardDescription>Active users by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    {#each userActivity as activity}
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium"
                                >{activity.hour}</span
                            >
                            <div class="flex items-center space-x-2">
                                <span class="text-sm text-muted-foreground"
                                    >{activity.active} active</span
                                >
                                <div class="w-24 bg-muted rounded-full h-2">
                                    <div
                                        class="bg-blue-500 h-2 rounded-full"
                                        style="width: {(activity.active / 600) *
                                            100}%"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </CardContent>
        </Card>
    </div>

    <!-- Top Startups and Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Startups -->
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Startups</CardTitle>
                <CardDescription
                    >Startups with highest investment amounts</CardDescription
                >
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    {#each topStartups as startup, index}
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold"
                                >
                                    {index + 1}
                                </div>
                                <div>
                                    <p class="font-semibold">{startup.name}</p>
                                    <p class="text-sm text-muted-foreground">
                                        {startup.investors} investors
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold">
                                    {formatCurrency(startup.investments)}
                                </p>
                                <p class="text-sm text-muted-foreground">
                                    raised
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </CardContent>
        </Card>

        <!-- Platform Health -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <IconChartBar class="h-5 w-5" />
                    <span>Platform Health</span>
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-6">
                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium"
                                >Server Uptime</span
                            >
                            <span class="text-sm"
                                >{platformHealth.serverUptime}</span
                            >
                        </div>
                        <div class="w-full bg-muted rounded-full h-2">
                            <div
                                class="bg-green-500 h-2 rounded-full"
                                style="width: 99.8%"
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium"
                                >Response Time</span
                            >
                            <span class="text-sm"
                                >{platformHealth.responseTime}</span
                            >
                        </div>
                        <div class="w-full bg-muted rounded-full h-2">
                            <div
                                class="bg-blue-500 h-2 rounded-full"
                                style="width: 85%"
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium"
                                >Database Performance</span
                            >
                            <span class="text-sm"
                                >{platformHealth.databasePerformance}</span
                            >
                        </div>
                        <div class="w-full bg-muted rounded-full h-2">
                            <div
                                class="bg-green-500 h-2 rounded-full"
                                style="width: 95%"
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium"
                                >User Satisfaction</span
                            >
                            <span class="text-sm"
                                >{platformHealth.userSatisfaction}</span
                            >
                        </div>
                        <div class="w-full bg-muted rounded-full h-2">
                            <div
                                class="bg-yellow-500 h-2 rounded-full"
                                style="width: 94%"
                            ></div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</div>
