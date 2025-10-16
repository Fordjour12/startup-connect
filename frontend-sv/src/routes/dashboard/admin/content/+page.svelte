<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import {
        IconBuilding,
        IconFileText,
        IconCircleCheck,
        IconCircleX,
        IconClock,
        IconEye,
        IconSearch,
    } from "@tabler/icons-svelte";

    let { data } = $props<{
        data: {
            user: any;
            pendingStartups: any[];
            recentInvestments: any[];
            documents: any[];
            contentStats: any;
        };
    }>();

    const {
        user,
        pendingStartups,
        recentInvestments,
        documents,
        contentStats,
    } = data;

    function getStatusColor(status: string): string {
        switch (status) {
            case "approved":
            case "completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "pending":
            case "under_review":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }
</script>

<svelte:head>
    <title>Content Management - Admin Dashboard</title>
    <meta
        name="description"
        content="Manage startups, investments, and content approval"
    />
</svelte:head>

<div class="px-4 py-6">
    <div class="mb-8">
        <h1 class="text-3xl font-bold">Content Management</h1>
        <p class="text-muted-foreground">
            Manage startups, investments, and content approval workflows
        </p>
    </div>

    <!-- Stats Overview -->
    <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t"
    >
        <!-- Pending Startups Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Pending Startups</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {contentStats.pendingStartups}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Require Approval</div>
                <div class="text-muted-foreground">
                    Startups awaiting review
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Recent Investments Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Recent Investments</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {contentStats.recentInvestments}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">This Week</div>
                <div class="text-muted-foreground">
                    New investment transactions
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Documents Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Documents</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {contentStats.totalDocuments}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Total Uploaded</div>
                <div class="text-muted-foreground">All platform documents</div>
            </Card.Footer>
        </Card.Root>

        <!-- Approval Rate Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Approval Rate</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {contentStats.approvalRate}%
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Content Approval</div>
                <div class="text-muted-foreground">+2% from last month</div>
            </Card.Footer>
        </Card.Root>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pending Startups -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="flex items-center space-x-2">
                    <IconBuilding class="h-5 w-5" />
                    <span>Pending Startups</span>
                </Card.Title>
                <Card.Description>Startups awaiting approval</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="space-y-4">
                    {#each pendingStartups as startup}
                        <div class="border rounded-lg p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h3 class="font-semibold">
                                        {startup.name}
                                    </h3>
                                    <p class="text-sm text-muted-foreground">
                                        by {startup.founder}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    class={getStatusColor(startup.status)}
                                >
                                    {startup.status === "under_review"
                                        ? "Under Review"
                                        : "Pending"}
                                </Badge>
                            </div>
                            <p class="text-sm mb-3">{startup.description}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-muted-foreground">
                                    Submitted: {formatDate(
                                        startup.submittedDate,
                                    )}
                                </span>
                                <div class="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <IconEye class="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <IconCircleCheck class="h-4 w-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <IconCircleX class="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Recent Investments -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="flex items-center space-x-2">
                    <IconFileText class="h-5 w-5" />
                    <span>Recent Investments</span>
                </Card.Title>
                <Card.Description
                    >Latest investment transactions</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="space-y-4">
                    {#each recentInvestments as investment}
                        <div class="border rounded-lg p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h3 class="font-semibold">
                                        {investment.startup}
                                    </h3>
                                    <p class="text-sm text-muted-foreground">
                                        by {investment.investor}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    class={getStatusColor(investment.status)}
                                >
                                    {investment.status}
                                </Badge>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-lg font-bold text-green-600">
                                        {formatCurrency(investment.amount)}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {formatDate(investment.date)}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <IconEye class="h-4 w-4 mr-1" />
                                    Review
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Document Management -->
    <Card.Root class="mt-6">
        <Card.Header>
            <Card.Title class="flex items-center space-x-2">
                <IconFileText class="h-5 w-5" />
                <span>Document Management</span>
            </Card.Title>
            <Card.Description>
                Manage uploaded documents and approvals
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="space-y-4">
                {#each documents as document}
                    <div
                        class="flex items-center justify-between border rounded-lg p-4"
                    >
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            >
                                <IconFileText class="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="font-semibold">{document.name}</h3>
                                <p class="text-sm text-muted-foreground">
                                    {document.startup} • {formatDate(
                                        document.uploadedDate,
                                    )}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Badge
                                variant="outline"
                                class={getStatusColor(document.status)}
                            >
                                {document.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                                <IconEye class="h-4 w-4 mr-1" />
                                View
                            </Button>
                            {#if document.status === "pending"}
                                <Button variant="outline" size="sm">
                                    <IconCircleCheck class="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
</div>
