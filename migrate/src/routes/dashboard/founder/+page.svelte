<script lang="ts">
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Badge } from "$lib/components/ui/badge";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import TrendingDown from "@lucide/svelte/icons/trending-down";
    import Users from "@lucide/svelte/icons/users";
    import Calendar from "@lucide/svelte/icons/calendar";
    import Wallet from "@lucide/svelte/icons/wallet";
    import ClipboardCheck from "@lucide/svelte/icons/clipboard-check";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import FileText from "@lucide/svelte/icons/file-text";
    import Edit3 from "@lucide/svelte/icons/edit-3";
    import MailOpen from "@lucide/svelte/icons/mail-open";
    import DollarSign from "@lucide/svelte/icons/dollar-sign";
    import CircleDollarSign from "@lucide/svelte/icons/circle-dollar-sign";
    import BarChart from "@lucide/svelte/icons/bar-chart";
    import LineChart from "@lucide/svelte/icons/line-chart";
    import Bell from "@lucide/svelte/icons/bell";
    import Clock from "@lucide/svelte/icons/clock";
    import ArrowRight from "@lucide/svelte/icons/arrow-right";
    import Target from "@lucide/svelte/icons/target";
    import Settings from "@lucide/svelte/icons/settings";
    import AlertCircle from "@lucide/svelte/icons/alert-circle";
    import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
    import Info from "@lucide/svelte/icons/info";
    import Rocket from "@lucide/svelte/icons/rocket";
    import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
    import Star from "@lucide/svelte/icons/star";
    import Sparkles from "@lucide/svelte/icons/sparkles";

    // Dashboard data (would normally come from the server via a load function)
    const dashboardData = {
        founder: {
            name: "Alex Johnson",
            avatar: "/images/avatar.jpg",
            company: "NexTech Solutions",
            lastLogin: "Today at 9:30 AM",
            recentAchievement: "Completed pitch deck",
        },
        fundraising: {
            current: 2500000,
            goal: 5000000,
            investors: 12,
            percentComplete: 50,
            recentInvestments: [
                { name: "Tech Ventures", amount: 500000, date: "2023-10-15" },
                { name: "Angel Group B", amount: 250000, date: "2023-10-01" },
                { name: "SV Capital", amount: 750000, date: "2023-09-20" },
            ],
            nextMilestone: { name: "Series A Close", target: "2023-12-15" },
        },
        metrics: {
            monthlyRevenue: {
                value: 45200,
                percentChange: 12,
                changeText: "+$5.2K from last month",
                history: [32000, 35000, 34000, 38000, 40000, 45200],
            },
            activeUsers: {
                value: 2350,
                percentChange: 18,
                changeText: "+350 new users this month",
                history: [1200, 1500, 1800, 1950, 2100, 2350],
            },
            investorInterest: {
                value: 24,
                percentChange: 8,
                changeText: "Profile views this week",
                history: [10, 14, 18, 16, 22, 24],
            },
            runway: {
                value: 14,
                unit: "months",
                detail: "At current burn rate",
                history: [18, 17, 16, 15, 14.5, 14],
            },
            customerAcquisition: {
                value: 850,
                cost: 42,
                changePercent: -5,
                detail: "Cost per acquisition down 5%",
            },
            churnRate: {
                value: 3.2,
                unit: "%",
                changePercent: -0.8,
                detail: "Improved by 0.8% vs last month",
            },
        },
        dueDisgience: {
            documentsUploaded: 15,
            totalDocuments: 20,
            nextDue: "Financial Projections",
            dueDate: "2023-10-30",
        },
        investorRelations: {
            activeConversations: 8,
            pendingResponses: 3,
            meetings: {
                scheduled: 4,
                next: {
                    investor: "VC Partners",
                    date: "Oct 28, 2023",
                    time: "11:00 AM",
                },
            },
            potentialInvestors: [
                { name: "Sequoia Capital", status: "Interested", level: 4 },
                { name: "Y Combinator", status: "Evaluating", level: 3 },
                {
                    name: "Andreessen Horowitz",
                    status: "First Contact",
                    level: 2,
                },
            ],
        },
        recentActivity: [
            {
                type: "investment_interest",
                source: "Tech Ventures Capital",
                timeAgo: "10 minutes ago",
                priority: "high",
            },
            {
                type: "document_review",
                source: "SV Angel",
                timeAgo: "2 hours ago",
                priority: "medium",
            },
            {
                type: "message",
                source: "Jane Smith (Investor)",
                timeAgo: "Yesterday",
                priority: "medium",
            },
            {
                type: "milestone",
                source: "1000 users reached",
                timeAgo: "3 days ago",
                priority: "low",
            },
        ],
        tasks: [
            {
                id: 1,
                title: "Update financial projections",
                dueDate: "2023-10-28",
                completed: false,
                priority: "high",
            },
            {
                id: 2,
                title: "Prepare for investor meeting",
                dueDate: "2023-10-30",
                completed: false,
                priority: "high",
            },
            {
                id: 3,
                title: "Review legal documents",
                dueDate: "2023-11-05",
                completed: false,
                priority: "medium",
            },
            {
                id: 4,
                title: "Update pitch deck",
                dueDate: "2023-10-20",
                completed: true,
                priority: "medium",
            },
        ],
        insights: [
            "Your active user growth is outperforming 80% of similar startups",
            "Consider increasing your fundraising goal based on current investor interest",
            "Your runway should be extended to at least 18 months to attract Series A investors",
        ],
    };

    // State variables
    let activeTab = $state("overview");
    let showAllMetrics = $state(false);
    let isLoading = $state(true);
    let chartData = $state<any>(null);

    // Format currency for display
    function formatCurrency(amount: number, abbreviate = false): string {
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

    // Format date to "Month Day, Year" format
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    }

    // Format date to relative time (e.g., "2 days ago")
    function getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return formatDate(dateString);
    }

    // Get priority badge class based on priority level
    function getPriorityClass(priority: string): string {
        switch (priority) {
            case "high":
                return "bg-red-500/10 text-red-500 dark:bg-red-500/20";
            case "medium":
                return "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20";
            case "low":
                return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
        }
    }

    // Simulate loading the chart data
    onMount(() => {
        // Simulate an API call
        setTimeout(() => {
            chartData = {
                revenue: dashboardData.metrics.monthlyRevenue.history,
                users: dashboardData.metrics.activeUsers.history,
                interest: dashboardData.metrics.investorInterest.history,
                labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            };

            isLoading = false;
        }, 800);
    });

    // Generate sparkline SVG path from history data
    function generateSparkline(
        data: number[],
        height: number = 30,
        width: number = 100,
    ): string {
        if (!data || data.length < 2) return "";

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        // Scale values to fit the height
        const scaledValues = data.map(
            (val) => height - ((val - min) / range) * height,
        );

        // Calculate x increment
        const xIncrement = width / (data.length - 1);

        // Generate path
        let path = `M0,${scaledValues[0]}`;
        scaledValues.forEach((val, i) => {
            if (i > 0) {
                path += ` L${i * xIncrement},${val}`;
            }
        });

        return path;
    }

    // Get color based on trend (positive/negative)
    function getTrendColor(value: number): string {
        return value >= 0 ? "text-green-500" : "text-red-500";
    }

    // Get icon based on trend
    function getTrendIcon(value: number) {
        return value >= 0 ? TrendingUp : TrendingDown;
    }

    // Count incomplete high priority tasks
    let incompletePriorityTasks = $derived(
        dashboardData.tasks.filter((t) => !t.completed && t.priority === "high")
            .length,
    );
