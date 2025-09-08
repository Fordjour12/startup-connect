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
	import { Textarea } from "$lib/components/ui/textarea";
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
		MessageSquare,
		Send,
		Paperclip,
		Smile,
		MoreHorizontal,
		CheckCircle,
		Clock,
		AlertCircle,
		Calendar,
		FileText,
		Image,
		Video,
		Download,
		Reply,
		Forward,
		Archive,
		Trash2,
	} from "@lucide/svelte";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";

	// Mock data for communication system
	let conversations = $state([
		{
			id: "1",
			startup: {
				name: "TechFlow Inc.",
				avatar: "/avatars/startup-1.jpg",
				status: "online",
			},
			lastMessage: {
				content:
					"Thanks for the strategy session yesterday. The insights were very helpful!",
				timestamp: "2 hours ago",
				sender: "startup",
				isRead: false,
			},
			unreadCount: 2,
			booking: {
				id: "booking-1",
				title: "Business Strategy Consultation",
				status: "completed",
			},
			priority: "high",
		},
		{
			id: "2",
			startup: {
				name: "GreenTech Solutions",
				avatar: "/avatars/startup-2.jpg",
				status: "away",
			},
			lastMessage: {
				content: "Can we schedule a follow-up call for next week?",
				timestamp: "1 day ago",
				sender: "startup",
				isRead: true,
			},
			unreadCount: 0,
			booking: {
				id: "booking-2",
				title: "Marketing Strategy Review",
				status: "in_progress",
			},
			priority: "medium",
		},
		{
			id: "3",
			startup: {
				name: "DataViz Pro",
				avatar: "/avatars/startup-3.jpg",
				status: "offline",
			},
			lastMessage: {
				content: "I've sent the financial model draft for your review.",
				timestamp: "3 days ago",
				sender: "supporter",
				isRead: true,
			},
			unreadCount: 0,
			booking: {
				id: "booking-3",
				title: "Financial Planning Session",
				status: "pending",
			},
			priority: "low",
		},
	]);

	let selectedConversation = $state(conversations[0]);
	let messages = $state([
		{
			id: "1",
			sender: "startup",
			content:
				"Hi! I'm interested in your business strategy consulting service.",
			timestamp: "2024-01-10T10:00:00Z",
			isRead: true,
		},
		{
			id: "2",
			sender: "supporter",
			content:
				"Hello! I'd be happy to help with your business strategy. Can you tell me more about your startup and what specific challenges you're facing?",
			timestamp: "2024-01-10T10:15:00Z",
			isRead: true,
		},
		{
			id: "3",
			sender: "startup",
			content:
				"We're a SaaS company in the workflow automation space. We're struggling with market positioning and growth strategy.",
			timestamp: "2024-01-10T10:30:00Z",
			isRead: true,
		},
		{
			id: "4",
			sender: "supporter",
			content:
				"That's a great space to be in! I have extensive experience with SaaS companies. Let me send you a proposal for a comprehensive strategy session.",
			timestamp: "2024-01-10T10:45:00Z",
			isRead: true,
		},
		{
			id: "5",
			sender: "startup",
			content:
				"Thanks for the strategy session yesterday. The insights were very helpful!",
			timestamp: "2024-01-12T14:00:00Z",
			isRead: false,
		},
	]);

	let newMessage = $state("");
	let searchQuery = $state("");
	let selectedFilter = $state("all");

	const filters = [
		{ value: "all", label: "All Conversations" },
		{ value: "unread", label: "Unread" },
		{ value: "high_priority", label: "High Priority" },
		{ value: "active_bookings", label: "Active Bookings" },
	];

	function selectConversation(conversation: any) {
		selectedConversation = conversation;
		// TODO: Load messages for this conversation
		console.log("Loading messages for conversation:", conversation.id);
	}

	function sendMessage() {
		if (newMessage.trim()) {
			// TODO: Send message via API
			console.log("Sending message:", newMessage);
			newMessage = "";
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "online":
				return "bg-green-500";
			case "away":
				return "bg-yellow-500";
			case "offline":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	function formatTimestamp(timestamp: string) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 1) {
			return "Just now";
		} else if (diffInHours < 24) {
			return `${Math.floor(diffInHours)} hours ago`;
		} else {
			return date.toLocaleDateString();
		}
	}

	onMount(() => {
		// TODO: Load conversations and messages from API
		console.log("Loading communication data...");
	});
</script>

