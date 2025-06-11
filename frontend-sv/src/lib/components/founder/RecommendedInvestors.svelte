<script lang="ts">
	import SendPitchModal from "$lib/components/SendPitchModal.svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	import {
		DollarSignIcon,
		EyeIcon,
		InfoIcon,
		MailIcon,
		MapPinIcon,
		RefreshCwIcon,
		SparklesIcon,
		TrendingUpIcon,
	} from "@lucide/svelte";

	import { ApiEndpoint } from "$lib/endpoints";
	import type {
		InvestorRecommendation,
		RecommendationResponse,
	} from "$lib/types";
	import { onMount } from "svelte";

	let { user }: { user: any } = $props();

	let isLoading = $state(true);
	let isRefreshing = $state(false);
	let error = $state<string | null>(null);
	let recommendations = $state<InvestorRecommendation[]>([]);
	let startupProfile = $state<any>(null);
	let selectedInvestor = $state<InvestorRecommendation | null>(null);
	let showPitchModal = $state(false);
	let showExplanationDialog = $state(false);
	let algorithmExplanation = $state<string>("");

		const URL_RECOMMENDATIONS = `http://localhost:8000/api/v1`;
	// Fetch recommendations from API
	async function fetchRecommendations() {
		try {
			const response = await fetch(`${URL_RECOMMENDATIONS}${ApiEndpoint.GET_RECOMMENDATIONS}`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch recommendations: ${response.statusText}`,
				);
			}

			const data: RecommendationResponse = await response.json();
			recommendations = data.recommendations;
			startupProfile = data.startup_profile;
			error = null;
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: "Failed to load recommendations";
			console.error("Error fetching recommendations:", err);
		} finally {
			isLoading = false;
			isRefreshing = false;
		}
	}

	// Fetch algorithm explanation
	async function fetchAlgorithmExplanation() {
		try {
			const response = await fetch(
				`${URL_RECOMMENDATIONS}${ApiEndpoint.GET_RECOMMENDATION_EXPLANATION}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				const data = await response.json();
				algorithmExplanation = data.explanation;
			}
		} catch (err) {
			console.error("Error fetching algorithm explanation:", err);
		}
	}

	// Refresh recommendations
	async function refreshRecommendations() {
		isRefreshing = true;
		await fetchRecommendations();
	}

	// Format funding range for display
	function formatFundingRange(
		range: { min_amount: number; max_amount: number } | undefined,
	): string {
		if (!range) return "Range not specified";

		const formatAmount = (amount: number) => {
			if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
			if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
			return `$${amount}`;
		};

		return `${formatAmount(range.min_amount)} - ${formatAmount(range.max_amount)}`;
	}

	// Get score color based on value
	function getScoreColor(score: number): string {
		if (score >= 0.8) return "text-green-600";
		if (score >= 0.6) return "text-blue-600";
		if (score >= 0.4) return "text-yellow-600";
		return "text-red-600";
	}

	// Get score description
	function getScoreDescription(score: number): string {
		if (score >= 0.9) return "Excellent Match";
		if (score >= 0.8) return "Very Good Match";
		if (score >= 0.7) return "Good Match";
		if (score >= 0.6) return "Moderate Match";
		if (score >= 0.5) return "Fair Match";
		return "Low Match";
	}

	// Handle view profile action
	function viewProfile(investor: InvestorRecommendation) {
		window.open(`/dashboard/founder/investors/${investor.id}`, "_blank");
	}

	// Handle send pitch action
	function sendPitch(investor: InvestorRecommendation) {
		selectedInvestor = investor;
		showPitchModal = true;
	}

	// Load recommendations on component mount
	onMount(() => {
		fetchRecommendations();
		fetchAlgorithmExplanation();
	});
</script>

