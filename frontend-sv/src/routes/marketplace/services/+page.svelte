<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
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
		Heart,
		Bookmark,
		Verified,
		TrendingUp,
		Users,
		Calendar,
		Eye,
	} from "@lucide/svelte";

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
				isVerified: true,
				yearsExperience: 15,
				completedProjects: 120,
				responseRate: 98,
			},
			rating: 4.9,
			reviewCount: 47,
			responseTime: 4,
			views: 156,
			inquiries: 23,
			bookings: 8,
			isFeatured: true,
			deliverables: [
				"Market Analysis Report",
				"Competitive Positioning Strategy",
				"Growth Plan",
			],
			duration: "2-4 weeks",
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
				isVerified: true,
				yearsExperience: 12,
				completedProjects: 85,
				responseRate: 95,
			},
			rating: 4.8,
			reviewCount: 32,
			responseTime: 6,
			views: 89,
			inquiries: 12,
			bookings: 4,
			isFeatured: false,
			deliverables: [
				"Architecture Review Report",
				"Performance Recommendations",
				"Security Assessment",
			],
			duration: "1-2 weeks",
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
				isVerified: false,
				yearsExperience: 8,
				completedProjects: 45,
				responseRate: 92,
			},
			rating: 4.7,
			reviewCount: 28,
			responseTime: 8,
			views: 67,
			inquiries: 8,
			bookings: 2,
			isFeatured: false,
			deliverables: [
				"Marketing Strategy",
				"Campaign Recommendations",
				"ROI Analysis",
			],
			duration: "Ongoing",
		},
		{
			id: "4",
			title: "Financial Planning & Fundraising",
			description:
				"Expert guidance on financial planning, fundraising strategies, and investor relations.",
			category: "Legal & Finance",
			subcategory: "Fundraising",
			pricing: { type: "hourly", amount: 200, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "James Wilson",
						location: "London, UK",
					},
				},
				isVerified: true,
				yearsExperience: 20,
				completedProjects: 200,
				responseRate: 99,
			},
			rating: 4.9,
			reviewCount: 65,
			responseTime: 2,
			views: 234,
			inquiries: 35,
			bookings: 12,
			isFeatured: true,
			deliverables: [
				"Financial Model",
				"Pitch Deck Review",
				"Investor List",
			],
			duration: "3-6 weeks",
		},
		{
			id: "5",
			title: "Operations Optimization",
			description:
				"Streamline your operations and improve efficiency with proven methodologies.",
			category: "Operations",
			subcategory: "Process Improvement",
			pricing: { type: "project", amount: 1800, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "Lisa Park",
						location: "Seattle, WA",
					},
				},
				isVerified: true,
				yearsExperience: 10,
				completedProjects: 75,
				responseRate: 96,
			},
			rating: 4.8,
			reviewCount: 41,
			responseTime: 5,
			views: 98,
			inquiries: 15,
			bookings: 6,
			isFeatured: false,
			deliverables: [
				"Process Map",
				"Efficiency Report",
				"Implementation Plan",
			],
			duration: "2-3 weeks",
		},
		{
			id: "6",
			title: "Startup Mentoring",
			description:
				"One-on-one mentoring sessions to guide you through startup challenges and growth.",
			category: "Mentoring",
			subcategory: "General Mentoring",
			pricing: { type: "hourly", amount: 100, currency: "USD" },
			supporter: {
				profileData: {
					personalInfo: {
						name: "David Kim",
						location: "Toronto, CA",
					},
				},
				isVerified: false,
				yearsExperience: 6,
				completedProjects: 30,
				responseRate: 90,
			},
			rating: 4.6,
			reviewCount: 18,
			responseTime: 12,
			views: 45,
			inquiries: 6,
			bookings: 3,
			isFeatured: false,
			deliverables: [
				"Mentoring Session",
				"Action Plan",
				"Follow-up Notes",
			],
			duration: "1 hour",
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
		goto(`/marketplace/services/${serviceId}/contact`);
	}

	function viewServiceDetails(serviceId: string) {
		// TODO: Navigate to service detail page
		console.log("Viewing service details:", serviceId);
		goto(`/marketplace/services/${serviceId}`);
	}

	function bookmarkService(serviceId: string) {
		// TODO: Implement bookmark functionality
		console.log("Bookmarking service:", serviceId);
	}

	function getPricingDisplay(pricing: any) {
		switch (pricing.type) {
			case "hourly":
				return `$${pricing.amount}/hour`;
			case "project":
				return `$${pricing.amount.toLocaleString()}`;
			case "retainer":
				return `$${pricing.amount.toLocaleString()}/month`;
			case "equity":
				return `${pricing.amount}% equity`;
			case "free":
				return "Free";
			default:
				return `$${pricing.amount}`;
		}
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

<div class="p-4 space-y-6">
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
							type="single"
							bind:value={selectedCategory}
							onchange={() => filterServices()}
						>
							<SelectTrigger class="w-48">
								All Categories
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
							type="single"
							bind:value={selectedSort}
							onchange={() => filterServices()}
						>
							<SelectTrigger class="w-40">
								"Filtering"
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
				class="hover:shadow-lg transition-shadow cursor-pointer group"
			>
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="space-y-2 flex-1">
							<div class="flex items-center gap-2">
								<CardTitle class="text-lg"
									>{service.title}</CardTitle
								>
								{#if service.isFeatured}
									<Badge variant="secondary" class="text-xs"
										>Featured</Badge
									>
								{/if}
							</div>
							<CardDescription class="line-clamp-2">
								{service.description}
							</CardDescription>
						</div>
						<div class="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								onclick={(e) => {
									e.stopPropagation();
									bookmarkService(service.id);
								}}
							>
								<Bookmark class="h-4 w-4" />
							</Button>
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
						<div class="flex items-center gap-1">
							<span
								>{service.supporter.profileData.personalInfo
									.name}</span
							>
							{#if service.supporter.isVerified}
								<Verified class="h-3 w-3 text-blue-500" />
							{/if}
						</div>
						<span>•</span>
						<span
							>{service.supporter.profileData.personalInfo
								.location}</span
						>
					</div>

					<!-- Supporter Stats -->
					<div
						class="grid grid-cols-2 gap-2 text-xs text-muted-foreground"
					>
						<div class="flex items-center gap-1">
							<Users class="h-3 w-3" />
							<span
								>{service.supporter.yearsExperience} years exp</span
							>
						</div>
						<div class="flex items-center gap-1">
							<TrendingUp class="h-3 w-3" />
							<span
								>{service.supporter.responseRate}% response rate</span
							>
						</div>
					</div>

					<!-- Response Time -->
					<div
						class="flex items-center gap-2 text-sm text-muted-foreground"
					>
						<Clock class="h-4 w-4" />
						<span>Responds within {service.responseTime} hours</span
						>
					</div>

					<!-- Duration -->
					{#if service.duration}
						<div
							class="flex items-center gap-2 text-sm text-muted-foreground"
						>
							<Calendar class="h-4 w-4" />
							<span>{service.duration}</span>
						</div>
					{/if}

					<!-- Pricing -->
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground"
							>Pricing:</span
						>
						<span class="font-semibold text-lg"
							>{getPricingDisplay(service.pricing)}</span
						>
					</div>

					<!-- Service Stats -->
					<div class="grid grid-cols-3 gap-2 text-center text-xs">
						<div>
							<div class="font-semibold">{service.views}</div>
							<div class="text-muted-foreground">Views</div>
						</div>
						<div>
							<div class="font-semibold">{service.inquiries}</div>
							<div class="text-muted-foreground">Inquiries</div>
						</div>
						<div>
							<div class="font-semibold">{service.bookings}</div>
							<div class="text-muted-foreground">Bookings</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={(e) => {
								e.stopPropagation();
								viewServiceDetails(service.id);
							}}
						>
							<Eye class="h-4 w-4 mr-2" />
							View Details
						</Button>
						<Button
							size="sm"
							class="flex-1"
							onclick={(e) => {
								e.stopPropagation();
								contactSupporter(service.id);
							}}
						>
							<MessageSquare class="h-4 w-4 mr-2" />
							Contact
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
