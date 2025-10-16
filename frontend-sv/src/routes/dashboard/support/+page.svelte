<script lang="ts">
	import { page } from "$app/stores";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Button } from "@/components/ui/button";
	import { Badge } from "@/components/ui/badge";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "@/components/ui/tabs";
	import {
		Calendar,
		MessageSquare,
		Star,
		DollarSign,
		TrendingUp,
		Users,
		Clock,
		Plus,
		FileText,
		Settings,
	} from "@lucide/svelte";

	// Mock data for now - will be replaced with real data from API
	let activeEngagements = $state(3);
	let monthlyEarnings = $state(2450);
	let responseRate = $state(98);
	let averageRating = $state(4.8);
	let recentMessages = $state(5);
	let pendingProposals = $state(2);
	let upcomingSessions = $state(4);

	// Quick action handlers
	function createServiceListing() {
		window.location.href = "/dashboard/support/services/create";
	}

	function respondToInquiries() {
		// TODO: Navigate to messages/inquiries
		console.log("Respond to inquiries");
	}

	function scheduleSession() {
		// TODO: Navigate to calendar/scheduling
		console.log("Schedule session");
	}

	function viewAnalytics() {
		// TODO: Navigate to analytics dashboard
		console.log("View analytics");
	}
</script>

<svelte:head>
	<title>Supporter Dashboard | Startup Connect</title>
	<meta
		name="description"
		content="Manage your services, clients, and earnings as a startup supporter"
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
				Manage your services, track your earnings, and connect with
				startups
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				onclick={() =>
					(window.location.href = "/dashboard/support/profile")}
			>
				<Settings class="h-4 w-4 mr-2" />
				Profile
			</Button>
			<Button variant="outline" onclick={() => viewAnalytics()}>
				<TrendingUp class="h-4 w-4 mr-2" />
				Analytics
			</Button>
			<Button onclick={() => createServiceListing()}>
				<Plus class="h-4 w-4 mr-2" />
				Create Service
			</Button>
		</div>
	</div>

	<!-- Overview Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Active Engagements</CardTitle
				>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{activeEngagements}</div>
				<p class="text-xs text-muted-foreground">+2 from last month</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Monthly Earnings</CardTitle
				>
				<DollarSign class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					${monthlyEarnings.toLocaleString()}
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
				<CardTitle class="text-sm font-medium">Response Rate</CardTitle>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{responseRate}%</div>
				<p class="text-xs text-muted-foreground">Avg: 2.3 hours</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Average Rating</CardTitle
				>
				<Star class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{averageRating}</div>
				<p class="text-xs text-muted-foreground">Based on 47 reviews</p>
			</CardContent>
		</Card>
	</div>

	<!-- Main Content Tabs -->
	<Tabs value="overview" class="space-y-6">
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="engagements">Active Engagements</TabsTrigger>
			<TabsTrigger value="services">My Services</TabsTrigger>
			<TabsTrigger value="messages">Messages</TabsTrigger>
		</TabsList>

		<TabsContent value="overview" class="space-y-6">
			<!-- Quick Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Common tasks and shortcuts to help you stay productive
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button
							variant="outline"
							class="h-24 flex-col gap-2"
							onclick={() => createServiceListing()}
						>
							<Plus class="h-6 w-6" />
							<span>Create Service Listing</span>
						</Button>
						<Button
							variant="outline"
							class="h-24 flex-col gap-2"
							onclick={() => respondToInquiries()}
						>
							<MessageSquare class="h-6 w-6" />
							<span>Respond to Inquiries</span>
							<Badge variant="secondary" class="ml-2"
								>{recentMessages}</Badge
							>
						</Button>
						<Button
							variant="outline"
							class="h-24 flex-col gap-2"
							onclick={() => scheduleSession()}
						>
							<Calendar class="h-6 w-6" />
							<span>Schedule Session</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Recent Activity -->
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>
						Latest updates from your engagements and services
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div
							class="flex items-center gap-4 p-3 rounded-lg border"
						>
							<div
								class="w-2 h-2 bg-green-500 rounded-full"
							></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									New client inquiry for Business Strategy
									service
								</p>
								<p class="text-xs text-muted-foreground">
									TechStart Inc. • 2 hours ago
								</p>
							</div>
							<Button variant="outline" size="sm">Respond</Button>
						</div>

						<div
							class="flex items-center gap-4 p-3 rounded-lg border"
						>
							<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									Payment received for Marketing consultation
								</p>
								<p class="text-xs text-muted-foreground">
									$850 • 1 day ago
								</p>
							</div>
							<Badge variant="outline">Completed</Badge>
						</div>

						<div
							class="flex items-center gap-4 p-3 rounded-lg border"
						>
							<div
								class="w-2 h-2 bg-yellow-500 rounded-full"
							></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									New review received
								</p>
								<p class="text-xs text-muted-foreground">
									5 stars • 2 days ago
								</p>
							</div>
							<Button variant="outline" size="sm">View</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Performance Metrics -->
			<Card>
				<CardHeader>
					<CardTitle>Performance Metrics</CardTitle>
					<CardDescription>
						Key indicators of your success and areas for improvement
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-4">
							<h4 class="font-medium">Client Satisfaction</h4>
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<span class="text-sm">Overall Rating</span>
									<span class="font-medium"
										>{averageRating}/5</span
									>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Would Recommend</span>
									<span class="font-medium">96%</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm"
										>Project Success Rate</span
									>
									<span class="font-medium">94%</span>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<h4 class="font-medium">Business Metrics</h4>
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<span class="text-sm"
										>Avg. Response Time</span
									>
									<span class="font-medium">2.3 hours</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Client Retention</span
									>
									<span class="font-medium">78%</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm"
										>Avg. Project Value</span
									>
									<span class="font-medium">$1,250</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="engagements" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Active Engagements</CardTitle>
					<CardDescription>
						Current client relationships and ongoing projects
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">
									TechStart Inc. - Business Strategy
								</h4>
								<Badge variant="outline">Active</Badge>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								Go-to-market strategy development and market
								analysis
							</p>
							<div class="flex items-center gap-4 text-sm">
								<span>Started: 2 weeks ago</span>
								<span>Value: $2,500</span>
								<span>Timeline: 6 weeks</span>
							</div>
						</div>

						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">
									InnovateCorp - Technical Consulting
								</h4>
								<Badge variant="secondary">Negotiating</Badge>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								Architecture review and DevOps implementation
							</p>
							<div class="flex items-center gap-4 text-sm">
								<span>Proposed: 3 days ago</span>
								<span>Value: $3,200</span>
								<span>Timeline: 8 weeks</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="services" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>My Services</CardTitle>
					<CardDescription>
						Services you offer and their current status
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">
									Business Strategy Consulting
								</h4>
								<Badge variant="outline">Active</Badge>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								Strategic planning, business model development,
								and market analysis
							</p>
							<div class="flex items-center gap-4 text-sm">
								<span>Category: Business Strategy</span>
								<span>Pricing: $150/hour</span>
								<span>Rating: 4.9/5</span>
							</div>
						</div>

						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">
									Marketing & Growth Strategy
								</h4>
								<Badge variant="outline">Active</Badge>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								Customer acquisition, branding, and growth
								hacking strategies
							</p>
							<div class="flex items-center gap-4 text-sm">
								<span>Category: Marketing & Sales</span>
								<span>Pricing: $125/hour</span>
								<span>Rating: 4.7/5</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="messages" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Recent Messages</CardTitle>
					<CardDescription>
						Latest communications with clients and prospects
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">TechStart Inc.</h4>
								<span class="text-sm text-muted-foreground"
									>2 hours ago</span
								>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								"Hi! We're looking for help with our
								go-to-market strategy..."
							</p>
							<Button size="sm">Reply</Button>
						</div>

						<div class="p-4 border rounded-lg">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium">InnovateCorp</h4>
								<span class="text-sm text-muted-foreground"
									>1 day ago</span
								>
							</div>
							<p class="text-sm text-muted-foreground mb-3">
								"Thanks for the proposal. We'd like to discuss
								the timeline..."
							</p>
							<Button size="sm">Reply</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>
