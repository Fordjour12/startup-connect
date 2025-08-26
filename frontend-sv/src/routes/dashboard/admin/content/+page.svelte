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
		Building2,
		FileText,
		CheckCircle,
		XCircle,
		Clock,
		Eye,
		Search,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			pendingStartups: any[];
			recentInvestments: any[];
			documents: any[];
			contentStats: any;
		};
	}>();

	const {
		user,
		pendingStartups,
		recentInvestments,
		documents,
		contentStats,
	} = data;

	function getStatusColor(status: string): string {
		switch (status) {
			case "approved":
			case "completed":
				return "bg-green-100 text-green-800 border-green-300";
			case "pending":
			case "under_review":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Content Management - Admin Dashboard</title>
	<meta
		name="description"
		content="Manage startups, investments, and content approval"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Content Management</h1>
		<p class="text-muted-foreground">
			Manage startups, investments, and content approval workflows
		</p>
	</div>

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Pending Startups</CardTitle
				>
				<Building2 class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{contentStats.pendingStartups}
				</div>
				<p class="text-xs text-muted-foreground">Require approval</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium"
					>Recent Investments</CardTitle
				>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{contentStats.recentInvestments}
				</div>
				<p class="text-xs text-muted-foreground">This week</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Documents</CardTitle>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{contentStats.totalDocuments}
				</div>
				<p class="text-xs text-muted-foreground">Total uploaded</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Approval Rate</CardTitle>
				<CheckCircle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{contentStats.approvalRate}%
				</div>
				<p class="text-xs text-muted-foreground">+2% from last month</p>
			</CardContent>
		</Card>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Pending Startups -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<Building2 class="h-5 w-5" />
					<span>Pending Startups</span>
				</CardTitle>
				<CardDescription>Startups awaiting approval</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each pendingStartups as startup}
						<div class="border rounded-lg p-4">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-semibold">
										{startup.name}
									</h3>
									<p class="text-sm text-muted-foreground">
										by {startup.founder}
									</p>
								</div>
								<Badge
									variant="outline"
									class={getStatusColor(startup.status)}
								>
									{startup.status === "under_review"
										? "Under Review"
										: "Pending"}
								</Badge>
							</div>
							<p class="text-sm mb-3">{startup.description}</p>
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground">
									Submitted: {formatDate(
										startup.submittedDate,
									)}
								</span>
								<div class="flex gap-2">
									<Button variant="outline" size="sm">
										<Eye class="h-4 w-4 mr-1" />
										View
									</Button>
									<Button variant="outline" size="sm">
										<CheckCircle class="h-4 w-4 mr-1" />
										Approve
									</Button>
									<Button variant="outline" size="sm">
										<XCircle class="h-4 w-4 mr-1" />
										Reject
									</Button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>

		<!-- Recent Investments -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<FileText class="h-5 w-5" />
					<span>Recent Investments</span>
				</CardTitle>
				<CardDescription>Latest investment transactions</CardDescription
				>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each recentInvestments as investment}
						<div class="border rounded-lg p-4">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-semibold">
										{investment.startup}
									</h3>
									<p class="text-sm text-muted-foreground">
										by {investment.investor}
									</p>
								</div>
								<Badge
									variant="outline"
									class={getStatusColor(investment.status)}
								>
									{investment.status}
								</Badge>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<p class="text-lg font-bold text-green-600">
										{formatCurrency(investment.amount)}
									</p>
									<p class="text-xs text-muted-foreground">
										{formatDate(investment.date)}
									</p>
								</div>
								<Button variant="outline" size="sm">
									<Eye class="h-4 w-4 mr-1" />
									Review
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Document Management -->
	<Card class="mt-6">
		<CardHeader>
			<CardTitle class="flex items-center space-x-2">
				<FileText class="h-5 w-5" />
				<span>Document Management</span>
			</CardTitle>
			<CardDescription
				>Manage uploaded documents and approvals</CardDescription
			>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				{#each documents as document}
					<div
						class="flex items-center justify-between border rounded-lg p-4"
					>
						<div class="flex items-center space-x-3">
							<div
								class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
							>
								<FileText class="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h3 class="font-semibold">{document.name}</h3>
								<p class="text-sm text-muted-foreground">
									{document.startup} • {formatDate(
										document.uploadedDate,
									)}
								</p>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<Badge
								variant="outline"
								class={getStatusColor(document.status)}
							>
								{document.status}
							</Badge>
							<Button variant="outline" size="sm">
								<Eye class="h-4 w-4 mr-1" />
								View
							</Button>
							{#if document.status === "pending"}
								<Button variant="outline" size="sm">
									<CheckCircle class="h-4 w-4 mr-1" />
									Approve
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</CardContent>
	</Card>
</div>
