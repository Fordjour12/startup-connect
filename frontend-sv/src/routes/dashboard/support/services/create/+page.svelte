<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Textarea } from '@/components/ui/textarea';
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Badge } from '@/components/ui/badge';
	import { 
		Save, 
		Plus, 
		Trash2, 
		ArrowLeft,
		Clock,
		Calendar,
		DollarSign
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// Service categories from the plan
	const SERVICE_CATEGORIES = [
		'Business Strategy',
		'Technical',
		'Marketing & Sales',
		'Legal & Finance',
		'Operations',
		'Mentoring'
	];

	const SUB_CATEGORIES = {
		'Business Strategy': ['Business Model', 'Go-to-Market', 'Scaling', 'Market Analysis'],
		'Technical': ['Development', 'Architecture', 'DevOps', 'Security', 'AI/ML'],
		'Marketing & Sales': ['Branding', 'Growth', 'Customer Acquisition', 'Digital Marketing'],
		'Legal & Finance': ['Compliance', 'Fundraising', 'Contracts', 'Financial Planning'],
		'Operations': ['HR', 'Processes', 'Tools', 'Efficiency'],
		'Mentoring': ['Leadership', 'Personal Development', 'Team Building']
	};

	const PRICING_TYPES = [
		{ value: 'hourly', label: 'Hourly Rate', description: 'Charged per hour of work' },
		{ value: 'project', label: 'Project-Based', description: 'Fixed price for entire project' },
		{ value: 'retainer', label: 'Retainer', description: 'Monthly fee for ongoing support' }
	];

	const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	// Form state
	let serviceData = $state({
		title: '',
		description: '',
		category: '',
		subcategory: '',
		pricing: {
			type: 'hourly',
			amount: 0,
			currency: 'USD',
			details: ''
		},
		availability: {
			workingHours: {} as Record<string, { start: string; end: string }>,
			timezone: 'PST',
			responseTime: 24
		},
		features: [] as string[],
		deliverables: [] as string[],
		requirements: [] as string[]
	});

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Form handlers
	function addFeature() {
		serviceData.features = [...serviceData.features, ''];
	}

	function removeFeature(index: number) {
		serviceData.features = serviceData.features.filter((_, i) => i !== index);
	}

	function updateFeature(index: number, value: string) {
		serviceData.features[index] = value;
	}

	function addDeliverable() {
		serviceData.deliverables = [...serviceData.deliverables, ''];
	}

	function removeDeliverable(index: number) {
		serviceData.deliverables = serviceData.deliverables.filter((_, i) => i !== index);
	}

	function updateDeliverable(index: number, value: string) {
		serviceData.deliverables[index] = value;
	}

	function addRequirement() {
		serviceData.requirements = [...serviceData.requirements, ''];
	}

	function removeRequirement(index: number) {
		serviceData.requirements = serviceData.requirements.filter((_, i) => i !== index);
	}

	function updateRequirement(index: number, value: string) {
		serviceData.requirements[index] = value;
	}

	function toggleWorkingDay(day: string) {
		if (serviceData.availability.workingHours[day]) {
			const { [day]: removed, ...rest } = serviceData.availability.workingHours;
			serviceData.availability.workingHours = rest;
		} else {
			serviceData.availability.workingHours = {
				...serviceData.availability.workingHours,
				[day]: { start: '09:00', end: '17:00' }
			};
		}
	}

	function validateForm() {
		errors = {};
		
		if (!serviceData.title.trim()) {
			errors.title = 'Service title is required';
		}
		if (!serviceData.description.trim()) {
			errors.description = 'Service description is required';
		}
		if (!serviceData.category) {
			errors.category = 'Please select a category';
		}
		if (serviceData.pricing.amount <= 0) {
			errors.pricing = 'Please enter a valid price';
		}
		
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		
		try {
			// TODO: Submit to API
			console.log('Creating service:', serviceData);
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Redirect to services list
			goto('/dashboard/support/services');
		} catch (error) {
			console.error('Error creating service:', error);
			errors.submit = 'Failed to create service. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function goBack() {
		goto('/dashboard/support');
	}
</script>

<svelte:head>
	<title>Create Service | Supporter Dashboard</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button variant="ghost" onclick={() => goBack()}>
			<ArrowLeft class="h-4 w-4 mr-2" />
			Back to Dashboard
		</Button>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Create New Service</h1>
			<p class="text-muted-foreground">
				List a new service to attract potential clients
			</p>
		</div>
	</div>

	<form onsubmit|preventDefault={() => handleSubmit()} class="space-y-6">
		<!-- Basic Information -->
		<Card>
			<CardHeader>
				<CardTitle>Basic Information</CardTitle>
				<CardDescription>
					Essential details about your service
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-2">
					<Label for="title">Service Title *</Label>
					<Input 
						id="title" 
						bind:value={serviceData.title}
						placeholder="e.g., Business Strategy Consulting"
						class={errors.title ? 'border-destructive' : ''}
					/>
					{#if errors.title}
						<p class="text-sm text-destructive">{errors.title}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="description">Description *</Label>
					<Textarea 
						id="description" 
						bind:value={serviceData.description}
						rows={4}
						placeholder="Describe what you offer, your approach, and the value you provide..."
						class={errors.description ? 'border-destructive' : ''}
					/>
					{#if errors.description}
						<p class="text-sm text-destructive">{errors.description}</p>
					{/if}
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label for="category">Category *</Label>
						<Select bind:value={serviceData.category}>
							<SelectTrigger class={errors.category ? 'border-destructive' : ''}>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{#each SERVICE_CATEGORIES as category}
									<SelectItem value={category}>{category}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
						{#if errors.category}
							<p class="text-sm text-destructive">{errors.category}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="subcategory">Subcategory</Label>
						<Select bind:value={serviceData.subcategory} disabled={!serviceData.category}>
							<SelectTrigger>
								<SelectValue placeholder="Select a subcategory" />
							</SelectTrigger>
							<SelectContent>
								{#if serviceData.category && SUB_CATEGORIES[serviceData.category]}
									{#each SUB_CATEGORIES[serviceData.category] as subcategory}
										<SelectItem value={subcategory}>{subcategory}</SelectItem>
									{/each}
								{/if}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Pricing -->
		<Card>
			<CardHeader>
				<CardTitle>Pricing & Payment</CardTitle>
				<CardDescription>
					Define how you charge for your services
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-2">
					<Label>Pricing Type</Label>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						{#each PRICING_TYPES as type}
							<div class="flex items-center space-x-2">
								<Checkbox 
									id={type.value}
									checked={serviceData.pricing.type === type.value}
									onchange={() => serviceData.pricing.type = type.value}
								/>
								<Label for={type.value} class="flex-1 cursor-pointer">
									<div class="font-medium">{type.label}</div>
									<div class="text-sm text-muted-foreground">{type.description}</div>
								</Label>
							</div>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label for="amount">Amount *</Label>
						<div class="relative">
							<DollarSign class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input 
								id="amount" 
								type="number"
								bind:value={serviceData.pricing.amount}
								class="pl-10"
								placeholder="0.00"
								class={errors.pricing ? 'border-destructive' : ''}
							/>
						</div>
						{#if errors.pricing}
							<p class="text-sm text-destructive">{errors.pricing}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="currency">Currency</Label>
						<Select bind:value={serviceData.pricing.currency}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="USD">USD ($)</SelectItem>
								<SelectItem value="EUR">EUR (€)</SelectItem>
								<SelectItem value="GBP">GBP (£)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="pricingDetails">Additional Pricing Details</Label>
					<Textarea 
						id="pricingDetails" 
						bind:value={serviceData.pricing.details}
						rows={3}
						placeholder="Any additional information about pricing, payment terms, or special offers..."
					/>
				</div>
			</CardContent>
		</Card>

		<!-- Availability -->
		<Card>
			<CardHeader>
				<CardTitle>Availability & Scheduling</CardTitle>
				<CardDescription>
					Set your working hours and response time commitments
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-4">
					<Label>Working Hours</Label>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each DAYS_OF_WEEK as day}
							{@const dayName = day.charAt(0).toUpperCase() + day.slice(1)}
							<div class="flex items-center space-x-3">
								<Checkbox 
									id={day}
									checked={!!serviceData.availability.workingHours[day]}
									onchange={() => toggleWorkingDay(day)}
								/>
								<Label for={day} class="flex-1 cursor-pointer">{dayName}</Label>
								{#if serviceData.availability.workingHours[day]}
									<div class="flex items-center gap-2">
										<Input 
											type="time"
											bind:value={serviceData.availability.workingHours[day].start}
											class="w-24"
										/>
										<span>to</span>
										<Input 
											type="time"
											bind:value={serviceData.availability.workingHours[day].end}
											class="w-24"
										/>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label for="timezone">Timezone</Label>
						<Select bind:value={serviceData.availability.timezone}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
								<SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
								<SelectItem value="CST">Central Standard Time (CST)</SelectItem>
								<SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
								<SelectItem value="UTC">UTC</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div class="space-y-2">
						<Label for="responseTime">Response Time (hours)</Label>
						<div class="relative">
							<Clock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input 
								id="responseTime" 
								type="number"
								bind:value={serviceData.availability.responseTime}
								class="pl-10"
								placeholder="24"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Service Details -->
		<Card>
			<CardHeader>
				<CardTitle>Service Details</CardTitle>
				<CardDescription>
					What clients can expect from your service
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<Label>Key Features</Label>
						<Button type="button" variant="outline" size="sm" onclick={() => addFeature()}>
							<Plus class="h-4 w-4 mr-2" />
							Add Feature
						</Button>
					</div>
					<div class="space-y-2">
						{#each serviceData.features as feature, index}
							<div class="flex items-center gap-2">
								<Input 
									bind:value={serviceData.features[index]}
									placeholder="Describe a key feature of your service..."
								/>
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									onclick={() => removeFeature(index)}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						{/each}
					</div>
				</div>

				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<Label>Deliverables</Label>
						<Button type="button" variant="outline" size="sm" onclick={() => addDeliverable()}>
							<Plus class="h-4 w-4 mr-2" />
							Add Deliverable
						</Button>
					</div>
					<div class="space-y-2">
						{#each serviceData.deliverables as deliverable, index}
							<div class="flex items-center gap-2">
								<Input 
									bind:value={serviceData.deliverables[index]}
									placeholder="What will the client receive..."
								/>
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									onclick={() => removeDeliverable(index)}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						{/each}
					</div>
				</div>

				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<Label>Client Requirements</Label>
						<Button type="button" variant="outline" size="sm" onclick={() => addRequirement()}>
							<Plus class="h-4 w-4 mr-2" />
							Add Requirement
						</Button>
					</div>
					<div class="space-y-2">
						{#each serviceData.requirements as requirement, index}
							<div class="flex items-center gap-2">
								<Input 
									bind:value={serviceData.requirements[index]}
									placeholder="What does the client need to provide..."
								/>
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									onclick={() => removeRequirement(index)}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						{/each}
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Submit -->
		<div class="flex items-center justify-between pt-6 border-t">
			<Button type="button" variant="outline" onclick={() => goBack()}>
				Cancel
			</Button>
			<Button type="submit" disabled={isSubmitting}>
				{#if isSubmitting}
					Creating...
				{:else}
					<Save class="h-4 w-4 mr-2" />
					Create Service
				{/if}
			</Button>
		</div>

		{#if errors.submit}
			<div class="p-4 bg-destructive/10 border border-destructive rounded-lg">
				<p class="text-sm text-destructive">{errors.submit}</p>
			</div>
		{/if}
	</form>
</div>
