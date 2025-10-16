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
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import {
		Search,
		Plus,
		Edit,
		Trash2,
		Eye,
		MoreHorizontal,
		Star,
		Calendar,
		MessageSquare,
		TrendingUp,
		Settings,
	} from "@lucide/svelte";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";

	// Mock data - will be replaced with API calls
	let services = $state([
		{
			id: "1",
			title: "Business Strategy Consulting",
			description:
				"Comprehensive business strategy development including market analysis, competitive positioning, and growth planning.",
			category: "Business Strategy",
			pricingType: "hourly",
			priceAmount: 150,
			currency: "USD",
			isActive: true,
			isFeatured: true,
			views: 156,
			inquiries: 23,
			bookings: 8,
			rating: 4.9,
			createdAt: "2024-01-01",
		},
		{
			id: "2",
			title: "Technical Architecture Review",
			description:
				"Expert review of your technical architecture with recommendations for scalability, security, and performance.",
			category: "Technical",
			pricingType: "project",
			priceAmount: 2500,
			currency: "USD",
			isActive: true,
			isFeatured: false,
			views: 89,
			inquiries: 12,
			bookings: 4,
			rating: 4.8,
			createdAt: "2024-01-05",
		},
		{
			id: "3",
			title: "Marketing Strategy Review",
			description:
				"Data-driven marketing strategies to accelerate customer acquisition and revenue growth.",
			category: "Marketing & Sales",
			pricingType: "retainer",
			priceAmount: 3000,
			currency: "USD",
			isActive: false,
			isFeatured: false,
			views: 67,
			inquiries: 8,
			bookings: 2,
			rating: 4.7,
			createdAt: "2024-01-10",
		},
	]);

	let searchQuery = $state("");
	let selectedCategory = $state("");
	let selectedStatus = $state("");
	let isLoading = $state(false);

	const categories = [
		"Business Strategy",
		"Technical",
		"Marketing & Sales",
		"Legal & Finance",
		"Operations",
		"Mentoring",
	];

	function createNewService() {
		goto("/supporter/services/new");
	}

	function editService(serviceId: string) {
		goto(`/supporter/services/${serviceId}/edit`);
	}

	function viewService(serviceId: string) {
		goto(`/supporter/services/${serviceId}`);
	}

	function deleteService(serviceId: string) {
		// TODO: Implement delete functionality
		console.log("Delete service:", serviceId);
	}

	function toggleServiceStatus(serviceId: string) {
		// TODO: Implement toggle status functionality
		console.log("Toggle service status:", serviceId);
	}

	function getStatusColor(isActive: boolean) {
		return isActive
			? "bg-green-100 text-green-800"
			: "bg-gray-100 text-gray-800";
	}

	function getPricingDisplay(
		pricingType: string,
		priceAmount: number,
		currency: string,
	) {
		switch (pricingType) {
			case "hourly":
				return `$${priceAmount}/hour`;
			case "project":
				return `$${priceAmount.toLocaleString()}`;
			case "retainer":
				return `$${priceAmount.toLocaleString()}/month`;
			default:
				return `$${priceAmount}`;
		}
	}

	onMount(() => {
		// TODO: Load services from API
		console.log("Loading supporter services...");
	});
</script>

<svelte:head>
	<title>My Services | Supporter Dashboard</title>
	<meta
		name="description"
		content="Manage your service offerings and track performance"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">My Services</h1>
			<p class="text-muted-foreground">
				Manage your service offerings and track their performance
			</p>
		</div>
		<Button onclick={() => createNewService()}>
			<Plus class="h-4 w-4 mr-2" />
			Create New Service
		</Button>
	</div>

	<!-- Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="flex flex-wrap items-center gap-4">
				<!-- Search -->
				<div class="relative flex-1 min-w-64">
					<Search
						class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search services..."
						class="pl-10"
					/>
				</div>

				<!-- Category Filter -->
				<Select bind:value={selectedCategory}>
					<SelectTrigger class="w-48">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Categories</SelectItem>
						{#each categories as category}
							<SelectItem value={category}>{category}</SelectItem>
						{/each}
					</SelectContent>
				</Select>

				<!-- Status Filter -->
				<Select bind:value={selectedStatus}>
					<SelectTrigger class="w-40">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
						<SelectItem value="featured">Featured</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Services Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each services as service}
			<Card class="hover:shadow-lg transition-shadow">
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="space-y-2 flex-1">
							<div class="flex items-center gap-2">
								<CardTitle class="text-lg"
									>{service.title}</CardTitle
								>
								{#if service.isFeatured}
									<Badge variant="secondary">Featured</Badge>
								{/if}
							</div>
							<CardDescription class="line-clamp-2">
								{service.description}
							</CardDescription>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild let:builder>
								<Button
									variant="ghost"
									size="sm"
									builders={[builder]}
								>
									<MoreHorizontal class="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onclick={() => viewService(service.id)}
								>
									<Eye class="h-4 w-4 mr-2" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem
									onclick={() => editService(service.id)}
								>
									<Edit class="h-4 w-4 mr-2" />
									Edit Service
								</DropdownMenuItem>
								<DropdownMenuItem
									onclick={() =>
										toggleServiceStatus(service.id)}
								>
									<Settings class="h-4 w-4 mr-2" />
									{service.isActive
										? "Deactivate"
										: "Activate"}
								</DropdownMenuItem>
								<DropdownMenuItem
									onclick={() => deleteService(service.id)}
									class="text-destructive"
								>
									<Trash2 class="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Category and Status -->
					<div class="flex items-center justify-between">
						<Badge variant="outline">{service.category}</Badge>
						<Badge class={getStatusColor(service.isActive)}>
							{service.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>

					<!-- Pricing -->
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground"
							>Pricing:</span
						>
						<span class="font-medium">
							{getPricingDisplay(
								service.pricingType,
								service.priceAmount,
								service.currency,
							)}
						</span>
					</div>

					<!-- Rating -->
					<div class="flex items-center gap-1">
						<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span class="text-sm font-medium">{service.rating}</span
						>
						<span class="text-xs text-muted-foreground">rating</span
						>
					</div>

					<!-- Metrics -->
					<div class="grid grid-cols-3 gap-4 text-center">
						<div>
							<div class="text-lg font-semibold">
								{service.views}
							</div>
							<div class="text-xs text-muted-foreground">
								Views
							</div>
						</div>
						<div>
							<div class="text-lg font-semibold">
								{service.inquiries}
							</div>
							<div class="text-xs text-muted-foreground">
								Inquiries
							</div>
						</div>
						<div>
							<div class="text-lg font-semibold">
								{service.bookings}
							</div>
							<div class="text-xs text-muted-foreground">
								Bookings
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={() => viewService(service.id)}
						>
							<Eye class="h-4 w-4 mr-2" />
							View
						</Button>
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={() => editService(service.id)}
						>
							<Edit class="h-4 w-4 mr-2" />
							Edit
						</Button>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Empty State -->
	{#if services.length === 0}
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<Users class="h-12 w-12 text-muted-foreground mb-4" />
				<h3 class="text-lg font-semibold mb-2">No services yet</h3>
				<p class="text-muted-foreground text-center mb-4">
					Create your first service to start offering your expertise
					to startups.
				</p>
				<Button onclick={() => createNewService()}>
					<Plus class="h-4 w-4 mr-2" />
					Create Your First Service
				</Button>
			</CardContent>
		</Card>
	{/if}
</div>
