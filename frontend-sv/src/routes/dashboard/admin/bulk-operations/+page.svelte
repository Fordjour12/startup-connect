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
	import { Label } from "$lib/components/ui/label";
	import { Badge } from "$lib/components/ui/badge";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import {
		AlertTriangle,
		Users,
		FileText,
		Mail,
		Download,
		Upload,
		Shield,
		Trash2,
		Edit,
		CheckCircle,
		XCircle,
		Clock,
		UserCheck,
		UserX,
		Send,
		Database,
		Settings,
		Activity,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			bulkOperations: any[];
			users: any[];
			startups: any[];
			systemStats: any;
		};
	}>();

	const { user, bulkOperations, users, startups, systemStats } = data;

	// Bulk operations state
	let selectedCategory = $state("users");
	let selectedItems = $state<string[]>([]);
	let selectedOperation = $state("");
	let showConfirmDialog = $state(false);
	let operationProgress = $state<any>(null);
	let emailSubject = $state("");
	let emailMessage = $state("");
	let exportFormat = $state("csv");

	// Mock data for different categories
	const mockUsers = [
		{
			id: 1,
			name: "John Doe",
			email: "john@example.com",
			role: "founder",
			status: "active",
			lastLogin: "2024-01-20",
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			role: "investor",
			status: "active",
			lastLogin: "2024-01-19",
		},
		{
			id: 3,
			name: "Bob Johnson",
			email: "bob@example.com",
			role: "founder",
			status: "pending",
			lastLogin: null,
		},
		{
			id: 4,
			name: "Alice Brown",
			email: "alice@example.com",
			role: "investor",
			status: "suspended",
			lastLogin: "2024-01-15",
		},
		{
			id: 5,
			name: "Charlie Wilson",
			email: "charlie@example.com",
			role: "founder",
			status: "active",
			lastLogin: "2024-01-18",
		},
	];

	const mockStartups = [
		{
			id: 1,
			name: "TechStart Inc",
			founder: "John Doe",
			status: "pending",
			submitted: "2024-01-15",
			funding: 50000,
		},
		{
			id: 2,
			name: "GreenEnergy Co",
			founder: "Jane Smith",
			status: "approved",
			submitted: "2024-01-10",
			funding: 250000,
		},
		{
			id: 3,
			name: "AI Solutions",
			founder: "Bob Johnson",
			status: "rejected",
			submitted: "2024-01-08",
			funding: 100000,
		},
		{
			id: 4,
			name: "HealthTech Pro",
			founder: "Alice Brown",
			status: "pending",
			submitted: "2024-01-12",
			funding: 75000,
		},
	];

	// Available bulk operations by category
	const bulkOperationsByCategory = {
		users: [
			{
				id: "approve",
				name: "Approve Users",
				description: "Approve selected user accounts",
				icon: UserCheck,
				color: "green",
			},
			{
				id: "suspend",
				name: "Suspend Users",
				description: "Temporarily suspend user access",
				icon: UserX,
				color: "orange",
			},
			{
				id: "delete",
				name: "Delete Users",
				description: "Permanently delete user accounts",
				icon: Trash2,
				color: "red",
			},
			{
				id: "send_email",
				name: "Send Email",
				description: "Send email to selected users",
				icon: Mail,
				color: "blue",
			},
			{
				id: "change_role",
				name: "Change Role",
				description: "Change user roles in bulk",
				icon: Edit,
				color: "purple",
			},
			{
				id: "export",
				name: "Export Data",
				description: "Export user data to file",
				icon: Download,
				color: "gray",
			},
		],
		startups: [
			{
				id: "approve",
				name: "Approve Startups",
				description: "Approve selected startup applications",
				icon: CheckCircle,
				color: "green",
			},
			{
				id: "reject",
				name: "Reject Startups",
				description: "Reject selected startup applications",
				icon: XCircle,
				color: "red",
			},
			{
				id: "feature",
				name: "Feature Startups",
				description: "Mark startups as featured",
				icon: Settings,
				color: "gold",
			},
			{
				id: "export",
				name: "Export Data",
				description: "Export startup data to file",
				icon: Download,
				color: "gray",
			},
			{
				id: "send_notification",
				name: "Send Notification",
				description: "Send notification to founders",
				icon: Send,
				color: "blue",
			},
		],
		system: [
			{
				id: "maintenance",
				name: "Maintenance Mode",
				description: "Enable/disable maintenance mode",
				icon: Settings,
				color: "orange",
			},
			{
				id: "clear_cache",
				name: "Clear Cache",
				description: "Clear system cache",
				icon: Database,
				color: "purple",
			},
			{
				id: "backup",
				name: "Create Backup",
				description: "Create system backup",
				icon: Upload,
				color: "blue",
			},
			{
				id: "send_broadcast",
				name: "Broadcast Message",
				description: "Send message to all users",
				icon: Send,
				color: "green",
			},
		],
	};

	function getCurrentData() {
		switch (selectedCategory) {
			case "users":
				return mockUsers;
			case "startups":
				return mockStartups;
			default:
				return [];
		}
	}

	function getSelectedOperationData() {
		return bulkOperationsByCategory[selectedCategory]?.find(
			(op) => op.id === selectedOperation,
		);
	}

	function toggleItemSelection(itemId: string) {
		if (selectedItems.includes(itemId)) {
			selectedItems = selectedItems.filter((id) => id !== itemId);
		} else {
			selectedItems = [...selectedItems, itemId];
		}
	}

	function selectAllItems() {
		const currentData = getCurrentData();
		const allIds = currentData.map((item) => item.id.toString());
		selectedItems = selectedItems.length === allIds.length ? [] : allIds;
	}

	function getItemDisplayName(item: any): string {
		switch (selectedCategory) {
			case "users":
				return item.name;
			case "startups":
				return item.name;
			default:
				return item.id;
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 border-green-300";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "suspended":
				return "bg-red-100 text-red-800 border-red-300";
			case "approved":
				return "bg-green-100 text-green-800 border-green-300";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function formatDate(dateString: string): string {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleDateString();
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	}

	async function executeBulkOperation() {
		if (!selectedOperation || selectedItems.length === 0) return;

		const operation = getSelectedOperationData();
		if (!operation) return;

		// Simulate operation execution
		operationProgress = {
			operation: operation.name,
			total: selectedItems.length,
			completed: 0,
			status: "running",
		};

		// Simulate progress
		for (let i = 1; i <= selectedItems.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			operationProgress.completed = i;
		}

		operationProgress.status = "completed";

		// Reset state
		setTimeout(() => {
			selectedItems = [];
			selectedOperation = "";
			operationProgress = null;
			showConfirmDialog = false;
		}, 2000);
	}

	function getOperationIcon(operation: any) {
		return operation.icon;
	}

	function getOperationColorClass(color: string): string {
		switch (color) {
			case "green":
				return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100";
			case "red":
				return "bg-red-50 border-red-200 text-red-700 hover:bg-red-100";
			case "orange":
				return "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100";
			case "blue":
				return "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100";
			case "purple":
				return "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100";
			case "gold":
				return "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100";
			case "gray":
				return "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
			default:
				return "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
		}
	}
</script>

<svelte:head>
	<title>Bulk Operations - Admin Dashboard</title>
	<meta
		name="description"
		content="Perform bulk operations on users, content, and system data"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">Bulk Operations</h1>
			<p class="text-muted-foreground">
				Perform batch actions on multiple items efficiently
			</p>
		</div>
	</div>

	<!-- Category Selection -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<Card
			class="cursor-pointer transition-all hover:shadow-md"
			class:border-primary={selectedCategory === "users"}
			onclick={() => (selectedCategory = "users")}
		>
			<CardHeader class="text-center">
				<Users class="h-8 w-8 mx-auto mb-2 text-blue-600" />
				<CardTitle class="text-lg">Users</CardTitle>
				<CardDescription>Manage user accounts in bulk</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center">
					<div class="text-2xl font-bold text-blue-600">
						{mockUsers.length}
					</div>
					<p class="text-sm text-muted-foreground">Total Users</p>
				</div>
			</CardContent>
		</Card>

		<Card
			class="cursor-pointer transition-all hover:shadow-md"
			class:border-primary={selectedCategory === "startups"}
			onclick={() => (selectedCategory = "startups")}
		>
			<CardHeader class="text-center">
				<FileText class="h-8 w-8 mx-auto mb-2 text-green-600" />
				<CardTitle class="text-lg">Startups</CardTitle>
				<CardDescription>Manage startup applications</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center">
					<div class="text-2xl font-bold text-green-600">
						{mockStartups.length}
					</div>
					<p class="text-sm text-muted-foreground">Total Startups</p>
				</div>
			</CardContent>
		</Card>

		<Card
			class="cursor-pointer transition-all hover:shadow-md"
			class:border-primary={selectedCategory === "system"}
			onclick={() => (selectedCategory = "system")}
		>
			<CardHeader class="text-center">
				<Settings class="h-8 w-8 mx-auto mb-2 text-purple-600" />
				<CardTitle class="text-lg">System</CardTitle>
				<CardDescription>System-wide operations</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="text-center">
					<div class="text-2xl font-bold text-purple-600">3</div>
					<p class="text-sm text-muted-foreground">Operations</p>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Operation Progress -->
	{#if operationProgress}
		<Card class="mb-6 border-blue-200 bg-blue-50">
			<CardContent class="pt-6">
				<div class="flex items-center space-x-4">
					<Activity class="h-5 w-5 text-blue-600 animate-spin" />
					<div class="flex-1">
						<h3 class="font-semibold text-blue-900">
							{operationProgress.operation}
						</h3>
						<p class="text-sm text-blue-700">
							Processing {operationProgress.completed} of {operationProgress.total}
							items...
						</p>
					</div>
					<div class="text-right">
						<div class="text-lg font-bold text-blue-900">
							{Math.round(
								(operationProgress.completed /
									operationProgress.total) *
									100,
							)}%
						</div>
					</div>
				</div>
				<div class="w-full bg-blue-200 rounded-full h-2 mt-4">
					<div
						class="bg-blue-600 h-2 rounded-full transition-all duration-300"
						style="width: {(operationProgress.completed /
							operationProgress.total) *
							100}%"
					></div>
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Bulk Operations Selection -->
	{#if selectedCategory !== "system"}
		<Card class="mb-6">
			<CardHeader>
				<CardTitle>Available Operations</CardTitle>
				<CardDescription>
					Select an operation to perform on multiple {selectedCategory}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				>
					{#each bulkOperationsByCategory[selectedCategory] || [] as operation}
						{@const IconComponent = operation.icon}
						<div
							class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md {getOperationColorClass(
								operation.color,
							)}"
							class:border-current={selectedOperation ===
								operation.id}
							onclick={() => (selectedOperation = operation.id)}
						>
							<div class="flex items-center space-x-3 mb-2">
								<IconComponent class="h-5 w-5" />
								<h3 class="font-semibold">{operation.name}</h3>
							</div>
							<p class="text-sm opacity-80">
								{operation.description}
							</p>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Data Table and Selection -->
	{#if selectedCategory !== "system"}
		<Card class="mb-6">
			<CardHeader>
				<div class="flex justify-between items-center">
					<div>
						<CardTitle>
							{selectedCategory === "users"
								? "User Management"
								: "Startup Management"}
						</CardTitle>
						<CardDescription>
							Select items to perform bulk operations on
						</CardDescription>
					</div>
					<div class="flex items-center space-x-4">
						<Button
							variant="outline"
							size="sm"
							onclick={selectAllItems}
						>
							{selectedItems.length === getCurrentData().length
								? "Deselect All"
								: "Select All"}
						</Button>
						<Badge variant="secondary">
							{selectedItems.length} selected
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div class="border rounded-lg">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-12">
									<Checkbox
										checked={selectedItems.length ===
											getCurrentData().length &&
											getCurrentData().length > 0}
										indeterminate={selectedItems.length >
											0 &&
											selectedItems.length <
												getCurrentData().length}
										onchange={selectAllItems}
									/>
								</TableHead>
								{#if selectedCategory === "users"}
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Last Login</TableHead>
								{:else}
									<TableHead>Name</TableHead>
									<TableHead>Founder</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Submitted</TableHead>
									<TableHead>Funding</TableHead>
								{/if}
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each getCurrentData() as item}
								<TableRow
									class="cursor-pointer hover:bg-muted/50"
								>
									<TableCell>
										<Checkbox
											checked={selectedItems.includes(
												item.id.toString(),
											)}
											onchange={() =>
												toggleItemSelection(
													item.id.toString(),
												)}
										/>
									</TableCell>
									{#if selectedCategory === "users"}
										<TableCell class="font-medium"
											>{item.name}</TableCell
										>
										<TableCell>{item.email}</TableCell>
										<TableCell>
											<Badge variant="outline"
												>{item.role}</Badge
											>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												class={getStatusColor(
													item.status,
												)}
											>
												{item.status}
											</Badge>
										</TableCell>
										<TableCell
											>{formatDate(
												item.lastLogin,
											)}</TableCell
										>
									{:else}
										<TableCell class="font-medium"
											>{item.name}</TableCell
										>
										<TableCell>{item.founder}</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												class={getStatusColor(
													item.status,
												)}
											>
												{item.status}
											</Badge>
										</TableCell>
										<TableCell
											>{formatDate(
												item.submitted,
											)}</TableCell
										>
										<TableCell
											>{formatCurrency(
												item.funding,
											)}</TableCell
										>
									{/if}
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Execute Operation Button -->
	{#if selectedItems.length > 0 && selectedOperation}
		<div class="flex justify-center mb-8">
			<Button
				size="lg"
				onclick={() => (showConfirmDialog = true)}
				class="px-8 py-3"
			>
				<CheckCircle class="h-5 w-5 mr-2" />
				Execute {getSelectedOperationData()?.name} ({selectedItems.length}
				items)
			</Button>
		</div>
	{/if}

	<!-- System Operations (when system category is selected) -->
	{#if selectedCategory === "system"}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each bulkOperationsByCategory.system as operation}
				{@const IconComponent = operation.icon}
				<Card class="hover:shadow-md transition-all">
					<CardHeader>
						<CardTitle class="flex items-center space-x-2">
							<IconComponent class="h-5 w-5" />
							<span>{operation.name}</span>
						</CardTitle>
						<CardDescription
							>{operation.description}</CardDescription
						>
					</CardHeader>
					<CardContent>
						<Button
							class="w-full {operation.color === 'red'
								? 'bg-red-600 hover:bg-red-700'
								: operation.color === 'orange'
									? 'bg-orange-600 hover:bg-orange-700'
									: ''}"
							onclick={() => {
								selectedOperation = operation.id;
								showConfirmDialog = true;
							}}
						>
							Execute Operation
						</Button>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}

	<!-- Confirmation Dialog -->
	<Dialog bind:open={showConfirmDialog}>
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle class="flex items-center space-x-2">
					<AlertTriangle class="h-5 w-5 text-orange-500" />
					<span>Confirm Operation</span>
				</DialogTitle>
				<DialogDescription>
					Are you sure you want to execute this bulk operation?
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-4">
				{#if getSelectedOperationData()}
					{@const operation = getSelectedOperationData()}
					{@const IconComponent = operation.icon}
					<div class="p-4 bg-muted rounded-lg">
						<div class="flex items-center space-x-3 mb-2">
							<IconComponent class="h-5 w-5" />
							<h3 class="font-semibold">{operation.name}</h3>
						</div>
						<p class="text-sm text-muted-foreground">
							{operation.description}
						</p>
					</div>
				{/if}

				{#if selectedItems.length > 0}
					<div class="space-y-2">
						<h4 class="font-medium">
							Selected Items ({selectedItems.length})
						</h4>
						<div class="max-h-32 overflow-y-auto space-y-1">
							{#each selectedItems.slice(0, 5) as itemId}
								{@const item = getCurrentData().find(
									(i) => i.id.toString() === itemId,
								)}
								{#if item}
									<div class="text-sm text-muted-foreground">
										• {getItemDisplayName(item)}
									</div>
								{/if}
							{/each}
							{#if selectedItems.length > 5}
								<div class="text-sm text-muted-foreground">
									... and {selectedItems.length - 5} more
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Additional fields for specific operations -->
				{#if selectedOperation === "send_email"}
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="email-subject">Email Subject</Label>
							<Input
								id="email-subject"
								bind:value={emailSubject}
								placeholder="Enter email subject"
							/>
						</div>
						<div class="space-y-2">
							<Label for="email-message">Email Message</Label>
							<textarea
								id="email-message"
								bind:value={emailMessage}
								class="w-full p-3 border rounded-md text-sm"
								rows="4"
								placeholder="Enter your message..."
							></textarea>
						</div>
					</div>
				{/if}

				{#if selectedOperation === "export"}
					<div class="space-y-2">
						<Label for="export-format">Export Format</Label>
						<Select bind:value={exportFormat}>
							<SelectTrigger>
								<SelectValue placeholder="Select format" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="csv">CSV</SelectItem>
								<SelectItem value="excel">Excel</SelectItem>
								<SelectItem value="json">JSON</SelectItem>
							</SelectContent>
						</Select>
					</div>
				{/if}
			</div>

			<div class="flex justify-end space-x-2 pt-4">
				<Button
					variant="outline"
					onclick={() => (showConfirmDialog = false)}
				>
					Cancel
				</Button>
				<Button onclick={executeBulkOperation}>
					<CheckCircle class="h-4 w-4 mr-2" />
					Execute
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</div>