</script>

<div class="container max-w-7xl py-6 space-y-8">
    <!-- Dashboard Header with Welcome Message -->
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-5 duration-500"
    >
        <div>
            <h1 class="text-3xl font-bold tracking-tight">
                Welcome back, {dashboardData.founder.name}
            </h1>
            <p class="text-muted-foreground mt-1 flex items-center gap-2">
                <Clock class="h-4 w-4" />
                <span>Last login: {dashboardData.founder.lastLogin}</span>

                {#if dashboardData.founder.recentAchievement}
                    <Badge
                        variant="secondary"
                        class="ml-2 bg-green-500/10 text-green-500 dark:bg-green-500/20"
                    >
                        <CheckCircle2 class="h-3 w-3 mr-1" />
                        {dashboardData.founder.recentAchievement}
                    </Badge>
                {/if}
            </p>
        </div>

        <div class="flex items-center gap-3">
            {#if incompletePriorityTasks > 0}
                <Badge
                    variant="outline"
                    class="bg-red-500/10 text-red-500 dark:bg-red-500/20 flex items-center"
                >
                    <AlertCircle class="h-3.5 w-3.5 mr-1.5" />
                    {incompletePriorityTasks} high priority tasks
                </Badge>
            {/if}

            <Button variant="outline" size="sm" class="gap-2">
                <Bell class="h-4 w-4" />
                <span>Notifications</span>
                {#if dashboardData.recentActivity.length > 0}
                    <Badge
                        class="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                        >{dashboardData.recentActivity.length}</Badge
                    >
                {/if}
            </Button>

            <Button variant="outline" size="sm" class="gap-2">
                <Settings class="h-4 w-4" />
                <span>Settings</span>
            </Button>
        </div>
    </div>

    <!-- Tabs Navigation -->
    <Tabs.Root
        value={activeTab}
        onValueChange={(val) => (activeTab = val)}
        class="mt-8 animate-in fade-in-50 duration-700 delay-200"
    >
        <Tabs.List class="bg-background border-b mb-6">
            <Tabs.Trigger
                value="overview"
                class="text-sm data-[state=active]:border-primary data-[state=active]:border-b-2"
            >
                Overview
            </Tabs.Trigger>
            <Tabs.Trigger
                value="fundraising"
                class="text-sm data-[state=active]:border-primary data-[state=active]:border-b-2"
            >
                Fundraising
            </Tabs.Trigger>
            <Tabs.Trigger
                value="metrics"
                class="text-sm data-[state=active]:border-primary data-[state=active]:border-b-2"
            >
                Metrics
            </Tabs.Trigger>
            <Tabs.Trigger
                value="investors"
                class="text-sm data-[state=active]:border-primary data-[state=active]:border-b-2"
            >
                Investors
            </Tabs.Trigger>
            <Tabs.Trigger
                value="tasks"
                class="text-sm data-[state=active]:border-primary data-[state=active]:border-b-2"
            >
                Tasks
            </Tabs.Trigger>
        </Tabs.List>

        <!-- Overview Tab -->
        <Tabs.Content
            value="overview"
            class="space-y-8 animate-in slide-in-from-bottom-5 duration-500"
        >
            <!-- Fundraising Progress Card (Highlight) -->
            <div
                class="bg-black/90 rounded-lg p-6 text-white border border-white/10 shadow-xl overflow-hidden relative"
            >
                <!-- Glowing gradient background effect -->
                <div
                    class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-50"
                ></div>

                <div class="relative">
                    <div
                        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-5"
                    >
                        <div>
                            <h2
                                class="text-xl font-bold flex items-center gap-2"
                            >
                                <Rocket class="h-5 w-5 text-blue-400" />
                                Fundraising Progress
                            </h2>
                            <p class="text-white/70 mt-1">
                                Track your fundraising journey
                            </p>
                        </div>
                        <div class="text-right md:mt-0 mt-3">
                            <div class="text-3xl font-bold">
                                {formatCurrency(
                                    dashboardData.fundraising.current,
                                    true,
                                )}
                            </div>
                            <p
                                class="text-white/70 flex items-center gap-1 justify-end"
                            >
                                <Target class="h-4 w-4 text-blue-400" />
                                <span
                                    >of {formatCurrency(
                                        dashboardData.fundraising.goal,
                                        true,
                                    )} goal</span
                                >
                            </p>
                        </div>
                    </div>

                    <div
                        class="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3 backdrop-blur-sm"
                    >
                        <div
                            class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                            style:width="{dashboardData.fundraising
                                .percentComplete}%"
                        >
                            <div
                                class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiPjxyZWN0IGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPjwvc3ZnPg==')]"
                            ></div>
                        </div>
                        <!-- Animated dot following progress -->
                        <div
                            class="absolute -top-1.5 h-6 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transform-gpu transition-all duration-1000"
                            style:left="calc({dashboardData.fundraising
                                .percentComplete}% - 12px)"
                        ></div>
                    </div>

                    <div class="flex flex-wrap justify-between mt-4 gap-2">
                        <div
                            class="text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm"
                        >
                            <span class="text-white/70 mr-1">Investors:</span>
                            <span class="font-semibold"
                                >{dashboardData.fundraising.investors}</span
                            >
                        </div>
                        <div
                            class="text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm"
                        >
                            <span class="text-white/70 mr-1">Progress:</span>
                            <span class="font-semibold"
                                >{dashboardData.fundraising
                                    .percentComplete}%</span
                            >
                        </div>
                        <div
                            class="text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm"
                        >
                            <span class="text-white/70 mr-1"
                                >Next milestone:</span
                            >
                            <span class="font-semibold"
                                >{dashboardData.fundraising.nextMilestone
                                    .name}</span
                            >
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <Button
                            variant="default"
                            size="sm"
                            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
                        >
                            <ArrowRight class="mr-2 h-4 w-4" />
                            View Fundraising Details
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Key Metrics Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Monthly Revenue Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-5 h-full border border-white/10"
                    >
                        <h3
                            class="font-medium text-white/70 flex items-center gap-2"
                        >
                            <DollarSign class="h-4 w-4 text-green-400" />
                            Monthly Revenue
                        </h3>
                        <div class="flex flex-col gap-1 mt-3">
                            <div class="flex items-center gap-2">
                                <span class="text-3xl font-bold"
                                    >{formatCurrency(
                                        dashboardData.metrics.monthlyRevenue
                                            .value,
                                        true,
                                    )}</span
                                >
                                <span
                                    class="flex items-center text-sm font-medium text-green-400"
                                >
                                    <TrendingUp class="inline h-4 w-4 mr-1" />
                                    {dashboardData.metrics.monthlyRevenue
                                        .percentChange}%
                                </span>
                            </div>
                            <p class="text-sm text-white/70">
                                {dashboardData.metrics.monthlyRevenue
                                    .changeText}
                            </p>

                            <!-- Sparkline visualization -->
                            <div class="mt-2 h-[30px] relative">
                                {#if chartData}
                                    <svg class="w-full h-full overflow-visible">
                                        <path
                                            d={generateSparkline(
                                                chartData.revenue,
                                                30,
                                                150,
                                            )}
                                            fill="none"
                                            stroke="rgba(74, 222, 128, 0.5)"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                        <!-- Highlight the last point -->
                                        <circle
                                            cx={150}
                                            cy={30 -
                                                ((chartData.revenue[
                                                    chartData.revenue.length - 1
                                                ] -
                                                    Math.min(
                                                        ...chartData.revenue,
                                                    )) /
                                                    (Math.max(
                                                        ...chartData.revenue,
                                                    ) -
                                                        Math.min(
                                                            ...chartData.revenue,
                                                        ))) *
                                                    30}
                                            r="3"
                                            fill="#4ADE80"
                                        />
                                    </svg>
                                {:else}
                                    <div
                                        class="animate-pulse w-full h-[30px] bg-white/5 rounded"
                                    ></div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </Card.Root>

                <!-- Active Users Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-5 h-full border border-white/10"
                    >
                        <h3
                            class="font-medium text-white/70 flex items-center gap-2"
                        >
                            <Users class="h-4 w-4 text-blue-400" />
                            Active Users
                        </h3>
                        <div class="flex flex-col gap-1 mt-3">
                            <div class="flex items-center gap-2">
                                <span class="text-3xl font-bold"
                                    >{dashboardData.metrics.activeUsers.value.toLocaleString()}</span
                                >
                                <span
                                    class="flex items-center text-sm font-medium text-green-400"
                                >
                                    <TrendingUp class="inline h-4 w-4 mr-1" />
                                    {dashboardData.metrics.activeUsers
                                        .percentChange}%
                                </span>
                            </div>
                            <p class="text-sm text-white/70">
                                {dashboardData.metrics.activeUsers.changeText}
                            </p>

                            <!-- Sparkline visualization -->
                            <div class="mt-2 h-[30px] relative">
                                {#if chartData}
                                    <svg class="w-full h-full overflow-visible">
                                        <path
                                            d={generateSparkline(
                                                chartData.users,
                                                30,
                                                150,
                                            )}
                                            fill="none"
                                            stroke="rgba(96, 165, 250, 0.5)"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                        <!-- Highlight the last point -->
                                        <circle
                                            cx={150}
                                            cy={30 -
                                                ((chartData.users[
                                                    chartData.users.length - 1
                                                ] -
                                                    Math.min(
                                                        ...chartData.users,
                                                    )) /
                                                    (Math.max(
                                                        ...chartData.users,
                                                    ) -
                                                        Math.min(
                                                            ...chartData.users,
                                                        ))) *
                                                    30}
                                            r="3"
                                            fill="#60A5FA"
                                        />
                                    </svg>
                                {:else}
                                    <div
                                        class="animate-pulse w-full h-[30px] bg-white/5 rounded"
                                    ></div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </Card.Root>

                <!-- Investor Interest Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-5 h-full border border-white/10"
                    >
                        <h3
                            class="font-medium text-white/70 flex items-center gap-2"
                        >
                            <Star class="h-4 w-4 text-amber-400" />
                            Investor Interest
                        </h3>
                        <div class="flex flex-col gap-1 mt-3">
                            <div class="flex items-center gap-2">
                                <span class="text-3xl font-bold"
                                    >{dashboardData.metrics.investorInterest
                                        .value}</span
                                >
                                <span
                                    class="flex items-center text-sm font-medium text-green-400"
                                >
                                    <TrendingUp class="inline h-4 w-4 mr-1" />
                                    {dashboardData.metrics.investorInterest
                                        .percentChange}%
                                </span>
                            </div>
                            <p class="text-sm text-white/70">
                                {dashboardData.metrics.investorInterest
                                    .changeText}
                            </p>

                            <!-- Sparkline visualization -->
                            <div class="mt-2 h-[30px] relative">
                                {#if chartData}
                                    <svg class="w-full h-full overflow-visible">
                                        <path
                                            d={generateSparkline(
                                                chartData.interest,
                                                30,
                                                150,
                                            )}
                                            fill="none"
                                            stroke="rgba(251, 191, 36, 0.5)"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                        <!-- Highlight the last point -->
                                        <circle
                                            cx={150}
                                            cy={30 -
                                                ((chartData.interest[
                                                    chartData.interest.length -
                                                        1
                                                ] -
                                                    Math.min(
                                                        ...chartData.interest,
                                                    )) /
                                                    (Math.max(
                                                        ...chartData.interest,
                                                    ) -
                                                        Math.min(
                                                            ...chartData.interest,
                                                        ))) *
                                                    30}
                                            r="3"
                                            fill="#FBBF24"
                                        />
                                    </svg>
                                {:else}
                                    <div
                                        class="animate-pulse w-full h-[30px] bg-white/5 rounded"
                                    ></div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </Card.Root>

                <!-- Runway Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-5 h-full border border-white/10"
                    >
                        <h3
                            class="font-medium text-white/70 flex items-center gap-2"
                        >
                            <Calendar class="h-4 w-4 text-purple-400" />
                            Runway
                        </h3>
                        <div class="flex flex-col gap-1 mt-3">
                            <div class="flex items-center gap-2">
                                <span class="text-3xl font-bold"
                                    >{dashboardData.metrics.runway.value}</span
                                >
                                <span class="text-xl"
                                    >{dashboardData.metrics.runway.unit}</span
                                >
                            </div>
                            <p class="text-sm text-white/70">
                                {dashboardData.metrics.runway.detail}
                            </p>

                            <!-- Warning badge if runway is less than 12 months -->
                            {#if dashboardData.metrics.runway.value < 12}
                                <Badge
                                    variant="secondary"
                                    class="mt-2 bg-amber-500/20 text-amber-400 self-start"
                                >
                                    <AlertCircle class="h-3 w-3 mr-1" />
                                    Consider extending runway
                                </Badge>
                            {/if}
                        </div>
                    </div>
                </Card.Root>
            </div>

            <!-- Management Cards Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Startup Profile Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-6 h-full border border-white/10"
                    >
                        <h2
                            class="text-lg font-semibold mb-2 flex items-center gap-2"
                        >
                            <Rocket class="h-4 w-4 text-blue-400" />
                            Startup Profile
                        </h2>
                        <p class="text-white/70 mb-6">
                            Create or update your startup profile to attract
                            investors
                        </p>

                        <!-- Completion indicator -->
                        <div class="mb-6">
                            <div class="flex justify-between mb-2">
                                <span class="text-sm">Profile Completeness</span
                                >
                                <span class="text-sm">85%</span>
                            </div>
                            <div
                                class="relative h-2 bg-white/10 rounded-full overflow-hidden"
                            >
                                <div
                                    class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                    style="width: 85%"
                                ></div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            class="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                            href="/dashboard/founder/startup"
                        >
                            <Edit3 class="mr-2 h-4 w-4" />
                            Manage Profile
                        </Button>
                    </div>
                </Card.Root>

                <!-- Investor Relations Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-6 h-full border border-white/10"
                    >
                        <h2
                            class="text-lg font-semibold mb-2 flex items-center gap-2"
                        >
                            <MessageSquare class="h-4 w-4 text-blue-400" />
                            Investor Relations
                        </h2>
                        <p class="text-white/70 mb-4">
                            Manage communications and track investor engagement
                        </p>

                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <MessageSquare
                                        class="mr-2 h-4 w-4 text-white/70"
                                    />
                                    <span class="text-sm"
                                        >Active Conversations</span
                                    >
                                </div>
                                <span class="font-medium"
                                    >{dashboardData.investorRelations
                                        .activeConversations}</span
                                >
                            </div>

                            <div class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <MailOpen
                                        class="mr-2 h-4 w-4 text-white/70"
                                    />
                                    <span class="text-sm"
                                        >Pending Responses</span
                                    >
                                </div>
                                <span class="font-medium"
                                    >{dashboardData.investorRelations
                                        .pendingResponses}</span
                                >
                            </div>

                            {#if dashboardData.investorRelations.meetings?.next}
                                <div class="mt-4 p-3 bg-white/10 rounded-md">
                                    <p class="text-sm font-medium">
                                        Next Meeting
                                    </p>
                                    <div
                                        class="flex items-center mt-1 justify-between"
                                    >
                                        <span class="text-sm text-white/70"
                                            >{dashboardData.investorRelations
                                                .meetings.next.investor}</span
                                        >
                                        <span
                                            class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full"
                                            >{dashboardData.investorRelations
                                                .meetings.next.date}</span
                                        >
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <Button
                            variant="outline"
                            class="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                            <MessageSquare class="mr-2 h-4 w-4" />
                            View Messages
                        </Button>
                    </div>
                </Card.Root>

                <!-- Due Diligence Card -->
                <Card.Root class="overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-black/90 to-black/95 text-white p-6 h-full border border-white/10"
                    >
                        <h2
                            class="text-lg font-semibold mb-2 flex items-center gap-2"
                        >
                            <FileText class="h-4 w-4 text-blue-400" />
                            Due Diligence
                        </h2>
                        <p class="text-white/70 mb-4">
                            Track and manage investor due diligence requests
                        </p>

                        <div class="mb-6">
                            <div class="flex justify-between mb-2">
                                <span class="text-sm">Documents Uploaded</span>
                                <span class="text-sm"
                                    >{dashboardData.dueDisgience
                                        .documentsUploaded}/{dashboardData
                                        .dueDisgience.totalDocuments}</span
                                >
                            </div>
                            <div
                                class="relative h-2 bg-white/10 rounded-full overflow-hidden"
                            >
                                <div
                                    class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                    style="width: {(dashboardData.dueDisgience
                                        .documentsUploaded /
                                        dashboardData.dueDisgience
                                            .totalDocuments) *
                                        100}%"
                                ></div>
                            </div>

                            {#if dashboardData.dueDisgience.nextDue}
                                <div class="mt-4 p-3 bg-white/10 rounded-md">
                                    <p class="text-sm font-medium">
                                        Next Document Due
                                    </p>
                                    <div
                                        class="flex items-center mt-1 justify-between"
                                    >
                                        <span class="text-sm text-white/70"
                                            >{dashboardData.dueDisgience
                                                .nextDue}</span
                                        >
                                        <span
                                            class="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full"
                                            >{dashboardData.dueDisgience
                                                .dueDate}</span
                                        >
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <Button
                            variant="outline"
                            class="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                            <FileText class="mr-2 h-4 w-4" />
                            Manage Documents
                        </Button>
                    </div>
                </Card.Root>
            </div>
        </Tabs.Content>
    </Tabs.Root>
</div>

<style>
    /* Additional styles for visual fidelity */
    :global(.bg-black\/90) {
        background-color: rgba(18, 18, 18, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Gradient animation for the progress bar highlight */
    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    /* Subtle card hover effect */
    :global(.card-hover) {
        transition: all 0.2s ease;
    }

    :global(.card-hover:hover) {
        transform: translateY(-3px);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    /* Hide scrollbars for certain elements */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
