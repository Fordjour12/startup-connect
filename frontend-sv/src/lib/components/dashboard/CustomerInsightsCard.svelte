<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import {
		Tabs,
		TabsList,
		TabsTrigger,
		TabsContent,
	} from "$lib/components/ui/tabs";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import * as Avatar from "$lib/components/ui/avatar";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import TrendingDown from "@lucide/svelte/icons/trending-down";
	import MessageSquare from "@lucide/svelte/icons/message-square";
	import BarChart3 from "@lucide/svelte/icons/bar-chart-3";
	import LineChart from "@lucide/svelte/icons/line-chart";
	import PieChart from "@lucide/svelte/icons/pie-chart";
	import Users from "@lucide/svelte/icons/users";
	import Briefcase from "@lucide/svelte/icons/briefcase";
	import Calendar from "@lucide/svelte/icons/calendar";
	import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
	import FileText from "@lucide/svelte/icons/file-text";
	import Newspaper from "@lucide/svelte/icons/newspaper";
	import Activity from "@lucide/svelte/icons/activity";
	import Plus from "@lucide/svelte/icons/plus";
	import ExternalLink from "@lucide/svelte/icons/external-link";

	// Prop interface
	let { data } = $props<{
		data: {
			nps: {
				score: number;
				trend: number;
				responses: number;
				history: number[];
			};
			csat: {
				score: number;
				trend: number;
				responses: number;
			};
			featureRequests: {
				total: number;
				new: number;
				topRequests: Array<{
					id: string;
					feature: string;
					votes: number;
					status:
						| "requested"
						| "planned"
						| "in-progress"
						| "completed";
				}>;
			};
			interviews: {
				scheduled: number;
				completed: number;
				upcoming: Array<{
					customer: string;
					date: string;
					time: string;
				}>;
			};
			marketNews: Array<{
				id: string;
				title: string;
				source: string;
				date: string;
				relevance: number;
				url: string;
			}>;
			competitorUpdates: Array<{
				competitor: string;
				update: string;
				date: string;
				impact: "positive" | "neutral" | "negative";
			}>;
			marketSize: {
				tam: number; // Total Addressable Market
				sam: number; // Serviceable Addressable Market
				som: number; // Serviceable Obtainable Market
			};
			trends: Array<{
				name: string;
				description: string;
				relevance: number;
				growth: number;
			}>;
		};
	}>();

	// Tab state
	let activeSubTab = $state("voice");

	// Format large numbers with K, M suffix
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	}

	// Format date to "Month Day, Year" format
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);
	}

	// Get status badge class based on status
	function getStatusClass(status: string): string {
		switch (status) {
			case "requested":
				return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
			case "planned":
				return "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20";
			case "in-progress":
				return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20";
			case "completed":
				return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
			default:
				return "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20";
		}
	}

	// Get impact badge class
	function getImpactClass(impact: string): string {
		switch (impact) {
			case "positive":
				return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
			case "negative":
				return "bg-red-500/10 text-red-500 dark:bg-red-500/20";
			default:
				return "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20";
		}
	}

	// Generate sparkline SVG path from history data
	function generateSparkline(
		data: number[],
		height: number = 30,
		width: number = 100,
	): string {
		if (!data || data.length < 2) return "";

		const max = Math.max(...data);
		const min = Math.min(...data);
		const range = max - min || 1;

		// Scale values to fit the height
		const scaledValues = data.map(
			(val) => height - ((val - min) / range) * height,
		);

		// Calculate x increment
		const xIncrement = width / (data.length - 1);

		// Generate path
		let path = `M0,${scaledValues[0]}`;
		scaledValues.forEach((val, i) => {
			if (i > 0) {
				path += ` L${i * xIncrement},${val}`;
			}
		});

		return path;
	}
</script>

