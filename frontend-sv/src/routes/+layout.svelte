<script lang="ts">
    import "../app.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    let { children } = $props();

    import { authClient } from "@/auth-client";
    const session = authClient.useSession();
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
