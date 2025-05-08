<!-- RegisterForm.svelte -->
<script lang="ts">
    import {
        superForm,
        type SuperValidated,
        type Infer,
    } from "sveltekit-superforms";
    import {
        type RegisterSchema,
        registerSchema,
        userTypes,
    } from "@/schemas/register-schema";
    import * as Form from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { cn } from "@/utils";
    import { zodClient } from "sveltekit-superforms/adapters";
    import * as Select from "@/components/ui/select";

    let { data }: { data: { form: SuperValidated<Infer<RegisterSchema>> } } =
        $props();

    const form = superForm(data.form, {
        validators: zodClient(registerSchema),
    });

    const { form: formData, errors, enhance } = form;
</script>

<div class="grid gap-6">
    <form method="POST" use:enhance>
        <div class="grid gap-4">
            <Form.Field {form} name="fullName">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Full Name</Form.Label>
                        <Input
                            {...props}
                            type="text"
                            placeholder="John Doe"
                            autocomplete="name"
                            class={cn(
                                "w-full",
                                $errors.fullName && "border-destructive",
                            )}
                            bind:value={$formData.fullName}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.fullName}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.fullName}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

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

            <Form.Field {form} name="userType">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>I am a</Form.Label>
                        <Select.Root
                            type="single"
                            bind:value={$formData.userType}
                        >
                            <Select.Trigger
                                {...props}
                                class={cn(
                                    "w-full",
                                    $errors.userType && "border-destructive",
                                )}
                            >
                                {$formData.userType
                                    ? $formData.userType
                                    : "select user type"}
                            </Select.Trigger>
                            <Select.Content>
                                {#each userTypes as type}
                                    <Select.Item value={type}>
                                        {type}
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    {/snippet}
                </Form.Control>
                {#if $errors.userType}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.userType}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Button type="submit" class="w-full">Create Account</Button>
        </div>
    </form>
</div>
