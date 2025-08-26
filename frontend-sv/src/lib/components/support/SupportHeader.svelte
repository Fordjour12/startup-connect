<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
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
	import { Badge } from "$lib/components/ui/badge";

	interface Props {
		currentUser: any;
		permissionManager: any;
		isLoading: boolean;
	}

	let { currentUser, permissionManager, isLoading }: Props = $props();

	let searchQuery = $state("");
	let showNotifications = $state(false);

	// Mock notifications - replace with real notification data
	const notifications = [
		{
			id: 1,
			title: "New ticket assigned",
			message: "Critical priority ticket #SUP-001 requires attention",
			time: "2 minutes ago",
			unread: true,
			type: "ticket",
		},
		{
			id: 2,
			title: "SLA breach warning",
			message: "Ticket #SUP-042 is approaching SLA deadline",
			time: "15 minutes ago",
			unread: true,
			type: "sla",
		},
		{
			id: 3,
			title: "Customer feedback received",
			message: "5-star rating received for ticket #SUP-038",
			time: "1 hour ago",
			unread: false,
			type: "feedback",
		},
		{
			id: 4,
			title: "Team mention",
			message: "Sarah mentioned you in ticket #SUP-029",
			time: "2 hours ago",
			unread: false,
			type: "mention",
		},
	];

	const unreadCount = notifications.filter((n) => n.unread).length;

	function getNotificationIcon(type: string): string {
		const iconMap: Record<string, string> = {
			ticket: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
			sla: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
			feedback:
				"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
			mention:
				"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
		};
		return iconMap[type] || iconMap.ticket;
	}

	function getNotificationColor(type: string): string {
		const colorMap: Record<string, string> = {
			ticket: "text-blue-600",
			sla: "text-red-600",
			feedback: "text-green-600",
			mention: "text-purple-600",
		};
		return colorMap[type] || colorMap.ticket;
	}
</script>

<header class="h-16 border-b bg-card px-6 flex items-center justify-between">
	<!-- Left Section - Page Title -->
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<h1 class="text-xl font-semibold text-foreground">
				Support Dashboard
			</h1>
			{#if currentUser?.isOnline}
				<Badge variant="secondary" class="text-xs">Online</Badge>
			{/if}
		</div>
	</div>

	<!-- Center Section - Search -->
	<div class="flex-1 max-w-md mx-8">
		<div class="relative">
			<svg
				class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<Input
				bind:value={searchQuery}
				placeholder="Search tickets, customers, articles..."
				class="pl-10"
			/>
		</div>
	</div>

	<!-- Right Section - Actions & User Menu -->
	<div class="flex items-center space-x-4">
		<!-- Quick Actions (Admin/Manager only) -->
		{#if permissionManager?.isAdmin()}
			<div class="flex items-center space-x-2">
				{#if permissionManager?.hasPermission("tickets:create")}
					<Button variant="outline" size="sm">
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

				{#if permissionManager?.hasPermission("reports:create")}
					<Button variant="outline" size="sm">
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
								d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Quick Report
					</Button>
				{/if}
			</div>
		{/if}

		<!-- Notifications -->
		<DropdownMenu bind:open={showNotifications}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" class="relative">
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-5-5 5-5h-5m-6 10v-5a6 6 0 1 0-12 0v5h12z"
						/>
					</svg>
					{#if unreadCount > 0}
						<span
							class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
						>
							{unreadCount}
						</span>
					{/if}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" class="w-80">
				<DropdownMenuLabel class="flex items-center justify-between">
					Notifications
					{#if unreadCount > 0}
						<span class="text-xs text-muted-foreground"
							>{unreadCount} new</span
						>
					{/if}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{#each notifications.slice(0, 5) as notification}
					<DropdownMenuItem
						class="flex flex-col items-start p-3 cursor-pointer"
					>
						<div class="flex items-start justify-between w-full">
							<div class="flex items-start space-x-3 w-full">
								<div class="flex-shrink-0">
									<div
										class="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
									>
										<svg
											class="w-4 h-4 {getNotificationColor(
												notification.type,
											)}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d={getNotificationIcon(
													notification.type,
												)}
											/>
										</svg>
									</div>
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium">
										{notification.title}
									</p>
									<p
										class="text-xs text-muted-foreground mt-1"
									>
										{notification.message}
									</p>
									<p
										class="text-xs text-muted-foreground mt-1"
									>
										{notification.time}
									</p>
								</div>
								{#if notification.unread}
									<div
										class="w-2 h-2 bg-blue-500 rounded-full mt-2"
									></div>
								{/if}
							</div>
						</div>
					</DropdownMenuItem>
				{/each}

				{#if notifications.length > 5}
					<DropdownMenuItem
						class="text-center text-sm text-muted-foreground cursor-pointer"
					>
						View all notifications
					</DropdownMenuItem>
				{/if}
			</DropdownMenuContent>
		</DropdownMenu>

		<!-- User Menu -->
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" class="relative h-8 w-8 rounded-full">
					<Avatar class="h-8 w-8">
						<AvatarImage
							src={currentUser?.avatar}
							alt={currentUser?.name}
						/>
						<AvatarFallback>
							{currentUser?.name
								?.split(" ")
								.map((n: string) => n[0])
								.join("")
								.toUpperCase() || "U"}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel class="font-normal">
					<div class="flex flex-col space-y-1">
						<p class="text-sm font-medium leading-none">
							{currentUser?.name}
						</p>
						<p class="text-xs leading-none text-muted-foreground">
							{currentUser?.email}
						</p>
						<p
							class="text-xs leading-none text-muted-foreground capitalize"
						>
							{currentUser?.role?.replace("_", " ")}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{#if permissionManager?.hasPermission("settings:read")}
					<DropdownMenuItem
						onclick={() => goto("/dashboard/profile")}
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
						Profile
					</DropdownMenuItem>
				{/if}

				{#if permissionManager?.hasPermission("settings:read")}
					<DropdownMenuItem
						onclick={() => goto("/dashboard/support/settings")}
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
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
						</svg>
						Support Settings
					</DropdownMenuItem>
				{/if}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onclick={() => goto("/auth/logout")}
					class="text-red-600"
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
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</header>
