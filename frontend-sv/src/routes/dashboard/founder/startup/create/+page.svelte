<script lang="ts">
    import NewStartupForm from "@/components/founder/NewStartupForm.svelte";
    import { Button } from "@/components/ui/button";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let showPreview = $state(true);

    function togglePreview() {
        showPreview = !showPreview;
    }
</script>

<div class="container mx-auto py-5 px-3">
    <div class="mx-auto">
        <div class="flex flex-col gap-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold mb-2">Create New Startup</h1>
                    <p class="text-muted-foreground">
                        Fill in your startup details to create your profile
                    </p>
                </div>
                <Button variant="outline" onclick={() => togglePreview()}>
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
            </div>
                <NewStartupForm {data} {showPreview} />
        </div>
    </div>
</div>
