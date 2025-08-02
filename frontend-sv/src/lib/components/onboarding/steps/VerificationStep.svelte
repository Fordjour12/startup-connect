<script lang="ts">
	import { onboardingState } from "@/hooks/onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { Input } from "@/components/ui/input";
	import { Textarea } from "@/components/ui/textarea";
	import { Check, Shield, FileText, Mail, Phone, Globe } from "@lucide/svelte";

	let verificationData = $derived(onboardingState.formData.verification || {});
	let termsAccepted = $derived(onboardingState.formData.termsAccepted || false);
	let privacyAccepted = $derived(onboardingState.formData.privacyAccepted || false);
	let marketingEmails = $derived(onboardingState.formData.marketingEmails || false);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<h1 class="text-3xl font-bold">Profile Verification</h1>
		<p class="text-muted-foreground">
			Complete your profile verification to unlock all features and connect with the community.
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
				Verify your contact information to build trust with other members
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
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, phone: verificationData.phone } })}
				/>
			</div>

			<div class="space-y-2">
				<Label for="linkedin">LinkedIn Profile</Label>
				<Input
					id="linkedin"
					type="url"
					placeholder="https://linkedin.com/in/yourprofile"
					bind:value={verificationData.linkedin}
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, linkedin: verificationData.linkedin } })}
				/>
			</div>

			<div class="space-y-2">
				<Label for="website">Personal/Company Website</Label>
				<Input
					id="website"
					type="url"
					placeholder="https://yourwebsite.com"
					bind:value={verificationData.website}
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, website: verificationData.website } })}
				/>
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
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, location: verificationData.location } })}
				/>
			</div>

			<div class="space-y-2">
				<Label for="timezone">Timezone</Label>
				<select
					id="timezone"
					bind:value={verificationData.timezone}
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, timezone: verificationData.timezone } })}
					class="w-full p-2 border rounded-md bg-background"
				>
					<option value="">Select your timezone</option>
					<option value="UTC-8">Pacific Time (UTC-8)</option>
					<option value="UTC-7">Mountain Time (UTC-7)</option>
					<option value="UTC-6">Central Time (UTC-6)</option>
					<option value="UTC-5">Eastern Time (UTC-5)</option>
					<option value="UTC+0">UTC</option>
					<option value="UTC+1">Central European Time (UTC+1)</option>
					<option value="UTC+2">Eastern European Time (UTC+2)</option>
					<option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
					<option value="UTC+8">China Standard Time (UTC+8)</option>
					<option value="UTC+9">Japan Standard Time (UTC+9)</option>
				</select>
			</div>

			<div class="space-y-2">
				<Label for="verification-notes">Verification Notes</Label>
				<Textarea
					id="verification-notes"
					placeholder="Any additional information that might help with verification..."
					bind:value={verificationData.notes}
					onchange={() => onboardingState.updateFormData({ verification: { ...verificationData, notes: verificationData.notes } })}
					rows={3}
				/>
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
					<Checkbox
						bind:checked={termsAccepted}
						onchange={() => onboardingState.updateFormData({ termsAccepted })}
					/>
					<div class="text-sm">
						<span class="font-medium">I accept the Terms and Conditions *</span>
						<p class="text-muted-foreground mt-1">
							I have read and agree to the StartupConnect Terms of Service and Community Guidelines.
						</p>
					</div>
				</label>

				<label class="flex items-start space-x-2">
					<Checkbox
						bind:checked={privacyAccepted}
						onchange={() => onboardingState.updateFormData({ privacyAccepted })}
					/>
					<div class="text-sm">
						<span class="font-medium">I accept the Privacy Policy *</span>
						<p class="text-muted-foreground mt-1">
							I have read and agree to how StartupConnect collects, uses, and protects my personal information.
						</p>
					</div>
				</label>

				<label class="flex items-start space-x-2">
					<Checkbox
						bind:checked={marketingEmails}
						onchange={() => onboardingState.updateFormData({ marketingEmails })}
					/>
					<div class="text-sm">
						<span class="font-medium">Marketing Communications (Optional)</span>
						<p class="text-muted-foreground mt-1">
							I would like to receive updates about new features, events, and opportunities from StartupConnect.
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
						<div class="w-4 h-4 border-2 border-muted rounded-full"></div>
					{/if}
					<span class="text-sm">Phone number added</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if verificationData.linkedin}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div class="w-4 h-4 border-2 border-muted rounded-full"></div>
					{/if}
					<span class="text-sm">LinkedIn profile linked</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if verificationData.location}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div class="w-4 h-4 border-2 border-muted rounded-full"></div>
					{/if}
					<span class="text-sm">Location specified</span>
				</div>
				<div class="flex items-center space-x-2">
					{#if termsAccepted && privacyAccepted}
						<Check class="w-4 h-4 text-green-500" />
					{:else}
						<div class="w-4 h-4 border-2 border-muted rounded-full"></div>
					{/if}
					<span class="text-sm">Terms and privacy policy accepted</span>
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
						<p class="text-sm text-muted-foreground">Verified profiles are more trusted by the community</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Globe class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Better Connections</h4>
						<p class="text-sm text-muted-foreground">Access to premium features and priority matching</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Check class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Profile Completeness</h4>
						<p class="text-sm text-muted-foreground">Complete profiles get 3x more connection requests</p>
					</div>
				</div>
				<div class="flex items-start space-x-2">
					<Mail class="w-5 h-5 text-primary mt-0.5" />
					<div>
						<h4 class="font-medium">Direct Messaging</h4>
						<p class="text-sm text-muted-foreground">Unlock direct messaging with other verified members</p>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</div> 