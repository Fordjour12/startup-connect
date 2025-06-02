<script lang="ts">
    import * as Form from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import {
        type ResetPasswordSchema,
        resetPasswordSchema,
    } from "@/schemas/reset-password-schema";
    import { cn } from "@/utils";
    import { AlertCircle, LoaderCircle } from "@lucide/svelte";
    import {
        type Infer,
        superForm,
        type SuperValidated,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";

    let {
        data,
    }: { data: { form: SuperValidated<Infer<ResetPasswordSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: zodClient(resetPasswordSchema),
    });

    const { form: formData, errors, enhance, delayed, message } = form;
</script>

<div class="grid gap-6">
    <form method="POST" use:enhance>
        {#if $message}
            <div
                class="mb-4 p-3 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm flex items-center gap-2"
            >
                <AlertCircle class="h-4 w-4" />
                {$message}
            </div>
        {/if}

        <div class="grid gap-4">
            <!-- Hidden token field -->
            <input type="hidden" name="token" bind:value={$formData.token} />

            <Form.Field {form} name="password">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>New Password</Form.Label>
                        <Input
                            {...props}
                            type="password"
                            placeholder="••••••••"
                            autocomplete="new-password"
                            class={cn(
                                "w-full",
                                $errors.password && "border-destructive",
                            )}
                            bind:value={$formData.password}
                        />
                    {/snippet}
                </Form.Control>
                <Form.Description>
                    Password must be at least 8 characters long and include a
                    number and special character
                </Form.Description>
                {#if $errors.password}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.password}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="confirmPassword">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Confirm New Password</Form.Label>
                        <Input
                            {...props}
                            type="password"
                            placeholder="••••••••"
                            autocomplete="new-password"
                            class={cn(
                                "w-full",
                                $errors.confirmPassword && "border-destructive",
                            )}
                            bind:value={$formData.confirmPassword}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.confirmPassword}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.confirmPassword}
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
                        <span>Resetting password...</span>
                    </div>
                {:else}
                    <span>Reset Password</span>
                {/if}
            </Form.Button>
        </div>
    </form>
</div>
