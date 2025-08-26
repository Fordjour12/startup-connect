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
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import { INVESTMENT_STAGES, PIPELINE_STAGES } from "$lib/db/schema";

	let portfolio = $state([]);
	let pipeline = $state([]);
	let metrics = $state(null);
	let isLoading = $state(true);
	let searchQuery = $state("");
	let stageFilter = $state("all");
	let showAddInvestmentDialog = $state(false);

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			portfolio = [
				{
					id: "1",
					startupName: "TechFlow Inc.",
					startupLogo: null,
					industry: "SaaS",
					stage: INVESTMENT_STAGES.SERIES_A,
					investmentAmount: 250000,
					investmentDate: "2024-01-15T00:00:00Z",
					equityPercentage: 8.5,
					currentValue: 320000,
					status: "active",
					lastUpdated: "2024-12-15T00:00:00Z",
					description: "AI-powered workflow automation platform",
				},
				{
					id: "2",
					startupName: "GreenEnergy Solutions",
					startupLogo: null,
					industry: "CleanTech",
					stage: INVESTMENT_STAGES.SEED,
					investmentAmount: 150000,
					investmentDate: "2024-03-01T00:00:00Z",
					equityPercentage: 12.0,
					currentValue: 180000,
					status: "active",
					lastUpdated: "2024-12-10T00:00:00Z",
					description: "Renewable energy optimization software",
				},
				{
					id: "3",
					startupName: "HealthTech Analytics",
					startupLogo: null,
					industry: "HealthTech",
					stage: INVESTMENT_STAGES.SERIES_B,
					investmentAmount: 500000,
					investmentDate: "2024-06-15T00:00:00Z",
					equityPercentage: 6.8,
					currentValue: 650000,
					status: "active",
					lastUpdated: "2024-12-12T00:00:00Z",
					description: "Healthcare data analytics platform",
				},
				{
					id: "4",
					startupName: "FinTech Payments",
					startupLogo: null,
					industry: "FinTech",
					stage: INVESTMENT_STAGES.SERIES_A,
					investmentAmount: 300000,
					investmentDate: "2024-09-01T00:00:00Z",
					equityPercentage: 7.2,
					currentValue: 280000,
					status: "active",
					lastUpdated: "2024-12-08T00:00:00Z",
					description: "Next-generation payment processing",
				},
			];

			pipeline = [
				{
					id: "p1",
					startupName: "EduTech Platform",
					stage: PIPELINE_STAGES.DUE_DILIGENCE,
					proposedAmount: 200000,
					priority: "high",
					lastUpdated: "2024-12-14T00:00:00Z",
				},
				{
					id: "p2",
					startupName: "Logistics AI",
					stage: PIPELINE_STAGES.INITIAL_SCREENING,
					proposedAmount: 400000,
					priority: "medium",
					lastUpdated: "2024-12-13T00:00:00Z",
				},
				{
					id: "p3",
					startupName: "Retail Analytics",
					stage: PIPELINE_STAGES.PARTNER_REVIEW,
					proposedAmount: 350000,
					priority: "high",
					lastUpdated: "2024-12-12T00:00:00Z",
				},
			];

			metrics = {
				totalInvested: portfolio.reduce(
					(sum, inv) => sum + inv.investmentAmount,
					0,
				),
				currentValue: portfolio.reduce(
					(sum, inv) => sum + inv.currentValue,
					0,
				),
				totalReturn: portfolio.reduce(
					(sum, inv) =>
						sum + (inv.currentValue - inv.investmentAmount),
					0,
				),
				averageReturn: 0,
				activeInvestments: portfolio.filter(
					(inv) => inv.status === "active",
				).length,
				pipelineDeals: pipeline.length,
				bestPerformer: "HealthTech Analytics",
				worstPerformer: "FinTech Payments",
			};

			metrics.averageReturn =
				(metrics.totalReturn / metrics.totalInvested) * 100;
		} catch (error) {
			console.error("Error loading portfolio data:", error);
		} finally {
			isLoading = false;
		}
	});

	let newInvestment = $state({
		startupName: "",
		industry: "",
		stage: INVESTMENT_STAGES.SEED,
		investmentAmount: "",
		investmentDate: "",
		equityPercentage: "",
		description: "",
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	}

	function calculateReturn(investment: any): number {
		return (
			((investment.currentValue - investment.investmentAmount) /
				investment.investmentAmount) *
			100
		);
	}

	function getStageColor(stage: string): string {
		const colors: Record<string, string> = {
			[INVESTMENT_STAGES.SEED]: "bg-green-100 text-green-800",
			[INVESTMENT_STAGES.SERIES_A]: "bg-blue-100 text-blue-800",
			[INVESTMENT_STAGES.SERIES_B]: "bg-purple-100 text-purple-800",
			[INVESTMENT_STAGES.GROWTH]: "bg-orange-100 text-orange-800",
			[INVESTMENT_STAGES.LATE_STAGE]: "bg-red-100 text-red-800",
		};
		return colors[stage] || "bg-gray-100 text-gray-800";
	}

	function getPipelineStageColor(stage: string): string {
		const colors: Record<string, string> = {
			[PIPELINE_STAGES.DISCOVERY]: "bg-gray-100 text-gray-800",
			[PIPELINE_STAGES.INITIAL_SCREENING]:
				"bg-yellow-100 text-yellow-800",
			[PIPELINE_STAGES.DUE_DILIGENCE]: "bg-blue-100 text-blue-800",
			[PIPELINE_STAGES.PARTNER_REVIEW]: "bg-purple-100 text-purple-800",
			[PIPELINE_STAGES.FINAL_DECISION]: "bg-orange-100 text-orange-800",
		};
		return colors[stage] || "bg-gray-100 text-gray-800";
	}

	function addInvestment() {
		if (!newInvestment.startupName || !newInvestment.investmentAmount) {
			alert("Please fill in required fields");
			return;
		}

		// Add to portfolio (in real app, this would be an API call)
		const investment = {
			id: `inv-${Date.now()}`,
			startupName: newInvestment.startupName,
			startupLogo: null,
			industry: newInvestment.industry,
			stage: newInvestment.stage,
			investmentAmount: parseInt(newInvestment.investmentAmount),
			investmentDate:
				newInvestment.investmentDate || new Date().toISOString(),
			equityPercentage: parseFloat(newInvestment.equityPercentage),
			currentValue: parseInt(newInvestment.investmentAmount), // Start with invested amount
			status: "active",
			lastUpdated: new Date().toISOString(),
			description: newInvestment.description,
		};

		portfolio = [...portfolio, investment];

		// Reset form
		newInvestment = {
			startupName: "",
			industry: "",
			stage: INVESTMENT_STAGES.SEED,
			investmentAmount: "",
			investmentDate: "",
			equityPercentage: "",
			description: "",
		};

		showAddInvestmentDialog = false;
	}

	$: filteredPortfolio = portfolio.filter(
		(investment) =>
			(stageFilter === "all" || investment.stage === stageFilter) &&
			(investment.startupName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
				investment.industry
					.toLowerCase()
					.includes(searchQuery.toLowerCase())),
	);

	$: filteredPipeline = pipeline.filter((deal) =>
		deal.startupName.toLowerCase().includes(searchQuery.toLowerCase()),
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Portfolio</h1>
			<p class="text-muted-foreground">
				Track and manage your investment portfolio
			</p>
		</div>
		<div class="flex space-x-3">
			<Input
				bind:value={searchQuery}
				placeholder="Search investments..."
				class="w-64"
			/>
			<Select
				bind:value={stageFilter}
				options={[
					{ value: "all", label: "All Stages" },
					{ value: INVESTMENT_STAGES.SEED, label: "Seed" },
					{ value: INVESTMENT_STAGES.SERIES_A, label: "Series A" },
					{ value: INVESTMENT_STAGES.SERIES_B, label: "Series B" },
					{ value: INVESTMENT_STAGES.GROWTH, label: "Growth" },
				]}
				class="w-40"
			/>
			<Dialog bind:open={showAddInvestmentDialog}>
				<DialogTrigger asChild>
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
				</DialogTrigger>
				<DialogContent class="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Add New Investment</DialogTitle>
					</DialogHeader>
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="startup-name"
									class="block text-sm font-medium mb-2"
								>
									Startup Name *
								</label>
								<Input
									id="startup-name"
									bind:value={newInvestment.startupName}
									placeholder="e.g., TechFlow Inc."
								/>
							</div>
							<div>
								<label
									for="industry"
									class="block text-sm font-medium mb-2"
								>
									Industry
								</label>
								<Input
									id="industry"
									bind:value={newInvestment.industry}
									placeholder="e.g., SaaS"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="stage"
									class="block text-sm font-medium mb-2"
								>
									Investment Stage
								</label>
								<Select
									id="stage"
									bind:value={newInvestment.stage}
									options={[
										{
											value: INVESTMENT_STAGES.SEED,
											label: "Seed",
										},
										{
											value: INVESTMENT_STAGES.SERIES_A,
											label: "Series A",
										},
										{
											value: INVESTMENT_STAGES.SERIES_B,
											label: "Series B",
										},
										{
											value: INVESTMENT_STAGES.GROWTH,
											label: "Growth",
										},
									]}
								/>
							</div>
							<div>
								<label
									for="investment-amount"
									class="block text-sm font-medium mb-2"
								>
									Investment Amount ($) *
								</label>
								<Input
									id="investment-amount"
									bind:value={newInvestment.investmentAmount}
									placeholder="250000"
									type="number"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="equity-percentage"
									class="block text-sm font-medium mb-2"
								>
									Equity Percentage (%)
								</label>
								<Input
									id="equity-percentage"
									bind:value={newInvestment.equityPercentage}
									placeholder="8.5"
									type="number"
									step="0.1"
								/>
							</div>
							<div>
								<label
									for="investment-date"
									class="block text-sm font-medium mb-2"
								>
									Investment Date
								</label>
								<Input
									id="investment-date"
									bind:value={newInvestment.investmentDate}
									type="date"
								/>
							</div>
						</div>

						<div>
							<label
								for="description"
								class="block text-sm font-medium mb-2"
							>
								Description
							</label>
							<textarea
								id="description"
								bind:value={newInvestment.description}
								placeholder="Brief description of the investment..."
								class="textarea textarea-bordered w-full"
								rows={3}
							/>
						</div>

						<div class="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onclick={() =>
									(showAddInvestmentDialog = false)}
							>
								Cancel
							</Button>
							<Button onclick={addInvestment}>
								Add Investment
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
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
		<!-- Portfolio Metrics -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
						{metrics.activeInvestments} active investments
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Current Value
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{formatCurrency(metrics.currentValue)}
					</div>
					<p class="text-xs text-green-600">
						+{formatCurrency(metrics.totalReturn)} total return
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Average Return
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{metrics.averageReturn.toFixed(1)}%
					</div>
					<p class="text-xs text-muted-foreground">
						Across all investments
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="pb-2">
					<CardTitle
						class="text-sm font-medium text-muted-foreground"
					>
						Pipeline Deals
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{metrics.pipelineDeals}
					</div>
					<p class="text-xs text-muted-foreground">
						In active consideration
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Investment Portfolio -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">
					Investment Portfolio ({filteredPortfolio.length})
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-4">
				{#each filteredPortfolio as investment}
					<Card>
						<CardContent class="p-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-4">
									{#if investment.startupLogo}
										<img
											src={investment.startupLogo}
											alt={investment.startupName}
											class="w-12 h-12 rounded-lg object-cover"
										/>
									{:else}
										<div
											class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
										>
											<span
												class="text-primary font-semibold text-lg"
											>
												{investment.startupName
													.charAt(0)
													.toUpperCase()}
											</span>
										</div>
									{/if}
									<div>
										<div
											class="flex items-center space-x-2"
										>
											<h3 class="font-semibold">
												{investment.startupName}
											</h3>
											<Badge
												class={getStageColor(
													investment.stage,
												)}
											>
												{investment.stage.replace(
													"_",
													" ",
												)}
											</Badge>
										</div>
										<p
											class="text-sm text-muted-foreground"
										>
											{investment.industry}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											{investment.description}
										</p>
										<div
											class="flex items-center space-x-4 mt-2"
										>
											<span class="text-sm">
												<strong>Invested:</strong>
												{formatCurrency(
													investment.investmentAmount,
												)}
											</span>
											<span class="text-sm">
												<strong>Current:</strong>
												{formatCurrency(
													investment.currentValue,
												)}
											</span>
											<span
												class={`text-sm font-medium ${
													calculateReturn(
														investment,
													) >= 0
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												Return: {calculateReturn(
													investment,
												).toFixed(1)}%
											</span>
										</div>
									</div>
								</div>

								<div class="flex items-center space-x-2">
									<Button variant="outline" size="sm">
										View Details
									</Button>
									<Button variant="outline" size="sm">
										Update Value
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Pipeline Deals -->
		{#if filteredPipeline.length > 0}
			<div class="space-y-4">
				<h2 class="text-xl font-semibold">
					Pipeline Deals ({filteredPipeline.length})
				</h2>

				<div class="grid grid-cols-1 gap-4">
					{#each filteredPipeline as deal}
						<Card>
							<CardContent class="p-6">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-4">
										<div
											class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"
										>
											<svg
												class="w-6 h-6 text-muted-foreground"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
												/>
											</svg>
										</div>
										<div>
											<h3 class="font-semibold">
												{deal.startupName}
											</h3>
											<div
												class="flex items-center space-x-2 mt-1"
											>
												<Badge
													class={getPipelineStageColor(
														deal.stage,
													)}
												>
													{deal.stage.replace(
														"_",
														" ",
													)}
												</Badge>
												<Badge
													variant={deal.priority ===
													"high"
														? "destructive"
														: "secondary"}
												>
													{deal.priority} priority
												</Badge>
											</div>
											<p
												class="text-sm text-muted-foreground mt-1"
											>
												Proposed: {formatCurrency(
													deal.proposedAmount,
												)}
											</p>
										</div>
									</div>

									<div class="flex items-center space-x-2">
										<Button variant="outline" size="sm">
											View Details
										</Button>
										<Button variant="outline" size="sm">
											Start Due Diligence
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
