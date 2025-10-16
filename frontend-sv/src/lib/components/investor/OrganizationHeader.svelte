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

	interface Props {
		organization: any;
		userRole: string;
		isLoading: boolean;
	}

	let { organization, userRole, isLoading }: Props = $props();

	let searchQuery = $state("");
	let showNotifications = $state(false);

	// Mock user data - replace with real user data
	const currentUser = {
		name: "John Doe",
		email: "john@techventure.com",
		avatar: null,
		role: userRole,
	};

	// Mock notifications - replace with real notification data
	const notifications = [
		{
			id: 1,
			title: "New member joined",
			message: "Sarah Johnson joined TechVenture Capital",
			time: "2 hours ago",
			unread: true,
		},
		{
			id: 2,
			title: "Due diligence completed",
			message: "Due diligence for StartupXYZ is now complete",
			time: "5 hours ago",
			unread: true,
		},
		{
			id: 3,
			title: "Portfolio update",
			message: "Portfolio report for Q3 is ready",
			time: "1 day ago",
			unread: false,
		},
	];

	const unreadCount = notifications.filter((n) => n.unread).length;

	function getRoleDisplayName(role: string): string {
		const roleMap: Record<string, string> = {
			owner: "Owner",
			admin: "Admin",
			investment_partner: "Investment Partner",
			investment_analyst: "Investment Analyst",
			operations: "Operations",
			member: "Member",
			viewer: "Viewer",
		};
		return roleMap[role] || role;
	}
</script>

<header class="h-16 border-b bg-card px-6 flex items-center justify-between">
	<!-- Left Section - Breadcrumbs -->
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<button
				onclick={() => goto("/dashboard/investor/organization")}
				class="text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				Organization
			</button>
			<svg
				class="w-4 h-4 text-muted-foreground"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				/>
			</svg>
			<span class="text-sm font-medium text-foreground">
				{#if isLoading}
					Loading...
				{:else}
					{organization?.name || "Organization"}
				{/if}
			</span>
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
				placeholder="Search organizations, startups, members..."
				class="pl-10"
			/>
		</div>
	</div>

	<!-- Right Section - Actions & User Menu -->
	<div class="flex items-center space-x-4">
		<!-- Quick Actions (Admin only) -->
		{#if ["owner", "admin"].includes(userRole)}
			<div class="flex items-center space-x-2">
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
					Invite Member
				</Button>
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
							<div class="flex-1">
								<p class="text-sm font-medium">
									{notification.title}
								</p>
								<p class="text-xs text-muted-foreground mt-1">
									{notification.message}
								</p>
								<p class="text-xs text-muted-foreground mt-1">
									{notification.time}
								</p>
							</div>
							{#if notification.unread}
								<div
									class="w-2 h-2 bg-blue-500 rounded-full mt-2"
								></div>
							{/if}
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
							src={currentUser.avatar}
							alt={currentUser.name}
						/>
						<AvatarFallback>
							{currentUser.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel class="font-normal">
					<div class="flex flex-col space-y-1">
						<p class="text-sm font-medium leading-none">
							{currentUser.name}
						</p>
						<p class="text-xs leading-none text-muted-foreground">
							{currentUser.email}
						</p>
						<p
							class="text-xs leading-none text-muted-foreground capitalize"
						>
							{getRoleDisplayName(currentUser.role)}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onclick={() => goto("/dashboard/profile")}>
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
				<DropdownMenuItem onclick={() => goto("/dashboard/settings")}>
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
					Settings
				</DropdownMenuItem>
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
