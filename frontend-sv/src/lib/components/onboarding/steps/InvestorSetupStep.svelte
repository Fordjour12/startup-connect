<script lang="ts">
	import { onboardingState } from "@/hooks/onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Textarea } from "@/components/ui/textarea";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
	import { DollarSign, TrendingUp, Target, Briefcase, BarChart3 } from "@lucide/svelte";
	import { toast } from "svelte-sonner";

	// Form state
	let investmentSize = $state<"under_50k" | "50k_100k" | "100k_500k" | "500k_1m" | "1m_plus">("100k_500k");
	let preferredStages = $state<string[]>([]);
	let investmentHistory = $state("");
	let riskAppetite = $state<"conservative" | "moderate" | "aggressive">("moderate");
	let portfolioCompanies = $state<number>(0);
	let investmentFocus = $state<string[]>([]);
	let geographicPreference = $state<string[]>([]);
	let investmentTimeline = $state<"immediate" | "3_months" | "6_months" | "12_months" | "flexible">("flexible");
	let coInvestmentPreference = $state<"yes" | "no" | "sometimes">("sometimes");

	let isSubmitting = $state(false);

	// Investment focus options
	const focusOptions = [
		"FinTech", "HealthTech", "SaaS", "E-commerce", "AI/ML", "Blockchain",
		"CleanTech", "EdTech", "Real Estate", "Manufacturing", "Transportation", "Other"
	];

	// Geographic options
	const geographicOptions = [
		"North America", "Europe", "Asia Pacific", "Latin America", "Africa", "Global"
	];

	// Stage options
	const stageOptions = [
		{ id: "pre_seed", label: "Pre-Seed" },
		{ id: "seed", label: "Seed" },
		{ id: "series_a", label: "Series A" },
		{ id: "series_b", label: "Series B" },
		{ id: "growth", label: "Growth" }
	];

	// Initialize form with saved progress
	$effect(() => {
		const savedData = onboardingState.formData;
		if (savedData.role === "investor") {
			// Load any saved investor-specific data
			// This will be implemented when we add investor data to the schema
		}
	});

	// Toggle array values
	function toggleArrayValue(array: string[], value: string): string[] {
		if (array.includes(value)) {
			return array.filter(item => item !== value);
		} else {
			return [...array, value];
		}
	}

	// Validate form
	function validateForm(): boolean {
		if (preferredStages.length === 0) {
			toast.error("Please select at least one preferred investment stage");
			return false;
		}
		if (investmentFocus.length === 0) {
			toast.error("Please select at least one investment focus area");
			return false;
		}
		return true;
	}

	const handleNext = () => {
		if (isSubmitting) return;

		if (validateForm()) {
			isSubmitting = true;

			try {
				// Save investor-specific data
				const investorData = {
					investmentSize,
					preferredStages,
					investmentHistory,
					riskAppetite,
					portfolioCompanies,
					investmentFocus,
					geographicPreference,
					investmentTimeline,
					coInvestmentPreference
				};

				// For now, we'll store this in a custom field until schema is updated
				onboardingState.updateFormData({
					// @ts-ignore - Will be properly typed when schema is updated
					investorData
				});

				// Mark this step as complete
				onboardingState.markStepComplete("investor-setup");

				onboardingState.nextStep();

				toast.success("Investor information saved successfully!", {
					id: "investor-setup-saved",
					duration: 3000
				});
			} catch (error) {
				console.error("Error saving investor info:", error);
				toast.error("Failed to save information. Please try again.");
			} finally {
				setTimeout(() => {
					isSubmitting = false;
				}, 1000);
			}
		}
	};

	const handleBack = () => {
		onboardingState.previousStep();
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<div class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
			<DollarSign class="w-6 h-6 text-primary" />
		</div>
		<h2 class="text-2xl font-semibold">Tell us about your investment preferences</h2>
		<p class="text-muted-foreground">
			Help founders and startups understand your investment criteria
		</p>
	</div>

	<!-- Investment Profile -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<DollarSign class="w-5 h-5" />
				<span>Investment Profile</span>
			</CardTitle>
			<CardDescription>
				Your typical investment size and preferences
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Investment Size -->
			<div class="space-y-2">
				<Label>Typical Investment Size</Label>
				<Select bind:value={investmentSize}>
					<SelectTrigger>
						<SelectValue placeholder="Select investment size" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="under_50k">Under $50k</SelectItem>
						<SelectItem value="50k_100k">$50k - $100k</SelectItem>
						<SelectItem value="100k_500k">$100k - $500k</SelectItem>
						<SelectItem value="500k_1m">$500k - $1M</SelectItem>
						<SelectItem value="1m_plus">$1M+</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Preferred Stages -->
			<div class="space-y-2">
				<Label>Preferred Investment Stages *</Label>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each stageOptions as stage}
						<Button
							variant={preferredStages.includes(stage.id) ? "default" : "outline"}
							onclick={() => preferredStages = toggleArrayValue(preferredStages, stage.id)}
							type="button"
							class="justify-start text-sm h-9"
						>
							{stage.label}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Risk Appetite -->
			<div class="space-y-2">
				<Label>Risk Appetite</Label>
				<Select bind:value={riskAppetite}>
					<SelectTrigger>
						<SelectValue placeholder="Select risk tolerance" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="conservative">Conservative</SelectItem>
						<SelectItem value="moderate">Moderate</SelectItem>
						<SelectItem value="aggressive">Aggressive</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Portfolio Companies -->
			<div class="space-y-2">
				<Label for="portfolioCompanies">Number of Portfolio Companies</Label>
				<Input
					id="portfolioCompanies"
					type="number"
					min="0"
					bind:value={portfolioCompanies}
					placeholder="0"
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Investment Focus -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Target class="w-5 h-5" />
				<span>Investment Focus</span>
			</CardTitle>
			<CardDescription>
				What types of companies are you most interested in?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label>Investment Focus Areas *</Label>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each focusOptions as focus}
						<Button
							variant={investmentFocus.includes(focus) ? "default" : "outline"}
							onclick={() => investmentFocus = toggleArrayValue(investmentFocus, focus)}
							type="button"
							class="justify-start text-sm h-9"
						>
							{focus}
						</Button>
					{/each}
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Geographic & Timeline -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<BarChart3 class="w-5 h-5" />
				<span>Geographic & Timeline Preferences</span>
			</CardTitle>
			<CardDescription>
				Where and when do you prefer to invest?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Geographic Preference -->
			<div class="space-y-2">
				<Label>Geographic Preference</Label>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each geographicOptions as geo}
						<Button
							variant={geographicPreference.includes(geo) ? "default" : "outline"}
							onclick={() => geographicPreference = toggleArrayValue(geographicPreference, geo)}
							type="button"
							class="justify-start text-sm h-9"
						>
							{geo}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Investment Timeline -->
			<div class="space-y-2">
				<Label>Investment Timeline</Label>
				<Select bind:value={investmentTimeline}>
					<SelectTrigger>
						<SelectValue placeholder="Select timeline" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="immediate">Immediate</SelectItem>
						<SelectItem value="3_months">Within 3 months</SelectItem>
						<SelectItem value="6_months">Within 6 months</SelectItem>
						<SelectItem value="12_months">Within 12 months</SelectItem>
						<SelectItem value="flexible">Flexible</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Co-Investment Preference -->
			<div class="space-y-2">
				<Label>Co-Investment Preference</Label>
				<Select bind:value={coInvestmentPreference}>
					<SelectTrigger>
						<SelectValue placeholder="Select preference" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="yes">Yes, prefer co-investing</SelectItem>
						<SelectItem value="sometimes">Sometimes, open to it</SelectItem>
						<SelectItem value="no">No, prefer solo investments</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Investment History -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Briefcase class="w-5 h-5" />
				<span>Investment Experience</span>
			</CardTitle>
			<CardDescription>
				Tell us about your investment background
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="investmentHistory">Investment History (Optional)</Label>
				<Textarea
					id="investmentHistory"
					placeholder="Briefly describe your investment experience, notable exits, or investment philosophy..."
					bind:value={investmentHistory}
					rows={4}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Action Buttons -->
	<div class="flex justify-between items-center pt-4">
		<Button variant="outline" onclick={handleBack}>
			Back
		</Button>

		<Button onclick={handleNext} disabled={isSubmitting}>
			{isSubmitting ? "Saving..." : "Continue"}
		</Button>
	</div>

	<!-- Tips -->
	<Card class="border-foreground/50 bg-foreground/20">
		<CardContent class="pt-6">
			<div class="flex items-start space-x-3">
				<div class="w-5 h-5 bg-background/50 rounded-full flex items-center justify-center mt-0.5">
					<span class="text-white text-xs">💡</span>
				</div>
				<div class="text-sm">
					<p class="font-medium mb-1 font-head">Investor Tips</p>
					<ul class="space-y-1">
						<li>• Be specific about your investment criteria</li>
						<li>• Highlight your areas of expertise</li>
						<li>• Be realistic about investment size and timeline</li>
						<li>• You can update this information later</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
