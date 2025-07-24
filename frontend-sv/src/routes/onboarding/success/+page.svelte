<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { CheckCircle, ArrowRight } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const handleContinue = () => {
		goto(data.redirectPath);
	};
</script>

<div
	class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
>
	<div
		class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
	>
		<CheckCircle class="w-8 h-8 text-green-600" />
	</div>

	<div class="space-y-2">
		<h1 class="text-2xl font-semibold">Welcome to StartupConnect!</h1>
		<p class="text-muted-foreground max-w-md">
			Your account has been set up successfully. You're now ready to start
			your journey as a {data.role}.
		</p>
	</div>

	<div class="space-y-4">
		<Button onclick={handleContinue} class="flex items-center space-x-2">
			<span>Go to Dashboard</span>
			<ArrowRight class="w-4 h-4" />
		</Button>

		<p class="text-sm text-muted-foreground">
			You can always change your role later in your account settings.
		</p>
	</div>
</div>
