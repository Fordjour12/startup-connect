<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import AnalyticsIcon from "@tabler/icons-svelte/icons/chart-line";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import FileIcon from "@tabler/icons-svelte/icons/file";
	import ShareIcon from "@tabler/icons-svelte/icons/share";

	interface Props {
		deck: {
			id: string;
			name: string;
			version: string;
			status: string;
			views: number;
			shares: number;
			size: string;
			uploadDate: string;
			thumbnailUrl?: string;
			feedback: {
				score: number;
				suggestions: number;
				strengths: string[];
			};
		};
		onView?: (deck: Props["deck"]) => void;
		onShare?: (deck: Props["deck"]) => void;
	}

	let { deck, onView, onShare }: Props = $props();

	function getStatusColor(status: string) {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "archived":
				return "bg-gray-500";
			case "draft":
				return "bg-yellow-500";
			default:
				return "bg-blue-500";
		}
	}

	function getFeedbackColor(score: number) {
		if (score >= 85) return "text-green-600";
		if (score >= 70) return "text-yellow-600";
		return "text-red-600";
	}
</script>

<Card
	class="@container/card border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm hover:shadow-md transition-all duration-200"
>
	<CardHeader class="pb-4">
		<div class="flex items-start justify-between">
			<div class="flex-1 min-w-0">
				<CardTitle class="text-lg line-clamp-1 mb-2"
					>{deck.name}</CardTitle
				>
				<div class="flex items-center gap-2">
					<Badge variant="secondary" class="text-xs"
						>v{deck.version}</Badge
					>
					<div class="flex items-center gap-1">
						<span
							class="w-2 h-2 rounded-full {getStatusColor(
								deck.status,
							)}"
						></span>
						<span class="text-xs text-muted-foreground capitalize"
							>{deck.status}</span
						>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8"
					onclick={() => onView?.(deck)}
				>
					<EyeIcon class="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8"
					onclick={() => onShare?.(deck)}
				>
					<ShareIcon class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		<!-- Thumbnail Preview -->
		{#if deck.thumbnailUrl}
			<div
				class="aspect-video bg-muted rounded-lg overflow-hidden border"
			>
				<img
					src={deck.thumbnailUrl}
					alt="{deck.name} preview"
					class="w-full h-full object-cover"
					loading="lazy"
				/>
				<div
					class="hidden w-full h-full flex items-center justify-center"
				>
					<FileIcon class="h-12 w-12 text-muted-foreground" />
				</div>
			</div>
		{:else}
			<div
				class="aspect-video bg-muted rounded-lg flex items-center justify-center border"
			>
				<FileIcon class="h-12 w-12 text-muted-foreground" />
			</div>
		{/if}

		<!-- Metrics Grid -->
		<div class="grid grid-cols-3 gap-4">
			<div class="text-center p-3 bg-background/50 rounded-lg">
				<p class="text-lg font-semibold">{deck.views}</p>
				<p class="text-xs text-muted-foreground">Views</p>
			</div>
			<div class="text-center p-3 bg-background/50 rounded-lg">
				<p class="text-lg font-semibold">{deck.shares}</p>
				<p class="text-xs text-muted-foreground">Shares</p>
			</div>
			<div class="text-center p-3 bg-background/50 rounded-lg">
				<p
					class="text-lg font-semibold {getFeedbackColor(
						deck.feedback.score,
					)}"
				>
					{deck.feedback.score}
				</p>
				<p class="text-xs text-muted-foreground">Score</p>
			</div>
		</div>

		<!-- Feedback Preview -->
		<div class="p-4 bg-background/30 rounded-lg border">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium">AI Feedback</p>
				<Badge variant="outline" class="text-xs">
					{deck.feedback.suggestions} suggestions
				</Badge>
			</div>
			<div class="flex flex-wrap gap-1">
				{#each deck.feedback.strengths.slice(0, 2) as strength}
					<Badge variant="outline" class="text-xs gap-1">
						<span class="w-1 h-1 bg-green-500 rounded-full"></span>
						{strength}
					</Badge>
				{/each}
			</div>
		</div>
	</CardContent>

	<CardContent class="pt-0 pb-6">
		<div class="flex gap-2 mb-4">
			<Button variant="outline" size="sm" class="flex-1 gap-2">
				<AnalyticsIcon class="h-3 w-3" />
				Analytics
			</Button>
			<Button
				variant="outline"
				size="sm"
				class="flex-1 gap-2"
				onclick={() => onShare?.(deck)}
			>
				<ShareIcon class="h-3 w-3" />
				Share
			</Button>
		</div>
		<div class="text-xs text-muted-foreground">
			Uploaded {deck.uploadDate} • {deck.size}
		</div>
	</CardContent>
</Card>
