<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import {
		Calendar,
		MessageSquare,
		Settings,
		BarChart3,
		Plus,
		Users,
		Star,
		Bell,
		Home,
		FileText,
		CreditCard,
	} from "@lucide/svelte";

	const navigationItems = [
		{
			label: "Dashboard",
			href: "/supporter",
			icon: Home,
		},
		{
			label: "Services",
			href: "/supporter/services",
			icon: Users,
		},
		{
			label: "Bookings",
			href: "/supporter/bookings",
			icon: Calendar,
		},
		{
			label: "Messages",
			href: "/supporter/messages",
			icon: MessageSquare,
		},
		{
			label: "Analytics",
			href: "/supporter/analytics",
			icon: BarChart3,
		},
		{
			label: "Reviews",
			href: "/supporter/reviews",
			icon: Star,
		},
		{
			label: "Earnings",
			href: "/supporter/earnings",
			icon: CreditCard,
		},
		{
			label: "Profile",
			href: "/supporter/profile",
			icon: Settings,
		},
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}

	function navigateTo(href: string) {
		goto(href);
	}
</script>

<nav class="flex flex-col space-y-1">
	{#each navigationItems as item}
		<button
			class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors {isActive(
				item.href,
			)
				? 'bg-primary text-primary-foreground'
				: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
			onclick={() => navigateTo(item.href)}
		>
			<svelte:component this={item.icon} class="h-4 w-4" />
			{item.label}
		</button>
	{/each}

	<!-- Quick Action -->
	<div class="pt-4 mt-4 border-t">
		<button
			class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors w-full"
			onclick={() => goto("/supporter/services/new")}
		>
			<Plus class="h-4 w-4" />
			Create New Service
		</button>
	</div>
</nav>
