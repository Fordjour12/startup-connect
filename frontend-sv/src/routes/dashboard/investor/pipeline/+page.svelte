<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import InvestorNavigation from "@/components/investor/InvestorNavigation.svelte";
	import type { PageData } from "./$types";

	// Get server-loaded data
	let { data }: { data: PageData } = $props();

	// Initialize reactive state from server data
	const pipelineStages = $state(data.pipelineStages);
	const pipelineDeals = $state(data.pipelineDeals);
	const dueDiligenceTemplates = $state(data.dueDiligenceTemplates);
	const activeDueDiligence = $state(data.activeDueDiligence);
	const teamMembers = $state(data.teamMembers);
	const externalCollaborators = $state(data.externalCollaborators);
	const sharedDeals = $state(data.sharedDeals);
	const committeeMeetings = $state(data.committeeMeetings);
	const comparisonMetrics = $state(data.comparisonMetrics);
	const dealEvaluations = $state(data.dealEvaluations);

	// Active tab
	let activeTab = $state("pipeline");

	// Get deals by stage
	function getDealsByStage(stage: string) {
		return pipelineDeals.filter((deal) => deal.stage === stage);
	}

	// Get deal by ID
	function getDealById(id: number) {
		return pipelineDeals.find((deal) => deal.id === id);
	}

	// Get team member by ID
	function getTeamMemberById(id: number) {
		return teamMembers.find((member) => member.id === id);
	}

	// Get priority badge class
	function getPriorityClass(priority: string) {
		switch (priority) {
			case "high":
				return "bg-destructive text-destructive-foreground";
			case "medium":
				return "bg-amber-500 text-white";
			case "low":
				return "bg-muted text-muted-foreground";
			default:
				return "bg-secondary text-secondary-foreground";
		}
	}

	// Get active due diligence for a deal
	function getActiveDueDiligenceForDeal(dealId: number) {
		return activeDueDiligence.find((dd) => dd.dealId === dealId);
	}

	// Format currency string
	function formatCurrency(value: string) {
		return value;
	}

	// Format date string
	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}

	// Get material status class
	function getMaterialStatusClass(status: string) {
		switch (status) {
			case "completed":
				return "bg-emerald-500 text-white";
			case "in_progress":
				return "bg-amber-500 text-white";
			case "not_started":
				return "bg-slate-400 text-white";
			default:
				return "bg-secondary text-secondary-foreground";
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold mb-2">Deal Flow Management</h1>
			<p class="text-muted-foreground mb-6">
				Track potential investments through the pipeline, conduct due
				diligence, and prepare for investment decisions
			</p>
		</div>
		<div class="flex space-x-4">
			<Button>
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
					class="mr-2"
					><line x1="12" x2="12" y1="5" y2="19" /><line
						x1="5"
						x2="19"
						y1="12"
						y2="12"
					/></svg
				>
				Add New Deal
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
		<div class="md:col-span-1">
			<div class="bg-card rounded-lg shadow p-4">
				<InvestorNavigation />
			</div>
		</div>

		<div class="md:col-span-3 lg:col-span-4">
			<Tabs
				value={activeTab}
				onValueChange={(value) => (activeTab = value)}
				class="w-full"
			>
				<TabsList class="grid grid-cols-5 w-full mb-4">
					<TabsTrigger value="pipeline">Pipeline</TabsTrigger>
					<TabsTrigger value="due-diligence"
						>Due Diligence</TabsTrigger
					>
					<TabsTrigger value="collaboration"
						>Collaboration</TabsTrigger
					>
					<TabsTrigger value="comparison">Deal Comparison</TabsTrigger
					>
					<TabsTrigger value="committee">Committee</TabsTrigger>
				</TabsList>

				<!-- Pipeline Tab - Kanban-style visualization -->
				<TabsContent value="pipeline" class="space-y-4">
					<div class="grid grid-cols-5 gap-4 overflow-x-auto">
						{#each pipelineStages as stage}
							<div class="min-w-[280px]">
								<div class="flex items-center mb-2">
									<div
										class={`w-3 h-3 rounded-full ${stage.color} mr-2`}
									></div>
									<h3 class="font-medium text-sm">
										{stage.name}
									</h3>
									<span
										class="text-xs text-muted-foreground ml-2"
									>
										({getDealsByStage(stage.id).length})
									</span>
								</div>
								<div class="space-y-3 min-h-[500px]">
									{#each getDealsByStage(stage.id) as deal}
										<Card
											class="cursor-pointer hover:shadow-md transition-shadow"
										>
											<CardHeader class="p-3 pb-0">
												<div
													class="flex justify-between items-start mb-1"
												>
													<div
														class="flex items-center gap-2"
													>
														<img
															src={deal.logo}
															alt={deal.name}
															class="w-8 h-8 rounded-full"
														/>
														<div>
															<h4
																class="font-semibold text-sm"
															>
																{deal.name}
															</h4>
															<p
																class="text-xs text-muted-foreground"
															>
																{deal.industry}
															</p>
														</div>
													</div>
													<Badge
														class={getPriorityClass(
															deal.priority,
														)}
													>
														{deal.priority}
													</Badge>
												</div>
											</CardHeader>
											<CardContent class="p-3 pt-1">
												<div
													class="grid grid-cols-2 gap-1 mt-2 text-xs"
												>
													<div>
														<p
															class="text-muted-foreground"
														>
															Valuation
														</p>
														<p class="font-medium">
															{formatCurrency(
																deal.valuation,
															)}
														</p>
													</div>
													<div>
														<p
															class="text-muted-foreground"
														>
															Raising
														</p>
														<p class="font-medium">
															{formatCurrency(
																deal.targetAmount,
															)}
														</p>
													</div>
													<div>
														<p
															class="text-muted-foreground"
														>
															Assignee
														</p>
														<p class="font-medium">
															{deal.assignee}
														</p>
													</div>
													<div>
														<p
															class="text-muted-foreground"
														>
															Last Activity
														</p>
														<p class="font-medium">
															{formatDate(
																deal.lastActivity,
															)}
														</p>
													</div>
												</div>

												<div
													class="flex flex-wrap gap-1 mt-2"
												>
													{#each deal.tags as tag}
														<span
															class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
														>
															{tag}
														</span>
													{/each}
												</div>

												{#if stage.id === "due_diligence"}
													{@const ddProcess =
														getActiveDueDiligenceForDeal(
															deal.id,
														)}
													{#if ddProcess}
														<div class="mt-2">
															<div
																class="flex items-center justify-between mb-1"
															>
																<span
																	class="text-xs"
																	>{ddProcess.completedItems}/{ddProcess.totalItems}
																	tasks</span
																>
																<span
																	class="text-xs"
																	>{ddProcess.progress}%</span
																>
															</div>
															<Progress
																value={ddProcess.progress}
																class="h-1"
															/>
														</div>
													{/if}
												{/if}
											</CardContent>
											<CardFooter
												class="p-3 pt-0 flex justify-between"
											>
												<Button
													variant="ghost"
													size="sm"
													class="text-xs"
													>Details</Button
												>
												<Button
													variant="outline"
													size="sm"
													class="text-xs"
													>Actions</Button
												>
											</CardFooter>
										</Card>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</TabsContent>

				<!-- Due Diligence Tab - Workflow and Checklists -->
				<TabsContent value="due-diligence" class="space-y-6">
					<!-- Active Due Diligence Processes -->
					<div>
						<h3 class="text-xl font-semibold mb-4">
							Active Due Diligence
						</h3>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{#each activeDueDiligence as process}
								{@const deal = getDealById(process.dealId)}
								{@const template = dueDiligenceTemplates.find(
									(t) => t.id === process.templateId,
								)}
								{#if deal && template}
									<Card>
										<CardHeader class="pb-2">
											<div
												class="flex justify-between items-start"
											>
												<div
													class="flex items-center gap-2"
												>
													<img
														src={deal.logo}
														alt={deal.name}
														class="w-10 h-10 rounded-full"
													/>
													<div>
														<CardTitle
															class="text-base"
															>{deal.name}</CardTitle
														>
														<CardDescription
															class="text-sm"
														>
															{template.name}
														</CardDescription>
													</div>
												</div>
												<Badge
													variant={process.progress <
													50
														? "outline"
														: process.progress < 80
															? "secondary"
															: "default"}
												>
													{process.progress}% Complete
												</Badge>
											</div>
										</CardHeader>
										<CardContent class="pb-2">
											<div class="mb-3">
												<div
													class="flex justify-between text-sm mb-1"
												>
													<span
														>{process.completedItems}
														of {process.totalItems} items
														completed</span
													>
													<span
														>{formatDate(
															process.targetDate,
														)}</span
													>
												</div>
												<Progress
													value={process.progress}
													class="h-2"
												/>
											</div>

											<div class="text-sm">
												<div class="font-medium mb-1">
													Team
												</div>
												<div
													class="flex flex-wrap gap-1"
												>
													{#each process.team as memberName}
														<Badge variant="outline"
															>{memberName}</Badge
														>
													{/each}
												</div>
											</div>

											{#if process.notes}
												<div class="mt-3 text-sm">
													<div
														class="font-medium mb-1"
													>
														Notes
													</div>
													<p
														class="text-muted-foreground"
													>
														{process.notes}
													</p>
												</div>
											{/if}
										</CardContent>
										<CardFooter>
											<div
												class="flex justify-between w-full"
											>
												<Button
													variant="outline"
													size="sm"
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
														class="mr-2"
														><path
															d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
														></path><polyline
															points="14 2 14 8 20 8"
														></polyline></svg
													>
													View Documents
												</Button>
												<Button size="sm">
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
														class="mr-2"
														><path
															d="m9 11-6 6v3h9l3-3"
														></path><path
															d="m22 12-4.2 4.2-3-3L18 10l4 2z"
														></path></svg
													>
													Update Progress
												</Button>
											</div>
										</CardFooter>
									</Card>
								{/if}
							{/each}

							{#if activeDueDiligence.length === 0}
								<Card class="col-span-full">
									<CardContent class="p-8 text-center">
										<p class="text-muted-foreground mb-4">
											No active due diligence processes
										</p>
										<Button>Start New Due Diligence</Button>
									</CardContent>
								</Card>
							{/if}
						</div>
					</div>

					<!-- Due Diligence Templates -->
					<div>
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-xl font-semibold">
								Due Diligence Templates
							</h3>
							<Button variant="outline" size="sm">
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
									class="mr-2"
									><line x1="12" x2="12" y1="5" y2="19"
									></line><line x1="5" x2="19" y1="12" y2="12"
									></line></svg
								>
								Create Template
							</Button>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							{#each dueDiligenceTemplates as template}
								<Card>
									<CardHeader>
										<CardTitle class="text-lg"
											>{template.name}</CardTitle
										>
										<CardDescription>
											{template.categories.reduce(
												(count, category) =>
													count +
													category.items.length,
												0,
											)} checklist items
										</CardDescription>
									</CardHeader>
									<CardContent class="pb-2">
										<div class="space-y-2">
											{#each template.categories as category}
												<div>
													<p
														class="text-sm font-medium"
													>
														{category.name}
													</p>
													<p
														class="text-xs text-muted-foreground"
													>
														{category.items.length} items
													</p>
												</div>
											{/each}
										</div>
									</CardContent>
									<CardFooter>
										<Button
											variant="secondary"
											size="sm"
											class="w-full">Use Template</Button
										>
									</CardFooter>
								</Card>
							{/each}
						</div>
					</div>

					<!-- Template Preview - Just showing the first template as an example -->
					{#if dueDiligenceTemplates.length > 0}
						<div>
							<h3 class="text-xl font-semibold mb-4">
								Template Preview: {dueDiligenceTemplates[0]
									.name}
							</h3>

							<div class="space-y-6">
								{#each dueDiligenceTemplates[0].categories as category}
									<Card>
										<CardHeader class="pb-2">
											<CardTitle class="text-base"
												>{category.name}</CardTitle
											>
										</CardHeader>
										<CardContent>
											<div class="space-y-2">
												{#each category.items as item}
													<div
														class="flex items-center gap-2 p-2 rounded hover:bg-muted"
													>
														<div
															class="h-5 w-5 rounded border flex items-center justify-center"
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
																class="hidden"
																><polyline
																	points="20 6 9 17 4 12"

																></polyline></svg
															>
														</div>
														<div class="flex-grow">
															<p class="text-sm">
																{item.name}
															</p>
														</div>
														{#if item.required}
															<Badge
																variant="outline"
																class="text-xs"
																>Required</Badge
															>
														{/if}
													</div>
												{/each}
											</div>
										</CardContent>
									</Card>
								{/each}
							</div>
						</div>
					{/if}
				</TabsContent>

				<!-- Collaboration Tab - Team Coordination and Sharing -->
				<TabsContent value="collaboration" class="space-y-6">
					<!-- Team Members -->
					<div>
						<h3 class="text-xl font-semibold mb-4">Team Members</h3>
						<div
							class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
						>
							{#each teamMembers as member}
								<Card>
									<CardContent class="p-4">
										<div class="flex items-center gap-3">
											<img
												src={member.avatar}
												alt={member.name}
												class="w-10 h-10 rounded-full"
											/>
											<div>
												<p class="font-medium text-sm">
													{member.name}
												</p>
												<p
													class="text-xs text-muted-foreground"
												>
													{member.role}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							{/each}
						</div>
					</div>

					<!-- External Collaborators -->
					<div>
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-xl font-semibold">
								External Collaborators
							</h3>
							<Button variant="outline" size="sm">
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
									class="mr-2"
									><line x1="12" x2="12" y1="5" y2="19"
									></line><line x1="5" x2="19" y1="12" y2="12"
									></line></svg
								>
								Add Collaborator
							</Button>
						</div>

						<Card>
							<CardContent class="p-0">
								<div class="overflow-x-auto">
									<table class="w-full">
										<thead>
											<tr class="border-b">
												<th
													class="text-left p-3 font-medium text-sm"
													>Name</th
												>
												<th
													class="text-left p-3 font-medium text-sm"
													>Type</th
												>
												<th
													class="text-left p-3 font-medium text-sm"
													>Contact</th
												>
												<th
													class="text-left p-3 font-medium text-sm"
													>Email</th
												>
												<th
													class="text-left p-3 font-medium text-sm"
													>Actions</th
												>
											</tr>
										</thead>
										<tbody>
											{#each externalCollaborators as collaborator}
												<tr
													class="border-b hover:bg-muted/50"
												>
													<td class="p-3 text-sm"
														>{collaborator.name}</td
													>
													<td class="p-3 text-sm"
														>{collaborator.type}</td
													>
													<td class="p-3 text-sm"
														>{collaborator.contactName}</td
													>
													<td class="p-3 text-sm"
														>{collaborator.email}</td
													>
													<td class="p-3 text-sm">
														<Button
															variant="ghost"
															size="sm"
															>Share</Button
														>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					<!-- Shared Deals -->
					<div>
						<h3 class="text-xl font-semibold mb-4">Shared Deals</h3>

						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{#each sharedDeals as sharedDeal}
								{@const deal = getDealById(sharedDeal.dealId)}
								{#if deal}
									<Card>
										<CardHeader class="pb-2">
											<div
												class="flex justify-between items-start"
											>
												<div
													class="flex items-center gap-2"
												>
													<img
														src={deal.logo}
														alt={deal.name}
														class="w-10 h-10 rounded-full"
													/>
													<div>
														<CardTitle
															class="text-base"
															>{deal.name}</CardTitle
														>
														<CardDescription
															class="text-sm"
														>
															{deal.industry}
														</CardDescription>
													</div>
												</div>
											</div>
										</CardHeader>
										<CardContent class="pb-2">
											<div class="mb-3 text-sm">
												<p
													class="text-muted-foreground"
												>
													{sharedDeal.notes}
												</p>
											</div>

											<div>
												<p
													class="text-sm font-medium mb-2"
												>
													Shared With
												</p>
												{#each sharedDeal.sharedWith as share}
													<div
														class="flex justify-between items-center py-1 border-b text-sm"
													>
														<span>{share.name}</span
														>
														<div
															class="flex items-center gap-2"
														>
															<Badge
																variant={share.access ===
																"full"
																	? "default"
																	: "secondary"}
															>
																{share.access ===
																"full"
																	? "Full Access"
																	: "View Only"}
															</Badge>
															<span
																class="text-xs text-muted-foreground"
																>{share.sharedOn}</span
															>
														</div>
													</div>
												{/each}
											</div>
										</CardContent>
										<CardFooter>
											<div
												class="flex justify-between w-full"
											>
												<Button
													variant="outline"
													size="sm"
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
														class="mr-2"
														><path
															d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
														></path><polyline
															points="16 6 12 2 8 6"
														></polyline><line
															x1="12"
															x2="12"
															y1="2"
															y2="15"
														></line></svg
													>
													Share With More
												</Button>
												<Button
													variant="ghost"
													size="sm"
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
														class="mr-2"
														><path
															d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
														></path><path
															d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
														></path></svg
													>
													Manage Access
												</Button>
											</div>
										</CardFooter>
									</Card>
								{/if}
							{/each}

							{#if sharedDeals.length === 0}
								<Card class="col-span-full">
									<CardContent class="p-8 text-center">
										<p class="text-muted-foreground mb-4">
											No shared deals
										</p>
										<Button>Share a Deal</Button>
									</CardContent>
								</Card>
							{/if}
						</div>
					</div>
				</TabsContent>

				<!-- Comparison Tab - Evaluating multiple opportunities -->
				<TabsContent value="comparison" class="space-y-6">
					<!-- Deal Comparison -->
					<div>
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-xl font-semibold">
								Deal Comparison
							</h3>
							<Button variant="outline" size="sm">
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
									class="mr-2"
									><line x1="12" x2="12" y1="5" y2="19"
									></line><line x1="5" x2="19" y1="12" y2="12"
									></line></svg
								>
								New Comparison
							</Button>
						</div>

						<Card>
							<CardContent class="p-0">
								<div class="overflow-x-auto">
									<table class="w-full">
										<thead>
											<tr class="border-b">
												<th
													class="text-left p-4 font-medium text-sm"
													>Metrics</th
												>
												{#each dealEvaluations as evaluation}
													{@const deal = getDealById(
														evaluation.dealId,
													)}
													{#if deal}
														<th
															class="text-left p-4 font-medium text-sm"
														>
															<div
																class="flex items-center gap-2"
															>
																<img
																	src={deal.logo}
																	alt={deal.name}
																	class="w-6 h-6 rounded-full"
																/>
																{deal.name}
															</div>
														</th>
													{/if}
												{/each}
											</tr>
										</thead>
										<tbody>
											{#each comparisonMetrics as metric}
												<tr
													class="border-b hover:bg-muted/50"
												>
													<td class="p-4">
														<div
															class="font-medium text-sm"
														>
															{metric.name}
														</div>
														<div
															class="text-xs text-muted-foreground"
														>
															{metric.description}
														</div>
													</td>
													{#each dealEvaluations as evaluation}
														<td class="p-4 text-sm">
															{#if evaluation.metrics[metric.id]}
																{evaluation
																	.metrics[
																	metric.id
																]}
															{:else}
																<span
																	class="text-muted-foreground"
																	>-</span
																>
															{/if}
														</td>
													{/each}
												</tr>
											{/each}
											<!-- Strengths row -->
											<tr
												class="border-b hover:bg-muted/50"
											>
												<td class="p-4">
													<div
														class="font-medium text-sm"
													>
														Strengths
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Key strengths of the
														opportunity
													</div>
												</td>
												{#each dealEvaluations as evaluation}
													<td class="p-4">
														<ul
															class="list-disc list-inside text-sm space-y-1"
														>
															{#each evaluation.strengths as strength}
																<li>
																	{strength}
																</li>
															{/each}
														</ul>
													</td>
												{/each}
											</tr>
											<!-- Weaknesses row -->
											<tr
												class="border-b hover:bg-muted/50"
											>
												<td class="p-4">
													<div
														class="font-medium text-sm"
													>
														Weaknesses
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Key concerns with the
														opportunity
													</div>
												</td>
												{#each dealEvaluations as evaluation}
													<td class="p-4">
														<ul
															class="list-disc list-inside text-sm space-y-1"
														>
															{#each evaluation.weaknesses as weakness}
																<li>
																	{weakness}
																</li>
															{/each}
														</ul>
													</td>
												{/each}
											</tr>
										</tbody>
									</table>
								</div>
							</CardContent>
							<CardFooter class="border-t p-4">
								<div class="flex justify-end gap-2">
									<Button variant="outline" size="sm">
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
											class="mr-2"
											><path
												d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
											></path><polyline
												points="7 10 12 15 17 10"
											></polyline><line
												x1="12"
												x2="12"
												y1="15"
												y2="3"
											></line></svg
										>
										Export Comparison
									</Button>
									<Button size="sm">Generate Report</Button>
								</div>
							</CardFooter>
						</Card>
					</div>
				</TabsContent>

				<!-- Committee Tab - Investment Committee Materials -->
				<TabsContent value="committee" class="space-y-6">
					<!-- Upcoming Committee Meetings -->
					<div>
						<h3 class="text-xl font-semibold mb-4">
							Investment Committee Meetings
						</h3>

						<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{#each committeeMeetings as meeting}
								<Card>
									<CardHeader class="pb-2">
										<div
											class="flex justify-between items-start"
										>
											<CardTitle class="text-base">
												{meeting.date} • {meeting.time}
											</CardTitle>
											<Badge
												variant={meeting.status ===
												"scheduled"
													? "default"
													: "outline"}
											>
												{meeting.status === "scheduled"
													? "Scheduled"
													: "Planned"}
											</Badge>
										</div>
										<CardDescription>
											{meeting.location}
										</CardDescription>
									</CardHeader>
									<CardContent class="pb-2">
										<div class="mb-4">
											<p class="text-sm font-medium mb-2">
												Deals to Discuss
											</p>
											<div class="space-y-2">
												{#each meeting.deals as dealId}
													{@const deal =
														getDealById(dealId)}
													{#if deal}
														<div
															class="flex items-center gap-2 py-1 border-b"
														>
															<img
																src={deal.logo}
																alt={deal.name}
																class="w-6 h-6 rounded-full"
															/>
															<div
																class="text-sm"
															>
																{deal.name}
															</div>
															<div
																class="text-xs text-muted-foreground"
															>
																{deal.industry}
															</div>
														</div>
													{/if}
												{/each}
											</div>
										</div>

										<div>
											<p class="text-sm font-medium mb-2">
												Required Materials
											</p>
											<div class="space-y-2">
												{#each meeting.materials as material}
													{@const deal = getDealById(
														material.dealId,
													)}
													{@const assignee =
														getTeamMemberById(
															material.assignee,
														)}
													{#if deal && assignee}
														<div
															class="flex justify-between items-center py-1 border-b"
														>
															<div
																class="flex items-center gap-2"
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
																	><path
																		d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"

																	></path><polyline
																		points="14 2 14 8 20 8"

																	></polyline></svg
																>
																<div>
																	<div
																		class="text-sm"
																	>
																		{material.type}
																	</div>
																	<div
																		class="text-xs text-muted-foreground"
																	>
																		{deal.name}
																	</div>
																</div>
															</div>
															<div
																class="flex items-center gap-2"
															>
																<div
																	class="text-xs"
																>
																	{assignee.name}
																</div>
																<Badge
																	class={getMaterialStatusClass(
																		material.status,
																	)}
																>
																	{material.status ===
																	"completed"
																		? "Completed"
																		: material.status ===
																			  "in_progress"
																			? "In Progress"
																			: "Not Started"}
																</Badge>
															</div>
														</div>
													{/if}
												{/each}
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<div
											class="flex justify-between w-full"
										>
											<Button variant="outline" size="sm">
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
													class="mr-2"
													><rect
														width="18"
														height="18"
														x="3"
														y="4"
														rx="2"
														ry="2"
													></rect><line
														x1="16"
														x2="16"
														y1="2"
														y2="6"
													></line><line
														x1="8"
														x2="8"
														y1="2"
														y2="6"
													></line><line
														x1="3"
														x2="21"
														y1="10"
														y2="10"
													></line></svg
												>
												Add to Calendar
											</Button>
											<Button size="sm">
												Prepare Materials
											</Button>
										</div>
									</CardFooter>
								</Card>
							{/each}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
</div>