<div class="space-y-6">
	<!-- Header with title and refresh button -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<SparklesIcon class="h-5 w-5 text-primary" />
			<h2 class="text-xl font-semibold">Recommended Investors</h2>
			{#if startupProfile}
				<Badge variant="outline"
					>{recommendations.length} matches found</Badge
				>
			{/if}
		</div>

		<div class="flex gap-2">
			<!-- <Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						size="sm"
						onclick={() => (showExplanationDialog = true)}
					>
						<InfoIcon class="h-4 w-4" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>How recommendations work</p>
				</Tooltip.Content>
			</Tooltip.Root> -->

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger
						class={buttonVariants({ variant: "outline" })}
					>
						Hover
						<InfoIcon class="size-4" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>How recommendations work</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>

			<Button
				variant="outline"
				size="sm"
				onclick={refreshRecommendations}
				disabled={isRefreshing}
			>
				<RefreshCwIcon
					class="h-4 w-4 {isRefreshing ? 'animate-spin' : ''}"
				/>
				Refresh
			</Button>
		</div>
	</div>

	<!-- Loading state -->
	{#if isLoading}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-3">
							<Skeleton class="h-10 w-10 rounded-full" />
							<div class="space-y-2">
								<Skeleton class="h-4 w-24" />
								<Skeleton class="h-3 w-20" />
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<Skeleton class="h-20 w-full" />
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Error state -->
	{:else if error}
		<Card.Root class="border-red-200">
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="text-red-600 mb-4">{error}</p>
					<Button onclick={fetchRecommendations} variant="outline">
						Try Again
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Empty state -->
	{:else if recommendations.length === 0}
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<SparklesIcon
						class="h-12 w-12 text-muted-foreground mx-auto mb-4"
					/>
					<h3 class="text-lg font-medium mb-2">
						No Recommendations Available
					</h3>
					<p class="text-muted-foreground mb-4">
						Complete your startup profile to get personalized
						investor recommendations.
					</p>
					<Button href="/dashboard/founder/startup">
						Complete Profile
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Recommendations grid -->
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each recommendations as investor (investor.id)}
				<Card.Root class="hover:shadow-lg transition-shadow group">
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<Avatar.Root class="h-10 w-10">
									<Avatar.Image
										src={investor.avatar}
										alt={investor.name}
									/>
									<Avatar.Fallback>
										{investor.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</Avatar.Fallback>
								</Avatar.Root>
								<div class="min-w-0 flex-1">
									<h3
										class="font-medium text-sm leading-tight"
									>
										{investor.name}
									</h3>
									<p class="text-xs text-muted-foreground">
										{investor.firm}
									</p>
									{#if investor.title}
										<p
											class="text-xs text-muted-foreground"
										>
											{investor.title}
										</p>
									{/if}
								</div>
							</div>
							<div class="text-right">
								<div
									class="text-lg font-bold {getScoreColor(
										investor.score,
									)}"
								>
									{Math.round(investor.score * 100)}%
								</div>
								<div class="text-xs text-muted-foreground">
									{getScoreDescription(investor.score)}
								</div>
							</div>
						</div>

						<!-- Score progress bar -->
						<Progress value={investor.score * 100} class="h-1.5" />
					</Card.Header>

					<Card.Content class="space-y-3">
						<!-- Investment focus -->
						<div>
							<div
								class="text-xs font-medium text-muted-foreground mb-1"
							>
								Focus Areas
							</div>
							<div class="flex flex-wrap gap-1">
								{#each investor.investment_focus.slice(0, 3) as focus}
									<Badge
										variant="secondary"
										class="text-xs px-2 py-0.5"
										>{focus}</Badge
									>
								{/each}
								{#if investor.investment_focus.length > 3}
									<Badge
										variant="outline"
										class="text-xs px-2 py-0.5"
									>
										+{investor.investment_focus.length - 3}
									</Badge>
								{/if}
							</div>
						</div>

						<!-- Key details -->
						<div class="grid grid-cols-2 gap-2 text-xs">
							{#if investor.location}
								<div class="flex items-center gap-1">
									<MapPinIcon
										class="h-3 w-3 text-muted-foreground"
									/>
									<span class="truncate"
										>{investor.location}</span
									>
								</div>
							{/if}
							{#if investor.funding_range}
								<div class="flex items-center gap-1">
									<DollarSignIcon
										class="h-3 w-3 text-muted-foreground"
									/>
									<span class="truncate"
										>{formatFundingRange(
											investor.funding_range,
										)}</span
									>
								</div>
							{/if}
						</div>

						<!-- Top reasons -->
						<div>
							<div
								class="text-xs font-medium text-muted-foreground mb-1"
							>
								Why This Match
							</div>
							<div class="space-y-1">
								{#each investor.reasons.slice(0, 2) as reason}
									<div class="flex items-center gap-2">
										<TrendingUpIcon
											class="h-3 w-3 text-green-600"
										/>
										<span class="text-xs"
											>{reason.description}</span
										>
									</div>
								{/each}
								{#if investor.reasons.length > 2}
									<div class="text-xs text-muted-foreground">
										+{investor.reasons.length - 2} more reasons
									</div>
								{/if}
							</div>
						</div>
					</Card.Content>

					<Card.Footer class="pt-3 gap-2">
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={() => viewProfile(investor)}
						>
							<EyeIcon class="h-3 w-3" />
							View Profile
						</Button>
						<Button
							size="sm"
							class="flex-1"
							onclick={() => sendPitch(investor)}
						>
							<MailIcon class="h-3 w-3" />
							Send Pitch
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>

<!-- Algorithm Explanation Dialog -->
<Dialog.Root bind:open={showExplanationDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<InfoIcon class="h-5 w-5" />
				How Recommendations Work
			</Dialog.Title>
			<Dialog.Description>
				Understanding our matching algorithm
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="h-60">
			<div class="space-y-4 text-sm">
				<div>
					<h4 class="font-medium mb-2">Scoring Criteria</h4>
					<ul class="space-y-1 text-muted-foreground">
						<li>
							• <strong>Industry Match (40%):</strong> Alignment with
							investor's focus areas
						</li>
						<li>
							• <strong>Stage Match (30%):</strong> Compatibility with
							funding stage preferences
						</li>
						<li>
							• <strong>Location (15%):</strong> Geographic proximity
							and preferences
						</li>
						<li>
							• <strong>Funding Amount (10%):</strong> Investment range
							compatibility
						</li>
						<li>
							• <strong>Profile Quality (5%):</strong> Completeness
							of startup profile
						</li>
					</ul>
				</div>

				{#if algorithmExplanation}
					<div>
						<h4 class="font-medium mb-2">Additional Details</h4>
						<p class="text-muted-foreground text-sm">
							{algorithmExplanation}
						</p>
					</div>
				{/if}
			</div>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>

<!-- Send Pitch Modal -->
{#if showPitchModal && selectedInvestor}
	<SendPitchModal
		bind:isOpen={showPitchModal}
		investorId={selectedInvestor.id}
		investorName={selectedInvestor.name}
	/>
{/if}
