<script lang="ts">
    import { page } from "$app/state";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { cn } from "$lib/utils";
    import BellIcon from "@tabler/icons-svelte/icons/bell";
    import CameraIcon from "@tabler/icons-svelte/icons/camera";
    import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
    import DashboardIcon from "@tabler/icons-svelte/icons/dashboard";
    import DatabaseIcon from "@tabler/icons-svelte/icons/database";
    import FileAiIcon from "@tabler/icons-svelte/icons/file-ai";
    import FileDescriptionIcon from "@tabler/icons-svelte/icons/file-description";
    import FileWordIcon from "@tabler/icons-svelte/icons/file-word";
    import FolderIcon from "@tabler/icons-svelte/icons/folder";
    import HelpIcon from "@tabler/icons-svelte/icons/help";
    import InnerShadowTopIcon from "@tabler/icons-svelte/icons/inner-shadow-top";
    import ListDetailsIcon from "@tabler/icons-svelte/icons/list-details";
    import ReportIcon from "@tabler/icons-svelte/icons/report";
    import SearchIcon from "@tabler/icons-svelte/icons/search";
    import SettingsIcon from "@tabler/icons-svelte/icons/settings";
    import UsersIcon from "@tabler/icons-svelte/icons/users";
    import type { ComponentProps } from "svelte";
    import FounderNavigation from "./founder/FounderNavigation.svelte";
    import InvestorNavigation from "./investor/InvestorNavigation.svelte";
    import NavDocuments from "./nav-documents.svelte";
    import NavMain from "./nav-main.svelte";
    import NavSecondary from "./nav-secondary.svelte";
    import NavUser from "./nav-user.svelte";
    import SupporterNavigation from "./supporter/SupporterNavigation.svelte";

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        // navMain: [
        //     {
        //         title: "Dashboard",
        //         url: "#",
        //         icon: DashboardIcon,
        //     },
        //     {
        //         title: "Lifecycle",
        //         url: "#",
        //         icon: ListDetailsIcon,
        //     },
        //     {
        //         title: "Analytics",
        //         url: "#",
        //         icon: ChartBarIcon,
        //     },
        //     {
        //         title: "Projects",
        //         url: "#",
        //         icon: FolderIcon,
        //     },
        //     {
        //         title: "Team",
        //         url: "#",
        //         icon: UsersIcon,
        //     },
        // ],
        // navClouds: [
        //     {
        //         title: "Capture",
        //         icon: CameraIcon,
        //         isActive: true,
        //         url: "#",
        //         items: [
        //             {
        //                 title: "Active Proposals",
        //                 url: "#",
        //             },
        //             {
        //                 title: "Archived",
        //                 url: "#",
        //             },
        //         ],
        //     },
        //     {
        //         title: "Proposal",
        //         icon: FileDescriptionIcon,
        //         url: "#",
        //         items: [
        //             {
        //                 title: "Active Proposals",
        //                 url: "#",
        //             },
        //             {
        //                 title: "Archived",
        //                 url: "#",
        //             },
        //         ],
        //     },
        //     {
        //         title: "Prompts",
        //         icon: FileAiIcon,
        //         url: "#",
        //         items: [
        //             {
        //                 title: "Active Proposals",
        //                 url: "#",
        //             },
        //             {
        //                 title: "Archived",
        //                 url: "#",
        //             },
        //         ],
        //     },
        // ],
        navSecondary: [
            {
                title: "Settings",
                url: "/dashboard/investor/settings",
                icon: SettingsIcon,
            },
            {
                title: "Notifications",
                url: "/dashboard/investor/notifications",
                icon: BellIcon,
            },
            {
                title: "Get Help",
                url: "#",
                icon: HelpIcon,
            },
            {
                title: "Search",
                url: "#",
                icon: SearchIcon,
            },
        ],
        documents: [
            {
                name: "Data Library",
                url: "#",
                icon: DatabaseIcon,
            },
            {
                name: "Reports",
                url: "#",
                icon: ReportIcon,
            },
            {
                name: "Word Assistant",
                url: "#",
                icon: FileWordIcon,
            },
        ],
    };

    let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    class="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                    {#snippet child({ props })}
                        <a href="##" {...props}>
                            <img src="/logo.svg" alt="Logo" class="h-6 w-6" />
                            <span class="text-base font-semibold">
                                StartupConnect
                            </span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        {#if page.url.pathname.includes("/dashboard/investor")}
            <Sidebar.Group>
                <Sidebar.GroupContent class="flex flex-col gap-2">
                    <div class="px-2 py-1">
                        <h3
                            class="text-sm font-semibold text-sidebar-foreground"
                        >
                            Investor Dashboard
                        </h3>
                    </div>
                    <InvestorNavigation />
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} class={cn("mt-auto")} />
        {:else if page.url.pathname.includes("/dashboard/founder")}
            <Sidebar.Group>
                <Sidebar.GroupContent class="flex flex-col gap-2">
                    <div class="px-2 py-1">
                        <h3
                            class="text-sm font-semibold text-sidebar-foreground"
                        >
                            Founder Dashboard
                        </h3>
                    </div>
                    <FounderNavigation />
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} class={cn("mt-auto")} />
        {:else if page.url.pathname.includes("/dashboard/supporter")}
            <Sidebar.Group>
                <Sidebar.GroupContent class="flex flex-col gap-2">
                    <div class="px-2 py-1">
                        <h3
                            class="text-sm font-semibold text-sidebar-foreground"
                        >
                            Supporter Dashboard
                        </h3>
                    </div>
                    <SupporterNavigation />
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} class={cn("mt-auto")} />
            <!-- {:else}
            <NavMain items={data.navMain} />
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} class={cn("mt-auto")} /> -->
        {/if}
    </Sidebar.Content>
    <Sidebar.Footer>
        <NavUser user={data.user} />
    </Sidebar.Footer>
</Sidebar.Root>
