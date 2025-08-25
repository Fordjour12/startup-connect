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
   import NotificationIcon from "@tabler/icons-svelte/icons/notification";

   import type { ComponentProps } from "svelte";
   // import FounderNavigation from "./founder/FounderNavigation.svelte";
   import InvestorNavigation from "./investor/InvestorNavigation.svelte";
   import NavDocuments from "./nav-documents.svelte";
   import NavMain from "./nav-main.svelte";
   import NavSecondary from "./nav-secondary.svelte";
   import NavUser from "./nav-user.svelte";
   // import SupporterNavigation from "./supporter/SupporterNavigation.svelte";
   let {
      data,
      ...restProps
   }: { data: any } & ComponentProps<typeof Sidebar.Root> = $props();

   const sidebarData = {
      user: data.user,
      navSecondary: [
         {
            title: "Settings",
            url: "/dashboard/investor/settings",
            icon: SettingsIcon,
         },
         {
            title: "Notifications",
            url: "/dashboard/investor/notifications",
            icon: NotificationIcon,
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
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
   <Sidebar.Header>
      <Sidebar.Menu>
         <Sidebar.MenuItem>
            <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
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
               <InvestorNavigation />
            </Sidebar.GroupContent>
         </Sidebar.Group>
      {:else if page.url.pathname.includes("/dashboard/founder")}
         <Sidebar.Group>
            <Sidebar.GroupContent class="flex flex-col gap-2">
               <!-- <FounderNavigation /> -->
               <p>Founder Dashboard</p>
            </Sidebar.GroupContent>
         </Sidebar.Group>
      {:else if page.url.pathname.includes("/dashboard/supporter")}
         <Sidebar.Group>
            <Sidebar.GroupContent class="flex flex-col gap-2">
               <!-- <SupporterNavigation /> -->
               <p>Supporter Dashboard</p>
            </Sidebar.GroupContent>
         </Sidebar.Group>
      {/if}
      <NavDocuments items={sidebarData.documents} />
      <NavSecondary items={sidebarData.navSecondary} class={cn("mt-auto")} />
   </Sidebar.Content>
   <Sidebar.Footer>
      <NavUser user={sidebarData.user} />
   </Sidebar.Footer>
</Sidebar.Root>
