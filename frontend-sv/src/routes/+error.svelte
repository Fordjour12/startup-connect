<script>
    import { page } from "$app/state";
    import { Button } from "$lib/components/ui/button";
    import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
    import Home from "@lucide/svelte/icons/home";
    import RefreshCcw from "@lucide/svelte/icons/refresh-cw";

    // You can access error information if needed (status code, error message)
    let error = $derived(page.error);
    let status = $derived(page.status);

    // Custom error messages based on status code
    let errorTitle = $derived.by(() => {
        switch (status) {
            case 404:
                return "Page Not Found";
            case 403:
                return "Access Forbidden";
            case 500:
                return "Server Error";
            default:
                return "An Error Occurred";
        }
    });

    function refreshPage() {
        window.location.reload();
    }
</script>

<svelte:head>
    <title>{status} - {errorTitle}</title>
</svelte:head>

<main class="grid min-h-screen place-items-center bg-background px-4">
    <div
        class="flex flex-col items-center justify-center space-y-6 px-5 text-center max-w-md w-full"
    >
        <div class="rounded-full bg-muted p-4 text-primary">
            <AlertTriangle class="h-10 w-10" />
        </div>

        <div class="space-y-2">
            <h1 class="text-4xl font-inter text-foreground font-extrabold">
                Oops! {errorTitle}
            </h1>

            <p class="text-muted-foreground">
                {#if status === 404}
                    The page you were looking for doesn't exist or has been
                    moved.
                {:else if status === 403}
                    You don't have permission to access this resource.
                {:else if status === 500}
                    We're experiencing some problems on our end. Please try
                    again later.
                {:else}
                    Something went wrong. Please try again or contact support if
                    the problem persists.
                {/if}
            </p>
        </div>

        <div class="border border-border rounded-md bg-card p-4 w-full">
            <p class="text-sm font-medium text-card-foreground">
                Error Details
            </p>
            <p class="text-xs text-muted-foreground">Error Code: {status}</p>
            {#if error?.message}
                <p class="text-xs text-muted-foreground mt-2 break-all">
                    Message: {error.message}
                </p>
            {/if}
        </div>

        <div class="flex flex-wrap gap-4 justify-center">
            <a href="/">
                <Button variant="default">
                    <Home class="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </a>
            <Button variant="outline" onclick={refreshPage}>
                <RefreshCcw class="mr-2 h-4 w-4" />
                Reload Page
            </Button>
        </div>
    </div>
</main>
