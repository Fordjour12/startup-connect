<script lang="ts">
	import MatchingSystem from "$lib/components/supporter/MatchingSystem.svelte";
</script>

<svelte:head>
	<title>Matching System | Supporter Dashboard</title>
	<meta
		name="description"
		content="Discover startups that match your expertise and availability"
	/>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">
					Matching System
				</h1>
				<p class="text-muted-foreground">
					Discover startups that match your expertise and availability
				</p>
			</div>
		</div>

		<!-- Matching System -->
		<MatchingSystem />
	</div>
</div>
