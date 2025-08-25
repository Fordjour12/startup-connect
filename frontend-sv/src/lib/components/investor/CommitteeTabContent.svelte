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

	// Define necessary types
	interface Deal {
		id: number;
		name: string;
		logo: string;
		industry: string;
	}

	interface TeamMember {
		id: number;
		name: string;
	}

	interface CommitteeMeeting {
		id: number;
		date: string;
		time: string;
		status: string;
		location: string;
		deals: number[];
		materials: { dealId: number; assignee: number; type: string; status: string }[];
	}

	let {
		committeeMeetings,
		getDealById,
		getTeamMemberById,
		getMaterialStatusClass,
	}: {
		committeeMeetings: CommitteeMeeting[];
		getDealById: (id: number) => Deal | undefined;
		getTeamMemberById: (id: number) => TeamMember | undefined;
		getMaterialStatusClass: (status: string) => string;
	} = $props();
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-xl font-semibold mb-4">Investment Committee Meetings</h3>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each committeeMeetings as meeting}
				<Card>
					<CardHeader class="pb-2">
						<div class="flex justify-between items-start">
							<CardTitle class="text-base">{meeting.date} • {meeting.time}</CardTitle>
							<Badge variant={meeting.status === 'scheduled' ? 'default' : 'outline'}>
								{meeting.status === 'scheduled' ? 'Scheduled' : 'Planned'}
							</Badge>
						</div>
						<CardDescription>{meeting.location}</CardDescription>
					</CardHeader>
					<CardContent class="pb-2">
						<div class="mb-4">
							<p class="text-sm font-medium mb-2">Deals to Discuss</p>
							<div class="space-y-2">
								{#each meeting.deals as dealId}
									{@const deal = getDealById(dealId)}
									{#if deal}
										<div class="flex items-center gap-2 py-1 border-b">
											<img src={deal.logo} alt={deal.name} class="w-6 h-6 rounded-full" />
											<div class="text-sm">{deal.name}</div>
											<div class="text-xs text-muted-foreground">{deal.industry}</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>

						<div>
							<p class="text-sm font-medium mb-2">Required Materials</p>
							<div class="space-y-2">
								{#each meeting.materials as material}
									{@const deal = getDealById(material.dealId)}
									{@const assignee = getTeamMemberById(material.assignee)}
									{#if deal && assignee}
										<div class="flex justify-between items-center py-1 border-b">
											<div class="flex items-center gap-2">
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
													><path
														d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
													></path><polyline points="14 2 14 8 20 8"></polyline></svg
												>
												<div>
													<div class="text-sm">{material.type}</div>
													<div class="text-xs text-muted-foreground">{deal.name}</div>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="text-xs">{assignee.name}</div>
												<Badge class={getMaterialStatusClass(material.status)}>
													{material.status === 'completed'
														? 'Completed'
														: material.status === 'in_progress'
															? 'In Progress'
															: 'Not Started'}
												</Badge>
											</div>
										</div>
									{/if}
								{/each}
							</div>
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
									><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line
										x1="16"
										x2="16"
										y1="2"
										y2="6"
									></line><line x1="8" x2="8" y1="2" y2="6"></line><line
										x1="3"
										x2="21"
										y1="10"
										y2="10"
									></line></svg
								>
								Add to Calendar
							</Button>
							<Button size="sm">Prepare Materials</Button>
						</div>
					</CardFooter>
				</Card>
			{/each}
		</div>
	</div>
</div> 