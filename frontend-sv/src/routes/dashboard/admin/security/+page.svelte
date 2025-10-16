<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import {
		IconShield,
		IconAlertHexagon,
		IconLock,
		IconEye,
		IconFileText,
		IconDatabase,
		IconSearch,
		IconDownload,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			securityAlerts: any[];
			auditLogs: any[];
			systemHealth: any;
			securityMetrics: any;
		};
	}>();

	const { user, securityAlerts, auditLogs, systemHealth, securityMetrics } =
		data;

	function getSeverityColor(severity: string): string {
		switch (severity) {
			case "high":
				return "bg-red-100 text-red-800 border-red-300";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "low":
				return "bg-blue-100 text-blue-800 border-blue-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function getStatusColor(status: string): string {
		return status === "success"
			? "bg-green-100 text-green-800 border-green-300"
			: "bg-red-100 text-red-800 border-red-300";
	}

	function getSystemStatusColor(status: string): string {
		return status === "active" ||
			status === "enabled" ||
			status === "completed" ||
			status === "online"
			? "bg-green-100 text-green-800 border-green-300"
			: "bg-red-100 text-red-800 border-red-300";
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}
</script>

<svelte:head>
	<title>Security Dashboard - StartupConnect</title>
	<meta
		name="description"
		content="Monitor security events and system health"
	/>
</svelte:head>

<div class="px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">Security Dashboard</h1>
			<p class="text-muted-foreground">
				Monitor security events, audit logs, and system health
			</p>
		</div>
		<div class="mt-4 md:mt-0 flex gap-2">
			<Button variant="outline">
				<IconDownload class="h-4 w-4 mr-2" />
				Export Logs
			</Button>
		</div>
	</div>

	<!-- System Health Overview -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Firewall</CardTitle>
				<IconShield class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<Badge
					variant="outline"
					class={getSystemStatusColor(systemHealth.firewall)}
				>
					{systemHealth.firewall}
				</Badge>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Encryption</CardTitle>
				<IconLock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<Badge
					variant="outline"
					class={getSystemStatusColor(systemHealth.encryption)}
				>
					{systemHealth.encryption}
				</Badge>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Backup Status</CardTitle>
				<IconDatabase class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<Badge
					variant="outline"
					class={getSystemStatusColor(systemHealth.backup)}
				>
					{systemHealth.backup}
				</Badge>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Monitoring</CardTitle>
				<IconEye class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<Badge
					variant="outline"
					class={getSystemStatusColor(systemHealth.monitoring)}
				>
					{systemHealth.monitoring}
				</Badge>
			</CardContent>
		</Card>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Security Alerts -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<IconAlertHexagon class="h-5 w-5" />
					<span>Security Alerts</span>
				</CardTitle>
				<CardDescription
					>Recent security events and alerts</CardDescription
				>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each securityAlerts as alert}
						<div class="border rounded-lg p-4">
							<div class="flex items-start justify-between mb-2">
								<div class="flex-1">
									<div
										class="flex items-center space-x-2 mb-1"
									>
										<Badge
											variant="outline"
											class={getSeverityColor(
												alert.severity,
											)}
										>
											{alert.severity}
										</Badge>
										<span
											class="text-sm text-muted-foreground"
										>
											{formatDate(alert.timestamp)}
										</span>
									</div>
									<p class="text-sm">{alert.message}</p>
								</div>
								<div class="ml-4">
									{#if alert.resolved}
										<Badge
											variant="outline"
											class="bg-green-100 text-green-800 border-green-300"
										>
											Resolved
										</Badge>
									{:else}
										<Badge
											variant="outline"
											class="bg-red-100 text-red-800 border-red-300"
										>
											Active
										</Badge>
									{/if}
								</div>
							</div>
							<div class="flex gap-2 mt-3">
								<Button variant="outline" size="sm">
									<IconEye class="h-4 w-4 mr-1" />
									Investigate
								</Button>
								{#if !alert.resolved}
									<Button variant="outline" size="sm">
										<IconShield class="h-4 w-4 mr-1" />
										Resolve
									</Button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>

		<!-- Audit Log -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<IconFileText class="h-5 w-5" />
					<span>Audit Log</span>
				</CardTitle>
				<CardDescription>Recent administrative actions</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each auditLogs as log}
						<div class="border rounded-lg p-4">
							<div class="flex items-start justify-between mb-2">
								<div class="flex-1">
									<div
										class="flex items-center space-x-2 mb-1"
									>
										<h3 class="font-semibold text-sm">
											{log.action}
										</h3>
										<Badge
											variant="outline"
											class={getStatusColor(log.status)}
										>
											{log.status}
										</Badge>
									</div>
									<p class="text-sm text-muted-foreground">
										User: {log.user} • IP: {log.ipAddress}
									</p>
								</div>
							</div>
							<p class="text-xs text-muted-foreground">
								{formatDate(log.timestamp)}
							</p>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Security Metrics -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
		<Card>
			<CardHeader>
				<CardTitle>Login Attempts</CardTitle>
				<CardDescription>Authentication activity</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-sm">Successful</span>
						<span class="text-sm font-semibold"
							>{securityMetrics.successfulLogins}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Failed</span>
						<span class="text-sm font-semibold text-red-600"
							>{securityMetrics.failedLogins}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Success Rate</span>
						<span class="text-sm font-semibold"
							>{securityMetrics.successRate}%</span
						>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Data Access</CardTitle>
				<CardDescription>Recent data operations</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-sm">Records Accessed</span>
						<span class="text-sm font-semibold"
							>{securityMetrics.recordsAccessed}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Unauthorized Attempts</span>
						<span class="text-sm font-semibold text-red-600"
							>{securityMetrics.unauthorizedAttempts}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Compliance Rate</span>
						<span class="text-sm font-semibold"
							>{securityMetrics.complianceRate}%</span
						>
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>System Alerts</CardTitle>
				<CardDescription>Active system notifications</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-sm">High Priority</span>
						<span class="text-sm font-semibold text-red-600"
							>{securityMetrics.highPriority}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Medium Priority</span>
						<span class="text-sm font-semibold text-yellow-600"
							>{securityMetrics.mediumPriority}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-sm">Low Priority</span>
						<span class="text-sm font-semibold"
							>{securityMetrics.lowPriority}</span
						>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
