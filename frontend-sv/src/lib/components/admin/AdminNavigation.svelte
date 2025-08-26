<script lang="ts">
    import { page } from "$app/state";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    import AlertTriangleIcon from "@tabler/icons-svelte/icons/alert-triangle";
    import ArchiveIcon from "@tabler/icons-svelte/icons/archive";
    import BarChartIcon from "@tabler/icons-svelte/icons/chart-bar";
    import DatabaseIcon from "@tabler/icons-svelte/icons/database";
    import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
    import FileReportIcon from "@tabler/icons-svelte/icons/file-report";
    import LayoutDashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
    import SettingsIcon from "@tabler/icons-svelte/icons/settings";
    import ShieldIcon from "@tabler/icons-svelte/icons/shield";
    import UsersIcon from "@tabler/icons-svelte/icons/users";
    import CheckboxIcon from "@tabler/icons-svelte/icons/checkbox";
    import ServerIcon from "@tabler/icons-svelte/icons/server";
    import ServerSparkIcon from "@tabler/icons-svelte/icons/server-spark";
    import ActivityIcon from "@tabler/icons-svelte/icons/activity";

    // Define navigation items for admin dashboard
    const navItems = [
        {
            title: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Users",
            href: "/dashboard/admin/users",
            icon: UsersIcon,
        },
        {
            title: "Content",
            href: "/dashboard/admin/content",
            icon: FileTextIcon,
        },
        {
            title: "Analytics",
            href: "/dashboard/admin/analytics",
            icon: BarChartIcon,
        },
        {
            title: "Reports",
            href: "/dashboard/admin/analytics/reports",
            icon: FileReportIcon,
        },
        {
            title: "Data Export",
            href: "/dashboard/admin/data-export",
            icon: ServerSparkIcon,
        },
        {
            title: "Bulk Operations",
            href: "/dashboard/admin/bulk-operations",
            icon: CheckboxIcon,
        },
        {
            title: "API Management",
            href: "/dashboard/admin/settings/api-management",
            icon: ServerIcon,
        },
        {
            title: "API Monitoring",
            href: "/dashboard/admin/settings/api-monitoring",
            icon: ActivityIcon,
        },
        {
            title: "Settings",
            href: "/dashboard/admin/settings",
            icon: SettingsIcon,
        },
        {
            title: "Security",
            href: "/dashboard/admin/security",
            icon: ShieldIcon,
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
                    item.href !== "/dashboard/admin")
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
