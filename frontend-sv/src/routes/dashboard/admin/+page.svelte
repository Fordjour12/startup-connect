<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    import {
        IconUser,
        IconBuilding,
        IconTrendingUp,
        IconAlertHexagon,
        IconActivity,
        IconShield,
        IconDatabase,
        IconSquareCheck,
    } from "@tabler/icons-svelte";

    let { data } = $props<{
        data: {
            user: any;
            systemStats: any;
            recentActivities: any[];
            quickActionsStats: any;
            systemHealth: any;
        };
    }>();

    const {
        user,
        systemStats,
        recentActivities,
        quickActionsStats,
        systemHealth,
    } = data;

    const quickActions = [
        {
            title: "Manage Users",
            description: "View and edit user accounts",
            href: "/dashboard/admin/users",
            icon: IconUser,
            color: "text-blue-600",
        },
        {
            title: "Review Startups",
            description: "Approve pending startup submissions",
            href: "/dashboard/admin/content",
            icon: IconBuilding,
            color: "text-green-600",
        },
        {
            title: "View Analytics",
            description: "Check platform metrics and reports",
            href: "/dashboard/admin/analytics",
            icon: IconTrendingUp,
            color: "text-purple-600",
        },
        {
            title: "System Settings",
            description: "Configure platform settings",
            href: "/dashboard/admin/settings",
            icon: IconShield,
            color: "text-orange-600",
        },
    ];
</script>

<svelte:head>
    <title>Admin Dashboard - StartupConnect</title>
    <meta
        name="description"
        content="Admin dashboard for managing StartupConnect platform"
    />
</svelte:head>

<div class="px-4 py-8">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p class="text-muted-foreground">
                Welcome back, {user.name}. Here's what's happening on the
                platform.
            </p>
        </div>
        <div class="mt-4 md:mt-0">
            <a href="/dashboard/admin/bulk-operations">
                <Button variant="outline">
                    <IconSquareCheck class="h-4 w-4 mr-2" />
                    Bulk Operations
                </Button>
            </a>
        </div>
    </div>

    <!-- Stats Cards -->
    <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t"
    >
        <!-- Total Users Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Total Users</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {systemStats.totalUsers.toLocaleString()}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Platform User Base</div>
                <div class="text-muted-foreground">
                    Total registered users across all roles.
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Active Users Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Active Users</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {systemStats.activeUsers.toLocaleString()}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Currently Active</div>
                <div class="text-muted-foreground">
                    Users who have logged in within the last 30 days.
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Total Startups Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Total Startups</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {systemStats.totalStartups.toLocaleString()}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Registered Companies</div>
                <div class="text-muted-foreground">
                    Number of startup companies on the platform.
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Pending Approvals Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Pending Approvals</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {systemStats.pendingApprovals}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Awaiting Review</div>
                <div class="text-muted-foreground">
                    Items requiring administrative attention.
                </div>
            </Card.Footer>
        </Card.Root>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <Card.Root class="lg:col-span-2">
            <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
                <Card.Description>Common administrative tasks</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each quickActions as action}
                        <a href={action.href} class="block">
                            <div
                                class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <action.icon class="h-8 w-8 {action.color}" />
                                <div>
                                    <h3 class="font-semibold">
                                        {action.title}
                                    </h3>
                                    <p class="text-sm text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Recent Activity -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>Latest platform events</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="space-y-4">
                    {#each recentActivities as activity}
                        <div class="flex items-start space-x-3">
                            <div
                                class="w-2 h-2 bg-primary rounded-full mt-2"
                            ></div>
                            <div class="flex-1">
                                <p class="text-sm">{activity.message}</p>
                                <p class="text-xs text-muted-foreground">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- System Status -->
    <Card.Root class="mt-6">
        <Card.Header>
            <Card.Title class="flex items-center space-x-2">
                <IconDatabase class="h-5 w-5" />
                <span>System Status</span>
            </Card.Title>
            <Card.Description>Current system health and alerts</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm"
                        >Server Uptime: {systemHealth.serverUptime}</span
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm"
                        >Response Time: {systemHealth.responseTime}</span
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm"
                        >{systemStats.systemAlerts} alerts</span
                    >
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>
