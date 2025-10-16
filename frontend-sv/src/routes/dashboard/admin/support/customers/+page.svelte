<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import {
		TICKET_STATUS,
		TICKET_PRIORITY,
		SUPPORT_ROLES,
		type SupportCustomer,
	} from "$lib/db/schema";
	import { createSupportPermissionManager } from "$lib/utils/support-permissions";

	let currentUser = $state({
		id: "user-1",
		name: "John Smith",
		email: "john@support.com",
		role: SUPPORT_ROLES.MANAGER,
	});

	let permissionManager = $state(null);
	let customers = $state<SupportCustomer[]>([]);
	let filteredCustomers = $state<SupportCustomer[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state("");
	let statusFilter = $state("all");
	let sortBy = $state("name");

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			permissionManager = createSupportPermissionManager(
				currentUser.role,
				currentUser.id,
			);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			customers = [
				{
					id: "customer-1",
					email: "john.doe@example.com",
					name: "John Doe",
					company: "Acme Corp",
					phone: "+1 (555) 123-4567",
					location: "New York, NY",
					timezone: "America/New_York",
					language: "en",
					createdAt: new Date("2023-01-15T10:00:00Z"),
					updatedAt: new Date("2024-12-15T10:00:00Z"),
					lastLoginAt: new Date("2024-12-14T15:30:00Z"),
					isActive: true,
					totalTickets: 8,
					openTickets: 2,
					resolvedTickets: 6,
					averageResponseTime: 2.5, // hours
					satisfactionRating: 4.2,
					tags: ["enterprise", "high-value"],
					customFields: {
						industry: "Technology",
						employeeCount: "500-1000",
						supportPlan: "Premium",
					},
				},
				{
					id: "customer-2",
					email: "sarah.smith@company.com",
					name: "Sarah Smith",
					company: "TechStart Inc",
					phone: "+1 (555) 987-6543",
					location: "San Francisco, CA",
					timezone: "America/Los_Angeles",
					language: "en",
					createdAt: new Date("2023-03-22T08:00:00Z"),
					updatedAt: new Date("2024-12-15T09:00:00Z"),
					lastLoginAt: new Date("2024-12-15T11:45:00Z"),
					isActive: true,
					totalTickets: 5,
					openTickets: 1,
					resolvedTickets: 4,
					averageResponseTime: 1.8,
					satisfactionRating: 4.8,
					tags: ["startup", "feature-request"],
					customFields: {
						industry: "SaaS",
						employeeCount: "50-100",
						supportPlan: "Standard",
					},
				},
				{
					id: "customer-3",
					email: "mike.johnson@enterprise.com",
					name: "Mike Johnson",
					company: "Global Solutions Ltd",
					phone: "+1 (555) 456-7890",
					location: "Chicago, IL",
					timezone: "America/Chicago",
					language: "en",
					createdAt: new Date("2022-11-10T12:00:00Z"),
					updatedAt: new Date("2024-12-14T16:00:00Z"),
					lastLoginAt: new Date("2024-12-14T16:00:00Z"),
					isActive: true,
					totalTickets: 15,
					openTickets: 0,
					resolvedTickets: 15,
					averageResponseTime: 3.2,
					satisfactionRating: 4.5,
					tags: ["enterprise", "billing"],
					customFields: {
						industry: "Consulting",
						employeeCount: "1000+",
						supportPlan: "Enterprise",
					},
				},
				{
					id: "customer-4",
					email: "emily@startup.io",
					name: "Emily Rodriguez",
					company: "InnovateNow",
					phone: "+1 (555) 234-5678",
					location: "Austin, TX",
					timezone: "America/Chicago",
					language: "en",
					createdAt: new Date("2024-01-08T14:00:00Z"),
					updatedAt: new Date("2024-12-15T08:15:00Z"),
					lastLoginAt: new Date("2024-12-15T08:15:00Z"),
					isActive: true,
					totalTickets: 3,
					openTickets: 1,
					resolvedTickets: 2,
					averageResponseTime: 1.2,
					satisfactionRating: 4.0,
					tags: ["startup", "documentation"],
					customFields: {
						industry: "Fintech",
						employeeCount: "10-50",
						supportPlan: "Basic",
					},
				},
				{
					id: "customer-5",
					email: "alex.brown@techcorp.com",
					name: "Alex Brown",
					company: "TechCorp Solutions",
					phone: "+1 (555) 345-6789",
					location: "Seattle, WA",
					timezone: "America/Los_Angeles",
					language: "en",
					createdAt: new Date("2023-08-15T10:30:00Z"),
					updatedAt: new Date("2024-12-15T12:00:00Z"),
					lastLoginAt: new Date("2024-12-15T12:00:00Z"),
					isActive: true,
					totalTickets: 7,
					openTickets: 1,
					resolvedTickets: 6,
					averageResponseTime: 2.1,
					satisfactionRating: 3.8,
					tags: ["enterprise", "authentication"],
					customFields: {
						industry: "Manufacturing",
						employeeCount: "500-1000",
						supportPlan: "Premium",
					},
				},
			];

			filteredCustomers = [...customers];
		} catch (error) {
			console.error("Error loading customers:", error);
		} finally {
			isLoading = false;
		}
	});

	// Reactive filtering and sorting
	$: {
		let filtered = customers.filter((customer) => {
			const matchesSearch =
				searchQuery === "" ||
				customer.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				customer.email
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				customer.company
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				customer.location
					?.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && customer.isActive) ||
				(statusFilter === "inactive" && !customer.isActive);

			return matchesSearch && matchesStatus;
		});

		// Sort customers
		filteredCustomers = filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "company":
					return (a.company || "").localeCompare(b.company || "");
				case "tickets":
					return b.totalTickets - a.totalTickets;
				case "lastLogin":
					return (
						new Date(b.lastLoginAt || 0).getTime() -
						new Date(a.lastLoginAt || 0).getTime()
					);
				case "created":
					return (
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
					);
				default:
					return 0;
			}
		});
	}

	function formatTimeAgo(date: Date | string): string {
		const now = new Date();
		const past = new Date(date);
		const diffInMinutes = Math.floor(
			(now.getTime() - past.getTime()) / (1000 * 60),
		);

		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		} else if (diffInMinutes < 1440) {
			return `${Math.floor(diffInMinutes / 60)}h ago`;
		} else {
			return `${Math.floor(diffInMinutes / 1440)}d ago`;
		}
	}

	function getSatisfactionColor(rating: number): string {
		if (rating >= 4.5) return "text-green-600";
		if (rating >= 4.0) return "text-blue-600";
		if (rating >= 3.5) return "text-yellow-600";
		return "text-red-600";
	}

	function getSatisfactionEmoji(rating: number): string {
		if (rating >= 4.5) return "😊";
		if (rating >= 4.0) return "🙂";
		if (rating >= 3.5) return "😐";
		return "😞";
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">
				Customer Management
			</h1>
			<p class="text-muted-foreground">
				Manage customer profiles and track support interactions
			</p>
		</div>
		<div class="flex space-x-3">
			{#if permissionManager?.hasPermission("customers:create")}
				<Button
					onclick={() => goto("/dashboard/support/customers/new")}
				>
					<svg
						class="w-4 h-4 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Add Customer
				</Button>
			{/if}
			{#if permissionManager?.hasPermission("customers:export")}
				<Button variant="outline">
					<svg
						class="w-4 h-4 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Export
				</Button>
			{/if}
		</div>
	</div>

	<!-- Summary Cards -->
	{#if !isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Total Customers
							</p>
							<p class="text-2xl font-bold">{customers.length}</p>
						</div>
						<svg
							class="w-8 h-8 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
							/>
						</svg>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Active Customers
							</p>
							<p class="text-2xl font-bold">
								{customers.filter((c) => c.isActive).length}
							</p>
						</div>
						<svg
							class="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Open Tickets
							</p>
							<p class="text-2xl font-bold">
								{customers.reduce(
									(sum, c) => sum + c.openTickets,
									0,
								)}
							</p>
						</div>
						<svg
							class="w-8 h-8 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Avg Satisfaction
							</p>
							<p class="text-2xl font-bold">
								{(
									customers.reduce(
										(sum, c) =>
											sum + (c.satisfactionRating || 0),
										0,
									) / customers.length
								).toFixed(1)}
								<span
									class="text-sm font-normal text-muted-foreground"
									>/5</span
								>
							</p>
						</div>
						<div class="text-2xl">
							{getSatisfactionEmoji(
								customers.reduce(
									(sum, c) =>
										sum + (c.satisfactionRating || 0),
									0,
								) / customers.length,
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}

	<!-- Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Search -->
				<div class="lg:col-span-2">
					<Input
						bind:value={searchQuery}
						placeholder="Search customers..."
						class="w-full"
					/>
				</div>

				<!-- Status Filter -->
				<div>
					<Select bind:value={statusFilter}>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</Select>
				</div>

				<!-- Sort By -->
				<div>
					<Select bind:value={sortBy}>
						<option value="name">Sort by Name</option>
						<option value="company">Sort by Company</option>
						<option value="tickets">Sort by Tickets</option>
						<option value="lastLogin">Sort by Last Login</option>
						<option value="created">Sort by Created</option>
					</Select>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Customers List -->
	{#if isLoading}
		<!-- Loading State -->
		<div class="space-y-4">
			{#each Array(5) as _}
				<Card>
					<CardContent class="p-6">
						<div class="animate-pulse">
							<div class="flex items-center space-x-4 mb-4">
								<div
									class="w-12 h-12 bg-muted rounded-full"
								></div>
								<div class="flex-1">
									<div
										class="h-4 bg-muted rounded w-1/4 mb-2"
									></div>
									<div
										class="h-3 bg-muted rounded w-1/2"
									></div>
								</div>
							</div>
							<div class="grid grid-cols-4 gap-4">
								{#each Array(4) as _}
									<div class="h-3 bg-muted rounded"></div>
								{/each}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else if filteredCustomers.length === 0}
		<!-- No Customers -->
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<svg
					class="w-12 h-12 text-muted-foreground mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
					/>
				</svg>
				<h3 class="text-lg font-medium text-muted-foreground mb-2">
					No customers found
				</h3>
				<p class="text-sm text-muted-foreground mb-4">
					{searchQuery || statusFilter !== "all"
						? "Try adjusting your filters to see more customers."
						: "There are no customers to display."}
				</p>
				{#if permissionManager?.hasPermission("customers:create")}
					<Button
						onclick={() => goto("/dashboard/support/customers/new")}
					>
						Add First Customer
					</Button>
				{/if}
			</CardContent>
		</Card>
	{:else}
		<!-- Customers List -->
		<div class="space-y-4">
			{#each filteredCustomers as customer}
				<Card
					class="hover:shadow-md transition-shadow cursor-pointer"
					onclick={() =>
						goto(`/dashboard/support/customers/${customer.id}`)}
				>
					<CardContent class="p-6">
						<div class="flex items-start justify-between">
							<div class="flex items-start space-x-4 flex-1">
								<!-- Customer Avatar -->
								<div class="flex-shrink-0">
									<div
										class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
									>
										<span
											class="text-lg font-medium text-primary"
										>
											{customer.name
												.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toUpperCase()}
										</span>
									</div>
								</div>

								<!-- Customer Details -->
								<div class="flex-1 min-w-0">
									<div
										class="flex items-center space-x-2 mb-2"
									>
										<h3
											class="text-lg font-semibold text-foreground"
										>
											{customer.name}
										</h3>
										{#if customer.isActive}
											<Badge
												variant="secondary"
												class="text-xs">Active</Badge
											>
										{:else}
											<Badge
												variant="outline"
												class="text-xs">Inactive</Badge
											>
										{/if}
									</div>

									<div
										class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3"
									>
										<div>
											<span class="font-medium"
												>Email:</span
											>
											<p class="truncate">
												{customer.email}
											</p>
										</div>
										{#if customer.company}
											<div>
												<span class="font-medium"
													>Company:</span
												>
												<p class="truncate">
													{customer.company}
												</p>
											</div>
										{/if}
										{#if customer.location}
											<div>
												<span class="font-medium"
													>Location:</span
												>
												<p class="truncate">
													{customer.location}
												</p>
											</div>
										{/if}
										{#if customer.phone}
											<div>
												<span class="font-medium"
													>Phone:</span
												>
												<p class="truncate">
													{customer.phone}
												</p>
											</div>
										{/if}
									</div>

									<!-- Stats -->
									<div
										class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
									>
										<div class="bg-muted/50 rounded-lg p-3">
											<div
												class="text-lg font-semibold text-foreground"
											>
												{customer.totalTickets}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Total Tickets
											</div>
										</div>
										<div class="bg-muted/50 rounded-lg p-3">
											<div
												class="text-lg font-semibold text-yellow-600"
											>
												{customer.openTickets}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Open Tickets
											</div>
										</div>
										<div class="bg-muted/50 rounded-lg p-3">
											<div
												class="text-lg font-semibold {getSatisfactionColor(
													customer.satisfactionRating ||
														0,
												)}"
											>
												{customer.satisfactionRating?.toFixed(
													1,
												) || "N/A"}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Satisfaction
											</div>
										</div>
										<div class="bg-muted/50 rounded-lg p-3">
											<div
												class="text-lg font-semibold text-foreground"
											>
												{customer.lastLoginAt
													? formatTimeAgo(
															customer.lastLoginAt,
														)
													: "Never"}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Last Login
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Tags and Actions -->
							<div class="flex flex-col items-end space-y-2">
								{#if customer.tags && customer.tags.length > 0}
									<div class="flex flex-wrap gap-1 max-w-32">
										{#each customer.tags.slice(0, 2) as tag}
											<Badge
												variant="secondary"
												class="text-xs px-1 py-0"
												>#{tag}</Badge
											>
										{/each}
										{#if customer.tags.length > 2}
											<Badge
												variant="secondary"
												class="text-xs px-1 py-0"
											>
												+{customer.tags.length - 2}
											</Badge>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Pagination (mock) -->
		<div class="flex items-center justify-between">
			<div class="text-sm text-muted-foreground">
				Showing {filteredCustomers.length} of {customers.length} customers
			</div>
			<div class="flex space-x-2">
				<Button variant="outline" size="sm" disabled>Previous</Button>
				<Button variant="outline" size="sm" disabled>Next</Button>
			</div>
		</div>
	{/if}
</div>
