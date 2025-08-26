<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Select } from "$lib/components/ui/select";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import {
		TICKET_STATUS,
		TICKET_PRIORITY,
		SUPPORT_ROLES,
		type SupportTicket,
		type TicketMessage,
	} from "$lib/db/schema";
	import { createSupportPermissionManager } from "$lib/utils/support-permissions";

	let currentUser = $state({
		id: "user-1",
		name: "John Smith",
		email: "john@support.com",
		role: SUPPORT_ROLES.MANAGER,
	});

	let permissionManager = $state(null);
	let ticket = $state<SupportTicket | null>(null);
	let messages = $state<TicketMessage[]>([]);
	let isLoading = $state(true);
	let newMessage = $state("");
	let isInternal = $state(false);
	let isSubmitting = $state(false);
	let showStatusUpdate = $state(false);
	let newStatus = $state("");
	let newPriority = $state("");
	let newAssignedTo = $state("");

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			permissionManager = createSupportPermissionManager(
				currentUser.role,
				currentUser.id,
			);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Get ticket ID from URL
			const ticketId = $page.params.ticketId;

			// Mock ticket data
			ticket = {
				id: ticketId,
				ticketNumber: "SUP-001",
				title: "Login issue with email verification",
				description:
					"Customer cannot login despite entering correct credentials. Error shows email verification failed. This has been happening for the past 3 days and is affecting their ability to access important documents.",
				status: TICKET_STATUS.OPEN,
				priority: TICKET_PRIORITY.HIGH,
				category: "Authentication",
				tags: ["login", "email", "verification", "urgent"],
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
			};

			// Mock messages
			messages = [
				{
					id: "msg-1",
					ticketId: ticketId,
					authorId: "customer-1",
					authorType: "customer",
					message:
						"Hi, I'm having trouble logging into my account. I keep getting an error about email verification even though I've already verified my email. This is really frustrating as I need to access some important documents urgently.",
					isInternal: false,
					attachments: [],
					createdAt: new Date("2024-12-15T09:00:00Z"),
					updatedAt: new Date("2024-12-15T09:00:00Z"),
				},
				{
					id: "msg-2",
					ticketId: ticketId,
					authorId: "agent-1",
					authorType: "agent",
					message:
						"Hello John, I'm sorry to hear you're having trouble with login. Let me help you troubleshoot this. Can you tell me what browser you're using and if you've tried clearing your cache? Also, could you confirm the exact error message you're seeing?",
					isInternal: false,
					attachments: [],
					createdAt: new Date("2024-12-15T09:30:00Z"),
					updatedAt: new Date("2024-12-15T09:30:00Z"),
				},
				{
					id: "msg-3",
					ticketId: ticketId,
					authorId: "customer-1",
					authorType: "customer",
					message:
						"I'm using Chrome on Windows. I've tried clearing cache and cookies, but still getting the same error. The message says 'Email verification required' even though I verified my email 2 weeks ago. I've also tried using an incognito window with the same result.",
					isInternal: false,
					attachments: [],
					createdAt: new Date("2024-12-15T09:45:00Z"),
					updatedAt: new Date("2024-12-15T09:45:00Z"),
				},
				{
					id: "msg-4",
					ticketId: ticketId,
					authorId: "agent-1",
					authorType: "agent",
					message:
						"I understand this is frustrating. Let me check your account status in our system. I'll need to verify your email verification status and potentially re-trigger the verification process.",
					isInternal: false,
					attachments: [],
					createdAt: new Date("2024-12-15T10:15:00Z"),
					updatedAt: new Date("2024-12-15T10:15:00Z"),
				},
				{
					id: "msg-5",
					ticketId: ticketId,
					authorId: "agent-1",
					authorType: "agent",
					message:
						"I've checked your account and found the issue. Your email verification status shows as 'pending' in our system, even though you completed the verification. This appears to be a sync issue. I'm escalating this to our technical team to investigate and fix the synchronization problem.",
					isInternal: true,
					attachments: [],
					createdAt: new Date("2024-12-15T10:20:00Z"),
					updatedAt: new Date("2024-12-15T10:20:00Z"),
				},
			];
		} catch (error) {
			console.error("Error loading ticket:", error);
		} finally {
			isLoading = false;
		}
	});

	async function sendMessage() {
		if (!newMessage.trim() || !ticket) return;

		isSubmitting = true;
		try {
			const messageData = {
				ticketId: ticket.id,
				message: newMessage.trim(),
				isInternal,
				authorType:
					currentUser.role === SUPPORT_ROLES.SUPER_ADMIN ||
					currentUser.role === SUPPORT_ROLES.MANAGER ||
					currentUser.role === SUPPORT_ROLES.SENIOR_AGENT ||
					currentUser.role === SUPPORT_ROLES.AGENT
						? "agent"
						: "customer",
			};

			// In real implementation, call API to add message
			console.log("Sending message:", messageData);

			// Add message to local state for immediate feedback
			const newMsg: TicketMessage = {
				id: `msg-${Date.now()}`,
				ticketId: ticket.id,
				authorId: currentUser.id,
				authorType: messageData.authorType,
				message: messageData.message,
				isInternal: messageData.isInternal,
				attachments: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			messages = [...messages, newMsg];
			newMessage = "";
			isInternal = false;

			// Update first response time if this is the first agent response
			if (
				messageData.authorType === "agent" &&
				!ticket.firstResponseTime
			) {
				ticket.firstResponseTime = new Date();
				ticket.updatedAt = new Date();
			}

			// Update ticket updated time
			ticket.updatedAt = new Date();
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			isSubmitting = false;
		}
	}

	async function updateTicketStatus() {
		if (!ticket || !newStatus) return;

		try {
			// In real implementation, call API to update ticket
			console.log("Updating ticket status:", {
				ticketId: ticket.id,
				status: newStatus,
			});

			ticket.status = newStatus;
			ticket.updatedAt = new Date();

			// Handle specific status changes
			if (newStatus === TICKET_STATUS.RESOLVED && !ticket.resolvedAt) {
				ticket.resolvedAt = new Date();
				ticket.resolutionTime = new Date();
			} else if (newStatus === TICKET_STATUS.CLOSED && !ticket.closedAt) {
				ticket.closedAt = new Date();
			}

			showStatusUpdate = false;
			newStatus = "";
		} catch (error) {
			console.error("Error updating ticket status:", error);
		}
	}

	async function updateTicketAssignment() {
		if (!ticket || !newAssignedTo) return;

		try {
			console.log("Updating ticket assignment:", {
				ticketId: ticket.id,
				assignedTo: newAssignedTo,
			});

			ticket.assignedTo = newAssignedTo;
			ticket.assignedBy = currentUser.id;
			ticket.assignedAt = new Date();
			ticket.updatedAt = new Date();

			newAssignedTo = "";
		} catch (error) {
			console.error("Error updating assignment:", error);
		}
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

	function formatDateTime(date: Date | string): string {
		return new Date(date).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
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
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<Button
				variant="ghost"
				onclick={() => goto("/dashboard/support/tickets")}
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
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Tickets
			</Button>
			<div>
				<div class="flex items-center space-x-2 mb-1">
					<h1 class="text-2xl font-bold text-foreground">
						{ticket?.ticketNumber}
					</h1>
					<Badge
						class={getPriorityColor(ticket?.priority || "")}
						variant="secondary"
					>
						{ticket?.priority}
					</Badge>
					<Badge
						class={getStatusColor(ticket?.status || "")}
						variant="outline"
					>
						{ticket?.status?.replace("_", " ")}
					</Badge>
				</div>
				<p class="text-muted-foreground">{ticket?.title}</p>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			{#if permissionManager?.hasPermission("tickets:update")}
				<DropdownMenu bind:open={showStatusUpdate}>
					<DropdownMenuTrigger asChild>
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
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Update Status
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Change Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onclick={() => {
								newStatus = TICKET_STATUS.OPEN;
								updateTicketStatus();
							}}
						>
							Open
						</DropdownMenuItem>
						<DropdownMenuItem
							onclick={() => {
								newStatus = TICKET_STATUS.IN_PROGRESS;
								updateTicketStatus();
							}}
						>
							In Progress
						</DropdownMenuItem>
						<DropdownMenuItem
							onclick={() => {
								newStatus = TICKET_STATUS.PENDING;
								updateTicketStatus();
							}}
						>
							Pending
						</DropdownMenuItem>
						<DropdownMenuItem
							onclick={() => {
								newStatus = TICKET_STATUS.RESOLVED;
								updateTicketStatus();
							}}
						>
							Resolved
						</DropdownMenuItem>
						<DropdownMenuItem
							onclick={() => {
								newStatus = TICKET_STATUS.CLOSED;
								updateTicketStatus();
							}}
						>
							Closed
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}

			{#if permissionManager?.hasPermission("tickets:assign")}
				<Button
					variant="outline"
					onclick={() => {
						newAssignedTo = currentUser.id;
						updateTicketAssignment();
					}}
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
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					Assign to Me
				</Button>
			{/if}
		</div>
	</div>

	{#if isLoading}
		<!-- Loading State -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{#each Array(3) as _}
				<Card>
					<CardContent class="p-6">
						<div class="animate-pulse space-y-4">
							<div class="h-4 bg-muted rounded w-1/2"></div>
							<div class="h-20 bg-muted rounded"></div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else if ticket}
		<!-- Ticket Details -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Ticket Description -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center justify-between">
							<span>Ticket Details</span>
							<div class="flex items-center space-x-2">
								<span class="text-sm text-muted-foreground"
									>Source: {ticket.source}</span
								>
								<Badge
									variant="outline"
									class={`text-xs ${getSLAStatus(ticket).color}`}
								>
									{getSLAStatus(ticket).text}
								</Badge>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="prose prose-sm max-w-none">
							<p
								class="text-muted-foreground whitespace-pre-wrap"
							>
								{ticket.description}
							</p>
						</div>

						{#if ticket.tags && ticket.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each ticket.tags as tag}
									<Badge variant="secondary" class="text-xs"
										>#{tag}</Badge
									>
								{/each}
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Messages -->
				<Card>
					<CardHeader>
						<CardTitle>Conversation</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-4 max-h-96 overflow-y-auto">
							{#each messages.filter((msg) => !msg.isInternal || permissionManager?.hasPermission("tickets:read")) as message}
								<div class="flex space-x-3">
									<div class="flex-shrink-0">
										{#if message.authorType === "customer"}
											<div
												class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
											>
												<span
													class="text-xs font-medium text-blue-600"
												>
													{ticket.customerName
														.split(" ")
														.map(
															(n: string) => n[0],
														)
														.join("")
														.toUpperCase()}
												</span>
											</div>
										{:else}
											<div
												class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
											>
												<span
													class="text-xs font-medium text-green-600"
													>A</span
												>
											</div>
										{/if}
									</div>

									<div class="flex-1 min-w-0">
										<div
											class="flex items-center space-x-2 mb-1"
										>
											<span class="text-sm font-medium">
												{message.authorType ===
												"customer"
													? ticket.customerName
													: "Support Agent"}
											</span>
											<span
												class="text-xs text-muted-foreground"
											>
												{formatTimeAgo(
													message.createdAt,
												)}
											</span>
											{#if message.isInternal}
												<Badge
													variant="outline"
													class="text-xs"
													>Internal</Badge
												>
											{/if}
										</div>

										<div class="bg-muted/50 rounded-lg p-3">
											<p
												class="text-sm whitespace-pre-wrap"
											>
												{message.message}
											</p>
										</div>
									</div>
								</div>
							{/each}
						</div>

						<!-- Add Message -->
						<div class="border-t pt-4">
							<div class="space-y-3">
								<Textarea
									bind:value={newMessage}
									placeholder="Type your message..."
									rows="3"
									class="resize-none"
								/>

								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										{#if permissionManager?.isAgent()}
											<label
												class="flex items-center space-x-2 text-sm"
											>
												<input
													type="checkbox"
													bind:checked={isInternal}
													class="rounded border-gray-300"
												/>
												<span>Internal note</span>
											</label>
										{/if}
									</div>

									<Button
										onclick={sendMessage}
										disabled={!newMessage.trim() ||
											isSubmitting}
									>
										{#if isSubmitting}
											<div
												class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
											></div>
										{/if}
										Send Message
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Customer Information -->
				<Card>
					<CardHeader>
						<CardTitle>Customer Information</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="flex items-center space-x-3">
							<div
								class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
							>
								<span class="text-sm font-medium text-primary">
									{ticket.customerName
										.split(" ")
										.map((n: string) => n[0])
										.join("")
										.toUpperCase()}
								</span>
							</div>
							<div>
								<p class="font-medium">{ticket.customerName}</p>
								<p class="text-sm text-muted-foreground">
									{ticket.customerEmail}
								</p>
							</div>
						</div>

						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-muted-foreground"
									>Customer ID:</span
								>
								<span>{ticket.customerId}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground"
									>Category:</span
								>
								<span>{ticket.category || "Not specified"}</span
								>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Assignment & Timeline -->
				<Card>
					<CardHeader>
						<CardTitle>Assignment & Timeline</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground"
									>Assigned to:</span
								>
								<div class="flex items-center space-x-2">
									{#if ticket.assignedTo}
										<Avatar class="w-6 h-6">
											<AvatarFallback class="text-xs">
												{ticket.assignedTo
													.split(" ")
													.map((n: string) => n[0])
													.join("")
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span class="text-sm"
											>{ticket.assignedTo}</span
										>
									{:else}
										<Badge variant="outline" class="text-xs"
											>Unassigned</Badge
										>
									{/if}
								</div>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground"
									>Created:</span
								>
								<span class="text-sm"
									>{formatDateTime(ticket.createdAt)}</span
								>
							</div>

							{#if ticket.firstResponseTime}
								<div class="flex items-center justify-between">
									<span class="text-sm text-muted-foreground"
										>First response:</span
									>
									<span class="text-sm"
										>{formatDateTime(
											ticket.firstResponseTime,
										)}</span
									>
								</div>
							{/if}

							{#if ticket.resolvedAt}
								<div class="flex items-center justify-between">
									<span class="text-sm text-muted-foreground"
										>Resolved:</span
									>
									<span class="text-sm"
										>{formatDateTime(
											ticket.resolvedAt,
										)}</span
									>
								</div>
							{/if}

							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground"
									>Last updated:</span
								>
								<span class="text-sm"
									>{formatDateTime(ticket.updatedAt)}</span
								>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Quick Actions -->
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2">
						{#if permissionManager?.hasPermission("tickets:close") && ticket.status !== TICKET_STATUS.CLOSED}
							<Button
								variant="outline"
								class="w-full justify-start"
								onclick={() => {
									newStatus = TICKET_STATUS.CLOSED;
									updateTicketStatus();
								}}
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Close Ticket
							</Button>
						{/if}

						{#if permissionManager?.hasPermission("tickets:escalate") && ticket.priority !== TICKET_PRIORITY.CRITICAL}
							<Button
								variant="outline"
								class="w-full justify-start"
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
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								Escalate Priority
							</Button>
						{/if}

						<Button variant="outline" class="w-full justify-start">
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
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							View Timeline
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	{/if}
</div>
