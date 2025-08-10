<script lang="ts">
    import "../2.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    import { authClient, getCurrentSession } from "@/auth-client";
    let { children } = $props();
    import { Button } from "@/components/ui/button";

    // Initialize session on mount
    $effect(() => {
        getCurrentSession();
    });
</script>

<Toaster />
<ModeWatcher />
<Button class="bg-destructive w-full">Watch out</Button>

{@render children?.()}
