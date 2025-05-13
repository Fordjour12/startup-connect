<script lang="ts">
    import {
        Avatar,
        AvatarImage,
        AvatarFallback,
    } from "@/components/ui/avatar";
    import {
        DropdownMenu,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuContent,
        DropdownMenuTrigger,
        DropdownMenuGroup,
    } from "@/components/ui/dropdown-menu";
    import { Button } from "@/components/ui/button";
    import Settings from "@lucide/svelte/icons/settings";
    import LogOut from "@lucide/svelte/icons/log-out";
    import User from "@lucide/svelte/icons/user-circle-2";

    // User state - in a real app, this would come from your auth store
    let { user = {}, isLoggedIn = false } = $props();

    // Default user data if not provided
    const defaultUser = {
        name: "User",
        email: "user@example.com",
        avatarUrl: "",
        initials: "U",
    };

    // Merge with defaults
    let userData = $state({ ...defaultUser, ...user });

    // Extract initials from name if not provided
    let initials = $derived(
        userData.initials || userData.name.substring(0, 2).toUpperCase(),
    );

    // Handle logout
    function handleLogout() {
        // Implement your logout logic here
        console.log("User logged out");
        // In a real app, you would dispatch to your auth store or call an API
    }
</script>

{#if isLoggedIn}
    <div class="relative">
        <Button
            variant="ghost"
            size="icon"
            class="relative h-8 w-8 rounded-full"
        >
            <Avatar class="h-8 w-8">
                {#if userData.avatarUrl}
                    <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                {/if}
                <AvatarFallback class="text-xs font-medium">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </Button>
        <div class="absolute inset-0">
            <DropdownMenu>
                <DropdownMenuTrigger class="cursor-pointer absolute inset-0"
                ></DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                    <div class="flex flex-col space-y-1 px-2 py-1.5">
                        <p class="text-sm font-medium leading-none">
                            {userData.name}
                        </p>
                        <p class="text-xs leading-none text-muted-foreground">
                            {userData.email}
                        </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <a href="/profile" class="flex items-center w-full">
                                <User class="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <a
                                href="/settings"
                                class="flex items-center w-full"
                            >
                                <Settings class="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <button
                            onclick={handleLogout}
                            class="flex items-center w-full"
                        >
                            <LogOut class="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
{:else}
    <div class="flex items-center gap-2">
        <a href="/login">
            <Button variant="outline" size="sm">Login</Button>
        </a>
        <a href="/register">
            <Button size="sm">Sign Up</Button>
        </a>
    </div>
{/if}
