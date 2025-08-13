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
	import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "@/components/ui/select";
	import { Rocket, Users, Target, DollarSign } from "@lucide/svelte";
	import { toast } from "svelte-sonner";

	// Form state
	let startupName = $state("");
	let startupStage = $state<
		"idea" | "pre_seed" | "seed" | "series_a" | "series_b" | "growth"
	>("idea");
	let fundingNeeds = $state<
		| "under_10k"
		| "10k_50k"
		| "50k_100k"
		| "100k_500k"
		| "500k_1m"
		| "1m_plus"
	>("10k_50k");
	let teamSize = $state<"1" | "2_5" | "6_10" | "11_25" | "26_50" | "50_plus">(
		"1",
	);
	let startupDescription = $state("");
	let equityOffered = $state<
		"under_5" | "5_10" | "10_20" | "20_30" | "30_plus"
	>("10_20");
	let industry = $state("");
	let problemSolved = $state("");
	let targetMarket = $state("");
	let competitiveAdvantage = $state("");

	let isSubmitting = $state(false);

	// Initialize form with saved progress
	$effect(() => {
		const savedData = onboardingState.formData;
		if (savedData.role === "founder") {
			// Load any saved founder-specific data
			// This will be implemented when we add founder data to the schema
		}
	});

	// Validate form
	function validateForm(): boolean {
		if (!startupName.trim()) {
			toast.error("Please enter your startup name");
			return false;
		}
		if (!startupDescription.trim()) {
			toast.error("Please describe your startup");
			return false;
		}
		if (!problemSolved.trim()) {
			toast.error("Please describe the problem you're solving");
			return false;
		}
		return true;
	}

	const handleNext = () => {
		if (isSubmitting) return;

		if (validateForm()) {
			isSubmitting = true;

			try {
				// Save founder-specific data
				// Note: This will be properly integrated when we update the schema
				const founderData = {
					startupName,
					startupStage,
					fundingNeeds,
					teamSize,
					startupDescription,
					equityOffered,
					industry,
					problemSolved,
					targetMarket,
					competitiveAdvantage,
				};

				// For now, we'll store this in a custom field until schema is updated
				onboardingState.updateFormData({
					// @ts-ignore - Will be properly typed when schema is updated
					founderData,
				});

				// Mark this step as complete
				onboardingState.markStepComplete("founder-setup");

				onboardingState.nextStep();

				toast.success("Founder information saved successfully!", {
					id: "founder-setup-saved",
					duration: 3000,
				});
			} catch (error) {
				console.error("Error saving founder info:", error);
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
		<div
			class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
		>
			<Rocket class="w-6 h-6 text-primary" />
		</div>
		<h2 class="text-2xl font-semibold">Tell us about your startup</h2>
		<p class="text-muted-foreground">
			Help investors and supporters understand your vision and needs
		</p>
	</div>

	<!-- Startup Basics -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Rocket class="w-5 h-5" />
				<span>Startup Basics</span>
			</CardTitle>
			<CardDescription>
				Essential information about your startup
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Startup Name -->
			<div class="space-y-2">
				<Label for="startupName">Startup Name *</Label>
				<Input
					id="startupName"
					placeholder="Enter your startup name"
					bind:value={startupName}
				/>
			</div>

			<!-- Startup Stage -->
			<div class="space-y-2">
				<Label>Startup Stage *</Label>
				<Select bind:value={startupStage}>
					<SelectTrigger>
						<SelectValue placeholder="Select your startup stage" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="idea">Idea Stage</SelectItem>
						<SelectItem value="pre_seed">Pre-Seed</SelectItem>
						<SelectItem value="seed">Seed</SelectItem>
						<SelectItem value="series_a">Series A</SelectItem>
						<SelectItem value="series_b">Series B</SelectItem>
						<SelectItem value="growth">Growth Stage</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Industry -->
			<div class="space-y-2">
				<Label for="industry">Industry</Label>
				<Input
					id="industry"
					placeholder="e.g., FinTech, HealthTech, SaaS, E-commerce"
					bind:value={industry}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Problem & Solution -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Target class="w-5 h-5" />
				<span>Problem & Solution</span>
			</CardTitle>
			<CardDescription>
				What problem are you solving and how?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Problem Solved -->
			<div class="space-y-2">
				<Label for="problemSolved"
					>What problem are you solving? *</Label
				>
				<Textarea
					id="problemSolved"
					placeholder="Describe the problem your startup addresses..."
					bind:value={problemSolved}
					rows={3}
				/>
			</div>

			<!-- Target Market -->
			<div class="space-y-2">
				<Label for="targetMarket">Target Market</Label>
				<Textarea
					id="targetMarket"
					placeholder="Who are your target customers/users?"
					bind:value={targetMarket}
					rows={2}
				/>
			</div>

			<!-- Competitive Advantage -->
			<div class="space-y-2">
				<Label for="competitiveAdvantage">Competitive Advantage</Label>
				<Textarea
					id="competitiveAdvantage"
					placeholder="What makes your solution unique?"
					bind:value={competitiveAdvantage}
					rows={2}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Team & Funding -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Users class="w-5 h-5" />
				<span>Team & Funding</span>
			</CardTitle>
			<CardDescription>
				Information about your team and funding needs
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Team Size -->
			<div class="space-y-2">
				<Label>Team Size</Label>
				<Select bind:value={teamSize}>
					<SelectTrigger>
						<SelectValue placeholder="Select team size" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1">Solo Founder</SelectItem>
						<SelectItem value="2_5">2-5 people</SelectItem>
						<SelectItem value="6_10">6-10 people</SelectItem>
						<SelectItem value="11_25">11-25 people</SelectItem>
						<SelectItem value="26_50">26-50 people</SelectItem>
						<SelectItem value="50_plus">50+ people</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Funding Needs -->
			<div class="space-y-2">
				<Label>Funding Needs</Label>
				<Select bind:value={fundingNeeds}>
					<SelectTrigger>
						<SelectValue placeholder="Select funding amount" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="under_10k">Under $10k</SelectItem>
						<SelectItem value="10k_50k">$10k - $50k</SelectItem>
						<SelectItem value="50k_100k">$50k - $100k</SelectItem>
						<SelectItem value="100k_500k">$100k - $500k</SelectItem>
						<SelectItem value="500k_1m">$500k - $1M</SelectItem>
						<SelectItem value="1m_plus">$1M+</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Equity Offered -->
			<div class="space-y-2">
				<Label>Equity Offered</Label>
				<Select bind:value={equityOffered}>
					<SelectTrigger>
						<SelectValue placeholder="Select equity percentage" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="under_5">Under 5%</SelectItem>
						<SelectItem value="5_10">5% - 10%</SelectItem>
						<SelectItem value="10_20">10% - 20%</SelectItem>
						<SelectItem value="20_30">20% - 30%</SelectItem>
						<SelectItem value="30_plus">30%+</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Startup Description -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<DollarSign class="w-5 h-5" />
				<span>Startup Description</span>
			</CardTitle>
			<CardDescription>
				Provide a comprehensive overview of your startup
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="startupDescription">Startup Description *</Label>
				<Textarea
					id="startupDescription"
					placeholder="Describe your startup, its mission, and vision..."
					bind:value={startupDescription}
					rows={4}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Action Buttons -->
	<div class="flex justify-between items-center pt-4">
		<Button variant="outline" onclick={handleBack}>Back</Button>

		<Button onclick={handleNext} disabled={isSubmitting}>
			{isSubmitting ? "Saving..." : "Continue"}
		</Button>
	</div>

	<!-- Tips -->
	<Card class="border-foreground/50 bg-foreground/20">
		<CardContent class="pt-6">
			<div class="flex items-start space-x-3">
				<div
					class="w-5 h-5 bg-background/50 rounded-full flex items-center justify-center mt-0.5"
				>
					<span class="text-white text-xs">💡</span>
				</div>
				<div class="text-sm">
					<p class="font-medium mb-1 font-head">Founder Tips</p>
					<ul class="space-y-1">
						<li>• Be specific about the problem you're solving</li>
						<li>• Highlight what makes your solution unique</li>
						<li>• Be realistic about funding needs and equity</li>
						<li>• You can update this information later</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
