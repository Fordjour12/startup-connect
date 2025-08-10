<script lang="ts">
    import { startupSchema } from "$lib/schemas/startup-schema";
    import NewStartupForm from "@/components/founder/NewStartupForm.svelte";
    import Playground from "@/components/founder/Playground.svelte";
    import { Button } from "@/components/ui/button";
    import { zod } from "sveltekit-superforms/adapters";
    import { superValidate } from "sveltekit-superforms/client";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let showPreview = $state(true);
    let showPlayground = $state(false);
    let formData = $state(data);
    let industry = $state(data.industry);
    let funding = $state(data.funding);

    function togglePreview() {
        showPreview = !showPreview;
    }

    function togglePlayground() {
        showPlayground = !showPlayground;
    }

    async function handlePopulate(playgroundData: any) {
        try {
            // Create a new SuperValidated form with the playground data
            const populatedForm = await superValidate(
                playgroundData,
                zod(startupSchema),
            );
            // Preserve the original data structure, only update the form
            formData = { ...data, form: populatedForm };
            // $inspect("Form populated with:", playgroundData);
        } catch (error) {
            console.error("Error populating form:", error);
        }
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
                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        onclick={() => togglePlayground()}
                    >
                        {showPlayground ? "Hide Playground" : "Show Playground"}
                    </Button>
                    <Button variant="outline" onclick={() => togglePreview()}>
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                </div>
            </div>

            {#if showPlayground}
                <Playground onPopulate={handlePopulate} />
            {/if}

            <NewStartupForm data={formData} {showPreview} {industry} {funding} />
        </div>
    </div>
</div>
