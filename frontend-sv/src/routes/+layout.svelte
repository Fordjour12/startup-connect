<script lang="ts">
    import "../app.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    import { MetaTags } from "svelte-meta-tags";
    let { children } = $props();
</script>

<MetaTags
    title="Startup Connect"
    description="Connecting visionary startups with strategic investors"
    openGraph={{
        title: "Startup Connect",
        description: "Connecting visionary startups with strategic investors",
        type: "website",
        images: [
            {
                url: "/logo.svg",
                alt: "Startup Connect Logo",
            },
        ],
    }}
    twitter={{
        title: "Startup Connect",
        description: "Connecting visionary startups with strategic investors",
        image: "/logo.svg",
        imageAlt: "Startup Connect Logo",
        cardType: "summary_large_image",
    }}
/>
<Toaster />
<ModeWatcher />

{@render children?.()}
