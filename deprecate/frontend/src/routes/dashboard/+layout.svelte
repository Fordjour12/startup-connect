<script lang="ts">
    // import data from "@/components/dashboard-01/data";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import SiteHeader from "$lib/components/site-header.svelte";
    // import SectionCards from "$lib/components/section-cards.svelte";
    // import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
    // import DataTable from "$lib/components/data-table.svelte";
    let { children } = $props();
</script>

<Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
    <AppSidebar variant="inset" />
    <Sidebar.Inset>
        <SiteHeader />
        <main>
            {@render children?.()}
        </main>
    </Sidebar.Inset>
</Sidebar.Provider>
