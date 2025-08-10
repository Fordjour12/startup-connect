<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Check } from "@lucide/svelte";
	import { goto } from "$app/navigation";

	let selectedRole = $state<string | null>(null);

	const roles = [
		{
			id: "founder",
			title: "Founder",
			description:
				"I'm building a startup and looking for investors, mentors, and resources",
			icon: "🚀",
			features: [
				"Connect with investors and mentors",
				"Access fundraising tools and resources",
				"Build your startup profile",
				"Get AI-powered insights and feedback",
			],
		},
		{
			id: "investor",
			title: "Investor",
			description:
				"I'm an investor looking to discover and support promising startups",
			icon: "💰",
			features: [
				"Discover promising startups",
				"Access detailed startup profiles",
				"Connect with founders directly",
				"Track your investment pipeline",
			],
		},
		{
			id: "support",
			title: "Supporter",
			description:
				"I want to support the startup ecosystem as a mentor, advisor, or service provider",
			icon: "🤝",
			features: [
				"Offer mentorship and guidance",
				"Provide professional services",
				"Connect with the startup community",
				"Share your expertise",
			],
		},
	];

	const handleRoleSelect = (roleId: string) => {
		selectedRole = roleId;
	};

	const handleTestOnboarding = () => {
		if (!selectedRole) return;

		// Simulate setting cookies
		document.cookie = `user=${JSON.stringify({
			id: "test-user-id",
			email: "test@example.com",
			full_name: "Test User",
			role: selectedRole,
			is_active: true,
			is_verified: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})}; path=/; max-age=${60 * 60 * 24 * 7}`;

		document.cookie = `access_token=test-token; path=/; max-age=${60 * 60 * 24 * 7}`;

		// Redirect to onboarding success
		goto(`/onboarding/success?role=${selectedRole}`);
	};
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-4">Onboarding Flow Test</h1>
		<p class="text-muted-foreground">
			This page demonstrates the onboarding role selection flow. Select a
			role and test the complete flow.
		</p>
	</div>

	<div class="space-y-6">
		<div class="text-center space-y-2">
			<h2 class="text-xl font-semibold">Choose your role</h2>
			<p class="text-sm text-muted-foreground">
				Select the role that best describes you to customize your
				experience
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-1">
			{#each roles as role}
				<Card
					class="cursor-pointer transition-all duration-200 hover:shadow-md {selectedRole ===
					role.id
						? 'ring-2 ring-primary bg-primary/5'
						: 'hover:bg-muted/50'}"
					onclick={() => handleRoleSelect(role.id)}
				>
					<CardHeader class="pb-3">
						<div class="flex items-start space-x-4">
							<div class="text-3xl">{role.icon}</div>
							<div class="flex-1">
								<CardTitle class="text-lg"
									>{role.title}</CardTitle
								>
								<CardDescription class="mt-1">
									{role.description}
								</CardDescription>
							</div>
							{#if selectedRole === role.id}
								<div class="flex-shrink-0">
									<div
										class="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
									>
										<Check
											class="w-4 h-4 text-primary-foreground"
										/>
									</div>
								</div>
							{/if}
						</div>
					</CardHeader>
					<CardContent class="pt-0">
						<ul class="space-y-2">
							{#each role.features as feature}
								<li
									class="flex items-center space-x-2 text-sm text-muted-foreground"
								>
									<Check
										class="w-4 h-4 text-primary flex-shrink-0"
									/>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</CardContent>
				</Card>
			{/each}
		</div>

		<div class="flex justify-center space-x-4">
			<Button
				onclick={handleTestOnboarding}
				disabled={!selectedRole}
				class="flex items-center space-x-2"
			>
				<span>Test Onboarding Flow</span>
			</Button>

			<Button variant="outline" onclick={() => goto("/onboarding")}>
				Go to Real Onboarding
			</Button>
		</div>

		<div class="text-center">
			<p class="text-xs text-muted-foreground">
				This is a test page. In the real flow, users would be redirected
				here after registration.
			</p>
		</div>
	</div>
</div>
