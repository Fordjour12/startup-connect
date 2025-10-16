<script lang="ts">
	import * as Card from "@/components/ui/card";
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Badge } from "@/components/ui/badge";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "@/components/ui/table";
	import {
		IconUser,
		IconSearch,
		IconFilter,
		IconUserCheck,
		IconArrowLeft,
		IconShield,
	} from "@tabler/icons-svelte";

	import * as Select from "@/components/ui/select";
	import * as AlertDialog from "@/components/ui/alert-dialog";
	import { goto } from "$app/navigation";

	let { data } = $props<{ data: { users: any[]; userStats: any } }>();

	const { users, userStats } = data;

	let searchTerm = $state("");
	let selectedRole = $state("all");
	let showImpersonateDialog = $state(false);
	let selectedUserForImpersonation = $state<any>(null);

	let filteredUsers = $derived(
		users.filter((user: { name: string; email: string; role: string }) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole =
				selectedRole === "all" || user.role === selectedRole;
			return matchesSearch && matchesRole;
		}),
	);

	function getRoleColor(role: string): string {
		switch (role) {
			case "founder":
				return "bg-blue-100 text-blue-800 border-blue-300";
			case "investor":
				return "bg-green-100 text-green-800 border-green-300";
			case "support":
				return "bg-purple-100 text-purple-800 border-purple-300";
			case "admin":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function getStatusColor(status: string): string {
		return status === "active"
			? "bg-green-100 text-green-800 border-green-300"
			: "bg-gray-100 text-gray-800 border-gray-300";
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}

	async function handleImpersonate(user: any) {
		selectedUserForImpersonation = user;
		showImpersonateDialog = true;
	}

	async function confirmImpersonation() {
		if (!selectedUserForImpersonation) return;

		try {
			const response = await fetch("/api/admin/impersonate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: selectedUserForImpersonation?.id,
				}),
			});

			const result = await response.json();

			if (result.success) {
				// Redirect to the appropriate dashboard
				goto(result.redirectUrl);
			} else {
				console.error("Impersonation failed:", result.error);
				alert("Failed to impersonate user: " + result.error);
			}
		} catch (error) {
			console.error("Impersonation error:", error);
			alert("Failed to impersonate user");
		} finally {
			showImpersonateDialog = false;
			selectedUserForImpersonation = null;
		}
	}

	function getDashboardUrl(role: string): string {
		switch (role) {
			case "founder":
				return "/dashboard/founder";
			case "investor":
				return "/dashboard/investor";
			case "support":
				return "/dashboard/supporter";
			default:
				return "/dashboard";
		}
	}

	function getRoleDescription(role: string): string {
		switch (role) {
			case "founder":
				return "Startup founders can create and manage their startup profiles, connect with investors, and track fundraising progress.";
			case "investor":
				return "Investors can browse startups, manage their portfolio, conduct due diligence, and track investment opportunities.";
			case "support":
				return "Support staff can provide services to startups, manage bookings, and help founders with various business needs.";
			case "admin":
				return "Administrators have full access to manage the platform, users, and system settings.";
			default:
				return "General users with basic platform access.";
		}
	}
</script>

