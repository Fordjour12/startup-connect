<script lang="ts">
    import {
        superForm,
        type SuperValidated,
        type Infer,
    } from "sveltekit-superforms";
    import { type ForgotPasswordSchema, forgotPasswordSchema } from "@/schemas/forgot-password-schema";
    import * as Form from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { cn } from "@/utils";
    import { zodClient } from "sveltekit-superforms/adapters";
    import LoaderCircle from "@lucide/svelte/icons/loader-circle";
    import CheckCircle from "@lucide/svelte/icons/check-circle";

    let { data }: { data: { form: SuperValidated<Infer<ForgotPasswordSchema>> } } =
        $props();

    const form = superForm(data.form, {
        validators: zodClient(forgotPasswordSchema),
    });

    const { form: formData, errors, enhance, delayed, message } = form;
</script>

<div class="grid gap-6">
    <form method="POST" use:enhance>
        {#if $message}
            <div
                class="mb-4 p-3 rounded-md border border-green-500 bg-green-50 text-green-700 text-sm flex items-center gap-2"
            >
                <CheckCircle class="h-4 w-4" />
                {$message}
            </div>
        {/if}
        <div class="grid gap-4">
            <Form.Field {form} name="email">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Email</Form.Label>
                        <Input
                            {...props}
                            type="email"
                            placeholder="m@example.com"
                            autocomplete="email"
                            class={cn(
                                "w-full",
                                $errors.email && "border-destructive",
                            )}
                            bind:value={$formData.email}
                        />
                    {/snippet}
                </Form.Control>
                <Form.Description>
                    Enter the email address associated with your account
                </Form.Description>
                {#if $errors.email}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.email}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Button class="w-full" disabled={$delayed}>
                {#if $delayed}
                    <div class="flex items-center justify-center gap-2">
                        <LoaderCircle
                            class="h-5 w-5 animate-spin"
                            strokeWidth={2}
                        />
                        <span>Sending reset link...</span>
                    </div>
                {:else}
                    <span>Send reset link</span>
                {/if}
            </Form.Button>
        </div>
    </form>
</div> 