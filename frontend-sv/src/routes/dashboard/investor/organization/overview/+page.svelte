<script lang="ts">
	import { onMount } from "svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Progress } from "$lib/components/ui/progress";

	let organization = $state(null);
	let metrics = $state(null);
	let recentActivity = $state([]);
	let isLoading = $state(true);

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			organization = {
				name: "TechVenture Capital",
				type: "vc_fund",
				description: "Leading early-stage venture capital firm",
				verified: false,
				memberCount: 8,
				portfolioCount: 12,
				activeDeals: 3,
				totalInvested: 4500000, // $4.5M
				totalRaised: 12000000, // $12M
			};

			metrics = {
				portfolioCompanies: 12,
				totalInvested: 4500000,
				averageInvestment: 375000,
				activeDeals: 3,
				portfolioValue: 8500000,
				returnMultiple: 1.89,
				members: 8,
				dueDiligenceInProgress: 2,
			};

			recentActivity = [
				{
					id: 1,
					type: "investment",
					title: "New investment completed",
					description: "Invested $250K in StartupXYZ",
					time: "2 hours ago",
					amount: 250000,
				},
				{
					id: 2,
					type: "member",
					title: "New member joined",
					description: "Sarah Johnson joined as Investment Analyst",
					time: "1 day ago",
				},
				{
					id: 3,
					type: "due_diligence",
					title: "Due diligence started",
					description:
						"Started due diligence process for TechFlow Inc.",
					time: "2 days ago",
				},
				{
					id: 4,
					type: "portfolio",
					title: "Portfolio update",
					description: "Monthly portfolio report is ready",
					time: "3 days ago",
				},
			];
		} catch (error) {
			console.error("Error loading overview data:", error);
		} finally {
			isLoading = false;
		}
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	}

	function getActivityIcon(type: string): string {
		const icons: Record<string, string> = {
			investment:
				"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
			member: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
			due_diligence:
				"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
			portfolio:
				"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
		};
		return icons[type] || icons.portfolio;
	}

	function getActivityColor(type: string): string {
		const colors: Record<string, string> = {
			investment: "text-green-600",
			member: "text-blue-600",
			due_diligence: "text-orange-600",
			portfolio: "text-purple-600",
		};
		return colors[type] || colors.portfolio;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Overview</h1>
			<p class="text-muted-foreground">
				Welcome back! Here's what's happening with your organization.
			</p>
		</div>
		<div class="flex space-x-3">
			<Button variant="outline">
				<svg
					class="w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Export Report
			</Button>
			<Button>
				<svg
					class="w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Add Investment
			</Button>
		</div>
	</div>

	{#if isLoading}
		<!-- Loading State -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each Array(4) as _}
				<Card>
					<CardHeader class="pb-2">
						<div class="h-4 bg-muted rounded animate-pulse"></div>
					</CardHeader>
					<CardContent>
						<div
							class="h-8 bg-muted rounded animate-pulse mb-2"
						></div>
						<div
							class="h-3 bg-muted rounded animate-pulse w-3/4"
						></div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else if metrics}
		<!-- Key Metrics -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Portfolio Companies -->
			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Portfolio Companies
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{metrics.portfolioCompanies}
					</div>
					<p class="text-xs text-muted-foreground">
						+2 from last month
					</p>
				</CardContent>
			</Card>

			<!-- Total Invested -->
			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Total Invested
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{formatCurrency(metrics.totalInvested)}
					</div>
					<p class="text-xs text-muted-foreground">
						Avg: {formatCurrency(metrics.averageInvestment)}
					</p>
				</CardContent>
			</Card>

			<!-- Portfolio Value -->
			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Portfolio Value
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{formatCurrency(metrics.portfolioValue)}
					</div>
					<p class="text-xs text-green-600">
						{metrics.returnMultiple}x return
					</p>
				</CardContent>
			</Card>

			<!-- Active Deals -->
			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Active Deals
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">{metrics.activeDeals}</div>
					<p class="text-xs text-muted-foreground">
						{metrics.dueDiligenceInProgress} in due diligence
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Quick Actions & Progress -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Quick Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-3">
					<Button class="w-full justify-start" variant="outline">
						<svg
							class="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add New Investment
					</Button>
					<Button class="w-full justify-start" variant="outline">
						<svg
							class="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							/>
						</svg>
						Invite Team Member
					</Button>
					<Button class="w-full justify-start" variant="outline">
						<svg
							class="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Start Due Diligence
					</Button>
				</CardContent>
			</Card>

			<!-- Organization Progress -->
			<Card>
				<CardHeader>
					<CardTitle>Organization Setup</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span>Profile Completion</span>
							<span>85%</span>
						</div>
						<Progress value={85} class="h-2" />
					</div>
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span>Team Setup</span>
							<span>100%</span>
						</div>
						<Progress value={100} class="h-2" />
					</div>
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span>Verification</span>
							<span>60%</span>
						</div>
						<Progress value={60} class="h-2" />
					</div>
					<div class="pt-2">
						<Button variant="outline" size="sm" class="w-full">
							Complete Setup
						</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Recent Activity -->
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each recentActivity.slice(0, 4) as activity}
							<div class="flex items-start space-x-3">
								<div class="flex-shrink-0">
									<div
										class="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
									>
										<svg
											class="w-4 h-4 {getActivityColor(
												activity.type,
											)}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d={getActivityIcon(
													activity.type,
												)}
											/>
										</svg>
									</div>
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium truncate">
										{activity.title}
									</p>
									<p
										class="text-xs text-muted-foreground truncate"
									>
										{activity.description}
									</p>
									<p class="text-xs text-muted-foreground">
										{activity.time}
									</p>
									{#if activity.amount}
										<Badge variant="secondary" class="mt-1">
											{formatCurrency(activity.amount)}
										</Badge>
									{/if}
								</div>
							</div>
						{/each}
					</div>
					<div class="pt-4">
						<Button variant="ghost" size="sm" class="w-full">
							View All Activity
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Upcoming Tasks & Alerts -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Upcoming Tasks -->
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Tasks</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						<div
							class="flex items-center space-x-3 p-3 border rounded-lg"
						>
							<div class="w-2 h-2 bg-red-500 rounded-full"></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									Due diligence deadline
								</p>
								<p class="text-xs text-muted-foreground">
									TechFlow Inc. - Due in 2 days
								</p>
							</div>
						</div>
						<div
							class="flex items-center space-x-3 p-3 border rounded-lg"
						>
							<div
								class="w-2 h-2 bg-yellow-500 rounded-full"
							></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									Investment committee meeting
								</p>
								<p class="text-xs text-muted-foreground">
									Review 3 new opportunities - Tomorrow
								</p>
							</div>
						</div>
						<div
							class="flex items-center space-x-3 p-3 border rounded-lg"
						>
							<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
							<div class="flex-1">
								<p class="text-sm font-medium">
									Monthly portfolio review
								</p>
								<p class="text-xs text-muted-foreground">
									Prepare Q4 performance report - Friday
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Team Performance -->
			<Card>
				<CardHeader>
					<CardTitle>Team Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium">
									Active Deals per Member
								</p>
								<p class="text-xs text-muted-foreground">
									Average across team
								</p>
							</div>
							<div class="text-right">
								<p class="text-lg font-bold">2.1</p>
								<p class="text-xs text-green-600">
									+15% from last month
								</p>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium">
									Due Diligence Completion
								</p>
								<p class="text-xs text-muted-foreground">
									Time to complete
								</p>
							</div>
							<div class="text-right">
								<p class="text-lg font-bold">14 days</p>
								<p class="text-xs text-red-600">
									+2 days from target
								</p>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium">
									Investment Conversion
								</p>
								<p class="text-xs text-muted-foreground">
									Pipeline to investment
								</p>
							</div>
							<div class="text-right">
								<p class="text-lg font-bold">23%</p>
								<p class="text-xs text-green-600">
									+5% from last quarter
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
