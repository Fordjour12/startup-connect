<!-- Growth & Traction Tools Dashboard -->
<script lang="ts">
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Tabs,
        TabsList,
        TabsTrigger,
        TabsContent,
    } from "$lib/components/ui/tabs";
    import { Badge } from "$lib/components/ui/badge";
    import * as Table from "$lib/components/ui/table";
    import { Progress } from "$lib/components/ui/progress";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import type { PageData } from "./$types";

    // Icons
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import Clock from "@lucide/svelte/icons/clock";
    import Plus from "@lucide/svelte/icons/plus";
    import BarChart3 from "@lucide/svelte/icons/bar-chart-3";
    import LineChart from "@lucide/svelte/icons/line-chart";
    import Activity from "@lucide/svelte/icons/activity";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import Lightbulb from "@lucide/svelte/icons/lightbulb";
    import Users from "@lucide/svelte/icons/users";
    import Target from "@lucide/svelte/icons/target";
    import FileText from "@lucide/svelte/icons/file-text";
    import Settings from "@lucide/svelte/icons/settings";
    import Edit3 from "@lucide/svelte/icons/edit-3";
    import Download from "@lucide/svelte/icons/download";
    import Filter from "@lucide/svelte/icons/filter";
    import FileUp from "@lucide/svelte/icons/file-up";
    import Share2 from "@lucide/svelte/icons/share-2";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import HelpCircle from "@lucide/svelte/icons/help-circle";
    import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
    import ArrowDownRight from "@lucide/svelte/icons/arrow-down-right";
    import DollarSign from "@lucide/svelte/icons/dollar-sign";
    import Mail from "@lucide/svelte/icons/mail";
    import Monitor from "@lucide/svelte/icons/monitor";
    import Search from "@lucide/svelte/icons/search";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";

    // Page data
    let { data } = $props<{ data: PageData }>();

    // Active tab state
    let activeTab = $state("growth-metrics");

    // Loading state
    let isLoading = $state(true);

    onMount(() => {
        // Simulate API data loading
        setTimeout(() => {
            isLoading = false;
        }, 500);
    });

    // Format currency function
    function formatCurrency(
        amount: number,
        abbreviate: boolean = false,
    ): string {
        if (abbreviate) {
            if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(1)}K`;
            }
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    // Format percentage
    function formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }

    // Format date
    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    // Format large numbers
    function formatNumber(num: number): string {
        return new Intl.NumberFormat("en-US").format(num);
    }

    // Get status badge class
    function getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-500/10 text-green-500";
            case "in-progress":
                return "bg-blue-500/10 text-blue-500";
            case "pending":
                return "bg-amber-500/10 text-amber-500";
            case "not started":
                return "bg-gray-500/10 text-gray-500";
            case "active":
                return "bg-blue-500/10 text-blue-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    }

    // Get priority badge class
    function getPriorityClass(priority: string): string {
        switch (priority.toLowerCase()) {
            case "high":
                return "bg-red-500/10 text-red-500";
            case "medium":
                return "bg-amber-500/10 text-amber-500";
            case "low":
                return "bg-green-500/10 text-green-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    }

    // Get change indicator class and icon
    function getChangeIndicator(change: number) {
        if (change > 0) {
            return {
                icon: ArrowUpRight,
                class: "text-green-500",
            };
        } else if (change < 0) {
            return {
                icon: ArrowDownRight,
                class: "text-red-500",
            };
        } else {
            return {
                icon: ChevronRight,
                class: "text-muted-foreground",
            };
        }
    }

    // Define types for array callback parameters to fix linting errors
    interface GrowthModel {
        isActive: boolean;
        name: string;
        description: string;
        inputs: Array<{ name: string; value: number | string; unit?: string }>;
        projections: number[];
    }

    interface PipelineStage {
        name: string;
        count: number;
        value: number;
        conversion: number | null;
    }

    interface ForecastMonth {
        month: string;
        projected: number;
        actual: number | null;
    }

    interface SalesTeamMember {
        name: string;
        role: string;
        deals: number;
        pipeline: number;
        closed: number;
        attainment: number;
        avgDealSize: number;
        winRate: number;
    }

    // Assuming ChannelPerformance is the type for items in channelPerformance array
    interface ChannelPerformance {
        channel: string;
        visitors: number;
        leads: number;
        customers: number;
        spend: number;
        cac: number;
        roi: number;
    }

    const totalVisitors = $derived(
        data.growth.marketing.channelPerformance.reduce(
            (sum: number, c: ChannelPerformance) => sum + c.visitors,
            0,
        ),
    );
    const totalLeads = $derived(
        data.growth.marketing.channelPerformance.reduce(
            (sum: number, c: ChannelPerformance) => sum + c.leads,
            0,
        ),
    );
    const totalCustomers = $derived(
        data.growth.marketing.channelPerformance.reduce(
            (sum: number, c: ChannelPerformance) => sum + c.customers,
            0,
        ),
    );
</script>

<div class="container max-w-7xl py-6 space-y-8">
    <!-- Page Header -->
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-5 duration-500"
    >
        <div>
            <div class="flex items-center gap-3">
                <a
                    href="/dashboard/founder"
                    class="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Button variant="ghost" size="sm" class="gap-1">
                        <ArrowLeft class="h-4 w-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </a>
            </div>
            <h1 class="text-3xl font-bold tracking-tight mt-2">
                Growth & Traction Tools
            </h1>
            <p class="text-muted-foreground mt-1">
                Track growth metrics, optimize marketing, and manage your sales
                pipeline
            </p>
        </div>

        <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" class="gap-2">
                <Clock class="h-4 w-4" />
                <span>Last updated: Today at 9:45 AM</span>
            </Button>

            <Button variant="default" size="sm" class="gap-2">
                <Plus class="h-4 w-4" />
                <span>Create Report</span>
            </Button>
        </div>
    </div>

    <!-- Main Content -->
    <Tabs
        value={activeTab}
        onValueChange={(val) => (activeTab = val)}
        class="space-y-6"
    >
        <TabsList>
            <TabsTrigger value="growth-metrics" class="flex items-center gap-2">
                <Activity class="h-4 w-4" />
                <span>Growth Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" class="flex items-center gap-2">
                <Target class="h-4 w-4" />
                <span>Marketing Performance</span>
            </TabsTrigger>
            <TabsTrigger value="sales" class="flex items-center gap-2">
                <BarChart3 class="h-4 w-4" />
                <span>Sales Pipeline</span>
            </TabsTrigger>
        </TabsList>

        <!-- Growth Metrics Tab -->
        <TabsContent value="growth-metrics" class="space-y-6">
            <!-- North Star Metric -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Target class="h-5 w-5 text-primary" />
                        North Star Metric
                    </Card.Title>
                    <Card.Description
                        >Your key business growth indicator and contributing
                        factors</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Main Metric -->
                        <div class="col-span-1 space-y-4">
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="text-sm text-muted-foreground">
                                    {data.growth.metrics.northStar.name}
                                </div>
                                <div class="flex items-baseline mt-1">
                                    <span class="text-3xl font-bold"
                                        >{formatNumber(
                                            data.growth.metrics.northStar
                                                .current,
                                        )}</span
                                    >
                                    <span class="ml-2 text-sm text-green-500"
                                        >+{data.growth.metrics.northStar
                                            .growth}%</span
                                    >
                                </div>
                                <div class="text-xs text-muted-foreground mt-1">
                                    vs. {formatNumber(
                                        data.growth.metrics.northStar.previous,
                                    )} last period
                                </div>
                            </div>

                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="text-sm text-muted-foreground">
                                    Progress to Goal
                                </div>
                                <div
                                    class="flex justify-between items-baseline mt-1"
                                >
                                    <span class="text-2xl font-bold"
                                        >{data.growth.metrics.northStar
                                            .progressPercentage}%</span
                                    >
                                    <span class="text-sm text-muted-foreground"
                                        >Target: {formatNumber(
                                            data.growth.metrics.northStar
                                                .target,
                                        )}</span
                                    >
                                </div>
                                <Progress
                                    value={data.growth.metrics.northStar
                                        .progressPercentage}
                                    class="mt-2"
                                />
                            </div>

                            <div>
                                <div class="text-sm font-medium mb-1">
                                    Historical Trend
                                </div>
                                <div
                                    class="h-20 bg-muted/50 rounded-lg flex items-end p-2 gap-1"
                                >
                                    {#each data.growth.metrics.northStar.history as value, i}
                                        {@const percentage =
                                            (value /
                                                Math.max(
                                                    ...data.growth.metrics
                                                        .northStar.history,
                                                )) *
                                            100}
                                        <div
                                            class="flex-1 bg-primary rounded-sm"
                                            style:height="{percentage}%"
                                            style:transition="height 0.3s ease-out">
                                                                                    </div>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <!-- Contributing Factors -->
                        <div class="col-span-2 p-4 bg-muted/50 rounded-lg">
                            <div class="text-sm font-medium mb-3">
                                Contributing Factors
                            </div>
                            <div class="space-y-5">
                                {#each data.growth.metrics.northStar.contributingFactors as factor}
                                    <div>
                                        <div
                                            class="flex justify-between items-center"
                                        >
                                            <div class="font-medium">
                                                {factor.name}
                                            </div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    >{formatNumber(
                                                        factor.value,
                                                    )}</span
                                                >
                                                <span
                                                    class={factor.change >= 0
                                                        ? "text-green-500"
                                                        : "text-red-500"}
                                                >
                                                    {factor.change >= 0
                                                        ? "+"
                                                        : ""}{factor.change}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="mt-1.5">
                                            <div
                                                class="h-2 bg-muted rounded-full overflow-hidden"
                                            >
                                                <div
                                                    class="h-full bg-primary rounded-full"
                                                    style:width="{factor.impact}%"
                                                ></div>
                                            </div>
                                            <div
                                                class="flex justify-between text-xs text-muted-foreground mt-1"
                                            >
                                                <span
                                                    >Impact: {factor.impact}%</span
                                                >
                                                <div class="flex items-center">
                                                    <span>Focus area</span>
                                                    {#if factor.impact > 30}
                                                        <span
                                                            class="ml-1 text-primary"
                                                            >●</span
                                                        >
                                                    {:else}
                                                        <span
                                                            class="ml-1 text-muted"
                                                            >○</span
                                                        >
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>

                            <div
                                class="mt-4 pt-4 border-t flex justify-between"
                            >
                                <Button variant="outline" size="sm">
                                    <Settings class="h-3.5 w-3.5 mr-1.5" />
                                    <span>Configure Metrics</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download class="h-3.5 w-3.5 mr-1.5" />
                                    <span>Export Data</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Growth Models & Cohort Retention -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Growth Models -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <LineChart class="h-5 w-5 text-primary" />
                            Growth Models
                        </Card.Title>
                        <Card.Description
                            >Custom growth projections based on key metrics</Card.Description
                        >
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.growth.metrics.growthModels.filter((m: GrowthModel) => m.isActive) as model}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium">{model.name}</div>
                                    <Badge
                                        variant="outline"
                                        class="bg-blue-500/10 text-blue-500"
                                    >
                                        Active
                                    </Badge>
                                </div>
                                <div class="text-sm text-muted-foreground mt-1">
                                    {model.description}
                                </div>

                                <div class="mt-3 grid grid-cols-2 gap-2">
                                    {#each model.inputs as input}
                                        <div class="text-sm">
                                            <span class="text-muted-foreground"
                                                >{input.name}:</span
                                            >
                                            <span class="ml-1 font-medium"
                                                >{input.value}{input.unit}</span
                                            >
                                        </div>
                                    {/each}
                                </div>

                                <div class="mt-3">
                                    <div class="text-sm font-medium mb-1">
                                        Projection ({model.inputs.find(
                                            (i: {
                                                name: string;
                                                value: string | number;
                                            }) => i.name === "Timeframe",
                                        )?.value} months)
                                    </div>
                                    <div
                                        class="h-24 bg-muted rounded-lg flex items-end p-2 gap-1"
                                    >
                                        {#each model.projections as value, i}
                                            {@const percentage =
                                                (value /
                                                    Math.max(
                                                        ...model.projections,
                                                    )) *
                                                100}
                                            <div
                                                class="flex-1 bg-primary/70 rounded-sm"
                                                style:height="{percentage}%"
                                                style:transition="height 0.3s"
                                                style:transition-timing-function="ease-out"
                                                style:transition-delay="0s"
                                                style:transition-property="height"
                                                style:transition-duration="0.3s"
                                            ></div>
                                        {/each}
                                    </div>
                                    <div
                                        class="flex justify-between text-xs text-muted-foreground mt-1"
                                    >
                                        <span>Now</span>
                                        <span
                                            >+{model.inputs.find(
                                                (i: {
                                                    name: string;
                                                    value: string | number;
                                                }) => i.name === "Timeframe",
                                            )?.value} months</span
                                        >
                                    </div>
                                </div>

                                <div
                                    class="mt-3 flex justify-between items-center text-sm"
                                >
                                    <span class="text-muted-foreground">
                                        End value: <span class="font-medium"
                                            >{formatNumber(
                                                model.projections[
                                                    model.projections.length - 1
                                                ],
                                            )}</span
                                        >
                                    </span>
                                    <Button variant="ghost" size="sm">
                                        <Edit3 class="h-3.5 w-3.5 mr-1.5" />
                                        <span>Edit Model</span>
                                    </Button>
                                </div>
                            </div>
                        {/each}

                        <div class="flex justify-between">
                            <Button variant="outline" size="sm">
                                <Plus class="h-3.5 w-3.5 mr-1.5" />
                                <span>New Model</span>
                            </Button>

                            <Button variant="ghost" size="sm">
                                All Models ({data.growth.metrics.growthModels
                                    .length})
                                <ChevronRight class="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Cohort Retention -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <Users class="h-5 w-5 text-primary" />
                            Cohort Retention
                        </Card.Title>
                        <Card.Description
                            >User retention analysis across different time
                            periods</Card.Description
                        >
                    </Card.Header>
                    <Card.Content>
                        <div class="overflow-x-auto">
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Head>Cohort</Table.Head>
                                        {#each data.growth.metrics.retention.retentionStages as stage}
                                            <Table.Head>{stage}</Table.Head>
                                        {/each}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {#each data.growth.metrics.retention.cohorts as cohort}
                                        <Table.Row>
                                            <Table.Cell
                                                class="whitespace-nowrap"
                                            >
                                                <div class="font-medium">
                                                    {cohort.name}
                                                </div>
                                                <div
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    {formatNumber(cohort.size)} users
                                                </div>
                                            </Table.Cell>
                                            {#each cohort.retention as value, i}
                                                <Table.Cell>
                                                    <div
                                                        class="relative w-full px-2"
                                                    >
                                                        <div
                                                            class="absolute inset-0 bg-primary/10 rounded-sm"
                                                            style:width="{value}%"
                                                            style:opacity={(value /
                                                                100) *
                                                                0.8 +
                                                                0.2}
                                                        ></div>
                                                        <span
                                                            class="relative z-10 font-medium"
                                                            >{value}%</span
                                                        >
                                                    </div>
                                                </Table.Cell>
                                            {/each}
                                            {#if cohort.retention.length < data.growth.metrics.retention.retentionStages.length}
                                                {#each Array(data.growth.metrics.retention.retentionStages.length - cohort.retention.length) as _}
                                                    <Table.Cell
                                                        class="text-muted-foreground"
                                                        >—</Table.Cell
                                                    >
                                                {/each}
                                            {/if}
                                        </Table.Row>
                                    {/each}
                                </Table.Body>
                            </Table.Root>
                        </div>

                        <div class="mt-4 text-sm">
                            <div class="flex items-center justify-between">
                                <div class="text-muted-foreground">
                                    Average Week 1 Retention: <span
                                        class="font-medium"
                                        >{(
                                            data.growth.metrics.retention.cohorts.reduce(
                                                (
                                                    acc: number,
                                                    c: { retention: number[] },
                                                ) =>
                                                    acc + (c.retention[1] || 0),
                                                0,
                                            ) /
                                            data.growth.metrics.retention
                                                .cohorts.length
                                        ).toFixed(1)}%</span
                                    >
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Filter class="h-3.5 w-3.5 mr-1.5" />
                                    <span>Filter Cohorts</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Growth Experiments -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Lightbulb class="h-5 w-5 text-primary" />
                        Growth Experiments
                    </Card.Title>
                    <Card.Description
                        >Track and analyze your growth initiatives and
                        experiments</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {#each data.growth.metrics.experiments as experiment}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {experiment.name}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mt-0.5"
                                        >
                                            {formatDate(experiment.startDate)} -
                                            {formatDate(experiment.endDate)}
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        class={getStatusClass(
                                            experiment.status,
                                        )}
                                    >
                                        {experiment.status}
                                    </Badge>
                                </div>

                                <div class="mt-3 p-3 bg-background rounded-md">
                                    <div class="text-sm font-medium">
                                        Hypothesis
                                    </div>
                                    <p class="text-sm mt-1">
                                        {experiment.hypothesis}
                                    </p>
                                </div>

                                <div class="mt-3">
                                    <div class="text-sm font-medium mb-2">
                                        Results
                                    </div>
                                    <div class="space-y-2">
                                        {#each experiment.metrics as metric}
                                            <div
                                                class="grid grid-cols-4 text-sm"
                                            >
                                                <div class="font-medium">
                                                    {metric.name}
                                                </div>
                                                <div>
                                                    {metric.before !== null
                                                        ? metric.before
                                                        : "—"}
                                                </div>
                                                <div>
                                                    {metric.after !== null
                                                        ? metric.after
                                                        : "—"}
                                                </div>
                                                <div
                                                    class={metric.change !==
                                                    null
                                                        ? metric.change >= 0
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                        : "text-muted-foreground"}
                                                >
                                                    {metric.change !== null
                                                        ? `${metric.change >= 0 ? "+" : ""}${metric.change}%`
                                                        : "—"}
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>

                                {#if experiment.conclusion}
                                    <div class="mt-3">
                                        <div class="text-sm font-medium">
                                            Conclusion
                                        </div>
                                        <p class="text-sm mt-1">
                                            {experiment.conclusion}
                                        </p>
                                    </div>

                                    <div class="mt-3">
                                        <div class="text-sm font-medium">
                                            Next Steps
                                        </div>
                                        <p class="text-sm mt-1">
                                            {experiment.nextSteps}
                                        </p>
                                    </div>
                                {/if}

                                <div
                                    class="mt-3 pt-3 border-t flex justify-end"
                                >
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink
                                            class="h-3.5 w-3.5 mr-1.5"
                                        />
                                        <span>View Details</span>
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="mt-4 flex justify-center">
                        <Button variant="outline">
                            <Plus class="h-4 w-4 mr-2" />
                            <span>Create New Experiment</span>
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </TabsContent>

        <!-- Marketing Performance Tab -->
        <TabsContent value="marketing" class="space-y-6">
            <!-- Channel Attribution & Performance -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <BarChart3 class="h-5 w-5 text-primary" />
                        Channel Attribution
                    </Card.Title>
                    <Card.Description
                        >Performance metrics across marketing channels</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="overflow-x-auto">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Channel</Table.Head>
                                    <Table.Head>Spend</Table.Head>
                                    <Table.Head>Visitors</Table.Head>
                                    <Table.Head>Leads</Table.Head>
                                    <Table.Head>Customers</Table.Head>
                                    <Table.Head>CAC</Table.Head>
                                    <Table.Head>ROI</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each data.growth.marketing.channelPerformance as channel}
                                    <Table.Row>
                                        <Table.Cell class="font-medium"
                                            >{channel.channel}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{formatCurrency(
                                                channel.spend,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{formatNumber(
                                                channel.visitors,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{formatNumber(
                                                channel.leads,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{formatNumber(
                                                channel.customers,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            class={channel.cac < 80
                                                ? "text-green-500"
                                                : channel.cac > 120
                                                  ? "text-red-500"
                                                  : ""}
                                        >
                                            {formatCurrency(channel.cac)}
                                        </Table.Cell>
                                        <Table.Cell
                                            class={channel.roi > 300
                                                ? "text-green-500"
                                                : channel.roi < 200
                                                  ? "text-amber-500"
                                                  : ""}
                                        >
                                            {channel.roi}%
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>

                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <!-- Channel Distribution Chart -->
                        <div class="p-4 bg-muted/50 rounded-lg">
                            <div class="text-sm font-medium mb-3">
                                Budget Distribution
                            </div>
                            <div
                                class="relative h-44 flex items-center justify-center"
                            >
                                <!-- Simplified pie chart visualization -->
                                <div class="grid grid-cols-2 gap-2 w-full">
                                    {#each data.growth.marketing.channelPerformance as channel}
                                        {@const percentage =
                                            (channel.spend /
                                                data.growth.marketing.channelPerformance.reduce(
                                                    (
                                                        sum: number,
                                                        c: ChannelPerformance,
                                                    ) => sum + c.spend,
                                                    0,
                                                )) *
                                            100}
                                        <div class="flex items-center">
                                            <div
                                                class="w-3 h-3 rounded-full bg-primary/80"
                                                style:opacity={0.4 +
                                                    (percentage / 100) * 0.6}
                                            ></div>
                                            <div class="ml-2 text-xs">
                                                <div
                                                    class="truncate max-w-[70px]"
                                                >
                                                    {channel.channel}
                                                </div>
                                                <div
                                                    class="text-muted-foreground"
                                                >
                                                    {percentage.toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <!-- Key Metrics -->
                        <div class="p-4 bg-muted/50 rounded-lg">
                            <div class="text-sm font-medium mb-3">
                                Key Metrics
                            </div>
                            <div class="space-y-3">
                                <div>
                                    <div class="text-xs text-muted-foreground">
                                        Total Marketing Spend
                                    </div>
                                    <div class="text-lg font-semibold">
                                        {formatCurrency(
                                            data.growth.marketing.channelPerformance.reduce(
                                                (
                                                    sum: number,
                                                    c: ChannelPerformance,
                                                ) => sum + c.spend,
                                                0,
                                            ),
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs text-muted-foreground">
                                        Average CAC
                                    </div>
                                    <div class="text-lg font-semibold">
                                        {formatCurrency(
                                            data.growth.marketing.channelPerformance.reduce(
                                                (sum, c) => sum + c.cac,
                                                0,
                                            ) /
                                                data.growth.marketing
                                                    .channelPerformance.length,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs text-muted-foreground">
                                        Average ROI
                                    </div>
                                    <div class="text-lg font-semibold">
                                        {(
                                            data.growth.marketing.channelPerformance.reduce(
                                                (sum, c) => sum + c.roi,
                                                0,
                                            ) /
                                            data.growth.marketing
                                                .channelPerformance.length
                                        ).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Conversion Metrics -->
                        <div class="p-4 bg-muted/50 rounded-lg">
                            <div class="text-sm font-medium mb-3">
                                Conversion Rates
                            </div>
                            <div class="space-y-3">
                                <div>
                                    <div class="flex justify-between text-xs">
                                        <span>Visitor to Lead</span>
                                        <span
                                            >{(
                                                (totalLeads / totalVisitors) *
                                                100
                                            ).toFixed(1)}%</span
                                        >
                                    </div>
                                    <Progress
                                        value={(totalLeads / totalVisitors) *
                                            100}
                                        class="mt-1 h-1.5"
                                    />
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs">
                                        <span>Lead to Customer</span>
                                        <span
                                            >{(
                                                (totalCustomers / totalLeads) *
                                                100
                                            ).toFixed(1)}%</span
                                        >
                                    </div>
                                    <Progress
                                        value={(totalCustomers / totalLeads) *
                                            100}
                                        class="mt-1 h-1.5"
                                    />
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs">
                                        <span>Visitor to Customer</span>
                                        <span
                                            >{(
                                                (totalCustomers /
                                                    totalVisitors) *
                                                100
                                            ).toFixed(1)}%</span
                                        >
                                    </div>
                                    <Progress
                                        value={(totalCustomers /
                                            totalVisitors) *
                                            100}
                                        class="mt-1 h-1.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Campaign Performance -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Campaign Tracking -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <Target class="h-5 w-5 text-primary" />
                            Campaign Performance
                        </Card.Title>
                        <Card.Description
                            >Track performance of marketing campaigns</Card.Description
                        >
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.growth.marketing.campaigns as campaign}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium">
                                        {campaign.name}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        class={getStatusClass(campaign.status)}
                                    >
                                        {campaign.status}
                                    </Badge>
                                </div>
                                <div class="text-sm text-muted-foreground mt-1">
                                    {formatDate(campaign.startDate)} - {formatDate(
                                        campaign.endDate,
                                    )}
                                </div>

                                <div class="flex justify-between text-sm mt-3">
                                    <div>
                                        <div class="text-muted-foreground">
                                            Budget
                                        </div>
                                        <div>
                                            {formatCurrency(campaign.budget)}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Spent
                                        </div>
                                        <div>
                                            {formatCurrency(campaign.spent)}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Remaining
                                        </div>
                                        <div
                                            class={campaign.budget -
                                                campaign.spent >
                                            0
                                                ? ""
                                                : "text-red-500"}
                                        >
                                            {formatCurrency(
                                                campaign.budget -
                                                    campaign.spent,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-3">
                                    <div
                                        class="text-xs text-muted-foreground mb-1"
                                    >
                                        Budget Utilization
                                    </div>
                                    <Progress
                                        value={(campaign.spent /
                                            campaign.budget) *
                                            100}
                                        class="h-2"
                                    />
                                </div>

                                <div
                                    class="mt-3 grid grid-cols-2 gap-2 text-sm"
                                >
                                    <div>
                                        <div class="text-muted-foreground">
                                            Impressions
                                        </div>
                                        <div>
                                            {formatNumber(
                                                campaign.performance
                                                    .impressions,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Clicks
                                        </div>
                                        <div>
                                            {formatNumber(
                                                campaign.performance.clicks,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Leads
                                        </div>
                                        <div>
                                            {formatNumber(
                                                campaign.performance.leads,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Customers
                                        </div>
                                        <div>
                                            {formatNumber(
                                                campaign.performance.customers,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="mt-3 pt-3 border-t flex justify-between items-center"
                                >
                                    <div>
                                        <div
                                            class="text-xs text-muted-foreground"
                                        >
                                            ROI
                                        </div>
                                        <div class="font-medium">
                                            {(
                                                (campaign.performance.revenue /
                                                    campaign.spent) *
                                                100
                                            ).toFixed(0)}%
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <Button variant="ghost" size="sm">
                                            <Edit3 class="h-3.5 w-3.5 mr-1.5" />
                                            <span>Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <ExternalLink
                                                class="h-3.5 w-3.5 mr-1.5"
                                            />
                                            <span>Details</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        {/each}

                        <div class="flex justify-center">
                            <Button variant="outline" size="sm">
                                <Plus class="h-3.5 w-3.5 mr-1.5" />
                                <span>New Campaign</span>
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Content Performance -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <FileText class="h-5 w-5 text-primary" />
                            Content Performance
                        </Card.Title>
                        <Card.Description
                            >Engagement and conversion metrics for marketing
                            content</Card.Description
                        >
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.growth.marketing.contentPerformance as content}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {content.title}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mt-0.5"
                                        >
                                            {content.type} • Published {formatDate(
                                                content.published,
                                            )}
                                        </div>
                                    </div>
                                    <Badge variant="outline">
                                        {content.type}
                                    </Badge>
                                </div>

                                <div
                                    class="mt-3 grid grid-cols-4 gap-2 text-sm"
                                >
                                    <div>
                                        <div class="text-muted-foreground">
                                            Views
                                        </div>
                                        <div>{formatNumber(content.views)}</div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Engagement
                                        </div>
                                        <div>{content.engagement}%</div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Conversion
                                        </div>
                                        <div>{content.conversionRate}%</div>
                                    </div>
                                    <div>
                                        <div class="text-muted-foreground">
                                            Leads
                                        </div>
                                        <div>{formatNumber(content.leads)}</div>
                                    </div>
                                </div>

                                <div class="mt-3">
                                    <div
                                        class="text-xs text-muted-foreground mb-1"
                                    >
                                        Engagement Score
                                    </div>
                                    <div
                                        class="h-2 bg-muted rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full bg-primary rounded-full"
                                            style:width="{Math.min(
                                                content.engagement * 10,
                                                100,
                                            )}%"
                                        ></div>
                                    </div>
                                </div>

                                <div
                                    class="mt-3 pt-3 border-t flex justify-end"
                                >
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink
                                            class="h-3.5 w-3.5 mr-1.5"
                                        />
                                        <span>View Content</span>
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Optimization Suggestions -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Lightbulb class="h-5 w-5 text-primary" />
                        Marketing Optimization Suggestions
                    </Card.Title>
                    <Card.Description
                        >AI-powered recommendations to improve marketing
                        performance</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {#each data.growth.marketing.optimizationSuggestions as suggestion}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 rounded-full bg-primary/10">
                                        <Lightbulb
                                            class="h-4 w-4 text-primary"
                                        />
                                    </div>
                                    <div>
                                        <div class="font-medium">
                                            {suggestion.title}
                                        </div>
                                        <p class="text-sm mt-1">
                                            {suggestion.description}
                                        </p>

                                        <div
                                            class="mt-3 grid grid-cols-2 gap-2"
                                        >
                                            <div>
                                                <div
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    Potential Impact
                                                </div>
                                                <div class="text-sm mt-0.5">
                                                    {suggestion.potential}
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    class="text-xs text-muted-foreground"
                                                >
                                                    Difficulty
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    class={getPriorityClass(
                                                        suggestion.difficulty,
                                                    )}
                                                >
                                                    {suggestion.difficulty}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div class="mt-3 flex justify-end">
                                            <Button variant="ghost" size="sm">
                                                <Edit3
                                                    class="h-3.5 w-3.5 mr-1.5"
                                                />
                                                <span>Implement</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>
        </TabsContent>

        <!-- Sales Pipeline Tab -->
        <TabsContent value="sales" class="space-y-6">
            <!-- Sales Funnel Visualization -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <LineChart class="h-5 w-5 text-primary" />
                        Sales Funnel
                    </Card.Title>
                    <Card.Description
                        >Visualization of your sales pipeline with conversion
                        metrics</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Funnel Visualization -->
                        <div class="col-span-2 space-y-2">
                            {#each data.growth.sales.pipeline.stages as stage, index}
                                {@const maxValue = Math.max(
                                    ...data.growth.sales.pipeline.stages.map(
                                        (s: PipelineStage) => s.value,
                                    ),
                                )}
                                {@const widthPercentage =
                                    (stage.value / maxValue) * 100}
                                <div class="space-y-1">
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <div class="font-medium">
                                            {stage.name}
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <Badge variant="outline">
                                                {stage.count} deals
                                            </Badge>
                                            <span class="font-medium"
                                                >{formatCurrency(
                                                    stage.value,
                                                    true,
                                                )}</span
                                            >
                                        </div>
                                    </div>
                                    <div
                                        class="h-8 bg-muted/50 rounded-md overflow-hidden relative"
                                    >
                                        <div
                                            class="absolute top-0 left-0 h-full bg-primary/70 rounded-md"
                                            style:width="{widthPercentage}%"
                                            style:opacity={0.5 +
                                                (index /
                                                    data.growth.sales.pipeline
                                                        .stages.length) *
                                                    0.5}
                                        ></div>
                                    </div>

                                    {#if index < data.growth.sales.pipeline.stages.length - 1 && stage.conversion !== null}
                                        <div
                                            class="flex justify-between items-center text-sm text-muted-foreground pl-4"
                                        >
                                            <div class="flex items-center">
                                                <TrendingUp
                                                    class="h-3.5 w-3.5 mr-1"
                                                />
                                                <span>
                                                    {stage.conversion}%
                                                    conversion to {data.growth
                                                        .sales.pipeline.stages[
                                                        index + 1
                                                    ].name}
                                                </span>
                                            </div>
                                            <div>
                                                <ChevronRight class="h-4 w-4" />
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>

                        <!-- Pipeline Metrics -->
                        <div class="space-y-4">
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="text-sm text-muted-foreground mb-1">
                                    Pipeline Metrics
                                </div>
                                <div class="space-y-3">
                                    <div>
                                        <div
                                            class="text-xs text-muted-foreground"
                                        >
                                            Total Pipeline Value
                                        </div>
                                        <div class="text-lg font-semibold">
                                            {formatCurrency(
                                                data.growth.sales.pipeline.stages.reduce(
                                                    (
                                                        sum: number,
                                                        stage: PipelineStage,
                                                    ) => sum + stage.value,
                                                    0,
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            class="text-xs text-muted-foreground"
                                        >
                                            Average Deal Size
                                        </div>
                                        <div class="text-lg font-semibold">
                                            {formatCurrency(
                                                data.growth.sales.pipeline
                                                    .avgDealSize,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            class="text-xs text-muted-foreground"
                                        >
                                            Win Rate
                                        </div>
                                        <div class="text-lg font-semibold">
                                            {data.growth.sales.pipeline
                                                .winRate}%
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            class="text-xs text-muted-foreground"
                                        >
                                            Sales Cycle
                                        </div>
                                        <div class="text-lg font-semibold">
                                            {data.growth.sales.pipeline
                                                .velocityDays} days
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <Button variant="outline" size="sm">
                                    <Filter class="h-3.5 w-3.5 mr-1.5" />
                                    <span>Filter Pipeline</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Deal Tracking & Forecast -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Deal Tracking -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <DollarSign class="h-5 w-5 text-primary" />
                            Deal Tracking
                        </Card.Title>
                        <Card.Description
                            >Monitor key deals in your sales pipeline</Card.Description
                        >
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.growth.sales.deals as deal}
                            <div class="p-4 bg-muted/50 rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {deal.company}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mt-0.5"
                                        >
                                            Owner: {deal.owner}
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="font-medium">
                                            {formatCurrency(deal.value)}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mt-0.5"
                                        >
                                            Close: {formatDate(deal.closeDate)}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="mt-3 flex items-center justify-between"
                                >
                                    <Badge variant="outline">
                                        {deal.stage}
                                    </Badge>
                                    <div class="text-sm">
                                        <span class="text-muted-foreground"
                                            >Probability:</span
                                        >
                                        <span class="ml-1 font-medium"
                                            >{deal.probability}%</span
                                        >
                                    </div>
                                </div>

                                <div class="mt-2">
                                    <div
                                        class="text-xs text-muted-foreground mb-1"
                                    >
                                        Expected Value: {formatCurrency(
                                            deal.expectedValue,
                                        )}
                                    </div>
                                    <Progress
                                        value={deal.probability}
                                        class="h-1.5"
                                    />
                                </div>

                                <div class="mt-3 pt-3 border-t">
                                    <div class="text-sm">
                                        <span class="text-muted-foreground"
                                            >Next Step:</span
                                        >
                                        <span class="ml-1">{deal.nextStep}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        {/each}

                        <div class="flex justify-center">
                            <Button variant="outline" size="sm">
                                <Plus class="h-3.5 w-3.5 mr-1.5" />
                                <span>Add Deal</span>
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>

                <!-- Sales Forecast -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <TrendingUp class="h-5 w-5 text-primary" />
                            Sales Forecast
                        </Card.Title>
                        <Card.Description
                            >Projected revenue and performance against targets</Card.Description
                        >
                    </Card.Header>
                    <Card.Content class="space-y-6">
                        <!-- This Quarter -->
                        <div class="p-4 bg-muted/50 rounded-lg">
                            <div class="flex justify-between items-center">
                                <div class="font-medium">This Quarter</div>
                                <Badge
                                    variant="outline"
                                    class={data.growth.sales.forecast
                                        .thisQuarter.attainment >= 100
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-amber-500/10 text-amber-500"}
                                >
                                    {data.growth.sales.forecast.thisQuarter
                                        .attainment}% of target
                                </Badge>
                            </div>

                            <div class="mt-3 grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <div class="text-muted-foreground">
                                        Target
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .thisQuarter.target,
                                            true,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-muted-foreground">
                                        Closed
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .thisQuarter.closed,
                                            true,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-muted-foreground">
                                        Projected
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .thisQuarter.projected,
                                            true,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-3">
                                <div class="text-xs text-muted-foreground mb-1">
                                    Progress to Target
                                </div>
                                <Progress
                                    value={(data.growth.sales.forecast
                                        .thisQuarter.closed /
                                        data.growth.sales.forecast.thisQuarter
                                            .target) *
                                        100}
                                    class="h-2"
                                />
                            </div>
                        </div>

                        <!-- Next Quarter -->
                        <div class="p-4 bg-muted/50 rounded-lg">
                            <div class="flex justify-between items-center">
                                <div class="font-medium">Next Quarter</div>
                                <Badge
                                    variant="outline"
                                    class={data.growth.sales.forecast
                                        .nextQuarter.attainment >= 100
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-amber-500/10 text-amber-500"}
                                >
                                    {data.growth.sales.forecast.nextQuarter
                                        .attainment}% of target
                                </Badge>
                            </div>

                            <div class="mt-3 grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <div class="text-muted-foreground">
                                        Target
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .nextQuarter.target,
                                            true,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-muted-foreground">
                                        Pipeline
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .nextQuarter.pipeline,
                                            true,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-muted-foreground">
                                        Weighted
                                    </div>
                                    <div class="font-medium">
                                        {formatCurrency(
                                            data.growth.sales.forecast
                                                .nextQuarter.weighted,
                                            true,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-3">
                                <div class="text-xs text-muted-foreground mb-1">
                                    Weighted Pipeline Coverage
                                </div>
                                <Progress
                                    value={(data.growth.sales.forecast
                                        .nextQuarter.weighted /
                                        data.growth.sales.forecast.nextQuarter
                                            .target) *
                                        100}
                                    class="h-2"
                                />
                            </div>
                        </div>

                        <!-- Monthly Trend -->
                        <div>
                            <div class="text-sm font-medium mb-2">
                                Monthly Revenue Forecast
                            </div>
                            <div
                                class="h-36 bg-muted/50 rounded-lg p-4 flex items-end gap-2"
                            >
                                {#each data.growth.sales.forecast.byMonth as month, i}
                                    {@const maxValue = Math.max(
                                        ...data.growth.sales.forecast.byMonth.map(
                                            (m) => m.projected,
                                        ),
                                    )}
                                    {@const projPercentage =
                                        (month.projected / maxValue) * 100}
                                    {@const actPercentage = month.actual
                                        ? (month.actual / maxValue) * 100
                                        : 0}

                                    <div
                                        class="flex-1 flex flex-col items-center gap-1"
                                    >
                                        <div
                                            class="w-full flex justify-center relative"
                                        >
                                            <!-- Projected bar -->
                                            <div
                                                class="w-5 bg-primary/40 rounded-sm absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                                style:height="{projPercentage}%"
                                            ></div>

                                            <!-- Actual bar (if exists) -->
                                            {#if month.actual}
                                                <div
                                                    class="w-5 bg-primary rounded-sm absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
                                                    style:height="{actPercentage}%"
                                                ></div>
                                            {/if}
                                        </div>
                                        <div
                                            class="text-xs text-muted-foreground mt-1"
                                        >
                                            {month.month.split(" ")[0]}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div
                                class="flex justify-between text-xs text-muted-foreground mt-1"
                            >
                                <div>
                                    <span
                                        class="inline-block w-3 h-3 bg-primary/40 rounded-sm align-middle"
                                    ></span>
                                    <span class="ml-1">Projected</span>
                                </div>
                                <div>
                                    <span
                                        class="inline-block w-3 h-3 bg-primary rounded-sm align-middle"
                                    ></span>
                                    <span class="ml-1">Actual</span>
                                </div>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Team Performance -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Users class="h-5 w-5 text-primary" />
                        Sales Team Performance
                    </Card.Title>
                    <Card.Description
                        >Performance metrics for your sales representatives</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="overflow-x-auto">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Representative</Table.Head>
                                    <Table.Head>Deals</Table.Head>
                                    <Table.Head>Pipeline</Table.Head>
                                    <Table.Head>Closed</Table.Head>
                                    <Table.Head>Attainment</Table.Head>
                                    <Table.Head>Avg Deal</Table.Head>
                                    <Table.Head>Win Rate</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each data.growth.sales.teamPerformance as rep}
                                    <Table.Row>
                                        <Table.Cell>
                                            <div class="font-medium">
                                                {rep.name}
                                            </div>
                                            <div
                                                class="text-xs text-muted-foreground"
                                            >
                                                {rep.role}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>{rep.deals}</Table.Cell>
                                        <Table.Cell
                                            >{formatCurrency(
                                                rep.pipeline,
                                                true,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{formatCurrency(
                                                rep.closed,
                                                true,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell
                                            class={rep.attainment >= 100
                                                ? "text-green-500"
                                                : rep.attainment >= 80
                                                  ? "text-amber-500"
                                                  : "text-red-500"}
                                        >
                                            {rep.attainment}%
                                        </Table.Cell>
                                        <Table.Cell
                                            >{formatCurrency(
                                                rep.avgDealSize,
                                            )}</Table.Cell
                                        >
                                        <Table.Cell>{rep.winRate}%</Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>

                    <div class="mt-4 flex justify-between">
                        <div class="text-sm">
                            <span class="text-muted-foreground"
                                >Team Average Attainment:</span
                            >
                            <span class="ml-1 font-medium">
                                {(
                                    data.growth.sales.teamPerformance.reduce(
                                        (sum, rep) => sum + rep.attainment,
                                        0,
                                    ) / data.growth.sales.teamPerformance.length
                                ).toFixed(0)}%
                            </span>
                        </div>

                        <Button variant="outline" size="sm">
                            <Download class="h-3.5 w-3.5 mr-1.5" />
                            <span>Export Performance Data</span>
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </TabsContent>
    </Tabs>
</div>
