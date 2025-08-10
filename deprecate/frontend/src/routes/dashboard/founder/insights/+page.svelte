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
    import * as Tooltip from "$lib/components/ui/tooltip";
    import ClipboardCheck from "@lucide/svelte/icons/clipboard-check";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import BarChart from "@lucide/svelte/icons/bar-chart";
    import LineChart from "@lucide/svelte/icons/line-chart";
    import Users from "@lucide/svelte/icons/users";
    import Clock from "@lucide/svelte/icons/clock";
    import ArrowRight from "@lucide/svelte/icons/arrow-right";
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import AlertCircle from "@lucide/svelte/icons/alert-circle";
    import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
    import LightbulbIcon from "@lucide/svelte/icons/lightbulb";

    // Custom components
    import CustomerInsightsCard from "$lib/components/dashboard/CustomerInsightsCard.svelte";

    // Data imports
    import type { PageData } from "./$types";

    let {data}:{data:PageData} = $props();

    // Page title
    const pageTitle = "Customer & Market Insights";

    // State variables
    let isLoading = $state(true);

    onMount(() => {
        // Simulate API data loading
        setTimeout(() => {
            isLoading = false;
        }, 500);
    });
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
                {pageTitle}
            </h1>
            <p class="text-muted-foreground mt-1">
                Track customer feedback and monitor relevant market trends
            </p>
        </div>

        <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" class="gap-2">
                <Clock class="h-4 w-4" />
                <span>Last updated: Today at 9:30 AM</span>
            </Button>

            <Button variant="default" size="sm" class="gap-2">
                <CheckCircle2 class="h-4 w-4" />
                <span>Generate Report</span>
            </Button>
        </div>
    </div>

    <!-- Main Content -->
    <div
        class="grid grid-cols-1 gap-6 animate-in fade-in-50 duration-700 delay-200"
    >
        <!-- Customer & Market Insights Card -->
        <CustomerInsightsCard data={data.customerInsights} />

        <!-- Insights Summary & Actions -->
        <Card.Root>
            <Card.Header class="pb-3">
                <Card.Title class="text-lg"
                    >Insights Summary & Recommendations</Card.Title
                >
                <Card.Description>
                    Action items based on customer feedback and market trends
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="space-y-4">
                    <div
                        class="bg-muted/50 p-3 rounded-lg border border-border"
                    >
                        <div class="flex items-start gap-3">
                            <div class="bg-primary/10 rounded-full p-2 mt-1">
                                <LightbulbIcon class="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 class="font-medium">
                                    Customer Feedback Analysis
                                </h3>
                                <p class="text-sm text-muted-foreground mt-1">
                                    Your NPS score has increased by 8 points in
                                    the last 3 months, suggesting your recent
                                    product improvements have been
                                    well-received. The top requested feature
                                    remains API integration with Salesforce.
                                </p>
                                <div class="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="h-8"
                                    >
                                        <ClipboardCheck
                                            class="h-3.5 w-3.5 mr-1.5"
                                        />
                                        Create Action Plan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-muted/50 p-3 rounded-lg border border-border"
                    >
                        <div class="flex items-start gap-3">
                            <div class="bg-primary/10 rounded-full p-2 mt-1">
                                <LineChart class="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 class="font-medium">
                                    Market Trend Opportunities
                                </h3>
                                <p class="text-sm text-muted-foreground mt-1">
                                    The rapid growth in AI-powered analytics
                                    (32% YoY) presents an opportunity for
                                    product expansion. Consider incorporating AI
                                    features into your roadmap to align with
                                    market demand.
                                </p>
                                <div class="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="h-8"
                                    >
                                        <ArrowRight
                                            class="h-3.5 w-3.5 mr-1.5"
                                        />
                                        Explore AI Integration
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-muted/50 p-3 rounded-lg border border-border"
                    >
                        <div class="flex items-start gap-3">
                            <div class="bg-primary/10 rounded-full p-2 mt-1">
                                <Users class="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 class="font-medium">
                                    Competitive Analysis
                                </h3>
                                <p class="text-sm text-muted-foreground mt-1">
                                    CompeteX's new enterprise pricing tier could
                                    impact your market position. Consider
                                    conducting a competitive feature analysis
                                    and adjusting your pricing strategy to
                                    maintain your advantage.
                                </p>
                                <div class="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="h-8"
                                    >
                                        <BarChart class="h-3.5 w-3.5 mr-1.5" />
                                        View Analysis
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Detailed Insights Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Interview Insights -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg"
                        >Customer Interview Insights</Card.Title
                    >
                    <Card.Description>
                        Key themes and insights from recent customer interviews
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="space-y-4">
                        <div class="p-3 bg-muted/30 rounded-md">
                            <div class="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    class="bg-blue-500/10 text-blue-500"
                                    >Enterprise</Badge
                                >
                                <h3 class="font-medium">
                                    Enterprise Solutions Inc.
                                </h3>
                            </div>
                            <p class="text-sm text-muted-foreground mt-2">
                                "We love the dashboard functionality, but need
                                better integration with our existing security
                                systems. The onboarding process was smooth, but
                                the documentation could be improved."
                            </p>
                            <div class="mt-3 flex gap-2">
                                <Badge variant="outline" class="text-xs"
                                    >Security</Badge
                                >
                                <Badge variant="outline" class="text-xs"
                                    >Documentation</Badge
                                >
                                <Badge variant="outline" class="text-xs"
                                    >Integration</Badge
                                >
                            </div>
                        </div>

                        <div class="p-3 bg-muted/30 rounded-md">
                            <div class="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    class="bg-green-500/10 text-green-500"
                                    >Startup</Badge
                                >
                                <h3 class="font-medium">TechStart Labs</h3>
                            </div>
                            <p class="text-sm text-muted-foreground mt-2">
                                "The pricing is perfect for our stage, but we're
                                struggling with the analytics export feature.
                                We'd like to see more customization options for
                                reports."
                            </p>
                            <div class="mt-3 flex gap-2">
                                <Badge variant="outline" class="text-xs"
                                    >Analytics</Badge
                                >
                                <Badge variant="outline" class="text-xs"
                                    >Export</Badge
                                >
                                <Badge variant="outline" class="text-xs"
                                    >Customization</Badge
                                >
                            </div>
                        </div>

                        <div class="mt-4 text-center">
                            <Button variant="ghost" size="sm">
                                View All Interview Insights
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Market Analysis -->
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">Market Analysis</Card.Title>
                    <Card.Description>
                        Trends and opportunities in your target market
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="space-y-4">
                        <div class="p-3 bg-muted/30 rounded-md">
                            <h3 class="font-medium">Market Growth Forecast</h3>
                            <p class="text-sm text-muted-foreground mt-2">
                                The SaaS market in your sector is projected to
                                grow by 27% in the next fiscal year, with
                                particularly strong growth in AI-enabled
                                solutions (42%) and remote collaboration tools
                                (38%).
                            </p>
                            <div class="mt-3">
                                <Badge
                                    variant="outline"
                                    class="text-xs bg-green-500/10 text-green-500"
                                    >Growing Market</Badge
                                >
                            </div>
                        </div>

                        <div class="p-3 bg-muted/30 rounded-md">
                            <h3 class="font-medium">
                                Competitive Landscape Shifts
                            </h3>
                            <p class="text-sm text-muted-foreground mt-2">
                                Recent mergers have consolidated the enterprise
                                segment, potentially opening opportunities in
                                the mid-market where your solution is
                                well-positioned. Three competitors have raised
                                significant funding in Q3 2023.
                            </p>
                            <div class="mt-3">
                                <Badge
                                    variant="outline"
                                    class="text-xs bg-amber-500/10 text-amber-500"
                                    >Monitor Closely</Badge
                                >
                            </div>
                        </div>

                        <div class="mt-4 text-center">
                            <Button variant="ghost" size="sm">
                                View Complete Market Analysis
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
