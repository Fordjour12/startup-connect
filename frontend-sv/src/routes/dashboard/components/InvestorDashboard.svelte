<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { DollarSign, TrendingUp, Search, Star } from "@lucide/svelte";

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
					<DollarSign class="w-5 h-5 text-green-500" />
					Portfolio
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">
					Active investments
				</p>
				<Button size="sm" class="w-full">View Portfolio</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Search class="w-5 h-5 text-blue-500" />
					Discover
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">∞</p>
				<p class="text-muted-foreground text-sm mb-4">
					Startups to explore
				</p>
				<Button size="sm" variant="outline" class="w-full">
					Browse Startups
				</Button>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Star class="w-5 h-5 text-yellow-500" />
					Watchlist
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold mb-2">0</p>
				<p class="text-muted-foreground text-sm mb-4">
					Saved opportunities
				</p>
				<Button size="sm" variant="outline" class="w-full">
					Manage Watchlist
				</Button>
			</CardContent>
		</Card>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Investment Opportunities</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-muted-foreground">
				Discover promising startups and investment opportunities!
			</p>
		</CardContent>
	</Card>
</div>
