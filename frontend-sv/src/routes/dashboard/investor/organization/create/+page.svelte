<script lang="ts">
	import { goto } from "$app/navigation";
	import { createOrganizationFlow } from "./create-organization-flow.svelte.ts";
	import { ProgressSteps } from "$lib/components/ui/progress-steps";
	import BasicInfoForm from "./steps/BasicInfoForm.svelte";
	import InvestmentFocusForm from "./steps/InvestmentFocusForm.svelte";
	import TeamInfoForm from "./steps/TeamInfoForm.svelte";
	import VerificationForm from "./steps/VerificationForm.svelte";
	import ReviewForm from "./steps/ReviewForm.svelte";

	// Use the store for state management
	let currentStep = $derived(createOrganizationFlow.currentStep);
	let formData = $derived(createOrganizationFlow.formData);
	let isSubmitting = $derived(createOrganizationFlow.isSubmitting);

	const steps = [
		{ id: 1, title: "Basic Info", component: BasicInfoForm },
		{ id: 2, title: "Investment Focus", component: InvestmentFocusForm },
		{ id: 3, title: "Team Info", component: TeamInfoForm },
		{ id: 4, title: "Verification", component: VerificationForm },
		{ id: 5, title: "Review", component: ReviewForm },
	];

	function handleNext() {
		createOrganizationFlow.nextStep();
	}

	function handlePrevious() {
		createOrganizationFlow.previousStep();
	}

	function handleUpdateFormData(event: CustomEvent) {
		createOrganizationFlow.updateFormData(event.detail);
	}

	function handleEdit(event: CustomEvent) {
		createOrganizationFlow.goToStep(event.detail + 1);
	}

	async function handleSuccess(event: CustomEvent) {
		const result = await createOrganizationFlow.submit();

		if (result.success) {
			// Redirect to the newly created organization's dashboard
			// For now, redirect to a success page or organization list
			goto("/dashboard/investor/organization");
		} else {
			alert("Error creating organization. Please try again.");
		}
	}
</script>

<div class="max-w-4xl mx-auto p-6">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground mb-2">
			Create Investment Organization
		</h1>
		<p class="text-muted-foreground">
			Set up your investment organization to collaborate with team members
			and manage investments.
		</p>
	</div>

	<!-- Progress Steps -->
	<div class="mb-8">
		<ProgressSteps {steps} {currentStep} />
	</div>

	<!-- Form Content -->
	<div class="bg-card rounded-lg border p-6">
		<svelte:component
			this={steps[currentStep - 1].component}
			{formData}
			on:next={handleNext}
			on:previous={handlePrevious}
			on:updateFormData={handleUpdateFormData}
			on:edit={handleEdit}
			on:success={handleSuccess}
		/>
	</div>

	<!-- Navigation Buttons (only show for steps 1-4) -->
	{#if currentStep < steps.length}
		<div class="flex justify-between mt-6">
			<button
				class="btn btn-outline"
				disabled={currentStep === 1}
				onclick={handlePrevious}
			>
				Previous
			</button>

			<button class="btn btn-primary" onclick={handleNext}> Next </button>
		</div>
	{/if}

	<!-- Loading Overlay -->
	{#if isSubmitting}
		<div
			class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<div class="bg-card p-6 rounded-lg shadow-lg">
				<div class="flex items-center space-x-4">
					<div
						class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
					></div>
					<p class="text-lg">Creating your organization...</p>
				</div>
			</div>
		</div>
	{/if}
</div>