<div class="flex h-[600px] border rounded-lg overflow-hidden">
	<!-- Conversations Sidebar -->
	<div class="w-1/3 border-r bg-muted/10">
		<!-- Header -->
		<div class="p-4 border-b">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold">Conversations</h3>
				<Button variant="outline" size="sm">
					<MessageSquare class="h-4 w-4 mr-2" />
					New Chat
				</Button>
			</div>

			<!-- Search and Filter -->
			<div class="space-y-2">
				<div class="relative">
					<Search
						class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search conversations..."
						class="pl-10"
					/>
				</div>
				<Select bind:value={selectedFilter}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{#each filters as filter}
							<SelectItem value={filter.value}
								>{filter.label}</SelectItem
							>
						{/each}
					</SelectContent>
				</Select>
			</div>
		</div>

		<!-- Conversations List -->
		<div class="flex-1 overflow-y-auto">
			{#each conversations as conversation}
				<div
					class="p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors {selectedConversation.id ===
					conversation.id
						? 'bg-muted'
						: ''}"
					onclick={() => selectConversation(conversation)}
				>
					<div class="flex items-start gap-3">
						<!-- Avatar -->
						<div class="relative">
							<div
								class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
							>
								<span class="text-sm font-medium">
									{conversation.startup.name.charAt(0)}
								</span>
							</div>
							<div
								class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background {getStatusColor(
									conversation.startup.status,
								)}"
							></div>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between mb-1">
								<h4 class="font-medium truncate">
									{conversation.startup.name}
								</h4>
								<div class="flex items-center gap-1">
									{#if conversation.unreadCount > 0}
										<Badge
											variant="destructive"
											class="text-xs"
										>
											{conversation.unreadCount}
										</Badge>
									{/if}
									<Badge
										class={getPriorityColor(
											conversation.priority,
										)}
									>
										{conversation.priority}
									</Badge>
								</div>
							</div>

							<p
								class="text-sm text-muted-foreground truncate mb-1"
							>
								{conversation.lastMessage.content}
							</p>

							<div
								class="flex items-center justify-between text-xs text-muted-foreground"
							>
								<span>{conversation.lastMessage.timestamp}</span
								>
								<div class="flex items-center gap-1">
									<span class="capitalize"
										>{conversation.booking.status}</span
									>
									{#if !conversation.lastMessage.isRead}
										<AlertCircle
											class="h-3 w-3 text-blue-500"
										/>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Chat Area -->
	<div class="flex-1 flex flex-col">
		<!-- Chat Header -->
		<div class="p-4 border-b bg-muted/10">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="relative">
						<div
							class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
						>
							<span class="text-sm font-medium">
								{selectedConversation.startup.name.charAt(0)}
							</span>
						</div>
						<div
							class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background {getStatusColor(
								selectedConversation.startup.status,
							)}"
						></div>
					</div>
					<div>
						<h3 class="font-semibold">
							{selectedConversation.startup.name}
						</h3>
						<p class="text-sm text-muted-foreground">
							{selectedConversation.booking.title} • {selectedConversation
								.booking.status}
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Calendar class="h-4 w-4 mr-2" />
						Schedule
					</Button>
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
							<DropdownMenuItem>
								<Archive class="h-4 w-4 mr-2" />
								Archive Chat
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Trash2 class="h-4 w-4 mr-2" />
								Delete Chat
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>

		<!-- Messages -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4">
			{#each messages as message}
				<div
					class="flex {message.sender === 'supporter'
						? 'justify-end'
						: 'justify-start'}"
				>
					<div
						class="max-w-[70%] {message.sender === 'supporter'
							? 'bg-primary text-primary-foreground'
							: 'bg-muted'} rounded-lg p-3"
					>
						<p class="text-sm">{message.content}</p>
						<div
							class="flex items-center justify-between mt-2 text-xs opacity-70"
						>
							<span>{formatTimestamp(message.timestamp)}</span>
							{#if message.sender === "supporter"}
								{#if message.isRead}
									<CheckCircle class="h-3 w-3" />
								{:else}
									<Clock class="h-3 w-3" />
								{/if}
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Message Input -->
		<div class="p-4 border-t bg-muted/10">
			<div class="flex items-end gap-2">
				<div class="flex-1">
					<Textarea
						bind:value={newMessage}
						placeholder="Type your message..."
						rows="2"
						class="resize-none"
						onkeydown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								sendMessage();
							}
						}}
					/>
				</div>
				<div class="flex items-center gap-1">
					<Button variant="ghost" size="sm">
						<Paperclip class="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm">
						<Smile class="h-4 w-4" />
					</Button>
					<Button
						onclick={() => sendMessage()}
						disabled={!newMessage.trim()}
					>
						<Send class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
