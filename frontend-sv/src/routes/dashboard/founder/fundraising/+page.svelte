<!-- Fundraising Enhancements Dashboard -->
<script lang="ts">
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
    import { Badge } from "$lib/components/ui/badge";
    import * as Table from "$lib/components/ui/table";
    import { Progress } from "$lib/components/ui/progress";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import type { PageData } from './$types';
    
    // Icons
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import Clock from "@lucide/svelte/icons/clock";
    import Plus from "@lucide/svelte/icons/plus";
    import DollarSign from "@lucide/svelte/icons/dollar-sign";
    import PieChart from "@lucide/svelte/icons/pie-chart";
    import FileText from "@lucide/svelte/icons/file-text";
    import Users from "@lucide/svelte/icons/users";
    import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
    import CircleDollarSign from "@lucide/svelte/icons/circle-dollar-sign";
    import Filter from "@lucide/svelte/icons/filter";
    import BarChart from "@lucide/svelte/icons/bar-chart";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import Download from "@lucide/svelte/icons/download";
    import Upload from "@lucide/svelte/icons/upload";
    import Edit3 from "@lucide/svelte/icons/edit-3";
    import FilePlus from "@lucide/svelte/icons/file-plus";
    import Share2 from "@lucide/svelte/icons/share-2";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import AlertCircle from "@lucide/svelte/icons/alert-circle";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    
    // Page data
    let { data } = $props<{ data: PageData }>();
    
    // Active tab state
    let activeTab = $state("pipeline");
    
    // Loading state
    let isLoading = $state(true);
    
    onMount(() => {
        // Simulate API data loading
        setTimeout(() => {
            isLoading = false;
        }, 500);
    });
    
    // Format currency function
    function formatCurrency(amount: number, abbreviate: boolean = false): string {
        if (abbreviate) {
            if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(1)}K`;
            }
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Format date
    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Format large numbers
    function formatNumber(num: number): string {
        return new Intl.NumberFormat('en-US').format(num);
    }
    
    // Format percentage
    function formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }
    
    // Get status badge class
    function getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500/10 text-green-500';
            case 'in progress':
            case 'in negotiation':
                return 'bg-blue-500/10 text-blue-500';
            case 'pending':
                return 'bg-amber-500/10 text-amber-500';
            case 'not started':
                return 'bg-gray-500/10 text-gray-500';
            case 'ready for signature':
                return 'bg-purple-500/10 text-purple-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }
    
    // Get priority badge class
    function getPriorityClass(priority: string): string {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-500/10 text-red-500';
            case 'medium':
                return 'bg-amber-500/10 text-amber-500';
            case 'low':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }
    
    // Get stage badge class
    function getStageBadgeClass(stage: string): string {
        switch (stage) {
            case 'Contacted':
                return 'bg-blue-500/10 text-blue-500';
            case 'Pitched':
                return 'bg-violet-500/10 text-violet-500';
            case 'Due Diligence':
                return 'bg-pink-500/10 text-pink-500';
            case 'Committed':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    }
    
    // Calculate total funnel amount
    let totalFunnelAmount = $derived(data.fundraising.pipeline.stages.reduce(
        (total: number, stage: {amount: number}) => total + stage.amount, 0
    ));
    
    // Calculate funnel percentage for each stage
    let funnelData = $derived(data.fundraising.pipeline.stages.map((stage: {amount: number, name: string, count: number, color: string}) => ({
        ...stage,
        percentage: (stage.amount / totalFunnelAmount) * 100
    })));
</script>

<div class="container max-w-7xl py-6 space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-5 duration-500">
        <div>
            <div class="flex items-center gap-3">
                <a href="/dashboard/founder" class="text-muted-foreground hover:text-foreground transition-colors">
                    <Button variant="ghost" size="sm" class="gap-1">
                        <ArrowLeft class="h-4 w-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </a>
            </div>
            <h1 class="text-3xl font-bold tracking-tight mt-2">
                Fundraising Enhancements
            </h1>
            <p class="text-muted-foreground mt-1">
                Manage your fundraising pipeline, evaluate terms, and handle investment documentation
            </p>
        </div>

        <div class="flex items-center gap-3">
            <Button variant="outline" size="sm" class="gap-2">
                <Clock class="h-4 w-4" />
                <span>Last updated: Today at 9:30 AM</span>
            </Button>
            
            <Button variant="default" size="sm" class="gap-2">
                <Plus class="h-4 w-4" />
                <span>Add Investor</span>
            </Button>
        </div>
    </div>

    <!-- Main Content -->
    <Tabs value={activeTab} onValueChange={(val) => (activeTab = val)} class="space-y-6">
        <TabsList>
            <TabsTrigger value="pipeline" class="flex items-center gap-2">
                <BarChart class="h-4 w-4" />
                <span>Fundraising Pipeline</span>
            </TabsTrigger>
            <TabsTrigger value="terms" class="flex items-center gap-2">
                <DollarSign class="h-4 w-4" />
                <span>Terms Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" class="flex items-center gap-2">
                <FileText class="h-4 w-4" />
                <span>Investment Documentation</span>
            </TabsTrigger>
        </TabsList>

        <!-- Fundraising Pipeline Tab -->
        <TabsContent value="pipeline" class="space-y-6">
            <!-- Funnel Visualization -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Fundraising Funnel</Card.Title>
                    <Card.Description>Visual representation of your investor pipeline</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="flex flex-col gap-2">
                        {#each funnelData as stage, index}
                            <div class="space-y-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium">{stage.name}</div>
                                    <div class="flex items-center gap-4">
                                        <Badge variant="outline" class={getStageBadgeClass(stage.name)}>
                                            {stage.count} investors
                                        </Badge>
                                        <span class="font-medium">{formatCurrency(stage.amount, true)}</span>
                                    </div>
                                </div>
                                <div class="h-8 bg-muted/50 rounded-md overflow-hidden relative">
                                    <div 
                                        class="absolute top-0 left-0 h-full rounded-md"
                                        style:width="{stage.percentage}%"
                                        style:background-color="{stage.color}"
                                    ></div>
                                </div>
                                
                                {#if index < funnelData.length - 1}
                                    <div class="flex justify-between items-center text-sm text-muted-foreground pl-4">
                                        <div class="flex items-center">
                                            <TrendingUp class="h-3.5 w-3.5 mr-1" />
                                            <span>
                                                {data.fundraising.pipeline.conversionRates[index].rate}% conversion to {data.fundraising.pipeline.conversionRates[index].to}
                                            </span>
                                        </div>
                                        <div>
                                            <ChevronRight class="h-4 w-4" />
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    
                    <div class="mt-4 pt-4 border-t flex justify-between items-center">
                        <div>
                            <span class="text-sm text-muted-foreground">Total Pipeline Value:</span>
                            <span class="ml-2 font-semibold">{formatCurrency(totalFunnelAmount)}</span>
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter class="h-4 w-4 mr-2" />
                            Filter Pipeline
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
            
            <!-- Recent Investors & Target Lists -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Recent Investors -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Recent Investors</Card.Title>
                        <Card.Description>Latest investor activities and status</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.fundraising.pipeline.recentInvestors as investor}
                            <div class="p-3 bg-muted/50 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">{investor.name}</div>
                                    <Badge variant="outline" class={getStageBadgeClass(investor.stage)}>
                                        {investor.stage}
                                    </Badge>
                                </div>
                                <div class="flex items-center justify-between mt-1 text-sm">
                                    <span class="text-muted-foreground">Potential: {formatCurrency(investor.amount)}</span>
                                    <span class="text-muted-foreground">Last Contact: {formatDate(investor.lastContact)}</span>
                                </div>
                                <p class="text-sm mt-2 bg-background p-2 rounded">
                                    {investor.notes}
                                </p>
                                
                                <div class="flex justify-between items-center mt-2">
                                    <Badge variant="outline" class={getPriorityClass(investor.priority)}>
                                        {investor.priority} priority
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink class="h-3.5 w-3.5 mr-1" />
                                        <span>Details</span>
                                    </Button>
                                </div>
                            </div>
                        {/each}
                        
                        <div class="text-center">
                            <Button variant="outline" size="sm">
                                <Users class="h-4 w-4 mr-2" />
                                View All Investors
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>
                
                <!-- Target Lists -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Target Lists</Card.Title>
                        <Card.Description>Organized investor groups and segments</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#each data.fundraising.pipeline.targetLists as list}
                            <div class="p-3 bg-muted/50 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">{list.name}</div>
                                    <Badge variant="outline">
                                        {list.count} investors
                                    </Badge>
                                </div>
                                <p class="text-sm text-muted-foreground mt-1">{list.description}</p>
                                <div class="text-xs text-muted-foreground mt-2">
                                    Last updated: {formatDate(list.lastUpdated)}
                                </div>
                                
                                <div class="flex justify-end mt-2">
                                    <Button variant="ghost" size="sm">
                                        <Edit3 class="h-3.5 w-3.5 mr-1" />
                                        <span>Edit List</span>
                                    </Button>
                                </div>
                            </div>
                        {/each}
                        
                        <div class="p-3 border border-dashed rounded-lg flex items-center justify-center">
                            <Button variant="ghost" size="sm">
                                <Plus class="h-4 w-4 mr-2" />
                                Create New Target List
                            </Button>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </TabsContent>

        <!-- Terms Comparison Tab -->
        <TabsContent value="terms" class="space-y-6">
            <!-- Active Term Sheet Comparison -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Term Sheet Comparison</Card.Title>
                    <Card.Description>Side-by-side comparison of investment offers</Card.Description>
                </Card.Header>
                <Card.Content>
                    {#if data.fundraising.terms.activeComparisons.length > 0}
                        <div class="mb-3 pb-3 border-b">
                            <div class="font-medium">{data.fundraising.terms.activeComparisons[0].name}</div>
                            <div class="text-sm text-muted-foreground">Created on {formatDate(data.fundraising.terms.activeComparisons[0].createdAt)}</div>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Head class="w-[180px]">Term</Table.Head>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Head>{offer.investor}</Table.Head>
                                        {/each}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Valuation</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{formatCurrency(offer.valuation)}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Investment Amount</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{formatCurrency(offer.amount)}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Equity %</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{formatPercentage(offer.equity)}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Pro-Rata Rights</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{offer.proRata ? 'Yes' : 'No'}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Board Seat</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{offer.boardSeat ? 'Yes' : 'No'}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Liquidation Preference</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{offer.liquidationPreference}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Participation Cap</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{offer.participationCap}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell class="font-medium">Valid Until</Table.Cell>
                                        {#each data.fundraising.terms.activeComparisons[0].offers as offer}
                                            <Table.Cell>{formatDate(offer.offerValidUntil)}</Table.Cell>
                                        {/each}
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </div>
                        
                        <div class="flex justify-end mt-4">
                            <Button variant="outline" size="sm" class="gap-2">
                                <Share2 class="h-4 w-4" />
                                <span>Share Comparison</span>
                            </Button>
                        </div>
                    {:else}
                        <div class="text-center py-6">
                            <p class="text-muted-foreground">No active term sheet comparisons</p>
                            <Button variant="outline" size="sm" class="mt-4">
                                <Plus class="h-4 w-4 mr-2" />
                                Create Term Sheet Comparison
                            </Button>
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
            
            <!-- Cap Table & Valuation Tools -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Cap Table Scenarios -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Cap Table Scenarios</Card.Title>
                        <Card.Description>Ownership structure and dilution modeling</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-6">
                            {#each data.fundraising.terms.capTableScenarios.slice(0, 1) as scenario}
                                <div>
                                    <div class="mb-2 flex justify-between items-center">
                                        <h3 class="font-medium">{scenario.name}</h3>
                                        <div class="text-sm text-muted-foreground">
                                            {formatNumber(scenario.totalShares)} shares
                                        </div>
                                    </div>
                                    
                                    {#each scenario.ownership as owner}
                                        <div class="mb-2">
                                            <div class="flex justify-between text-sm">
                                                <span>{owner.holder}</span>
                                                <span>{formatPercentage(owner.percentage)}</span>
                                            </div>
                                            <div class="h-2 bg-muted/50 rounded-full overflow-hidden mt-1">
                                                <div 
                                                    class="h-full bg-primary/80 rounded-full"
                                                    style:width="{owner.percentage}%"
                                                ></div>
                                            </div>
                                            <div class="text-xs text-muted-foreground mt-0.5 text-right">
                                                {formatNumber(owner.shares)} shares
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                            
                            <div class="grid grid-cols-2 gap-2 mt-2">
                                {#each data.fundraising.terms.capTableScenarios.slice(1) as scenario}
                                    <Button variant="outline" size="sm" class="text-xs justify-start overflow-hidden">
                                        <PieChart class="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                        <span class="truncate">{scenario.name}</span>
                                    </Button>
                                {/each}
                                
                                <Button variant="outline" size="sm" class="text-xs justify-start">
                                    <Plus class="h-3.5 w-3.5 mr-1.5" />
                                    <span>New Scenario</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                
                <!-- Valuation Methods -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Valuation Methods</Card.Title>
                        <Card.Description>Different approaches to company valuation</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.fundraising.terms.valuationMethods as method}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex justify-between items-center">
                                        <h3 class="font-medium">{method.method}</h3>
                                        <span class="font-semibold">{formatCurrency(method.value)}</span>
                                    </div>
                                    <div class="text-sm text-muted-foreground mt-1">
                                        Basis: {method.multiplier}
                                    </div>
                                </div>
                            {/each}
                            
                            <div class="p-4 border border-dashed rounded-lg mt-4">
                                <h3 class="font-medium flex items-center">
                                    <CircleDollarSign class="h-4 w-4 mr-2" />
                                    SAFE/Convertible Note Calculator
                                </h3>
                                <p class="text-sm text-muted-foreground mt-1">
                                    Calculate how convertible instruments will convert in future funding rounds.
                                </p>
                                
                                <div class="grid grid-cols-2 gap-2 mt-3">
                                    {#each data.fundraising.terms.safeNoteCalculations as calculation}
                                        <Button variant="outline" size="sm" class="text-xs justify-start">
                                            <span class="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded mr-1.5">
                                                {calculation.type}
                                            </span>
                                            <span>{formatCurrency(calculation.amount)}</span>
                                        </Button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </TabsContent>

        <!-- Investment Documentation Tab -->
        <TabsContent value="documentation" class="space-y-6">
            <!-- Template Library -->
            <Card.Root>
                <Card.Header>
                    <Card.Title>Template Library</Card.Title>
                    <Card.Description>Standard documents for your fundraising process</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {#each data.fundraising.documentation.templates as template}
                            <div class="p-4 bg-muted/50 rounded-lg flex flex-col h-full">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <FileText class="h-6 w-6 text-primary mb-2" />
                                        <h3 class="font-medium">{template.name}</h3>
                                    </div>
                                    <Badge variant="outline" class="text-xs">
                                        {template.category}
                                    </Badge>
                                </div>
                                <p class="text-sm text-muted-foreground mt-2 flex-grow">
                                    {template.description}
                                </p>
                                <div class="flex justify-between items-center mt-4 pt-2 border-t text-xs text-muted-foreground">
                                    <span>Updated: {formatDate(template.lastUpdated)}</span>
                                    <span>{template.downloads} downloads</span>
                                </div>
                                <Button variant="outline" size="sm" class="mt-3 w-full">
                                    <Download class="h-3.5 w-3.5 mr-1.5" />
                                    <span>Download</span>
                                </Button>
                            </div>
                        {/each}
                    </div>
                    
                    <div class="flex justify-center mt-6">
                        <Button variant="outline">
                            <Upload class="h-4 w-4 mr-2" />
                            <span>Upload Custom Template</span>
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
            
            <!-- Active Documents & Compliance -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Active Documents -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Active Documents</Card.Title>
                        <Card.Description>Documents currently in use for your fundraising</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-4">
                            {#each data.fundraising.documentation.activeDocuments as doc}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div class="font-medium">{doc.name}</div>
                                        <Badge variant="outline" class={getStatusClass(doc.status)}>
                                            {doc.status}
                                        </Badge>
                                    </div>
                                    <div class="flex items-center justify-between mt-1 text-sm">
                                        <div class="flex items-center">
                                            <Badge variant="outline" class="text-xs mr-2">
                                                {doc.category}
                                            </Badge>
                                            <span class="text-muted-foreground">
                                                {doc.versions} {doc.versions === 1 ? 'version' : 'versions'}
                                            </span>
                                        </div>
                                        <span class="text-muted-foreground">
                                            Updated: {formatDate(doc.lastUpdated)}
                                        </span>
                                    </div>
                                    <div class="mt-2 text-sm">
                                        <span class="text-muted-foreground">Shared with: </span>
                                        <span>
                                            {doc.sharedWith.join(', ')}
                                        </span>
                                    </div>
                                    <div class="flex justify-end mt-2">
                                        <Button variant="ghost" size="sm">
                                            <FileText class="h-3.5 w-3.5 mr-1.5" />
                                            <span>View Document</span>
                                        </Button>
                                    </div>
                                </div>
                            {/each}
                            
                            <div class="flex justify-center mt-2">
                                <Button variant="outline" size="sm">
                                    <FilePlus class="h-4 w-4 mr-2" />
                                    <span>New Document</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                
                <!-- Compliance Checklist -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Compliance Checklist</Card.Title>
                        <Card.Description>Required regulatory and legal items</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-3">
                            {#each data.fundraising.documentation.complianceChecklist as item}
                                <div class="p-3 bg-muted/50 rounded-lg">
                                    <div class="flex items-start gap-3">
                                        <div class={`p-1 rounded-full mt-0.5 ${item.status.toLowerCase() === 'completed' ? 'bg-green-500/20' : 'bg-muted'}`}>
                                            <CheckCircle2 class={`h-4 w-4 ${item.status.toLowerCase() === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between">
                                                <div class="font-medium">{item.requirement}</div>
                                                <Badge variant="outline" class={getStatusClass(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <p class="text-sm text-muted-foreground mt-1">
                                                {item.description}
                                            </p>
                                            <div class="text-xs text-muted-foreground mt-2">
                                                Due: {formatDate(item.dueDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                            
                            <div class="flex justify-between items-center mt-4">
                                <div>
                                    <Badge variant="outline" class="bg-green-500/10 text-green-500">
                                        {data.fundraising.documentation.complianceChecklist.filter((item: {status: string}) => item.status.toLowerCase() === 'completed').length} / {data.fundraising.documentation.complianceChecklist.length} completed
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <AlertCircle class="h-3.5 w-3.5 mr-1.5" />
                                    <span>View All Requirements</span>
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </TabsContent>
    </Tabs>
</div> 