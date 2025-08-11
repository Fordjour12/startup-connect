<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "@/components/ui/dropdown-menu";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "@/components/ui/avatar";
	import { authClient } from "@/auth-client";
	import UserIcon from "@lucide/svelte/icons/user";
	import Settings from "@lucide/svelte/icons/settings";
	import LogOut from "@lucide/svelte/icons/log-out";
	import { goto } from "$app/navigation";

	interface User {
		id: string;
		name: string;
		email: string;
		image?: string;
		role?: string;
	}

	let { user } = $props<{ user: User }>();

	async function handleLogout() {
		try {
			await authClient.signOut();
			goto("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	}

	function getInitials(name: string): string {
		return name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<Button variant="ghost" class="relative h-8 w-8 rounded-full">
			<Avatar class="h-8 w-8">
				<AvatarImage src={user.image} alt={user.name} />
				<AvatarFallback>
					{getInitials(user.name)}
				</AvatarFallback>
			</Avatar>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuLabel class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{user.name}</p>
				<p class="text-xs leading-none text-muted-foreground">
					{user.email}
				</p>
				{#if user.role}
					<p
						class="text-xs leading-none text-muted-foreground capitalize"
					>
						{user.role}
					</p>
				{/if}
			</div>
		</DropdownMenuLabel>
		<DropdownMenuSeparator />
		<DropdownMenuItem>
			<button
				class="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
				onclick={() => goto("/profile")}
			>
				<UserIcon class="mr-2 h-4 w-4" />
				<span>Profile</span>
			</button>
		</DropdownMenuItem>
		<DropdownMenuItem>
			<button
				class="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
				onclick={() => goto("/settings")}
			>
				<Settings class="mr-2 h-4 w-4" />
				<span>Settings</span>
			</button>
		</DropdownMenuItem>
		<DropdownMenuSeparator />
		<DropdownMenuItem variant="destructive">
			<button
				class="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-accent-foreground rounded-sm"
				onclick={handleLogout}
			>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Log out</span>
			</button>
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
