<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Rocket, TrendingUp, Users, Plus } from "@lucide/svelte";

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
					<Rocket class="w-5 h-5 text-blue-500" />
					My Startups
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">
					Active startups
				</p>
				<Button size="sm" class="w-full">
					<Plus class="w-4 h-4 mr-2" />
					Add Startup
				</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Users class="w-5 h-5 text-green-500" />
					Investors
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">
					Connected investors
				</p>
				<Button size="sm" variant="outline" class="w-full">
					Find Investors
				</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<TrendingUp class="w-5 h-5 text-purple-500" />
					Growth
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0%</p>
				<p class="text-muted-foreground text-sm mb-4">
					Profile completion
				</p>
				<Button size="sm" variant="outline" class="w-full">
					Complete Profile
				</Button>
			</CardContent>
		</Card>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Recent Activity</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-muted-foreground">
				No recent activity. Start by adding your first startup!
			</p>
		</CardContent>
	</Card>
</div>
