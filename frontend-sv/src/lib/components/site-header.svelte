<script lang="ts">
    import { page } from "$app/state";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    // Helper to capitalize string
    function capitalize(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Derive breadcrumb segments from the pathname
    let pathSegments = $derived(() => {
        const currentUrl = page.url;
        const path = currentUrl.pathname;
        // Expecting paths like /dashboard, /dashboard/users, /dashboard/settings/profile
        if (!path.startsWith("/dashboard")) {
            return []; // Return empty array for non-dashboard routes
        }
        const segments = path.split("/").filter(Boolean); // e.g., ['', 'dashboard', 'settings'] -> ['dashboard', 'settings']
        if (segments.length === 0) return []; // Handle root '/' case if needed, though filter(Boolean) should prevent this

        // Map segments to breadcrumb item data including href and isLast flag
        let currentPath = "";
        return segments.map((segment: string, index: number) => {
            currentPath += `/${segment}`;
            return {
                name: capitalize(segment),
                href: currentPath,
                isLast: index === segments.length - 1,
            };
        });
    });

    // Check if the current user is a founder to display founder-specific UI
    let isFounder = $derived(() => {
        const currentUrl = page.url;
        return currentUrl.pathname.includes("/dashboard/founder");
    });

    $effect(() => {
        console.log(page.url);
    });
</script>

<header
    class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
    <div class="flex w-full items-center justify-between px-4 lg:px-6">
        <div class="flex items-center gap-1 lg:gap-2">
            <Sidebar.Trigger class="-ml-1" />
            <Separator
                orientation="vertical"
                class="mx-2 data-[orientation=vertical]:h-4"
            />
            <!-- <h1 class="text-base font-medium">Documents</h1> -->
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    {#each pathSegments() as segment, i (segment.href)}
                        {#if i > 0}
                            <Breadcrumb.Separator />
                        {/if}

                        <Breadcrumb.Item>
                            {#if segment.isLast}
                                <Breadcrumb.Page>{segment.name}</Breadcrumb.Page
                                >
                            {:else}
                                <Breadcrumb.Link href={segment.href}
                                    >{segment.name}</Breadcrumb.Link
                                >
                            {/if}
                        </Breadcrumb.Item>
                    {/each}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>

        <!-- Right-side header actions -->
        <!-- <div class="flex items-center gap-2">
            {#if isFounder}
                <NotificationDropdown />
            {/if}

            <Button variant="ghost" size="sm">Help</Button>
        </div> -->
    </div>
</header>
