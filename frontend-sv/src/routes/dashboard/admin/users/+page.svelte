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
        IconUserPlus,
        IconEdit,
        IconTrash,
        IconShield,
        IconKeyframeAlignHorizontal,
    } from "@tabler/icons-svelte";

    import * as Select from "@/components/ui/select";

    let { data } = $props<{ data: { users: any[]; userStats: any } }>();

    const { users, userStats } = data;

    let searchTerm = $state("");
    let selectedRole = $state("all");

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
                <IconUserPlus class="h-4 w-4 mr-2" />
                Add User
            </Button>
        </div>
    </div>

    <!-- Stats Cards -->
    <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t"
    >
        <!-- Total Users Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Total Users</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {userStats.totalUsers}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Platform User Base</div>
                <div class="text-muted-foreground">
                    +{userStats.newThisWeek} new users this week
                </div>
            </Card.Footer>
        </Card.Root>

        <!-- Active Users Card -->
        <Card.Root class="@container/card" data-slot="card">
            <Card.Header>
                <Card.Description>Active Users</Card.Description>
                <Card.Title
                    class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"
                >
                    {userStats.activeUsers}
                </Card.Title>
            </Card.Header>
            <Card.Footer class="flex-col items-start gap-1.5 text-sm">
                <div class="font-medium">Currently Active</div>
                <div class="text-muted-foreground">
                    {Math.round(
                        (userStats.activeUsers / userStats.totalUsers) * 100,
                    )}% of total users
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
                <div class="text-muted-foreground">
                    {Math.round(
                        (userStats.founders / userStats.totalUsers) * 100,
                    )}% of total users
                </div>
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
                    {Math.round(
                        (userStats.investors / userStats.totalUsers) * 100,
                    )}% of total users
                </div>
            </Card.Footer>
        </Card.Root>
    </div>

    <!-- Filters and Search -->
    <Card.Root class="mb-6">
        <Card.Header>
            <Card.Title>Filter Users</Card.Title>
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
            <Card.Title>Users ({filteredUsers.length})</Card.Title>
            <Card.Description
                >Manage user accounts and permissions</Card.Description
            >
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
                                            <IconEdit class="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <IconKeyframeAlignHorizontal
                                                class="h-4 w-4"
                                            />
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
