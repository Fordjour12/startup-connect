<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        CalendarIcon,
        DollarSignIcon,
        MessageSquareIcon,
        PresentationIcon,
        RocketIcon,
        TargetIcon,
        UsersIcon,
    } from "@lucide/svelte";
    import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<div class="@container/main">
    <div class="container mx-auto p-6">
        <div class="mb-6">
            <h1 class="text-3xl font-bold">Founder Dashboard</h1>
            <p class="text-muted-foreground">
                Welcome back, {data.user?.full_name}!
            </p>
        </div>

        <!-- Key Metrics -->
        <div
            class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t mb-8"
        >
            <Card.Root class="@container/card">
                <Card.Header>
                    <Card.Description>Funding Raised</Card.Description>
                    <Card.Title
                        class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                    >
                        $2.5M
                    </Card.Title>
                    <Card.Action>
                        <Badge variant="outline">
                            <TrendingUpIcon />
                            +25%
                        </Badge>
                    </Card.Action>
                </Card.Header>
                <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                    <div class="line-clamp-1 flex gap-2 font-medium">
                        Strong funding progress <TrendingUpIcon
                            class="size-4"
                        />
                    </div>
                    <div class="text-muted-foreground">
                        50% of $5M goal achieved
                    </div>
                </Card.Footer>
            </Card.Root>

            <Card.Root class="@container/card">
                <Card.Header>
                    <Card.Description>Active Investors</Card.Description>
                    <Card.Title
                        class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                    >
                        12
                    </Card.Title>
                    <Card.Action>
                        <Badge variant="outline">
                            <TrendingUpIcon />
                            +3
                        </Badge>
                    </Card.Action>
                </Card.Header>
                <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                    <div class="line-clamp-1 flex gap-2 font-medium">
                        Growing investor network <TrendingUpIcon
                            class="size-4"
                        />
                    </div>
                    <div class="text-muted-foreground">
                        3 new investors this month
                    </div>
                </Card.Footer>
            </Card.Root>

            <Card.Root class="@container/card">
                <Card.Header>
                    <Card.Description>Monthly Growth</Card.Description>
                    <Card.Title
                        class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                    >
                        23%
                    </Card.Title>
                    <Card.Action>
                        <Badge variant="outline">
                            <TrendingUpIcon />
                            +5%
                        </Badge>
                    </Card.Action>
                </Card.Header>
                <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                    <div class="line-clamp-1 flex gap-2 font-medium">
                        Accelerating growth rate <TrendingUpIcon
                            class="size-4"
                        />
                    </div>
                    <div class="text-muted-foreground">
                        Exceeding projections
                    </div>
                </Card.Footer>
            </Card.Root>

            <Card.Root class="@container/card">
                <Card.Header>
                    <Card.Description>Funding Goal Progress</Card.Description>
                    <Card.Title
                        class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                    >
                        50%
                    </Card.Title>
                    <Card.Action>
                        <Badge variant="outline">
                            <TrendingUpIcon />
                            On track
                        </Badge>
                    </Card.Action>
                </Card.Header>
                <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                    <div class="line-clamp-1 flex gap-2 font-medium">
                        Halfway to $5M goal <TargetIcon class="size-4" />
                    </div>
                    <div class="text-muted-foreground">
                        Target completion: Q2 2024
                    </div>
                </Card.Footer>
            </Card.Root>
        </div>

        <!-- Quick Actions with proper alignment -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <RocketIcon class="h-4 w-4 text-primary" />
                            My Startup Profile
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Manage your startup information and visibility
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/startup"
                            class="w-full"
                            size="sm"
                        >
                            View Profile
                        </Button>
                    </Card.Footer>
                </Card.Root>

                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <PresentationIcon class="h-4 w-4 text-primary" />
                            Pitch Deck
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Update and share your pitch deck with investors
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/pitch-deck"
                            class="w-full"
                            size="sm"
                        >
                            Manage Deck
                        </Button>
                    </Card.Footer>
                </Card.Root>

                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <DollarSignIcon class="h-4 w-4 text-primary" />
                            Fundraising
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Track your fundraising progress and goals
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/fundraising"
                            class="w-full"
                            size="sm"
                        >
                            View Progress
                        </Button>
                    </Card.Footer>
                </Card.Root>

                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <UsersIcon class="h-4 w-4 text-primary" />
                            Investor Connections
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Connect with potential investors and partners
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/investors"
                            class="w-full"
                            size="sm"
                        >
                            Find Investors
                        </Button>
                    </Card.Footer>
                </Card.Root>

                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <MessageSquareIcon class="h-4 w-4 text-primary" />
                            Messages
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Communicate with investors and advisors
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/messages"
                            class="w-full"
                            size="sm"
                        >
                            View Messages
                        </Button>
                    </Card.Footer>
                </Card.Root>

                <Card.Root class="hover:shadow-lg transition-shadow">
                    <Card.Header class="pb-3">
                        <Card.Title class="flex items-center gap-2 text-base">
                            <CalendarIcon class="h-4 w-4 text-primary" />
                            Upcoming Meetings
                        </Card.Title>
                        <Card.Description class="text-sm">
                            Schedule and manage investor meetings
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="pt-3">
                        <Button
                            href="/dashboard/founder/meetings"
                            class="w-full"
                            size="sm"
                        >
                            View Calendar
                        </Button>
                    </Card.Footer>
                </Card.Root>
            </div>
        </div>

        <!-- Recent Activity -->
        <Card.Root class="mb-8">
            <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description
                    >Latest updates and interactions</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="space-y-3">
                    <div class="flex items-center gap-4 p-3 border rounded-lg">
                        <div
                            class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
                        ></div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-sm">
                                New investor interest from Acme Ventures
                            </p>
                            <p class="text-xs text-muted-foreground">
                                2 hours ago
                            </p>
                        </div>
                        <Badge variant="secondary" class="flex-shrink-0"
                            >New</Badge
                        >
                    </div>

                    <div class="flex items-center gap-4 p-3 border rounded-lg">
                        <div
                            class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                        ></div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-sm">
                                Pitch deck viewed by 3 investors
                            </p>
                            <p class="text-xs text-muted-foreground">
                                1 day ago
                            </p>
                        </div>
                        <Badge variant="outline" class="flex-shrink-0"
                            >Activity</Badge
                        >
                    </div>

                    <div class="flex items-center gap-4 p-3 border rounded-lg">
                        <div
                            class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"
                        ></div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-sm">
                                Meeting scheduled with TechStart Capital
                            </p>
                            <p class="text-xs text-muted-foreground">
                                2 days ago
                            </p>
                        </div>
                        <Badge variant="outline" class="flex-shrink-0"
                            >Meeting</Badge
                        >
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Action Buttons with proper alignment -->
        <div
            class="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center"
        >
            <Button
                href="/dashboard/founder/analytics"
                variant="outline"
                class="sm:w-auto"
            >
                View Analytics
            </Button>
            <Button href="/logout" variant="outline" class="sm:w-auto">
                Logout
            </Button>
        </div>
    </div>
</div>
