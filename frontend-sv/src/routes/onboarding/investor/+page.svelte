<script lang="ts">
	import { investorSchema, type InvestorInfo } from "@/z-schema/onboarding-schema";
	import { Button } from "@/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
	import { Label } from "@/components/ui/label";
	import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
	import { Textarea } from "@/components/ui/textarea";
	import { toast } from "svelte-sonner";
	import { browser } from "$app/environment";
	import type { PageData } from "./$types";

	// Form state
	let investmentSize = $state<InvestorInfo["investmentSize"]>("50k_100k");
	let preferredStages = $state<InvestorInfo["preferredStages"]>([]);
	let investmentHistory = $state<InvestorInfo["investmentHistory"]>("");
	let riskAppetite = $state<InvestorInfo["riskAppetite"]>("moderate");
	let portfolioCompanies = $state<InvestorInfo["portfolioCompanies"]>(0);

	let isSubmitting = $state(false);
	let userId = $state<string | null>(null);

	// Stage options
	const stageOptions = [
		{ id: "pre_seed", label: "Pre-Seed" },
		{ id: "seed", label: "Seed" },
		{ id: "series_a", label: "Series A" },
		{ id: "series_b", label: "Series B" },
		{ id: "growth", label: "Growth" }
	];

	// Investment size options
	const investmentSizeOptions = [
		{ id: "under_50k", label: "Under $50k" },
		{ id: "50k_100k", label: "$50k - $100k" },
		{ id: "100k_500k", label: "$100k - $500k" },
		{ id: "500k_1m", label: "$500k - $1M" },
		{ id: "1m_plus", label: "$1M+" }
	];

	// Risk appetite options
	const riskAppetiteOptions = [
		{ id: "conservative", label: "Conservative" },
		{ id: "moderate", label: "Moderate" },
		{ id: "aggressive", label: "Aggressive" }
	];

	// Get user data from page data
	let { data }: { data: PageData } = $props();
	
	$effect(() => {
		if (data.user?.id) {
			userId = data.user.id;
		}
	});

	function toggleStage(stage: string) {
		if (preferredStages.includes(stage as any)) {
			preferredStages = preferredStages.filter(s => s !== stage) as any;
		} else {
			preferredStages = [...preferredStages, stage as any];
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		try {
			// Validate form data
			const formData = {
				investmentSize,
				preferredStages,
				investmentHistory,
				riskAppetite,
				portfolioCompanies
			};

			investorSchema.parse(formData);

			// Send data to API
			const response = await fetch("/api/onboarding/investor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to update investor profile");
			}

			// Mark onboarding as completed
			if (browser && userId) {
				localStorage.setItem(`role_onboarding_investor_${userId}`, "completed");
			}
			
			toast.success("Investor profile updated successfully!");
			
			// Redirect to investor dashboard
			window.location.href = "/investor-dashboard";
		} catch (error) {
			console.error("Error submitting investor onboarding:", error);
			toast.error(error.message || "Please check your inputs and try again");
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="container py-8">
	<div class="max-w-2xl mx-auto">
		<Card>
			<CardHeader>
				<CardTitle>Investor Profile Setup</CardTitle>
				<CardDescription>
					Complete your investor profile to unlock investment opportunities and connect with startups.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Investment Size -->
				<div class="space-y-2">
					<Label>Typical Investment Size</Label>
					<RadioGroup bind:value={investmentSize} class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each investmentSizeOptions as option}
							<div class="flex items-center space-x-2">
								<RadioGroupItem value={option.id} id={option.id} />
								<Label for={option.id}>{option.label}</Label>
							</div>
						{/each}
					</RadioGroup>
				</div>

				<!-- Preferred Stages -->
				<div class="space-y-2">
					<Label>Preferred Investment Stages</Label>
					<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
						{#each stageOptions as stage}
							<Button
								variant={preferredStages.includes(stage.id as any) ? "default" : "outline"}
								onclick={() => toggleStage(stage.id)}
								type="button"
								class="justify-start"
							>
								{stage.label}
							</Button>
						{/each}
					</div>
				</div>

				<!-- Risk Appetite -->
				<div class="space-y-2">
					<Label>Risk Appetite</Label>
					<RadioGroup bind:value={riskAppetite} class="grid grid-cols-1 md:grid-cols-3 gap-4">
						{#each riskAppetiteOptions as option}
							<div class="flex items-center space-x-2">
								<RadioGroupItem value={option.id} id={`risk-${option.id}`} />
								<Label for={`risk-${option.id}`}>{option.label}</Label>
							</div>
						{/each}
					</RadioGroup>
				</div>

				<!-- Portfolio Companies -->
				<div class="space-y-2">
					<Label for="portfolioCompanies">Number of Portfolio Companies</Label>
					<input
						id="portfolioCompanies"
						type="number"
						min="0"
						bind:value={portfolioCompanies}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<!-- Investment History -->
				<div class="space-y-2">
					<Label for="investmentHistory">Investment History (Optional)</Label>
					<Textarea
						id="investmentHistory"
						placeholder="Briefly describe your investment experience..."
						bind:value={investmentHistory}
						rows={4}
					/>
				</div>

				<div class="flex justify-between pt-4">
					<Button variant="outline" onclick={() => window.history.back()}>
						Back
					</Button>
					<Button onclick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Complete Profile"}
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
</div>