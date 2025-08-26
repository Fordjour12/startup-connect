<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table";
	import {
		Users,
		Search,
		Filter,
		UserPlus,
		MoreHorizontal,
		Edit,
		Trash2,
		Shield,
	} from "@tabler/icons-svelte";

	let { data } = $props<{ data: { users: any[]; userStats: any } }>();

	const { users, userStats } = data;

	let searchTerm = $state("");
	let selectedRole = $state("all");

	$: filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesRole =
			selectedRole === "all" || user.role === selectedRole;
		return matchesSearch && matchesRole;
	});

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
</script>

<svelte:head>
	<title>User Management - Admin Dashboard</title>
	<meta name="description" content="Manage user accounts and permissions" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">User Management</h1>
			<p class="text-muted-foreground">
				Manage user accounts, roles, and permissions
			</p>
		</div>
		<div class="mt-4 md:mt-0">
			<Button>
				<UserPlus class="h-4 w-4 mr-2" />
				Add User
			</Button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Users</CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{userStats.totalUsers}</div>
				<p class="text-xs text-muted-foreground">
					+{userStats.newThisWeek} from last week
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Active Users</CardTitle>
				<Shield class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{userStats.activeUsers}
				</div>
				<p class="text-xs text-muted-foreground">
					{Math.round(
						(userStats.activeUsers / userStats.totalUsers) * 100,
					)}% of total
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Founders</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{userStats.founders}
				</div>
				<p class="text-xs text-muted-foreground">
					{Math.round(
						(userStats.founders / userStats.totalUsers) * 100,
					)}% of total
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Investors</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{userStats.investors}
				</div>
				<p class="text-xs text-muted-foreground">
					{Math.round(
						(userStats.investors / userStats.totalUsers) * 100,
					)}% of total
				</p>
			</CardContent>
		</Card>
	</div>

	<!-- Filters and Search -->
	<Card class="mb-6">
		<CardHeader>
			<CardTitle>Filter Users</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="flex flex-col md:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search
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
					<select
						class="px-3 py-2 border rounded-md text-sm"
						bind:value={selectedRole}
					>
						<option value="all">All Roles</option>
						<option value="founder">Founder</option>
						<option value="investor">Investor</option>
						<option value="support">Support</option>
						<option value="admin">Admin</option>
					</select>
					<Button variant="outline">
						<Filter class="h-4 w-4 mr-2" />
						More Filters
					</Button>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Users Table -->
	<Card>
		<CardHeader>
			<CardTitle>Users ({filteredUsers.length})</CardTitle>
			<CardDescription
				>Manage user accounts and permissions</CardDescription
			>
		</CardHeader>
		<CardContent>
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
								<TableCell class="font-medium"
									>{user.name}</TableCell
								>
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
									<div class="flex items-center space-x-2">
										<Button variant="ghost" size="sm">
											<Edit class="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="sm">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>

			{#if filteredUsers.length === 0}
				<div class="text-center py-8">
					<Users
						class="h-12 w-12 text-muted-foreground mx-auto mb-4"
					/>
					<h3 class="text-lg font-semibold mb-2">No users found</h3>
					<p class="text-muted-foreground">
						Try adjusting your search or filter criteria.
					</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
