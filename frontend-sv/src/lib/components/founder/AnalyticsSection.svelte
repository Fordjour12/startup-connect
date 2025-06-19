<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Progress } from "$lib/components/ui/progress";
	import AnalyticsIcon from "@tabler/icons-svelte/icons/chart-line";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";

	interface IndustryBenchmarks {
		avgViewTime: string;
		completionRate: number;
		avgSlides: number;
	}

	interface PerformanceAnalytics {
		mostEngagingSlides: Array<{
			name: string;
			avgTime: string;
		}>;
	}

	interface Props {
		industryBenchmarks: IndustryBenchmarks;
		performanceAnalytics: PerformanceAnalytics;
	}

	let { industryBenchmarks, performanceAnalytics }: Props = $props();
</script>

<div class="@xl/main:grid-cols-2 grid grid-cols-1 gap-6">
	<Card class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm">
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<AnalyticsIcon class="h-5 w-5" />
				Performance Overview
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center p-4 bg-background/50 rounded-lg border">
					<p class="text-2xl font-bold tabular-nums">
						{industryBenchmarks.avgViewTime}
					</p>
					<p class="text-sm text-muted-foreground">Avg. View Time</p>
				</div>
				<div class="text-center p-4 bg-background/50 rounded-lg border">
					<p class="text-2xl font-bold tabular-nums">
						{industryBenchmarks.completionRate}%
					</p>
					<p class="text-sm text-muted-foreground">Completion Rate</p>
				</div>
			</div>

			<div class="space-y-3">
				<h4 class="font-medium">Most Engaging Slides</h4>
				<div class="space-y-2">
					{#each performanceAnalytics.mostEngagingSlides.slice(0, 3) as slide}
						<div
							class="flex justify-between items-center p-2 bg-background/30 rounded"
						>
							<span class="text-sm">{slide.name}</span>
							<Badge variant="secondary" class="text-xs"
								>{slide.avgTime} avg</Badge
							>
						</div>
					{/each}
				</div>
			</div>
		</CardContent>
	</Card>

	<Card class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm">
		<CardHeader>
			<CardTitle>Industry Benchmarks</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<div
				class="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
			>
				<div class="flex items-center justify-center gap-2 mb-2">
					<TrendingUpIcon class="h-5 w-5 text-blue-600" />
					<p
						class="text-lg font-semibold text-blue-600 dark:text-blue-400"
					>
						Above Average
					</p>
				</div>
				<p class="text-sm text-muted-foreground">
					Your decks perform 23% better than industry average
				</p>
			</div>

			<div class="space-y-4">
				<div>
					<div class="flex justify-between mb-2">
						<span class="text-sm font-medium">Slide Count</span>
						<span class="text-sm"
							>12 vs {industryBenchmarks.avgSlides} avg</span
						>
					</div>
					<Progress value={85} class="h-2" />
				</div>
				<div>
					<div class="flex justify-between mb-2">
						<span class="text-sm font-medium">View Time</span>
						<span class="text-sm"
							>4:32 vs {industryBenchmarks.avgViewTime} avg</span
						>
					</div>
					<Progress value={92} class="h-2" />
				</div>
			</div>
		</CardContent>
	</Card>
</div>
