<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Plus, FolderSearch } from "@lucide/svelte";
    import type { PageData } from "./$types";

    // Get server-loaded data
    let { data }: { data: PageData } = $props();

    // Initialize reactive state from server data
    let meetings = $state(data.meetings || []);

    // Add a new meeting
    function scheduleMeeting() {
        // This would open a meeting scheduler modal in the real implementation
        alert("Meeting scheduler would open here");
    }
</script>

<div class="space-y-4">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Upcoming Meetings</h3>
        <Button onclick={scheduleMeeting}>
            <Plus className="mr-2 size-4" />
            Schedule Meeting
        </Button>
    </div>

    {#if meetings.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each meetings as meeting}
                <Card>
                    <CardHeader>
                        <CardTitle class="flex justify-between items-center">
                            <span>{meeting.type}</span>
                            <Badge
                                variant={meeting.type === "Board Meeting"
                                    ? "destructive"
                                    : "default"}
                            >
                                {meeting.date}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            {meeting.time} • {meeting.location}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >Founder:</span
                                >
                                <span class="font-medium"
                                    >{meeting.founder}</span
                                >
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >Company:</span
                                >
                                <span class="font-medium"
                                    >{meeting.company}</span
                                >
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >Agenda:</span
                                >
                                <span class="font-medium">{meeting.agenda}</span
                                >
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter class="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                            <Plus class="mr-2 size-4" />
                            Add Notes
                        </Button>
                        <Button size="sm">
                            <FolderSearch class="mr-2 size-4" />
                                                        Join Meeting
                        </Button>
                    </CardFooter>
                </Card>
            {/each}
        </div>
    {:else}
        <p class="text-muted-foreground text-center py-8">
            No upcoming meetings scheduled.
        </p>
    {/if}
</div>
