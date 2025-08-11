<script lang="ts">
	import { Button } from "@/components/ui/button";
	import UserIcon from "@lucide/svelte/icons/user";
</script>

<div class="flex items-center gap-2">
	<a href="/login">
		<Button variant="ghost" size="sm">
			<UserIcon class="mr-2 h-4 w-4" />
			Log In
		</Button>
	</a>
	<a href="/register">
		<Button size="sm">Sign Up</Button>
	</a>
</div>
