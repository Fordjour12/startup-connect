<script lang="ts">
	import { onboardingState } from "@/hooks/onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { Input } from "@/components/ui/input";
	import { Textarea } from "@/components/ui/textarea";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "@/components/ui/select";
	import {
		Check,
		Shield,
		FileText,
		Mail,
		Phone,
		Globe,
	} from "@lucide/svelte";
	import { cn } from "@/utils";
	import {
		verificationSchema,
		type VerificationInfo,
	} from "@/schemas/onboarding-schema";
	import { toast } from "svelte-sonner";

	// Form data with proper typing
	let verificationData = $state<VerificationInfo>({
		phone: "",
		linkedin: "",
		website: "",
		location: "",
		timezone: "",
		notes: "",
	});

	let termsAccepted = $state(false);
	let privacyAccepted = $state(false);
	let marketingEmails = $state(false);

	// Validation state
	let validationErrors = $state<Record<string, string>>({});

	// Initialize form with saved progress
	$effect(() => {
		// Get verification data from onboarding state
		const savedVerification = onboardingState.formData.verification as
			| VerificationInfo
			| undefined;
		if (savedVerification) {
			verificationData = {
				phone: savedVerification.phone || "",
				linkedin: savedVerification.linkedin || "",
				website: savedVerification.website || "",
				location: savedVerification.location || "",
				timezone: savedVerification.timezone || "",
				notes: savedVerification.notes || "",
			};
		}

		// Get terms data
		termsAccepted = onboardingState.formData.termsAccepted || false;
		privacyAccepted = onboardingState.formData.privacyAccepted || false;
		marketingEmails = onboardingState.formData.marketingEmails || false;
	});

	// Validate form using Zod
	function validateForm(): boolean {
		try {
			// Validate verification data
			verificationSchema.parse(verificationData);

			// Validate required terms
			if (!termsAccepted || !privacyAccepted) {
				validationErrors = {
					terms: !termsAccepted
						? "You must accept the terms and conditions"
						: "",
					privacy: !privacyAccepted
						? "You must accept the privacy policy"
						: "",
				};
				return false;
			}

			validationErrors = {};
			return true;
		} catch (error) {
			if (error instanceof Error && "errors" in error) {
				const zodErrors = (error as any).errors;
				const newErrors: Record<string, string> = {};

				zodErrors.forEach((err: any) => {
					const field = err.path[0];
					newErrors[field] = err.message;
				});

				validationErrors = newErrors;
			}
			return false;
		}
	}

	// Get error for a specific field
	function getFieldError(field: string): string {
		return validationErrors[field] || "";
	}

	// Handle next step
	const handleNext = () => {
		if (validateForm()) {
			// Update onboarding state with verification data
			onboardingState.updateFormData({
				verification: verificationData,
				termsAccepted,
				privacyAccepted,
				marketingEmails,
			});

			onboardingState.nextStep();
			toast.success("Verification details saved successfully!");
		} else {
			toast.error("Please fix the errors before continuing.");
		}
	};

	// Timezone options
	const timezoneOptions = [
		{ value: "UTC-8", label: "Pacific Time (UTC-8)" },
		{ value: "UTC-7", label: "Mountain Time (UTC-7)" },
		{ value: "UTC-6", label: "Central Time (UTC-6)" },
		{ value: "UTC-5", label: "Eastern Time (UTC-5)" },
		{ value: "UTC+0", label: "UTC" },
		{ value: "UTC+1", label: "Central European Time (UTC+1)" },
		{ value: "UTC+2", label: "Eastern European Time (UTC+2)" },
		{ value: "UTC+5:30", label: "India Standard Time (UTC+5:30)" },
		{ value: "UTC+8", label: "China Standard Time (UTC+8)" },
		{ value: "UTC+9", label: "Japan Standard Time (UTC+9)" },
	] as const;
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<div
			class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
		>
			<Shield class="w-6 h-6 text-primary" />
		</div>
		<h2 class="text-2xl font-semibold">Complete Your Profile</h2>
		<p class="text-muted-foreground">
			Verify your information to unlock all features and connect with the
			community.
		</p>
	</div>

	<!-- Contact Verification -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Mail class="w-5 h-5" />
				Contact Verification
			</CardTitle>
			<CardDescription>
				Verify your contact information to build trust with other
				members
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="phone">Phone Number</Label>
				<Input
					id="phone"
					type="tel"
					placeholder="+1 (555) 123-4567"
					bind:value={verificationData.phone}
					class={cn(getFieldError("phone") && "border-destructive")}
				/>
				{#if getFieldError("phone")}
					<p class="text-sm text-destructive">
						{getFieldError("phone")}
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="linkedin">LinkedIn Profile</Label>
				<Input
					id="linkedin"
					type="url"
					placeholder="https://linkedin.com/in/yourprofile"
					bind:value={verificationData.linkedin}
					class={cn(
						getFieldError("linkedin") && "border-destructive",
					)}
				/>
				{#if getFieldError("linkedin")}
					<p class="text-sm text-destructive">
						{getFieldError("linkedin")}
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="website">Personal/Company Website</Label>
				<Input
					id="website"
					type="url"
					placeholder="https://yourwebsite.com"
					bind:value={verificationData.website}
					class={cn(getFieldError("website") && "border-destructive")}
				/>
				{#if getFieldError("website")}
					<p class="text-sm text-destructive">
						{getFieldError("website")}
					</p>
				{/if}
			</div>
		</CardContent>
	</Card>

	<!-- Identity Verification -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Shield class="w-5 h-5" />
				Identity Verification
			</CardTitle>
			<CardDescription>
				Help us verify your identity to ensure a safe community
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="location">Location</Label>
				<Input
					id="location"
					placeholder="City, Country"
					bind:value={verificationData.location}
					class={cn(
						getFieldError("location") && "border-destructive",
					)}
				/>
				{#if getFieldError("location")}
					<p class="text-sm text-destructive">
						{getFieldError("location")}
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="timezone">Timezone</Label>
				<Select type="single" bind:value={verificationData.timezone}>
					<SelectTrigger
						class={cn(
							getFieldError("timezone") && "border-destructive",
						)}
					>
						{verificationData.timezone || "Select your timezone"}
					</SelectTrigger>
					<SelectContent>
						{#each timezoneOptions as timezone}
							<SelectItem value={timezone.value}>
								{timezone.label}
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				{#if getFieldError("timezone")}
					<p class="text-sm text-destructive">
						{getFieldError("timezone")}
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="verification-notes">Verification Notes</Label>
				<Textarea
					id="verification-notes"
					placeholder="Any additional information that might help with verification..."
					bind:value={verificationData.notes}
					class={cn(getFieldError("notes") && "border-destructive")}
					rows={3}
					maxlength={500}
				/>
				<p class="text-xs text-muted-foreground">
					{verificationData.notes?.length || 0}/500 characters
				</p>
				{#if getFieldError("notes")}
					<p class="text-sm text-destructive">
						{getFieldError("notes")}
					</p>
				{/if}
			</div>
		</CardContent>
	</Card>

	<!-- Terms and Conditions -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<FileText class="w-5 h-5" />
				Terms and Conditions
			</CardTitle>
			<CardDescription>
				Please review and accept our terms and conditions
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-3">
				<label class="flex items-start space-x-2">
					<Checkbox bind:checked={termsAccepted} />
					<div class="text-sm">
						<span class="font-medium"
							>I accept the Terms and Conditions *</span
						>
						<p class="text-muted-foreground mt-1">
							I have read and agree to the StartupConnect Terms of
							Service and Community Guidelines.
						</p>
					</div>
				</label>
				{#if getFieldError("terms")}
					<p class="text-sm text-destructive">
						{getFieldError("terms")}
					</p>
				{/if}

				<label class="flex items-start space-x-2">
					<Checkbox bind:checked={privacyAccepted} />
					<div class="text-sm">
						<span class="font-medium"
							>I accept the Privacy Policy *</span
						>
						<p class="text-muted-foreground mt-1">
							I have read and agree to how StartupConnect
							collects, uses, and protects my personal
							information.
						</p>
					</div>
				</label>
				{#if getFieldError("privacy")}
					<p class="text-sm text-destructive">
						{getFieldError("privacy")}
					</p>
				{/if}

				<label class="flex items-start space-x-2">
					<Checkbox bind:checked={marketingEmails} />
					<div class="text-sm">
						<span class="font-medium"
							>Marketing Communications (Optional)</span
						>
						<p class="text-muted-foreground mt-1">
							I would like to receive updates about new features,
							events, and opportunities from StartupConnect.
						</p>
					</div>
				</label>
			</div>
		</CardContent>
	</Card>

	<!-- Verification Checklist -->
	<Card>
		<CardHeader>
			<CardTitle>Verification Checklist</CardTitle>
			<CardDescription>
				Complete these steps to verify your profile
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-3">
				<div class="flex items-center space-x-2">
					<Check class="w-4 h-4 text-green-500" />
					<span class="text-sm">Email address verified</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if verificationData.phone}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div
							class="w-4 h-4 border-2 border-muted rounded-full"
						></div>
					{/if}
					<span class="text-sm">Phone number added</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if verificationData.linkedin}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div
							class="w-4 h-4 border-2 border-muted rounded-full"
						></div>
					{/if}
					<span class="text-sm">LinkedIn profile linked</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if verificationData.location}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div
							class="w-4 h-4 border-2 border-muted rounded-full"
						></div>
					{/if}
					<span class="text-sm">Location specified</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if termsAccepted && privacyAccepted}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div
							class="w-4 h-4 border-2 border-muted rounded-full"
						></div>
					{/if}
					<span class="text-sm"
						>Terms and privacy policy accepted</span
					>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Verification Benefits -->
	<Card>
		<CardHeader>
			<CardTitle>Benefits of Verification</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="flex items-start space-x-2">
					<Shield class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Trust & Credibility</h4>
						<p class="text-sm text-muted-foreground">
							Verified profiles are more trusted by the community
						</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Globe class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Better Connections</h4>
						<p class="text-sm text-muted-foreground">
							Access to premium features and priority matching
						</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Check class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Profile Completeness</h4>
						<p class="text-sm text-muted-foreground">
							Complete profiles get 3x more connection requests
						</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Mail class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Direct Messaging</h4>
						<p class="text-sm text-muted-foreground">
							Unlock direct messaging with other verified members
						</p>
					</div>
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

		<Button onclick={handleNext}>Complete Profile</Button>
	</div>
</div>
