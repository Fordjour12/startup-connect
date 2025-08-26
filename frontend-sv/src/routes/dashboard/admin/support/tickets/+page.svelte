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
		type SupportTicket,
	} from "$lib/db/schema";
	import { createSupportPermissionManager } from "$lib/utils/support-permissions";

	let currentUser = $state({
		id: "user-1",
		name: "John Smith",
		email: "john@support.com",
		role: SUPPORT_ROLES.MANAGER,
	});

	let permissionManager = $state(null);
	let tickets = $state<SupportTicket[]>([]);
	let filteredTickets = $state<SupportTicket[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state("");
	let statusFilter = $state("all");
	let priorityFilter = $state("all");
	let categoryFilter = $state("all");
	let assignedToFilter = $state("all");

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			permissionManager = createSupportPermissionManager(
				currentUser.role,
				currentUser.id,
			);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			tickets = [
				{
					id: "ticket-1",
					ticketNumber: "SUP-001",
					title: "Login issue with email verification",
					description:
						"Customer cannot login despite entering correct credentials. Error shows email verification failed.",
					status: TICKET_STATUS.OPEN,
					priority: TICKET_PRIORITY.HIGH,
					category: "Authentication",
					tags: ["login", "email", "verification"],
					customerId: "customer-1",
					customerEmail: "john.doe@example.com",
					customerName: "John Doe",
					assignedTo: "agent-1",
					assignedBy: "manager-1",
					assignedAt: new Date("2024-12-15T10:00:00Z"),
					createdAt: new Date("2024-12-15T09:00:00Z"),
					updatedAt: new Date("2024-12-15T10:00:00Z"),
					resolvedAt: null,
					closedAt: null,
					slaBreachTime: null,
					firstResponseTime: new Date("2024-12-15T09:30:00Z"),
					resolutionTime: null,
					source: "email",
					satisfactionRating: null,
					feedback: null,
				},
				{
					id: "ticket-2",
					ticketNumber: "SUP-002",
					title: "Feature request: Dark mode toggle",
					description:
						"Customer is requesting a dark mode feature for the dashboard.",
					status: TICKET_STATUS.IN_PROGRESS,
					priority: TICKET_PRIORITY.MEDIUM,
					category: "Feature Request",
					tags: ["feature", "ui", "dark-mode"],
					customerId: "customer-2",
					customerEmail: "sarah.smith@company.com",
					customerName: "Sarah Smith",
					assignedTo: "agent-2",
					assignedBy: "manager-1",
					assignedAt: new Date("2024-12-14T14:00:00Z"),
					createdAt: new Date("2024-12-14T13:00:00Z"),
					updatedAt: new Date("2024-12-15T11:00:00Z"),
					resolvedAt: null,
					closedAt: null,
					slaBreachTime: null,
					firstResponseTime: new Date("2024-12-14T13:15:00Z"),
					resolutionTime: null,
					source: "chat",
					satisfactionRating: null,
					feedback: null,
				},
				{
					id: "ticket-3",
					ticketNumber: "SUP-003",
					title: "Billing discrepancy - charged twice",
					description:
						"Customer was charged twice for the same subscription period.",
					status: TICKET_STATUS.RESOLVED,
					priority: TICKET_PRIORITY.CRITICAL,
					category: "Billing",
					tags: ["billing", "refund", "duplicate-charge"],
					customerId: "customer-3",
					customerEmail: "mike.johnson@enterprise.com",
					customerName: "Mike Johnson",
					assignedTo: "agent-1",
					assignedBy: "manager-1",
					assignedAt: new Date("2024-12-13T08:00:00Z"),
					createdAt: new Date("2024-12-13T07:30:00Z"),
					updatedAt: new Date("2024-12-14T16:00:00Z"),
					resolvedAt: new Date("2024-12-14T15:00:00Z"),
					closedAt: new Date("2024-12-14T16:00:00Z"),
					slaBreachTime: null,
					firstResponseTime: new Date("2024-12-13T08:00:00Z"),
					resolutionTime: new Date("2024-12-14T15:00:00Z"),
					source: "phone",
					satisfactionRating: 5,
					feedback: "Excellent support, very fast resolution!",
				},
				{
					id: "ticket-4",
					ticketNumber: "SUP-004",
					title: "API documentation unclear",
					description:
						"The API documentation for the new endpoints is unclear and missing examples.",
					status: TICKET_STATUS.PENDING,
					priority: TICKET_PRIORITY.LOW,
					category: "Documentation",
					tags: ["api", "docs", "examples"],
					customerId: "customer-4",
					customerEmail: "emily@startup.io",
					customerName: "Emily Rodriguez",
					assignedTo: null,
					assignedBy: null,
					assignedAt: null,
					createdAt: new Date("2024-12-15T08:15:00Z"),
					updatedAt: new Date("2024-12-15T08:15:00Z"),
					resolvedAt: null,
					closedAt: null,
					slaBreachTime: null,
					firstResponseTime: null,
					resolutionTime: null,
					source: "manual",
					satisfactionRating: null,
					feedback: null,
				},
				{
					id: "ticket-5",
					ticketNumber: "SUP-005",
					title: "Password reset not working",
					description:
						"Customer cannot reset password, reset link is not being sent to email.",
					status: TICKET_STATUS.OPEN,
					priority: TICKET_PRIORITY.MEDIUM,
					category: "Authentication",
					tags: ["password", "reset", "email"],
					customerId: "customer-5",
					customerEmail: "alex.brown@techcorp.com",
					customerName: "Alex Brown",
					assignedTo: "agent-3",
					assignedBy: "manager-1",
					assignedAt: new Date("2024-12-15T12:00:00Z"),
					createdAt: new Date("2024-12-15T11:30:00Z"),
					updatedAt: new Date("2024-12-15T12:00:00Z"),
					resolvedAt: null,
					closedAt: null,
					slaBreachTime: null,
					firstResponseTime: null,
					resolutionTime: null,
					source: "email",
					satisfactionRating: null,
					feedback: null,
				},
			];

			filteredTickets = [...tickets];
		} catch (error) {
			console.error("Error loading tickets:", error);
		} finally {
			isLoading = false;
		}
	});

	// Reactive filtering
	$: {
		filteredTickets = tickets.filter((ticket) => {
			const matchesSearch =
				searchQuery === "" ||
				ticket.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				ticket.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				ticket.customerName
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				ticket.customerEmail
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				ticket.ticketNumber
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === "all" || ticket.status === statusFilter;
			const matchesPriority =
				priorityFilter === "all" || ticket.priority === priorityFilter;
			const matchesCategory =
				categoryFilter === "all" || ticket.category === categoryFilter;
			const matchesAssigned =
				assignedToFilter === "all" ||
				(assignedToFilter === "assigned" && ticket.assignedTo) ||
				(assignedToFilter === "unassigned" && !ticket.assignedTo) ||
				ticket.assignedTo === assignedToFilter;

			return (
				matchesSearch &&
				matchesStatus &&
				matchesPriority &&
				matchesCategory &&
				matchesAssigned
			);
		});
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			[TICKET_STATUS.OPEN]: "bg-blue-100 text-blue-800",
			[TICKET_STATUS.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
			[TICKET_STATUS.PENDING]: "bg-orange-100 text-orange-800",
			[TICKET_STATUS.RESOLVED]: "bg-green-100 text-green-800",
			[TICKET_STATUS.CLOSED]: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	}

	function getPriorityColor(priority: string): string {
		const colors: Record<string, string> = {
			[TICKET_PRIORITY.CRITICAL]: "bg-red-100 text-red-800",
			[TICKET_PRIORITY.HIGH]: "bg-orange-100 text-orange-800",
			[TICKET_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
			[TICKET_PRIORITY.LOW]: "bg-green-100 text-green-800",
		};
		return colors[priority] || "bg-gray-100 text-gray-800";
	}

	function formatTimeAgo(date: string): string {
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

	function getSLAStatus(ticket: SupportTicket): {
		text: string;
		color: string;
	} {
		if (!ticket.firstResponseTime && ticket.status === TICKET_STATUS.OPEN) {
			const now = new Date();
			const created = new Date(ticket.createdAt);
			const diffInHours =
				(now.getTime() - created.getTime()) / (1000 * 60 * 60);

			if (diffInHours > 2) {
				return { text: "Overdue", color: "text-red-600" };
			} else if (diffInHours > 1) {
				return { text: "Due Soon", color: "text-yellow-600" };
			}
		}

		if (ticket.slaBreachTime) {
			return { text: "Breach", color: "text-red-600" };
		}

		return { text: "On Track", color: "text-green-600" };
	}

	function getUniqueValues<T>(array: T[], key: keyof T): string[] {
		return Array.from(new Set(array.map((item) => item[key]))).filter(
			Boolean,
		) as string[];
	}

	function getUniqueAssignedTo(): string[] {
		return Array.from(
			new Set(tickets.map((ticket) => ticket.assignedTo).filter(Boolean)),
		) as string[];
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Support Tickets</h1>
			<p class="text-muted-foreground">
				Manage and track all customer support tickets
			</p>
		</div>
		<div class="flex space-x-3">
			{#if permissionManager?.hasPermission("tickets:create")}
				<Button onclick={() => goto("/dashboard/support/tickets/new")}>
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
					New Ticket
				</Button>
			{/if}
		</div>
	</div>

	<!-- Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
				<!-- Search -->
				<div class="lg:col-span-2">
					<Input
						bind:value={searchQuery}
						placeholder="Search tickets..."
						class="w-full"
					/>
				</div>

				<!-- Status Filter -->
				<div>
					<Select bind:value={statusFilter}>
						<option value="all">All Status</option>
						<option value={TICKET_STATUS.OPEN}>Open</option>
						<option value={TICKET_STATUS.IN_PROGRESS}
							>In Progress</option
						>
						<option value={TICKET_STATUS.PENDING}>Pending</option>
						<option value={TICKET_STATUS.RESOLVED}>Resolved</option>
						<option value={TICKET_STATUS.CLOSED}>Closed</option>
					</Select>
				</div>

				<!-- Priority Filter -->
				<div>
					<Select bind:value={priorityFilter}>
						<option value="all">All Priority</option>
						<option value={TICKET_PRIORITY.CRITICAL}
							>Critical</option
						>
						<option value={TICKET_PRIORITY.HIGH}>High</option>
						<option value={TICKET_PRIORITY.MEDIUM}>Medium</option>
						<option value={TICKET_PRIORITY.LOW}>Low</option>
					</Select>
				</div>

				<!-- Category Filter -->
				<div>
					<Select bind:value={categoryFilter}>
						<option value="all">All Categories</option>
						{#each getUniqueValues(tickets, "category") as category}
							<option value={category}>{category}</option>
						{/each}
					</Select>
				</div>

				<!-- Assignment Filter -->
				<div>
					<Select bind:value={assignedToFilter}>
						<option value="all">All Assignments</option>
						<option value="assigned">Assigned</option>
						<option value="unassigned">Unassigned</option>
						{#each getUniqueAssignedTo() as assignedTo}
							<option value={assignedTo}>{assignedTo}</option>
						{/each}
					</Select>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Tickets List -->
	{#if isLoading}
		<!-- Loading State -->
		<div class="space-y-4">
			{#each Array(5) as _}
				<Card>
					<CardContent class="p-6">
						<div class="animate-pulse">
							<div class="flex items-center space-x-4 mb-4">
								<div
									class="w-10 h-10 bg-muted rounded-full"
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
							<div class="h-3 bg-muted rounded w-3/4"></div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else if filteredTickets.length === 0}
		<!-- No Tickets -->
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
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<h3 class="text-lg font-medium text-muted-foreground mb-2">
					No tickets found
				</h3>
				<p class="text-sm text-muted-foreground mb-4">
					{searchQuery ||
					statusFilter !== "all" ||
					priorityFilter !== "all" ||
					categoryFilter !== "all" ||
					assignedToFilter !== "all"
						? "Try adjusting your filters to see more tickets."
						: "There are no tickets to display."}
				</p>
				{#if permissionManager?.hasPermission("tickets:create")}
					<Button
						onclick={() => goto("/dashboard/support/tickets/new")}
					>
						Create First Ticket
					</Button>
				{/if}
			</CardContent>
		</Card>
	{:else}
		<!-- Tickets List -->
		<div class="space-y-4">
			{#each filteredTickets as ticket}
				<Card
					class="hover:shadow-md transition-shadow cursor-pointer"
					onclick={() =>
						goto(`/dashboard/support/tickets/${ticket.id}`)}
				>
					<CardContent class="p-6">
						<div class="flex items-start justify-between">
							<div class="flex items-start space-x-4 flex-1">
								<!-- Customer Avatar -->
								<div class="flex-shrink-0">
									<div
										class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
									>
										<span
											class="text-sm font-medium text-primary"
										>
											{ticket.customerName
												.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toUpperCase()}
										</span>
									</div>
								</div>

								<!-- Ticket Details -->
								<div class="flex-1 min-w-0">
									<div
										class="flex items-center space-x-2 mb-2"
									>
										<span
											class="text-lg font-semibold text-foreground"
											>{ticket.ticketNumber}</span
										>
										<Badge
											class={getPriorityColor(
												ticket.priority,
											)}
											variant="secondary"
										>
											{ticket.priority}
										</Badge>
										<Badge
											class={getStatusColor(
												ticket.status,
											)}
											variant="outline"
										>
											{ticket.status.replace("_", " ")}
										</Badge>
										{#if ticket.category}
											<Badge
												variant="outline"
												class="text-xs"
											>
												{ticket.category}
											</Badge>
										{/if}
									</div>

									<h3
										class="text-base font-medium text-foreground mb-2"
									>
										{ticket.title}
									</h3>

									<p
										class="text-sm text-muted-foreground mb-3 line-clamp-2"
									>
										{ticket.description}
									</p>

									<div
										class="flex items-center space-x-4 text-xs text-muted-foreground"
									>
										<span>{ticket.customerName}</span>
										<span>•</span>
										<span
											>{formatTimeAgo(
												ticket.createdAt,
											)}</span
										>
										<span>•</span>
										<span>Source: {ticket.source}</span>
										{#if ticket.firstResponseTime}
											<span>•</span>
											<span
												>First response: {formatTimeAgo(
													ticket.firstResponseTime,
												)}</span
											>
										{/if}
									</div>
								</div>
							</div>

							<!-- Right Side -->
							<div class="flex flex-col items-end space-y-2">
								<!-- SLA Status -->
								<div class="text-right">
									<div
										class={`text-xs font-medium ${getSLAStatus(ticket).color}`}
									>
										{getSLAStatus(ticket).text}
									</div>
								</div>

								<!-- Assignment -->
								<div class="flex items-center space-x-2">
									{#if ticket.assignedTo}
										<div
											class="flex items-center space-x-2"
										>
											<Avatar class="w-6 h-6">
												<AvatarFallback class="text-xs">
													{ticket.assignedTo
														.split(" ")
														.map(
															(n: string) => n[0],
														)
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span
												class="text-xs text-muted-foreground"
												>{ticket.assignedTo}</span
											>
										</div>
									{:else}
										<Badge variant="outline" class="text-xs"
											>Unassigned</Badge
										>
									{/if}
								</div>

								<!-- Tags -->
								{#if ticket.tags && ticket.tags.length > 0}
									<div class="flex flex-wrap gap-1 max-w-32">
										{#each ticket.tags.slice(0, 2) as tag}
											<Badge
												variant="secondary"
												class="text-xs px-1 py-0"
											>
												{tag}
											</Badge>
										{/each}
										{#if ticket.tags.length > 2}
											<Badge
												variant="secondary"
												class="text-xs px-1 py-0"
											>
												+{ticket.tags.length - 2}
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
				Showing {filteredTickets.length} of {tickets.length} tickets
			</div>
			<div class="flex space-x-2">
				<Button variant="outline" size="sm" disabled>Previous</Button>
				<Button variant="outline" size="sm" disabled>Next</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
