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
		
	} from "$lib/components/ui/select";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import {
		IconDownload,
		IconFileText,
		IconDatabase,
		IconSettings,
		IconUser,
		IconBuilding,
		IconTrendingUp,
		IconFilter,
		IconPlus,
		IconEdit,
		IconTrash,
		IconClock,
		IconFileSpreadsheet,
		IconFileCode,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			exportHistory: any[];
			exportTemplates: any[];
			dataStats: any;
		};
	}>();

	const { user, exportHistory, exportTemplates, dataStats } = data;

	// State management
	let selectedDataType = $state("users");
	let selectedFormat = $state("csv");
	let selectedFields = $state<string[]>([]);
	let dateRange = $state("all");
	let includeFilters = $state(true);
	let showCreateTemplateDialog = $state(false);
	let templateName = $state("");
	let templateDescription = $state("");
	let isExporting = $state(false);
	let exportProgress = $state(0);

	// Mock export history
	const mockExportHistory = [
		{
			id: 1,
			name: "User Export - Active Users",
			dataType: "users",
			format: "csv",
			records: 2450,
			size: "2.3 MB",
			status: "completed",
			createdAt: "2024-01-20T14:30:22Z",
			downloadUrl: "/api/admin/export/download/1",
		},
		{
			id: 2,
			name: "Startup Analytics Report",
			dataType: "startups",
			format: "excel",
			records: 890,
			size: "1.8 MB",
			status: "completed",
			createdAt: "2024-01-20T12:15:33Z",
			downloadUrl: "/api/admin/export/download/2",
		},
		{
			id: 3,
			name: "Investment Performance",
			dataType: "investments",
			format: "json",
			records: 1200,
			size: "856 KB",
			status: "processing",
			createdAt: "2024-01-20T10:45:18Z",
			downloadUrl: null,
		},
	];

	// Mock export templates
	const mockExportTemplates = [
		{
			id: 1,
			name: "User Overview",
			description: "Basic user information with roles and status",
			dataType: "users",
			fields: [
				"id",
				"name",
				"email",
				"role",
				"status",
				"createdAt",
				"lastLogin",
			],
			format: "csv",
			filters: { status: "active" },
			createdBy: "admin",
			usageCount: 15,
		},
		{
			id: 2,
			name: "Startup Details",
			description: "Complete startup information with funding data",
			dataType: "startups",
			fields: [
				"id",
				"name",
				"founder",
				"status",
				"funding",
				"category",
				"createdAt",
			],
			format: "excel",
			filters: { status: "approved" },
			createdBy: "admin",
			usageCount: 8,
		},
		{
			id: 3,
			name: "Investment Report",
			description: "Investment transactions with analytics",
			dataType: "investments",
			fields: [
				"id",
				"startupName",
				"investorName",
				"amount",
				"status",
				"createdAt",
			],
			format: "json",
			filters: { status: "completed" },
			createdBy: "admin",
			usageCount: 12,
		},
	];

	// Mock data statistics
	const mockDataStats = {
		users: { total: 3240, lastUpdated: "2024-01-20T14:32:15Z" },
		startups: { total: 890, lastUpdated: "2024-01-20T14:30:45Z" },
		investments: { total: 1200, lastUpdated: "2024-01-20T14:28:30Z" },
		documents: { total: 2450, lastUpdated: "2024-01-20T14:25:15Z" },
	};

	// Available fields by data type
	const availableFields = {
		users: [
			{
				key: "id",
				name: "User ID",
				type: "number",
				description: "Unique user identifier",
			},
			{
				key: "name",
				name: "Full Name",
				type: "string",
				description: "User's full name",
			},
			{
				key: "email",
				name: "Email Address",
				type: "string",
				description: "User's email address",
			},
			{
				key: "role",
				name: "User Role",
				type: "string",
				description: "Founder, Investor, Support, or Admin",
			},
			{
				key: "status",
				name: "Account Status",
				type: "string",
				description: "Active, Pending, Suspended",
			},
			{
				key: "createdAt",
				name: "Registration Date",
				type: "date",
				description: "When the user registered",
			},
			{
				key: "lastLogin",
				name: "Last Login",
				type: "date",
				description: "User's last login date",
			},
			{
				key: "phone",
				name: "Phone Number",
				type: "string",
				description: "User's phone number",
			},
			{
				key: "location",
				name: "Location",
				type: "string",
				description: "User's location",
			},
			{
				key: "verified",
				name: "Email Verified",
				type: "boolean",
				description: "Whether email is verified",
			},
		],
		startups: [
			{
				key: "id",
				name: "Startup ID",
				type: "number",
				description: "Unique startup identifier",
			},
			{
				key: "name",
				name: "Company Name",
				type: "string",
				description: "Startup's company name",
			},
			{
				key: "founder",
				name: "Founder Name",
				type: "string",
				description: "Founder's full name",
			},
			{
				key: "status",
				name: "Application Status",
				type: "string",
				description: "Pending, Approved, Rejected",
			},
			{
				key: "funding",
				name: "Funding Goal",
				type: "currency",
				description: "Funding amount requested",
			},
			{
				key: "category",
				name: "Industry Category",
				type: "string",
				description: "Business category",
			},
			{
				key: "createdAt",
				name: "Submission Date",
				type: "date",
				description: "When application was submitted",
			},
			{
				key: "description",
				name: "Business Description",
				type: "text",
				description: "Startup description",
			},
			{
				key: "website",
				name: "Website URL",
				type: "url",
				description: "Company website",
			},
			{
				key: "teamSize",
				name: "Team Size",
				type: "number",
				description: "Number of team members",
			},
		],
		investments: [
			{
				key: "id",
				name: "Investment ID",
				type: "number",
				description: "Unique investment identifier",
			},
			{
				key: "startupName",
				name: "Startup Name",
				type: "string",
				description: "Invested startup name",
			},
			{
				key: "investorName",
				name: "Investor Name",
				type: "string",
				description: "Investor's full name",
			},
			{
				key: "amount",
				name: "Investment Amount",
				type: "currency",
				description: "Amount invested",
			},
			{
				key: "status",
				name: "Investment Status",
				type: "string",
				description: "Pending, Completed, Cancelled",
			},
			{
				key: "createdAt",
				name: "Investment Date",
				type: "date",
				description: "When investment was made",
			},
			{
				key: "returnRate",
				name: "Expected Return",
				type: "percentage",
				description: "Expected return rate",
			},
			{
				key: "duration",
				name: "Investment Period",
				type: "number",
				description: "Investment duration in months",
			},
			{
				key: "riskLevel",
				name: "Risk Level",
				type: "string",
				description: "Low, Medium, High risk",
			},
		],
		documents: [
			{
				key: "id",
				name: "Document ID",
				type: "number",
				description: "Unique document identifier",
			},
			{
				key: "name",
				name: "Document Name",
				type: "string",
				description: "Document filename",
			},
			{
				key: "type",
				name: "Document Type",
				type: "string",
				description: "PDF, DOC, XLS, etc.",
			},
			{
				key: "size",
				name: "File Size",
				type: "number",
				description: "File size in bytes",
			},
			{
				key: "uploadedBy",
				name: "Uploaded By",
				type: "string",
				description: "User who uploaded the document",
			},
			{
				key: "uploadedAt",
				name: "Upload Date",
				type: "date",
				description: "When document was uploaded",
			},
			{
				key: "status",
				name: "Review Status",
				type: "string",
				description: "Pending, Approved, Rejected",
			},
		],
	};

	// Format options
	const formatOptions = [
		{
			value: "csv",
			label: "CSV",
			description: "Comma-separated values for spreadsheet software",
			icon: IconFileSpreadsheet,
		},
		{
			value: "excel",
			label: "Excel",
			description: "Microsoft Excel format with multiple sheets",
			icon: IconFileSpreadsheet,
		},
		{
			value: "json",
			label: "JSON",
			description: "JavaScript Object Notation for developers",
			icon: IconFileCode,
		},
		{
			value: "xml",
			label: "XML",
			description: "Extensible Markup Language for structured data",
			icon: IconFileText,
		},
	];

	// Date range options
	const dateRangeOptions = [
		{
			value: "all",
			label: "All Time",
			description: "Export all available data",
		},
		{
			value: "7d",
			label: "Last 7 Days",
			description: "Data from the past week",
		},
		{
			value: "30d",
			label: "Last 30 Days",
			description: "Data from the past month",
		},
		{
			value: "90d",
			label: "Last 3 Months",
			description: "Data from the past quarter",
		},
		{
			value: "1y",
			label: "Last Year",
			description: "Data from the past year",
		},
		{
			value: "custom",
			label: "Custom Range",
			description: "Select specific date range",
		},
	];

	function getCurrentFields(): any[] {
		return availableFields[selectedDataType] || [];
	}

	function toggleField(fieldKey: string) {
		if (selectedFields.includes(fieldKey)) {
			selectedFields = selectedFields.filter((f) => f !== fieldKey);
		} else {
			selectedFields = [...selectedFields, fieldKey];
		}
	}

	function selectAllFields() {
		const allFields = getCurrentFields().map((f) => f.key);
		selectedFields =
			selectedFields.length === allFields.length ? [] : allFields;
	}

	function getFieldDisplayName(key: string): string {
		const field = getCurrentFields().find((f) => f.key === key);
		return field ? field.name : key;
	}

	function getFieldType(key: string): string {
		const field = getCurrentFields().find((f) => f.key === key);
		return field ? field.type : "string";
	}

	function formatFileSize(bytes: number): string {
		const sizes = ["Bytes", "KB", "MB", "GB"];
		if (bytes === 0) return "0 Bytes";
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return (
			Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
		);
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-300";
			case "processing":
				return "bg-blue-100 text-blue-800 border-blue-300";
			case "failed":
				return "bg-red-100 text-red-800 border-red-300";
			case "cancelled":
				return "bg-gray-100 text-gray-800 border-gray-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function getFormatIcon(format: string) {
		switch (format) {
			case "csv":
			case "excel":
				return IconFileSpreadsheet;
			case "json":
				return IconFileCode;
			default:
				return IconFileText;
		}
	}

	async function startExport() {
		if (selectedFields.length === 0) return;

		isExporting = true;
		exportProgress = 0;

		// Simulate export progress
		const progressInterval = setInterval(() => {
			exportProgress += Math.random() * 15;
			if (exportProgress >= 100) {
				exportProgress = 100;
				clearInterval(progressInterval);
				setTimeout(() => {
					isExporting = false;
					exportProgress = 0;
					// In real app, would trigger download
					console.log("Export completed:", {
						dataType: selectedDataType,
						format: selectedFormat,
						fields: selectedFields,
						dateRange,
						includeFilters,
					});
				}, 500);
			}
		}, 200);
	}

	function saveAsTemplate() {
		if (!templateName || selectedFields.length === 0) return;

		console.log("Saving template:", {
			name: templateName,
			description: templateDescription,
			dataType: selectedDataType,
			fields: selectedFields,
			format: selectedFormat,
			dateRange,
			includeFilters,
		});

		showCreateTemplateDialog = false;
		templateName = "";
		templateDescription = "";
	}

	function loadTemplate(template: any) {
		selectedDataType = template.dataType;
		selectedFormat = template.format;
		selectedFields = template.fields;
		// Could also load filters and other settings
	}

	function deleteTemplate(template: any) {
		console.log("Deleting template:", template.id);
	}

	function downloadExport(exportItem: any) {
		if (exportItem.downloadUrl) {
			// In real app, would trigger download
			console.log("Downloading:", exportItem.downloadUrl);
		}
	}

	function getDataTypeIcon(dataType: string) {
		switch (dataType) {
			case "users":
				return IconUser;
			case "startups":
				return IconBuilding;
			case "investments":
				return IconTrendingUp;
			case "documents":
				return IconFileText;
			default:
				return IconDatabase;
		}
	}

	function getDataTypeName(dataType: string): string {
		switch (dataType) {
			case "users":
				return "Users";
			case "startups":
				return "Startups";
			case "investments":
				return "Investments";
			case "documents":
				return "Documents";
			default:
				return dataType;
		}
	}
