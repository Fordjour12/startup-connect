<script lang="ts">
    import "../app.css";
    import { Toaster } from "@/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    let { children } = $props();
    import { Button } from "@/components/ui/button";
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
