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
	Briefcase,
	TrendingUp,
	Building2,
	DollarSign,
	Target,
	Calendar,
	ArrowRight,
	Plus,
	Eye,
	Star,
} from "@lucide/svelte";

	export let data: { user: any };

	const { user } = data;

	// Mock data - in real app, this would come from API
	const portfolioStats = {
		totalInvested: 2500000,
		portfolioValue: 3200000,
		totalReturn: 28,
		activeInvestments: 8,
		newOpportunities: 15,
		upcomingMeetings: 4,
	};

	const recentDeals = [
		{
			startup: "TechFlow Solutions",
			amount: 500000,
			status: "due_diligence",
			type: "Series A",
			industry: "SaaS",
			rating: 4.5,
		},
		{
			startup: "GreenEnergy Corp",
			amount: 750000,
			status: "negotiating",
			type: "Series B",
			industry: "CleanTech",
			rating: 4.2,
		},
		{
			startup: "HealthTech Innovations",
			amount: 300000,
			status: "evaluating",
			type: "Seed",
			industry: "HealthTech",
			rating: 4.8,
		},
	];

	function getStatusColor(status: string) {
		switch (status) {
			case "due_diligence":
				return "bg-blue-500";
			case "negotiating":
				return "bg-yellow-500";
			case "evaluating":
				return "bg-purple-500";
			case "closed":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case "due_diligence":
				return "Due Diligence";
			case "negotiating":
				return "Negotiating";
			case "evaluating":
				return "Evaluating";
			case "closed":
				return "Closed";
			default:
				return "Unknown";
		}
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Investor Dashboard - StartupConnect</title>
	<meta
		name="description"
		content="Manage your investment portfolio and discover new opportunities"
	/>
</svelte:head>

<div class="container py-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-2">Investor Dashboard</h1>
			<p class="text-muted-foreground text-lg">
				Manage your portfolio, track deals, and discover new investment
				opportunities
			</p>
		</div>

		<!-- Key Metrics -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Total Invested</CardTitle
					>
					<DollarSign class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{formatCurrency(portfolioStats.totalInvested)}
					</div>
					<p class="text-xs text-muted-foreground">All time</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Portfolio Value</CardTitle
					>
					<TrendingUp class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{formatCurrency(portfolioStats.portfolioValue)}
					</div>
					<p class="text-xs text-green-600">
						+{portfolioStats.totalReturn}% return
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>Active Investments</CardTitle
					>
					<Briefcase class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{portfolioStats.activeInvestments}
					</div>
					<p class="text-xs text-muted-foreground">Companies</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>New Opportunities</CardTitle
					>
					<Building2 class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{portfolioStats.newOpportunities}
					</div>
					<p class="text-xs text-muted-foreground">This week</p>
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
							<Briefcase class="h-5 w-5" />
						</div>
						<div>
							<CardTitle class="text-lg">Portfolio</CardTitle>
							<CardDescription
								>View and manage your investments</CardDescription
							>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/investor/portfolio" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Portfolio
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
							<CardTitle class="text-lg">Deals</CardTitle>
							<CardDescription
								>Track active and potential deals</CardDescription
							>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/investor/deals" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Manage Deals
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
							<Building2 class="h-5 w-5" />
						</div>
						<div>
							<CardTitle class="text-lg">Startups</CardTitle>
							<CardDescription
								>Discover new opportunities</CardDescription
							>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					          <a href="/dashboard/investor/startups" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Browse Startups
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
				</CardContent>
			</Card>
		</div>

		<!-- Recent Deals & Upcoming -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Recent Deals -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						<span>Recent Deals</span>
						<Button variant="outline" size="sm">
							<Plus class="h-4 w-4 mr-2" />
							New Deal
						</Button>
					</CardTitle>
					<CardDescription
						>Your latest investment activities</CardDescription
					>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each recentDeals as deal}
							<div
								class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
							>
								<div
									class="w-2 h-2 rounded-full {getStatusColor(
										deal.status,
									)}"
								></div>
								<div class="flex-1">
									<div
										class="flex items-center justify-between mb-1"
									>
										<p class="text-sm font-medium">
											{deal.startup}
										</p>
										<div
											class="flex items-center space-x-1"
										>
											<Star
												class="h-3 w-3 text-yellow-500 fill-current"
											/>
											<span
												class="text-xs text-muted-foreground"
												>{deal.rating}</span
											>
										</div>
									</div>
									<div
										class="flex items-center space-x-2 text-xs text-muted-foreground"
									>
										<span
											>{formatCurrency(deal.amount)}</span
										>
										<span>•</span>
										<span>{deal.type}</span>
										<span>•</span>
										<span>{deal.industry}</span>
									</div>
									<div
										class="flex items-center space-x-2 mt-1"
									>
										<Badge
											variant="secondary"
											class="text-xs"
										>
											{getStatusText(deal.status)}
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
									Due Diligence - TechFlow Solutions
								</p>
								<p class="text-xs text-muted-foreground">
									Tomorrow, 10:00 AM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Due Diligence</Badge
							>
						</div>

						<div
							class="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200"
						>
							<Calendar class="h-5 w-5 text-green-600" />
							<div class="flex-1">
								<p class="text-sm font-medium">
									Board Meeting - GreenEnergy Corp
								</p>
								<p class="text-xs text-muted-foreground">
									Friday, 2:00 PM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Board Meeting</Badge
							>
						</div>

						<div
							class="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200"
						>
							<Calendar class="h-5 w-5 text-purple-600" />
							<div class="flex-1">
								<p class="text-sm font-medium">
									Startup Pitch Event
								</p>
								<p class="text-xs text-muted-foreground">
									Next Monday, 6:00 PM
								</p>
							</div>
							<Badge variant="outline" class="text-xs"
								>Pitch Event</Badge
							>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
