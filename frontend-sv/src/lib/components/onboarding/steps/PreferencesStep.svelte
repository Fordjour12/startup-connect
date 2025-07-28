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
	import { Label } from "@/components/ui/label";
	import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Slider } from "@/components/ui/slider";
	import { Textarea } from "@/components/ui/textarea";
	import {
		Users,
		Globe,
		MessageSquare,
		Calendar,
		MapPin,
	} from "@lucide/svelte";

	// Initialize preferences with default values matching the schema
	let geographicPreference = $state(
		onboardingState.formData.geographicPreference || "local",
	);
	let communicationStyle = $state(
		onboardingState.formData.communicationStyle || ["email"], // Default to email
	);
	let workingStyle = $state(
		onboardingState.formData.workingStyle || "collaborative",
	);
	let diversityPreference = $state(
		onboardingState.formData.diversityPreference ?? true,
	);
	let notificationFrequency = $state(
		onboardingState.formData.notificationFrequency || "weekly",
	);

	// Use $derived for computed values to avoid function recreation
	let isVideoCallsSelected = $derived(
		communicationStyle.includes("video_calls"),
	);
	let isEmailSelected = $derived(communicationStyle.includes("email"));
	let isInPersonSelected = $derived(communicationStyle.includes("in_person"));
	let isChatSelected = $derived(communicationStyle.includes("chat"));

	// Stable function references - defined once
	const toggleVideoCalls = () => {
		if (communicationStyle.includes("video_calls")) {
			if (communicationStyle.length > 1) {
				communicationStyle = communicationStyle.filter(
					(s) => s !== "video_calls",
				);
			}
		} else {
			communicationStyle = [...communicationStyle, "video_calls"];
		}
	};

	const toggleEmail = () => {
		if (communicationStyle.includes("email")) {
			if (communicationStyle.length > 1) {
				communicationStyle = communicationStyle.filter(
					(s) => s !== "email",
				);
			}
		} else {
			communicationStyle = [...communicationStyle, "email"];
		}
	};

	const toggleInPerson = () => {
		if (communicationStyle.includes("in_person")) {
			if (communicationStyle.length > 1) {
				communicationStyle = communicationStyle.filter(
					(s) => s !== "in_person",
				);
			}
		} else {
			communicationStyle = [...communicationStyle, "in_person"];
		}
	};

	const toggleChat = () => {
		if (communicationStyle.includes("chat")) {
			if (communicationStyle.length > 1) {
				communicationStyle = communicationStyle.filter(
					(s) => s !== "chat",
				);
			}
		} else {
			communicationStyle = [...communicationStyle, "chat"];
		}
	};

	// Debounced effect to reduce update frequency
	let updateTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		// Clear existing timeout
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		// Debounce the update to avoid excessive API calls
		updateTimeout = setTimeout(() => {
			onboardingState.updateFormData({
				geographicPreference,
				communicationStyle,
				workingStyle,
				diversityPreference,
				notificationFrequency,
			});
		}, 300); // 300ms debounce
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<h1 class="text-3xl font-bold">Matching Preferences</h1>
		<p class="text-muted-foreground">
			How do you prefer to connect with others? This helps us find the
			best matches for you.
		</p>
	</div>

	<!-- Communication Preferences -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<MessageSquare class="w-5 h-5" />
				Communication Preferences
			</CardTitle>
			<CardDescription>
				How do you prefer to communicate with potential connections?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-3">
				<Label>Communication Style *</Label>
				<div class="grid grid-cols-2 gap-3">
					<label class="flex items-center space-x-2">
						<Checkbox
							checked={isVideoCallsSelected}
							onclick={toggleVideoCalls}
						/>
						<span>Video Calls</span>
					</label>
					<label class="flex items-center space-x-2">
						<Checkbox
							checked={isEmailSelected}
							onclick={toggleEmail}
						/>
						<span>Email</span>
					</label>
					<label class="flex items-center space-x-2">
						<Checkbox
							checked={isInPersonSelected}
							onclick={toggleInPerson}
						/>
						<span>In Person</span>
					</label>
					<label class="flex items-center space-x-2">
						<Checkbox
							checked={isChatSelected}
							onclick={toggleChat}
						/>
						<span>Chat</span>
					</label>
				</div>
				{#if communicationStyle.length === 0}
					<p class="text-sm text-destructive">
						Please select at least one communication style
					</p>
				{/if}
			</div>

			<div class="space-y-3">
				<Label>Working Style</Label>
				<RadioGroup bind:value={workingStyle}>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="fast_paced" />
						<span>Fast-paced</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="collaborative" />
						<span>Collaborative</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="independent" />
						<span>Independent</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="long_term" />
						<span>Long-term focused</span>
					</label>
				</RadioGroup>
			</div>
		</CardContent>
	</Card>

	<!-- Location Preferences -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<MapPin class="w-5 h-5" />
				Location Preferences
			</CardTitle>
			<CardDescription>
				Where are you open to connecting with people?
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-3">
				<Label>Geographic Preference</Label>
				<RadioGroup bind:value={geographicPreference}>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="local" />
						<span>Local</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="regional" />
						<span>Regional</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="global" />
						<span>Global</span>
					</label>
				</RadioGroup>
			</div>

			<div class="space-y-3">
				<Label>Diversity Preference</Label>
				<label class="flex items-center space-x-2">
					<Checkbox bind:checked={diversityPreference} />
					<span>I value diverse perspectives and backgrounds</span>
				</label>
			</div>

			<div class="space-y-3">
				<Label>Notification Frequency</Label>
				<RadioGroup bind:value={notificationFrequency}>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="daily" />
						<span>Daily</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="weekly" />
						<span>Weekly</span>
					</label>
					<label class="flex items-center space-x-2">
						<RadioGroupItem value="monthly" />
						<span>Monthly</span>
					</label>
				</RadioGroup>
			</div>
		</CardContent>
	</Card>
</div>
