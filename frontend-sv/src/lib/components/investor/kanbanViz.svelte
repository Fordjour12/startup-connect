
<script lang="ts">
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
        valuation: number; // Assuming valuation is a number for formatCurrency
        targetAmount: number; // Assuming targetAmount is a number
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
</script>

<div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-full overflow-hidden"
>
    {#each pipelineStages as stage}
        <div class="flex flex-col h-full min-w-[280px] overflow-hidden">
            <div class="flex items-center mb-2 py-2 bg-background z-10">
                <div class={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                <h3 class="font-medium text-sm whitespace-nowrap">
                    {stage.name}
                </h3>
                <span class="text-xs text-muted-foreground ml-2">
                    ({getDealsByStage(stage.id).length})
                </span>
            </div>
            <div class="flex-1 overflow-y-auto pr-1 space-y-3">
                {#each getDealsByStage(stage.id) as deal}
                    <Card
                        class="cursor-pointer hover:shadow-lg transition-shadow duration-150 ease-in-out"
                    >
                        <CardHeader class="p-3 pb-0">
                            <div class="flex justify-between items-start mb-1">
                                <div class="flex items-center gap-2">
                                    <img
                                        src={deal.logo}
                                        alt="{deal.name} logo"
                                        class="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4
                                            class="font-semibold text-sm truncate"
                                            title={deal.name}
                                        >
                                            {deal.name}
                                        </h4>
                                        <p
                                            class="text-xs text-muted-foreground truncate"
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
                        <CardContent class="p-3 pt-1">
                            <div
                                class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-xs"
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
                                {#each deal.tags as tag}
                                    <Badge variant="secondary" class="text-xs">
                                        {tag}
                                    </Badge>
                                {/each}
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
                                                >{ddProcess.completedItems}/{ddProcess.totalItems}
                                                tasks</span
                                            >
                                            <span
                                                class="text-xs text-muted-foreground"
                                                >{ddProcess.progress}%</span
                                            >
                                        </div>
                                        <Progress
                                            value={ddProcess.progress}
                                            class="h-1.5"
                                        />
                                    </div>
                                {/if}
                            {/if}
                        </CardContent>
                        <CardFooter class="p-3 pt-2 flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-xs h-7"
                            >
                                Details</Button
                            >
                            <Button
                                variant="outline"
                                size="sm"
                                class="text-xs h-7"
                            >
                                Actions</Button
                            >
                        </CardFooter>
                    </Card>
                {/each}
            </div>
        </div>
    {/each}
</div>
