<script lang="ts">
	import { page } from "$app/stores";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
	import CalendarEventIcon from "@tabler/icons-svelte/icons/calendar-event";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
	import HeartIcon from "@tabler/icons-svelte/icons/heart";
	import LayoutDashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
	import MessageSquareIcon from "@tabler/icons-svelte/icons/message-circle";
	import NetworkIcon from "@tabler/icons-svelte/icons/network";
	import NotesIcon from "@tabler/icons-svelte/icons/notes";
	import RocketIcon from "@tabler/icons-svelte/icons/rocket";
	import SchoolIcon from "@tabler/icons-svelte/icons/school";
	import UsersIcon from "@tabler/icons-svelte/icons/users";

	// Define navigation items with Tabler icons for supporters
	const navItems = [
		{
			title: "Dashboard",
			href: "/dashboard/supporter",
			icon: LayoutDashboardIcon,
		},
		{
			title: "Startups",
			href: "/dashboard/supporter/startups",
			icon: RocketIcon,
		},
		{
			title: "Mentorship",
			href: "/dashboard/supporter/mentorship",
			icon: SchoolIcon,
		},
		{
			title: "Community",
			href: "/dashboard/supporter/community",
			icon: UsersIcon,
		},
		{
			title: "Networking",
			href: "/dashboard/supporter/networking",
			icon: NetworkIcon,
		},
		{
			title: "Favorites",
			href: "/dashboard/supporter/favorites",
			icon: HeartIcon,
		},
		{
			title: "Messages",
			href: "/dashboard/supporter/messages",
			icon: MessageSquareIcon,
		},
		{
			title: "Events",
			href: "/dashboard/supporter/events",
			icon: CalendarEventIcon,
		},
		{
			title: "Resources",
			href: "/dashboard/supporter/resources",
			icon: FileTextIcon,
		},
		{
			title: "Notes",
			href: "/dashboard/supporter/notes",
			icon: NotesIcon,
		},
		{
			title: "Calendar",
			href: "/dashboard/supporter/calendar",
			icon: CalendarIcon,
		},
	];

	// Check if the current path matches a nav item
	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === "/dashboard/supporter") {
			return currentPath === href;
		}
		return currentPath.startsWith(href);
	}
</script>

<Sidebar.Menu>
	{#each navItems as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				tooltipContent={item.title}
				class={isActive(item.href) ? "bg-secondary font-medium" : ""}
			>
				{#snippet child({ props })}
					<a href={item.href} {...props}>
						{#if item.icon}
							<svelte:component this={item.icon} />
						{/if}
						<span>{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
</Sidebar.Menu>