<svelte:head>
	<title>User Impersonation - Admin Dashboard</title>
	<meta
		name="description"
		content="Impersonate users to test their experience"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center space-x-4">
			<Button
				variant="ghost"
				size="sm"
				onclick={() => goto("/dashboard/admin/users")}
			>
				<IconArrowLeft class="h-4 w-4 mr-2" />
				Back to Users
			</Button>
			<div>
				<h1 class="text-3xl font-bold">User Impersonation</h1>
				<p class="text-muted-foreground">
					Impersonate users to test their experience and troubleshoot
					issues
				</p>
			</div>
		</div>
	</div>

	<!-- Warning Banner -->
	<Card.Root class="mb-6 border-yellow-200 bg-yellow-50">
		<Card.Content class="pt-6">
			<div class="flex items-start space-x-3">
				<IconShield class="h-5 w-5 text-yellow-600 mt-0.5" />
				<div>
					<h3 class="text-sm font-medium text-yellow-800">
						Important Security Notice
					</h3>
					<p class="text-sm text-yellow-700 mt-1">
						Impersonation allows you to access the application as
						another user. This feature should only be used for
						legitimate administrative purposes such as testing,
						debugging, or providing support. All impersonation
						activities are logged for security and compliance
						purposes.
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Stats Cards -->
	<div
		class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t"
	>
		<!-- Available Users Card -->
		<Card.Root class="@container/card" data-slot="card">
			<Card.Header>
				<Card.Description>Available Users</Card.Description>
				<Card.Title
					class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>
					{userStats.totalUsers}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="font-medium">Total Platform Users</div>
				<div class="text-muted-foreground">
					{userStats.activeUsers} currently active
				</div>
			</Card.Footer>
		</Card.Root>

		<!-- Founders Card -->
		<Card.Root class="@container/card" data-slot="card">
			<Card.Header>
				<Card.Description>Founders</Card.Description>
				<Card.Title
					class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>
					{userStats.founders}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="font-medium">Startup Founders</div>
				<div class="text-muted-foreground">Test founder experience</div>
			</Card.Footer>
		</Card.Root>

		<!-- Investors Card -->
		<Card.Root class="@container/card" data-slot="card">
			<Card.Header>
				<Card.Description>Investors</Card.Description>
				<Card.Title
					class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>
					{userStats.investors}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="font-medium">Investment Professionals</div>
				<div class="text-muted-foreground">
					Test investor experience
				</div>
			</Card.Footer>
		</Card.Root>

		<!-- Support Staff Card -->
		<Card.Root class="@container/card" data-slot="card">
			<Card.Header>
				<Card.Description>Support Staff</Card.Description>
				<Card.Title
					class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
				>
					{userStats.support}
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="font-medium">Service Providers</div>
				<div class="text-muted-foreground">
					Test supporter experience
				</div>
			</Card.Footer>
		</Card.Root>
	</div>

	<!-- Filters and Search -->
	<Card.Root class="mb-6">
		<Card.Header>
			<Card.Title>Filter Users for Impersonation</Card.Title>
			<Card.Description
				>Search and filter users to find the one you want to impersonate</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col md:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<IconSearch
							class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
						/>
						<Input
							placeholder="Search by name or email..."
							class="pl-8"
							bind:value={searchTerm}
						/>
					</div>
				</div>
				<div class="flex gap-2">
					<Select.Root type="single" bind:value={selectedRole}>
						<Select.Trigger class="w-[180px]">
							All Roles
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="all">All Roles</Select.Item>
							<Select.Item value="founder">Founder</Select.Item>
							<Select.Item value="investor">Investor</Select.Item>
							<Select.Item value="support">Support</Select.Item>
							<Select.Item value="admin">Admin</Select.Item>
						</Select.Content>
					</Select.Root>

					<Button variant="outline">
						<IconFilter class="h-4 w-4 mr-2" />
						More Filters
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Users Table -->
	<Card.Root>
		<Card.Header>
			<Card.Title
				>Select User to Impersonate ({filteredUsers.length})</Card.Title
			>
			<Card.Description>
				Click the impersonate button to start impersonating a user
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Last Login</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each filteredUsers as user}
							<TableRow>
								<TableCell class="font-medium">
									{user.name}
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										class={getRoleColor(user.role)}
									>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										class={getStatusColor(user.status)}
									>
										{user.status}
									</Badge>
								</TableCell>
								<TableCell
									>{formatDate(user.createdAt)}</TableCell
								>
								<TableCell
									>{formatDate(user.lastLogin)}</TableCell
								>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onclick={() => handleImpersonate(user)}
									>
										<IconUserCheck class="h-4 w-4 mr-2" />
										Impersonate
									</Button>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>

			{#if filteredUsers.length === 0}
				<div class="text-center py-8">
					<IconUser
						class="h-12 w-12 text-muted-foreground mx-auto mb-4"
					/>
					<h3 class="text-lg font-semibold mb-2">No users found</h3>
					<p class="text-muted-foreground">
						Try adjusting your search or filter criteria.
					</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<!-- Impersonation Confirmation Dialog -->
<AlertDialog.Root bind:open={showImpersonateDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm User Impersonation</AlertDialog.Title>
			<AlertDialog.Description>
				You are about to impersonate <strong
					>{selectedUserForImpersonation?.name}</strong
				>
				({selectedUserForImpersonation?.email}).
				<br /><br />
				<strong>Role:</strong>
				{selectedUserForImpersonation?.role}
				<br />
				<strong>Dashboard:</strong>
				{getDashboardUrl(selectedUserForImpersonation?.role)}
				<br /><br />
				<strong>What you'll experience:</strong>
				<br />
				{getRoleDescription(selectedUserForImpersonation?.role)}
				<br /><br />
				<strong>Security Notice:</strong> This action will be logged for
				security and compliance purposes.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmImpersonation}>
				<IconUserCheck class="h-4 w-4 mr-2" />
				Start Impersonating
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
