<script lang="ts">
    import {
        superForm,
        type SuperValidated,
        type Infer,
    } from "sveltekit-superforms";
    import { type ResetPasswordSchema, resetPasswordSchema } from "@/schemas/reset-password-schema";
    import * as Form from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { cn } from "@/utils";
    import { zodClient } from "sveltekit-superforms/adapters";
    import LoaderCircle from "@lucide/svelte/icons/loader-circle";
    import Eye from "@lucide/svelte/icons/eye";
    import EyeOff from "@lucide/svelte/icons/eye-off";

    let { data }: { data: { form: SuperValidated<Infer<ResetPasswordSchema>> } } =
        $props();

    const form = superForm(data.form, {
        validators: zodClient(resetPasswordSchema),
    });

    const { form: formData, errors, enhance, delayed, message } = form;

    let showPassword = $state(false);
    let showConfirmPassword = $state(false);
</script>

<div class="grid gap-6">
    <form method="POST" use:enhance>
        {#if $message}
            <div
                class="mb-4 p-3 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm"
            >
                {$message}
            </div>
        {/if}
        
        <!-- Hidden token field -->
        <input type="hidden" name="token" bind:value={$formData.token} />
        
        <div class="grid gap-4">
            <Form.Field {form} name="password">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>New Password</Form.Label>
                        <div class="relative">
                            <Input
                                {...props}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autocomplete="new-password"
                                class={cn(
                                    "w-full pr-10",
                                    $errors.password && "border-destructive",
                                )}
                                bind:value={$formData.password}
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onclick={() => showPassword = !showPassword}
                            >
                                {#if showPassword}
                                    <EyeOff class="h-4 w-4 text-muted-foreground" />
                                {:else}
                                    <Eye class="h-4 w-4 text-muted-foreground" />
                                {/if}
                            </button>
                        </div>
                    {/snippet}
                </Form.Control>
                <Form.Description>
                    Password must be at least 8 characters long and include a number and special character
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
                        <div class="relative">
                            <Input
                                {...props}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autocomplete="new-password"
                                class={cn(
                                    "w-full pr-10",
                                    $errors.confirmPassword && "border-destructive",
                                )}
                                bind:value={$formData.confirmPassword}
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onclick={() => showConfirmPassword = !showConfirmPassword}
                            >
                                {#if showConfirmPassword}
                                    <EyeOff class="h-4 w-4 text-muted-foreground" />
                                {:else}
                                    <Eye class="h-4 w-4 text-muted-foreground" />
                                {/if}
                            </button>
                        </div>
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
                        <span>Updating password...</span>
                    </div>
                {:else}
                    <span>Update password</span>
                {/if}
            </Form.Button>
        </div>
    </form>
</div> 