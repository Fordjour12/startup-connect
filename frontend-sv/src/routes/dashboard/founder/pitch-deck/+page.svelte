<script lang="ts">
	import FileUpload from "$lib/components/file-upload.svelte";
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

					// Add to pitch decks list
					const newDeck = {
						id: Date.now().toString(),
						name: file.name.replace(/\.[^/.]+$/, ""),
						version: "1.0",
						uploadDate: new Date().toISOString().split("T")[0],
						size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
						status: "active",
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
			deck.id === deckId ? { ...deck, status: "archived" } : deck,
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

<div class="container mx-auto p-6 space-y-6">
	<!-- Header Section -->
	<div
		class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
	>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">
				Pitch Deck Manager
			</h1>
			<p class="text-muted-foreground">
				Upload, analyze, and share your pitch decks with investors
			</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				onclick={() => (showTemplates = !showTemplates)}
			>
				📊 Templates
			</Button>
			<Button>➕ New Deck</Button>
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<Card>
			<CardContent class="p-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-blue-100 rounded-lg">📁</div>
					<div>
						<p class="text-sm text-muted-foreground">Total Decks</p>
						<p class="text-2xl font-bold">{pitchDecks.length}</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-green-100 rounded-lg">👁️</div>
					<div>
						<p class="text-sm text-muted-foreground">Total Views</p>
						<p class="text-2xl font-bold">
							{performanceAnalytics.totalViews}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-purple-100 rounded-lg">📤</div>
					<div>
						<p class="text-sm text-muted-foreground">Shares</p>
						<p class="text-2xl font-bold">
							{performanceAnalytics.totalShares}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-yellow-100 rounded-lg">⭐</div>
					<div>
						<p class="text-sm text-muted-foreground">Avg Score</p>
						<p class="text-2xl font-bold">
							{performanceAnalytics.avgScore}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>

	<Tabs value="decks" class="w-full">
		<TabsList>
			<TabsTrigger value="decks">My Decks</TabsTrigger>
			<TabsTrigger value="upload">Upload New</TabsTrigger>
			<TabsTrigger value="analytics">Analytics</TabsTrigger>
			<TabsTrigger value="feedback">AI Feedback</TabsTrigger>
		</TabsList>

		<!-- My Decks Tab -->
		<TabsContent value="decks" class="space-y-4">
			{#if pitchDecks.length === 0}
				<Card>
					<CardContent class="p-8 text-center">
						<div class="mb-4">
							<div
								class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
							>
								📊
							</div>
							<h3 class="text-lg font-semibold mb-2">
								No pitch decks yet
							</h3>
							<p class="text-muted-foreground mb-4">
								Upload your first pitch deck to get started with
								analytics and sharing
							</p>
							<Button>Upload Your First Deck</Button>
						</div>
					</CardContent>
				</Card>
			{:else}
				<div
					class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
				>
					{#each pitchDecks as deck}
						<Card class="hover:shadow-lg transition-shadow">
							<CardHeader class="pb-3">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<CardTitle class="text-lg line-clamp-1"
											>{deck.name}</CardTitle
										>
										<CardDescription
											class="flex items-center gap-2 mt-1"
										>
											<Badge variant="secondary"
												>v{deck.version}</Badge
											>
											<span
												class="w-2 h-2 rounded-full {getStatusColor(
													deck.status,
												)}"
											></span>
											<span class="text-xs"
												>{deck.status}</span
											>
										</CardDescription>
									</div>
									<div class="flex items-center gap-1">
										<Button
											variant="ghost"
											size="icon"
											onclick={() =>
												(selectedDeck = deck)}
										>
											👁️
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onclick={() => shareDeck(deck)}
										>
											📤
										</Button>
									</div>
								</div>
							</CardHeader>

							<CardContent class="space-y-4">
								<!-- Thumbnail Preview -->
								{#if deck.thumbnailUrl}
									<div
										class="aspect-video bg-muted rounded-lg overflow-hidden"
									>
										<img
											src={deck.thumbnailUrl}
											alt="{deck.name} preview"
											class="w-full h-full object-cover"
										/>
									</div>
								{/if}

								<!-- Metrics -->
								<div class="grid grid-cols-3 gap-4 text-center">
									<div>
										<p class="text-lg font-semibold">
											{deck.views}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											Views
										</p>
									</div>
									<div>
										<p class="text-lg font-semibold">
											{deck.shares}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											Shares
										</p>
									</div>
									<div>
										<p
											class="text-lg font-semibold {getFeedbackColor(
												deck.feedback.score,
											)}"
										>
											{deck.feedback.score}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											Score
										</p>
									</div>
								</div>

								<!-- Feedback Preview -->
								<div class="p-3 bg-muted rounded-lg">
									<p class="text-sm font-medium mb-1">
										Quick Feedback
									</p>
									<p
										class="text-xs text-muted-foreground mb-2"
									>
										{deck.feedback.suggestions} suggestions for
										improvement
									</p>
									<div class="flex flex-wrap gap-1">
										{#each deck.feedback.strengths.slice(0, 2) as strength}
											<Badge
												variant="outline"
												class="text-xs"
												>✅ {strength}</Badge
											>
										{/each}
									</div>
								</div>

								<!-- Actions -->
								<div class="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										class="flex-1"
									>
										📊 Analytics
									</Button>
									<Button
										variant="outline"
										size="sm"
										class="flex-1"
										onclick={() => shareDeck(deck)}
									>
										📤 Share
									</Button>
								</div>

								<div class="text-xs text-muted-foreground">
									Uploaded {deck.uploadDate} • {deck.size}
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			{/if}
		</TabsContent>

		<!-- Upload Tab -->
		<TabsContent value="upload" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Upload New Pitch Deck</CardTitle>
					<CardDescription>
						Upload your pitch deck files. Supported formats: PDF,
						PowerPoint (PPTX, PPT)
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<FileUpload
						accept=".pdf,.ppt,.pptx"
						maxSize={50}
						multiple={true}
						bind:files={selectedFiles}
						onUpload={handleUpload}
					/>

					{#if uploading}
						<div class="space-y-2">
							<div
								class="flex items-center justify-between text-sm"
							>
								<span>Uploading and analyzing...</span>
								<span>{Math.round(uploadProgress)}%</span>
							</div>
							<Progress value={uploadProgress} />
						</div>
					{/if}

					<Alert>
						<AlertDescription>
							💡 <strong>Pro tip:</strong> Our AI will automatically
							analyze your pitch deck and provide feedback on structure,
							content, and effectiveness compared to successful decks
							in your industry.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>

			<!-- Templates Section -->
			{#if showTemplates}
				<Card>
					<CardHeader>
						<CardTitle>Pitch Deck Templates</CardTitle>
						<CardDescription>
							Start with proven templates used by successful
							startups
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							{#each templates as template}
								<Card class="hover:shadow-md transition-shadow">
									<CardContent class="p-4">
										<div
											class="aspect-video bg-muted rounded-lg mb-3 overflow-hidden"
										>
											<img
												src={template.preview}
												alt="{template.name} preview"
												class="w-full h-full object-cover"
											/>
										</div>
										<h4 class="font-semibold mb-1">
											{template.name}
										</h4>
										<p
											class="text-sm text-muted-foreground mb-2"
										>
											{template.slides} slides • {template.category}
										</p>
										<div
											class="flex items-center justify-between mb-3"
										>
											<div
												class="flex items-center gap-1"
											>
												<span class="text-yellow-500"
													>⭐</span
												>
												<span class="text-sm"
													>{template.rating}</span
												>
											</div>
											<span
												class="text-xs text-muted-foreground"
											>
												{template.downloads} downloads
											</span>
										</div>
										<Button
											size="sm"
											class="w-full"
											onclick={() =>
												downloadTemplate(template)}
										>
											Download Template
										</Button>
									</CardContent>
								</Card>
							{/each}
						</div>
					</CardContent>
				</Card>
			{/if}
		</TabsContent>

		<!-- Analytics Tab -->
		<TabsContent value="analytics" class="space-y-6">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Performance Overview</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div class="text-center p-4 bg-muted rounded-lg">
								<p class="text-2xl font-bold">
									{industryBenchmarks.avgViewTime}
								</p>
								<p class="text-sm text-muted-foreground">
									Avg. View Time
								</p>
							</div>
							<div class="text-center p-4 bg-muted rounded-lg">
								<p class="text-2xl font-bold">
									{industryBenchmarks.completionRate}%
								</p>
								<p class="text-sm text-muted-foreground">
									Completion Rate
								</p>
							</div>
						</div>

						<div class="space-y-2">
							<h4 class="font-medium">Most Engaging Slides</h4>
							<div class="space-y-1">
								{#each performanceAnalytics.mostEngagingSlides.slice(0, 3) as slide}
									<div class="flex justify-between">
										<span class="text-sm">{slide.name}</span
										>
										<span class="text-sm font-medium"
											>{slide.avgTime} avg</span
										>
									</div>
								{/each}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Industry Benchmarks</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="text-center p-4 bg-blue-50 rounded-lg">
							<p class="text-lg font-semibold text-blue-600">
								Above Average
							</p>
							<p class="text-sm text-muted-foreground">
								Your decks perform 23% better than industry
								average
							</p>
						</div>

						<div class="space-y-3">
							<div>
								<div class="flex justify-between mb-1">
									<span class="text-sm">Slide Count</span>
									<span class="text-sm"
										>12 vs {industryBenchmarks.avgSlides} avg</span
									>
								</div>
								<Progress value={85} class="h-2" />
							</div>
							<div>
								<div class="flex justify-between mb-1">
									<span class="text-sm">View Time</span>
									<span class="text-sm"
										>4:32 vs {industryBenchmarks.avgViewTime}
										avg</span
									>
								</div>
								<Progress value={92} class="h-2" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</TabsContent>

		<!-- AI Feedback Tab -->
		<TabsContent value="feedback" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>AI-Powered Pitch Analysis</CardTitle>
					<CardDescription>
						Get intelligent feedback on your pitch deck structure
						and content
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					{#if pitchDecks.length > 0}
						{#each pitchDecks.filter((deck) => deck.status === "active") as deck}
							<div class="border rounded-lg p-4 space-y-4">
								<div class="flex items-center justify-between">
									<h4 class="font-semibold">{deck.name}</h4>
									<Badge
										variant="outline"
										class={getFeedbackColor(
											deck.feedback.score,
										)}
									>
										Score: {deck.feedback.score}/100
									</Badge>
								</div>

								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4"
								>
									<div>
										<h5
											class="font-medium text-green-600 mb-2"
										>
											✅ Strengths
										</h5>
										<ul class="space-y-1">
											{#each deck.feedback.strengths as strength}
												<li
													class="text-sm flex items-center gap-2"
												>
													<span
														class="w-1 h-1 bg-green-500 rounded-full"
													></span>
													{strength}
												</li>
											{/each}
										</ul>
									</div>

									<div>
										<h5
											class="font-medium text-yellow-600 mb-2"
										>
											💡 Improvements
										</h5>
										<ul class="space-y-1">
											{#each deck.feedback.improvements as improvement}
												<li
													class="text-sm flex items-center gap-2"
												>
													<span
														class="w-1 h-1 bg-yellow-500 rounded-full"
													></span>
													{improvement}
												</li>
											{/each}
										</ul>
									</div>
								</div>

								<div class="flex gap-2">
									<Button variant="outline" size="sm">
										📊 Detailed Analysis
									</Button>
									<Button variant="outline" size="sm">
										🤖 AI Suggestions
									</Button>
								</div>
							</div>
						{/each}
					{:else}
						<div class="text-center py-8">
							<div
								class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
							>
								🤖
							</div>
							<h3 class="font-semibold mb-2">
								No decks to analyze
							</h3>
							<p class="text-muted-foreground mb-4">
								Upload a pitch deck to get AI-powered feedback
								and insights
							</p>
						</div>
					{/if}
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>

<!-- Deck Detail Modal (when selectedDeck is set) -->
{#if selectedDeck}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
	>
		<Card class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
			<CardHeader class="flex flex-row items-center justify-between">
				<div>
					<CardTitle>{selectedDeck.name}</CardTitle>
					<CardDescription
						>Version {selectedDeck.version}</CardDescription
					>
				</div>
				<Button variant="ghost" onclick={() => (selectedDeck = null)}>
					✕
				</Button>
			</CardHeader>
			<CardContent class="space-y-4">
				<!-- Deck preview/iframe would go here -->
				<div
					class="aspect-video bg-muted rounded-lg flex items-center justify-center"
				>
					<p class="text-muted-foreground">
						Deck preview would appear here
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="text-center">
						<p class="text-2xl font-bold">{selectedDeck.views}</p>
						<p class="text-sm text-muted-foreground">Total Views</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold">
							{selectedDeck.analytics.avgTimeSpent}
						</p>
						<p class="text-sm text-muted-foreground">
							Avg. Time Spent
						</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold">
							{selectedDeck.analytics.mostViewedSlide}
						</p>
						<p class="text-sm text-muted-foreground">
							Most Viewed Slide
						</p>
					</div>
				</div>

				<div class="flex gap-2">
					<Button class="flex-1">📤 Share with Investors</Button>
					<Button variant="outline" class="flex-1">
						📥 Download
					</Button>
					<Button
						variant="outline"
						onclick={() => archiveDeck(selectedDeck.id)}
					>
						📁 Archive
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
{/if}
