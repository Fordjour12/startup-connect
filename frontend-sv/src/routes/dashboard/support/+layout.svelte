<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import SupportNav from "$lib/components/support/SupportNav.svelte";
	import SupportHeader from "$lib/components/support/SupportHeader.svelte";
	import { createSupportPermissionManager } from "$lib/utils/support-permissions";
	import { SUPPORT_ROLES } from "$lib/db/schema";

	let currentUser = $state({
		id: "user-1",
		name: "John Smith",
		email: "john@support.com",
		role: SUPPORT_ROLES.MANAGER,
		avatar: null,
		isOnline: true,
	});

	let userRole = $state(SUPPORT_ROLES.MANAGER);
	let isLoading = $state(true);
	let permissionManager = $state(null);

	// Initialize permissions
	onMount(() => {
		permissionManager = createSupportPermissionManager(
			userRole,
			currentUser.id,
		);
		isLoading = false;
	});

	// Navigation items based on user role
	$: navigationItems = permissionManager
		? [
				{
					href: "/dashboard/support",
					label: "Dashboard",
					icon: "LayoutDashboard",
					requiredPermission: "tickets:read",
				},
				{
					href: "/dashboard/support/tickets",
					label: "Tickets",
					icon: "MessageSquare",
					requiredPermission: "tickets:read",
				},
				{
					href: "/dashboard/support/customers",
					label: "Customers",
					icon: "Users",
					requiredPermission: "customers:read",
				},
				{
					href: "/dashboard/support/knowledge",
					label: "Knowledge Base",
					icon: "BookOpen",
					requiredPermission: "knowledge:read",
				},
				{
					href: "/dashboard/support/analytics",
					label: "Analytics",
					icon: "BarChart3",
					requiredPermission: "analytics:read",
				},
				{
					href: "/dashboard/support/reports",
					label: "Reports",
					icon: "FileText",
					requiredPermission: "reports:read",
				},
				{
					href: "/dashboard/support/settings",
					label: "Settings",
					icon: "Settings",
					requiredPermission: "settings:read",
				},
			].filter((item) =>
				permissionManager?.hasPermission(item.requiredPermission),
			)
		: [];

	// Check if user can access this route
	$: canAccess = permissionManager?.hasPermission("tickets:read") || false;
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar Navigation -->
	<div class="w-64 border-r bg-card">
		<SupportNav
			{currentUser}
			{navigationItems}
			currentPath={$page.url.pathname}
			{isLoading}
			{permissionManager}
		/>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Header -->
		<SupportHeader {currentUser} {permissionManager} {isLoading} />

		<!-- Page Content -->
		<main class="flex-1 overflow-auto">
			{#if isLoading}
				<div class="flex items-center justify-center h-64">
					<div
						class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
					></div>
				</div>
			{:else if canAccess}
				<slot />
			{:else}
				<div class="flex items-center justify-center h-64">
					<div class="text-center">
						<h2
							class="text-xl font-semibold text-muted-foreground mb-2"
						>
							Access Denied
						</h2>
						<p class="text-sm text-muted-foreground">
							You don't have permission to access the support
							dashboard.
						</p>
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	/* Custom scrollbar for the main content area */
	main::-webkit-scrollbar {
		width: 6px;
	}

	main::-webkit-scrollbar-track {
		background: transparent;
	}

	main::-webkit-scrollbar-thumb {
		background: hsl(var(--border));
		border-radius: 3px;
	}

	main::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--muted-foreground));
	}
</style>
