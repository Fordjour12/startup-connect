<script lang="ts">
	import { page } from "$app/state";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	// Helper to capitalize string
	function capitalize(str: string): string {
		if (!str) return str;
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	// Derive breadcrumb segments from the pathname
	let pathSegments = $derived(() => {
		const currentUrl = page.url;
		const path = currentUrl.pathname;
		// Expecting paths like /dashboard, /dashboard/users, /dashboard/settings/profile
		if (!path.startsWith("/dashboard")) {
			return []; // Return empty array for non-dashboard routes
		}
		const segments = path.split("/").filter(Boolean); // e.g., ['', 'dashboard', 'settings'] -> ['dashboard', 'settings']
		if (segments.length === 0) return []; // Handle root '/' case if needed, though filter(Boolean) should prevent this

		// Map segments to breadcrumb item data including href and isLast flag
		let currentPath = "";
		return segments.map((segment: string, index: number) => {
			currentPath += `/${segment}`;
			return {
				name: capitalize(segment),
				href: currentPath,
				isLast: index === segments.length - 1,
			};
		});
	});

	$effect(() => {
		console.log(page.url);
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each pathSegments() as segment, i (segment.href)}
							{#if i > 0}
								<Breadcrumb.Separator />
							{/if}

							<Breadcrumb.Item>
								{#if segment.isLast}
									<Breadcrumb.Page
										>{segment.name}</Breadcrumb.Page
									>
								{:else}
									<Breadcrumb.Link href={segment.href}
										>{segment.name}</Breadcrumb.Link
									>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div class="grid auto-rows-min gap-4 md:grid-cols-3">
				<div class="bg-muted/50 aspect-video rounded-xl"></div>
				<div class="bg-muted/50 aspect-video rounded-xl"></div>
				<div class="bg-muted/50 aspect-video rounded-xl"></div>
			</div>
			<div
				class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"
			></div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
