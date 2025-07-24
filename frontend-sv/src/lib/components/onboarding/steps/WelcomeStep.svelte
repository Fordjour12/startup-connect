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
	import { Rocket, Users, Target, Clock } from "@lucide/svelte";

	const benefits = [
		{
			icon: Rocket,
			title: "Get Started Fast",
			description: "Complete your profile in just a few minutes",
		},
		{
			icon: Users,
			title: "Connect with the Right People",
			description:
				"Find founders, investors, and mentors who match your goals",
		},
		{
			icon: Target,
			title: "Personalized Experience",
			description:
				"Get recommendations tailored to your role and interests",
		},
		{
			icon: Clock,
			title: "Save Time",
			description: "Skip optional steps and complete them later",
		},
	];
</script>

<div class="space-y-8">
	<!-- Welcome Header -->
	<div class="text-center space-y-4">
		<div
			class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
		>
			<Rocket class="w-8 h-8 text-primary" />
		</div>
		<h1 class="text-3xl font-bold">Welcome to StartupConnect!</h1>
		<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
			Let's get you set up with the perfect experience. We'll ask a few
			questions to personalize your journey and connect you with the right
			people in the startup ecosystem.
		</p>
	</div>

	<!-- Benefits Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each benefits as benefit}
			<Card class="border-0 shadow-sm">
				<CardHeader class="pb-3">
					<div class="flex items-center space-x-3">
						<div
							class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
						>
							<svelte:component
								this={benefit.icon}
								class="w-5 h-5 text-primary"
							/>
						</div>
						<div>
							<CardTitle class="text-base"
								>{benefit.title}</CardTitle
							>
							<CardDescription class="text-sm">
								{benefit.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
			</Card>
		{/each}
	</div>

	<!-- What to Expect -->
	<Card>
		<CardHeader>
			<CardTitle>What to Expect</CardTitle>
			<CardDescription>
				Here's what we'll cover in the next few steps:
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-3">
				<div class="flex items-center space-x-3">
					<div
						class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
					>
						1
					</div>
					<span class="text-sm"
						>Choose your role (Founder, Investor, or Supporter)</span
					>
				</div>
				<div class="flex items-center space-x-3">
					<div
						class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
					>
						2
					</div>
					<span class="text-sm"
						>Tell us about yourself and your goals</span
					>
				</div>
				<div class="flex items-center space-x-3">
					<div
						class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
					>
						3
					</div>
					<span class="text-sm"
						>Share your skills and expertise (optional)</span
					>
				</div>
				<div class="flex items-center space-x-3">
					<div
						class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
					>
						4
					</div>
					<span class="text-sm"
						>Set your preferences for matching</span
					>
				</div>
				<div class="flex items-center space-x-3">
					<div
						class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium"
					>
						5
					</div>
					<span class="text-sm"
						>Complete your profile and start connecting!</span
					>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Privacy Notice -->
	<Card class="border-blue-200 bg-blue-50/50">
		<CardContent class="pt-6">
			<div class="flex items-start space-x-3">
				<div
					class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5"
				>
					<span class="text-white text-xs">ℹ</span>
				</div>
				<div class="text-sm">
					<p class="font-medium text-blue-900 mb-1">
						Your privacy matters
					</p>
					<p class="text-blue-700">
						We only collect the information you choose to share. You
						can update your profile anytime, and we'll never share
						your personal information without your consent.
					</p>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Action Button -->
	<div class="text-center">
		<Button
			size="lg"
			onclick={() => onboardingState.nextStep()}
			class="px-8"
		>
			Let's Get Started
		</Button>
		<p class="text-xs text-muted-foreground mt-2">
			This will take about 5-10 minutes
		</p>
	</div>
</div>
