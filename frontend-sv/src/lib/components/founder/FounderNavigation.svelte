<script lang="ts">
    import { page } from "$app/stores";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
    import CalendarEventIcon from "@tabler/icons-svelte/icons/calendar-event";
    import PieChartIcon from "@tabler/icons-svelte/icons/chart-pie";
    import CurrencyDollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
    import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
    import LayoutDashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
    import MessageSquareIcon from "@tabler/icons-svelte/icons/message-circle";
    import NotesIcon from "@tabler/icons-svelte/icons/notes";
    import PresentationIcon from "@tabler/icons-svelte/icons/presentation";
    import RocketIcon from "@tabler/icons-svelte/icons/rocket";
    import UsersIcon from "@tabler/icons-svelte/icons/users";

    // Define navigation items with Tabler icons for founders
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard/founder",
            icon: LayoutDashboardIcon,
        },
        {
            title: "My Startup",
            href: "/dashboard/founder/startup",
            icon: RocketIcon,
        },
        {
            title: "Pitch Deck",
            href: "/dashboard/founder/pitch-deck",
            icon: PresentationIcon,
        },
        {
            title: "Fundraising",
            href: "/dashboard/founder/fundraising",
            icon: CurrencyDollarIcon,
        },
        {
            title: "Investors",
            href: "/dashboard/founder/investors",
            icon: UsersIcon,
        },
        {
            title: "Analytics",
            href: "/dashboard/founder/analytics",
            icon: PieChartIcon,
        },
        {
            title: "Messages",
            href: "/dashboard/founder/messages",
            icon: MessageSquareIcon,
        },
        {
            title: "Meetings",
            href: "/dashboard/founder/meetings",
            icon: CalendarEventIcon,
        },
        {
            title: "Updates",
            href: "/dashboard/founder/updates",
            icon: FileTextIcon,
        },
        {
            title: "Notes",
            href: "/dashboard/founder/notes",
            icon: NotesIcon,
        },
        {
            title: "Calendar",
            href: "/dashboard/founder/calendar",
            icon: CalendarIcon,
        },
    ];

    // Check if the current path matches a nav item
    function isActive(href: string): boolean {
        const currentPath = $page.url.pathname;
        if (href === "/dashboard/founder") {
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
