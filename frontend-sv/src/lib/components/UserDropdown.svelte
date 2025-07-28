<!-- <script lang="ts">
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
    import { sessionStore, signOut } from "@/auth-client";

    // Get session from store
    let session = $state(null);
    let isLoggedIn = $derived(!!session);

    // Subscribe to session store
    $effect(() => {
        const unsubscribe = sessionStore.subscribe((value) => {
            session = value;
        });
        return unsubscribe;
    });

    // Extract user data from session
    let user = $derived(session?.user || null);

    // Extract initials from name if available
    let initials = $derived(() => {
        if (!user?.name) return "U";
        return user.name.substring(0, 2).toUpperCase();
    });

    // Handle logout
    async function handleLogout() {
        await signOut();
        window.location.href = "/login";
    }
</script>

{#if isLoggedIn && user}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full" use:builder>
                <Avatar.Root class="h-8 w-8">
                    <Avatar.Image src="" alt={user.name || 'User'} />
                    <Avatar.Fallback>{initials}</Avatar.Fallback>
                </Avatar.Root>
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56" align="end" forceMount>
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <User class="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings class="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onclick={handleLogout}>
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
{:else}
    <Button variant="ghost" onclick={() => window.location.href = '/login'}>
        <User class="mr-2 h-4 w-4" />
        Sign In
    </Button>
{/if} -->
