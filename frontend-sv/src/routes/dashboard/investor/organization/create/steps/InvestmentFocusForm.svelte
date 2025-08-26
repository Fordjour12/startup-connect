<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Select } from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import {
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

	let localData = $state({
		investmentFocus: formData.investmentFocus || [],
		totalAssetsUnderManagement: formData.totalAssetsUnderManagement || "",
		investmentSizeRange: formData.investmentSizeRange || "",
		geographicFocus: formData.geographicFocus || "",
		sectorFocus: formData.sectorFocus || [],
		minInvestmentSize: formData.minInvestmentSize || "",
		maxInvestmentSize: formData.maxInvestmentSize || "",
		preferredDealFlow: formData.preferredDealFlow || "",
	});

	function handleInvestmentFocusChange(value: string, checked: boolean) {
		if (checked) {
			localData.investmentFocus = [...localData.investmentFocus, value];
		} else {
			localData.investmentFocus = localData.investmentFocus.filter(
				(item) => item !== value,
			);
		}
	}

	function handleSectorFocusChange(value: string, checked: boolean) {
		if (checked) {
			localData.sectorFocus = [...localData.sectorFocus, value];
		} else {
			localData.sectorFocus = localData.sectorFocus.filter(
				(item) => item !== value,
			);
		}
	}

	function handleSubmit() {
		dispatch("updateFormData", localData);
		dispatch("next");
	}

	$effect(() => {
		if (formData) {
			localData = {
				investmentFocus: formData.investmentFocus || [],
				totalAssetsUnderManagement:
					formData.totalAssetsUnderManagement || "",
				investmentSizeRange: formData.investmentSizeRange || "",
				geographicFocus: formData.geographicFocus || "",
				sectorFocus: formData.sectorFocus || [],
				minInvestmentSize: formData.minInvestmentSize || "",
				maxInvestmentSize: formData.maxInvestmentSize || "",
				preferredDealFlow: formData.preferredDealFlow || "",
			};
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold mb-2">Investment Focus</h2>
		<p class="text-muted-foreground">
			Define your investment criteria and preferences
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Investment Focus -->
		<div class="md:col-span-2">
			<label class="block text-sm font-medium mb-3">
				Investment Stages *
			</label>
			<div class="grid grid-cols-2 gap-3">
				<Checkbox
					label="Seed Stage"
					checked={localData.investmentFocus.includes(
						INVESTMENT_FOCUS.SEED,
					)}
					onCheckedChange={(checked) =>
						handleInvestmentFocusChange(
							INVESTMENT_FOCUS.SEED,
							checked,
						)}
				/>
				<Checkbox
					label="Series A"
					checked={localData.investmentFocus.includes(
						INVESTMENT_FOCUS.SERIES_A,
					)}
					onCheckedChange={(checked) =>
						handleInvestmentFocusChange(
							INVESTMENT_FOCUS.SERIES_A,
							checked,
						)}
				/>
				<Checkbox
					label="Series B"
					checked={localData.investmentFocus.includes(
						INVESTMENT_FOCUS.SERIES_B,
					)}
					onCheckedChange={(checked) =>
						handleInvestmentFocusChange(
							INVESTMENT_FOCUS.SERIES_B,
							checked,
						)}
				/>
				<Checkbox
					label="Growth Stage"
					checked={localData.investmentFocus.includes(
						INVESTMENT_FOCUS.GROWTH,
					)}
					onCheckedChange={(checked) =>
						handleInvestmentFocusChange(
							INVESTMENT_FOCUS.GROWTH,
							checked,
						)}
				/>
				<Checkbox
					label="Late Stage"
					checked={localData.investmentFocus.includes(
						INVESTMENT_FOCUS.LATE_STAGE,
					)}
					onCheckedChange={(checked) =>
						handleInvestmentFocusChange(
							INVESTMENT_FOCUS.LATE_STAGE,
							checked,
						)}
				/>
			</div>
		</div>

		<!-- AUM Range -->
		<div>
			<label for="aum" class="block text-sm font-medium mb-2">
				Assets Under Management
			</label>
			<Select
				id="aum"
				bind:value={localData.totalAssetsUnderManagement}
				options={[
					{ value: AUM_RANGES.UNDER_10M, label: "Under $10M" },
					{ value: AUM_RANGES.TEN_TO_100M, label: "$10M - $100M" },
					{ value: AUM_RANGES.HUNDRED_M_TO_1B, label: "$100M - $1B" },
					{ value: AUM_RANGES.OVER_1B, label: "Over $1B" },
				]}
				placeholder="Select AUM range"
			/>
		</div>

		<!-- Investment Size Range -->
		<div>
			<label
				for="investmentSizeRange"
				class="block text-sm font-medium mb-2"
			>
				Typical Investment Size
			</label>
			<Select
				id="investmentSizeRange"
				bind:value={localData.investmentSizeRange}
				options={[
					{
						value: INVESTMENT_SIZE_RANGES.FIFTY_K_TO_500K,
						label: "$50K - $500K",
					},
					{
						value: INVESTMENT_SIZE_RANGES.FIVE_HUNDRED_K_TO_2M,
						label: "$500K - $2M",
					},
					{
						value: INVESTMENT_SIZE_RANGES.TWO_M_TO_10M,
						label: "$2M - $10M",
					},
					{
						value: INVESTMENT_SIZE_RANGES.OVER_10M,
						label: "Over $10M",
					},
				]}
				placeholder="Select investment size range"
			/>
		</div>

		<!-- Geographic Focus -->
		<div>
			<label for="geographicFocus" class="block text-sm font-medium mb-2">
				Geographic Focus
			</label>
			<Select
				id="geographicFocus"
				bind:value={localData.geographicFocus}
				options={[
					{
						value: GEOGRAPHIC_FOCUS.NORTH_AMERICA,
						label: "North America",
					},
					{ value: GEOGRAPHIC_FOCUS.EUROPE, label: "Europe" },
					{ value: GEOGRAPHIC_FOCUS.ASIA, label: "Asia" },
					{ value: GEOGRAPHIC_FOCUS.GLOBAL, label: "Global" },
					{ value: GEOGRAPHIC_FOCUS.LOCAL, label: "Local" },
				]}
				placeholder="Select geographic focus"
			/>
		</div>

		<!-- Deal Flow Preferences -->
		<div>
			<label
				for="preferredDealFlow"
				class="block text-sm font-medium mb-2"
			>
				Preferred Deal Flow
			</label>
			<Select
				id="preferredDealFlow"
				bind:value={localData.preferredDealFlow}
				options={[
					{
						value: DEAL_FLOW_PREFERENCES.DIRECT,
						label: "Direct Investments",
					},
					{
						value: DEAL_FLOW_PREFERENCES.SYNDICATES,
						label: "Syndicates",
					},
					{
						value: DEAL_FLOW_PREFERENCES.BOTH,
						label: "Both Direct & Syndicates",
					},
				]}
				placeholder="Select deal flow preference"
			/>
		</div>

		<!-- Sector Focus -->
		<div class="md:col-span-2">
			<label class="block text-sm font-medium mb-3"> Sector Focus </label>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
				<Checkbox
					label="SaaS"
					checked={localData.sectorFocus.includes(SECTOR_FOCUS.SAAS)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(SECTOR_FOCUS.SAAS, checked)}
				/>
				<Checkbox
					label="FinTech"
					checked={localData.sectorFocus.includes(
						SECTOR_FOCUS.FINTECH,
					)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(SECTOR_FOCUS.FINTECH, checked)}
				/>
				<Checkbox
					label="HealthTech"
					checked={localData.sectorFocus.includes(
						SECTOR_FOCUS.HEALTHTECH,
					)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(
							SECTOR_FOCUS.HEALTHTECH,
							checked,
						)}
				/>
				<Checkbox
					label="EdTech"
					checked={localData.sectorFocus.includes(
						SECTOR_FOCUS.EDTECH,
					)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(SECTOR_FOCUS.EDTECH, checked)}
				/>
				<Checkbox
					label="CleanTech"
					checked={localData.sectorFocus.includes(
						SECTOR_FOCUS.CLEANTECH,
					)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(
							SECTOR_FOCUS.CLEANTECH,
							checked,
						)}
				/>
				<Checkbox
					label="General"
					checked={localData.sectorFocus.includes(
						SECTOR_FOCUS.GENERAL,
					)}
					onCheckedChange={(checked) =>
						handleSectorFocusChange(SECTOR_FOCUS.GENERAL, checked)}
				/>
			</div>
		</div>

		<!-- Investment Size Range (Custom) -->
		<div class="md:col-span-2">
			<label class="block text-sm font-medium mb-2">
				Custom Investment Range (Optional)
			</label>
			<div class="flex gap-4">
				<div class="flex-1">
					<input
						type="number"
						bind:value={localData.minInvestmentSize}
						placeholder="Min amount ($)"
						class="input input-bordered w-full"
					/>
				</div>
				<div class="flex-1">
					<input
						type="number"
						bind:value={localData.maxInvestmentSize}
						placeholder="Max amount ($)"
						class="input input-bordered w-full"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex justify-between pt-4">
		<Button variant="outline" onclick={() => dispatch("previous")}>
			Previous
		</Button>
		<Button onclick={handleSubmit}>Next Step</Button>
	</div>
</div>
