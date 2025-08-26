<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	// Redirect to overview page
	onMount(() => {
		goto("/dashboard/investor/organization/overview");
	});
</script>

<div class="flex items-center justify-center h-64">
	<div
		class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
	></div>
</div>
