<script lang="ts">
    import "../app.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    import { authClient, getCurrentSession } from "@/auth-client";
    let { children } = $props();

    // Initialize session on mount
    $effect(() => {
        getCurrentSession();
    });
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
