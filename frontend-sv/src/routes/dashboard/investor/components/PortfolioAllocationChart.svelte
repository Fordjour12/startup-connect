<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { PieChart } from "layerchart";

	export let portfolioData: {
		totalInvested: number;
		currentValue: number;
		returns: number;
		allocation: Record<string, number>;
		historicalValues: number[];
	};

	// Transform allocation data into chart format
	const chartData = [
		{
			sector: "tech",
			value: portfolioData.allocation.tech,
			color: "rgb(59, 130, 246)",
		},
		{
			sector: "health",
			value: portfolioData.allocation.health,
			color: "rgb(34, 197, 94)",
		},
		{
			sector: "fintech",
			value: portfolioData.allocation.fintech,
			color: "rgb(168, 85, 247)",
		},
		{
			sector: "consumer",
			value: portfolioData.allocation.consumer,
			color: "rgb(251, 191, 36)",
		},
	];

	const chartConfig = {
		value: { label: "Allocation" },
		tech: { label: "Tech", color: "rgb(59, 130, 246)" },
		health: { label: "Health", color: "rgb(34, 197, 94)" },
		fintech: { label: "Fintech", color: "rgb(168, 85, 247)" },
		consumer: { label: "Consumer", color: "rgb(251, 191, 36)" },
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col">
	<Card.Header class="items-center">
		<Card.Title>Portfolio Allocation</Card.Title>
		<Card.Description>Current investment distribution</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container
			config={chartConfig}
			class="mx-auto aspect-square max-h-[250px]"
		>
			<PieChart
				data={chartData}
				key="sector"
				value="value"
				c="color"
				innerRadius={60}
				padding={29}
				props={{ pie: { motion: "tween" } }}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex-col gap-2 text-sm">
		<div class="flex items-center gap-2 font-medium leading-none">
			Total Portfolio Value: ${portfolioData.currentValue.toLocaleString()}
		</div>
		<div class="text-muted-foreground leading-none">
			Showing current allocation by sector
		</div>
	</Card.Footer>
</Card.Root>
