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
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "@/components/ui/select";
	import {
		Wrench,
		Clock,
		DollarSign,
		Target,
		Users,
		Briefcase,
	} from "@lucide/svelte";
	import { toast } from "svelte-sonner";

	// Form state
	let supportType = $state<string[]>([]);
	let availability = $state<"one_off" | "ongoing" | "project_based">(
		"project_based",
	);
	let hourlyRate = $state<number>(0);
	let expertise = $state("");
	let experienceLevel = $state<"junior" | "mid_level" | "senior" | "expert">(
		"mid_level",
	);
	let serviceAreas = $state<string[]>([]);
	let projectSize = $state<"small" | "medium" | "large" | "enterprise">(
		"medium",
	);
	let remoteWork = $state<"yes" | "no" | "hybrid">("yes");
	let languages = $state<string[]>([]);

	let isSubmitting = $state(false);

	// Support type options
	const supportTypeOptions = [
		"Legal Services",
		"Accounting & Finance",
		"Marketing & PR",
		"HR & Recruitment",
		"Technical Development",
		"Design & UX",
		"Sales & Business Development",
		"Strategy & Consulting",
		"Operations",
		"Customer Support",
		"Data Analytics",
		"Other",
	];

	// Service area options
	const serviceAreaOptions = [
		"Startups",
		"SMEs",
		"Enterprise",
		"Non-profits",
		"Government",
		"All",
	];

	// Language options
	const languageOptions = [
		"English",
		"Spanish",
		"French",
		"German",
		"Chinese",
		"Japanese",
		"Arabic",
		"Other",
	];

	// Initialize form with saved progress
	$effect(() => {
		const savedData = onboardingState.formData;
		if (savedData.role === "support") {
			// Load any saved support-specific data
			// This will be implemented when we add support data to the schema
		}
	});

	// Toggle array values
	function toggleArrayValue(array: string[], value: string): string[] {
		if (array.includes(value)) {
			return array.filter((item) => item !== value);
		} else {
			return [...array, value];
		}
	}

	// Validate form
	function validateForm(): boolean {
		if (supportType.length === 0) {
			toast.error("Please select at least one support type");
			return false;
		}
		if (serviceAreas.length === 0) {
			toast.error("Please select at least one service area");
			return false;
		}
		if (!expertise.trim()) {
			toast.error("Please describe your expertise");
			return false;
		}
		return true;
	}

	const handleNext = () => {
		if (isSubmitting) return;

		if (validateForm()) {
			isSubmitting = true;

			try {
				// Save support-specific data
				const supportData = {
					supportType,
					availability,
					hourlyRate,
					expertise,
					experienceLevel,
					serviceAreas,
					projectSize,
					remoteWork,
					languages,
				};

				// For now, we'll store this in a custom field until schema is updated
				onboardingState.updateFormData({
					// @ts-ignore - Will be properly typed when schema is updated
					supportData,
				});

				// Mark this step as complete
				onboardingState.markStepComplete("support-setup");

				onboardingState.nextStep();

				toast.success("Support information saved successfully!", {
					id: "support-setup-saved",
					duration: 3000,
				});
			} catch (error) {
				console.error("Error saving support info:", error);
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
			<Wrench class="w-6 h-6 text-primary" />
		</div>
		<h2 class="text-2xl font-semibold">
			Tell us about your support services
		</h2>
		<p class="text-muted-foreground">
			Help startups and companies understand how you can support them
		</p>
	</div>

	<!-- Service Profile -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Wrench class="w-5 h-5" />
				<span>Service Profile</span>
			</CardTitle>
			<CardDescription>
				What types of support services do you offer?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Support Type -->
			<div class="space-y-2">
				<Label>Support Service Types *</Label>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each supportTypeOptions as type}
						<Button
							variant={supportType.includes(type)
								? "default"
								: "outline"}
							onclick={() =>
								(supportType = toggleArrayValue(
									supportType,
									type,
								))}
							type="button"
							class="justify-start text-sm h-9"
						>
							{type}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Experience Level -->
			<div class="space-y-2">
				<Label>Experience Level</Label>
				<Select bind:value={experienceLevel}>
					<SelectTrigger>
						<SelectValue placeholder="Select experience level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="junior"
							>Junior (1-3 years)</SelectItem
						>
						<SelectItem value="mid_level"
							>Mid-level (3-7 years)</SelectItem
						>
						<SelectItem value="senior"
							>Senior (7-15 years)</SelectItem
						>
						<SelectItem value="expert"
							>Expert (15+ years)</SelectItem
						>
					</SelectContent>
				</Select>
			</div>

			<!-- Service Areas -->
			<div class="space-y-2">
				<Label>Target Service Areas *</Label>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each serviceAreaOptions as area}
						<Button
							variant={serviceAreas.includes(area)
								? "default"
								: "outline"}
							onclick={() =>
								(serviceAreas = toggleArrayValue(
									serviceAreas,
									area,
								))}
							type="button"
							class="justify-start text-sm h-9"
						>
							{area}
						</Button>
					{/each}
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Availability & Pricing -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Clock class="w-5 h-5" />
				<span>Availability & Pricing</span>
			</CardTitle>
			<CardDescription>
				When and how do you prefer to work?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Availability -->
			<div class="space-y-2">
				<Label>Availability Type</Label>
				<Select bind:value={availability}>
					<SelectTrigger>
						<SelectValue placeholder="Select availability" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="one_off">One-off projects</SelectItem
						>
						<SelectItem value="ongoing">Ongoing support</SelectItem>
						<SelectItem value="project_based"
							>Project-based work</SelectItem
						>
					</SelectContent>
				</Select>
			</div>

			<!-- Project Size -->
			<div class="space-y-2">
				<Label>Preferred Project Size</Label>
				<Select bind:value={projectSize}>
					<SelectTrigger>
						<SelectValue placeholder="Select project size" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="small">Small (1-2 weeks)</SelectItem>
						<SelectItem value="medium"
							>Medium (1-3 months)</SelectItem
						>
						<SelectItem value="large">Large (3-6 months)</SelectItem
						>
						<SelectItem value="enterprise"
							>Enterprise (6+ months)</SelectItem
						>
					</SelectContent>
				</Select>
			</div>

			<!-- Remote Work -->
			<div class="space-y-2">
				<Label>Remote Work Preference</Label>
				<Select bind:value={remoteWork}>
					<SelectTrigger>
						<SelectValue placeholder="Select preference" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="yes">Fully remote</SelectItem>
						<SelectItem value="hybrid"
							>Hybrid (remote + on-site)</SelectItem
						>
						<SelectItem value="no">On-site only</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Hourly Rate -->
			<div class="space-y-2">
				<Label for="hourlyRate">Hourly Rate (USD)</Label>
				<Input
					id="hourlyRate"
					type="number"
					min="0"
					step="5"
					bind:value={hourlyRate}
					placeholder="e.g., 50"
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Expertise & Languages -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<Target class="w-5 h-5" />
				<span>Expertise & Languages</span>
			</CardTitle>
			<CardDescription>
				Describe your expertise and language capabilities
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Expertise -->
			<div class="space-y-2">
				<Label for="expertise">Area of Expertise *</Label>
				<Textarea
					id="expertise"
					placeholder="Describe your specific expertise, certifications, and key skills..."
					bind:value={expertise}
					rows={4}
				/>
			</div>

			<!-- Languages -->
			<div class="space-y-2">
				<Label>Languages Spoken</Label>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					{#each languageOptions as language}
						<Button
							variant={languages.includes(language)
								? "default"
								: "outline"}
							onclick={() =>
								(languages = toggleArrayValue(
									languages,
									language,
								))}
							type="button"
							class="justify-start text-sm h-9"
						>
							{language}
						</Button>
					{/each}
				</div>
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
					<p class="font-medium mb-1 font-head">
						Support Provider Tips
					</p>
					<ul class="space-y-1">
						<li>• Be specific about your service offerings</li>
						<li>• Highlight your relevant experience</li>
						<li>• Set realistic pricing expectations</li>
						<li>• You can update this information later</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
