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
	} from "$lib/components/ui/select";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import {
		IconActivity,
		IconAlertHexagon,
		IconKey,
		IconShield,
		IconTrendingUp,
		IconClock,
		IconServer,
		IconBolt,
		IconEye,
		IconEyeOff,
		IconCopy,
		IconPlus,
		IconSettings,
		IconChartBar,
		IconUser,
		IconFileText,
		IconDatabase,
		IconRefresh,
		IconCircleCheck,
		IconCircleX,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			apiMetrics: any;
			endpoints: any[];
			apiKeys: any[];
			rateLimits: any[];
			alerts: any[];
		};
	}>();

	const { user, apiMetrics, endpoints, apiKeys, rateLimits, alerts } = data;

	// State management
	let selectedTimeframe = $state("24h");
	let showCreateKeyDialog = $state(false);
	let newKeyName = $state("");
	let newKeyPermissions = $state<string[]>([]);
	let selectedEndpoint = $state<any>(null);
	let showRateLimitDialog = $state(false);

	// Mock data for API management
	const mockApiMetrics = {
		totalRequests: 15420,
		avgResponseTime: 245,
		errorRate: 0.8,
		uptime: 99.9,
		requestsPerSecond: 17.8,
		topEndpoints: [
			{
				path: "/api/auth/login",
				requests: 3240,
				avgTime: 180,
				errors: 12,
			},
			{
				path: "/api/users/profile",
				requests: 2850,
				avgTime: 220,
				errors: 8,
			},
			{
				path: "/api/startups/search",
				requests: 1920,
				avgTime: 340,
				errors: 25,
			},
			{
				path: "/api/investments/create",
				requests: 1680,
				avgTime: 290,
				errors: 15,
			},
			{
				path: "/api/admin/users",
				requests: 890,
				avgTime: 420,
				errors: 5,
			},
		],
	};

	const mockEndpoints = [
		{
			id: 1,
			path: "/api/auth/*",
			method: "ALL",
			requests: 3240,
			avgResponseTime: 180,
			errorRate: 0.4,
			rateLimit: 1000,
			status: "active",
			lastRequest: "2024-01-20T14:32:15Z",
		},
		{
			id: 2,
			path: "/api/users/*",
			method: "ALL",
			requests: 2850,
			avgResponseTime: 220,
			errorRate: 0.3,
			rateLimit: 500,
			status: "active",
			lastRequest: "2024-01-20T14:31:42Z",
		},
		{
			id: 3,
			path: "/api/startups/*",
			method: "GET",
			requests: 1920,
			avgResponseTime: 340,
			errorRate: 1.3,
			rateLimit: 300,
			status: "warning",
			lastRequest: "2024-01-20T14:30:18Z",
		},
		{
			id: 4,
			path: "/api/investments/*",
			method: "ALL",
			requests: 1680,
			avgResponseTime: 290,
			errorRate: 0.9,
			rateLimit: 200,
			status: "active",
			lastRequest: "2024-01-20T14:29:33Z",
		},
		{
			id: 5,
			path: "/api/admin/*",
			method: "ALL",
			requests: 890,
			avgResponseTime: 420,
			errorRate: 0.6,
			rateLimit: 100,
			status: "active",
			lastRequest: "2024-01-20T14:28:55Z",
		},
	];

	const mockApiKeys = [
		{
			id: 1,
			name: "Production API Key",
			key: "sk_prod_4f3d2c1b9a8e7f6d5c4b3a2918075f4e3d2c1b9a",
			created: "2024-01-15",
			lastUsed: "2024-01-20T14:32:15Z",
			requests: 12450,
			rateLimit: 1000,
			status: "active",
			permissions: ["read", "write", "admin"],
		},
		{
			id: 2,
			name: "Mobile App Key",
			key: "sk_mob_9a8e7f6d5c4b3a2918075f4e3d2c1b9a8e7f6d5c",
			created: "2024-01-10",
			lastUsed: "2024-01-20T14:30:22Z",
			requests: 8900,
			rateLimit: 500,
			status: "active",
			permissions: ["read", "write"],
		},
		{
			id: 3,
			name: "Read-only Analytics",
			key: "sk_ana_5c4b3a2918075f4e3d2c1b9a8e7f6d5c4b3a2918",
			created: "2024-01-08",
			lastUsed: "2024-01-20T14:15:33Z",
			requests: 3450,
			rateLimit: 100,
			status: "inactive",
			permissions: ["read"],
		},
	];

	const mockRateLimits = [
		{
			id: 1,
			name: "Global API Limit",
			limit: 10000,
			window: "hour",
			current: 2450,
			status: "normal",
		},
		{
			id: 2,
			name: "Auth Endpoints",
			limit: 1000,
			window: "minute",
			current: 45,
			status: "normal",
		},
		{
			id: 3,
			name: "Admin Endpoints",
			limit: 100,
			window: "minute",
			current: 12,
			status: "normal",
		},
	];

	const mockAlerts = [
		{
			id: 1,
			type: "error_rate",
			severity: "warning",
			message: "Error rate for /api/startups/search exceeded 1%",
			endpoint: "/api/startups/search",
			timestamp: "2024-01-20T13:45:22Z",
			resolved: false,
		},
		{
			id: 2,
			type: "rate_limit",
			severity: "info",
			message: "Rate limit threshold reached for /api/auth/login",
			endpoint: "/api/auth/login",
			timestamp: "2024-01-20T12:30:15Z",
			resolved: true,
		},
	];

	// Available permissions for API keys
	const availablePermissions = [
		{ id: "read", name: "Read Access", description: "Can read data" },
		{
			id: "write",
			name: "Write Access",
			description: "Can create and modify data",
		},
		{
			id: "admin",
			name: "Admin Access",
			description: "Full administrative access",
		},
		{
			id: "analytics",
			name: "Analytics Access",
			description: "Can access analytics data",
		},
	];

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}

	function formatTime(ms: number): string {
		return `${ms}ms`;
	}

	function formatPercentage(value: number): string {
		return `${value.toFixed(1)}%`;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 border-green-300";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "inactive":
				return "bg-gray-100 text-gray-800 border-gray-300";
			case "error":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function getSeverityColor(severity: string): string {
		switch (severity) {
			case "error":
				return "bg-red-100 text-red-800 border-red-300";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "info":
				return "bg-blue-100 text-blue-800 border-blue-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function truncateKey(key: string): string {
		return `${key.substring(0, 16)}...${key.substring(key.length - 4)}`;
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		// Could add a toast notification here
	}

	function togglePermission(permission: string) {
		if (newKeyPermissions.includes(permission)) {
			newKeyPermissions = newKeyPermissions.filter(
				(p) => p !== permission,
			);
		} else {
			newKeyPermissions = [...newKeyPermissions, permission];
		}
	}

	function createApiKey() {
		// Implementation for creating API key
		console.log("Creating API key:", {
			name: newKeyName,
			permissions: newKeyPermissions,
		});

		// Reset form
		newKeyName = "";
		newKeyPermissions = [];
		showCreateKeyDialog = false;
	}

	function updateRateLimit(endpoint: any) {
		// Implementation for updating rate limit
		console.log("Updating rate limit for:", endpoint);
		showRateLimitDialog = false;
	}

	function getTimeframeOptions() {
		return [
			{ value: "1h", label: "Last Hour" },
			{ value: "24h", label: "Last 24 Hours" },
			{ value: "7d", label: "Last 7 Days" },
			{ value: "30d", label: "Last 30 Days" },
		];
	}
</script>

<svelte:head>
	<title>API Management - Admin Dashboard</title>
	<meta
		name="description"
		content="Monitor and manage API usage, rate limiting, and security"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">API Management</h1>
			<p class="text-muted-foreground">
				Monitor API usage, manage rate limits, and control access
			</p>
		</div>
		<div class="mt-4 md:mt-0 flex gap-2">
			<Select type="single" bind:value={selectedTimeframe}>
				<SelectTrigger class="w-40">Timeframe</SelectTrigger>
				<SelectContent>
					{#each getTimeframeOptions() as option}
						<SelectItem value={option.value}
							>{option.label}</SelectItem
						>
					{/each}
				</SelectContent>
			</Select>
			<Button variant="outline">
				<IconRefresh class="h-4 w-4 mr-2" />
				Refresh
			</Button>
		</div>
	</div>

	<!-- API Metrics Overview -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Requests</CardTitle
				>
				<IconActivity class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatNumber(mockApiMetrics.totalRequests)}
				</div>
				<p class="text-xs text-muted-foreground">+12% from last hour</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Avg Response Time</CardTitle
				>
				<IconClock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatTime(mockApiMetrics.avgResponseTime)}
				</div>
				<p class="text-xs text-muted-foreground">-5% from last hour</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Error Rate</CardTitle>
				<IconAlertHexagon class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatPercentage(mockApiMetrics.errorRate)}
				</div>
				<p class="text-xs text-muted-foreground">Within normal range</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">API Uptime</CardTitle>
				<IconServer class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatPercentage(mockApiMetrics.uptime)}
				</div>
				<p class="text-xs text-muted-foreground">Last 30 days</p>
			</CardContent>
		</Card>
	</div>

	<!-- Main Content Tabs -->
	<Tabs value="endpoints" class="space-y-6">
		<TabsList class="grid w-full grid-cols-4">
			<TabsTrigger value="endpoints">Endpoints</TabsTrigger>
			<TabsTrigger value="keys">API Keys</TabsTrigger>
			<TabsTrigger value="ratelimits">Rate Limits</TabsTrigger>
			<TabsTrigger value="alerts">Alerts</TabsTrigger>
		</TabsList>

		<!-- Endpoints Tab -->
		<TabsContent value="endpoints" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center space-x-2">
						<IconServer class="h-5 w-5" />
						<span>API Endpoints</span>
					</CardTitle>
					<CardDescription>
						Monitor performance and usage of API endpoints
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each mockEndpoints as endpoint}
							<div
								class="flex items-center justify-between p-4 border rounded-lg"
							>
								<div class="flex-1">
									<div
										class="flex items-center space-x-3 mb-2"
									>
										<h3 class="font-semibold">
											{endpoint.path}
										</h3>
										<Badge variant="outline"
											>{endpoint.method}</Badge
										>
										<Badge
											variant="outline"
											class={getStatusColor(
												endpoint.status,
											)}
										>
											{endpoint.status}
										</Badge>
									</div>
									<div
										class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground"
									>
										<div>
											<span class="font-medium"
												>{formatNumber(
													endpoint.requests,
												)}</span
											>
											<span> requests</span>
										</div>
										<div>
											<span class="font-medium"
												>{formatTime(
													endpoint.avgResponseTime,
												)}</span
											>
											<span> avg time</span>
										</div>
										<div>
											<span class="font-medium"
												>{formatPercentage(
													endpoint.errorRate,
												)}</span
											>
											<span> error rate</span>
										</div>
										<div>
											<span class="font-medium"
												>{endpoint.rateLimit}</span
											>
											<span> req/min limit</span>
										</div>
									</div>
									<p
										class="text-xs text-muted-foreground mt-1"
									>
										Last request: {formatDateTime(
											endpoint.lastRequest,
										)}
									</p>
								</div>
								<div class="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											selectedEndpoint = endpoint;
											showRateLimitDialog = true;
										}}
									>
										<IconSettings class="h-4 w-4" />
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<!-- API Keys Tab -->
		<TabsContent value="keys" class="space-y-6">
			<div class="flex justify-between items-center">
				<div>
					<h2 class="text-xl font-semibold">API Keys</h2>
					<p class="text-muted-foreground">
						Manage API keys and their permissions
					</p>
				</div>
				<Dialog bind:open={showCreateKeyDialog}>
					<DialogTrigger>
						<Button>
							<IconPlus class="h-4 w-4 mr-2" />
							Create API Key
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New API Key</DialogTitle>
							<DialogDescription>
								Generate a new API key with specific permissions
							</DialogDescription>
						</DialogHeader>
						<div class="space-y-4">
							<div class="space-y-2">
								<Label for="key-name">Key Name</Label>
								<Input
									id="key-name"
									bind:value={newKeyName}
									placeholder="Enter a name for this API key"
								/>
							</div>
							<div class="space-y-2">
								<Label>Permissions</Label>
								<div class="grid grid-cols-2 gap-2">
									{#each availablePermissions as permission}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<div
											class="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-accent"
											onclick={() =>
												togglePermission(permission.id)}
										>
											<input
												type="checkbox"
												checked={newKeyPermissions.includes(
													permission.id,
												)}
												readonly
												class="rounded"
											/>
											<div>
												<div
													class="font-medium text-sm"
												>
													{permission.name}
												</div>
												<div
													class="text-xs text-muted-foreground"
												>
													{permission.description}
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
							<div class="flex justify-end space-x-2">
								<Button
									variant="outline"
									onclick={() =>
										(showCreateKeyDialog = false)}
								>
									Cancel
								</Button>
								<Button
									onclick={createApiKey}
									disabled={!newKeyName ||
										newKeyPermissions.length === 0}
								>
									Create Key
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardContent class="pt-6">
					<div class="space-y-4">
						{#each mockApiKeys as apiKey}
							<div class="p-4 border rounded-lg">
								<div
									class="flex items-center justify-between mb-3"
								>
									<div class="flex items-center space-x-3">
										<IconKey
											class="h-5 w-5 text-muted-foreground"
										/>
										<div>
											<h3 class="font-semibold">
												{apiKey.name}
											</h3>
											<div
												class="flex items-center space-x-2"
											>
												<code
													class="text-sm bg-muted px-2 py-1 rounded"
												>
													{truncateKey(apiKey.key)}
												</code>
												<Button
													variant="ghost"
													size="sm"
													onclick={() =>
														copyToClipboard(
															apiKey.key,
														)}
												>
													<IconCopy class="h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
									<Badge
										variant="outline"
										class={getStatusColor(apiKey.status)}
									>
										{apiKey.status}
									</Badge>
								</div>
								<div
									class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
								>
									<div>
										<span class="font-medium"
											>Requests:</span
										>
										<span class="ml-1"
											>{formatNumber(
												apiKey.requests,
											)}</span
										>
									</div>
									<div>
										<span class="font-medium"
											>Rate Limit:</span
										>
										<span class="ml-1"
											>{apiKey.rateLimit}/min</span
										>
									</div>
									<div>
										<span class="font-medium"
											>Last Used:</span
										>
										<span class="ml-1"
											>{formatDateTime(
												apiKey.lastUsed,
											)}</span
										>
									</div>
									<div>
										<span class="font-medium">Created:</span
										>
										<span class="ml-1"
											>{apiKey.created}</span
										>
									</div>
								</div>
								<div class="mt-3">
									<div class="flex flex-wrap gap-1">
										{#each apiKey.permissions as permission}
											<Badge
												variant="secondary"
												class="text-xs"
											>
												{permission}
											</Badge>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<!-- Rate Limits Tab -->
		<TabsContent value="ratelimits" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center space-x-2">
						<IconShield class="h-5 w-5" />
						<span>Rate Limits</span>
					</CardTitle>
					<CardDescription>
						Configure and monitor API rate limiting
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each mockRateLimits as limit}
							<div class="p-4 border rounded-lg">
								<div
									class="flex items-center justify-between mb-3"
								>
									<h3 class="font-semibold">{limit.name}</h3>
									<Badge
										variant="outline"
										class={getStatusColor(limit.status)}
									>
										{limit.status}
									</Badge>
								</div>
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span>Current Usage</span>
										<span
											>{formatNumber(limit.current)} / {formatNumber(
												limit.limit,
											)}</span
										>
									</div>
									<div
										class="w-full bg-muted rounded-full h-2"
									>
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {(limit.current /
												limit.limit) *
												100}%"
										></div>
									</div>
									<p class="text-xs text-muted-foreground">
										Per {limit.window} • {(limit.current /
											limit.limit) *
											100 <
										80
											? "Normal"
											: "High Usage"}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<!-- Alerts Tab -->
		<TabsContent value="alerts" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center space-x-2">
						<IconAlertHexagon class="h-5 w-5" />
						<span>API Alerts</span>
					</CardTitle>
					<CardDescription>
						Monitor API issues and performance alerts
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each mockAlerts as alert}
							<div
								class="flex items-center justify-between p-4 border rounded-lg"
							>
								<div class="flex-1">
									<div
										class="flex items-center space-x-3 mb-2"
									>
										<h3 class="font-semibold">
											{alert.message}
										</h3>
										<Badge
											variant="outline"
											class={getSeverityColor(
												alert.severity,
											)}
										>
											{alert.severity}
										</Badge>
										{#if alert.resolved}
											<Badge
												variant="outline"
												class="bg-green-100 text-green-800"
											>
												Resolved
											</Badge>
										{:else}
											<Badge
												variant="outline"
												class="bg-red-100 text-red-800"
											>
												Active
											</Badge>
										{/if}
									</div>
									<div class="text-sm text-muted-foreground">
										<span class="font-medium"
											>Endpoint:</span
										>
										{alert.endpoint} •
										<span class="font-medium">Time:</span>
										{formatDateTime(alert.timestamp)}
									</div>
								</div>
								<div class="flex items-center space-x-2">
									{#if !alert.resolved}
										<Button variant="outline" size="sm">
											<IconCircleCheck class="h-4 w-4" />
										</Button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>

	<!-- Rate Limit Configuration Dialog -->
	<Dialog bind:open={showRateLimitDialog}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Configure Rate Limit</DialogTitle>
				<DialogDescription>
					Update rate limiting for {selectedEndpoint?.path}
				</DialogDescription>
			</DialogHeader>
			{#if selectedEndpoint}
				<div class="space-y-4">
					<div class="p-4 bg-muted rounded-lg">
						<h3 class="font-semibold mb-2">
							{selectedEndpoint.path}
						</h3>
						<div class="text-sm text-muted-foreground">
							Current limit: {selectedEndpoint.rateLimit} requests
							per minute
						</div>
					</div>
					<div class="space-y-2">
						<Label for="new-limit"
							>New Rate Limit (requests per minute)</Label
						>
						<Input
							id="new-limit"
							type="number"
							value={selectedEndpoint.rateLimit}
							placeholder="Enter new rate limit"
						/>
					</div>
					<div class="flex justify-end space-x-2">
						<Button
							variant="outline"
							onclick={() => (showRateLimitDialog = false)}
						>
							Cancel
						</Button>
						<Button
							onclick={() => updateRateLimit(selectedEndpoint)}
						>
							Update Limit
						</Button>
					</div>
				</div>
			{/if}
		</DialogContent>
	</Dialog>
</div>
