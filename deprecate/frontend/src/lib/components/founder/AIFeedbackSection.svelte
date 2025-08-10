<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import AnalyticsIcon from "@tabler/icons-svelte/icons/chart-line";
	import StarIcon from "@tabler/icons-svelte/icons/star";

	interface Deck {
		id: string;
		name: string;
		status: string;
		feedback: {
			score: number;
			strengths: string[];
			improvements: string[];
		};
	}

	interface Props {
		pitchDecks: Deck[];
	}

	let { pitchDecks }: Props = $props();

	function getFeedbackColor(score: number) {
		if (score >= 85) return "text-green-600";
		if (score >= 70) return "text-yellow-600";
		return "text-red-600";
	}
</script>

<Card class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<StarIcon class="h-5 w-5" />
			AI-Powered Pitch Analysis
		</CardTitle>
		<CardDescription>
			Get intelligent feedback on your pitch deck structure and content
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-6">
		{#if pitchDecks.length > 0}
			{#each pitchDecks.filter((deck) => deck.status === "active") as deck}
				<div class="p-6 bg-background/50 rounded-lg border space-y-4">
					<div class="flex items-center justify-between">
						<h4 class="font-semibold text-lg">{deck.name}</h4>
						<Badge
							variant="outline"
							class="{getFeedbackColor(
								deck.feedback.score,
							)} border-current"
						>
							Score: {deck.feedback.score}/100
						</Badge>
					</div>

					<div class="@lg/main:grid-cols-2 grid grid-cols-1 gap-6">
						<div class="space-y-3">
							<h5
								class="font-medium text-green-600 dark:text-green-400 flex items-center gap-2"
							>
								<span class="w-2 h-2 bg-green-500 rounded-full"
								></span>
								Strengths
							</h5>
							<div class="space-y-2">
								{#each deck.feedback.strengths as strength}
									<div
										class="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded"
									>
										<span
											class="w-1 h-1 bg-green-500 rounded-full"
										></span>
										<span class="text-sm">{strength}</span>
									</div>
								{/each}
							</div>
						</div>

						<div class="space-y-3">
							<h5
								class="font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2"
							>
								<span class="w-2 h-2 bg-yellow-500 rounded-full"
								></span>
								Improvements
							</h5>
							<div class="space-y-2">
								{#each deck.feedback.improvements as improvement}
									<div
										class="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded"
									>
										<span
											class="w-1 h-1 bg-yellow-500 rounded-full"
										></span>
										<span class="text-sm"
											>{improvement}</span
										>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="flex gap-3 pt-2">
						<Button variant="outline" size="sm" class="gap-2">
							<AnalyticsIcon class="h-4 w-4" />
							Detailed Analysis
						</Button>
						<Button variant="outline" size="sm" class="gap-2">
							<StarIcon class="h-4 w-4" />
							AI Suggestions
						</Button>
					</div>
				</div>
			{/each}
		{:else}
			<div class="text-center py-12">
				<div
					class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<StarIcon class="h-10 w-10 text-muted-foreground" />
				</div>
				<h3 class="font-semibold text-xl mb-3">No decks to analyze</h3>
				<p class="text-muted-foreground mb-6 max-w-md mx-auto">
					Upload a pitch deck to get AI-powered feedback and insights
				</p>
			</div>
		{/if}
	</CardContent>
</Card>
