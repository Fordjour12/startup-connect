<script lang="ts">
	import CommunicationSystem from "$lib/components/supporter/CommunicationSystem.svelte";
</script>

<svelte:head>
	<title>Messages | Supporter Dashboard</title>
	<meta
		name="description"
		content="Communicate with startups and manage your conversations"
	/>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Messages</h1>
				<p class="text-muted-foreground">
					Communicate with startups and manage your conversations
				</p>
			</div>
		</div>

		<!-- Communication System -->
		<CommunicationSystem />
	</div>
</div>
