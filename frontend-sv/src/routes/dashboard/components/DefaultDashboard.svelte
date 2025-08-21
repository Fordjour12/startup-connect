<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { User, Settings, HelpCircle } from "@lucide/svelte";
	import { goto } from "$app/navigation";

	interface Props {
		user: any;
	}

	let { user }: Props = $props();

	function completeOnboarding() {
		goto("/onboarding");
	}
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<User class="w-5 h-5 text-blue-500" />
				Welcome to StartupConnect!
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<p class="text-muted-foreground">
				Complete your profile to unlock personalized features and
				connect with the right people in the startup ecosystem.
			</p>

			<div class="flex gap-4">
				<Button onclick={completeOnboarding}>
					Complete Profile Setup
				</Button>
				<Button variant="outline" onclick={() => goto("/profile")}>
					<Settings class="w-4 h-4 mr-2" />
					View Profile
				</Button>
			</div>
		</CardContent>
	</Card>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Getting Started</CardTitle>
			</CardHeader>
			<CardContent>
				<ul class="space-y-2 text-sm text-muted-foreground">
					<li>• Complete your onboarding to get started</li>
					<li>• Set your role (Founder, Investor, or Supporter)</li>
					<li>• Add your skills, experience, and goals</li>
					<li>• Connect with relevant opportunities</li>
				</ul>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<HelpCircle class="w-5 h-5 text-green-500" />
					Need Help?
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground text-sm mb-4">
					Check out our guide or contact support for assistance.
				</p>
				<Button variant="outline" size="sm">View Help Guide</Button>
			</CardContent>
		</Card>
	</div>
</div>
