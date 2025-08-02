<script lang="ts">
    import type { PageData } from "./$types";
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();

    const goToOnboarding = () => {
        goto("/onboarding");
    };
</script>

<svelte:head>
    <title>Debug Role Information - Startup Connect</title>
    <meta
        name="description"
        content="Debug page for role and onboarding information"
    />
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">Debug Role Information</h1>
        <p class="text-muted-foreground">
            This page shows your current role information to help debug the
            onboarding issue.
        </p>
    </div>

    <div class="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>User ID:</strong>
                        <p class="text-muted-foreground">{data.user?.id}</p>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <p class="text-muted-foreground">{data.user?.email}</p>
                    </div>
                    <div>
                        <strong>Name:</strong>
                        <p class="text-muted-foreground">
                            {data.user?.full_name}
                        </p>
                    </div>
                    <div>
                        <strong>Current Role:</strong>
                        <p class="text-muted-foreground">{data.userRole}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Role Analysis</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Founder Role Value:</strong>
                        <p class="text-muted-foreground">{data.founderRole}</p>
                    </div>
                    <div>
                        <strong>Is Founder:</strong>
                        <p class="text-muted-foreground">
                            {data.isFounder ? "Yes" : "No"}
                        </p>
                    </div>
                    <div>
                        <strong>Should Show Onboarding:</strong>
                        <p class="text-muted-foreground">
                            {data.shouldShowOnboarding ? "Yes" : "No"}
                        </p>
                    </div>
                    <div>
                        <strong>Role Comparison:</strong>
                        <p class="text-muted-foreground">
                            {data.userRole} === {data.founderRole} = {data.userRole ===
                            data.founderRole
                                ? "true"
                                : "false"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>All Available Roles</CardTitle>
            </CardHeader>
            <CardContent>
                <pre class="text-sm bg-muted p-4 rounded">{JSON.stringify(
                        data.allRoles,
                        null,
                        2,
                    )}</pre>
            </CardContent>
        </Card>

        {#if data.error}
            <Card>
                <CardHeader>
                    <CardTitle class="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p class="text-destructive">{data.error}</p>
                    <pre
                        class="text-sm bg-muted p-4 rounded mt-2">{data.userCookie}</pre>
                </CardContent>
            </Card>
        {/if}

        <div class="flex justify-center space-x-4">
            <Button onclick={goToOnboarding}>Try Onboarding Page</Button>
            <Button variant="outline" onclick={() => goto("/test-onboarding")}>
                Test Onboarding
            </Button>
        </div>
    </div>
</div>