</script>

<svelte:head>
	<title>Data Export - Admin Dashboard</title>
	<meta
		name="description"
		content="Export platform data with custom templates and configurations"
	/>
</svelte:head>

<div class="px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">Data Export</h1>
			<p class="text-muted-foreground">
				Export platform data with custom configurations and templates
			</p>
		</div>
		<div class="mt-4 md:mt-0 flex gap-2">
			<Button variant="outline">
				<IconFilter class="h-4 w-4 mr-2" />
				Filters
			</Button>
			<Button variant="outline">
				<IconSettings class="h-4 w-4 mr-2" />
				Settings
			</Button>
		</div>
	</div>

	<!-- Data Statistics Overview -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		{#each Object.entries(mockDataStats) as [dataType, stats]}
			{@const IconComponent = getDataTypeIcon(dataType)}
			<Card class="hover:shadow-md transition-all">
				<CardHeader
					class="flex flex-row items-center justify-between space-y-0 pb-2"
				>
					<CardTitle class="text-sm font-medium"
						>{getDataTypeName(dataType)}</CardTitle
					>
					<IconComponent class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{stats.total.toLocaleString()}
					</div>
					<p class="text-xs text-muted-foreground">
						Last updated: {formatDateTime(stats.lastUpdated)}
					</p>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Export Configuration -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
		<!-- Data Type Selection -->
		<Card>
			<CardHeader>
				<CardTitle class="text-lg">Data Type</CardTitle>
				<CardDescription>Choose what data to export</CardDescription>
			</CardHeader>
			<CardContent class="space-y-3">
				{#each Object.keys(availableFields) as dataType}
					{@const IconComponent = getDataTypeIcon(dataType)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors {selectedDataType ===
						dataType
							? 'border-primary bg-primary/5'
							: ''}"
						onclick={() => {
							selectedDataType = dataType;
							selectedFields = [];
						}}
					>
						<IconComponent class="h-5 w-5 text-muted-foreground" />
						<div class="flex-1">
							<div class="font-medium">
								{getDataTypeName(dataType)}
							</div>
							<div class="text-sm text-muted-foreground">
								{mockDataStats[dataType]?.total || 0} records
							</div>
						</div>
						<Checkbox
							checked={selectedDataType === dataType}
							
						/>
					</div>
				{/each}
			</CardContent>
		</Card>

		<!-- Export Configuration -->
		<Card>
			<CardHeader>
				<CardTitle class="text-lg">Configuration</CardTitle>
				<CardDescription>Configure export settings</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="format">Export Format</Label>
					<Select type="single" bind:value={selectedFormat}>
						<SelectTrigger>
							Select format
						</SelectTrigger>
						<SelectContent>
							{#each formatOptions as option}
								{@const IconComponent = option.icon}
								<SelectItem value={option.value}>
									<div class="flex items-center space-x-2">
										<IconComponent class="h-4 w-4" />
										<div>
											<div class="font-medium">
												{option.label}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												{option.description}
											</div>
										</div>
									</div>
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-2">
					<Label for="date-range">Date Range</Label>
					<Select type="single" bind:value={dateRange}>
						<SelectTrigger>
							Select date range
						</SelectTrigger>
						<SelectContent>
							{#each dateRangeOptions as option}
								<SelectItem value={option.value}>
									<div>
										<div class="font-medium">
											{option.label}
										</div>
										<div
											class="text-xs text-muted-foreground"
										>
											{option.description}
										</div>
									</div>
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>

				<div class="flex items-center space-x-2">
					<Checkbox
						bind:checked={includeFilters}
						id="include-filters"
					/>
					<Label for="include-filters" class="text-sm"
						>Include applied filters</Label
					>
				</div>
			</CardContent>
		</Card>

		<!-- Field Selection -->
		<Card>
			<CardHeader>
				<CardTitle class="text-lg">Fields</CardTitle>
				<CardDescription>Select fields to include</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<Label class="text-sm font-medium"
							>Available Fields</Label
						>
						<Button
							variant="ghost"
							size="sm"
							onclick={selectAllFields}
						>
							{selectedFields.length === getCurrentFields().length
								? "Deselect All"
								: "Select All"}
						</Button>
					</div>
					<div class="max-h-64 overflow-y-auto space-y-1">
						{#each getCurrentFields() as field}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<div
								class="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-accent transition-colors"
								onclick={() => toggleField(field.key)}
							>
								<Checkbox
									checked={selectedFields.includes(field.key)}
									
								/>
								<div class="flex-1 min-w-0">
									<div class="font-medium text-sm truncate">
										{field.name}
									</div>
									<div
										class="text-xs text-muted-foreground truncate"
									>
										{field.description}
									</div>
								</div>
								<Badge variant="outline" class="text-xs">
									{field.type}
								</Badge>
							</div>
						{/each}
					</div>
					<div class="text-xs text-muted-foreground mt-2">
						{selectedFields.length} of {getCurrentFields().length} fields
						selected
					</div>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Export Progress -->
	{#if isExporting}
		<Card class="mb-6 border-blue-200 bg-blue-50">
			<CardContent class="pt-6">
				<div class="flex items-center space-x-4">
					<IconDatabase class="h-5 w-5 text-blue-600 animate-pulse" />
					<div class="flex-1">
						<h3 class="font-semibold text-blue-900">
							Exporting {getDataTypeName(selectedDataType)} Data
						</h3>
						<p class="text-sm text-blue-700">
							Processing {selectedFields.length} fields in {selectedFormat.toUpperCase()}
							format...
						</p>
					</div>
					<div class="text-right">
						<div class="text-lg font-bold text-blue-900">
							{Math.round(exportProgress)}%
						</div>
					</div>
				</div>
				<div class="w-full bg-blue-200 rounded-full h-2 mt-4">
					<div
						class="bg-blue-600 h-2 rounded-full transition-all duration-300"
						style="width: {exportProgress}%"
					></div>
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Export Actions -->
	<div
		class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
	>
		<div>
			<h2 class="text-xl font-semibold">Export Actions</h2>
			<p class="text-muted-foreground">
				Generate export or save configuration as template
			</p>
		</div>
		<div class="flex gap-2">
			<Dialog bind:open={showCreateTemplateDialog}>
				<DialogTrigger>
					<Button variant="outline">
						<IconPlus class="h-4 w-4 mr-2" />
						Save Template
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Save Export Template</DialogTitle>
						<DialogDescription>
							Save current configuration as a reusable template
						</DialogDescription>
					</DialogHeader>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="template-name">Template Name</Label>
							<Input
								id="template-name"
								bind:value={templateName}
								placeholder="Enter template name"
							/>
						</div>
						<div class="space-y-2">
							<Label for="template-description"
								>Description (Optional)</Label
							>
							<Input
								id="template-description"
								bind:value={templateDescription}
								placeholder="Describe what this template exports"
							/>
						</div>
						<div class="flex justify-end space-x-2">
							<Button
								variant="outline"
								onclick={() =>
									(showCreateTemplateDialog = false)}
							>
								Cancel
							</Button>
							<Button
								onclick={saveAsTemplate}
								disabled={!templateName ||
									selectedFields.length === 0}
							>
								Save Template
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Button
				onclick={startExport}
				disabled={selectedFields.length === 0 || isExporting}
				class="min-w-32"
			>
				{#if isExporting}
					<IconClock class="h-4 w-4 mr-2 animate-spin" />
					Exporting...
				{:else}
					<IconDownload class="h-4 w-4 mr-2" />
					Export Data
				{/if}
			</Button>
		</div>
	</div>

	<!-- Tabs for Templates and History -->
	<Tabs value="templates" class="space-y-6">
		<TabsList class="grid w-full grid-cols-2">
			<TabsTrigger value="templates">Export Templates</TabsTrigger>
			<TabsTrigger value="history">Export History</TabsTrigger>
		</TabsList>

		<!-- Templates Tab -->
		<TabsContent value="templates" class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each mockExportTemplates as template}
					{@const IconComponent = getDataTypeIcon(template.dataType)}
					{@const FormatIcon = getFormatIcon(template.format)}
					<Card class="hover:shadow-md transition-all">
						<CardHeader>
							<div class="flex items-center justify-between">
								<CardTitle
									class="text-lg flex items-center space-x-2"
								>
									<IconComponent class="h-5 w-5" />
									<span>{template.name}</span>
								</CardTitle>
								<Badge variant="outline">
									<FormatIcon class="h-3 w-3 mr-1" />
									{template.format.toUpperCase()}
								</Badge>
							</div>
							<CardDescription
								>{template.description}</CardDescription
							>
						</CardHeader>
						<CardContent>
							<div class="space-y-3">
								<div
									class="flex items-center justify-between text-sm"
								>
									<span class="text-muted-foreground"
										>Data Type:</span
									>
									<span class="font-medium"
										>{getDataTypeName(
											template.dataType,
										)}</span
									>
								</div>
								<div
									class="flex items-center justify-between text-sm"
								>
									<span class="text-muted-foreground"
										>Fields:</span
									>
									<span class="font-medium"
										>{template.fields.length}</span
									>
								</div>
								<div
									class="flex items-center justify-between text-sm"
								>
									<span class="text-muted-foreground"
										>Usage:</span
									>
									<span class="font-medium"
										>{template.usageCount} times</span
									>
								</div>
								<div class="flex gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										onclick={() => loadTemplate(template)}
										class="flex-1"
									>
											<IconEdit class="h-3 w-3 mr-1" />
										Use
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => deleteTemplate(template)}
									>
										<IconTrash class="h-3 w-3" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</TabsContent>

		<!-- History Tab -->
		<TabsContent value="history" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Export History</CardTitle>
					<CardDescription
						>View and download previous exports</CardDescription
					>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						{#each mockExportHistory as exportItem}
							{@const IconComponent = getDataTypeIcon(
								exportItem.dataType,
							)}
							{@const FormatIcon = getFormatIcon(
								exportItem.format,
							)}
							<div
								class="flex items-center justify-between p-4 border rounded-lg"
							>
								<div class="flex items-center space-x-4">
									<IconComponent
										class="h-8 w-8 text-muted-foreground"
									/>
									<div>
										<h3 class="font-semibold">
											{exportItem.name}
										</h3>
										<div
											class="flex items-center space-x-4 text-sm text-muted-foreground"
										>
											<span
												class="flex items-center space-x-1"
											>
												<FormatIcon class="h-3 w-3" />
												<span
													>{exportItem.format.toUpperCase()}</span
												>
											</span>
											<span
												>{exportItem.records.toLocaleString()}
												records</span
											>
											<span>{exportItem.size}</span>
											<span
												>{formatDateTime(
													exportItem.createdAt,
												)}</span
											>
										</div>
									</div>
								</div>
								<div class="flex items-center space-x-3">
									<Badge
										variant="outline"
										class={getStatusColor(
											exportItem.status,
										)}
									>
										{exportItem.status}
									</Badge>
									{#if exportItem.downloadUrl}
										<Button
											variant="outline"
											size="sm"
											onclick={() =>
												downloadExport(exportItem)}
										>
											<IconDownload class="h-4 w-4 mr-1" />
											Download
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
</div>
