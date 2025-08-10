<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { goto } from "$app/navigation";
    import ShieldX from "@lucide/svelte/icons/shield-x";
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
    <div class="max-w-md w-full mx-auto text-center space-y-6 p-6">
        <div class="flex justify-center">
            <div class="rounded-full bg-destructive/10 p-3">
                <ShieldX class="h-12 w-12 text-destructive" />
            </div>
        </div>

        <div class="space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p class="text-muted-foreground">
                You don't have permission to access this page. Please contact
                your administrator if you believe this is an error.
            </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onclick={() => history.back()}>
                <ArrowLeft class="mr-2 h-4 w-4" />
                Go Back
            </Button>
            <Button onclick={() => goto("/")}>Go to Home</Button>
        </div>
    </div>
</div>
