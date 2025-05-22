<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import { scaleUtc } from "d3-scale";
	import { curveNatural } from "d3-shape";
	import { LineChart } from "layerchart";

	export let portfolioData: {
		totalInvested: number;
		currentValue: number;
		returns: number;
		allocation: Record<string, number>;
		historicalValues: number[];
	};

	// Transform historical values into chart data
	const chartData = portfolioData.historicalValues.map((value, index) => ({
		date: new Date(2023, 8 + index, 1), // Starting from September 2023
		portfolio: value,
	}));

	const chartConfig = {
		portfolio: { label: "Portfolio Value", color: "var(--chart-1)" },
	} satisfies Chart.ChartConfig;

	// Calculate percentage change
	const percentageChange =
		((portfolioData.currentValue - portfolioData.totalInvested) /
			portfolioData.totalInvested) *
		100;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Portfolio Performance</Card.Title>
		<Card.Description>Showing portfolio value over time</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig}>
			<LineChart
				data={chartData}
				x="date"
				xScale={scaleUtc()}
				axis="x"
				series={[
					{
						key: "portfolio",
						label: "Portfolio Value",
						color: chartConfig.portfolio.color,
					},
				]}
				props={{
					spline: {
						curve: curveNatural,
						motion: "tween",
						strokeWidth: 2,
					},
					xAxis: {
						format: (v: Date) =>
							v.toLocaleDateString("en-US", { month: "short" }),
					},
					highlight: { points: { r: 4 } },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 font-medium leading-none">
					{percentageChange > 0 ? "Trending up" : "Trending down"} by {Math.abs(
						percentageChange,
					).toFixed(1)}%
					{#if percentageChange > 0}
						<TrendingUpIcon class="size-4" />
					{:else}
						<TrendingUpIcon class="size-4 rotate-180" />
					{/if}
				</div>
				<div
					class="text-muted-foreground flex items-center gap-2 leading-none"
				>
					September 2023 - June 2024
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
