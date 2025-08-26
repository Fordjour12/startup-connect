<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import { ORGANIZATION_TYPES } from "$lib/db/schema";

	const dispatch = createEventDispatcher();

	interface Props {
		formData: any;
	}

	let { formData }: Props = $props();

	let localData = $state({
		name: formData.name || "",
		organizationType: formData.organizationType || "",
		website: formData.website || "",
		description: formData.description || "",
		headquarters: formData.headquarters || "",
		contactEmail: formData.contactEmail || "",
		contactPhone: formData.contactPhone || "",
	});

	function handleSubmit() {
		// Basic validation
		if (!localData.name.trim()) {
			alert("Organization name is required");
			return;
		}

		if (!localData.organizationType) {
			alert("Organization type is required");
			return;
		}

		dispatch("updateFormData", localData);
		dispatch("next");
	}

	function handleNext() {
		handleSubmit();
	}

	$effect(() => {
		if (formData) {
			localData = {
				name: formData.name || "",
				organizationType: formData.organizationType || "",
				website: formData.website || "",
				description: formData.description || "",
				headquarters: formData.headquarters || "",
				contactEmail: formData.contactEmail || "",
				contactPhone: formData.contactPhone || "",
			};
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold mb-2">Basic Information</h2>
		<p class="text-muted-foreground">Tell us about your organization</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Organization Name -->
		<div class="md:col-span-2">
			<label for="name" class="block text-sm font-medium mb-2">
				Organization Name *
			</label>
			<Input
				id="name"
				bind:value={localData.name}
				placeholder="e.g., TechVenture Capital"
				required
			/>
		</div>

		<!-- Organization Type -->
		<div class="md:col-span-2">
			<label
				for="organizationType"
				class="block text-sm font-medium mb-2"
			>
				Organization Type *
			</label>
			<Select
				id="organizationType"
				bind:value={localData.organizationType}
				options={[
					{
						value: ORGANIZATION_TYPES.INVESTMENT_FIRM,
						label: "Investment Firm",
					},
					{
						value: ORGANIZATION_TYPES.ANGEL_GROUP,
						label: "Angel Group",
					},
					{ value: ORGANIZATION_TYPES.VC_FUND, label: "VC Fund" },
					{
						value: ORGANIZATION_TYPES.FAMILY_OFFICE,
						label: "Family Office",
					},
					{
						value: ORGANIZATION_TYPES.CORPORATE_VENTURE,
						label: "Corporate Venture",
					},
				]}
				placeholder="Select organization type"
			/>
		</div>

		<!-- Website -->
		<div>
			<label for="website" class="block text-sm font-medium mb-2">
				Website
			</label>
			<Input
				id="website"
				bind:value={localData.website}
				placeholder="https://yourcompany.com"
				type="url"
			/>
		</div>

		<!-- Headquarters -->
		<div>
			<label for="headquarters" class="block text-sm font-medium mb-2">
				Headquarters
			</label>
			<Input
				id="headquarters"
				bind:value={localData.headquarters}
				placeholder="e.g., San Francisco, CA"
			/>
		</div>

		<!-- Contact Email -->
		<div>
			<label for="contactEmail" class="block text-sm font-medium mb-2">
				Contact Email
			</label>
			<Input
				id="contactEmail"
				bind:value={localData.contactEmail}
				placeholder="contact@yourcompany.com"
				type="email"
			/>
		</div>

		<!-- Contact Phone -->
		<div>
			<label for="contactPhone" class="block text-sm font-medium mb-2">
				Contact Phone
			</label>
			<Input
				id="contactPhone"
				bind:value={localData.contactPhone}
				placeholder="+1 (555) 123-4567"
				type="tel"
			/>
		</div>

		<!-- Description -->
		<div class="md:col-span-2">
			<label for="description" class="block text-sm font-medium mb-2">
				Description
			</label>
			<Textarea
				id="description"
				bind:value={localData.description}
				placeholder="Describe your organization, mission, and investment philosophy..."
				rows={4}
			/>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex justify-end pt-4">
		<Button onclick={handleNext} class="px-8">Next Step</Button>
	</div>
</div>
