<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "@/components/ui/button";
    import { cn } from "@/utils";
    import Logo from "@lucide/svelte/icons/aperture";
    import UserIcon from "@lucide/svelte/icons/user";
    import Menu from "@lucide/svelte/icons/menu";
    import LogOut from "@lucide/svelte/icons/log-out";
    import {
        Sheet,
        SheetContent,
        SheetTrigger,
        SheetClose,
    } from "$lib/components/ui/sheet";
    import ModeToggle from "./ModeToggle.svelte";
    import UserDropdown from "./UserDropdown.svelte";
    import AuthButtons from "./AuthButtons.svelte";

    interface User {
        id: string;
        name: string;
        email: string;
        image?: string;
        role?: string;
    }

    let { user, isLoggedIn } = $props<{
        user: User | null;
        isLoggedIn: boolean;
    }>();

    // App name - modify this to match your application name
    const appName = $state("StartupConnect");

    // Responsive state
    let menuOpen = $state(false);

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
                {#if isLoggedIn && user}
                    <UserDropdown {user} />
                {:else}
                    <AuthButtons />
                {/if}
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
                    <nav class="flex flex-col gap-4 m-8">
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

                    <!-- Mobile Authentication Section -->
                    <div class="mt-auto pt-4 border-y space-y-2">
                        {#if isLoggedIn && user}
                            <div class="flex items-center gap-2 px-4 py-2">
                                <div
                                    class="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium"
                                >
                                    {#if user.image}
                                        <img
                                            src={user.image}
                                            alt=""
                                            class="h-10 w-10 rounded-full"
                                        />
                                    {:else}
                                        {user.name
                                            .split(" ")
                                            .map((word: string) =>
                                                word.charAt(0),
                                            )
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    {/if}
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium">
                                        {user.name || "User"}
                                    </span>
                                    <span class="text-xs text-muted-foreground">
                                        {user.email || ""}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                class="w-full justify-start text-destructive"
                                onclick={() => {
                                    // Handle logout
                                    window.location.href = "/logout";
                                }}
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
                                <Button class="w-full justify-start"
                                    >Sign Up</Button
                                >
                            </a>
                        {/if}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </div>
</header>
