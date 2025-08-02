<script lang="ts">
	import { onboardingState } from "../onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { Textarea } from "@/components/ui/textarea";
	import { Target, Clock, Plus } from "@lucide/svelte";
	import { cn } from "@/utils";

	// Form data
	let formData = $state({
		primaryGoal: onboardingState.formData.primaryGoal || "",
		specificNeeds: onboardingState.formData.specificNeeds || [],
		timeCommitment: onboardingState.formData.timeCommitment || "",
		additionalGoals: onboardingState.formData.additionalGoals || "",
	});

	// Validation
	let isValid = $derived(
		formData.primaryGoal &&
			formData.specificNeeds.length > 0 &&
			formData.timeCommitment,
	);

	// Update onboarding state when form data changes
	$effect(() => {
		if (isValid) {
			onboardingState.updateFormData(formData);
		}
	});

	const primaryGoals = [
		{
			value: "find_cofounders",
			label: "Find Co-founders",
			description: "Looking for partners to build my startup with",
			icon: "👥",
		},
		{
			value: "raise_funding",
			label: "Raise Funding",
			description: "Seeking investment to grow my startup",
			icon: "💰",
		},
		{
			value: "find_investors",
			label: "Find Investors",
			description: "Looking for investors to connect with",
			icon: "🎯",
		},
		{
			value: "offer_mentorship",
			label: "Offer Mentorship",
			description: "Want to help other founders succeed",
			icon: "🤝",
		},
		{
			value: "provide_services",
			label: "Provide Services",
			description: "Offer professional services to startups",
			icon: "🛠️",
		},
		{
			value: "invest_in_startups",
			label: "Invest in Startups",
			description: "Looking for promising startups to invest in",
			icon: "📈",
		},
		{
			value: "network",
			label: "Network",
			description: "Connect with the startup community",
			icon: "🌐",
		},
		{
			value: "learn",
			label: "Learn",
			description: "Learn from experienced founders and investors",
			icon: "📚",
		},
	];

	const specificNeeds = [
		{ value: "technical_expertise", label: "Technical Expertise" },
		{ value: "business_development", label: "Business Development" },
		{ value: "marketing_sales", label: "Marketing & Sales" },
		{ value: "legal_advice", label: "Legal Advice" },
		{ value: "financial_planning", label: "Financial Planning" },
		{ value: "product_development", label: "Product Development" },
		{ value: "team_building", label: "Team Building" },
		{ value: "market_research", label: "Market Research" },
		{ value: "fundraising_strategy", label: "Fundraising Strategy" },
		{ value: "mentorship", label: "Mentorship" },
		{ value: "networking", label: "Networking" },
		{ value: "partnerships", label: "Partnerships" },
	];

	const timeCommitments = [
		{
			value: "1-5_hours",
			label: "1-5 hours per week",
			description: "Light engagement",
		},
		{
			value: "5-10_hours",
			label: "5-10 hours per week",
			description: "Moderate engagement",
		},
		{
			value: "10-20_hours",
			label: "10-20 hours per week",
			description: "Active engagement",
		},
		{
			value: "20+_hours",
			label: "20+ hours per week",
			description: "Full-time engagement",
		},
	];

	const handleSpecificNeedToggle = (need: string) => {
		if (formData.specificNeeds.includes(need)) {
			formData.specificNeeds = formData.specificNeeds.filter(
				(n) => n !== need,
			);
		} else {
			formData.specificNeeds = [...formData.specificNeeds, need];
		}
	};

	const handleNext = () => {
		if (isValid) {
			onboardingState.nextStep();
		}
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<div
			class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
		>
			<Target class="w-6 h-6 text-primary" />
		</div>
		<h2 class="text-2xl font-semibold">What are your goals?</h2>
		<p class="text-muted-foreground">
			This helps us connect you with the right people and resources.
		</p>
	</div>

	<!-- Primary Goal -->
	<Card>
		<CardHeader>
			<CardTitle>Primary Goal *</CardTitle>
			<CardDescription>
				What's your main reason for joining StartupConnect?
			</CardDescription>
		</CardHeader>
		<CardContent>
			<RadioGroup
				value={formData.primaryGoal}
				onValueChange={(value) => (formData.primaryGoal = value)}
				class="grid grid-cols-1 md:grid-cols-2 gap-4"
			>
				{#each primaryGoals as goal}
					<div class="flex items-center space-x-3">
						<RadioGroupItem value={goal.value} id={goal.value} />
						<Label
							for={goal.value}
							class="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
						>
							<div class="flex items-center space-x-3">
								<span class="text-2xl">{goal.icon}</span>
								<div>
									<div class="font-medium">{goal.label}</div>
									<div class="text-sm text-muted-foreground">
										{goal.description}
									</div>
								</div>
							</div>
						</Label>
					</div>
				{/each}
			</RadioGroup>
		</CardContent>
	</Card>

	<!-- Specific Needs -->
	<Card>
		<CardHeader>
			<CardTitle>Specific Needs *</CardTitle>
			<CardDescription>
				What specific help or resources are you looking for? (Select all
				that apply)
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#each specificNeeds as need}
					<div class="flex items-center space-x-2">
						<Checkbox
							id={need.value}
							checked={formData.specificNeeds.includes(
								need.value,
							)}
							onCheckedChange={() =>
								handleSpecificNeedToggle(need.value)}
						/>
						<Label for={need.value} class="text-sm cursor-pointer">
							{need.label}
						</Label>
					</div>
				{/each}
			</div>
		</CardContent>
	</Card>

	<!-- Time Commitment -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Clock class="w-5 h-5" />
				<span>Time Commitment *</span>
			</CardTitle>
			<CardDescription>
				How much time can you dedicate to the platform?
			</CardDescription>
		</CardHeader>
		<CardContent>
			<RadioGroup
				value={formData.timeCommitment}
				onValueChange={(value) => (formData.timeCommitment = value)}
				class="space-y-3"
			>
				{#each timeCommitments as commitment}
					<div class="flex items-center space-x-3">
						<RadioGroupItem
							value={commitment.value}
							id={commitment.value}
						/>
						<Label
							for={commitment.value}
							class="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
						>
							<div>
								<div class="font-medium">
									{commitment.label}
								</div>
								<div class="text-sm text-muted-foreground">
									{commitment.description}
								</div>
							</div>
						</Label>
					</div>
				{/each}
			</RadioGroup>
		</CardContent>
	</Card>

	<!-- Additional Goals -->
	<Card>
		<CardHeader>
			<CardTitle>Additional Goals</CardTitle>
			<CardDescription>
				Any other goals or objectives you'd like to share?
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Textarea
				placeholder="Tell us about any other goals, aspirations, or specific outcomes you're hoping to achieve..."
				bind:value={formData.additionalGoals}
				rows={3}
				maxlength={300}
			/>
			<p class="text-xs text-muted-foreground mt-2">
				{formData.additionalGoals.length}/300 characters
			</p>
		</CardContent>
	</Card>

	<!-- Tips -->
	<Card class="border-green-200 bg-green-50/50">
		<CardContent class="pt-6">
			<div class="flex items-start space-x-3">
				<div
					class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5"
				>
					<span class="text-white text-xs">💡</span>
				</div>
				<div class="text-sm">
					<p class="font-medium text-green-900 mb-1">Matching Tips</p>
					<ul class="text-green-700 space-y-1">
						<li>
							• Be specific about your needs to get better matches
						</li>
						<li>
							• Your time commitment helps set expectations with
							connections
						</li>
						<li>
							• You can update your goals anytime in your profile
							settings
						</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Action Buttons -->
	<div class="flex justify-between items-center pt-4">
		<Button
			variant="outline"
			onclick={() => onboardingState.previousStep()}
		>
			Back
		</Button>

		<Button onclick={handleNext} disabled={!isValid}>Continue</Button>
	</div>
</div>
