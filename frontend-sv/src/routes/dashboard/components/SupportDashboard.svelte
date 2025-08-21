<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Users, Briefcase, Star, MessageSquare } from "@lucide/svelte";

	interface Props {
		user: any;
	}

	let { user }: Props = $props();
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Users class="w-5 h-5 text-blue-500" />
					Clients
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">Active clients</p>
				<Button size="sm" class="w-full">Find Clients</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Briefcase class="w-5 h-5 text-green-500" />
					Projects
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">
					Active projects
				</p>
				<Button size="sm" variant="outline" class="w-full">
					View Projects
				</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Star class="w-5 h-5 text-yellow-500" />
					Reviews
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">Client reviews</p>
				<Button size="sm" variant="outline" class="w-full">
					View Reviews
				</Button>
			</CardContent>
		</Card>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Available Opportunities</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-muted-foreground">
				Connect with startups looking for your expertise!
			</p>
		</CardContent>
	</Card>
</div>
