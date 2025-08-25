<script lang="ts">
    import { page } from "$app/state";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
    import CalendarEventIcon from "@tabler/icons-svelte/icons/calendar-event";
    import PieChartIcon from "@tabler/icons-svelte/icons/chart-pie";
    import GitBranchIcon from "@tabler/icons-svelte/icons/git-branch";
    import LayoutDashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
    import MessageSquareIcon from "@tabler/icons-svelte/icons/message-circle";
    import NotesIcon from "@tabler/icons-svelte/icons/notes";
    import RocketIcon from "@tabler/icons-svelte/icons/rocket";

    // Define navigation items with Tabler icons
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard/investor",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Portfolio",
            href: "/dashboard/investor/portfolio",
            icon: PieChartIcon,
        },
        {
            title: "Startups",
            href: "/dashboard/investor/startups",
            icon: RocketIcon,
        },
        {
            title: "Pipeline",
            href: "/dashboard/investor/pipeline",
            icon: GitBranchIcon,
        },
        {
            title: "Messages",
            href: "/dashboard/investor/messages",
            icon: MessageSquareIcon,
        },
        {
            title: "Meetings",
            href: "/dashboard/investor/meetings",
            icon: CalendarEventIcon,
        },
        {
            title: "Notes",
            href: "/dashboard/investor/notes",
            icon: NotesIcon,
        },
        {
            title: "Calendar",
            href: "/dashboard/investor/calendar",
            icon: CalendarIcon,
        },
    ];
</script>

<Sidebar.Menu>
    {#each navItems as item (item.title)}
        <Sidebar.MenuItem>
            <Sidebar.MenuButton
                tooltipContent={item.title}
                class={page.url.pathname === item.href ||
                (page.url.pathname.startsWith(item.href) &&
                    item.href !== "/dashboard/investor")
                    ? "bg-secondary font-medium"
                    : ""}
            >
                {#snippet child({ props })}
                    <a href={item.href} {...props}>
                        {#if item.icon}
                            <item.icon />
                        {/if}
                        <span>{item.title}</span>
                    </a>
                {/snippet}
            </Sidebar.MenuButton>
        </Sidebar.MenuItem>
    {/each}
</Sidebar.Menu>
