<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "@/components/ui/button";
    import { cn } from "@/utils";
    import Logo from "@lucide/svelte/icons/aperture";
    import UserIcon from "@lucide/svelte/icons/user";
    import Menu from "@lucide/svelte/icons/menu";
    import X from "@lucide/svelte/icons/x";
    import LogOut from "@lucide/svelte/icons/log-out";
    import {
        Sheet,
        SheetContent,
        SheetTrigger,
        SheetClose,
    } from "$lib/components/ui/sheet";
    import ModeToggle from "./ModeToggle.svelte";
    import UserDropdown from "./UserDropdown.svelte";

    type UserData = {
        user: {
            id: string;
            email: string;
            full_name: string;
        };
    };

    let { data }: { data: UserData } = $props();

    // App name - modify this to match your application name
    const appName = $state("StartupConnect");

    // Derive login state from user data
    let isLoggedIn = $derived(!!data.user);

    // Responsive state
    let menuOpen = $state(false);

    // Handle logout
    function handleLogout() {
        // In a real app, implement your logout logic here
        console.log("Logging out");
        // Clear the access token and redirect to login
        document.cookie =
            "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    }

    // Navigation items - customize these based on your app routes
    const navItems = [
        { href: "/", label: "Home" },
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about", label: "About" },
        { href: "/startups", label: "Startup" },
    ];

    // Close mobile menu when page changes
    $effect(() => {
        if (menuOpen && page) {
            menuOpen = false;
        }
    });

    // Determine if a nav item is active
    function isActive(href: string): boolean {
        return (
            page.url.pathname === href ||
            (page.url.pathname !== "/" &&
                href !== "/" &&
                page.url.pathname.startsWith(href))
        );
    }
</script>

<header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div class="container flex h-16 items-center mx-auto">
        <div class="mr-4 flex items-center">
            <a href="/" class="flex items-center space-x-2">
                <!-- <img src="/logo-black.svg" alt="Logo" class="h-6 w-6" /> -->
                <img src="/logo.svg" alt="Logo" class="h-6 w-6" />
                <span class="font-bold">{appName}</span>
            </a>
        </div>

        <!-- Desktop Navigation -->
        <nav
            class="hidden md:flex md:flex-1 md:items-center md:justify-between"
        >
            <ul class="flex items-center gap-6 text-sm">
                {#each navItems as item}
                    <li>
                        <a
                            href={item.href}
                            class={cn(
                                "transition-colors hover:text-foreground/80",
                                isActive(item.href)
                                    ? "font-medium text-foreground"
                                    : "text-foreground/60",
                            )}
                        >
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>

            <div class="flex items-center gap-4">
                <ModeToggle />
                <UserDropdown {isLoggedIn} user={data.user} />
            </div>
        </nav>

        <!-- Mobile Menu and Right Side Items -->
        <div class="flex flex-1 items-center justify-end md:hidden">
            <ModeToggle />

            <Sheet>
                <SheetTrigger>
                    <Button variant="ghost" size="icon" class="ml-2">
                        <Menu class="h-5 w-5" />
                        <span class="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" class="flex flex-col">
                    <div
                        class="flex justify-between items-center border-b pb-4"
                    >
                        <a href="/" class="flex items-center gap-2">
                            <Logo class="h-5 w-5" />
                            <span class="font-bold">{appName}</span>
                        </a>
                        <SheetClose>
                            <Button variant="ghost" size="icon">
                                <X class="h-5 w-5" />
                                <span class="sr-only">Close menu</span>
                            </Button>
                        </SheetClose>
                    </div>
                    <nav class="flex flex-col gap-4 mt-8">
                        {#each navItems as item}
                            <a
                                href={item.href}
                                class={cn(
                                    "text-foreground/60 hover:text-foreground transition-colors",
                                    isActive(item.href) &&
                                        "font-medium text-foreground",
                                )}
                            >
                                {item.label}
                            </a>
                        {/each}
                    </nav>
                    <div class="mt-auto pt-4 border-t space-y-2">
                        {#if isLoggedIn && data.user}
                            <div class="flex items-center gap-2 px-4 py-2">
                                <!-- <img
                                    src={data.user.avatarUrl || ""}
                                    alt=""
                                    class="h-10 w-10 rounded-full bg-muted"
                                />
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium"
                                        >{data.user.name || "User"}</span
                                    >
                                    <span class="text-xs text-muted-foreground"
                                        >{data.user.email || ""}</span
                                    >
                                </div> -->
                            </div>
                            <Button
                                variant="ghost"
                                class="w-full justify-start text-destructive"
                                onclick={handleLogout}
                            >
                                <LogOut class="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        {:else}
                            <a href="/login" class="w-full">
                                <Button
                                    variant="outline"
                                    class="w-full justify-start"
                                >
                                    <UserIcon class="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                            </a>
                            <a href="/register" class="w-full">
                                <Button class="w-full justify-start">
                                    Sign Up
                                </Button>
                            </a>
                        {/if}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </div>
</header>