<Card.Root class="shadow-md">
	<Card.Header class="pb-2">
		<div class="flex items-center justify-between">
			<Card.Title class="text-xl font-semibold">Customer & Market Insights</Card.Title>
			<Tabs
				value={activeSubTab}
				onValueChange={(val) => (activeSubTab = val)}
				class="hidden sm:block"
			>
				<TabsList class="grid w-[400px] grid-cols-2">
					<TabsTrigger value="voice" class="text-xs">
						<div class="flex items-center gap-1.5">
							<Users class="h-3.5 w-3.5" />
							<span>Voice of Customer</span>
						</div>
					</TabsTrigger>
					<TabsTrigger value="market" class="text-xs">
						<div class="flex items-center gap-1.5">
							<Briefcase class="h-3.5 w-3.5" />
							<span>Market Intelligence</span>
						</div>
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<!-- Mobile tab selector -->
			<div class="sm:hidden">
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						activeSubTab =
							activeSubTab === "voice" ? "market" : "voice";
					}}
				>
					{#if activeSubTab === "voice"}
						<Briefcase class="h-3.5 w-3.5 mr-1" />
						<span>Show Market</span>
					{:else}
						<Users class="h-3.5 w-3.5 mr-1" />
						<span>Show Customer</span>
					{/if}
				</Button>
			</div>
		</div>
	</Card.Header>

	<Card.Content>
		<div class="space-y-6">
			{#if activeSubTab === "voice"}
				<!-- Voice of Customer Tab -->
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- NPS Score -->
						<div class="bg-muted/50 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-sm font-medium text-muted-foreground">
									NPS Score
								</h3>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div class="cursor-help">
											<Badge variant="outline" class="text-xs">
												{data.nps.responses} responses
											</Badge>
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-xs">
											Based on {data.nps.responses} customer responses
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-2xl font-bold">{data.nps.score}</span>
								<div class="flex items-center">
									{#if data.nps.trend > 0}
										<TrendingUp
											class="h-4 w-4 text-green-500 mr-1"
										/>
										<span class="text-xs text-green-500"
											>+{data.nps.trend}</span
										>
									{:else}
										<TrendingDown
											class="h-4 w-4 text-red-500 mr-1"
										/>
										<span class="text-xs text-red-500"
											>{data.nps.trend}</span
										>
									{/if}
								</div>
							</div>

							<div class="mt-2">
								<svg width="100%" height="30" class="opacity-70">
									<path
										d={generateSparkline(data.nps.history)}
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
									/>
								</svg>
							</div>
						</div>

						<!-- CSAT Score -->
						<div class="bg-muted/50 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-sm font-medium text-muted-foreground">
									CSAT Score
								</h3>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div class="cursor-help">
											<Badge variant="outline" class="text-xs">
												{data.csat.responses} responses
											</Badge>
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-xs">
											Based on {data.csat.responses} satisfaction surveys
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-2xl font-bold"
									>{data.csat.score}%</span
								>
								<div class="flex items-center">
									{#if data.csat.trend > 0}
										<TrendingUp
											class="h-4 w-4 text-green-500 mr-1"
										/>
										<span class="text-xs text-green-500"
											>+{data.csat.trend}%</span
										>
									{:else}
										<TrendingDown
											class="h-4 w-4 text-red-500 mr-1"
										/>
										<span class="text-xs text-red-500"
											>{data.csat.trend}%</span
										>
									{/if}
								</div>
							</div>

							<div class="mt-2">
								<Progress value={data.csat.score} class="h-2" />
							</div>
						</div>

						<!-- Customer Interviews -->
						<div class="bg-muted/50 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-sm font-medium text-muted-foreground">
									Interviews
								</h3>
								<div class="flex items-center gap-1">
									<Badge
										variant="outline"
										class="text-xs bg-green-500/10 text-green-500"
									>
										{data.interviews.completed} completed
									</Badge>
								</div>
							</div>

							<div class="text-2xl font-bold mb-1">
								{data.interviews.scheduled} scheduled
							</div>

							{#if data.interviews.upcoming.length > 0}
								<div class="mt-2 text-xs text-muted-foreground">
									<span>Next interview:</span>
									<div
										class="mt-1 bg-background p-2 rounded-md flex items-center justify-between"
									>
										<div>
											<span class="font-medium"
												>{data.interviews.upcoming[0]
													.customer}</span
											>
											<div class="flex items-center mt-0.5">
												<Calendar class="h-3 w-3 mr-1" />
												<span
													>{data.interviews.upcoming[0].date}, {data
														.interviews.upcoming[0]
														.time}</span
												>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-7 p-0"
										>
											<Calendar class="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Feature Requests -->
					<div>
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-medium">Feature Requests</h3>
							<div class="flex items-center gap-2">
								<Badge
									variant="outline"
									class="bg-blue-500/10 text-blue-500"
								>
									{data.featureRequests.new} new
								</Badge>
								<Button variant="outline" size="sm" class="h-7 text-xs">
									<Plus class="h-3.5 w-3.5 mr-1" />
									<span>Add Request</span>
								</Button>
							</div>
						</div>

						<div class="space-y-2">
							{#each data.featureRequests.topRequests as request}
								<div
									class="p-2 rounded-md bg-muted/30 flex items-center justify-between"
								>
									<div class="flex-1">
										<div class="flex items-center">
											<LightbulbIcon
												class="h-3.5 w-3.5 mr-1.5 text-amber-500"
											/>
											<span class="font-medium text-sm"
												>{request.feature}</span
											>
										</div>
										<div class="flex items-center mt-1">
											<Badge
												variant="outline"
												class="text-xs mr-2 {getStatusClass(
													request.status,
												)}"
											>
												{request.status}
											</Badge>
											<span class="text-xs text-muted-foreground">
												ID: {request.id}
											</span>
										</div>
									</div>
									<div class="text-right">
										<div class="font-bold">{request.votes}</div>
										<div class="text-xs text-muted-foreground">
											votes
										</div>
									</div>
								</div>
							{/each}
						</div>

						<div class="mt-2 text-center">
							<Button variant="ghost" size="sm" class="text-xs">
								View all {data.featureRequests.total} feature requests
							</Button>
						</div>
					</div>
				</div>
			{:else}
				<!-- Market Intelligence Tab -->
				<div class="space-y-6">
					<!-- Market Sizing -->
					<div>
						<h3 class="text-sm font-medium mb-3">Market Sizing (USD)</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="bg-muted/50 rounded-lg p-4">
								<div class="text-xs text-muted-foreground mb-1">
									Total Addressable Market
								</div>
								<div class="text-xl font-bold">
									${formatNumber(data.marketSize.tam)}
								</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div
											class="mt-1 text-xs text-muted-foreground cursor-help underline decoration-dotted"
										>
											What is TAM?
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-xs max-w-[200px]">
											Total Addressable Market represents the
											total market demand for your product or
											service - the maximum potential size of your
											market.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>

							<div class="bg-muted/50 rounded-lg p-4">
								<div class="text-xs text-muted-foreground mb-1">
									Serviceable Addressable Market
								</div>
								<div class="text-xl font-bold">
									${formatNumber(data.marketSize.sam)}
								</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div
											class="mt-1 text-xs text-muted-foreground cursor-help underline decoration-dotted"
										>
											What is SAM?
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-xs max-w-[200px]">
											Serviceable Addressable Market is the
											portion of the TAM targeted by your products
											and services which is within your
											geographical reach.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>

							<div class="bg-muted/50 rounded-lg p-4">
								<div class="text-xs text-muted-foreground mb-1">
									Serviceable Obtainable Market
								</div>
								<div class="text-xl font-bold">
									${formatNumber(data.marketSize.som)}
								</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div
											class="mt-1 text-xs text-muted-foreground cursor-help underline decoration-dotted"
										>
											What is SOM?
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-xs max-w-[200px]">
											Serviceable Obtainable Market is the portion
											of SAM that you can realistically capture
											with your business model and resources.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
						</div>
					</div>

					<!-- Technology/Market Trends -->
					<div>
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-medium">
								Technology & Market Trends
							</h3>
							<Button variant="outline" size="sm" class="h-7 text-xs">
								<Activity class="h-3.5 w-3.5 mr-1" />
								<span>Refresh Trends</span>
							</Button>
						</div>

						<div class="space-y-2">
							{#each data.trends as trend}
								<div class="p-3 rounded-md bg-muted/30">
									<div class="flex items-center justify-between">
										<div class="font-medium">{trend.name}</div>
										<div class="flex items-center">
											<span class="text-xs mr-1">Relevance:</span>
											<div class="flex">
												{#each Array(5) as _, i}
													<div
														class="h-1.5 w-1.5 rounded-full mx-0.5"
														class:bg-primary={i <
															trend.relevance}
														class:bg-muted={i >=
															trend.relevance}
													></div>
												{/each}
											</div>
										</div>
									</div>
									<p class="text-xs text-muted-foreground mt-1">
										{trend.description}
									</p>
									<div class="flex items-center mt-2">
										<span class="text-xs mr-2">Growth trend:</span>
										<div class="flex items-center">
											{#if trend.growth > 0}
												<TrendingUp
													class="h-3.5 w-3.5 text-green-500 mr-1"
												/>
												<span class="text-xs text-green-500"
													>+{trend.growth}%</span
												>
											{:else}
												<TrendingDown
													class="h-3.5 w-3.5 text-red-500 mr-1"
												/>
												<span class="text-xs text-red-500"
													>{trend.growth}%</span
												>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Industry News & Competitor Updates -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Industry News -->
						<div>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-medium">Industry News</h3>
								<Button variant="ghost" size="sm" class="h-7 text-xs">
									<Newspaper class="h-3.5 w-3.5 mr-1" />
									<span>View All</span>
								</Button>
							</div>

							<div class="space-y-3">
								{#each data.marketNews.slice(0, 3) as news}
									<div class="bg-muted/30 p-2 rounded-md">
										<div class="flex items-start">
											<div
												class="bg-muted rounded h-8 w-8 flex items-center justify-center mr-2 mt-0.5"
											>
												<Newspaper
													class="h-4 w-4 text-muted-foreground"
												/>
											</div>
											<div>
												<a
													href={news.url}
													target="_blank"
													rel="noopener noreferrer"
													class="text-sm font-medium hover:underline flex items-center"
												>
													{news.title}
													<ExternalLink
														class="h-3 w-3 ml-1 inline"
													/>
												</a>
												<div
													class="flex items-center text-xs text-muted-foreground mt-1"
												>
													<span>{news.source}</span>
													<span class="mx-1.5">•</span>
													<span>{formatDate(news.date)}</span>
													<div class="ml-2 flex">
														<span>Relevance:</span>
														<div class="flex ml-1">
															{#each Array(5) as _, i}
																<div
																	class="h-1.5 w-1.5 rounded-full mx-0.5"
																	class:bg-primary={i <
																		news.relevance}
																	class:bg-muted={i >=
																		news.relevance}
																></div>
															{/each}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Competitor Updates -->
						<div>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-medium">Competitor Updates</h3>
								<Button variant="ghost" size="sm" class="h-7 text-xs">
									<Briefcase class="h-3.5 w-3.5 mr-1" />
									<span>View All</span>
								</Button>
							</div>

							<div class="space-y-3">
								{#each data.competitorUpdates.slice(0, 3) as update}
									<div class="bg-muted/30 p-2 rounded-md">
										<div class="flex items-center justify-between">
											<div class="font-medium text-sm">
												{update.competitor}
											</div>
											<Badge
												variant="outline"
												class="text-xs {getImpactClass(
													update.impact,
												)}"
											>
												{update.impact} impact
											</Badge>
										</div>
										<p class="text-xs text-muted-foreground mt-1">
											{update.update}
										</p>
										<div class="text-xs text-muted-foreground mt-1">
											{formatDate(update.date)}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
