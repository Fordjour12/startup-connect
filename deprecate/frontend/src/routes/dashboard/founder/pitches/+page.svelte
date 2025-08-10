<!-- <script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { endpoints } from "$lib/endpoints";
    import { toast } from "svelte-sonner";

    interface PitchDeck {
        id: string;
        filename: string;
        file_url: string;
        file_size: number;
        created_at: string;
    }

    interface PitchMessage {
        id: string;
        message_content: string;
        status: 'sent' | 'viewed' | 'responded' | 'archived';
        sent_at: string;
        investor_id: string;
        pitch_deck: PitchDeck;
    }

    let pitches: PitchMessage[] = $state([]);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        await loadPitches();
    });

    async function loadPitches() {
        try {
            isLoading = true;
            error = null;

            const response = await fetch(`${endpoints.pitches}/history`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to load pitch history');
            }

            pitches = await response.json();
        } catch (err) {
            console.error('Failed to load pitches:', err);
            error = err instanceof Error ? err.message : 'Failed to load pitches';
            toast.error('Failed to load pitch history');
        } finally {
            isLoading = false;
        }
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
        switch (status) {
            case 'sent': return 'default';
            case 'viewed': return 'secondary';
            case 'responded': return 'outline';
            case 'archived': return 'destructive';
            default: return 'default';
        }
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'sent': return 'text-blue-600';
            case 'viewed': return 'text-yellow-600';
            case 'responded': return 'text-green-600';
            case 'archived': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    }
</script>

<svelte:head>
    <title>Pitch History - StartupConnect</title>
    <meta name="description" content="View your pitch history and track investor responses" />
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Pitch History</h1>
            <p class="text-muted-foreground">
                Track your sent pitches and investor responses
            </p>
        </div>
        <Button onclick={loadPitches} variant="outline">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
            Refresh
        </Button>
    </div>

    {#if isLoading}
        <div class="space-y-4">
            {#each Array(3) as _}
                <Card>
                    <CardHeader>
                        <div class="flex items-center justify-between">
                            <Skeleton class="h-6 w-48" />
                            <Skeleton class="h-5 w-16" />
                        </div>
                        <Skeleton class="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton class="h-4 w-full mb-2" />
                        <Skeleton class="h-4 w-3/4" />
                    </CardContent>
                </Card>
            {/each}
        </div>
    {:else if error}
        <Card>
            <CardContent class="flex flex-col items-center justify-center py-12">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-destructive mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 class="text-lg font-semibold mb-2">Failed to Load Pitches</h3>
                <p class="text-muted-foreground mb-4 text-center">{error}</p>
                <Button onclick={loadPitches}>
                    Try Again
                </Button>
            </CardContent>
        </Card>
    {:else if pitches.length === 0}
        <Card>
            <CardContent class="flex flex-col items-center justify-center py-12">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 text-muted-foreground mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 class="text-lg font-semibold mb-2">No Pitches Yet</h3>
                <p class="text-muted-foreground mb-4 text-center">
                    You haven't sent any pitches to investors yet. Start connecting with investors to grow your startup!
                </p>
                <Button href="/dashboard/founder">
                    Browse Investors
                </Button>
            </CardContent>
        </Card>
    {:else}
        <div class="space-y-4">
            {#each pitches as pitch (pitch.id)}
                <Card class="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <CardTitle class="text-lg">Pitch to Investor</CardTitle>
                                <CardDescription>
                                    Sent {formatDate(pitch.sent_at)}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusVariant(pitch.status)} class={getStatusColor(pitch.status)}>
                                {pitch.status.charAt(0).toUpperCase() + pitch.status.slice(1)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent class="space-y-4"> -->
                        <!-- Message Content -->
                        <!-- <div>
                            <h4 class="text-sm font-medium mb-2">Message</h4>
                            <p class="text-sm text-muted-foreground leading-relaxed">
                                {pitch.message_content}
                            </p>
                        </div> -->

                        <!-- Pitch Deck Info -->
                        <!-- <div>
                            <h4 class="text-sm font-medium mb-2">Pitch Deck</h4>
                            <div class="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <div class="p-2 bg-primary/10 rounded">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium">{pitch.pitch_deck.filename}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {formatFileSize(pitch.pitch_deck.file_size)}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" href={pitch.pitch_deck.file_url} target="_blank">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                    View
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            {/each}
        </div>
    {/if}
</div>  -->