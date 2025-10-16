<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import {
		Search,
		Filter,
		Star,
		MapPin,
		Clock,
		MessageSquare,
		ArrowRight,
		Users,
		TrendingUp,
		Target,
		CheckCircle,
		XCircle,
		Eye,
	} from "@lucide/svelte";

	// Mock data for matching system
	let startups = $state([
		{
			id: "1",
			name: "TechFlow Inc.",
			industry: "SaaS",
			stage: "Early Traction",
			location: "San Francisco, CA",
			description:
				"AI-powered workflow automation platform for small businesses",
			needs: ["Business Strategy", "Technical", "Marketing"],
			budget: "10k-50k",
			timeline: "1-3 months",
			teamSize: 8,
			fundingStage: "Seed",
			rating: 4.8,
			responseRate: 95,
			matchScore: 92,
			lastActive: "2 hours ago",
		},
		{
			id: "2",
			name: "GreenTech Solutions",
			industry: "CleanTech",
			stage: "MVP",
			location: "Austin, TX",
			description:
				"Sustainable energy management platform for commercial buildings",
			needs: ["Business Strategy", "Operations", "Legal & Finance"],
			budget: "5k-25k",
			timeline: "2-4 months",
			teamSize: 5,
			fundingStage: "Pre-seed",
			rating: 4.6,
			responseRate: 88,
			matchScore: 87,
			lastActive: "1 day ago",
		},
		{
			id: "3",
			name: "DataViz Pro",
			industry: "Data Analytics",
			stage: "Growth",
			location: "New York, NY",
			description:
				"Advanced data visualization tools for enterprise clients",
			needs: ["Technical", "Marketing", "Legal & Finance"],
			budget: "25k-100k",
			timeline: "3-6 months",
			teamSize: 15,
			fundingStage: "Series A",
			rating: 4.9,
			responseRate: 98,
			matchScore: 95,
			lastActive: "30 minutes ago",
		},
	]);

	let searchQuery = $state("");
	let selectedIndustry = $state("");
	let selectedStage = $state("");
	let selectedBudget = $state("");
	let selectedNeeds = $state("");
	let sortBy = $state("match_score");

	const industries = [
		"SaaS",
		"CleanTech",
		"Data Analytics",
		"FinTech",
		"HealthTech",
		"EdTech",
		"E-commerce",
		"Other",
	];

	const stages = [
		"Idea",
		"MVP",
		"Early Traction",
		"Growth",
		"Scaling",
		"Mature",
	];

	const budgetRanges = ["Under 5k", "5k-25k", "25k-50k", "50k-100k", "100k+"];

	const serviceNeeds = [
		"Business Strategy",
		"Technical",
		"Marketing & Sales",
		"Legal & Finance",
		"Operations",
		"Mentoring",
	];

	function getMatchScoreColor(score: number) {
		if (score >= 90) return "bg-green-100 text-green-800";
		if (score >= 80) return "bg-blue-100 text-blue-800";
		if (score >= 70) return "bg-yellow-100 text-yellow-800";
		return "bg-gray-100 text-gray-800";
	}

	function getMatchScoreIcon(score: number) {
		if (score >= 90) return CheckCircle;
		if (score >= 80) return TrendingUp;
		return Target;
	}

	function contactStartup(startupId: string) {
		goto(`/supporter/startups/${startupId}/contact`);
	}

	function viewStartupProfile(startupId: string) {
		goto(`/supporter/startups/${startupId}`);
	}

	function sendProposal(startupId: string) {
		goto(`/supporter/proposals/new?startup=${startupId}`);
	}

	onMount(() => {
		// TODO: Load matching startups from API
		console.log("Loading matching startups...");
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Matching System</h2>
			<p class="text-muted-foreground">
				Discover startups that match your expertise and availability
			</p>
		</div>
		<Button variant="outline">
			<Filter class="h-4 w-4 mr-2" />
			Advanced Filters
		</Button>
	</div>

	<!-- Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<!-- Search -->
				<div class="relative">
					<Search
						class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search startups..."
						class="pl-10"
					/>
				</div>

				<!-- Industry -->
				<Select bind:value={selectedIndustry}>
					<SelectTrigger>
						<SelectValue placeholder="All Industries" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Industries</SelectItem>
						{#each industries as industry}
							<SelectItem value={industry}>{industry}</SelectItem>
						{/each}
					</SelectContent>
				</Select>

				<!-- Stage -->
				<Select bind:value={selectedStage}>
					<SelectTrigger>
						<SelectValue placeholder="All Stages" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Stages</SelectItem>
						{#each stages as stage}
							<SelectItem value={stage}>{stage}</SelectItem>
						{/each}
					</SelectContent>
				</Select>

				<!-- Budget -->
				<Select bind:value={selectedBudget}>
					<SelectTrigger>
						<SelectValue placeholder="All Budgets" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Budgets</SelectItem>
						{#each budgetRanges as budget}
							<SelectItem value={budget}>{budget}</SelectItem>
						{/each}
					</SelectContent>
				</Select>

				<!-- Sort -->
				<Select bind:value={sortBy}>
					<SelectTrigger>
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="match_score">Match Score</SelectItem>
						<SelectItem value="rating">Rating</SelectItem>
						<SelectItem value="budget">Budget</SelectItem>
						<SelectItem value="last_active">Last Active</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Matching Startups -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{#each startups as startup}
			<Card class="hover:shadow-lg transition-shadow">
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<CardTitle class="text-lg"
									>{startup.name}</CardTitle
								>
								<Badge
									class={getMatchScoreColor(
										startup.matchScore,
									)}
								>
									<svelte:component
										this={getMatchScoreIcon(
											startup.matchScore,
										)}
										class="h-3 w-3 mr-1"
									/>
									{startup.matchScore}% match
								</Badge>
							</div>
							<CardDescription class="line-clamp-2">
								{startup.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Basic Info -->
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div class="flex items-center gap-2">
							<MapPin class="h-4 w-4 text-muted-foreground" />
							<span>{startup.location}</span>
						</div>
						<div class="flex items-center gap-2">
							<Users class="h-4 w-4 text-muted-foreground" />
							<span>{startup.teamSize} team members</span>
						</div>
						<div class="flex items-center gap-2">
							<TrendingUp class="h-4 w-4 text-muted-foreground" />
							<span>{startup.stage}</span>
						</div>
						<div class="flex items-center gap-2">
							<Clock class="h-4 w-4 text-muted-foreground" />
							<span>{startup.lastActive}</span>
						</div>
					</div>

					<!-- Service Needs -->
					<div>
						<Label class="text-sm font-medium">Service Needs:</Label
						>
						<div class="flex flex-wrap gap-1 mt-1">
							{#each startup.needs as need}
								<Badge variant="outline" class="text-xs"
									>{need}</Badge
								>
							{/each}
						</div>
					</div>

					<!-- Project Details -->
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span class="text-muted-foreground">Budget:</span>
							<span class="font-medium ml-1"
								>{startup.budget}</span
							>
						</div>
						<div>
							<span class="text-muted-foreground">Timeline:</span>
							<span class="font-medium ml-1"
								>{startup.timeline}</span
							>
						</div>
					</div>

					<!-- Startup Rating -->
					<div class="flex items-center gap-2">
						<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span class="text-sm font-medium">{startup.rating}</span
						>
						<span class="text-xs text-muted-foreground">
							{startup.responseRate}% response rate
						</span>
					</div>

					<!-- Actions -->
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={() => viewStartupProfile(startup.id)}
						>
							<Eye class="h-4 w-4 mr-2" />
							View Profile
						</Button>
						<Button
							size="sm"
							class="flex-1"
							onclick={() => sendProposal(startup.id)}
						>
							<MessageSquare class="h-4 w-4 mr-2" />
							Send Proposal
						</Button>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Empty State -->
	{#if startups.length === 0}
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<Target class="h-12 w-12 text-muted-foreground mb-4" />
				<h3 class="text-lg font-semibold mb-2">No matches found</h3>
				<p class="text-muted-foreground text-center mb-4">
					Try adjusting your filters or check back later for new
					startup matches.
				</p>
				<Button variant="outline">
					<Filter class="h-4 w-4 mr-2" />
					Adjust Filters
				</Button>
			</CardContent>
		</Card>
	{/if}
</div>
