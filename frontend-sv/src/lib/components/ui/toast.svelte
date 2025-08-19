<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { AlertCircle, CheckCircle, X } from "@lucide/svelte";
	import { cn } from "@/utils";

	export let message: string;
	export let type: "success" | "error" | "warning" | "info" = "info";
	export let duration = 5000;
	export let show = false;

	const dispatch = createEventDispatcher();

	let timeoutId: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (show) {
			timeoutId = setTimeout(() => {
				show = false;
				dispatch("close");
			}, duration);
		}
	});

	function handleClose() {
		show = false;
		dispatch("close");
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	}

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertCircle,
		info: AlertCircle,
	};

	const colors = {
		success: "bg-success border-success text-success",
		error: "bg-error border-error text-error",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
		info: "bg-info border-info text-info",
	};

	const Icon = icons[type];
</script>

{#if show}
	<div
		class={cn(
			"fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300",
			colors[type],
		)}
		role="alert"
	>
		<Icon class="h-5 w-5 flex-shrink-0" />
		<p class="text-sm font-medium">{message}</p>
		<button
			onclick={handleClose}
			class="ml-auto flex-shrink-0 rounded p-1 hover:bg-black/10"
			aria-label="Close notification"
		>
			<X class="h-4 w-4" />
		</button>
	</div>
{/if}
