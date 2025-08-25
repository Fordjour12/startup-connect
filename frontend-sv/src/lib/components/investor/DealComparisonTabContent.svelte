<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardFooter } from "$lib/components/ui/card";

	// Define necessary types
	interface Deal {
		id: number;
		name: string;
		logo: string;
	}

	interface ComparisonMetric {
		id: string;
		name: string;
		description: string;
	}

	interface DealEvaluation {
		dealId: number;
		metrics: Record<string, string | number>; // Assuming metric values can be string or number
		strengths: string[];
		weaknesses: string[];
	}

	let {
		dealEvaluations,
		comparisonMetrics,
		getDealById,
	}: {
		dealEvaluations: DealEvaluation[];
		comparisonMetrics: ComparisonMetric[];
		getDealById: (id: number) => Deal | undefined;
	} = $props();
</script>

<div class="space-y-6">
	<div>
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-xl font-semibold">Deal Comparison</h3>
			<Button variant="outline" size="sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-2"
					><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg
				>
				New Comparison
			</Button>
		</div>

		<Card>
			<CardContent class="p-0">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[800px]">
						<thead>
							<tr class="border-b">
								<th class="text-left p-4 font-medium text-sm sticky left-0 bg-card z-10 w-1/4">
									Metrics
								</th>
								{#each dealEvaluations as evaluation}
									{@const deal = getDealById(evaluation.dealId)}
									{#if deal}
										<th class="text-left p-4 font-medium text-sm w-1/4">
											<div class="flex items-center gap-2">
												<img src={deal.logo} alt={deal.name} class="w-6 h-6 rounded-full" />
												{deal.name}
											</div>
										</th>
									{/if}
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each comparisonMetrics as metric}
								<tr class="border-b hover:bg-muted/50">
									<td class="p-4 sticky left-0 bg-card hover:bg-muted/50 z-10 w-1/4">
										<div class="font-medium text-sm">{metric.name}</div>
										<div class="text-xs text-muted-foreground">{metric.description}</div>
									</td>
									{#each dealEvaluations as evaluation}
										<td class="p-4 text-sm w-1/4">
											{#if evaluation.metrics[metric.id as keyof typeof evaluation.metrics]}
												{evaluation.metrics[metric.id as keyof typeof evaluation.metrics]}
											{:else}
												<span class="text-muted-foreground">-</span>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
							<!-- Strengths row -->
							<tr class="border-b hover:bg-muted/50">
								<td class="p-4 sticky left-0 bg-card hover:bg-muted/50 z-10 w-1/4">
									<div class="font-medium text-sm">Strengths</div>
									<div class="text-xs text-muted-foreground">Key strengths of the opportunity</div>
								</td>
								{#each dealEvaluations as evaluation}
									<td class="p-4 w-1/4">
										<ul class="list-disc list-inside text-sm space-y-1">
											{#each evaluation.strengths as strength}
												<li>{strength}</li>
											{/each}
										</ul>
									</td>
								{/each}
							</tr>
							<!-- Weaknesses row -->
							<tr class="border-b hover:bg-muted/50">
								<td class="p-4 sticky left-0 bg-card hover:bg-muted/50 z-10 w-1/4">
									<div class="font-medium text-sm">Weaknesses</div>
									<div class="text-xs text-muted-foreground">Key concerns with the opportunity</div>
								</td>
								{#each dealEvaluations as evaluation}
									<td class="p-4 w-1/4">
										<ul class="list-disc list-inside text-sm space-y-1">
											{#each evaluation.weaknesses as weakness}
												<li>{weakness}</li>
											{/each}
										</ul>
									</td>
								{/each}
							</tr>
						</tbody>
					</table>
				</div>
			</CardContent>
			<CardFooter class="border-t p-4">
				<div class="flex justify-end gap-2 w-full">
					<Button variant="outline" size="sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2"
							><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline
								points="7 10 12 15 17 10"
							></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg
						>
						Export Comparison
					</Button>
					<Button size="sm">Generate Report</Button>
				</div>
			</CardFooter>
		</Card>
	</div>
</div> 