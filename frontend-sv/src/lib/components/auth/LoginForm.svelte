<script lang="ts">
    import * as Form from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { type LoginSchema, loginSchema } from "@/z-schema/login-schema";
    import { cn } from "@/utils";
    import LoaderCircle from "@lucide/svelte/icons/loader-circle";
    import {
        type Infer,
        superForm,
        type SuperValidated,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";

    let { data }: { data: { form: SuperValidated<Infer<LoginSchema>> } } =
        $props();

    const form = superForm(data.form, {
        validators: zodClient(loginSchema),
    });

    const { form: formData, errors, enhance, delayed, message } = form;

    // Get success message from URL parameters
    // let successMessage = $derived($page.url.searchParams.get("message"));
</script>

<div class="grid gap-6">
    <form method="POST" use:enhance>
        <!-- {#if successMessage}
            <div
                class="mb-4 p-3 rounded-md border border-success bg-success text-success text-sm flex items-center gap-2"
            >
                <CheckCircle class="h-4 w-4" />
                {successMessage}
            </div>
        {/if} -->
        {#if $message}
            <div
                class="mb-4 p-3 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm"
            >
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

            <Form.Field {form} name="password">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Password</Form.Label>
                        <Input
                            {...props}
                            type="password"
                            placeholder="••••••••"
                            autocomplete="current-password"
                            class={cn(
                                "w-full",
                                $errors.password && "border-destructive",
                            )}
                            bind:value={$formData.password}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.password}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.password}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <div class="flex items-center justify-between text-sm">
                <!-- <label class="flex items-center gap-2">
                    {@const checked = $formData.rememberMe}
                    <Input type="checkbox" bind:checked={checked} class="w-4 h-4" />
                    <span>Remember me</span>
                </label> -->
                <a href="/forgot-password" class="text-primary hover:underline">
                    Forgot password?
                </a>
            </div>

            <Form.Button class="w-full">
                {#if $delayed}
                    <div class="flex items-center justify-center gap-2">
                        <LoaderCircle
                            class="h-5 w-5 animate-spin"
                            strokeWidth={2}
                        />
                        <span>Signing in...</span>
                    </div>
                {:else}
                    <span> Sign in</span>
                {/if}
            </Form.Button>
        </div>
    </form>
</div>
