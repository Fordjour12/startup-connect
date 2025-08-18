<script lang="ts">
	import { supporterSchema, type SupporterInfo } from "@/z-schema/onboarding-schema";
	import { Button } from "@/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
	import { Label } from "@/components/ui/label";
	import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
	import { Textarea } from "@/components/ui/textarea";
	import { Input } from "@/components/ui/input";
	import { toast } from "svelte-sonner";
	import { browser } from "$app/environment";
	import type { PageData } from "./$types";

	// Form state
	let supportType = $state<SupporterInfo["supportType"]>([]);
	let availability = $state<SupporterInfo["availability"]>("ongoing");
	let hourlyRate = $state<SupporterInfo["hourlyRate"]>(undefined);
	let expertise = $state<SupporterInfo["expertise"]>("");

	let isSubmitting = $state(false);
	let userId = $state<string | null>(null);

	// Support type options
	const supportTypeOptions = [
		"Legal",
		"Accounting",
		"Marketing",
		"Design",
		"Development",
		"HR",
		"Business Strategy",
		"Fundraising",
		"Mentorship",
		"Other"
	];

	// Availability options
	const availabilityOptions = [
		{ id: "one_off", label: "One-off projects" },
		{ id: "ongoing", label: "Ongoing support" },
		{ id: "project_based", label: "Project-based work" }
	];

	// Get user data from page data
	let { data }: { data: PageData } = $props();
	
	$effect(() => {
		if (data.user?.id) {
			userId = data.user.id;
		}
	});

	function toggleSupportType(type: string) {
		if (supportType.includes(type)) {
			supportType = supportType.filter(t => t !== type);
		} else {
			supportType = [...supportType, type];
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		try {
			// Validate form data
			const formData = {
				supportType,
				availability,
				hourlyRate,
				expertise
			};

			supporterSchema.parse(formData);

			// Send data to API
			const response = await fetch("/api/onboarding/support", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to update supporter profile");
			}

			// Mark onboarding as completed
			if (browser && userId) {
				localStorage.setItem(`role_onboarding_support_${userId}`, "completed");
			}
			
			toast.success("Supporter profile updated successfully!");
			
			// Redirect to support dashboard
			window.location.href = "/support-dashboard";
		} catch (error) {
			console.error("Error submitting supporter onboarding:", error);
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
				<CardTitle>Supporter Profile Setup</CardTitle>
				<CardDescription>
					Complete your supporter profile to start offering your services to startups and founders.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Support Types -->
				<div class="space-y-2">
					<Label>Types of Support You Offer</Label>
					<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
						{#each supportTypeOptions as type}
							<Button
								variant={supportType.includes(type) ? "default" : "outline"}
								onclick={() => toggleSupportType(type)}
								type="button"
								class="justify-start"
							>
								{type}
							</Button>
						{/each}
					</div>
				</div>

				<!-- Availability -->
				<div class="space-y-2">
					<Label>Availability</Label>
					<RadioGroup bind:value={availability} class="grid grid-cols-1 md:grid-cols-3 gap-4">
						{#each availabilityOptions as option}
							<div class="flex items-center space-x-2">
								<RadioGroupItem value={option.id} id={`avail-${option.id}`} />
								<Label for={`avail-${option.id}`}>{option.label}</Label>
							</div>
						{/each}
					</RadioGroup>
				</div>

				<!-- Hourly Rate -->
				<div class="space-y-2">
					<Label for="hourlyRate">Hourly Rate (Optional)</Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
						<Input
							id="hourlyRate"
							type="number"
							min="0"
							step="1"
							bind:value={hourlyRate}
							class="pl-8"
							placeholder="0"
						/>
					</div>
				</div>

				<!-- Expertise -->
				<div class="space-y-2">
					<Label for="expertise">Describe Your Expertise</Label>
					<Textarea
						id="expertise"
						placeholder="Tell us about your experience and areas of expertise..."
						bind:value={expertise}
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