<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { superForm } from "sveltekit-superforms";
	import { zod } from "sveltekit-superforms/adapters";
	import { z } from "zod";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { ArrowLeft, Save, Eye, Plus, Trash2, X } from "@lucide/svelte";

	// Service creation schema
	const serviceSchema = z.object({
		title: z
			.string()
			.min(1, "Title is required")
			.max(100, "Title too long"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters")
			.max(1000, "Description too long"),
		category: z.string().min(1, "Category is required"),
		subcategory: z.string().optional(),
		pricingType: z.enum([
			"hourly",
			"project",
			"retainer",
			"equity",
			"free",
		]),
		priceAmount: z.number().min(0, "Price must be positive").optional(),
		priceCurrency: z.string().default("USD"),
		deliverables: z.array(z.string()).default([]),
		duration: z.string().optional(),
		requirements: z.string().optional(),
		isActive: z.boolean().default(true),
		isFeatured: z.boolean().default(false),
	});

	type ServiceForm = z.infer<typeof serviceSchema>;

	// Initialize form
	const form = superForm(serviceSchema, {
		validators: zod(serviceSchema),
		defaultData: {
			title: "",
			description: "",
			category: "",
			subcategory: "",
			pricingType: "hourly",
			priceAmount: 0,
			priceCurrency: "USD",
			deliverables: [],
			duration: "",
			requirements: "",
			isActive: true,
			isFeatured: false,
		},
	});

	const { form: formData, enhance, errors, submitting } = form;

	let newDeliverable = $state("");
	let isPreviewMode = $state(false);

	const categories = [
		{ value: "business_strategy", label: "Business Strategy" },
		{ value: "technical", label: "Technical" },
		{ value: "marketing_sales", label: "Marketing & Sales" },
		{ value: "legal_finance", label: "Legal & Finance" },
		{ value: "operations", label: "Operations" },
		{ value: "mentoring", label: "Mentoring" },
		{ value: "other", label: "Other" },
	];

	const pricingTypes = [
		{ value: "hourly", label: "Hourly Rate" },
		{ value: "project", label: "Project-based" },
		{ value: "retainer", label: "Monthly Retainer" },
		{ value: "equity", label: "Equity-based" },
		{ value: "free", label: "Free" },
	];

	function addDeliverable() {
		if (newDeliverable.trim()) {
			formData.deliverables = [
				...formData.deliverables,
				newDeliverable.trim(),
			];
			newDeliverable = "";
		}
	}

	function removeDeliverable(index: number) {
		formData.deliverables = formData.deliverables.filter(
			(_, i) => i !== index,
		);
	}

	function togglePreview() {
		isPreviewMode = !isPreviewMode;
	}

	function goBack() {
		goto("/supporter/services");
	}

	function getPricingDisplay() {
		if (formData.pricingType === "free") return "Free";
		if (!formData.priceAmount) return "Price not set";

		switch (formData.pricingType) {
			case "hourly":
				return `$${formData.priceAmount}/hour`;
			case "project":
				return `$${formData.priceAmount.toLocaleString()}`;
			case "retainer":
				return `$${formData.priceAmount.toLocaleString()}/month`;
			case "equity":
				return `${formData.priceAmount}% equity`;
			default:
				return `$${formData.priceAmount}`;
		}
	}

	onMount(() => {
		// TODO: Load any default values or user preferences
		console.log("Initializing service creation form...");
	});
</script>

<svelte:head>
	<title>Create New Service | Supporter Dashboard</title>
	<meta
		name="description"
		content="Create a new service offering for startups"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="outline" size="sm" onclick={() => goBack()}>
				<ArrowLeft class="h-4 w-4 mr-2" />
				Back to Services
			</Button>
			<div>
				<h1 class="text-3xl font-bold tracking-tight">
					Create New Service
				</h1>
				<p class="text-muted-foreground">
					Define your service offering for startups
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={() => togglePreview()}>
				<Eye class="h-4 w-4 mr-2" />
				{isPreviewMode ? "Edit" : "Preview"}
			</Button>
		</div>
	</div>

	{#if isPreviewMode}
		<!-- Preview Mode -->
		<Card>
			<CardHeader>
				<CardTitle>{formData.title || "Service Title"}</CardTitle>
				<CardDescription
					>{formData.description ||
						"Service description will appear here"}</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Category:</span>
					<span class="font-medium"
						>{categories.find((c) => c.value === formData.category)
							?.label || "Not selected"}</span
					>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Pricing:</span>
					<span class="font-medium">{getPricingDisplay()}</span>
				</div>
				{#if formData.deliverables.length > 0}
					<div>
						<span class="text-sm text-muted-foreground"
							>Deliverables:</span
						>
						<ul class="mt-2 space-y-1">
							{#each formData.deliverables as deliverable}
								<li class="text-sm">• {deliverable}</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if formData.duration}
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground"
							>Duration:</span
						>
						<span class="font-medium">{formData.duration}</span>
					</div>
				{/if}
			</CardContent>
		</Card>
	{:else}
		<!-- Edit Mode -->
		<form method="POST" use:enhance>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Main Form -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Basic Information -->
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>
								Provide the essential details about your service
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="space-y-2">
								<Label for="title">Service Title *</Label>
								<Input
									id="title"
									bind:value={formData.title}
									placeholder="e.g., Business Strategy Consulting"
									class={errors.title
										? "border-destructive"
										: ""}
								/>
								{#if errors.title}
									<p class="text-sm text-destructive">
										{errors.title}
									</p>
								{/if}
							</div>

							<div class="space-y-2">
								<Label for="description">Description *</Label>
								<Textarea
									id="description"
									bind:value={formData.description}
									placeholder="Describe what you offer, your approach, and the value you provide..."
									rows="4"
									class={errors.description
										? "border-destructive"
										: ""}
								/>
								{#if errors.description}
									<p class="text-sm text-destructive">
										{errors.description}
									</p>
								{/if}
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label for="category">Category *</Label>
									<Select bind:value={formData.category}>
										<SelectTrigger
											class={errors.category
												? "border-destructive"
												: ""}
										>
											<SelectValue
												placeholder="Select category"
											/>
										</SelectTrigger>
										<SelectContent>
											{#each categories as category}
												<SelectItem
													value={category.value}
													>{category.label}</SelectItem
												>
											{/each}
										</SelectContent>
									</Select>
									{#if errors.category}
										<p class="text-sm text-destructive">
											{errors.category}
										</p>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="subcategory">Subcategory</Label>
									<Input
										id="subcategory"
										bind:value={formData.subcategory}
										placeholder="e.g., Business Model, Growth Strategy"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<!-- Pricing -->
					<Card>
						<CardHeader>
							<CardTitle>Pricing</CardTitle>
							<CardDescription>
								Set your pricing structure and rates
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="space-y-2">
								<Label for="pricingType">Pricing Type *</Label>
								<Select bind:value={formData.pricingType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{#each pricingTypes as type}
											<SelectItem value={type.value}
												>{type.label}</SelectItem
											>
										{/each}
									</SelectContent>
								</Select>
							</div>

							{#if formData.pricingType !== "free"}
								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4"
								>
									<div class="space-y-2">
										<Label for="priceAmount"
											>Price Amount *</Label
										>
										<Input
											id="priceAmount"
											type="number"
											bind:value={formData.priceAmount}
											placeholder="0"
											min="0"
											step="0.01"
											class={errors.priceAmount
												? "border-destructive"
												: ""}
										/>
										{#if errors.priceAmount}
											<p class="text-sm text-destructive">
												{errors.priceAmount}
											</p>
										{/if}
									</div>

									<div class="space-y-2">
										<Label for="priceCurrency"
											>Currency</Label
										>
										<Select
											bind:value={formData.priceCurrency}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="USD"
													>USD</SelectItem
												>
												<SelectItem value="EUR"
													>EUR</SelectItem
												>
												<SelectItem value="GBP"
													>GBP</SelectItem
												>
											</SelectContent>
										</Select>
									</div>
								</div>
							{/if}
						</CardContent>
					</Card>

					<!-- Deliverables -->
					<Card>
						<CardHeader>
							<CardTitle>Deliverables</CardTitle>
							<CardDescription>
								What will clients receive from this service?
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="flex gap-2">
								<Input
									bind:value={newDeliverable}
									placeholder="Add a deliverable..."
									onkeydown={(e) =>
										e.key === "Enter" &&
										(e.preventDefault(), addDeliverable())}
								/>
								<Button
									type="button"
									onclick={() => addDeliverable()}
								>
									<Plus class="h-4 w-4" />
								</Button>
							</div>

							{#if formData.deliverables.length > 0}
								<div class="space-y-2">
									{#each formData.deliverables as deliverable, index}
										<div
											class="flex items-center gap-2 p-2 border rounded-lg"
										>
											<span class="flex-1 text-sm"
												>{deliverable}</span
											>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onclick={() =>
													removeDeliverable(index)}
											>
												<Trash2 class="h-4 w-4" />
											</Button>
										</div>
									{/each}
								</div>
							{/if}
						</CardContent>
					</Card>

					<!-- Additional Details -->
					<Card>
						<CardHeader>
							<CardTitle>Additional Details</CardTitle>
							<CardDescription>
								Provide any additional information about your
								service
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="space-y-2">
								<Label for="duration">Duration</Label>
								<Input
									id="duration"
									bind:value={formData.duration}
									placeholder="e.g., 2-4 weeks, 1 hour session"
								/>
							</div>

							<div class="space-y-2">
								<Label for="requirements">Requirements</Label>
								<Textarea
									id="requirements"
									bind:value={formData.requirements}
									placeholder="What do clients need to provide or prepare?"
									rows="3"
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Service Settings -->
					<Card>
						<CardHeader>
							<CardTitle>Service Settings</CardTitle>
							<CardDescription>
								Configure your service visibility and status
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="flex items-center space-x-2">
								<Checkbox bind:checked={formData.isActive} />
								<Label for="isActive">Active Service</Label>
							</div>
							<p class="text-xs text-muted-foreground">
								Active services are visible to startups and can
								receive bookings
							</p>

							<div class="flex items-center space-x-2">
								<Checkbox bind:checked={formData.isFeatured} />
								<Label for="isFeatured">Featured Service</Label>
							</div>
							<p class="text-xs text-muted-foreground">
								Featured services appear prominently in search
								results
							</p>
						</CardContent>
					</Card>

					<!-- Actions -->
					<Card>
						<CardHeader>
							<CardTitle>Actions</CardTitle>
						</CardHeader>
						<CardContent class="space-y-3">
							<Button
								type="submit"
								class="w-full"
								disabled={submitting}
							>
								<Save class="h-4 w-4 mr-2" />
								{submitting ? "Creating..." : "Create Service"}
							</Button>
							<Button
								type="button"
								variant="outline"
								class="w-full"
								onclick={() => goBack()}
							>
								Cancel
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</form>
	{/if}
</div>
