<script lang="ts">
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "@/components/ui/avatar";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
    } from "@/components/ui/card";
    import { Progress } from "@/components/ui/progress";
    import { formatCurrency, formatDate } from "@/utils";

    // Define interfaces for props for better type safety
    interface PipelineStage {
        id: string;
        name: string;
        color: string;
    }

    interface Deal {
        id: number;
        logo: string;
        name: string;
        industry: string;
        priority: string;
        valuation: number;
        targetAmount: number;
        assignee: string;
        lastActivity: string | Date;
        tags: string[];
    }

    interface DueDiligenceProcess {
        completedItems: number;
        totalItems: number;
        progress: number;
    }

    let {
        pipelineStages,
        getDealsByStage,
        getPriorityClass,
        getActiveDueDiligenceForDeal,
    }: {
        pipelineStages: PipelineStage[];
        getDealsByStage: (stageId: string) => Deal[];
        getPriorityClass: (priority: string) => string;
        getActiveDueDiligenceForDeal: (
            dealId: number,
        ) => DueDiligenceProcess | null | undefined;
    } = $props();

    // Function to get initials from name for avatar fallback
    function getInitials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase();
    }
</script>

<div
    class="kanban-container h-[calc(100vh-12rem)] flex overflow-x-auto overflow-y-hidden p-1 pb-4"
>
    {#each pipelineStages as stage}
        <div
            class="kanban-column flex-shrink-0 w-80 mx-2 flex flex-col bg-card rounded-lg border border-border"
        >
            <!-- Column Header -->
            <div
                class="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-muted/50 backdrop-blur-sm"
            >
                <div class="flex items-center">
                    <div
                        class={`w-3 h-3 rounded-full ${stage.color} mr-2`}
                    ></div>
                    <h3 class="font-medium text-sm">{stage.name}</h3>
                    <span class="ml-2 text-xs text-muted-foreground">
                        ({getDealsByStage(stage.id).length})
                    </span>
                </div>
                <Button variant="ghost" size="icon" class="h-7 w-7">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-plus"
                        ><path d="M5 12h14" /><path d="M12 5v14" /></svg
                    >
                    <span class="sr-only">Add deal</span>
                </Button>
            </div>

            <!-- Column Content with Cards -->
            <div class="flex-1 overflow-y-auto p-2 space-y-3">
                {#each getDealsByStage(stage.id) as deal}
                    <Card
                        class="cursor-pointer hover:shadow-md transition-all duration-150 border border-border/40 bg-background"
                    >
                        <CardHeader class="p-3 pb-0">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-2">
                                    <Avatar class="h-8 w-8">
                                        <AvatarImage
                                            src={deal.logo}
                                            alt={deal.name}
                                        />
                                        <AvatarFallback
                                            >{getInitials(
                                                deal.name,
                                            )}</AvatarFallback
                                        >
                                    </Avatar>
                                    <div>
                                        <h4
                                            class="font-semibold text-sm"
                                            title={deal.name}
                                        >
                                            {deal.name}
                                        </h4>
                                        <p
                                            class="text-xs text-muted-foreground"
                                            title={deal.industry}
                                        >
                                            {deal.industry}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    class={getPriorityClass(deal.priority)}
                                    variant="outline"
                                >
                                    {deal.priority}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent class="p-3 pt-2">
                            <div
                                class="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs"
                            >
                                <div>
                                    <p class="text-muted-foreground">
                                        Valuation
                                    </p>
                                    <p class="font-medium">
                                        {formatCurrency(deal.valuation)}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-muted-foreground">Raising</p>
                                    <p class="font-medium">
                                        {formatCurrency(deal.targetAmount)}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-muted-foreground">
                                        Assignee
                                    </p>
                                    <p
                                        class="font-medium truncate"
                                        title={deal.assignee}
                                    >
                                        {deal.assignee}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-muted-foreground">
                                        Last Activity
                                    </p>
                                    <p class="font-medium">
                                        {formatDate(
                                            typeof deal.lastActivity ===
                                                "string"
                                                ? deal.lastActivity
                                                : (deal.lastActivity?.toISOString?.() ??
                                                      ""),
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-1 mt-3">
                                {#each deal.tags.slice(0, 3) as tag}
                                    <Badge variant="secondary" class="text-xs">
                                        {tag}
                                    </Badge>
                                {/each}
                                {#if deal.tags.length > 3}
                                    <Badge variant="outline" class="text-xs">
                                        +{deal.tags.length - 3}
                                    </Badge>
                                {/if}
                            </div>

                            {#if stage.id === "due_diligence"}
                                {@const ddProcess =
                                    getActiveDueDiligenceForDeal(deal.id)}
                                {#if ddProcess}
                                    <div class="mt-3">
                                        <div
                                            class="flex items-center justify-between mb-1"
                                        >
                                            <span
                                                class="text-xs text-muted-foreground"
                                            >
                                                {ddProcess.completedItems}/{ddProcess.totalItems}
                                                tasks
                                            </span>
                                            <span
                                                class="text-xs text-muted-foreground"
                                            >
                                                {ddProcess.progress}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={ddProcess.progress}
                                            class="h-1.5"
                                        />
                                    </div>
                                {/if}
                            {/if}
                        </CardContent>

                        <CardFooter
                            class="p-3 pt-1 flex justify-between border-t border-border/30 mt-1"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-xs h-7"
                            >
                                Details
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                class="text-xs h-7"
                            >
                                Actions
                            </Button>
                        </CardFooter>
                    </Card>
                {/each}

                <!-- Add Card Placeholder -->
                {#if getDealsByStage(stage.id).length === 0}
                    <div
                        class="flex items-center justify-center p-4 border border-dashed border-border rounded-lg text-muted-foreground h-20"
                    >
                        <p class="text-xs">No deals in this stage</p>
                    </div>
                {/if}
            </div>

            <!-- Column Footer -->
            <div class="p-2 border-t border-border/50 bg-muted/30">
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-full text-xs text-muted-foreground"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="mr-1"
                        ><path d="M5 12h14" /><path d="M12 5v14" /></svg
                    >
                    Add Deal
                </Button>
            </div>
        </div>
    {/each}

    <!-- Add Column Button -->
    <div class="flex-shrink-0 w-12 flex items-center justify-center ml-2">
        <Button
            variant="outline"
            size="icon"
            class="h-9 w-9 rounded-full border-dashed"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="M12 5v14" /></svg
            >
            <span class="sr-only">Add column</span>
        </Button>
    </div>
</div>

<style>
    /* Enable native scrollbar styling on WebKit browsers */
    .kanban-column > div::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .kanban-column > div::-webkit-scrollbar-track {
        background: transparent;
    }

    .kanban-column > div::-webkit-scrollbar-thumb {
        background: hsl(var(--muted));
        border-radius: 3px;
    }

    .kanban-column > div::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--muted-foreground));
    }

    /* Auto-hide scrollbars until hover */
    .kanban-column > div {
        scrollbar-width: thin;
        scrollbar-color: hsl(var(--muted)) transparent;
    }

    .kanban-column > div:hover {
        scrollbar-color: hsl(var(--muted-foreground)) transparent;
    }
</style>
