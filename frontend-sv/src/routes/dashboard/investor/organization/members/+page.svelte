<script lang="ts">
	import { onMount } from "svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import { ORGANIZATION_ROLES } from "$lib/db/schema";

	let members = $state([]);
	let invitations = $state([]);
	let isLoading = $state(true);
	let showInviteDialog = $state(false);
	let searchQuery = $state("");

	// Mock data - replace with real API calls
	onMount(async () => {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			members = [
				{
					id: "1",
					userId: "user-1",
					name: "John Doe",
					email: "john@techventure.com",
					avatar: null,
					role: ORGANIZATION_ROLES.OWNER,
					joinedAt: "2024-01-15T10:00:00Z",
					lastActive: "2 hours ago",
					status: "active",
				},
				{
					id: "2",
					userId: "user-2",
					name: "Sarah Johnson",
					email: "sarah@techventure.com",
					avatar: null,
					role: ORGANIZATION_ROLES.INVESTMENT_PARTNER,
					joinedAt: "2024-02-01T09:00:00Z",
					lastActive: "1 day ago",
					status: "active",
				},
				{
					id: "3",
					userId: "user-3",
					name: "Mike Chen",
					email: "mike@techventure.com",
					avatar: null,
					role: ORGANIZATION_ROLES.INVESTMENT_ANALYST,
					joinedAt: "2024-02-15T14:30:00Z",
					lastActive: "30 minutes ago",
					status: "active",
				},
				{
					id: "4",
					userId: "user-4",
					name: "Emily Rodriguez",
					email: "emily@techventure.com",
					avatar: null,
					role: ORGANIZATION_ROLES.OPERATIONS,
					joinedAt: "2024-03-01T11:15:00Z",
					lastActive: "1 hour ago",
					status: "active",
				},
			];

			invitations = [
				{
					id: "inv-1",
					email: "alex@techventure.com",
					role: ORGANIZATION_ROLES.INVESTMENT_ANALYST,
					status: "pending",
					invitedAt: "2024-12-15T10:00:00Z",
					expiresAt: "2024-12-22T10:00:00Z",
				},
				{
					id: "inv-2",
					email: "lisa@techventure.com",
					role: ORGANIZATION_ROLES.MEMBER,
					status: "accepted",
					invitedAt: "2024-12-10T09:00:00Z",
					expiresAt: "2024-12-17T09:00:00Z",
				},
			];
		} catch (error) {
			console.error("Error loading members:", error);
		} finally {
			isLoading = false;
		}
	});

	let newInvitation = $state({
		email: "",
		role: ORGANIZATION_ROLES.MEMBER,
		message: "",
	});

	function getRoleBadgeVariant(role: string): string {
		switch (role) {
			case ORGANIZATION_ROLES.OWNER:
				return "destructive";
			case ORGANIZATION_ROLES.ADMIN:
				return "default";
			case ORGANIZATION_ROLES.INVESTMENT_PARTNER:
				return "secondary";
			case ORGANIZATION_ROLES.INVESTMENT_ANALYST:
				return "outline";
			case ORGANIZATION_ROLES.OPERATIONS:
				return "outline";
			default:
				return "secondary";
		}
	}

	function getRoleDisplayName(role: string): string {
		const roleMap: Record<string, string> = {
			[ORGANIZATION_ROLES.OWNER]: "Owner",
			[ORGANIZATION_ROLES.ADMIN]: "Admin",
			[ORGANIZATION_ROLES.INVESTMENT_PARTNER]: "Investment Partner",
			[ORGANIZATION_ROLES.INVESTMENT_ANALYST]: "Investment Analyst",
			[ORGANIZATION_ROLES.OPERATIONS]: "Operations",
			[ORGANIZATION_ROLES.MEMBER]: "Member",
			[ORGANIZATION_ROLES.VIEWER]: "Viewer",
		};
		return roleMap[role] || role;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "active":
				return "text-green-600";
			case "inactive":
				return "text-gray-500";
			case "pending":
				return "text-yellow-600";
			case "accepted":
				return "text-blue-600";
			default:
				return "text-gray-500";
		}
	}

	function sendInvitation() {
		if (!newInvitation.email || !newInvitation.role) {
			alert("Please fill in all required fields");
			return;
		}

		// Add to invitations list (in real app, this would be an API call)
		invitations = [
			...invitations,
			{
				id: `inv-${Date.now()}`,
				email: newInvitation.email,
				role: newInvitation.role,
				status: "pending",
				invitedAt: new Date().toISOString(),
				expiresAt: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000,
				).toISOString(),
			},
		];

		// Reset form
		newInvitation = {
			email: "",
			role: ORGANIZATION_ROLES.MEMBER,
			message: "",
		};
		showInviteDialog = false;
	}

	function removeInvitation(invitationId: string) {
		invitations = invitations.filter((inv) => inv.id !== invitationId);
	}

	function changeMemberRole(memberId: string, newRole: string) {
		members = members.map((member) =>
			member.id === memberId ? { ...member, role: newRole } : member,
		);
	}

	function removeMember(memberId: string) {
		if (confirm("Are you sure you want to remove this member?")) {
			members = members.filter((member) => member.id !== memberId);
		}
	}

	$: filteredMembers = members.filter(
		(member) =>
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	$: filteredInvitations = invitations.filter((inv) =>
		inv.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">Team Members</h1>
			<p class="text-muted-foreground">
				Manage your organization members and permissions
			</p>
		</div>
		<div class="flex space-x-3">
			<Input
				bind:value={searchQuery}
				placeholder="Search members..."
				class="w-64"
			/>
			<Dialog bind:open={showInviteDialog}>
				<DialogTrigger asChild>
					<Button>
						<svg
							class="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Invite Member
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite New Member</DialogTitle>
					</DialogHeader>
					<div class="space-y-4">
						<div>
							<label
								for="invite-email"
								class="block text-sm font-medium mb-2"
							>
								Email Address *
							</label>
							<Input
								id="invite-email"
								bind:value={newInvitation.email}
								placeholder="user@example.com"
								type="email"
							/>
						</div>
						<div>
							<label
								for="invite-role"
								class="block text-sm font-medium mb-2"
							>
								Role *
							</label>
							<Select
								id="invite-role"
								bind:value={newInvitation.role}
								options={[
									{
										value: ORGANIZATION_ROLES.MEMBER,
										label: "Member",
									},
									{
										value: ORGANIZATION_ROLES.INVESTMENT_ANALYST,
										label: "Investment Analyst",
									},
									{
										value: ORGANIZATION_ROLES.INVESTMENT_PARTNER,
										label: "Investment Partner",
									},
									{
										value: ORGANIZATION_ROLES.OPERATIONS,
										label: "Operations",
									},
									{
										value: ORGANIZATION_ROLES.ADMIN,
										label: "Admin",
									},
								]}
							/>
						</div>
						<div>
							<label
								for="invite-message"
								class="block text-sm font-medium mb-2"
							>
								Message (Optional)
							</label>
							<textarea
								id="invite-message"
								bind:value={newInvitation.message}
								placeholder="Personal message to include with the invitation..."
								class="textarea textarea-bordered w-full"
								rows={3}
							/>
						</div>
						<div class="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onclick={() => (showInviteDialog = false)}
							>
								Cancel
							</Button>
							<Button onclick={sendInvitation}>
								Send Invitation
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	</div>

	{#if isLoading}
		<!-- Loading State -->
		<div class="grid grid-cols-1 gap-4">
			{#each Array(4) as _}
				<Card>
					<CardContent class="p-6">
						<div class="flex items-center space-x-4">
							<div
								class="w-12 h-12 bg-muted rounded-full animate-pulse"
							></div>
							<div class="flex-1 space-y-2">
								<div
									class="h-4 bg-muted rounded animate-pulse w-1/4"
								></div>
								<div
									class="h-3 bg-muted rounded animate-pulse w-1/2"
								></div>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else}
		<!-- Current Members -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">
					Current Members ({members.length})
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-4">
				{#each filteredMembers as member}
					<Card>
						<CardContent class="p-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-4">
									<Avatar class="w-12 h-12">
										<AvatarImage
											src={member.avatar}
											alt={member.name}
										/>
										<AvatarFallback>
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<div
											class="flex items-center space-x-2"
										>
											<h3 class="font-semibold">
												{member.name}
											</h3>
											{#if member.role === ORGANIZATION_ROLES.OWNER}
												<svg
													class="w-4 h-4 text-yellow-500"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
													/>
												</svg>
											{/if}
										</div>
										<p
											class="text-sm text-muted-foreground"
										>
											{member.email}
										</p>
										<div
											class="flex items-center space-x-2 mt-1"
										>
											<Badge
												variant={getRoleBadgeVariant(
													member.role,
												)}
											>
												{getRoleDisplayName(
													member.role,
												)}
											</Badge>
											<span
												class="text-xs {getStatusColor(
													member.status,
												)}"
											>
												{member.lastActive}
											</span>
										</div>
									</div>
								</div>

								<div class="flex items-center space-x-2">
									<Select
										value={member.role}
										onValueChange={(newRole) =>
											changeMemberRole(
												member.id,
												newRole,
											)}
										options={[
											{
												value: ORGANIZATION_ROLES.MEMBER,
												label: "Member",
											},
											{
												value: ORGANIZATION_ROLES.INVESTMENT_ANALYST,
												label: "Investment Analyst",
											},
											{
												value: ORGANIZATION_ROLES.INVESTMENT_PARTNER,
												label: "Investment Partner",
											},
											{
												value: ORGANIZATION_ROLES.OPERATIONS,
												label: "Operations",
											},
											{
												value: ORGANIZATION_ROLES.ADMIN,
												label: "Admin",
											},
										]}
										class="w-48"
									/>
									<Button
										variant="outline"
										size="sm"
										onclick={() => removeMember(member.id)}
										disabled={member.role ===
											ORGANIZATION_ROLES.OWNER}
									>
										Remove
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Pending Invitations -->
		{#if invitations.length > 0}
			<div class="space-y-4">
				<h2 class="text-xl font-semibold">
					Pending Invitations ({invitations.length})
				</h2>

				<div class="grid grid-cols-1 gap-4">
					{#each filteredInvitations as invitation}
						<Card>
							<CardContent class="p-6">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-4">
										<div
											class="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
										>
											<svg
												class="w-6 h-6 text-muted-foreground"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
										</div>
										<div>
											<h3 class="font-semibold">
												{invitation.email}
											</h3>
											<p
												class="text-sm text-muted-foreground"
											>
												Invited {new Date(
													invitation.invitedAt,
												).toLocaleDateString()}
											</p>
											<div
												class="flex items-center space-x-2 mt-1"
											>
												<Badge variant="outline">
													{getRoleDisplayName(
														invitation.role,
													)}
												</Badge>
												<Badge
													variant={invitation.status ===
													"pending"
														? "secondary"
														: "default"}
												>
													{invitation.status}
												</Badge>
											</div>
										</div>
									</div>

									<div class="flex items-center space-x-2">
										<Button variant="outline" size="sm">
											Resend
										</Button>
										<Button
											variant="outline"
											size="sm"
											onclick={() =>
												removeInvitation(invitation.id)}
										>
											Cancel
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
