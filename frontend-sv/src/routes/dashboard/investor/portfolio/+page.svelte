<script lang="ts">
    import AddInvestmentForm from "$lib/components/investor/AddInvestmentForm.svelte";
    import InvestorNavigation from "$lib/components/investor/InvestorNavigation.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "$lib/components/ui/table";
    import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
    } from "$lib/components/ui/tabs";
    import { portfolioManager } from "@/PortfolioManager.svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";

    // Get server-loaded data
    let { data }: { data: PageData } = $props();

    // Initialize reactive state from server data
    const investments = $state(data.investments);
    const documents = $state(data.documents);
    const metrics = $state(data.metrics);
    const exitPlan = $state(data.exitPlan);
    const riskAssessment = $state(data.riskAssessment);

    // Initialize portfolio manager with server data
    onMount(() => {
        portfolioManager.investments = data.investments;
        portfolioManager.documents = data.documents;
        portfolioManager.metrics = data.metrics;
        portfolioManager.exitPlan = data.exitPlan;
        portfolioManager.riskAssessment = data.riskAssessment;
    });

    // ROI chart data
    const roiChartData = $state({
        labels: investments.map((investment) => investment.company),
        datasets: [
            {
                label: "Initial Investment",
                data: investments.map((investment) => investment.amount),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
            },
            {
                label: "Current Value",
                data: investments.map((investment) => investment.currentValue),
                backgroundColor: "rgba(34, 197, 94, 0.5)",
            },
        ],
    });

    const roiChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) =>
                        `$${(value / 1000).toFixed(0)}k`,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `${context.dataset.label}: $${(context.raw / 1000).toFixed(0)}k`,
                },
            },
        },
    };

    // Risk allocation chart
    const riskChartData = $state({
        labels: ["High Risk", "Medium Risk", "Low Risk"],
        datasets: [
            {
                data: [
                    riskAssessment.highRiskAllocation,
                    riskAssessment.mediumRiskAllocation,
                    riskAssessment.lowRiskAllocation,
                ],
                backgroundColor: [
                    "rgba(239, 68, 68, 0.7)",
                    "rgba(251, 191, 36, 0.7)",
                    "rgba(34, 197, 94, 0.7)",
                ],
            },
        ],
    });

    // Diversification chart
    const diversificationChartData = $state({
        labels: Object.keys(riskAssessment.sectorDiversification),
        datasets: [
            {
                data: Object.values(riskAssessment.sectorDiversification),
                backgroundColor: [
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(168, 85, 247, 0.7)",
                    "rgba(236, 72, 153, 0.7)",
                    "rgba(34, 197, 94, 0.7)",
                    "rgba(251, 191, 36, 0.7)",
                ],
            },
        ],
    });

    const doughnutChartOptions = {
        plugins: {
            legend: {
                position: "right" as const,
            },
        },
        cutout: "60%",
    };

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function formatPercentage(value: number): string {
        return `${value.toFixed(1)}%`;
    }

    function getROIClass(roi: number): string {
        if (roi > 20) return "text-emerald-500";
        if (roi > 0) return "text-emerald-400";
        if (roi === 0) return "text-gray-500";
        return "text-destructive";
    }

    function getRiskClass(risk: string): string {
        switch (risk.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800 border-red-300";
            case "medium":
                return "bg-amber-100 text-amber-800 border-amber-300";
            case "low":
                return "bg-emerald-100 text-emerald-800 border-emerald-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    }

    function getDocumentTypeIcon(type: string): string {
        switch (type.toLowerCase()) {
            case "pdf":
                return "📄";
            case "spreadsheet":
                return "📊";
            case "presentation":
                return "📝";
            case "contract":
                return "📃";
            default:
                return "📁";
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
    >
        <div>
            <h1 class="text-3xl font-bold">Portfolio Management</h1>
            <p class="text-muted-foreground">
                Track and optimize your startup investments
            </p>
        </div>
        <div class="mt-4 md:mt-0">
            <Button>Export Data</Button>
        </div>
    </div>

    <!-- grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 -->
    <div>
        <div class="md:col-span-3 lg:col-span-4">
            <Tabs value="investments" class="w-full">
                <TabsList>
                    <TabsTrigger value="investments">Investments</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
                    <TabsTrigger value="exit">Exit Planning</TabsTrigger>
                    <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                </TabsList>

                <!-- Investment Tracking Tab -->
                <TabsContent value="investments">
                    <Card>
                        <CardHeader
                            class="flex flex-row items-center justify-between"
                        >
                            <div>
                                <CardTitle>Investment Portfolio</CardTitle>
                                <CardDescription>
                                    Track all your startup investments and their
                                    current performance
                                </CardDescription>
                            </div>
                            <AddInvestmentForm />
                        </CardHeader>
                        <CardContent>
                            <div class="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead
                                                >Investment Date</TableHead
                                            >
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Current Value</TableHead>
                                            <TableHead>ROI</TableHead>
                                            <TableHead>Stage</TableHead>
                                            <TableHead>Risk Level</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {#each investments as investment}
                                            <TableRow>
                                                <TableCell class="font-medium"
                                                    >{investment.company}</TableCell
                                                >
                                                <TableCell
                                                    >{investment.date}</TableCell
                                                >
                                                <TableCell
                                                    >{formatCurrency(
                                                        investment.amount,
                                                    )}</TableCell
                                                >
                                                <TableCell
                                                    >{formatCurrency(
                                                        investment.currentValue,
                                                    )}</TableCell
                                                >
                                                <TableCell
                                                    class={getROIClass(
                                                        investment.roi,
                                                    )}
                                                >
                                                    {formatPercentage(
                                                        investment.roi,
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    >{investment.stage}</TableCell
                                                >
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        class={getRiskClass(
                                                            investment.riskLevel,
                                                        )}
                                                    >
                                                        {investment.riskLevel}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        {/each}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <!-- Document Management Tab -->
                <TabsContent value="documents">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Management</CardTitle>
                            <CardDescription>
                                Store and organize important documents related
                                to your investments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {#each documents as document}
                                    <Card>
                                        <CardHeader class="pb-2">
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <div class="flex items-center">
                                                    <span class="text-2xl mr-2"
                                                        >{getDocumentTypeIcon(
                                                            document.type,
                                                        )}</span
                                                    >
                                                    <CardTitle class="text-lg"
                                                        >{document.title}</CardTitle
                                                    >
                                                </div>
                                            </div>
                                            <CardDescription
                                                >{document.company}</CardDescription
                                            >
                                        </CardHeader>
                                        <CardContent class="pb-2">
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {document.description}
                                            </p>
                                        </CardContent>
                                        <CardFooter
                                            class="flex justify-between pt-0"
                                        >
                                            <p
                                                class="text-xs text-muted-foreground"
                                            >
                                                Added: {document.dateAdded}
                                            </p>
                                            <Button variant="ghost" size="sm"
                                                >View</Button
                                            >
                                        </CardFooter>
                                    </Card>
                                {/each}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Upload Document</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <!-- ROI Analysis Tab -->
                <TabsContent value="roi">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card class="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Investment Performance</CardTitle>
                                <CardDescription>
                                    Compare initial investments to current
                                    valuations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <!-- <Chart
                                    type="bar"
                                    data={roiChartData}
                                    options={roiChartOptions}
                                    height="300px"
                                    width="100%"
                                    className="bg-emerald-100"
                                /> -->
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                                <CardDescription>
                                    Key portfolio performance indicators
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div class="space-y-6">
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm font-medium"
                                                >Overall ROI</span
                                            >
                                            <span
                                                class={getROIClass(
                                                    metrics.overallROI,
                                                )}
                                                >{formatPercentage(
                                                    metrics.overallROI,
                                                )}</span
                                            >
                                        </div>
                                        <Progress
                                            value={metrics.overallROI > 0
                                                ? metrics.overallROI
                                                : 0}
                                            max={100}
                                        />
                                    </div>

                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm font-medium"
                                                >Best Performer</span
                                            >
                                            <span class="text-emerald-500"
                                                >{formatPercentage(
                                                    metrics.bestPerformerROI,
                                                )}</span
                                            >
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground mb-2"
                                        >
                                            {metrics.bestPerformer}
                                        </div>
                                        <Progress
                                            value={metrics.bestPerformerROI}
                                            max={100}
                                        />
                                    </div>

                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm font-medium"
                                                >Average Annual Return</span
                                            >
                                            <span
                                                class={getROIClass(
                                                    metrics.averageAnnualReturn,
                                                )}
                                                >{formatPercentage(
                                                    metrics.averageAnnualReturn,
                                                )}</span
                                            >
                                        </div>
                                        <Progress
                                            value={metrics.averageAnnualReturn >
                                            0
                                                ? metrics.averageAnnualReturn
                                                : 0}
                                            max={50}
                                        />
                                    </div>

                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm font-medium"
                                                >Portfolio vs Benchmark</span
                                            >
                                            <span
                                                class={getROIClass(
                                                    metrics.benchmarkComparison,
                                                )}
                                                >{formatPercentage(
                                                    metrics.benchmarkComparison,
                                                )}</span
                                            >
                                        </div>
                                        <Progress
                                            value={metrics.benchmarkComparison +
                                                10}
                                            max={20}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <!-- Exit Planning Tab -->
                <TabsContent value="exit">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Exit Strategy Planning</CardTitle>
                                <CardDescription>
                                    Plan and visualize potential exit scenarios
                                    for your investments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div class="space-y-6">
                                    {#each exitPlan.potentialExits as exit}
                                        <div
                                            class="border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div
                                                class="flex justify-between mb-2"
                                            >
                                                <h3 class="font-semibold">
                                                    {exit.company}
                                                </h3>
                                                <Badge
                                                    variant={exit.likelihood ===
                                                    "High"
                                                        ? "default"
                                                        : "outline"}
                                                >
                                                    {exit.likelihood} Likelihood
                                                </Badge>
                                            </div>
                                            <div
                                                class="grid grid-cols-2 gap-4 mb-2"
                                            >
                                                <div>
                                                    <p
                                                        class="text-sm text-muted-foreground"
                                                    >
                                                        Potential Exit Value
                                                    </p>
                                                    <p class="font-medium">
                                                        {formatCurrency(
                                                            exit.potentialValue,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        class="text-sm text-muted-foreground"
                                                    >
                                                        Expected ROI
                                                    </p>
                                                    <p
                                                        class="font-medium text-emerald-500"
                                                    >
                                                        {formatPercentage(
                                                            exit.expectedROI,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        class="text-sm text-muted-foreground"
                                                    >
                                                        Projected Timeline
                                                    </p>
                                                    <p class="font-medium">
                                                        {exit.timeline}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        class="text-sm text-muted-foreground"
                                                    >
                                                        Exit Type
                                                    </p>
                                                    <p class="font-medium">
                                                        {exit.exitType}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <Progress
                                                    value={exit.readiness}
                                                    max={100}
                                                />
                                                <p
                                                    class="text-xs text-muted-foreground mt-1"
                                                >
                                                    Exit readiness: {exit.readiness}%
                                                </p>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Exit Simulations</CardTitle>
                                <CardDescription>
                                    Model different exit scenarios and their
                                    financial impact
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Scenario</TableHead>
                                            <TableHead>Timeline</TableHead>
                                            <TableHead
                                                >Return Multiple</TableHead
                                            >
                                            <TableHead>Probability</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {#each exitPlan.scenarios as scenario}
                                            <TableRow>
                                                <TableCell class="font-medium"
                                                    >{scenario.name}</TableCell
                                                >
                                                <TableCell
                                                    >{scenario.timeline}</TableCell
                                                >
                                                <TableCell
                                                    class="text-emerald-500"
                                                    >{scenario.returnMultiple}x</TableCell
                                                >
                                                <TableCell
                                                    >{scenario.probability}%</TableCell
                                                >
                                            </TableRow>
                                        {/each}
                                    </TableBody>
                                </Table>
                                <div class="mt-4">
                                    <Button variant="outline" class="w-full"
                                        >Run Custom Simulation</Button
                                    >
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <!-- Risk Assessment Tab -->
                <TabsContent value="risk">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Risk Allocation</CardTitle>
                                <CardDescription>
                                    Breakdown of investments by risk level
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <!-- <Chart
                                            type="doughnut"
                                            data={riskChartData}
                                            options={doughnutChartOptions}
                                            height="250px"
                                            width="100%"
                                            className="bg-emerald-100"
                                        /> -->
                                    </div>
                                    <div class="flex flex-col justify-center">
                                        <div class="space-y-4">
                                            <div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="w-4 h-4 bg-red-500 rounded-full mr-2"
                                                    ></div>
                                                    <span class="font-medium"
                                                        >High Risk</span
                                                    >
                                                </div>
                                                <p
                                                    class="text-sm text-muted-foreground pl-6"
                                                >
                                                    {formatPercentage(
                                                        riskAssessment.highRiskAllocation,
                                                    )}% of portfolio
                                                </p>
                                            </div>
                                            <div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="w-4 h-4 bg-amber-500 rounded-full mr-2"
                                                    ></div>
                                                    <span class="font-medium"
                                                        >Medium Risk</span
                                                    >
                                                </div>
                                                <p
                                                    class="text-sm text-muted-foreground pl-6"
                                                >
                                                    {formatPercentage(
                                                        riskAssessment.mediumRiskAllocation,
                                                    )}% of portfolio
                                                </p>
                                            </div>
                                            <div>
                                                <div class="flex items-center">
                                                    <div
                                                        class="w-4 h-4 bg-emerald-500 rounded-full mr-2"
                                                    ></div>
                                                    <span class="font-medium"
                                                        >Low Risk</span
                                                    >
                                                </div>
                                                <p
                                                    class="text-sm text-muted-foreground pl-6"
                                                >
                                                    {formatPercentage(
                                                        riskAssessment.lowRiskAllocation,
                                                    )}% of portfolio
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sector Diversification</CardTitle>
                                <CardDescription>
                                    Portfolio allocation across different
                                    sectors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <!-- <Chart
                                    type="doughnut"
                                    data={diversificationChartData}
                                    options={doughnutChartOptions}
                                    height="250px"
                                    width="100%"
                                    className="bg-emerald-100"
                                /> -->
                                <div class="grid grid-cols-2 gap-2 mt-4">
                                    {#each Object.entries(riskAssessment.sectorDiversification) as [sector, percentage]}
                                        <div
                                            class="flex justify-between items-center border p-2 rounded-md"
                                        >
                                            <span class="text-sm font-medium"
                                                >{sector}</span
                                            >
                                            <span class="text-sm"
                                                >{formatPercentage(
                                                    percentage as number,
                                                )}</span
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </CardContent>
                        </Card>

                        <Card class="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Risk Factors</CardTitle>
                                <CardDescription>
                                    Key risk factors affecting your portfolio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                    {#each riskAssessment.riskFactors as factor}
                                        <Card>
                                            <CardHeader class="pb-2">
                                                <CardTitle class="text-lg"
                                                    >{factor.name}</CardTitle
                                                >
                                            </CardHeader>
                                            <CardContent>
                                                <div
                                                    class="flex items-center justify-between mb-2"
                                                >
                                                    <span
                                                        class="text-sm text-muted-foreground"
                                                        >Impact Level</span
                                                    >
                                                    <Badge
                                                        variant="outline"
                                                        class={getRiskClass(
                                                            factor.impactLevel,
                                                        )}
                                                    >
                                                        {factor.impactLevel}
                                                    </Badge>
                                                </div>
                                                <p class="text-sm mb-4">
                                                    {factor.description}
                                                </p>
                                                <div>
                                                    <span
                                                        class="text-xs text-muted-foreground"
                                                        >Mitigation Strategy</span
                                                    >
                                                    <p class="text-sm">
                                                        {factor.mitigationStrategy}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    {/each}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
</div>
