<script lang="ts">
	import { onMount } from "svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { DUE_DILIGENCE_STATUS, PIPELINE_STAGES } from "$lib/db/schema";

	let dueDiligenceProjects = $state([]);
	let isLoading = $state(true);
	let searchQuery = $state("");
	let statusFilter = $state("all");
	let priorityFilter = $state("all");
	let showCreateDialog = $state(false);
	let selectedProject = $state(null);
	let showProjectDetails = $state(false);

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			dueDiligenceProjects = [
				{
					id: "dd-1",
					startupName: "EduTech Platform",
					startupId: "startup-1",
					assignedTo: "user-2", // Sarah Johnson
					assigneeName: "Sarah Johnson",
					status: DUE_DILIGENCE_STATUS.IN_PROGRESS,
					priority: "high",
					startDate: "2024-12-10T00:00:00Z",
					dueDate: "2024-12-24T00:00:00Z",
					completedDate: null,
					recommendation: null,
					confidence: null,
					summary: null,
					checklist: {
						financials: {
							completed: true,
							notes: "Financials look strong",
							documents: ["fin_report.pdf"],
						},
						market: {
							completed: true,
							notes: "Market opportunity validated",
							documents: ["market_analysis.pdf"],
						},
						team: {
							completed: false,
							notes: "Need to verify team background",
							documents: [],
						},
						technology: {
							completed: true,
							notes: "Tech stack is solid",
							documents: ["tech_due_diligence.pdf"],
						},
						legal: {
							completed: false,
							notes: "IP review pending",
							documents: [],
						},
						competitive: {
							completed: true,
							notes: "Competitive advantage clear",
							documents: ["competitor_analysis.pdf"],
						},
					},
					progress: 67, // Percentage
				},
				{
					id: "dd-2",
					startupName: "Logistics AI",
					startupId: "startup-2",
					assignedTo: "user-3", // Mike Chen
					assigneeName: "Mike Chen",
					status: DUE_DILIGENCE_STATUS.PENDING,
					priority: "medium",
					startDate: null,
					dueDate: null,
					completedDate: null,
					recommendation: null,
					confidence: null,
					summary: null,
					checklist: {
						financials: {
							completed: false,
							notes: "",
							documents: [],
						},
						market: { completed: false, notes: "", documents: [] },
						team: { completed: false, notes: "", documents: [] },
						technology: {
							completed: false,
							notes: "",
							documents: [],
						},
						legal: { completed: false, notes: "", documents: [] },
						competitive: {
							completed: false,
							notes: "",
							documents: [],
						},
					},
					progress: 0,
				},
				{
					id: "dd-3",
					startupName: "Retail Analytics",
					startupId: "startup-3",
					assignedTo: "user-4", // Emily Rodriguez
					assigneeName: "Emily Rodriguez",
					status: DUE_DILIGENCE_STATUS.COMPLETED,
					priority: "high",
					startDate: "2024-11-15T00:00:00Z",
					dueDate: "2024-12-01T00:00:00Z",
					completedDate: "2024-11-28T00:00:00Z",
					recommendation: "invest",
					confidence: "high",
					summary:
						"Strong fundamentals with clear market opportunity. Recommended for investment.",
					checklist: {
						financials: {
							completed: true,
							notes: "Revenue growing 40% YoY",
							documents: ["financials.pdf"],
						},
						market: {
							completed: true,
							notes: "Market size: $50B by 2027",
							documents: ["market_report.pdf"],
						},
						team: {
							completed: true,
							notes: "Experienced founding team",
							documents: ["team_background.pdf"],
						},
						technology: {
							completed: true,
							notes: "Proprietary ML algorithms",
							documents: ["tech_review.pdf"],
						},
						legal: {
							completed: true,
							notes: "All IP secured",
							documents: ["legal_review.pdf"],
						},
						competitive: {
							completed: true,
							notes: "First mover advantage",
							documents: ["competitive_analysis.pdf"],
						},
					},
					progress: 100,
				},
			];
		} catch (error) {
			console.error("Error loading due diligence projects:", error);
		} finally {
			isLoading = false;
		}
	});

	let newProject = $state({
		startupName: "",
		startupId: "",
		assignedTo: "",
		priority: "medium",
		dueDate: "",
	});

	let teamMembers = [
		{ id: "user-1", name: "John Doe" },
		{ id: "user-2", name: "Sarah Johnson" },
		{ id: "user-3", name: "Mike Chen" },
		{ id: "user-4", name: "Emily Rodriguez" },
	];

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			[DUE_DILIGENCE_STATUS.PENDING]: "bg-gray-100 text-gray-800",
			[DUE_DILIGENCE_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
			[DUE_DILIGENCE_STATUS.COMPLETED]: "bg-green-100 text-green-800",
			[DUE_DILIGENCE_STATUS.APPROVED]: "bg-purple-100 text-purple-800",
			[DUE_DILIGENCE_STATUS.REJECTED]: "bg-red-100 text-red-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	function getRecommendationColor(recommendation: string): string {
		switch (recommendation) {
			case "invest":
				return "text-green-600";
			case "pass":
				return "text-red-600";
			case "follow_up":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	}

	function calculateProgress(checklist: any): number {
		const items = Object.values(checklist);
		const completed = items.filter((item: any) => item.completed).length;
		return Math.round((completed / items.length) * 100);
	}

	function createProject() {
		if (!newProject.startupName || !newProject.assignedTo) {
			alert("Please fill in required fields");
			return;
		}

		// Create new project (in real app, this would be an API call)
		const project = {
			id: `dd-${Date.now()}`,
			startupName: newProject.startupName,
			startupId: `startup-${Date.now()}`,
			assignedTo: newProject.assignedTo,
			assigneeName:
				teamMembers.find((m) => m.id === newProject.assignedTo)?.name ||
				"",
			status: DUE_DILIGENCE_STATUS.PENDING,
			priority: newProject.priority,
			startDate: null,
			dueDate: newProject.dueDate || null,
			completedDate: null,
			recommendation: null,
			confidence: null,
			summary: null,
			checklist: {
				financials: { completed: false, notes: "", documents: [] },
				market: { completed: false, notes: "", documents: [] },
				team: { completed: false, notes: "", documents: [] },
				technology: { completed: false, notes: "", documents: [] },
				legal: { completed: false, notes: "", documents: [] },
				competitive: { completed: false, notes: "", documents: [] },
			},
			progress: 0,
		};

		dueDiligenceProjects = [...dueDiligenceProjects, project];

		// Reset form
		newProject = {
			startupName: "",
			startupId: "",
			assignedTo: "",
			priority: "medium",
			dueDate: "",
		};

		showCreateDialog = false;
	}

	function updateChecklistItem(
		projectId: string,
		itemKey: string,
		completed: boolean,
		notes: string,
	) {
		dueDiligenceProjects = dueDiligenceProjects.map((project) => {
			if (project.id === projectId) {
				return {
					...project,
					checklist: {
						...project.checklist,
						[itemKey]: {
							...project.checklist[itemKey],
							completed,
							notes,
						},
					},
				};
			}
			return project;
		});
	}

	function startProject(projectId: string) {
		dueDiligenceProjects = dueDiligenceProjects.map((project) => {
			if (
				project.id === projectId &&
				project.status === DUE_DILIGENCE_STATUS.PENDING
			) {
				return {
					...project,
					status: DUE_DILIGENCE_STATUS.IN_PROGRESS,
					startDate: new Date().toISOString(),
				};
			}
			return project;
		});
	}

	function completeProject(
		projectId: string,
		recommendation: string,
		confidence: string,
		summary: string,
	) {
		dueDiligenceProjects = dueDiligenceProjects.map((project) => {
			if (project.id === projectId) {
				return {
					...project,
					status: DUE_DILIGENCE_STATUS.COMPLETED,
					completedDate: new Date().toISOString(),
					recommendation,
					confidence,
					summary,
					progress: 100,
				};
			}
			return project;
		});
	}

	function viewProjectDetails(project: any) {
		selectedProject = project;
		showProjectDetails = true;
	}

	$: filteredProjects = dueDiligenceProjects.filter(
		(project) =>
			(statusFilter === "all" || project.status === statusFilter) &&
			(priorityFilter === "all" || project.priority === priorityFilter) &&
			(project.startupName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
				project.assigneeName
					.toLowerCase()
					.includes(searchQuery.toLowerCase())),
	);

	$: pendingProjects = dueDiligenceProjects.filter(
		(p) => p.status === DUE_DILIGENCE_STATUS.PENDING,
	).length;
	$: inProgressProjects = dueDiligenceProjects.filter(
		(p) => p.status === DUE_DILIGENCE_STATUS.IN_PROGRESS,
	).length;
	$: completedProjects = dueDiligenceProjects.filter(
		(p) => p.status === DUE_DILIGENCE_STATUS.COMPLETED,
	).length;
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Due Diligence</h1>
			<p class="text-muted-foreground">
				Manage and track due diligence projects for potential
				investments
			</p>
		</div>
		<div class="flex space-x-3">
			<Input
				bind:value={searchQuery}
				placeholder="Search projects..."
				class="w-64"
			/>
			<Select
				bind:value={statusFilter}
				options={[
					{ value: "all", label: "All Status" },
					{ value: DUE_DILIGENCE_STATUS.PENDING, label: "Pending" },
					{
						value: DUE_DILIGENCE_STATUS.IN_PROGRESS,
						label: "In Progress",
					},
					{
						value: DUE_DILIGENCE_STATUS.COMPLETED,
						label: "Completed",
					},
				]}
				class="w-40"
			/>
			<Dialog bind:open={showCreateDialog}>
				<DialogTrigger asChild>
					<Button>
						<svg
							class="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New Project
					</Button>
				</DialogTrigger>
				<DialogContent class="max-w-md">
					<DialogHeader>
						<DialogTitle>Create Due Diligence Project</DialogTitle>
					</DialogHeader>
					<div class="space-y-4">
						<div>
							<label
								for="startup-name"
								class="block text-sm font-medium mb-2"
							>
								Startup Name *
							</label>
							<Input
								id="startup-name"
								bind:value={newProject.startupName}
								placeholder="e.g., TechFlow Inc."
							/>
						</div>

						<div>
							<label
								for="assigned-to"
								class="block text-sm font-medium mb-2"
							>
								Assign To *
							</label>
							<Select
								id="assigned-to"
								bind:value={newProject.assignedTo}
								options={teamMembers.map((member) => ({
									value: member.id,
									label: member.name,
								}))}
								placeholder="Select team member"
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="priority"
									class="block text-sm font-medium mb-2"
								>
									Priority
								</label>
								<Select
									id="priority"
									bind:value={newProject.priority}
									options={[
										{ value: "low", label: "Low" },
										{ value: "medium", label: "Medium" },
										{ value: "high", label: "High" },
									]}
								/>
							</div>
							<div>
								<label
									for="due-date"
									class="block text-sm font-medium mb-2"
								>
									Due Date
								</label>
								<Input
									id="due-date"
									bind:value={newProject.dueDate}
									type="date"
								/>
							</div>
						</div>

						<div class="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onclick={() => (showCreateDialog = false)}
							>
								Cancel
							</Button>
							<Button onclick={createProject}>
								Create Project
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">
							Total Projects
						</p>
						<p class="text-2xl font-bold">
							{dueDiligenceProjects.length}
						</p>
					</div>
					<svg
						class="w-8 h-8 text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">
							Pending
						</p>
						<p class="text-2xl font-bold">{pendingProjects}</p>
					</div>
					<svg
						class="w-8 h-8 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">
							In Progress
						</p>
						<p class="text-2xl font-bold">{inProgressProjects}</p>
					</div>
					<svg
						class="w-8 h-8 text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">
							Completed
						</p>
						<p class="text-2xl font-bold">{completedProjects}</p>
					</div>
					<svg
						class="w-8 h-8 text-green-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Projects List -->
	{#if isLoading}
		<!-- Loading State -->
		<div class="grid grid-cols-1 gap-4">
			{#each Array(3) as _}
				<Card>
					<CardContent class="p-6">
						<div class="flex items-center space-x-4">
							<div
								class="w-12 h-12 bg-muted rounded-full animate-pulse"
							></div>
							<div class="flex-1 space-y-2">
								<div
									class="h-4 bg-muted rounded animate-pulse w-1/4"
								></div>
								<div
									class="h-3 bg-muted rounded animate-pulse w-1/2"
								></div>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4">
			{#each filteredProjects as project}
				<Card>
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-4">
								<div
									class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
								>
									<svg
										class="w-6 h-6 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<div class="flex-1">
									<div
										class="flex items-center space-x-2 mb-1"
									>
										<h3 class="font-semibold">
											{project.startupName}
										</h3>
										<Badge
											class={getStatusColor(
												project.status,
											)}
										>
											{project.status.replace("_", " ")}
										</Badge>
										<Badge
											class={getPriorityColor(
												project.priority,
											)}
										>
											{project.priority}
										</Badge>
									</div>
									<p
										class="text-sm text-muted-foreground mb-2"
									>
										Assigned to: {project.assigneeName}
									</p>
									<div
										class="flex items-center space-x-4 text-sm text-muted-foreground"
									>
										<span
											>Progress: {project.progress}%</span
										>
										{#if project.dueDate}
											<span
												>Due: {new Date(
													project.dueDate,
												).toLocaleDateString()}</span
											>
										{/if}
										{#if project.recommendation}
											<span
												class={`font-medium ${getRecommendationColor(project.recommendation)}`}
											>
												{project.recommendation.toUpperCase()}
											</span>
										{/if}
									</div>
									<!-- Progress Bar -->
									<div
										class="w-full bg-gray-200 rounded-full h-2 mt-2"
									>
										<div
											class="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style="width: {project.progress}%"
										></div>
									</div>
								</div>
							</div>

							<div class="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onclick={() => viewProjectDetails(project)}
								>
									View Details
								</Button>
								{#if project.status === DUE_DILIGENCE_STATUS.PENDING}
									<Button
										size="sm"
										onclick={() => startProject(project.id)}
									>
										Start
									</Button>
								{:else if project.status === DUE_DILIGENCE_STATUS.IN_PROGRESS}
									<Button
										variant="outline"
										size="sm"
										onclick={() =>
											viewProjectDetails(project)}
									>
										Update
									</Button>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}

	<!-- Project Details Modal -->
	{#if showProjectDetails && selectedProject}
		<Dialog bind:open={showProjectDetails}>
			<DialogContent class="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle class="flex items-center space-x-2">
						<span>{selectedProject.startupName}</span>
						<Badge class={getStatusColor(selectedProject.status)}>
							{selectedProject.status.replace("_", " ")}
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div class="space-y-6">
					<!-- Project Info -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-1"
								>Assigned To</label
							>
							<p class="text-sm">
								{selectedProject.assigneeName}
							</p>
						</div>
						<div>
							<label class="block text-sm font-medium mb-1"
								>Priority</label
							>
							<Badge
								class={getPriorityColor(
									selectedProject.priority,
								)}
							>
								{selectedProject.priority}
							</Badge>
						</div>
						{#if selectedProject.dueDate}
							<div>
								<label class="block text-sm font-medium mb-1"
									>Due Date</label
								>
								<p class="text-sm">
									{new Date(
										selectedProject.dueDate,
									).toLocaleDateString()}
								</p>
							</div>
						{/if}
						<div>
							<label class="block text-sm font-medium mb-1"
								>Progress</label
							>
							<p class="text-sm">{selectedProject.progress}%</p>
						</div>
					</div>

					<!-- Checklist -->
					<div>
						<h3 class="text-lg font-semibold mb-4">
							Due Diligence Checklist
						</h3>
						<div class="space-y-3">
							{#each Object.entries(selectedProject.checklist) as [key, item]}
								<div
									class="flex items-start space-x-3 p-3 border rounded-lg"
								>
									<Checkbox
										checked={item.completed}
										onCheckedChange={(checked) =>
											updateChecklistItem(
												selectedProject.id,
												key,
												checked,
												item.notes,
											)}
										disabled={selectedProject.status ===
											DUE_DILIGENCE_STATUS.COMPLETED}
									/>
									<div class="flex-1">
										<h4 class="font-medium capitalize">
											{key}
										</h4>
										<textarea
											bind:value={item.notes}
											on:input={(e) =>
												updateChecklistItem(
													selectedProject.id,
													key,
													item.completed,
													e.target.value,
												)}
											placeholder="Add notes..."
											class="w-full mt-1 text-sm border rounded px-2 py-1 resize-none"
											rows="2"
											disabled={selectedProject.status ===
												DUE_DILIGENCE_STATUS.COMPLETED}
										/>
										{#if item.documents && item.documents.length > 0}
											<div
												class="mt-2 text-xs text-muted-foreground"
											>
												Documents: {item.documents.join(
													", ",
												)}
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Recommendation (for completed projects) -->
					{#if selectedProject.status === DUE_DILIGENCE_STATUS.COMPLETED}
						<div>
							<h3 class="text-lg font-semibold mb-4">
								Final Recommendation
							</h3>
							<div class="space-y-3">
								<div>
									<label
										class="block text-sm font-medium mb-1"
										>Recommendation</label
									>
									<p
										class={`text-sm font-medium ${getRecommendationColor(selectedProject.recommendation)}`}
									>
										{selectedProject.recommendation?.toUpperCase() ||
											"Not specified"}
									</p>
								</div>
								{#if selectedProject.confidence}
									<div>
										<label
											class="block text-sm font-medium mb-1"
											>Confidence Level</label
										>
										<p class="text-sm capitalize">
											{selectedProject.confidence}
										</p>
									</div>
								{/if}
								{#if selectedProject.summary}
									<div>
										<label
											class="block text-sm font-medium mb-1"
											>Summary</label
										>
										<p class="text-sm">
											{selectedProject.summary}
										</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex justify-end space-x-2 pt-4">
						<Button
							variant="outline"
							onclick={() => (showProjectDetails = false)}
						>
							Close
						</Button>
						{#if selectedProject.status === DUE_DILIGENCE_STATUS.IN_PROGRESS}
							<Button
								onclick={() =>
									completeProject(
										selectedProject.id,
										"invest",
										"high",
										"Strong investment opportunity",
									)}
							>
								Complete Project
							</Button>
						{/if}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	{/if}
</div>
