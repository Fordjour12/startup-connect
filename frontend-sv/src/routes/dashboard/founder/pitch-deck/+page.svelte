<script lang="ts">
	import AIFeedbackSection from "$lib/components/founder/AIFeedbackSection.svelte";
	import AnalyticsSection from "$lib/components/founder/AnalyticsSection.svelte";
	import DeckCard from "$lib/components/founder/DeckCard.svelte";
	import FileUploadSection from "$lib/components/founder/FileUploadSection.svelte";
	import { Alert, AlertDescription } from "$lib/components/ui/alert";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Progress } from "$lib/components/ui/progress";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import AnalyticsIcon from "@tabler/icons-svelte/icons/chart-line";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import FileIcon from "@tabler/icons-svelte/icons/file";
	import ShareIcon from "@tabler/icons-svelte/icons/share";
	import StarIcon from "@tabler/icons-svelte/icons/star";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import UploadIcon from "@tabler/icons-svelte/icons/upload";

	import type { PageData } from "./$types";

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Use server data and make it reactive for client-side updates
	let pitchDecks = $state([...data.pitchDecks]);
	let templates = $state([...data.templates]);
	let industryBenchmarks = $state(data.industryBenchmarks);
	let performanceAnalytics = $state(data.performanceAnalytics);
	let aiInsights = $state(data.aiInsights);

	// Client-side state
	let selectedFiles = $state<File[]>([]);
	let uploading = $state(false);
	let uploadProgress = $state(0);
	let showTemplates = $state(false);
	let selectedDeck = $state<any>(null);

	// Functions
	async function handleUpload(files: File[]) {
		if (files.length === 0) return;

		uploading = true;
		uploadProgress = 0;

		try {
			for (const file of files) {
				const formData = new FormData();
				formData.append("file", file);

				// Simulate upload progress
				const progressInterval = setInterval(() => {
					uploadProgress += Math.random() * 20;
					if (uploadProgress >= 95) {
						clearInterval(progressInterval);
					}
				}, 200);

				const response = await fetch("/api/v1/upload/document", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
					body: formData,
				});

				if (response.ok) {
					const result = await response.json();

					// Add to pitch decks list - Fixed type error by using proper status type
					const newDeck: PitchDeck = {
						id: Date.now().toString(),
						name: file.name.replace(/\.[^/.]+$/, ""),
						version: "1.0",
						uploadDate: new Date().toISOString().split("T")[0],
						size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
						status: "active" as const,
						views: 0,
						shares: 0,
						url: result.url,
						thumbnailUrl: result.thumbnail_url,
						feedback: {
							score: Math.floor(Math.random() * 20) + 70,
							suggestions: Math.floor(Math.random() * 5) + 1,
							strengths: [
								"Professional design",
								"Clear structure",
							],
							improvements: ["Add more data", "Improve flow"],
						},
						analytics: {
							avgTimeSpent: "0:00",
							dropOffSlide: 0,
							mostViewedSlide: 1,
							completionRate: 0,
							viewsBySlide: [],
						},
					};

					pitchDecks = [newDeck, ...pitchDecks];
					uploadProgress = 100;

					// Update performance analytics
					performanceAnalytics = {
						...performanceAnalytics,
						avgScore: Math.round(
							pitchDecks.reduce(
								(sum, deck) => sum + deck.feedback.score,
								0,
							) / pitchDecks.length,
						),
					};
				}

				clearInterval(progressInterval);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			uploading = false;
			uploadProgress = 0;
			selectedFiles = [];
		}
	}

	function shareDeck(deck: any) {
		// Generate shareable link
		const shareUrl = `${window.location.origin}/shared/pitch-deck/${deck.id}`;
		navigator.clipboard.writeText(shareUrl);

		// Track share and update reactive array
		pitchDecks = pitchDecks.map((d) =>
			d.id === deck.id ? { ...d, shares: d.shares + 1 } : d,
		);

		// Update performance analytics
		performanceAnalytics = {
			...performanceAnalytics,
			totalShares: performanceAnalytics.totalShares + 1,
		};

		alert("Share link copied to clipboard!");
	}

	function downloadTemplate(template: any) {
		// Simulate template download
		console.log("Downloading template:", template.name);

		// Update the reactive templates array
		templates = templates.map((t) =>
			t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t,
		);
	}

	function archiveDeck(deckId: string) {
		pitchDecks = pitchDecks.map((deck) =>
			deck.id === deckId
				? { ...deck, status: "archived" as const }
				: deck,
		);
	}

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

