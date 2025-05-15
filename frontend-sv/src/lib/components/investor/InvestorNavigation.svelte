<script lang="ts">
    import { page } from "$app/state";

    // Define navigation items
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard/investor",
            icon: "layout-dashboard",
        },
        {
            title: "Portfolio",
            href: "/dashboard/investor/portfolio",
            icon: "pie-chart",
        },
        {
            title: "Startups",
            href: "/dashboard/investor/startups",
            icon: "rocket",
        },
        {
            title: "Pipeline",
            href: "/dashboard/investor/pipeline",
            icon: "git-branch",
        },
        {
            title: "Messages",
            href: "/dashboard/investor/messages",
            icon: "message-square",
        },
        {
            title: "Calendar",
            href: "/dashboard/investor/calendar",
            icon: "calendar",
        },
    ];

    // Check if the current path matches a nav item
    function isActive(href: string): boolean {
        const currentPath = page.url.pathname;
        if (href === "/dashboard/investor") {
            return currentPath === href;
        }
        return currentPath.startsWith(href);
    }
</script>

<nav class="flex flex-col space-y-1 w-full">
    {#each navItems as item}
        <a
            href={item.href}
            class="flex items-center px-3 py-2 text-sm rounded-md transition-colors
             hover:bg-secondary
             {isActive(item.href)
                ? 'bg-secondary font-medium'
                : 'text-muted-foreground'}"
        >
            <!-- Icon based on item.icon - we're using lucide icons via svg -->
            {#if item.icon === "layout-dashboard"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><rect width="7" height="9" x="3" y="3" rx="1" /><rect
                        width="7"
                        height="5"
                        x="14"
                        y="3"
                        rx="1"
                    /><rect width="7" height="9" x="14" y="12" rx="1" /><rect
                        width="7"
                        height="5"
                        x="3"
                        y="16"
                        rx="1"
                    /></svg
                >
            {:else if item.icon === "pie-chart"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path
                        d="M22 12A10 10 0 0 0 12 2v10z"
                    /></svg
                >
            {:else if item.icon === "rocket"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><path
                        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                    /><path
                        d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                    /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path
                        d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
                    /></svg
                >
            {:else if item.icon === "git-branch"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><line x1="6" x2="6" y1="3" y2="15" /><circle
                        cx="18"
                        cy="6"
                        r="3"
                    /><circle cx="6" cy="18" r="3" /><path
                        d="M18 9a9 9 0 0 1-9 9"
                    /></svg
                >
            {:else if item.icon === "calendar"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><rect
                        width="18"
                        height="18"
                        x="3"
                        y="4"
                        rx="2"
                        ry="2"
                    /><line x1="16" x2="16" y1="2" y2="6" /><line
                        x1="8"
                        x2="8"
                        y1="2"
                        y2="6"
                    /><line x1="3" x2="21" y1="10" y2="10" /></svg
                >
            {:else if item.icon === "message-square"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                    ><path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    /></svg
                >
            {/if}
            {item.title}
        </a>
    {/each}
</nav>
