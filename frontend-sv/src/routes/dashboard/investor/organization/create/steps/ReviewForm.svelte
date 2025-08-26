<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import {
		ORGANIZATION_TYPES,
		INVESTMENT_FOCUS,
		AUM_RANGES,
		INVESTMENT_SIZE_RANGES,
		GEOGRAPHIC_FOCUS,
		SECTOR_FOCUS,
		DEAL_FLOW_PREFERENCES,
	} from "$lib/db/schema";

	const dispatch = createEventDispatcher();

	interface Props {
		formData: any;
	}

	let { formData }: Props = $props();

	let isSubmitting = $state(false);

	function getOrganizationTypeLabel(value: string) {
		const option = [
			{
				value: ORGANIZATION_TYPES.INVESTMENT_FIRM,
				label: "Investment Firm",
			},
			{ value: ORGANIZATION_TYPES.ANGEL_GROUP, label: "Angel Group" },
			{ value: ORGANIZATION_TYPES.VC_FUND, label: "VC Fund" },
			{ value: ORGANIZATION_TYPES.FAMILY_OFFICE, label: "Family Office" },
			{
				value: ORGANIZATION_TYPES.CORPORATE_VENTURE,
				label: "Corporate Venture",
			},
		].find((opt) => opt.value === value);
		return option?.label || value;
	}

	function getInvestmentFocusLabels(values: string[]) {
		const labels = [];
		if (values.includes(INVESTMENT_FOCUS.SEED)) labels.push("Seed");
		if (values.includes(INVESTMENT_FOCUS.SERIES_A)) labels.push("Series A");
		if (values.includes(INVESTMENT_FOCUS.SERIES_B)) labels.push("Series B");
		if (values.includes(INVESTMENT_FOCUS.GROWTH)) labels.push("Growth");
		if (values.includes(INVESTMENT_FOCUS.LATE_STAGE))
			labels.push("Late Stage");
		return labels;
	}

	function getSectorFocusLabels(values: string[]) {
		const labels = [];
		if (values.includes(SECTOR_FOCUS.SAAS)) labels.push("SaaS");
		if (values.includes(SECTOR_FOCUS.FINTECH)) labels.push("FinTech");
		if (values.includes(SECTOR_FOCUS.HEALTHTECH)) labels.push("HealthTech");
		if (values.includes(SECTOR_FOCUS.EDTECH)) labels.push("EdTech");
		if (values.includes(SECTOR_FOCUS.CLEANTECH)) labels.push("CleanTech");
		if (values.includes(SECTOR_FOCUS.GENERAL)) labels.push("General");
		return labels;
	}

	function getAumLabel(value: string) {
		const labels: Record<string, string> = {
			[AUM_RANGES.UNDER_10M]: "Under $10M",
			[AUM_RANGES.TEN_TO_100M]: "$10M - $100M",
			[AUM_RANGES.HUNDRED_M_TO_1B]: "$100M - $1B",
			[AUM_RANGES.OVER_1B]: "Over $1B",
		};
		return labels[value] || value;
	}

	function getInvestmentSizeLabel(value: string) {
		const labels: Record<string, string> = {
			[INVESTMENT_SIZE_RANGES.FIFTY_K_TO_500K]: "$50K - $500K",
			[INVESTMENT_SIZE_RANGES.FIVE_HUNDRED_K_TO_2M]: "$500K - $2M",
			[INVESTMENT_SIZE_RANGES.TWO_M_TO_10M]: "$2M - $10M",
			[INVESTMENT_SIZE_RANGES.OVER_10M]: "Over $10M",
		};
		return labels[value] || value;
	}

	function getGeographicLabel(value: string) {
		const labels: Record<string, string> = {
			[GEOGRAPHIC_FOCUS.NORTH_AMERICA]: "North America",
			[GEOGRAPHIC_FOCUS.EUROPE]: "Europe",
			[GEOGRAPHIC_FOCUS.ASIA]: "Asia",
			[GEOGRAPHIC_FOCUS.GLOBAL]: "Global",
			[GEOGRAPHIC_FOCUS.LOCAL]: "Local",
		};
		return labels[value] || value;
	}

	function getDealFlowLabel(value: string) {
		const labels: Record<string, string> = {
			[DEAL_FLOW_PREFERENCES.DIRECT]: "Direct Investments",
			[DEAL_FLOW_PREFERENCES.SYNDICATES]: "Syndicates",
			[DEAL_FLOW_PREFERENCES.BOTH]: "Both Direct & Syndicates",
		};
		return labels[value] || value;
	}

	async function handleSubmit() {
		isSubmitting = true;
		try {
			// Here you would typically call an API to create the organization
			console.log("Creating organization with data:", formData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Redirect to organization dashboard or show success message
			// For now, just dispatch success
			dispatch("success", formData);
		} catch (error) {
			console.error("Error creating organization:", error);
			alert("Error creating organization. Please try again.");
		} finally {
			isSubmitting = false;
		}
	}

	function handleEdit(stepIndex: number) {
		dispatch("edit", stepIndex);
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold mb-2">Review & Create</h2>
		<p class="text-muted-foreground">
			Please review your information before creating the organization
		</p>
	</div>

	<!-- Basic Information Review -->
	<Card class="p-6">
		<div class="flex justify-between items-start mb-4">
			<h3 class="text-lg font-medium">Basic Information</h3>
			<Button variant="outline" size="sm" onclick={() => handleEdit(0)}>
				Edit
			</Button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Organization Name
				</p>
				<p class="text-sm">{formData.name || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Organization Type
				</p>
				<p class="text-sm">
					{getOrganizationTypeLabel(formData.organizationType)}
				</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">Website</p>
				<p class="text-sm">{formData.website || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Headquarters
				</p>
				<p class="text-sm">{formData.headquarters || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Contact Email
				</p>
				<p class="text-sm">{formData.contactEmail || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Contact Phone
				</p>
				<p class="text-sm">{formData.contactPhone || "Not provided"}</p>
			</div>
		</div>

		{#if formData.description}
			<div class="mt-4">
				<p class="text-sm font-medium text-muted-foreground">
					Description
				</p>
				<p class="text-sm">{formData.description}</p>
			</div>
		{/if}
	</Card>

	<!-- Investment Focus Review -->
	<Card class="p-6">
		<div class="flex justify-between items-start mb-4">
			<h3 class="text-lg font-medium">Investment Focus</h3>
			<Button variant="outline" size="sm" onclick={() => handleEdit(1)}>
				Edit
			</Button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Investment Stages
				</p>
				<div class="flex flex-wrap gap-2 mt-1">
					{#each getInvestmentFocusLabels(formData.investmentFocus || []) as stage}
						<Badge variant="secondary">{stage}</Badge>
					{/each}
				</div>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Assets Under Management
				</p>
				<p class="text-sm">
					{getAumLabel(formData.totalAssetsUnderManagement)}
				</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Typical Investment Size
				</p>
				<p class="text-sm">
					{getInvestmentSizeLabel(formData.investmentSizeRange)}
				</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Geographic Focus
				</p>
				<p class="text-sm">
					{getGeographicLabel(formData.geographicFocus)}
				</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Preferred Deal Flow
				</p>
				<p class="text-sm">
					{getDealFlowLabel(formData.preferredDealFlow)}
				</p>
			</div>

			{#if formData.minInvestmentSize || formData.maxInvestmentSize}
				<div>
					<p class="text-sm font-medium text-muted-foreground">
						Custom Investment Range
					</p>
					<p class="text-sm">
						{formData.minInvestmentSize
							? `$${formData.minInvestmentSize.toLocaleString()}`
							: "Min not set"} -
						{formData.maxInvestmentSize
							? `$${formData.maxInvestmentSize.toLocaleString()}`
							: "Max not set"}
					</p>
				</div>
			{/if}
		</div>

		{#if formData.sectorFocus && formData.sectorFocus.length > 0}
			<div class="mt-4">
				<p class="text-sm font-medium text-muted-foreground">
					Sector Focus
				</p>
				<div class="flex flex-wrap gap-2 mt-1">
					{#each getSectorFocusLabels(formData.sectorFocus) as sector}
						<Badge variant="secondary">{sector}</Badge>
					{/each}
				</div>
			</div>
		{/if}
	</Card>

	<!-- Team Information Review -->
	<Card class="p-6">
		<div class="flex justify-between items-start mb-4">
			<h3 class="text-lg font-medium">Team Information</h3>
			<Button variant="outline" size="sm" onclick={() => handleEdit(2)}>
				Edit
			</Button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Founded Year
				</p>
				<p class="text-sm">{formData.foundedYear || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Team Size
				</p>
				<p class="text-sm">{formData.teamSize || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					LinkedIn
				</p>
				<p class="text-sm">{formData.linkedinUrl || "Not provided"}</p>
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">Twitter</p>
				<p class="text-sm">
					{formData.twitterHandle || "Not provided"}
				</p>
			</div>
		</div>

		{#if formData.teamMembers && formData.teamMembers.length > 0}
			<div class="mt-4">
				<p class="text-sm font-medium text-muted-foreground mb-2">
					Team Members
				</p>
				<div class="space-y-2">
					{#each formData.teamMembers as member}
						<div
							class="flex justify-between items-center p-3 bg-muted rounded"
						>
							<div>
								<p class="text-sm font-medium">{member.name}</p>
								<p class="text-xs text-muted-foreground">
									{member.title} • {member.email}
								</p>
							</div>
							<Badge variant="outline">{member.role}</Badge>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</Card>

	<!-- Verification Review -->
	<Card class="p-6">
		<div class="flex justify-between items-start mb-4">
			<h3 class="text-lg font-medium">Verification</h3>
			<Button variant="outline" size="sm" onclick={() => handleEdit(3)}>
				Edit
			</Button>
		</div>

		<div class="space-y-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Documents Uploaded
				</p>
				<p class="text-sm">
					{(formData.documents || []).length} document(s)
				</p>
				{#if formData.documents && formData.documents.length > 0}
					<div class="mt-2 space-y-1">
						{#each formData.documents as doc}
							<div class="flex items-center space-x-2">
								<svg
									class="w-4 h-4 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<span class="text-sm">{doc.name}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div>
				<p class="text-sm font-medium text-muted-foreground">
					Terms Accepted
				</p>
				<p class="text-sm">{formData.termsAccepted ? "Yes" : "No"}</p>
			</div>

			{#if formData.verificationNotes}
				<div>
					<p class="text-sm font-medium text-muted-foreground">
						Additional Notes
					</p>
					<p class="text-sm">{formData.verificationNotes}</p>
				</div>
			{/if}
		</div>
	</Card>

	<!-- Action Buttons -->
	<div class="flex justify-between pt-4">
		<Button variant="outline" onclick={() => dispatch("previous")}>
			Previous
		</Button>
		<Button onclick={handleSubmit} disabled={isSubmitting}>
			{#if isSubmitting}
				Creating Organization...
			{:else}
				Create Organization
			{/if}
		</Button>
	</div>
</div>
