<script lang="ts">
    import { page } from "$app/state";
    import AppSidebar from "@/components/app-sidebar.svelte";
    import * as Breadcrumb from "@/components/ui/breadcrumb";
    import * as Sidebar from "@/components/ui/sidebar";
    import { Separator } from "@/components/ui/sidebar";

    let { children } = $props();

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
</script>

<Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
        <header class="flex h-16 shrink-0 items-center gap-2">
            <div class="flex items-center gap-2 px-4">
                <Sidebar.Trigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />

                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        {#each pathSegments() as segment, i (segment.href)}
                            {#if i > 0}
                                <Breadcrumb.Separator />
                            {/if}

                            <Breadcrumb.Item>
                                {#if segment.isLast}
                                    <Breadcrumb.Page
                                        >{segment.name}</Breadcrumb.Page
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
        </header>
        <main>
            {@render children?.()}
        </main>
    </Sidebar.Inset>
</Sidebar.Provider>
