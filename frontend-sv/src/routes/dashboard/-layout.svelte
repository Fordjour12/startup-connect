<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "@/components/ui/button";
    import * as DropdownMenu from "@/components/ui/dropdown-menu";
    import { Input } from "@/components/ui/input";
    import { Separator } from "@/components/ui/separator";
    import { cn } from "@/utils";

    // Import Lucide icons
    import Home from "@lucide/svelte/icons/home";
    import Search from "@lucide/svelte/icons/search";
    import Bell from "@lucide/svelte/icons/bell";
    import Users from "@lucide/svelte/icons/users";
    import DollarSign from "@lucide/svelte/icons/dollar-sign";
    import FileText from "@lucide/svelte/icons/file-text";
    import Settings from "@lucide/svelte/icons/settings";
    import MessageSquare from "@lucide/svelte/icons/message-square";
    import LogOut from "@lucide/svelte/icons/log-out";
    import Building from "@lucide/svelte/icons/building";
    import User from "@lucide/svelte/icons/user";
    import Moon from "@lucide/svelte/icons/moon";
    import Sun from "@lucide/svelte/icons/sun";
    import Menu from "@lucide/svelte/icons/menu";
    import PanelLeft from "@lucide/svelte/icons/panel-left";
    import type { Snippet } from "svelte";

    // State variables
    let { children }: { children: Snippet } = $props();
    let sidebarOpen = $state(true);
    let searchQuery = $state("");
    let mobileNavOpen = $state(false);
    let theme = $state("light");

    // Get the current route and user type
    let currentRoute = $derived(page.url.pathname);
    let userType = $derived(
        currentRoute.includes("/founder") ? "founder" : "investor",
    );

    // Navigation items
    const founderNavItems = [
        {
            label: "Dashboard",
            href: "/dashboard/founder",
            icon: Home,
            active: (path: string) => path === "/dashboard/founder",
        },
        {
            label: "Startups",
            href: "/dashboard/founder/startups",
            icon: Building,
            active: (path: string) =>
                path.includes("/dashboard/founder/startups"),
        },
        {
            label: "Messages",
            href: "/dashboard/founder/messages",
            icon: MessageSquare,
            active: (path: string) =>
                path.includes("/dashboard/founder/messages"),
        },
        {
            label: "Settings",
            href: "/dashboard/founder/settings",
            icon: Settings,
            active: (path: string) =>
                path.includes("/dashboard/founder/settings"),
        },
    ];

    const investorNavItems = [
        {
            label: "Dashboard",
            href: "/dashboard/investor",
            icon: Home,
            active: (path: string) => path === "/dashboard/investor",
        },
        {
            label: "Startups",
            href: "/dashboard/investor/startups",
            icon: Building,
            active: (path: string) =>
                path.includes("/dashboard/investor/startups"),
        },
        {
            label: "Messages",
            href: "/dashboard/investor/messages",
            icon: MessageSquare,
            active: (path: string) =>
                path.includes("/dashboard/investor/messages"),
        },
        {
            label: "Settings",
            href: "/dashboard/investor/settings",
            icon: Settings,
            active: (path: string) =>
                path.includes("/dashboard/investor/settings"),
        },
    ];

    // Toggle sidebar
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    // Toggle theme
    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark");
    }

    // Mock user data
    const user = {
        name: userType === "founder" ? "Jane Founder" : "John Investor",
        email:
            userType === "founder" ? "jane@startup.com" : "john@investor.com",
        avatar: `https://ui-avatars.com/api/?name=${userType === "founder" ? "Jane+Founder" : "John+Investor"}&background=random`,
    };

    // Get the appropriate navigation items
    let navItems = $derived(
        userType === "founder" ? founderNavItems : investorNavItems,
    );
</script>

