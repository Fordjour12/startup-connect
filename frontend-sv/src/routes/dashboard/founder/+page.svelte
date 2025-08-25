<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import { Badge } from "$lib/components/ui/badge";
	import {
	Building2,
	TrendingUp,
	Users,
	DollarSign,
	Target,
	Calendar,
	ArrowRight,
	Plus,
} from "@lucide/svelte";

	export let data: { user: any };

	const { user } = data;

	// Mock data - in real app, this would come from API
	const startupStats = {
		profileCompletion: 85,
		fundingRaised: 250000,
		fundingGoal: 500000,
		connections: 12,
		activeDeals: 3,
		upcomingMeetings: 2,
	};

	const recentActivities = [
		{
			type: "connection",
			message: "New investor connection request from TechVentures",
			time: "2 hours ago",
			status: "pending",
		},
		{
			type: "funding",
			message: "Updated fundraising goal to $500K",
			time: "1 day ago",
			status: "completed",
		},
		{
			type: "meeting",
			message: "Scheduled pitch meeting with Angel Investors Club",
			time: "2 days ago",
			status: "scheduled",
		},
	];

	function getStatusColor(status: string) {
		switch (status) {
			case "pending":
				return "bg-yellow-500";
			case "completed":
				return "bg-green-500";
			case "scheduled":
				return "bg-blue-500";
			default:
				return "bg-gray-500";
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case "pending":
				return "Pending";
			case "completed":
				return "Completed";
			case "scheduled":
				return "Scheduled";
			default:
				return "Unknown";
		}
	}
</script>

<svelte:head>
	<title>Founder Dashboard - StartupConnect</title>
	<meta
		name="description"
		content="Manage your startup, fundraising, and connections"
	/>
</svelte:head>

<div class="container py-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-2">Founder Dashboard</h1>
			<p class="text-muted-foreground text-lg">
				Manage your startup, track fundraising progress, and grow your
				network
			</p>
		</div>

		<!-- Key Metrics -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Profile Completion</CardTitle
					>
					<Target class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{startupStats.profileCompletion}%
					</div>
					<Progress
						value={startupStats.profileCompletion}
						class="mt-2"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Funding Raised</CardTitle
					>
					<DollarSign class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						${(startupStats.fundingRaised / 1000).toFixed(0)}K
					</div>
					<p class="text-xs text-muted-foreground">
						of ${(startupStats.fundingGoal / 1000).toFixed(0)}K goal
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Connections</CardTitle
					>
					<Users class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{startupStats.connections}
					</div>
					<p class="text-xs text-muted-foreground">
						+2 this week
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Active Deals</CardTitle
					>
					<TrendingUp class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{startupStats.activeDeals}
					</div>
					<p class="text-xs text-muted-foreground">In progress</p>
				</CardContent>
			</Card>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<Card
				class="hover:shadow-lg transition-shadow cursor-pointer group"
			>
				<CardHeader>
					<div class="flex items-center space-x-3">
						<div class="p-2 rounded-lg bg-blue-500 text-white">
							<Building2 class="h-5 w-5" />
						</div>
						<div>
							<CardTitle class="text-lg">My Startup</CardTitle
							>
							<CardDescription
								>Manage your startup profile</CardDescription
							>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/founder/startup" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Manage Startup
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
				</CardContent>
			</Card>

			<Card
				class="hover:shadow-lg transition-shadow cursor-pointer group"
			>
				<CardHeader>
					<div class="flex items-center space-x-3">
						<div class="p-2 rounded-lg bg-green-500 text-white">
							<TrendingUp class="h-5 w-5" />
						</div>
						<div>
							<CardTitle class="text-lg"
								>Fundraising</CardTitle
							>
							<CardDescription
								>Track your funding progress</CardDescription
							>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/founder/fundraising" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Fundraising
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
				</CardContent>
			</Card>

			<Card
				class="hover:shadow-lg transition-shadow cursor-pointer group"
			>
				<CardHeader>
					<div class="flex items-center space-x-3">
						<div
							class="p-2 rounded-lg bg-purple-500 text-white"
						>
							<Users class="h-5 w-5" />
						</div>
						<div>
							<CardTitle class="text-lg"
								>Connections</CardTitle
							>
							<CardDescription>Grow your network</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/founder/connections" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Manage Connections
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
				</CardContent>
			</Card>
		</div>

		<!-- Recent Activity & Upcoming -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Recent Activity -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						<span>Recent Activity</span>
						<Button variant="outline" size="sm">
							<Plus class="h-4 w-4 mr-2" />
							Add Activity
						</Button>
					</CardTitle>
					<CardDescription
						>Your latest startup activities</CardDescription
					>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each recentActivities as activity}
							<div
								class="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
							>
								<div
									class="w-2 h-2 rounded-full mt-2 {getStatusColor(
										activity.status,
									)}"
								></div>
								<div class="flex-1">
									<p class="text-sm font-medium">
										{activity.message}
									</p>
									<div
										class="flex items-center space-x-2 mt-1"
									>
										<span
											class="text-xs text-muted-foreground"
											>{activity.time}</span
										>
										<Badge
											variant="secondary"
											class="text-xs"
										>
											{getStatusText(activity.status)}
										</Badge>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>

			<!-- Upcoming Events -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						<span>Upcoming Events</span>
						<Button variant="outline" size="sm">
							<Plus class="h-4 w-4 mr-2" />
							Schedule
						</Button>
					</CardTitle>
					<CardDescription
						>Your scheduled meetings and events</CardDescription
					>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div
							class="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
						>
							<Calendar class="h-5 w-5 text-blue-600" />
							<div class="flex-1">
								<p class="text-sm font-medium">
									Pitch Meeting - TechVentures
								</p>
								<p class="text-xs text-muted-foreground">
									Tomorrow, 2:00 PM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Pitch</Badge
							>
						</div>

						<div
							class="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200"
						>
							<Calendar class="h-5 w-5 text-green-600" />
							<div class="flex-1">
								<p class="text-sm font-medium">
									Networking Event - Startup Summit
								</p>
								<p class="text-xs text-muted-foreground">
									Friday, 6:00 PM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Networking</Badge
							>
						</div>

						<div
							class="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200"
						>
							<Calendar class="h-5 w-5 text-purple-600" />
							<div class="flex-1">
								<p class="text-sm font-medium">
									Due Diligence Call - Angel Investors
								</p>
								<p class="text-xs text-muted-foreground">
									Next Monday, 10:00 AM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Due Diligence</Badge
							>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
