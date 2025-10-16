<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
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
		Calendar,
		MessageSquare,
		Star,
		TrendingUp,
		Users,
		Clock,
		DollarSign,
		Plus,
		Settings,
		BarChart3,
		Bell,
		CheckCircle,
		AlertCircle,
		Eye,
		Heart,
	} from "@lucide/svelte";

	// Mock data - will be replaced with actual API calls
	let dashboardData = $state({
		overview: {
			totalServices: 3,
			activeBookings: 7,
			totalEarnings: 12500,
			rating: 4.8,
			totalReviews: 42,
			responseRate: 98,
			profileViews: 156,
		},
		recentBookings: [
			{
				id: "1",
				title: "Business Strategy Consultation",
				startup: "TechFlow Inc.",
				status: "confirmed",
				scheduledDate: "2024-01-15",
				amount: 500,
			},
			{
				id: "2",
				title: "Marketing Strategy Review",
				startup: "GreenTech Solutions",
				status: "in_progress",
				scheduledDate: "2024-01-12",
				amount: 750,
			},
			{
				id: "3",
				title: "Financial Planning Session",
				startup: "DataViz Pro",
				status: "pending",
				scheduledDate: "2024-01-18",
				amount: 300,
			},
		],
		recentMessages: [
			{
				id: "1",
				from: "TechFlow Inc.",
				subject: "Follow-up on strategy session",
				time: "2 hours ago",
				isRead: false,
			},
			{
				id: "2",
				from: "GreenTech Solutions",
				subject: "Project deliverables",
				time: "5 hours ago",
				isRead: true,
			},
		],
		performanceMetrics: {
			monthlyEarnings: [1200, 1500, 1800, 2200, 1900, 2500],
			bookingTrend: [3, 5, 4, 7, 6, 8],
			ratingTrend: [4.7, 4.8, 4.8, 4.9, 4.8, 4.8],
		},
	});

	let isLoading = $state(false);

	// Quick actions
	function createNewService() {
		goto("/supporter/services/new");
	}

	function viewAllBookings() {
		goto("/supporter/bookings");
	}

	function viewAllMessages() {
		goto("/supporter/messages");
	}

	function viewAnalytics() {
		goto("/supporter/analytics");
	}

	function manageProfile() {
		goto("/supporter/profile");
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	onMount(() => {
		// TODO: Load actual dashboard data from API
		console.log("Loading supporter dashboard...");
	});
</script>

<svelte:head>
	<title>Supporter Dashboard | Startup Connect</title>
	<meta
		name="description"
		content="Manage your supporter services, bookings, and communications"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">
				Supporter Dashboard
			</h1>
			<p class="text-muted-foreground">
				Welcome back! Here's what's happening with your services.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={() => manageProfile()}>
				<Settings class="h-4 w-4 mr-2" />
				Profile Settings
			</Button>
			<Button onclick={() => createNewService()}>
				<Plus class="h-4 w-4 mr-2" />
				New Service
			</Button>
		</div>
	</div>

	<!-- Overview Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Services</CardTitle
				>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{dashboardData.overview.totalServices}
				</div>
				<p class="text-xs text-muted-foreground">+2 from last month</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Active Bookings</CardTitle
				>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{dashboardData.overview.activeBookings}
				</div>
				<p class="text-xs text-muted-foreground">+3 from last week</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Earnings</CardTitle
				>
				<DollarSign class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					${dashboardData.overview.totalEarnings.toLocaleString()}
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
				<CardTitle class="text-sm font-medium">Rating</CardTitle>
				<Star class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{dashboardData.overview.rating}
				</div>
				<p class="text-xs text-muted-foreground">
					{dashboardData.overview.totalReviews} reviews
				</p>
			</CardContent>
		</Card>
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Recent Bookings -->
		<Card class="lg:col-span-2">
			<CardHeader>
				<div class="flex items-center justify-between">
					<div>
						<CardTitle>Recent Bookings</CardTitle>
						<CardDescription>
							Your latest service bookings and their status
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onclick={() => viewAllBookings()}
					>
						View All
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each dashboardData.recentBookings as booking}
						<div
							class="flex items-center justify-between p-4 border rounded-lg"
						>
							<div class="space-y-1">
								<h4 class="font-medium">{booking.title}</h4>
								<p class="text-sm text-muted-foreground">
									{booking.startup} • {booking.scheduledDate}
								</p>
							</div>
							<div class="flex items-center gap-3">
								<Badge class={getStatusColor(booking.status)}>
									{booking.status.replace("_", " ")}
								</Badge>
								<span class="font-medium"
									>${booking.amount}</span
								>
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>

		<!-- Quick Actions & Messages -->
		<div class="space-y-6">
			<!-- Quick Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Common tasks and shortcuts
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					<Button
						class="w-full justify-start"
						onclick={() => createNewService()}
					>
						<Plus class="h-4 w-4 mr-2" />
						Create New Service
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => viewAllBookings()}
					>
						<Calendar class="h-4 w-4 mr-2" />
						Manage Bookings
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => viewAnalytics()}
					>
						<BarChart3 class="h-4 w-4 mr-2" />
						View Analytics
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => manageProfile()}
					>
						<Settings class="h-4 w-4 mr-2" />
						Profile Settings
					</Button>
				</CardContent>
			</Card>

			<!-- Recent Messages -->
			<Card>
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle>Recent Messages</CardTitle>
							<CardDescription>
								Latest communications
							</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onclick={() => viewAllMessages()}
						>
							View All
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						{#each dashboardData.recentMessages as message}
							<div
								class="flex items-start gap-3 p-3 border rounded-lg"
							>
								<div class="flex-shrink-0">
									{#if message.isRead}
										<CheckCircle
											class="h-4 w-4 text-green-500"
										/>
									{:else}
										<AlertCircle
											class="h-4 w-4 text-blue-500"
										/>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium truncate">
										{message.from}
									</p>
									<p
										class="text-sm text-muted-foreground truncate"
									>
										{message.subject}
									</p>
									<p class="text-xs text-muted-foreground">
										{message.time}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>
	</div>

	<!-- Performance Overview -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<div>
					<CardTitle>Performance Overview</CardTitle>
					<CardDescription>
						Your key metrics and trends
					</CardDescription>
				</div>
				<Button
					variant="outline"
					size="sm"
					onclick={() => viewAnalytics()}
				>
					<BarChart3 class="h-4 w-4 mr-2" />
					Detailed Analytics
				</Button>
			</div>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<TrendingUp class="h-4 w-4 text-green-500" />
						<span class="text-sm font-medium">Response Rate</span>
					</div>
					<div class="text-2xl font-bold">
						{dashboardData.overview.responseRate}%
					</div>
					<p class="text-xs text-muted-foreground">
						Average response time: 4 hours
					</p>
				</div>

				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Eye class="h-4 w-4 text-blue-500" />
						<span class="text-sm font-medium">Profile Views</span>
					</div>
					<div class="text-2xl font-bold">
						{dashboardData.overview.profileViews}
					</div>
					<p class="text-xs text-muted-foreground">
						+23% from last month
					</p>
				</div>

				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Heart class="h-4 w-4 text-red-500" />
						<span class="text-sm font-medium"
							>Client Satisfaction</span
						>
					</div>
					<div class="text-2xl font-bold">
						{dashboardData.overview.rating}/5.0
					</div>
					<p class="text-xs text-muted-foreground">
						Based on {dashboardData.overview.totalReviews} reviews
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
