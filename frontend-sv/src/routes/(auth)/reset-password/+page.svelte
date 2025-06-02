<script lang="ts">
	import ResetPasswordForm from "$lib/components/ResetPasswordForm.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div
	class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div
		class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
	>
		<div class="absolute inset-0 bg-primary"></div>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<img src="/logo.svg" alt="Logo" class="h-8 w-8 mr-2" />
			StartupConnect
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					"Almost there! Create a new secure password for your
					account."
				</p>
				<footer class="text-sm">Security Team, StartupConnect</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div
			class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
		>
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Set new password
				</h1>
				<p class="text-sm text-muted-foreground">
					Enter your new password below
				</p>
			</div>
			<ResetPasswordForm {data} />

			<p class="px-8 text-center text-sm text-muted-foreground">
				Remember your password?
				<a
					href="/login"
					class="hover:text-brand underline underline-offset-4"
				>
					Back to login
				</a>
			</p>
		</div>
	</div>
</div>