<div class="flex min-h-screen bg-background">
    <!-- Sidebar -->
    <div
        class={cn(
            "fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r bg-card transition-all duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
    >
        <!-- Sidebar header -->
        <div class="flex h-16 items-center border-b px-4">
            <!-- <a href="/" class="flex items-center gap-2 font-semibold">
                <div
                    class="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold"
                >
                    <img
                        src="/logo.svg"
                        alt="Startup Connect Logo"
                        class="h-6 w-6"
                    />
                </div>
                <span> Startup Connect</span>
            </a> -->

            <div class="mr-4 flex items-center">
                <a href="/" class="flex items-center space-x-2">
                    <img src="/logo.svg" alt="Logo" class="h-6 w-6" />
                    <span class="font-bold">Startup Connect</span>
                </a>
            </div>
        </div>

        <!-- Sidebar navigation -->
        <nav class="flex-1 space-y-1 px-2 py-4">
            {#each navItems as item}
                <a
                    href={item.href}
                    class={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        item.active(currentRoute)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                >
                    <item.icon class="h-4 w-4" />
                    <span>{item.label}</span>
                </a>
            {/each}
        </nav>

        <!-- Sidebar footer -->
        <div class="mt-auto border-t p-4">
            <div class="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.name}
                    class="h-9 w-9 rounded-full object-cover"
                />
                <div class="flex-1 truncate">
                    <p class="text-sm font-medium">{user.name}</p>
                    <p class="truncate text-xs text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Main content -->
    <div
        class={cn(
            "flex flex-1 flex-col transition-all duration-300",
            sidebarOpen ? "pl-64" : "pl-0",
        )}
    >
        <!-- Header -->
        <header
            class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
        >
            <Button
                variant="ghost"
                size="icon"
                onclick={toggleSidebar}
                class="mr-2 h-9 w-9"
            >
                <!-- <Menu class="h-5 w-5" /> -->
                <PanelLeft class="h-5 w-5" />
                <span class="sr-only">Toggle sidebar</span>
            </Button>

            <!-- Search -->
            <div class="relative flex-1 max-w-md">
                <Search
                    class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                />
                <Input
                    type="search"
                    placeholder="Search..."
                    class="w-full pl-8 bg-background"
                    bind:value={searchQuery}
                />
            </div>

            <!-- Desktop navigation -->
            <nav class="hidden md:flex items-center gap-4 flex-1 justify-end">
                <Button variant="ghost" size="icon" class="relative">
                    <Bell class="h-5 w-5" />
                    <span
                        class="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"
                    ></span>
                    <span class="sr-only">Notifications</span>
                </Button>

                <Button variant="ghost" size="icon" onclick={toggleTheme}>
                    {#if theme === "light"}
                        <Moon class="h-5 w-5" />
                        <span class="sr-only">Dark mode</span>
                    {:else}
                        <Sun class="h-5 w-5" />
                        <span class="sr-only">Light mode</span>
                    {/if}
                </Button>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="rounded-full"
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                class="h-8 w-8 rounded-full object-cover"
                            />
                            <span class="sr-only">User menu</span>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-56" align="end">
                        <div class="flex items-center gap-3 p-3">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                class="h-9 w-9 rounded-full object-cover"
                            />
                            <div class="flex-1 truncate">
                                <p class="text-sm font-medium">{user.name}</p>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                >
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                            <User class="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <Settings class="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                            <LogOut class="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </nav>

            <!-- Mobile menu button (visible on smaller screens) -->
            <div class="flex items-center md:hidden gap-4">
                <Button variant="ghost" size="icon">
                    <Bell class="h-5 w-5" />
                </Button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="rounded-full"
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                class="h-8 w-8 rounded-full object-cover"
                            />
                            <span class="sr-only">User menu</span>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-56" align="end">
                        <div class="flex items-center gap-3 p-3">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                class="h-9 w-9 rounded-full object-cover"
                            />
                            <div class="flex-1 truncate">
                                <p class="text-sm font-medium">{user.name}</p>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                >
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                            <User class="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <Settings class="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                            <LogOut class="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 p-4 md:p-6 overflow-auto">
            {@render children()}
        </main>
    </div>
</div>
