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
		BarChart3,
		Plus,
		Edit,
		Trash2,
		Download,
		FileText,
		Calendar,
		Users,
		Building2,
		TrendingUp,
		DollarSign,
		Activity,
		Filter,
		Clock,
		Mail,
		FileSpreadsheet,
		FileJson,
		Send,
		Settings,
		Eye,
		EyeOff,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			reports: any[];
		};
	}>();

	const { user, reports } = data;

	// Mock reports data
	const mockReports = [
		{
			id: 1,
			name: "Monthly User Growth",
			description: "Track user registration and activity trends",
			type: "growth",
			schedule: "monthly",
			lastRun: "2024-01-20",
			status: "active",
			metrics: ["new_users", "active_users", "retention_rate"],
		},
		{
			id: 2,
			name: "Investment Performance",
			description: "Monitor investment transactions and success rates",
			type: "financial",
			schedule: "weekly",
			lastRun: "2024-01-19",
			status: "active",
			metrics: ["total_investments", "success_rate", "average_amount"],
		},
		{
			id: 3,
			name: "Platform Health",
			description: "System performance and uptime metrics",
			type: "system",
			schedule: "daily",
			lastRun: "2024-01-20",
			status: "active",
			metrics: ["uptime", "response_time", "error_rate"],
		},
	];

	// Available metrics for report building
	const availableMetrics = {
		users: [
			{
				key: "total_users",
				name: "Total Users",
				type: "number",
				icon: Users,
			},
			{
				key: "active_users",
				name: "Active Users",
				type: "number",
				icon: Activity,
			},
			{
				key: "new_users",
				name: "New Registrations",
				type: "number",
				icon: Users,
			},
			{
				key: "user_retention",
				name: "Retention Rate",
				type: "percentage",
				icon: TrendingUp,
			},
		],
		startups: [
			{
				key: "total_startups",
				name: "Total Startups",
				type: "number",
				icon: Building2,
			},
			{
				key: "approved_startups",
				name: "Approved Startups",
				type: "number",
				icon: Building2,
			},
			{
				key: "pending_approvals",
				name: "Pending Approvals",
				type: "number",
				icon: FileText,
			},
		],
		financial: [
			{
				key: "total_investments",
				name: "Total Investments",
				type: "currency",
				icon: DollarSign,
			},
			{
				key: "average_investment",
				name: "Average Investment",
				type: "currency",
				icon: DollarSign,
			},
			{
				key: "investment_success",
				name: "Success Rate",
				type: "percentage",
				icon: TrendingUp,
			},
		],
		system: [
			{
				key: "uptime",
				name: "System Uptime",
				type: "percentage",
				icon: Activity,
			},
			{
				key: "response_time",
				name: "Response Time",
				type: "duration",
				icon: Activity,
			},
			{
				key: "error_rate",
				name: "Error Rate",
				type: "percentage",
				icon: Activity,
			},
		],
	};

	let showReportBuilder = $state(false);
	let selectedReport = $state<any>(null);
	let reportName = $state("");
	let reportDescription = $state("");
	let selectedMetrics = $state<string[]>([]);
	let reportSchedule = $state("weekly");
	let dateRange = $state("30");
	let showAdvancedFilters = $state(false);
	let showScheduleDialog = $state(false);
	let showExportDialog = $state(false);

	// Advanced filtering
	let userRoleFilter = $state<string[]>([]);
	let statusFilter = $state<string[]>([]);
	let categoryFilter = $state<string[]>([]);
	let dateFrom = $state("");
	let dateTo = $state("");

	// Scheduled delivery
	let scheduleEnabled = $state(false);
	let scheduleFrequency = $state("weekly");
	let scheduleTime = $state("09:00");
	let scheduleEmails = $state<string[]>([]);
	let newEmail = $state("");

	// Export settings
	let exportFormat = $state("pdf");
	let exportFileName = $state("");

	function getReportTypeColor(type: string): string {
		switch (type) {
			case "growth":
				return "bg-green-100 text-green-800 border-green-300";
			case "financial":
				return "bg-blue-100 text-blue-800 border-blue-300";
			case "system":
				return "bg-purple-100 text-purple-800 border-purple-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function getScheduleColor(schedule: string): string {
		switch (schedule) {
			case "daily":
				return "bg-red-100 text-red-800 border-red-300";
			case "weekly":
				return "bg-orange-100 text-orange-800 border-orange-300";
			case "monthly":
				return "bg-blue-100 text-blue-800 border-blue-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}

	function toggleMetric(metric: string) {
		if (selectedMetrics.includes(metric)) {
			selectedMetrics = selectedMetrics.filter((m) => m !== metric);
		} else {
			selectedMetrics = [...selectedMetrics, metric];
		}
	}

	function createReport() {
		// TODO: Implement report creation
		console.log("Creating report:", {
			name: reportName,
			description: reportDescription,
			metrics: selectedMetrics,
			schedule: reportSchedule,
			dateRange,
		});
		showReportBuilder = false;
		// Reset form
		reportName = "";
		reportDescription = "";
		selectedMetrics = [];
		reportSchedule = "weekly";
		dateRange = "30";
	}

	function runReport(report: any) {
		// TODO: Implement report execution
		console.log("Running report:", report);
	}

	function deleteReport(report: any) {
		// TODO: Implement report deletion
		console.log("Deleting report:", report);
	}

	// Advanced filtering functions
	function toggleRoleFilter(role: string) {
		if (userRoleFilter.includes(role)) {
			userRoleFilter = userRoleFilter.filter((r) => r !== role);
		} else {
			userRoleFilter = [...userRoleFilter, role];
		}
	}

	function toggleStatusFilter(status: string) {
		if (statusFilter.includes(status)) {
			statusFilter = statusFilter.filter((s) => s !== status);
		} else {
			statusFilter = [...statusFilter, status];
		}
	}

	function toggleCategoryFilter(category: string) {
		if (categoryFilter.includes(category)) {
			categoryFilter = categoryFilter.filter((c) => c !== category);
		} else {
			categoryFilter = [...categoryFilter, category];
		}
	}

	// Schedule functions
	function addScheduleEmail() {
		if (newEmail && !scheduleEmails.includes(newEmail)) {
			scheduleEmails = [...scheduleEmails, newEmail];
			newEmail = "";
		}
	}

	function removeScheduleEmail(email: string) {
		scheduleEmails = scheduleEmails.filter((e) => e !== email);
	}

	function saveSchedule() {
		// TODO: Implement schedule saving
		console.log("Saving schedule:", {
			enabled: scheduleEnabled,
			frequency: scheduleFrequency,
			time: scheduleTime,
			emails: scheduleEmails,
		});
		showScheduleDialog = false;
	}

	// Export functions
	function exportReport(report: any) {
		exportFileName = report.name.replace(/\s+/g, "_");
		showExportDialog = true;
	}

	function performExport() {
		// TODO: Implement report export
		console.log("Exporting report:", {
			format: exportFormat,
			fileName: exportFileName,
		});
		showExportDialog = false;
	}

	function getExportFormatIcon(format: string) {
		switch (format) {
			case "pdf":
				return FileText;
			case "excel":
				return FileSpreadsheet;
			case "csv":
				return FileText;
			case "json":
				return FileJson;
			default:
				return FileText;
		}
	}
</script>

<svelte:head>
	<title>Custom Reports - Admin Dashboard</title>
	<meta
		name="description"
		content="Create and manage custom analytical reports"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">Custom Reports</h1>
			<p class="text-muted-foreground">
				Create and manage custom analytical reports for detailed
				insights
			</p>
		</div>
		<div class="mt-4 md:mt-0">
			<Dialog bind:open={showReportBuilder}>
				<DialogTrigger asChild>
					<Button>
						<Plus class="h-4 w-4 mr-2" />
						Create Report
					</Button>
				</DialogTrigger>
				<DialogContent class="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Create Custom Report</DialogTitle>
						<DialogDescription>
							Build a custom report by selecting metrics and
							configuring parameters
						</DialogDescription>
					</DialogHeader>

					<div class="space-y-6">
						<!-- Basic Information -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="report-name">Report Name</Label>
								<Input
									id="report-name"
									bind:value={reportName}
									placeholder="Enter report name"
								/>
							</div>
							<div class="space-y-2">
								<Label for="report-schedule">Schedule</Label>
								<Select bind:value={reportSchedule}>
									<SelectTrigger>
										<SelectValue
											placeholder="Select schedule"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="manual"
											>Manual</SelectItem
										>
										<SelectItem value="daily"
											>Daily</SelectItem
										>
										<SelectItem value="weekly"
											>Weekly</SelectItem
										>
										<SelectItem value="monthly"
											>Monthly</SelectItem
										>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="report-description">Description</Label>
							<Input
								id="report-description"
								bind:value={reportDescription}
								placeholder="Describe what this report measures"
							/>
						</div>

						<!-- Advanced Filters Toggle -->
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<Label class="text-base font-medium"
									>Advanced Filters</Label
								>
								<Button
									variant="outline"
									size="sm"
									onclick={() =>
										(showAdvancedFilters =
											!showAdvancedFilters)}
								>
									{showAdvancedFilters ? EyeOff : Eye}
									{showAdvancedFilters ? "Hide" : "Show"} Filters
								</Button>
							</div>

							{#if showAdvancedFilters}
								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20"
								>
									<!-- Date Range Filter -->
									<div class="space-y-2">
										<Label class="text-sm">Date Range</Label
										>
										<div class="grid grid-cols-2 gap-2">
											<Input
												type="date"
												bind:value={dateFrom}
												placeholder="From date"
											/>
											<Input
												type="date"
												bind:value={dateTo}
												placeholder="To date"
											/>
										</div>
									</div>

									<!-- User Role Filter -->
									<div class="space-y-2">
										<Label class="text-sm">User Roles</Label
										>
										<div class="flex flex-wrap gap-1">
											{#each ["founder", "investor", "support", "admin"] as role}
												<button
													class="px-2 py-1 text-xs border rounded {userRoleFilter.includes(
														role,
													)
														? 'bg-primary text-primary-foreground'
														: 'hover:bg-muted'}"
													onclick={() =>
														toggleRoleFilter(role)}
												>
													{role}
												</button>
											{/each}
										</div>
									</div>

									<!-- Status Filter -->
									<div class="space-y-2">
										<Label class="text-sm">Status</Label>
										<div class="flex flex-wrap gap-1">
											{#each ["active", "pending", "suspended", "approved", "rejected"] as status}
												<button
													class="px-2 py-1 text-xs border rounded {statusFilter.includes(
														status,
													)
														? 'bg-primary text-primary-foreground'
														: 'hover:bg-muted'}"
													onclick={() =>
														toggleStatusFilter(
															status,
														)}
												>
													{status}
												</button>
											{/each}
										</div>
									</div>

									<!-- Category Filter -->
									<div class="space-y-2">
										<Label class="text-sm">Categories</Label
										>
										<div class="flex flex-wrap gap-1">
											{#each ["Technology", "Energy", "AI", "Healthcare", "Finance"] as category}
												<button
													class="px-2 py-1 text-xs border rounded {categoryFilter.includes(
														category,
													)
														? 'bg-primary text-primary-foreground'
														: 'hover:bg-muted'}"
													onclick={() =>
														toggleCategoryFilter(
															category,
														)}
												>
													{category}
												</button>
											{/each}
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Metric Selection -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold">
								Select Metrics
							</h3>
							{#each Object.entries(availableMetrics) as [category, metrics]}
								<div class="space-y-2">
									<h4
										class="font-medium capitalize text-sm text-muted-foreground"
									>
										{category}
									</h4>
									<div
										class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
									>
										{#each metrics as metric}
											<div
												class="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
												class:bg-accent={selectedMetrics.includes(
													metric.key,
												)}
												onclick={() =>
													toggleMetric(metric.key)}
											>
												<metric.icon class="h-4 w-4" />
												<span class="text-sm"
													>{metric.name}</span
												>
												{#if selectedMetrics.includes(metric.key)}
													<Badge
														variant="secondary"
														class="ml-auto"
														>Selected</Badge
													>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>

						<!-- Date Range -->
						<div class="space-y-2">
							<Label for="date-range"
								>Default Date Range (days)</Label
							>
							<Select bind:value={dateRange}>
								<SelectTrigger>
									<SelectValue
										placeholder="Select date range"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7"
										>Last 7 days</SelectItem
									>
									<SelectItem value="30"
										>Last 30 days</SelectItem
									>
									<SelectItem value="90"
										>Last 90 days</SelectItem
									>
									<SelectItem value="365"
										>Last year</SelectItem
									>
								</SelectContent>
							</Select>
						</div>

						<!-- Actions -->
						<div class="space-y-4">
							<!-- Quick Actions -->
							<div class="flex justify-between items-center">
								<div class="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onclick={() =>
											(showScheduleDialog = true)}
									>
										<Clock class="h-4 w-4 mr-2" />
										Schedule Delivery
									</Button>
									<Button
										variant="outline"
										size="sm"
										onclick={() =>
											(showExportDialog = true)}
									>
										<Download class="h-4 w-4 mr-2" />
										Export Options
									</Button>
								</div>
								<div class="text-sm text-muted-foreground">
									{selectedMetrics.length} metrics selected
								</div>
							</div>

							<!-- Main Actions -->
							<div class="flex justify-end space-x-2">
								<Button
									variant="outline"
									onclick={() => (showReportBuilder = false)}
								>
									Cancel
								</Button>
								<Button
									onclick={createReport}
									disabled={!reportName ||
										selectedMetrics.length === 0}
								>
									Create Report
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	</div>

	<!-- Existing Reports -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
		<Card class="lg:col-span-2">
			<CardHeader>
				<CardTitle>Your Reports</CardTitle>
				<CardDescription>
					Manage and run your custom analytical reports
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each mockReports as report}
						<div
							class="flex items-center justify-between p-4 border rounded-lg"
						>
							<div class="flex-1">
								<div class="flex items-center space-x-3 mb-2">
									<h3 class="font-semibold">{report.name}</h3>
									<Badge
										variant="outline"
										class={getReportTypeColor(report.type)}
									>
										{report.type}
									</Badge>
									<Badge
										variant="outline"
										class={getScheduleColor(
											report.schedule,
										)}
									>
										{report.schedule}
									</Badge>
								</div>
								<p class="text-sm text-muted-foreground mb-2">
									{report.description}
								</p>
								<div
									class="flex items-center space-x-4 text-xs text-muted-foreground"
								>
									<span
										>Last run: {formatDate(
											report.lastRun,
										)}</span
									>
									<span>{report.metrics.length} metrics</span>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onclick={() => runReport(report)}
								>
									<Download class="h-4 w-4 mr-1" />
									Run
								</Button>
								<Button
									variant="outline"
									size="sm"
									onclick={() => exportReport(report)}
								>
									<FileSpreadsheet class="h-4 w-4 mr-1" />
									Export
								</Button>
								<Button variant="ghost" size="sm">
									<Edit class="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => deleteReport(report)}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						</div>
					{/each}
				</div>

				{#if mockReports.length === 0}
					<div class="text-center py-8">
						<BarChart3
							class="h-12 w-12 text-muted-foreground mx-auto mb-4"
						/>
						<h3 class="text-lg font-semibold mb-2">
							No reports yet
						</h3>
						<p class="text-muted-foreground mb-4">
							Create your first custom report to start analyzing
							platform data
						</p>
						<Button onclick={() => (showReportBuilder = true)}>
							<Plus class="h-4 w-4 mr-2" />
							Create Your First Report
						</Button>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Reports</CardTitle>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{mockReports.length}</div>
				<p class="text-xs text-muted-foreground">
					Active custom reports
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Scheduled Runs</CardTitle
				>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{mockReports.filter((r) => r.schedule !== "manual").length}
				</div>
				<p class="text-xs text-muted-foreground">Automated reports</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Data Points</CardTitle>
				<BarChart3 class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{mockReports.reduce((acc, r) => acc + r.metrics.length, 0)}
				</div>
				<p class="text-xs text-muted-foreground">
					Total metrics tracked
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Last Generated</CardTitle
				>
				<Download class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">Today</div>
				<p class="text-xs text-muted-foreground">
					Most recent report run
				</p>
			</CardContent>
		</Card>
	</div>

	<!-- Schedule Delivery Dialog -->
	<Dialog bind:open={showScheduleDialog}>
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle class="flex items-center space-x-2">
					<Clock class="h-5 w-5 text-blue-500" />
					<span>Schedule Report Delivery</span>
				</DialogTitle>
				<DialogDescription>
					Set up automatic report delivery via email
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-4">
				<!-- Schedule Settings -->
				<div class="space-y-4">
					<div class="flex items-center space-x-2">
						<input
							type="checkbox"
							id="schedule-enabled"
							bind:checked={scheduleEnabled}
							class="rounded"
						/>
						<Label for="schedule-enabled"
							>Enable scheduled delivery</Label
						>
					</div>

					{#if scheduleEnabled}
						<div class="space-y-4">
							<!-- Frequency -->
							<div class="space-y-2">
								<Label for="schedule-frequency">Frequency</Label
								>
								<Select bind:value={scheduleFrequency}>
									<SelectTrigger>
										<SelectValue
											placeholder="Select frequency"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="daily"
											>Daily</SelectItem
										>
										<SelectItem value="weekly"
											>Weekly</SelectItem
										>
										<SelectItem value="monthly"
											>Monthly</SelectItem
										>
									</SelectContent>
								</Select>
							</div>

							<!-- Time -->
							<div class="space-y-2">
								<Label for="schedule-time">Delivery Time</Label>
								<Input
									id="schedule-time"
									type="time"
									bind:value={scheduleTime}
								/>
							</div>

							<!-- Email Recipients -->
							<div class="space-y-2">
								<Label for="email-input">Email Recipients</Label
								>
								<div class="flex gap-2">
									<Input
										id="email-input"
										type="email"
										bind:value={newEmail}
										placeholder="Enter email address"
									/>
									<Button
										size="sm"
										onclick={addScheduleEmail}
										disabled={!newEmail}
									>
										<Plus class="h-4 w-4" />
									</Button>
								</div>
								<div class="flex flex-wrap gap-1 mt-2">
									{#each scheduleEmails as email}
										<Badge
											variant="secondary"
											class="flex items-center gap-1"
										>
											{email}
											<button
												onclick={() =>
													removeScheduleEmail(email)}
												class="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
											>
												×
											</button>
										</Badge>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="flex justify-end space-x-2">
					<Button
						variant="outline"
						onclick={() => (showScheduleDialog = false)}
					>
						Cancel
					</Button>
					<Button onclick={saveSchedule} disabled={!scheduleEnabled}>
						<Send class="h-4 w-4 mr-2" />
						Save Schedule
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>

	<!-- Export Dialog -->
	<Dialog bind:open={showExportDialog}>
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle class="flex items-center space-x-2">
					<Download class="h-5 w-5 text-green-500" />
					<span>Export Report</span>
				</DialogTitle>
				<DialogDescription>
					Choose export format and settings
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-4">
				<!-- Export Settings -->
				<div class="space-y-4">
					<!-- Format Selection -->
					<div class="space-y-2">
						<Label for="export-format">Export Format</Label>
						<div class="grid grid-cols-2 gap-2">
							{#each ["pdf", "excel", "csv", "json"] as format}
								{@const IconComponent =
									getExportFormatIcon(format)}
								<button
									class="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors {exportFormat ===
									format
										? 'border-primary bg-primary/5'
										: ''}"
									onclick={() => (exportFormat = format)}
								>
									<IconComponent class="h-5 w-5" />
									<span class="font-medium"
										>{format.toUpperCase()}</span
									>
								</button>
							{/each}
						</div>
					</div>

					<!-- File Name -->
					<div class="space-y-2">
						<Label for="export-filename">File Name</Label>
						<Input
							id="export-filename"
							bind:value={exportFileName}
							placeholder="Enter file name (without extension)"
						/>
					</div>

					<!-- Export Options -->
					<div class="space-y-3">
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="include-charts"
								class="rounded"
							/>
							<Label for="include-charts" class="text-sm"
								>Include charts and visualizations</Label
							>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="include-raw-data"
								class="rounded"
								checked
							/>
							<Label for="include-raw-data" class="text-sm"
								>Include raw data</Label
							>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="include-summary"
								class="rounded"
								checked
							/>
							<Label for="include-summary" class="text-sm"
								>Include executive summary</Label
							>
						</div>
					</div>

					<!-- Export Preview -->
					<div class="p-3 bg-muted rounded-lg">
						<div class="text-sm text-muted-foreground">
							<strong>Preview:</strong>
							{exportFileName || "report"}.{exportFormat}<br />
							<strong>Size:</strong> ~2.3 MB (estimated)<br />
							<strong>Contains:</strong>
							{selectedMetrics.length} metrics, charts, and data
						</div>
					</div>
				</div>

				<div class="flex justify-end space-x-2">
					<Button
						variant="outline"
						onclick={() => (showExportDialog = false)}
					>
						Cancel
					</Button>
					<Button onclick={performExport}>
						<Download class="h-4 w-4 mr-2" />
						Export Report
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</div>
