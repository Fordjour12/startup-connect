<script lang="ts">
	import { goto } from "$app/navigation";
	import { cn } from "$lib/utils";

	interface NavItem {
		href: string;
		label: string;
		icon: string;
	}

	interface Props {
		organization: any;
		navigationItems: NavItem[];
		currentPath: string;
		isLoading: boolean;
	}

	let { organization, navigationItems, currentPath, isLoading }: Props =
		$props();

	function getIconComponent(iconName: string) {
		const iconMap: Record<string, string> = {
			LayoutDashboard:
				"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
			Briefcase:
				"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8",
			TrendingUp: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
			Users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
			FileCheck:
				"M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z M14 2v6h6m-6 4l2 2 4-4",
			Settings:
				"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
		};

		return iconMap[iconName] || iconMap.LayoutDashboard;
	}

	function isActive(href: string): boolean {
		if (href === "/dashboard/investor/organization/overview") {
			return (
				currentPath === "/dashboard/investor/organization" ||
				currentPath === "/dashboard/investor/organization/" ||
				currentPath === "/dashboard/investor/organization/overview"
			);
		}
		return currentPath.startsWith(href);
	}
</script>

<div class="flex flex-col h-full">
	<!-- Organization Info -->
	<div class="p-6 border-b">
		{#if isLoading}
			<div class="animate-pulse">
				<div class="h-8 bg-muted rounded mb-2"></div>
				<div class="h-4 bg-muted rounded w-3/4"></div>
			</div>
		{:else if organization}
			<div class="flex items-center space-x-3">
				{#if organization.logo}
					<img
						src={organization.logo}
						alt={organization.name}
						class="w-10 h-10 rounded-lg object-cover"
					/>
				{:else}
					<div
						class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
					>
						<span class="text-primary font-semibold text-lg">
							{organization.name.charAt(0).toUpperCase()}
						</span>
					</div>
				{/if}
				<div class="flex-1 min-w-0">
					<h2
						class="font-semibold text-sm truncate"
						title={organization.name}
					>
						{organization.name}
					</h2>
					<p class="text-xs text-muted-foreground capitalize">
						{organization.type.replace("_", " ")}
					</p>
					{#if organization.verified}
						<div class="flex items-center mt-1">
							<svg
								class="w-3 h-3 text-green-500 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-xs text-green-600">Verified</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Navigation Menu -->
	<nav class="flex-1 p-4">
		<ul class="space-y-2">
			{#each navigationItems as item}
				<li>
					<a
						href={item.href}
						class={cn(
							"flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
							isActive(item.href)
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						<svg
							class="w-5 h-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={getIconComponent(item.icon)}
							/>
						</svg>
						<span class="truncate">{item.label}</span>
						{#if isActive(item.href)}
							<div
								class="ml-auto w-1.5 h-1.5 bg-current rounded-full"
							></div>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Footer Actions -->
	<div class="p-4 border-t">
		<button
			onclick={() => goto("/dashboard/investor")}
			class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			<span>Back to Dashboard</span>
		</button>
	</div>
</div>
