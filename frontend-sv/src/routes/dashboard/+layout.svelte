<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div>
    Hello & Welcome
    {@render children?.()}
</div>
