<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import OrganizationNav from "$lib/components/investor/OrganizationNav.svelte";
	import OrganizationHeader from "$lib/components/investor/OrganizationHeader.svelte";

	let organization = $state(null);
	let currentUserRole = $state(null);
	let isLoading = $state(true);

	// Mock organization data - replace with real data fetching
	onMount(async () => {
		try {
			// This would be replaced with actual API call
			organization = {
				id: "org-123",
				name: "TechVenture Capital",
				type: "vc_fund",
				logo: null,
				description: "Leading early-stage venture capital firm",
				verified: false,
				memberCount: 8,
				portfolioCount: 12,
				activeDeals: 3,
			};

			currentUserRole = "owner"; // This would come from user session/context
		} catch (error) {
			console.error("Error loading organization:", error);
			goto("/dashboard/investor");
		} finally {
			isLoading = false;
		}
	});

	// Navigation items based on user role
	const getNavigationItems = (role: string) => {
		const baseItems = [
			{
				href: "/dashboard/investor/organization/overview",
				label: "Overview",
				icon: "LayoutDashboard",
			},
			{
				href: "/dashboard/investor/organization/portfolio",
				label: "Portfolio",
				icon: "Briefcase",
			},
			{
				href: "/dashboard/investor/organization/pipeline",
				label: "Pipeline",
				icon: "TrendingUp",
			},
			{
				href: "/dashboard/investor/organization/members",
				label: "Members",
				icon: "Users",
			},
		];

		// Add admin-only items
		if (["owner", "admin"].includes(role)) {
			baseItems.push(
				{
					href: "/dashboard/investor/organization/due-diligence",
					label: "Due Diligence",
					icon: "FileCheck",
				},
				{
					href: "/dashboard/investor/organization/settings",
					label: "Settings",
					icon: "Settings",
				},
			);
		}

		return baseItems;
	};

	$: navigationItems = currentUserRole
		? getNavigationItems(currentUserRole)
		: [];
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar Navigation -->
	<div class="w-64 border-r bg-card">
		<OrganizationNav
			{organization}
			{navigationItems}
			currentPath={$page.url.pathname}
			{isLoading}
		/>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Header -->
		<OrganizationHeader
			{organization}
			userRole={currentUserRole}
			{isLoading}
		/>

		<!-- Page Content -->
		<main class="flex-1 overflow-auto">
			{#if isLoading}
				<div class="flex items-center justify-center h-64">
					<div
						class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
					></div>
				</div>
			{:else if organization}
				<slot />
			{:else}
				<div class="flex items-center justify-center h-64">
					<p class="text-muted-foreground">Organization not found</p>
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
