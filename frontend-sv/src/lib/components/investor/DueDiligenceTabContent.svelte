<script lang="ts">
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
	// Adjust path as needed

	// Re-define or import necessary types if not using PageData directly
	// For simplicity, using a subset here. Ideally, these would come from a shared types file.
	interface Deal {
		id: number;
		name: string;
		logo: string;
		industry: string;
		// Add other necessary deal properties
	}

	interface DueDiligenceTemplate {
		id: number;
		name: string;
		categories: {
			name: string;
			items: { name: string; required?: boolean }[];
		}[];
		// Add other necessary template properties
	}

	interface ActiveDueDiligenceProcess {
		dealId: number;
		templateId: number;
		progress: number;
		completedItems: number;
		totalItems: number;
		targetDate: string;
		team: string[];
		notes?: string;
		// Add other necessary process properties
	}

	let {
		activeDueDiligence,
		dueDiligenceTemplates,
		getDealById,
		formatDate,
	}: {
		activeDueDiligence: ActiveDueDiligenceProcess[];
		dueDiligenceTemplates: DueDiligenceTemplate[];
		getDealById: (id: number) => Deal | undefined;
		formatDate: (dateStr: string) => string;
	} = $props();
</script>

<div class="space-y-6">
	<!-- Active Due Diligence Processes -->
	<div>
		<h3 class="text-xl font-semibold mb-4">Active Due Diligence</h3>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each activeDueDiligence as process}
				{@const deal = getDealById(process.dealId)}
				{@const template = dueDiligenceTemplates.find(
					(t) => t.id === process.templateId,
				)}
				{#if deal && template}
					<Card>
						<CardHeader class="pb-2">
							<div class="flex justify-between items-start">
								<div class="flex items-center gap-2">
									<img
										src={deal.logo}
										alt={deal.name}
										class="w-10 h-10 rounded-full"
									/>
									<div>
										<CardTitle class="text-base"
											>{deal.name}</CardTitle
										>
										<CardDescription class="text-sm">
											{template.name}
										</CardDescription>
									</div>
								</div>
								<Badge
									variant={process.progress < 50
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
								<div class="flex justify-between text-sm mb-1">
									<span
										>{process.completedItems} of {process.totalItems}
										items completed</span
									>
									<span>{formatDate(process.targetDate)}</span
									>
								</div>
								<Progress
									value={process.progress}
									class="h-2"
								/>
							</div>

							<div class="text-sm">
								<div class="font-medium mb-1">Team</div>
								<div class="flex flex-wrap gap-1">
									{#each process.team as memberName}
										<Badge variant="outline"
											>{memberName}</Badge
										>
									{/each}
								</div>
							</div>

							{#if process.notes}
								<div class="mt-3 text-sm">
									<div class="font-medium mb-1">Notes</div>
									<p class="text-muted-foreground">
										{process.notes}
									</p>
								</div>
							{/if}
						</CardContent>
						<CardFooter>
							<div class="flex justify-between w-full">
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
										><path d="m9 11-6 6v3h9l3-3"
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
			<h3 class="text-xl font-semibold">Due Diligence Templates</h3>
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
					><line x1="12" x2="12" y1="5" y2="19"></line><line
						x1="5"
						x2="19"
						y1="12"
						y2="12"
					></line></svg
				>
				Create Template
			</Button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each dueDiligenceTemplates as template}
				<Card>
					<CardHeader>
						<CardTitle class="text-lg">{template.name}</CardTitle>
						<CardDescription>
							{template.categories.reduce(
								(count, category) =>
									count + category.items.length,
								0,
							)}
							checklist items
						</CardDescription>
					</CardHeader>
					<CardContent class="pb-2">
						<div class="space-y-2">
							{#each template.categories as category}
								<div>
									<p class="text-sm font-medium">
										{category.name}
									</p>
									<p class="text-xs text-muted-foreground">
										{category.items.length} items
									</p>
								</div>
							{/each}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="secondary" size="sm" class="w-full"
							>Use Template</Button
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
				Template Preview: {dueDiligenceTemplates[0].name}
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
											<p class="text-sm">{item.name}</p>
										</div>
										{#if item.required}
											<Badge
												variant="outline"
												class="text-xs">Required</Badge
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
</div>
