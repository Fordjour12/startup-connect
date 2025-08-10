<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { toast } from "svelte-sonner";
    import type { PageData } from "./$types";

    import * as AlertDialog from "$lib/components/ui/alert-dialog/";
    import { Button } from "$lib/components/ui/button/";
    import * as Card from "$lib/components/ui/card/";
    import { Input } from "$lib/components/ui/input/";
    import { AlertTriangle, Building, Trash2 } from "@lucide/svelte";

    let { data }: { data: PageData } = $props();

    let confirmationInput = $state("");
    let showDeleteDialog = $state(false);

    const expectedConfirmationText = $derived(
        `${data.username}/${data.startup.name}`,
    );
    const isConfirmationMatch = $derived(
        confirmationInput.trim() === expectedConfirmationText,
    );

    const deleteEnhance: SubmitFunction = ({ formData, action, cancel }) => {
        return async ({ result, update }) => {
            if (result.type === "success" || result.type === "redirect") {
                toast.success(
                    `Startup '${data.startup.name}' deleted successfully.`,
                );
                // Redirect is handled by server action, but good to toast before that happens if possible
                // For manual redirect if server didn't: await goto('/dashboard/founder');
            } else if (result.type === "failure") {
                toast.error(
                    `Failed to delete startup: ${result.data?.message || "Unknown error"}`,
                );
            }
            showDeleteDialog = false; // Close dialog regardless of outcome
            update(); // Ensure form state is updated if needed
        };
    };

    function handleAttemptDelete() {
        if (isConfirmationMatch) {
            showDeleteDialog = true;
        } else {
            toast.error(
                "Confirmation text does not match. Please type correctly to proceed.",
            );
        }
    }
</script>

<div class="container mx-auto max-w-4xl py-10 space-y-8">
    <Card.Root class="border-destructive">
        <Card.Header>
            <div class="flex items-center gap-2">
                <AlertTriangle class="h-6 w-6 text-destructive" />
                <Card.Title class="text-2xl text-destructive"
                    >Confirm Deletion</Card.Title
                >
            </div>
            <Card.Description class="text-destructive">
                You are about to permanently delete the startup:
                <span class="font-semibold">{data.startup.name}</span>.
            </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-6">
            <div class="p-6 bg-muted/50 rounded-lg border">
                <h3 class="font-semibold text-lg mb-2">Startup Details:</h3>
                <div class="flex items-center gap-3 mb-2">
                    <Building
                        class="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg"
                    />
                    <div>
                        <p class="text-xl font-bold">{data.startup.name}</p>
                        <p class="text-sm text-muted-foreground">
                            {data.startup.industry} - {data.startup.location}
                        </p>
                    </div>
                </div>
                <p class="text-sm text-muted-foreground italic">
                    {data.startup.description}
                </p>
            </div>

            <div class="space-y-4">
                <p class="font-medium text-destructive">
                    This action cannot be undone. All data associated with this
                    startup will be permanently removed.
                </p>
                <p>
                    To confirm, please type the following exactly:
                    <code
                        class="px-2 py-1 bg-destructive/10 text-destructive rounded font-mono text-sm"
                    >
                        {expectedConfirmationText}
                    </code>
                </p>
                <Input
                    bind:value={confirmationInput}
                    placeholder={`Type '${expectedConfirmationText}' to confirm`}
                    aria-label="Deletion confirmation input"
                    class={isConfirmationMatch
                        ? "border-green-500"
                        : "border-destructive"}
                />
            </div>

            <AlertDialog.Root bind:open={showDeleteDialog}>
                <AlertDialog.Trigger>
                    <Button
                        onclick={handleAttemptDelete}
                        variant="destructive"
                        class="w-full mt-4"
                        disabled={!isConfirmationMatch}
                        aria-label="Initiate startup deletion"
                    >
                        <Trash2 class="mr-2 h-4 w-4" />
                        Delete Startup: {data.startup.name}
                    </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title
                            >Are you absolutely sure?</AlertDialog.Title
                        >
                        <AlertDialog.Description>
                            This action will permanently delete the startup
                            <span class="font-semibold"
                                >"{data.startup.name}"</span
                            >. All associated data will be lost. This cannot be
                            undone.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <form
                            method="POST"
                            use:enhance={deleteEnhance}
                            class="w-full sm:w-auto"
                        >
                            <Button
                                type="submit"
                                variant="destructive"
                                class="w-full sm:w-auto"
                            >
                                <Trash2 class="mr-2 h-4 w-4" />
                                Yes, delete this startup
                            </Button>
                        </form>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>

            <p class="text-xs text-muted-foreground mt-6 text-center">
                For critical data, consider implementing a soft delete or backup
                mechanism in a production environment.
            </p>
        </Card.Content>
    </Card.Root>
</div>
