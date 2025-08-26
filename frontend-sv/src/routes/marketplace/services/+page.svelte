<script lang="ts">
	import { onMount } from "svelte";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "@/components/ui/select";
	import { Badge } from "@/components/ui/badge";
	import {
		Search,
		Filter,
		Star,
		MapPin,
		Clock,
		MessageSquare,
		ArrowRight,
	} from "lucide-svelte";

	// Service categories
	const SERVICE_CATEGORIES = [
		"Business Strategy",
		"Technical",
		"Marketing & Sales",
		"Legal & Finance",
		"Operations",
		"Mentoring",
	];

	// Mock data for now - will be replaced with API calls
	let services = $state([
		{
			id: "1",
			title: "Business Strategy Consulting",
			description:
				"Comprehensive business strategy development including market analysis, competitive positioning, and growth planning.",
			category: "Business Strategy",
			subcategory: "Business Model",
			pricing: { type: "hourly", amount: 150, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "Dr. Sarah Johnson",
						location: "San Francisco, CA",
					},
				},
			},
			rating: 4.9,
			reviewCount: 47,
			responseTime: 4,
		},
		{
			id: "2",
			title: "Technical Architecture Review",
			description:
				"Expert review of your technical architecture with recommendations for scalability, security, and performance.",
			category: "Technical",
			subcategory: "Architecture",
			pricing: { type: "project", amount: 2500, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "Alex Chen",
						location: "New York, NY",
					},
				},
			},
			rating: 4.8,
			reviewCount: 32,
			responseTime: 6,
		},
		{
			id: "3",
			title: "Growth Marketing Strategy",
			description:
				"Data-driven marketing strategies to accelerate customer acquisition and revenue growth.",
			category: "Marketing & Sales",
			subcategory: "Growth",
			pricing: { type: "retainer", amount: 3000, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "Maria Rodriguez",
						location: "Austin, TX",
					},
				},
			},
			rating: 4.7,
			reviewCount: 28,
			responseTime: 8,
		},
	]);

	let searchQuery = $state("");
	let selectedCategory = $state("");
	let selectedSort = $state("relevance");
	let isLoading = $state(false);

	// Filter and search functions
	function filterServices() {
		// TODO: Implement actual filtering with API calls
		console.log("Filtering services:", {
			searchQuery,
			selectedCategory,
			selectedSort,
		});
	}

	function clearFilters() {
		searchQuery = "";
		selectedCategory = "";
		selectedSort = "relevance";
		filterServices();
	}

	function contactSupporter(serviceId: string) {
		// TODO: Navigate to contact form or messaging
		console.log("Contacting supporter for service:", serviceId);
	}

	function viewServiceDetails(serviceId: string) {
		// TODO: Navigate to service detail page
		console.log("Viewing service details:", serviceId);
	}

	onMount(() => {
		// TODO: Load initial services from API
		console.log("Loading marketplace services...");
	});
</script>

<svelte:head>
	<title>Service Marketplace | Startup Connect</title>
	<meta
		name="description"
		content="Discover expert consultants, mentors, and service providers to help your startup succeed"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-bold tracking-tight">Service Marketplace</h1>
		<p class="text-xl text-muted-foreground max-w-3xl mx-auto">
			Connect with expert consultants, mentors, and service providers to
			accelerate your startup's growth
		</p>
	</div>

	<!-- Search and Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="space-y-4">
				<!-- Search Bar -->
				<div class="relative">
					<Search
						class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search for services, skills, or expertise..."
						class="pl-10"
						oninput={() => filterServices()}
					/>
				</div>

				<!-- Filters -->
				<div class="flex flex-wrap items-center gap-4">
					<div class="flex items-center gap-2">
						<Filter class="h-4 w-4 text-muted-foreground" />
						<Label>Category:</Label>
						<Select
							bind:value={selectedCategory}
							onchange={() => filterServices()}
						>
							<SelectTrigger class="w-48">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">All Categories</SelectItem>
								{#each SERVICE_CATEGORIES as category}
									<SelectItem value={category}
										>{category}</SelectItem
									>
								{/each}
							</SelectContent>
						</Select>
					</div>

					<div class="flex items-center gap-2">
						<Label>Sort by:</Label>
						<Select
							bind:value={selectedSort}
							onchange={() => filterServices()}
						>
							<SelectTrigger class="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="relevance"
									>Relevance</SelectItem
								>
								<SelectItem value="rating"
									>Highest Rated</SelectItem
								>
								<SelectItem value="price-low"
									>Price: Low to High</SelectItem
								>
								<SelectItem value="price-high"
									>Price: High to Low</SelectItem
								>
								<SelectItem value="response-time"
									>Fastest Response</SelectItem
								>
							</SelectContent>
						</Select>
					</div>

					<Button variant="outline" onclick={() => clearFilters()}>
						Clear Filters
					</Button>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Services Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each services as service}
			<Card
				class="hover:shadow-lg transition-shadow cursor-pointer"
				onclick={() => viewServiceDetails(service.id)}
			>
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="space-y-2">
							<CardTitle class="text-lg"
								>{service.title}</CardTitle
							>
							<CardDescription class="line-clamp-2">
								{service.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Category and Rating -->
					<div class="flex items-center justify-between">
						<Badge variant="outline">{service.category}</Badge>
						<div class="flex items-center gap-1">
							<Star
								class="h-4 w-4 fill-yellow-400 text-yellow-400"
							/>
							<span class="text-sm font-medium"
								>{service.rating}</span
							>
							<span class="text-xs text-muted-foreground"
								>({service.reviewCount})</span
							>
						</div>
					</div>

					<!-- Supporter Info -->
					<div
						class="flex items-center gap-2 text-sm text-muted-foreground"
					>
						<MapPin class="h-4 w-4" />
						<span
							>{service.supporter.profileData.personalInfo
								.name}</span
						>
						<span>•</span>
						<span
							>{service.supporter.profileData.personalInfo
								.location}</span
						>
					</div>

					<!-- Response Time -->
					<div
						class="flex items-center gap-2 text-sm text-muted-foreground"
					>
						<Clock class="h-4 w-4" />
						<span>Responds within {service.responseTime} hours</span
						>
					</div>

					<!-- Pricing -->
					<div class="flex items-center justify-between">
						<div class="text-lg font-bold">
							{service.pricing.type === "hourly" &&
								`$${service.pricing.amount}/hr`}
							{service.pricing.type === "project" &&
								`$${service.pricing.amount}`}
							{service.pricing.type === "retainer" &&
								`$${service.pricing.amount}/mo`}
						</div>
						<Badge variant="secondary" class="capitalize">
							{service.pricing.type}
						</Badge>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-2 pt-2">
						<Button
							variant="outline"
							class="flex-1"
							onclick|stopPropagation={() =>
								contactSupporter(service.id)}
						>
							<MessageSquare class="h-4 w-4 mr-2" />
							Contact
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick|stopPropagation={() =>
								viewServiceDetails(service.id)}
						>
							<ArrowRight class="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Empty State -->
	{#if services.length === 0 && !isLoading}
		<div class="text-center py-12">
			<div class="text-muted-foreground mb-4">
				<Search class="h-12 w-12 mx-auto mb-4" />
				<h3 class="text-lg font-medium">No services found</h3>
				<p class="text-sm">
					Try adjusting your search criteria or browse all categories
				</p>
			</div>
			<Button onclick={() => clearFilters()}>Browse All Services</Button>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="text-center py-12">
			<div class="text-muted-foreground">
				<p>Loading services...</p>
			</div>
		</div>
	{/if}
</div>
