<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import {
		Users,
		Building2,
		TrendingUp,
		AlertTriangle,
		Activity,
		Shield,
		Database,
		CheckSquare,
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
			icon: Users,
			color: "text-blue-600",
		},
		{
			title: "Review Startups",
			description: "Approve pending startup submissions",
			href: "/dashboard/admin/content",
			icon: Building2,
			color: "text-green-600",
		},
		{
			title: "View Analytics",
			description: "Check platform metrics and reports",
			href: "/dashboard/admin/analytics",
			icon: TrendingUp,
			color: "text-purple-600",
		},
		{
			title: "System Settings",
			description: "Configure platform settings",
			href: "/dashboard/admin/settings",
			icon: Shield,
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

<div class="container mx-auto px-4 py-8">
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
					<CheckSquare class="h-4 w-4 mr-2" />
					Bulk Operations
				</Button>
			</a>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Users</CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{systemStats.totalUsers.toLocaleString()}
				</div>
				<p class="text-xs text-muted-foreground">
					+12% from last month
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Active Users</CardTitle>
				<Activity class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{systemStats.activeUsers.toLocaleString()}
				</div>
				<p class="text-xs text-muted-foreground">+8% from last week</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Startups</CardTitle
				>
				<Building2 class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{systemStats.totalStartups.toLocaleString()}
				</div>
				<p class="text-xs text-muted-foreground">+5 new this week</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Pending Approvals</CardTitle
				>
				<AlertTriangle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{systemStats.pendingApprovals}
				</div>
				<p class="text-xs text-muted-foreground">Require attention</p>
			</CardContent>
		</Card>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Quick Actions -->
		<Card class="lg:col-span-2">
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Common administrative tasks</CardDescription>
			</CardHeader>
			<CardContent>
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
			</CardContent>
		</Card>

		<!-- Recent Activity -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest platform events</CardDescription>
			</CardHeader>
			<CardContent>
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
			</CardContent>
		</Card>
	</div>

	<!-- System Status -->
	<Card class="mt-6">
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Database class="h-5 w-5" />
				<span>System Status</span>
			</CardTitle>
			<CardDescription>Current system health and alerts</CardDescription>
		</CardHeader>
		<CardContent>
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
		</CardContent>
	</Card>
</div>
