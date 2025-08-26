<script lang="ts">
	import { goto } from "$app/navigation";
	import { cn } from "$lib/utils";
	import { SUPPORT_ROLES } from "$lib/db/schema";

	interface NavItem {
		href: string;
		label: string;
		icon: string;
		requiredPermission: string;
	}

	interface Props {
		currentUser: any;
		navigationItems: NavItem[];
		currentPath: string;
		isLoading: boolean;
		permissionManager: any;
	}

	let {
		currentUser,
		navigationItems,
		currentPath,
		isLoading,
		permissionManager,
	}: Props = $props();

	function getIconComponent(iconName: string) {
		const iconMap: Record<string, string> = {
			LayoutDashboard:
				"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
			MessageSquare:
				"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
			Users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
			BookOpen:
				"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
			BarChart3:
				"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
			FileText:
				"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
			Settings:
				"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
		};

		return iconMap[iconName] || iconMap.LayoutDashboard;
	}

	function isActive(href: string): boolean {
		if (href === "/dashboard/support") {
			return (
				currentPath === "/dashboard/support" ||
				currentPath === "/dashboard/support/" ||
				currentPath === "/dashboard/support/dashboard"
			);
		}
		return currentPath.startsWith(href);
	}

	function getRoleDisplayName(role: string): string {
		const roleMap: Record<string, string> = {
			[SUPPORT_ROLES.SUPER_ADMIN]: "Super Admin",
			[SUPPORT_ROLES.MANAGER]: "Manager",
			[SUPPORT_ROLES.SENIOR_AGENT]: "Senior Agent",
			[SUPPORT_ROLES.AGENT]: "Agent",
			[SUPPORT_ROLES.VIEWER]: "Viewer",
		};
		return roleMap[role] || role;
	}
</script>

<div class="flex flex-col h-full">
	<!-- Support Team Info -->
	<div class="p-6 border-b">
		{#if isLoading}
			<div class="animate-pulse">
				<div class="h-8 bg-muted rounded mb-2"></div>
				<div class="h-4 bg-muted rounded w-3/4"></div>
			</div>
		{:else if currentUser}
			<div class="flex items-center space-x-3">
				<div class="relative">
					{#if currentUser.avatar}
						<img
							src={currentUser.avatar}
							alt={currentUser.name}
							class="w-10 h-10 rounded-full object-cover"
						/>
					{:else}
						<div
							class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
						>
							<span class="text-primary font-semibold text-sm">
								{currentUser.name
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toUpperCase()}
							</span>
						</div>
					{/if}
					<!-- Online status indicator -->
					<div
						class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
					></div>
				</div>
				<div class="flex-1 min-w-0">
					<h2
						class="font-semibold text-sm truncate"
						title={currentUser.name}
					>
						{currentUser.name}
					</h2>
					<p class="text-xs text-muted-foreground capitalize">
						{getRoleDisplayName(currentUser.role)}
					</p>
					<p class="text-xs text-muted-foreground">
						{currentUser.isOnline ? "Online" : "Offline"}
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Navigation Menu -->
	<nav class="flex-1 p-4">
		<ul class="space-y-2">
			{#each navigationItems as item}
				<li>
					<a
						href={item.href}
						class={cn(
							"flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
							isActive(item.href)
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<svg
							class="w-5 h-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={getIconComponent(item.icon)}
							/>
						</svg>
						<span class="truncate">{item.label}</span>
						{#if isActive(item.href)}
							<div
								class="ml-auto w-1.5 h-1.5 bg-current rounded-full"
							></div>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Footer Actions -->
	<div class="p-4 border-t">
		{#if permissionManager?.hasPermission("tickets:create")}
			<button
				onclick={() => goto("/dashboard/support/tickets/new")}
				class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
			>
				<svg
					class="w-4 h-4"
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
				<span>New Ticket</span>
			</button>
		{/if}

		<button
			onclick={() => goto("/dashboard")}
			class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors mt-2"
		>
			<svg
				class="w-4 h-4"
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
			<span>Back to Dashboard</span>
		</button>
	</div>
</div>