<svelte:head>
	<title>Pitch Deck Manager | StartupConnect</title>
	<meta
		name="description"
		content="Manage your startup pitch decks with analytics, feedback, and sharing tools"
	/>
</svelte:head>

<div
	class="@container/main min-h-screen bg-gradient-to-br from-background to-muted/20"
>
	<div class="container mx-auto p-4 lg:p-6 space-y-6">
		<!-- Header Section -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
		>
			<div>
				<h1
					class="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
				>
					Pitch Deck Manager
				</h1>
				<p class="text-muted-foreground text-lg">
					Upload, analyze, and share your pitch decks with investors
				</p>
			</div>
			<div class="flex gap-3">
				<Button
					variant="outline"
					class="gap-2"
					onclick={() => (showTemplates = !showTemplates)}
				>
					<FileIcon class="h-4 w-4" />
					Templates
				</Button>
				<Button class="gap-2">
					<UploadIcon class="h-4 w-4" />
					New Deck
				</Button>
			</div>
		</div>

		<!-- Quick Stats -->
		<div
			class="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:from-primary/5 *:to-card dark:*:bg-card *:shadow-sm *:bg-gradient-to-t"
		>
			<Card class="@container/card border-0">
				<CardHeader class="pb-3">
					<CardDescription class="text-sm font-medium"
						>Total Decks</CardDescription
					>
					<CardTitle
						class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-center gap-3"
					>
						<div
							class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
						>
							<FileIcon
								class="h-5 w-5 text-blue-600 dark:text-blue-400"
							/>
						</div>
						{pitchDecks.length}
					</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<div class="flex items-center gap-2 text-sm font-medium">
						<TrendingUpIcon class="h-4 w-4 text-green-600" />
						<span class="text-muted-foreground"
							>Active presentations</span
						>
					</div>
				</CardContent>
			</Card>

			<Card class="@container/card border-0">
				<CardHeader class="pb-3">
					<CardDescription class="text-sm font-medium"
						>Total Views</CardDescription
					>
					<CardTitle
						class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-center gap-3"
					>
						<div
							class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg"
						>
							<EyeIcon
								class="h-5 w-5 text-green-600 dark:text-green-400"
							/>
						</div>
						{performanceAnalytics.totalViews}
					</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<div class="flex items-center gap-2 text-sm">
						<Badge variant="outline" class="gap-1">
							<TrendingUpIcon class="h-3 w-3" />
							+12.5%
						</Badge>
						<span class="text-muted-foreground">vs last month</span>
					</div>
				</CardContent>
			</Card>

			<Card class="@container/card border-0">
				<CardHeader class="pb-3">
					<CardDescription class="text-sm font-medium"
						>Total Shares</CardDescription
					>
					<CardTitle
						class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-center gap-3"
					>
						<div
							class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg"
						>
							<ShareIcon
								class="h-5 w-5 text-purple-600 dark:text-purple-400"
							/>
						</div>
						{performanceAnalytics.totalShares}
					</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<div class="flex items-center gap-2 text-sm font-medium">
						<TrendingUpIcon class="h-4 w-4 text-green-600" />
						<span class="text-muted-foreground"
							>Investor engagement</span
						>
					</div>
				</CardContent>
			</Card>

			<Card class="@container/card border-0">
				<CardHeader class="pb-3">
					<CardDescription class="text-sm font-medium"
						>Average Score</CardDescription
					>
					<CardTitle
						class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex items-center gap-3"
					>
						<div
							class="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg"
						>
							<StarIcon
								class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
							/>
						</div>
						{performanceAnalytics.avgScore}
					</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<div class="flex items-center gap-2 text-sm">
						<Badge variant="outline" class="gap-1">
							<TrendingUpIcon class="h-3 w-3" />
							Above avg
						</Badge>
						<span class="text-muted-foreground"
							>Industry benchmark</span
						>
					</div>
				</CardContent>
			</Card>
		</div>

		<Tabs value="decks" class="w-full">
			<TabsList>
				<TabsTrigger value="decks" class="gap-2">
					<FileIcon class="h-4 w-4" />
					My Decks
				</TabsTrigger>
				<TabsTrigger value="upload" class="gap-2">
					<UploadIcon class="h-4 w-4" />
					Upload New
				</TabsTrigger>
				<TabsTrigger value="analytics" class="gap-2">
					<AnalyticsIcon class="h-4 w-4" />
					Analytics
				</TabsTrigger>
				<TabsTrigger value="feedback" class="gap-2">
					<StarIcon class="h-4 w-4" />
					AI Feedback
				</TabsTrigger>
			</TabsList>

			<!-- My Decks Tab -->
			<TabsContent value="decks" class="space-y-6 mt-6">
				{#if pitchDecks.length === 0}
					<Card
						class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm"
					>
						<CardContent class="p-12 text-center">
							<div
								class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
							>
								<FileIcon
									class="h-10 w-10 text-muted-foreground"
								/>
							</div>
							<h3 class="text-xl font-semibold mb-3">
								No pitch decks yet
							</h3>
							<p
								class="text-muted-foreground mb-6 max-w-md mx-auto"
							>
								Upload your first pitch deck to get started with
								analytics and sharing
							</p>
							<Button size="lg" class="gap-2">
								<UploadIcon class="h-4 w-4" />
								Upload Your First Deck
							</Button>
						</CardContent>
					</Card>
				{:else}
					<div
						class="@xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-6"
					>
						{#each pitchDecks as deck}
							<DeckCard
								{deck}
								onView={(deck) => (selectedDeck = deck)}
								onShare={shareDeck}
							/>
						{/each}
					</div>
				{/if}
			</TabsContent>

			<!-- Upload Tab -->
			<TabsContent value="upload" class="space-y-6 mt-6">
				<FileUploadSection
					{selectedFiles}
					{uploading}
					{uploadProgress}
					{showTemplates}
					{templates}
					onUpload={handleUpload}
					onFilesChange={(files) => (selectedFiles = files)}
					onDownloadTemplate={downloadTemplate}
				/>
			</TabsContent>

			<!-- Analytics Tab -->
			<TabsContent value="analytics" class="space-y-6 mt-6">
				<AnalyticsSection {industryBenchmarks} {performanceAnalytics} />
			</TabsContent>

			<!-- AI Feedback Tab -->
			<TabsContent value="feedback" class="space-y-6 mt-6">
				<AIFeedbackSection {pitchDecks} />
			</TabsContent>
		</Tabs>
	</div>
</div>

<!-- Deck Detail Modal (when selectedDeck is set) -->
{#if selectedDeck}
	<div
		class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
	>
		<Card
			class="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl"
		>
			<CardHeader
				class="flex flex-row items-center justify-between border-b"
			>
				<div>
					<CardTitle class="text-xl">{selectedDeck.name}</CardTitle>
					<CardDescription class="text-base"
						>Version {selectedDeck.version}</CardDescription
					>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => (selectedDeck = null)}
				>
					<span class="text-xl">✕</span>
				</Button>
			</CardHeader>
			<CardContent class="space-y-6 p-6">
				<!-- Deck preview/iframe would go here -->
				<div
					class="aspect-video bg-muted rounded-lg flex items-center justify-center border"
				>
					<div class="text-center">
						<FileIcon
							class="h-16 w-16 text-muted-foreground mx-auto mb-2"
						/>
						<p class="text-muted-foreground">
							Deck preview would appear here
						</p>
					</div>
				</div>

				<div class="@lg/main:grid-cols-3 grid grid-cols-1 gap-6">
					<div
						class="text-center p-4 bg-background/50 rounded-lg border"
					>
						<p class="text-3xl font-bold tabular-nums">
							{selectedDeck.views}
						</p>
						<p class="text-sm text-muted-foreground">Total Views</p>
					</div>
					<div
						class="text-center p-4 bg-background/50 rounded-lg border"
					>
						<p class="text-3xl font-bold tabular-nums">
							{selectedDeck.analytics.avgTimeSpent}
						</p>
						<p class="text-sm text-muted-foreground">
							Avg. Time Spent
						</p>
					</div>
					<div
						class="text-center p-4 bg-background/50 rounded-lg border"
					>
						<p class="text-3xl font-bold tabular-nums">
							{selectedDeck.analytics.mostViewedSlide}
						</p>
						<p class="text-sm text-muted-foreground">
							Most Viewed Slide
						</p>
					</div>
				</div>

				<div class="flex gap-3">
					<Button class="flex-1 gap-2">
						<ShareIcon class="h-4 w-4" />
						Share with Investors
					</Button>
					<Button variant="outline" class="flex-1 gap-2">
						<span class="text-sm">📥</span>
						Download
					</Button>
					<Button
						variant="outline"
						onclick={() => archiveDeck(selectedDeck.id)}
						class="gap-2"
					>
						<span class="text-sm">📁</span>
						Archive
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
{/if}
