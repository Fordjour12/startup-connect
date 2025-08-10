<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Check } from "@lucide/svelte";

	interface PricingTier {
		name: string;
		price: string;
		features: string[];
		isFeatured?: boolean;
		cta: string;
	}

	const tiers: PricingTier[] = [
		{
			name: "Free",
			price: "$0/mo",
			features: ["1 Project", "Basic Analytics", "Community Support"],
			cta: "Get Started",
		},
		{
			name: "Pro",
			price: "$29/mo",
			features: [
				"Unlimited Projects",
				"Advanced Analytics",
				"Priority Support",
				"Team Collaboration (3 users)",
			],
			isFeatured: true,
			cta: "Choose Pro",
		},
		{
			name: "Enterprise",
			price: "Custom",
			features: [
				"Everything in Pro",
				"Dedicated Account Manager",
				"Custom Integrations",
				"SLA & Security Reviews",
			],
			cta: "Contact Sales",
		},
	];
</script>

<div class="container mx-auto px-4 py-12">
	<header class="text-center mb-12">
		<h1 class="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
		<p class="text-lg text-muted-foreground">
			Choose the plan that's right for your startup.
		</p>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		{#each tiers as tier}
			<div
				class={`rounded-lg p-6 flex flex-col ${
					tier.isFeatured
						? "border-2 border-primary shadow-xl"
						: "border border-border bg-card"
				}`}
			>
				<h2 class="text-2xl font-semibold mb-2 text-card-foreground">
					{tier.name}
				</h2>
				<p class="text-3xl font-bold mb-4 text-card-foreground">
					{tier.price}
				</p>
				<p class="text-sm text-muted-foreground mb-6">
					{#if tier.name === "Free"}
						For individuals and small projects.
					{:else if tier.name === "Pro"}
						For growing teams and businesses.
					{:else}
						For large organizations with custom needs.
					{/if}
				</p>

				<ul class="space-y-3 mb-8 flex-grow">
					{#each tier.features as feature}
						<li class="flex items-center">
							<Check class="h-5 w-5 text-primary mr-2 shrink-0" />
							<span class="text-card-foreground">{feature}</span>
						</li>
					{/each}
				</ul>

				<Button
					variant={tier.isFeatured ? "default" : "outline"}
					class="w-full mt-auto {tier.isFeatured
						? ''
						: 'border-primary text-primary hover:bg-primary/10'}"
				>
					{tier.cta}
				</Button>
			</div>
		{/each}
	</div>

	<section class="mt-16 text-center">
		<h3 class="text-2xl font-semibold mb-4">
			Not sure which plan is right for you?
		</h3>
		<p class="text-muted-foreground mb-6">
			Contact our sales team for a personalized consultation.
		</p>
		<Button variant="link" href="/contact" class="text-primary"
			>Contact Us</Button
		>
	</section>
</div>

<style>
	/* You can add any additional global styles or overrides here if needed */
</style>
