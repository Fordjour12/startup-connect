<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";

	// Define necessary types (ideally from a shared types file)
	interface TeamMember {
		id: number;
		name: string;
		avatar: string;
		role: string;
	}

	interface ExternalCollaborator {
		id: number;
		name: string;
		type: string;
		contactName: string;
		email: string;
	}

	interface SharedDealItem {
		dealId: number;
		notes: string;
		sharedWith: { name: string; access: string; sharedOn: string }[];
	}

	interface Deal {
		id: number;
		name: string;
		logo: string;
		industry: string;
	}

	let {
		teamMembers,
		externalCollaborators,
		sharedDeals,
		getDealById,
	}: {
		teamMembers: TeamMember[];
		externalCollaborators: ExternalCollaborator[];
		sharedDeals: SharedDealItem[];
		getDealById: (id: number) => Deal | undefined;
	} = $props();
</script>

<div class="space-y-6">
	<!-- Team Members -->
	<div>
		<h3 class="text-xl font-semibold mb-4">Team Members</h3>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
		>
			{#each teamMembers as member}
				<Card>
					<CardContent class="p-4">
						<div class="flex items-center gap-3">
							<img
								src={member.avatar}
								alt={member.name}
								class="w-10 h-10 rounded-full"
							/>
							<div>
								<p class="font-medium text-sm">{member.name}</p>
								<p class="text-xs text-muted-foreground">
									{member.role}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>

	<!-- External Collaborators -->
	<div>
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-xl font-semibold">External Collaborators</h3>
			<Button variant="outline" size="sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-2"
					><line x1="12" x2="12" y1="5" y2="19"></line><line
						x1="5"
						x2="19"
						y1="12"
						y2="12"
					></line></svg
				>
				Add Collaborator
			</Button>
		</div>

		<Card>
			<CardContent class="p-0">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b">
								<th class="text-left p-3 font-medium text-sm"
									>Name</th
								>
								<th class="text-left p-3 font-medium text-sm"
									>Type</th
								>
								<th class="text-left p-3 font-medium text-sm"
									>Contact</th
								>
								<th class="text-left p-3 font-medium text-sm"
									>Email</th
								>
								<th class="text-left p-3 font-medium text-sm"
									>Actions</th
								>
							</tr>
						</thead>
						<tbody>
							{#each externalCollaborators as collaborator}
								<tr class="border-b hover:bg-muted/50">
									<td class="p-3 text-sm"
										>{collaborator.name}</td
									>
									<td class="p-3 text-sm"
										>{collaborator.type}</td
									>
									<td class="p-3 text-sm"
										>{collaborator.contactName}</td
									>
									<td class="p-3 text-sm"
										>{collaborator.email}</td
									>
									<td class="p-3 text-sm">
										<Button variant="ghost" size="sm"
											>Share</Button
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Shared Deals -->
	<div>
		<h3 class="text-xl font-semibold mb-4">Shared Deals</h3>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each sharedDeals as sharedDeal}
				{@const deal = getDealById(sharedDeal.dealId)}
				{#if deal}
					<Card>
						<CardHeader class="pb-2">
							<div class="flex justify-between items-start">
								<div class="flex items-center gap-2">
									<img
										src={deal.logo}
										alt={deal.name}
										class="w-10 h-10 rounded-full"
									/>
									<div>
										<CardTitle class="text-base"
											>{deal.name}</CardTitle
										>
										<CardDescription class="text-sm"
											>{deal.industry}</CardDescription
										>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent class="pb-2">
							<div class="mb-3 text-sm">
								<p class="text-muted-foreground">
									{sharedDeal.notes}
								</p>
							</div>

							<div>
								<p class="text-sm font-medium mb-2">
									Shared With
								</p>
								{#each sharedDeal.sharedWith as share}
									<div
										class="flex justify-between items-center py-1 border-b text-sm"
									>
										<span>{share.name}</span>
										<div class="flex items-center gap-2">
											<Badge
												variant={share.access === "full"
													? "default"
													: "secondary"}
											>
												{share.access === "full"
													? "Full Access"
													: "View Only"}
											</Badge>
											<span
												class="text-xs text-muted-foreground"
												>{share.sharedOn}</span
											>
										</div>
									</div>
								{/each}
							</div>
						</CardContent>
						<CardFooter>
							<div class="flex justify-between w-full">
								<Button variant="outline" size="sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2"
										><path
											d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
										></path><polyline points="16 6 12 2 8 6"
										></polyline><line
											x1="12"
											x2="12"
											y1="2"
											y2="15"
										></line></svg
									>
									Share With More
								</Button>
								<Button variant="ghost" size="sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2"
										><path
											d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
										></path><path
											d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
										></path></svg
									>
									Manage Access
								</Button>
							</div>
						</CardFooter>
					</Card>
				{/if}
			{/each}

			{#if sharedDeals.length === 0}
				<Card class="col-span-full">
					<CardContent class="p-8 text-center">
						<p class="text-muted-foreground mb-4">
							No shared deals
						</p>
						<Button>Share a Deal</Button>
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>
</div>
