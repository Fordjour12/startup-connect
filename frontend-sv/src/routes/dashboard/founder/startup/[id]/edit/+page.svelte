<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { toast } from "svelte-sonner";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        dataType: "json",
        onUpdated: ({ form: f }) => {
            if (f.message) {
                toast.success(String(f.message));
            }
        },
    });
    const { form: formData, enhance, errors, submitting, message } = form;
</script>

<div class="space-y-8 max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-semibold">Edit Startup: {data.startupId}</h1>

    <form method="POST" use:enhance class="space-y-6">
        <Form.Field {form} name="name">
            <Form.Control>
                <Form.Label>Startup Name</Form.Label>
                <Input
                    bind:value={$formData.name}
                    placeholder="e.g., Innovatech Solutions"
                />
            </Form.Control>
            <Form.Description
                >The official name of your startup.</Form.Description
            >
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="description">
            <Form.Control>
                <Form.Label>Description</Form.Label>
                <Textarea
                    bind:value={$formData.description}
                    placeholder="Describe your startup's mission and vision..."
                    rows={5}
                />
            </Form.Control>
            <Form.Description
                >A brief overview of what your startup does.</Form.Description
            >
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="website">
            <Form.Control>
                <Form.Label>Website URL</Form.Label>
                <Input
                    type="url"
                    bind:value={$formData.website}
                    placeholder="https://example.com"
                />
            </Form.Control>
            <Form.Description>Your startup's official website.</Form.Description
            >
            <Form.FieldErrors />
        </Form.Field>

        <Form.Button type="submit" disabled={$submitting}>
            {#if $submitting}Saving...{:else}Save Changes{/if}
        </Form.Button>
        {#if $message}<p class="text-green-600">{$message}</p>{/if}
    </form>
</div>
