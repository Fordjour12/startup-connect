<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { enhance } from '$app/forms';
</script>

<div class="grid gap-6">
	<form method="POST" use:enhance>
		<div class="grid gap-2 max-w-md mx-auto">
			<Label for="email">Email</Label>
			<Input type="email" name="email" />

			<Label for="password">Password</Label>
			<Input type="password" name="password" />

			<Button type="submit">Login</Button>
		</div>
	</form>
</div>
