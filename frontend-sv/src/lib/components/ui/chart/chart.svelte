<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { cn } from "$lib/utils";
    import type { Proportions } from "@lucide/svelte";
    import Card from "../card/card.svelte";

    // Chart.js needs to be imported dynamically for SSR compatibility
    let Chart: any;

    type ChartType =
        | "line"
        | "bar"
        | "radar"
        | "doughnut"
        | "pie"
        | "polarArea"
        | "bubble"
        | "scatter";

    interface ChartProps {
        type: ChartType;
        data: Record<string, any>;
        options: Record<string, any>;
        width: string;
        height: string;
        className: string;
    }

    let {
        type = "line",
        data = {},
        options = {},
        width = "100%",
        height = "300px",
        className = "",
    }: ChartProps = $props();

    let chartElement: HTMLCanvasElement;
    let chartInstance: any;

    onMount(async () => {
        // Dynamically import Chart.js for client-side rendering
        const ChartModule = await import("chart.js/auto");
        Chart = ChartModule.default;

        // Register any necessary controllers, elements, scales, etc.

        // Create chart instance
        if (chartElement) {
            chartInstance = new Chart(chartElement.getContext("2d"), {
                type,
                data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    ...options,
                },
            });
        }
    });

    // Update chart when data or options change
    $effect(() => {
        if (chartInstance) {
            chartInstance.data = data;
            chartInstance.options = {
                responsive: true,
                maintainAspectRatio: false,
                ...options,
            };
            chartInstance.update();
        }
    });

    // Clean up chart instance on component destroy
    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
</script>

<div
    style="width: {width}; height: {height};"
    class={cn("chart-container", className)}
>
    <canvas bind:this={chartElement}></canvas>
</div>
