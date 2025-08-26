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
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import {
		Activity,
		AlertTriangle,
		Shield,
		TrendingUp,
		TrendingDown,
		Clock,
		Zap,
		BarChart3,
		Settings,
		RefreshCw,
		Eye,
		EyeOff,
		Plus,
		Edit,
		CheckCircle,
		XCircle,
		Users,
		Server,
		Database,
		Globe,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			apiMetrics: any;
			endpoints: any[];
			rateLimits: any[];
			alerts: any[];
			usagePatterns: any[];
		};
	}>();

	const { user, apiMetrics, endpoints, rateLimits, alerts, usagePatterns } =
		data;

	// State management
	let selectedTimeframe = $state("1h");
	let selectedEndpoint = $state<any>(null);
	let showRateLimitDialog = $state(false);
	let showAlertConfigDialog = $state(false);
	let newRateLimit = $state(1000);
	let alertThreshold = $state(80);
	let alertEnabled = $state(true);

	// Mock API metrics
	const mockApiMetrics = {
		totalRequests: 15420,
		requestsPerSecond: 17.8,
		avgResponseTime: 245,
		errorRate: 0.8,
		uptime: 99.9,
		activeConnections: 45,
		peakConcurrentUsers: 234,
		totalBandwidth: 2.3, // GB
		cacheHitRate: 87.5,
		throttlingEvents: 12,
	};

	// Mock endpoints with usage data
	const mockEndpoints = [
		{
			path: "/api/auth/login",
			method: "POST",
			requests: 3240,
			avgResponseTime: 180,
			errorRate: 0.4,
			rateLimit: 1000,
			currentUsage: 245,
			trend: "up",
			status: "healthy",
			lastSpike: "2024-01-20T14:30:00Z",
		},
		{
			path: "/api/users/profile",
			method: "GET",
			requests: 2850,
			avgResponseTime: 220,
			errorRate: 0.3,
			rateLimit: 500,
			currentUsage: 89,
			trend: "stable",
			status: "healthy",
			lastSpike: "2024-01-20T13:15:00Z",
		},
		{
			path: "/api/startups/search",
			method: "GET",
			requests: 1920,
			avgResponseTime: 340,
			errorRate: 1.3,
			rateLimit: 300,
			currentUsage: 156,
			trend: "down",
			status: "warning",
			lastSpike: "2024-01-20T14:45:00Z",
		},
		{
			path: "/api/investments/create",
			method: "POST",
			requests: 1680,
			avgResponseTime: 290,
			errorRate: 0.9,
			rateLimit: 200,
			currentUsage: 45,
			trend: "up",
			status: "healthy",
			lastSpike: "2024-01-20T12:30:00Z",
		},
		{
			path: "/api/admin/*",
			method: "ALL",
			requests: 890,
			avgResponseTime: 420,
			errorRate: 0.6,
			rateLimit: 100,
			currentUsage: 23,
			trend: "stable",
			status: "healthy",
			lastSpike: "2024-01-20T11:00:00Z",
		},
	];

	// Mock rate limits configuration
	const mockRateLimits = [
		{
			id: 1,
			name: "Global API Limit",
			scope: "global",
			limit: 10000,
			window: "hour",
			currentUsage: 2450,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z",
		},
		{
			id: 2,
			name: "Auth Endpoints",
			scope: "endpoint",
			limit: 1000,
			window: "minute",
			currentUsage: 245,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z",
		},
		{
			id: 3,
			name: "User Endpoints",
			scope: "endpoint",
			limit: 500,
			window: "minute",
			currentUsage: 89,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z",
		},
		{
			id: 4,
			name: "Admin Endpoints",
			scope: "endpoint",
			limit: 100,
			window: "minute",
			currentUsage: 23,
			status: "normal",
			lastUpdated: "2024-01-20T14:32:15Z",
		},
	];

	// Mock usage patterns
	const mockUsagePatterns = [
		{ hour: "00:00", requests: 450, errors: 2 },
		{ hour: "01:00", requests: 320, errors: 1 },
		{ hour: "02:00", requests: 280, errors: 0 },
		{ hour: "03:00", requests: 250, errors: 1 },
		{ hour: "04:00", requests: 290, errors: 0 },
		{ hour: "05:00", requests: 380, errors: 2 },
		{ hour: "06:00", requests: 520, errors: 3 },
		{ hour: "07:00", requests: 780, errors: 5 },
		{ hour: "08:00", requests: 1200, errors: 8 },
		{ hour: "09:00", requests: 1450, errors: 12 },
		{ hour: "10:00", requests: 1680, errors: 15 },
		{ hour: "11:00", requests: 1820, errors: 18 },
		{ hour: "12:00", requests: 2100, errors: 22 },
		{ hour: "13:00", requests: 1950, errors: 20 },
		{ hour: "14:00", requests: 1780, errors: 16 },
		{ hour: "15:00", requests: 1650, errors: 14 },
		{ hour: "16:00", requests: 1520, errors: 12 },
		{ hour: "17:00", requests: 1380, errors: 10 },
		{ hour: "18:00", requests: 1200, errors: 8 },
		{ hour: "19:00", requests: 950, errors: 6 },
		{ hour: "20:00", requests: 720, errors: 4 },
		{ hour: "21:00", requests: 580, errors: 3 },
		{ hour: "22:00", requests: 480, errors: 2 },
		{ hour: "23:00", requests: 420, errors: 1 },
	];

	// Mock alerts
	const mockAlerts = [
		{
			id: 1,
			type: "rate_limit",
			severity: "warning",
			message: "Rate limit threshold exceeded on /api/auth/login",
			endpoint: "/api/auth/login",
			threshold: 80,
			currentValue: 87,
			timestamp: "2024-01-20T14:45:22Z",
			resolved: false,
		},
		{
			id: 2,
			type: "error_rate",
			severity: "error",
			message: "Error rate spike detected on /api/startups/search",
			endpoint: "/api/startups/search",
			threshold: 1.0,
			currentValue: 1.3,
			timestamp: "2024-01-20T14:30:15Z",
			resolved: false,
		},
		{
			id: 3,
			type: "response_time",
			severity: "info",
			message: "Response time increased on /api/admin/users",
			endpoint: "/api/admin/users",
			threshold: 400,
			currentValue: 420,
			timestamp: "2024-01-20T14:15:33Z",
			resolved: true,
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

	function formatBytes(bytes: number): string {
		const sizes = ["B", "KB", "MB", "GB"];
		if (bytes === 0) return "0 B";
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return (
			Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
		);
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "healthy":
				return "bg-green-100 text-green-800 border-green-300";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "critical":
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

	function getTrendIcon(trend: string) {
		switch (trend) {
			case "up":
				return TrendingUp;
			case "down":
				return TrendingDown;
			default:
				return Activity;
		}
	}

	function getTrendColor(trend: string): string {
		switch (trend) {
			case "up":
				return "text-red-600";
			case "down":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	}

	function getUsagePercentage(current: number, limit: number): number {
		return Math.round((current / limit) * 100);
	}

	function getUsageStatus(percentage: number): string {
		if (percentage >= 90) return "critical";
		if (percentage >= 75) return "warning";
		return "normal";
	}

	function updateRateLimit(endpoint: any) {
		console.log(
			"Updating rate limit for:",
			endpoint.path,
			"to:",
			newRateLimit,
		);
		showRateLimitDialog = false;
	}

	function configureAlert() {
		console.log("Configuring alert:", {
			threshold: alertThreshold,
			enabled: alertEnabled,
		});
		showAlertConfigDialog = false;
	}

	function getTimeframeOptions() {
		return [
			{ value: "5m", label: "Last 5 Minutes" },
			{ value: "15m", label: "Last 15 Minutes" },
			{ value: "1h", label: "Last Hour" },
			{ value: "24h", label: "Last 24 Hours" },
			{ value: "7d", label: "Last 7 Days" },
		];
	}
</script>

<svelte:head>
	<title>API Usage Monitoring - Admin Dashboard</title>
	<meta
		name="description"
		content="Monitor API performance, usage patterns, and rate limiting in real-time"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">API Usage Monitoring</h1>
			<p class="text-muted-foreground">
				Monitor API performance, usage patterns, and manage rate limits
			</p>
		</div>
		<div class="mt-4 md:mt-0 flex gap-2">
			<Select bind:value={selectedTimeframe}>
				<SelectTrigger class="w-40">
					<SelectValue placeholder="Timeframe" />
				</SelectTrigger>
				<SelectContent>
					{#each getTimeframeOptions() as option}
						<SelectItem value={option.value}
							>{option.label}</SelectItem
						>
					{/each}
				</SelectContent>
			</Select>
			<Button variant="outline">
				<RefreshCw class="h-4 w-4 mr-2" />
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
				<Activity class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatNumber(mockApiMetrics.totalRequests)}
				</div>
				<p class="text-xs text-muted-foreground">
					{formatNumber(mockApiMetrics.requestsPerSecond)} req/sec
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Avg Response Time</CardTitle
				>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{formatTime(mockApiMetrics.avgResponseTime)}
				</div>
				<p class="text-xs text-muted-foreground">-2ms from last hour</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Error Rate</CardTitle>
				<AlertTriangle class="h-4 w-4 text-muted-foreground" />
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
				<Shield class="h-4 w-4 text-muted-foreground" />
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
	<Tabs defaultValue="endpoints" class="space-y-6">
		<TabsList class="grid w-full grid-cols-4">
			<TabsTrigger value="endpoints">Endpoints</TabsTrigger>
			<TabsTrigger value="ratelimits">Rate Limits</TabsTrigger>
			<TabsTrigger value="analytics">Analytics</TabsTrigger>
			<TabsTrigger value="alerts">Alerts</TabsTrigger>
		</TabsList>

		<!-- Endpoints Tab -->
		<TabsContent value="endpoints" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center space-x-2">
						<Server class="h-5 w-5" />
						<span>Endpoint Performance</span>
					</CardTitle>
					<CardDescription>
						Real-time monitoring of API endpoint performance and
						usage
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each mockEndpoints as endpoint}
							{@const TrendIcon = getTrendIcon(endpoint.trend)}
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
										<TrendIcon
											class="h-4 w-4 {getTrendColor(
												endpoint.trend,
											)}"
										/>
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
												>{endpoint.currentUsage}</span
											>
											<span
												>/{endpoint.rateLimit} used</span
											>
										</div>
									</div>
									<div class="mt-2">
										<div
											class="w-full bg-muted rounded-full h-2"
										>
											<div
												class="bg-primary h-2 rounded-full transition-all duration-300"
												style="width: {getUsagePercentage(
													endpoint.currentUsage,
													endpoint.rateLimit,
												)}%"
											></div>
										</div>
										<p
											class="text-xs text-muted-foreground mt-1"
										>
											Usage: {getUsagePercentage(
												endpoint.currentUsage,
												endpoint.rateLimit,
											)}% of rate limit
										</p>
									</div>
								</div>
								<div class="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											selectedEndpoint = endpoint;
											newRateLimit = endpoint.rateLimit;
											showRateLimitDialog = true;
										}}
									>
										<Settings class="h-4 w-4" />
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<!-- Rate Limits Tab -->
		<TabsContent value="ratelimits" class="space-y-6">
			<div class="flex justify-between items-center mb-4">
				<div>
					<h2 class="text-xl font-semibold">
						Rate Limit Configuration
					</h2>
					<p class="text-muted-foreground">
						Configure and monitor API rate limiting
					</p>
				</div>
				<Button>
					<Plus class="h-4 w-4 mr-2" />
					Add Rate Limit
				</Button>
			</div>

			<Card>
				<CardContent class="pt-6">
					<div class="space-y-4">
						{#each mockRateLimits as limit}
							{@const usagePercent = getUsagePercentage(
								limit.currentUsage,
								limit.limit,
							)}
							{@const status = getUsageStatus(usagePercent)}
							<div class="p-4 border rounded-lg">
								<div
									class="flex items-center justify-between mb-3"
								>
									<div>
										<h3 class="font-semibold">
											{limit.name}
										</h3>
										<p
											class="text-sm text-muted-foreground"
										>
											{limit.scope} • {limit.limit} requests
											per {limit.window}
										</p>
									</div>
									<Badge
										variant="outline"
										class={getStatusColor(status)}
									>
										{status}
									</Badge>
								</div>
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span>Current Usage</span>
										<span
											>{formatNumber(limit.currentUsage)} /
											{formatNumber(limit.limit)}</span
										>
									</div>
									<div
										class="w-full bg-muted rounded-full h-3"
									>
										<div
											class="h-3 rounded-full transition-all duration-300 {status ===
											'critical'
												? 'bg-red-500'
												: status === 'warning'
													? 'bg-yellow-500'
													: 'bg-green-500'}"
											style="width: {usagePercent}%"
										></div>
									</div>
									<div
										class="flex justify-between text-xs text-muted-foreground"
									>
										<span>{usagePercent}% utilized</span>
										<span
											>Last updated: {new Date(
												limit.lastUpdated,
											).toLocaleTimeString()}</span
										>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<!-- Analytics Tab -->
		<TabsContent value="analytics" class="space-y-6">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Usage Patterns -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center space-x-2">
							<BarChart3 class="h-5 w-5" />
							<span>Usage Patterns</span>
						</CardTitle>
						<CardDescription
							>API requests over the last 24 hours</CardDescription
						>
					</CardHeader>
					<CardContent>
						<div class="space-y-3">
							{#each mockUsagePatterns as pattern}
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium"
										>{pattern.hour}</span
									>
									<div class="flex items-center space-x-2">
										<span
											class="text-sm text-muted-foreground"
										>
											{formatNumber(pattern.requests)} req
										</span>
										<div
											class="w-24 bg-muted rounded-full h-2"
										>
											<div
												class="bg-blue-500 h-2 rounded-full"
												style="width: {(pattern.requests /
													2200) *
													100}%"
											></div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>

				<!-- Performance Metrics -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center space-x-2">
							<Zap class="h-5 w-5" />
							<span>Performance Metrics</span>
						</CardTitle>
						<CardDescription
							>Key performance indicators</CardDescription
						>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium"
									>Active Connections</span
								>
								<span class="text-sm"
									>{mockApiMetrics.activeConnections}</span
								>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium"
									>Peak Concurrent Users</span
								>
								<span class="text-sm"
									>{formatNumber(
										mockApiMetrics.peakConcurrentUsers,
									)}</span
								>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium"
									>Total Bandwidth</span
								>
								<span class="text-sm"
									>{mockApiMetrics.totalBandwidth} GB</span
								>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium"
									>Cache Hit Rate</span
								>
								<span class="text-sm"
									>{formatPercentage(
										mockApiMetrics.cacheHitRate,
									)}</span
								>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium"
									>Throttling Events</span
								>
								<span class="text-sm"
									>{mockApiMetrics.throttlingEvents}</span
								>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Additional Metrics -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader
						class="flex flex-row items-center justify-between space-y-0 pb-2"
					>
						<CardTitle class="text-sm font-medium"
							>Response Time</CardTitle
						>
						<Clock class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">
							{formatTime(mockApiMetrics.avgResponseTime)}
						</div>
						<p class="text-xs text-muted-foreground">P95: 450ms</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader
						class="flex flex-row items-center justify-between space-y-0 pb-2"
					>
						<CardTitle class="text-sm font-medium"
							>Success Rate</CardTitle
						>
						<CheckCircle class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">
							{formatPercentage(100 - mockApiMetrics.errorRate)}
						</div>
						<p class="text-xs text-muted-foreground">
							Last 24 hours
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader
						class="flex flex-row items-center justify-between space-y-0 pb-2"
					>
						<CardTitle class="text-sm font-medium"
							>Data Transfer</CardTitle
						>
						<Database class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">
							{formatBytes(
								mockApiMetrics.totalBandwidth *
									1024 *
									1024 *
									1024,
							)}
						</div>
						<p class="text-xs text-muted-foreground">This month</p>
					</CardContent>
				</Card>
			</div>
		</TabsContent>

		<!-- Alerts Tab -->
		<TabsContent value="alerts" class="space-y-6">
			<div class="flex justify-between items-center mb-4">
				<div>
					<h2 class="text-xl font-semibold">API Alerts</h2>
					<p class="text-muted-foreground">
						Monitor API issues and configure alerts
					</p>
				</div>
				<div class="flex gap-2">
					<Dialog bind:open={showAlertConfigDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">
								<Settings class="h-4 w-4 mr-2" />
								Configure Alerts
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Alert Configuration</DialogTitle>
								<DialogDescription>
									Set up automatic alerts for API monitoring
								</DialogDescription>
							</DialogHeader>
							<div class="space-y-4">
								<div class="flex items-center space-x-2">
									<input
										type="checkbox"
										id="alerts-enabled"
										bind:checked={alertEnabled}
										class="rounded"
									/>
									<Label for="alerts-enabled"
										>Enable API alerts</Label
									>
								</div>

								<div class="space-y-2">
									<Label for="alert-threshold"
										>Alert Threshold (%)</Label
									>
									<Input
										id="alert-threshold"
										type="number"
										bind:value={alertThreshold}
										min="0"
										max="100"
									/>
								</div>

								<div class="space-y-2">
									<Label>Alert Types</Label>
									<div class="space-y-2">
										<div
											class="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												id="rate-limit-alert"
												checked
												class="rounded"
											/>
											<Label
												for="rate-limit-alert"
												class="text-sm"
												>Rate limit threshold</Label
											>
										</div>
										<div
											class="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												id="error-rate-alert"
												checked
												class="rounded"
											/>
											<Label
												for="error-rate-alert"
												class="text-sm"
												>Error rate spikes</Label
											>
										</div>
										<div
											class="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												id="response-time-alert"
												class="rounded"
											/>
											<Label
												for="response-time-alert"
												class="text-sm"
												>Response time degradation</Label
											>
										</div>
									</div>
								</div>

								<div class="flex justify-end space-x-2">
									<Button
										variant="outline"
										onclick={() =>
											(showAlertConfigDialog = false)}
									>
										Cancel
									</Button>
									<Button onclick={configureAlert}>
										Save Configuration
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<Card>
				<CardContent class="pt-6">
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
										<span class="font-medium"
											>Threshold:</span
										>
										{alert.threshold}{alert.type ===
										"rate_limit"
											? "%"
											: alert.type === "error_rate"
												? "%"
												: "ms"} •
										<span class="font-medium">Current:</span
										>
										{alert.currentValue}{alert.type ===
										"rate_limit"
											? "%"
											: alert.type === "error_rate"
												? "%"
												: "ms"}
									</div>
									<p
										class="text-xs text-muted-foreground mt-1"
									>
										{new Date(
											alert.timestamp,
										).toLocaleString()}
									</p>
								</div>
								<div class="flex items-center space-x-2">
									{#if !alert.resolved}
										<Button variant="outline" size="sm">
											<CheckCircle class="h-4 w-4" />
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
							per minute<br />
							Current usage: {selectedEndpoint.currentUsage} requests
							({getUsagePercentage(
								selectedEndpoint.currentUsage,
								selectedEndpoint.rateLimit,
							)}%)
						</div>
					</div>
					<div class="space-y-2">
						<Label for="new-limit"
							>New Rate Limit (requests per minute)</Label
						>
						<Input
							id="new-limit"
							type="number"
							bind:value={newRateLimit}
							min="1"
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
