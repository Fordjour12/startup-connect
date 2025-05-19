<script lang="ts">
	import { cn } from "$lib/utils";
	import type { PageData } from "./$types";

	// UI Components
	import * as Card from "$lib/components/ui/card";
	import { Progress } from "$lib/components/ui/progress";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import * as Table from "$lib/components/ui/table";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";

	// Icons
	import Users from "@lucide/svelte/icons/users";
	import UserPlus from "@lucide/svelte/icons/user-plus";
	import Target from "@lucide/svelte/icons/target";
	import TrendingUp from "@lucide/svelte/icons/trending-up";
	import TrendingDown from "@lucide/svelte/icons/trending-down";
	import Briefcase from "@lucide/svelte/icons/briefcase";
	import Wallet from "@lucide/svelte/icons/wallet";
	import DollarSign from "@lucide/svelte/icons/dollar-sign";
	import Calendar from "@lucide/svelte/icons/calendar";
	import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
	import AlertCircle from "@lucide/svelte/icons/alert-circle";
	import Clock from "@lucide/svelte/icons/clock";
	import BarChart from "@lucide/svelte/icons/bar-chart";
	import LineChart from "@lucide/svelte/icons/line-chart";
	import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import Plus from "@lucide/svelte/icons/plus";
	import Search from "@lucide/svelte/icons/search";
	import Filter from "@lucide/svelte/icons/filter";
	import FileText from "@lucide/svelte/icons/file-text";
	import ArrowUp from "@lucide/svelte/icons/arrow-up";
	import ArrowDown from "@lucide/svelte/icons/arrow-down";
	import PieChart from "@lucide/svelte/icons/pie-chart";
	import Settings from "@lucide/svelte/icons/settings";
	import Sliders from "@lucide/svelte/icons/sliders";
	import FileBarChart from "@lucide/svelte/icons/file-bar-chart";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";

	// Get server-loaded data
	let { data }: { data: PageData } = $props();

	// State variables
	let activeTab = $state("overview");
	let selectedDepartment = $state("All");

	// Resource allocation state
	let burnRateMultiplier = $state(1);
	let showBudgetVariance = $state(true);
	let selectedScenario = $state("baseline");
	let optimizationExpanded = $state(false);
	let budgetExpanded = $state(true);
	let runwayExpanded = $state(true);
	let cashFlowExpanded = $state(true);

	// Utility functions
	function formatCurrency(amount: number, abbreviate = false): string {
		if (abbreviate) {
			if (amount >= 1000000) {
				return `$${(amount / 1000000).toFixed(1)}M`;
			} else if (amount >= 1000) {
				return `$${(amount / 1000).toFixed(1)}K`;
			}
			return `$${amount}`;
		}

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(amount);
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case "on_track":
				return "bg-green-500";
			case "at_risk":
				return "bg-amber-500";
			case "delayed":
				return "bg-red-500";
			default:
				return "bg-slate-500";
		}
	}

	function getStatusBadge(status: string): { color: string; text: string } {
		switch (status) {
			case "interviewing":
				return {
					color: "bg-blue-500/10 text-blue-500 border-blue-200",
					text: "Interviewing",
				};
			case "screening":
				return {
					color: "bg-purple-500/10 text-purple-500 border-purple-200",
					text: "Screening",
				};
			case "open":
				return {
					color: "bg-green-500/10 text-green-500 border-green-200",
					text: "Open",
				};
			case "final_interviews":
				return {
					color: "bg-amber-500/10 text-amber-500 border-amber-200",
					text: "Final Interviews",
				};
			case "on_track":
				return {
					color: "bg-green-500/10 text-green-500 border-green-200",
					text: "On Track",
				};
			case "at_risk":
				return {
					color: "bg-amber-500/10 text-amber-500 border-amber-200",
					text: "At Risk",
				};
			case "delayed":
				return {
					color: "bg-red-500/10 text-red-500 border-red-200",
					text: "Delayed",
				};
			default:
				return {
					color: "bg-slate-500/10 text-slate-500 border-slate-200",
					text: status,
				};
		}
	}

	function getPriorityBadge(priority: string): {
		color: string;
		text: string;
	} {
		switch (priority) {
			case "high":
				return {
					color: "bg-red-500/10 text-red-500 border-red-200",
					text: "High",
				};
			case "medium":
				return {
					color: "bg-amber-500/10 text-amber-500 border-amber-200",
					text: "Medium",
				};
			case "low":
				return {
					color: "bg-blue-500/10 text-blue-500 border-blue-200",
					text: "Low",
				};
			default:
				return {
					color: "bg-slate-500/10 text-slate-500 border-slate-200",
					text: priority,
				};
		}
	}

	// Derived data
	let departments = $derived([
		"All",
		...new Set(data.teamMembers.map((member) => member.department)),
	]);
	let teamMembersByDepartment = $derived(
		selectedDepartment === "All"
			? data.teamMembers
			: data.teamMembers.filter(
					(member) => member.department === selectedDepartment,
				),
	);

	// Calculate total monthly salary
	let totalMonthlySalary = $derived(
		data.teamMembers.reduce((sum, member) => sum + member.salary / 12, 0),
	);

	// Department colors for charts
	const departmentColors = {
		Engineering: "#3b82f6",
		Marketing: "#8b5cf6",
		Design: "#ec4899",
		Product: "#14b8a6",
		"Customer Success": "#f97316",
		Operations: "#64748b",
	};
</script>

<div class="container py-6 space-y-6">
	<!-- Page header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Team & Operations</h1>
			<p class="text-muted-foreground">
				Manage your team, track hiring, monitor burn rate, and align
				goals
			</p>
		</div>
		<div class="flex gap-3">
			<Button variant="outline">
				<Search class="h-4 w-4 mr-2" />
				<span>Search</span>
			</Button>
			<Button>
				<UserPlus class="h-4 w-4 mr-2" />
				<span>Add Team Member</span>
			</Button>
		</div>
	</div>

	<!-- Tabs navigation -->
	<Tabs.Root
		value={activeTab}
		onValueChange={(value) => (activeTab = value)}
		class="space-y-4"
	>
		<Tabs.List class="grid w-full grid-cols-4">
			<Tabs.Trigger
				value="overview"
				class="flex items-center gap-2 justify-center"
			>
				<Users class="h-4 w-4" />
				<span>Overview</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="hiring"
				class="flex items-center gap-2 justify-center"
			>
				<UserPlus class="h-4 w-4" />
				<span>Hiring Pipeline</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="financials"
				class="flex items-center gap-2 justify-center"
			>
				<Wallet class="h-4 w-4" />
				<span>Burn Rate</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="goals"
				class="flex items-center gap-2 justify-center"
			>
				<Target class="h-4 w-4" />
				<span>OKRs & Goals</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="resources"
				class="flex items-center gap-2 justify-center"
			>
				<BarChart class="h-4 w-4" />
				<span>Resource Allocation</span>
			</Tabs.Trigger>
		</Tabs.List>

		<!-- Tab content -->
		<Tabs.Content value="overview" class="space-y-6">
			<!-- KPI overview cards -->
			<div class="grid grid-cols-4 gap-4">
				<!-- Team size card -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Team Size</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Users class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.teamMembers.length}
									</div>
									<p class="text-xs text-muted-foreground">
										Across {departments.length - 1} departments
									</p>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div
									class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-green-500/10 text-green-500 border-green-200"
								>
									<TrendingUp class="h-3.5 w-3.5 mr-1" />
									<span>+4</span>
								</div>
								<p class="text-xs text-muted-foreground mt-1">
									Last 90 days
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Hiring progress card -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Hiring Plan</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<div class="flex justify-between items-center">
								<div class="text-2xl font-bold">
									{data.hiringPipeline.hiring_goal.filled} / {data
										.hiringPipeline.hiring_goal.total}
								</div>
								<div class="rounded-full p-1.5 bg-primary/10">
									<UserPlus class="h-4 w-4 text-primary" />
								</div>
							</div>
							<div class="flex items-center space-x-2 text-xs">
								<span>Positions filled</span>
								<span class="ml-auto"
									>{Math.round(
										(data.hiringPipeline.hiring_goal
											.filled /
											data.hiringPipeline.hiring_goal
												.total) *
											100,
									)}%</span
								>
							</div>
							<Progress
								value={(data.hiringPipeline.hiring_goal.filled /
									data.hiringPipeline.hiring_goal.total) *
									100}
								class="h-2"
							/>
							<div
								class="flex text-xs text-muted-foreground justify-between"
							>
								<span
									>{data.hiringPipeline.open_roles.length} open
									roles</span
								>
								<span
									>{data.hiringPipeline.time_to_hire
										.current_average_days} days avg. time to
									hire</span
								>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Monthly burn card -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Monthly Burn</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold">
									{formatCurrency(
										data.financials.total_burn_rate,
										true,
									)}
								</div>
								<div class="flex items-center">
									<div
										class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-red-500/10 text-red-500 border-red-200"
									>
										<TrendingUp class="h-3 w-3 mr-1" />
										<span
											>+{data.financials
												.burn_rate_change}%</span
										>
									</div>
									<span
										class="text-xs text-muted-foreground ml-2"
										>vs last month</span
									>
								</div>
							</div>
							<div class="rounded-full p-2 bg-primary/10">
								<DollarSign class="h-5 w-5 text-primary" />
							</div>
						</div>
						<div class="mt-3">
							<div class="text-xs text-muted-foreground mb-1">
								Runway
							</div>
							<div class="flex items-center gap-2">
								<div class="text-sm font-medium">
									{data.financials.runway_months} months
								</div>
								<div
									class="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
								>
									{data.financials.runway_months < 18
										? "Extend runway"
										: "Healthy"}
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- OKR progress card -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Goal Progress</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="space-y-3">
							{#each data.teamGoals.company_level as goal, i}
								{#if i < 2}
									<div class="space-y-1">
										<div
											class="flex justify-between items-center"
										>
											<div
												class="text-sm truncate"
												title={goal.title}
											>
												{goal.title}
											</div>
											<div class="text-sm font-medium">
												{goal.progress}%
											</div>
										</div>
										<div
											class="flex items-center space-x-2"
										>
											<Progress
												value={goal.progress}
												class="h-2"
											/>
											<div
												class="w-2 h-2 rounded-full {getStatusColor(
													goal.status,
												)}"
											></div>
										</div>
									</div>
								{/if}
							{/each}
							<Button
								variant="link"
								size="sm"
								class="px-0 h-8 mt-1"
							>
								<span>View all goals</span>
								<ArrowRight class="h-3.5 w-3.5 ml-1" />
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Team Members Section -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<Card.Title>Team Members</Card.Title>
						<div class="flex items-center gap-3">
							<div class="flex items-center space-x-2">
								<span class="text-sm text-muted-foreground"
									>Department:</span
								>
								<select
									bind:value={selectedDepartment}
									class="w-32 border border-input px-3 py-1 rounded-md text-sm bg-transparent focus:outline-none"
								>
									{#each departments as department}
										<option value={department}
											>{department}</option
										>
									{/each}
								</select>
							</div>
							<Button variant="outline" size="sm" class="h-8">
								<Filter class="h-3.5 w-3.5 mr-1" />
								<span>Filter</span>
							</Button>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head>Role</Table.Head>
								<Table.Head>Department</Table.Head>
								<Table.Head>Start Date</Table.Head>
								<Table.Head class="text-right"
									>Salary</Table.Head
								>
								<Table.Head class="text-right"
									>Onboarding</Table.Head
								>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each teamMembersByDepartment as member}
								<Table.Row>
									<Table.Cell>
										<div class="flex items-center gap-3">
											<Avatar.Root class="h-8 w-8">
												<Avatar.Image
													src={member.avatar}
													alt={member.name}
												/>
												<Avatar.Fallback
													>{member.name
														.split(" ")
														.map((n) => n[0])
														.join(
															"",
														)}</Avatar.Fallback
												>
											</Avatar.Root>
											<div>
												<div class="font-medium">
													{member.name}
												</div>
												<div
													class="text-xs text-muted-foreground"
												>
													{member.email}
												</div>
											</div>
										</div>
									</Table.Cell>
									<Table.Cell>{member.role}</Table.Cell>
									<Table.Cell>{member.department}</Table.Cell>
									<Table.Cell
										>{new Date(
											member.startDate,
										).toLocaleDateString()}</Table.Cell
									>
									<Table.Cell class="text-right"
										>{formatCurrency(
											member.salary,
										)}</Table.Cell
									>
									<Table.Cell class="text-right">
										<div
											class="flex items-center justify-end gap-2"
										>
											<Progress
												value={member.onboardingStatus}
												class="w-16 h-2"
											/>
											<span class="text-sm"
												>{member.onboardingStatus}%</span
											>
										</div>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>

			<!-- Onboarding & New Hires -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Onboarding Progress</Card.Title>
					<Card.Description>
						Recent hires and their onboarding progress
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-2 gap-6">
						<!-- Recent hires with onboarding progress -->
						<div class="space-y-4">
							{#each data.onboarding.recent_hires as hire}
								<div class="border rounded-lg p-4 space-y-3">
									<div
										class="flex justify-between items-start"
									>
										<div class="flex items-center gap-3">
											<Avatar.Root class="h-10 w-10">
												<Avatar.Fallback
													>{hire.name
														.split(" ")
														.map((n) => n[0])
														.join(
															"",
														)}</Avatar.Fallback
												>
											</Avatar.Root>
											<div>
												<div class="font-medium">
													{hire.name}
												</div>
												<div
													class="text-sm text-muted-foreground"
												>
													{hire.role}
												</div>
											</div>
										</div>
										<Badge
											variant="outline"
											class="bg-blue-500/10 text-blue-500 border-blue-200"
										>
											Day {hire.days_since_start}
										</Badge>
									</div>
									<div class="space-y-1">
										<div
											class="flex justify-between text-sm"
										>
											<span>Onboarding Progress</span>
											<span>{hire.progress}%</span>
										</div>
										<Progress
											value={hire.progress}
											class="h-2"
										/>
									</div>
									{#if hire.remaining_tasks.length > 0}
										<div>
											<h4
												class="text-sm font-medium mb-2"
											>
												Remaining Tasks
											</h4>
											<ul class="space-y-1">
												{#each hire.remaining_tasks as task}
													<li
														class="text-sm flex items-start gap-2"
													>
														<div
															class="rounded-full p-1 bg-muted mt-0.5"
														>
															<Clock
																class="h-3 w-3 text-muted-foreground"
															/>
														</div>
														<div>
															<span
																>{task.title}</span
															>
															<span
																class="text-xs text-muted-foreground ml-1"
															>
																Due {new Date(
																	task.deadline,
																).toLocaleDateString()}
															</span>
														</div>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						<!-- Upcoming starts and onboarding metrics -->
						<div class="space-y-4">
							<!-- Onboarding metrics -->
							<div class="border rounded-lg p-4 space-y-3">
								<h3 class="font-medium">Onboarding Metrics</h3>
								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-1">
										<div
											class="text-sm text-muted-foreground"
										>
											Completion Rate
										</div>
										<div class="text-2xl font-bold">
											{data.onboarding
												.onboarding_completion_rate}%
										</div>
									</div>
									<div class="space-y-1">
										<div
											class="text-sm text-muted-foreground"
										>
											Avg. Days to Productivity
										</div>
										<div class="text-2xl font-bold">
											{data.onboarding
												.average_days_to_full_productivity}
										</div>
									</div>
								</div>
							</div>

							<!-- Upcoming starts -->
							<div class="border rounded-lg p-4 space-y-3">
								<h3 class="font-medium">Upcoming Starts</h3>
								{#each data.onboarding.upcoming_starts as person}
									<div
										class="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
									>
										<div>
											<div class="font-medium">
												{person.name}
											</div>
											<div
												class="text-sm text-muted-foreground"
											>
												{person.role} • {person.department}
											</div>
										</div>
										<div class="text-right">
											<div class="text-sm font-medium">
												{new Date(
													person.start_date,
												).toLocaleDateString()}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Onboarding: {person.onboarding_owner}
											</div>
										</div>
									</div>
								{/each}
								<Button
									variant="outline"
									size="sm"
									class="w-full"
								>
									<Plus class="h-3.5 w-3.5 mr-1" />
									<span>Add New Start</span>
								</Button>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Hiring Pipeline Tab -->
		<Tabs.Content value="hiring" class="space-y-6">
			<!-- Hiring KPIs -->
			<div class="grid grid-cols-4 gap-4">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Total Candidates</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Users class="h-5 w-5 text-primary" />
								</div>
								<div class="text-2xl font-bold">
									{Object.values(
										data.hiringPipeline.candidates_by_stage,
									).reduce((a, b) => a + b, 0)}
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									All stages
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Open Positions</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Briefcase class="h-5 w-5 text-primary" />
								</div>
								<div class="text-2xl font-bold">
									{data.hiringPipeline.open_roles.length}
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									Active roles
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Time to Hire</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Clock class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.hiringPipeline.time_to_hire
											.current_average_days}
									</div>
									<div class="text-xs text-muted-foreground">
										Days on average
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div
									class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-green-500/10 text-green-500 border-green-200"
								>
									<TrendingDown class="h-3.5 w-3.5 mr-1" />
									<span
										>-{data.hiringPipeline.time_to_hire
											.previous_average_days -
											data.hiringPipeline.time_to_hire
												.current_average_days}</span
									>
								</div>
								<p class="text-xs text-muted-foreground mt-1">
									From last quarter
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Budget Variance</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<FileBarChart
										class="h-5 w-5 text-primary"
									/>
								</div>
								<div>
									<div class="text-2xl font-bold">-5.2%</div>
									<div class="text-xs text-muted-foreground">
										Under budget
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div
									class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-green-500/10 text-green-500 border-green-200"
								>
									<TrendingDown class="h-3.5 w-3.5 mr-1" />
									<span>-$10.7K</span>
								</div>
								<p class="text-xs text-muted-foreground mt-1">
									vs. planned
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Optimized Runway</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<TrendingUp class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">+3.2</div>
									<div class="text-xs text-muted-foreground">
										months potential
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									17.2 months total
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Active Roles -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<Card.Title>Active Roles</Card.Title>
						<Button>
							<Plus class="h-4 w-4 mr-2" />
							<span>Add New Role</span>
						</Button>
					</div>
					<Card.Description>
						Track open positions and recruiting progress
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Position</Table.Head>
								<Table.Head>Department</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head>Priority</Table.Head>
								<Table.Head>Salary Range</Table.Head>
								<Table.Head>Candidates</Table.Head>
								<Table.Head>Posted Date</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.hiringPipeline.open_roles as role}
								<Table.Row>
									<Table.Cell>
										<div class="font-medium">
											{role.title}
										</div>
									</Table.Cell>
									<Table.Cell>{role.department}</Table.Cell>
									<Table.Cell>
										<Badge
											variant="outline"
											class={getStatusBadge(role.status)
												.color}
										>
											{getStatusBadge(role.status).text}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge
											variant="outline"
											class={getPriorityBadge(
												role.priority,
											).color}
										>
											{getPriorityBadge(role.priority)
												.text}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										{formatCurrency(role.salary_range.min)} -
										{formatCurrency(role.salary_range.max)}
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<span>{role.candidates}</span>
											{#if role.interviews_scheduled > 0}
												<Badge
													variant="outline"
													class="bg-blue-500/10 text-blue-500 border-blue-200"
												>
													{role.interviews_scheduled} scheduled
												</Badge>
											{/if}
										</div>
									</Table.Cell>
									<Table.Cell>
										{new Date(
											role.posted_date,
										).toLocaleDateString()}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>

			<!-- Candidate Pipeline -->
			<div class="grid grid-cols-2 gap-6">
				<!-- Recruitment Funnel -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Recruitment Funnel</Card.Title>
						<Card.Description>
							Track candidates by stage in the hiring process
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-5">
							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">
										Application Received
									</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.application}
									</div>
								</div>
								<Progress value={100} class="h-2 bg-blue-100" />
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">Screening</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.screening}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage.screening /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">First Interview</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.first_interview}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage.first_interview /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">
										Technical Assessment
									</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.technical_assessment}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage
										.technical_assessment /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">Final Interview</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.final_interview}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage.final_interview /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">Offer Made</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.offer_made}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage.offer_made /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>

							<div class="space-y-2">
								<div class="flex justify-between">
									<div class="text-sm">Offer Accepted</div>
									<div class="text-sm font-medium">
										{data.hiringPipeline.candidates_by_stage
											.offer_accepted}
									</div>
								</div>
								<Progress
									value={(data.hiringPipeline
										.candidates_by_stage.offer_accepted /
										data.hiringPipeline.candidates_by_stage
											.application) *
										100}
									class="h-2 bg-blue-100"
								/>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Time to Hire by Department -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Time to Hire by Department</Card.Title>
						<Card.Description>
							Average days from application to offer acceptance
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each Object.entries(data.hiringPipeline.time_to_hire.by_department) as [department, days]}
								<div class="space-y-2">
									<div class="flex justify-between">
										<div class="text-sm font-medium">
											{department}
										</div>
										<div class="text-sm">{days} days</div>
									</div>
									<div
										class="relative h-2 bg-muted rounded-full overflow-hidden"
									>
										<div
											class="absolute top-0 left-0 h-full rounded-full"
											style="width: {Math.min(
												(days / 50) * 100,
												100,
											)}%; background-color: {departmentColors[
												department as keyof typeof departmentColors
											] || '#64748b'};"
										></div>
									</div>
								</div>
							{/each}

							<div class="pt-2 mt-4 border-t">
								<div class="flex items-center justify-between">
									<div>
										<div class="text-sm font-medium">
											Overall Average
										</div>
										<div
											class="text-xs text-muted-foreground"
										>
											All departments
										</div>
									</div>
									<div class="text-xl font-bold">
										{data.hiringPipeline.time_to_hire
											.current_average_days} days
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Hiring Plan Progress -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Hiring Plan Progress</Card.Title>
					<Card.Description>
						Track progress toward annual hiring goals
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-6">
						<div class="flex items-center gap-4">
							<div class="bg-muted rounded-lg p-4 flex-1">
								<div class="text-sm text-muted-foreground mb-1">
									Total Planned Hires
								</div>
								<div class="text-3xl font-bold">
									{data.hiringPipeline.hiring_goal.total}
								</div>
							</div>
							<div class="bg-muted rounded-lg p-4 flex-1">
								<div class="text-sm text-muted-foreground mb-1">
									Filled Positions
								</div>
								<div class="text-3xl font-bold">
									{data.hiringPipeline.hiring_goal.filled}
								</div>
							</div>
							<div class="bg-muted rounded-lg p-4 flex-1">
								<div class="text-sm text-muted-foreground mb-1">
									In Progress
								</div>
								<div class="text-3xl font-bold">
									{data.hiringPipeline.hiring_goal
										.in_progress}
								</div>
							</div>
							<div class="bg-muted rounded-lg p-4 flex-1">
								<div class="text-sm text-muted-foreground mb-1">
									Not Started
								</div>
								<div class="text-3xl font-bold">
									{data.hiringPipeline.hiring_goal
										.not_started}
								</div>
							</div>
						</div>

						<div class="space-y-3">
							<div class="flex justify-between">
								<div class="text-sm font-medium">
									Overall Progress
								</div>
								<div class="text-sm">
									{data.hiringPipeline.hiring_goal.filled} / {data
										.hiringPipeline.hiring_goal.total} positions
									filled ({Math.round(
										(data.hiringPipeline.hiring_goal
											.filled /
											data.hiringPipeline.hiring_goal
												.total) *
											100,
									)}%)
								</div>
							</div>
							<div
								class="h-3 bg-muted rounded-full overflow-hidden"
							>
								<div
									class="h-full bg-primary rounded-full"
									style="width: {(data.hiringPipeline
										.hiring_goal.filled /
										data.hiringPipeline.hiring_goal.total) *
										100}%"
								></div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Burn Rate Tab -->
		<Tabs.Content value="financials" class="space-y-6">
			<!-- Burn Rate KPIs -->
			<div class="grid grid-cols-4 gap-4">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Monthly Burn Rate</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<DollarSign class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{formatCurrency(
											data.financials.total_burn_rate,
											true,
										)}
									</div>
									<div class="text-xs text-muted-foreground">
										per month
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div
									class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-red-500/10 text-red-500 border-red-200"
								>
									<TrendingUp class="h-3.5 w-3.5 mr-1" />
									<span
										>+{data.financials
											.burn_rate_change}%</span
									>
								</div>
								<p class="text-xs text-muted-foreground mt-1">
									vs last month
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Runway</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Calendar class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.financials.runway_months}
									</div>
									<div class="text-xs text-muted-foreground">
										months remaining
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div
									class={`text-xs px-2 py-1 rounded-full ${
										data.financials.runway_months < 12
											? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
											: data.financials.runway_months < 18
												? "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
												: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
									}`}
								>
									{data.financials.runway_months < 12
										? "Critical"
										: data.financials.runway_months < 18
											? "Caution"
											: "Healthy"}
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Average Salary</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Users class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{formatCurrency(
											data.financials.average_salary,
											true,
										)}
									</div>
									<div class="text-xs text-muted-foreground">
										per employee
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									{data.teamMembers.length} team members
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Salary as % of Burn</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Wallet class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.financials.salary_percentage}%
									</div>
									<div class="text-xs text-muted-foreground">
										of total expenses
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									Other: {data.financials
										.other_expenses_percentage}%
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Burn Rate Trend -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Burn Rate Trend</Card.Title>
					<Card.Description>
						Monthly burn rate over the last 6 months
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-64 relative">
						<div
							class="absolute inset-0 flex items-end justify-between px-2"
						>
							{#each data.financials.burn_rate_trend as item, i}
								<div
									class="flex flex-col items-center space-y-2"
								>
									<div
										class="w-12 bg-primary/80 rounded-t-md transition-all duration-500"
										style="height: {(item.amount /
											data.financials.total_burn_rate) *
											200}px"
									></div>
									<div class="text-xs font-medium">
										{item.month}
									</div>
									<div class="text-xs text-muted-foreground">
										{formatCurrency(item.amount, true)}
									</div>
								</div>
							{/each}
						</div>

						<!-- Horizontal reference lines -->
						<div
							class="absolute inset-0 flex flex-col justify-between pb-14"
						>
							{#each Array(5) as _, i}
								<div class="w-full h-px bg-muted"></div>
							{/each}
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Department Burn Breakdown -->
			<div class="grid grid-cols-2 gap-6">
				<!-- Burn by Department -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Burn by Department</Card.Title>
						<Card.Description>
							Monthly burn rate broken down by department
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each Object.entries(data.financials.burn_by_department) as [department, amount]}
								<div class="space-y-2">
									<div
										class="flex justify-between items-center"
									>
										<div class="flex items-center gap-2">
											<div
												class="w-3 h-3 rounded-full"
												style="background-color: {departmentColors[
													department as keyof typeof departmentColors
												] || '#64748b'}"
											></div>
											<div class="font-medium">
												{department}
											</div>
										</div>
										<div class="text-sm">
											{formatCurrency(amount)}
										</div>
									</div>
									<div
										class="relative h-2 bg-muted rounded-full overflow-hidden"
									>
										<div
											class="absolute top-0 left-0 h-full rounded-full"
											style="width: {(amount /
												data.financials
													.total_burn_rate) *
												100}%; background-color: {departmentColors[
												department as keyof typeof departmentColors
											] || '#64748b'};"
										></div>
									</div>
									<div
										class="flex justify-between text-xs text-muted-foreground"
									>
										<div>
											{Math.round(
												(amount /
													data.financials
														.total_burn_rate) *
													100,
											)}% of total
										</div>
										<div>
											{data.teamMembers.filter(
												(m) =>
													m.department === department,
											).length} team members
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Headcount Planning -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Headcount Planning</Card.Title>
						<Card.Description>
							Current and projected team growth
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-6">
							<div class="grid grid-cols-3 gap-4">
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Current
									</div>
									<div class="text-3xl font-bold">
										{data.financials.headcount_growth
											.current}
									</div>
								</div>
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Target EOY
									</div>
									<div class="text-3xl font-bold">
										{data.financials.headcount_growth
											.target_eoy}
									</div>
								</div>
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Growth
									</div>
									<div class="text-3xl font-bold">
										{Math.round(
											(data.financials.headcount_growth
												.target_eoy /
												data.financials.headcount_growth
													.current -
												1) *
												100,
										)}%
									</div>
								</div>
							</div>

							<div class="space-y-2">
								<div class="text-sm font-medium">
									Headcount Growth
								</div>
								<div class="h-40 relative mt-6">
									<div
										class="absolute inset-0 flex items-end space-x-8"
									>
										{#each [...data.financials.headcount_growth.previous_quarters, data.financials.headcount_growth.current] as count, i}
											<div
												class="flex flex-col items-center"
											>
												<div
													class="w-12 bg-primary/80 rounded-t-md transition-all duration-500"
													style="height: {(count /
														data.financials
															.headcount_growth
															.target_eoy) *
														130}px"
												></div>
												<div
													class="text-xs font-medium mt-2"
												>
													Q{i + 1}
												</div>
												<div
													class="text-xs text-muted-foreground"
												>
													{count}
												</div>
											</div>
										{/each}
										<div class="flex flex-col items-center">
											<div
												class="w-12 bg-primary/20 rounded-t-md border border-dashed border-primary"
												style="height: {(data.financials
													.headcount_growth
													.target_eoy /
													data.financials
														.headcount_growth
														.target_eoy) *
													130}px"
											></div>
											<div
												class="text-xs font-medium mt-2"
											>
												Target
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												{data.financials
													.headcount_growth
													.target_eoy}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Funding Overview -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Funding Overview</Card.Title>
					<Card.Description>
						Current financial status and projections
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid grid-cols-2 gap-8">
						<div class="space-y-4">
							<div class="bg-muted rounded-lg p-4 text-center">
								<div class="text-muted-foreground mb-1">
									Total Funding Raised
								</div>
								<div class="text-3xl font-bold">
									{formatCurrency(
										data.financials.funding_raised,
									)}
								</div>
							</div>

							<div class="space-y-1">
								<div class="flex justify-between text-sm">
									<span>Funds Remaining</span>
									<span
										>{formatCurrency(
											data.financials.runway_months *
												data.financials.total_burn_rate,
										)}</span
									>
								</div>
								<Progress
									value={((data.financials.runway_months *
										data.financials.total_burn_rate) /
										data.financials.funding_raised) *
										100}
									class="h-2"
								/>
								<div class="text-xs text-muted-foreground">
									{Math.round(
										((data.financials.runway_months *
											data.financials.total_burn_rate) /
											data.financials.funding_raised) *
											100,
									)}% of raised capital remaining
								</div>
							</div>

							<div
								class="flex justify-between items-center p-3 border rounded-md"
							>
								<div>
									<div class="font-medium">
										Next Fundraising Target
									</div>
									<div class="text-sm text-muted-foreground">
										Series A
									</div>
								</div>
								<div class="text-right">
									<div class="font-medium">
										{formatCurrency(5000000)}
									</div>
									<div class="text-sm text-muted-foreground">
										Target Q1 2024
									</div>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<div class="font-medium text-sm">
								Monthly Burn Breakdown
							</div>
							<div class="relative pt-7">
								<!-- Donut chart background placeholders -->
								<div class="relative w-40 h-40 mx-auto">
									<div
										class="absolute inset-0 rounded-full overflow-hidden"
									>
										<div
											class="absolute top-0 left-0 w-full h-full bg-muted"
										></div>
										<div
											class="absolute top-0 left-0 h-full bg-primary"
											style="width: {data.financials
												.salary_percentage}%; transform-origin: center; transform: rotate(0deg)"
										></div>
										<div
											class="absolute top-0 left-0 h-full bg-accent"
											style="width: {data.financials
												.other_expenses_percentage}%; transform-origin: center; transform: rotate({3.6 *
												data.financials
													.salary_percentage}deg)"
										></div>
										<div
											class="absolute inset-3 rounded-full bg-background"
										></div>
									</div>
									<div
										class="absolute inset-0 flex items-center justify-center"
									>
										<div class="text-center">
											<div class="text-2xl font-bold">
												{formatCurrency(
													data.financials
														.total_burn_rate,
													true,
												)}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												monthly burn
											</div>
										</div>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-4 mt-6">
									<div class="flex items-center gap-2">
										<div
											class="w-3 h-3 rounded-full bg-primary"
										></div>
										<div class="text-sm">
											Salaries ({data.financials
												.salary_percentage}%)
										</div>
									</div>
									<div class="flex items-center gap-2">
										<div
											class="w-3 h-3 rounded-full bg-accent"
										></div>
										<div class="text-sm">
											Other Expenses ({data.financials
												.other_expenses_percentage}%)
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- OKRs & Goals Tab -->
		<Tabs.Content value="goals" class="space-y-6">
			<!-- Goals Overview Cards -->
			<div class="grid grid-cols-4 gap-4">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Company Goals</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Target class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.teamGoals.company_level.length}
									</div>
									<div class="text-xs text-muted-foreground">
										company objectives
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium">
									{Math.round(
										data.teamGoals.company_level.reduce(
											(acc, goal) => acc + goal.progress,
											0,
										) / data.teamGoals.company_level.length,
									)}%
								</div>
								<div class="text-xs text-muted-foreground">
									Average progress
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Department Goals</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Briefcase class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">
										{Object.values(
											data.teamGoals.department_goals,
										).flat().length}
									</div>
									<div class="text-xs text-muted-foreground">
										department objectives
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium">
									{Math.round(
										Object.values(
											data.teamGoals.department_goals,
										)
											.flat()
											.reduce(
												(acc, goal) =>
													acc + goal.progress,
												0,
											) /
											Object.values(
												data.teamGoals.department_goals,
											).flat().length,
									)}%
								</div>
								<div class="text-xs text-muted-foreground">
									Average progress
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Key Results</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<CheckCircle2
										class="h-5 w-5 text-primary"
									/>
								</div>
								<div>
									<div class="text-2xl font-bold">
										{data.teamGoals.key_results.length}
									</div>
									<div class="text-xs text-muted-foreground">
										measurable results
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium">
									{Math.round(
										data.teamGoals.key_results.reduce(
											(acc, kr) =>
												acc +
												(kr.current / kr.target) * 100,
											0,
										) / data.teamGoals.key_results.length,
									)}%
								</div>
								<div class="text-xs text-muted-foreground">
									Average completion
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Status Overview</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-green-500"
									></div>
									<div class="text-sm">On Track</div>
								</div>
								<div class="text-sm font-medium">
									{data.teamGoals.company_level.filter(
										(g) => g.status === "on_track",
									).length +
										Object.values(
											data.teamGoals.department_goals,
										)
											.flat()
											.filter(
												(g) => g.status === "on_track",
											).length}
								</div>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-amber-500"
									></div>
									<div class="text-sm">At Risk</div>
								</div>
								<div class="text-sm font-medium">
									{data.teamGoals.company_level.filter(
										(g) => g.status === "at_risk",
									).length +
										Object.values(
											data.teamGoals.department_goals,
										)
											.flat()
											.filter(
												(g) => g.status === "at_risk",
											).length}
								</div>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-red-500"
									></div>
									<div class="text-sm">Delayed</div>
								</div>
								<div class="text-sm font-medium">
									{data.teamGoals.company_level.filter(
										(g) => g.status === "delayed",
									).length +
										Object.values(
											data.teamGoals.department_goals,
										)
											.flat()
											.filter(
												(g) => g.status === "delayed",
											).length}
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Company Level Objectives -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<div>
							<Card.Title>Company Objectives</Card.Title>
							<Card.Description>
								Top-level goals and mission-critical priorities
							</Card.Description>
						</div>
						<Button>
							<Plus class="h-4 w-4 mr-2" />
							<span>Add Objective</span>
						</Button>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-5">
						{#each data.teamGoals.company_level as goal}
							<div class="border rounded-lg p-4 space-y-3">
								<div class="flex justify-between">
									<div>
										<div class="flex items-center gap-2">
											<div class="text-lg font-medium">
												{goal.title}
											</div>
											<Badge
												variant="outline"
												class={getStatusBadge(
													goal.status,
												).color}
											>
												{getStatusBadge(goal.status)
													.text}
											</Badge>
										</div>
										<div
											class="text-sm text-muted-foreground mt-1"
										>
											Owner: {goal.owner} • Due: {new Date(
												goal.due_date,
											).toLocaleDateString()}
										</div>
									</div>
									<div class="text-right">
										<div class="text-2xl font-bold">
											{goal.progress}%
										</div>
										<div
											class="text-sm text-muted-foreground"
										>
											Progress
										</div>
									</div>
								</div>

								<div class="space-y-1">
									<Progress
										value={goal.progress}
										class="h-2"
									/>
									<div
										class="flex justify-between text-xs text-muted-foreground"
									>
										<span>Not Started</span>
										<span>In Progress</span>
										<span>Complete</span>
									</div>
								</div>

								<div class="flex justify-end gap-2">
									<Button variant="outline" size="sm">
										<FileText class="h-3.5 w-3.5 mr-1" />
										<span>Details</span>
									</Button>
									<Button variant="outline" size="sm">
										<Target class="h-3.5 w-3.5 mr-1" />
										<span>Key Results</span>
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Department Goals -->
			<div class="grid grid-cols-2 gap-6">
				<!-- Department Breakdown -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Department Progress</Card.Title>
						<Card.Description>
							Objectives progress by department
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-6">
							{#each Object.entries(data.teamGoals.department_goals) as [department, goals]}
								<div class="space-y-2">
									<div
										class="flex justify-between items-center"
									>
										<div class="flex items-center gap-2">
											<div
												class="w-3 h-3 rounded-full"
												style="background-color: {departmentColors[
													department as keyof typeof departmentColors
												] || '#64748b'}"
											></div>
											<div class="font-medium">
												{department}
											</div>
										</div>
										<div class="text-sm">
											{Math.round(
												goals.reduce(
													(acc, goal) =>
														acc + goal.progress,
													0,
												) / goals.length,
											)}% avg. progress
										</div>
									</div>
									<div class="space-y-3 mt-3">
										{#each goals as goal}
											<div
												class="border-l-2 pl-3"
												style={`border-color: ${departmentColors[department as keyof typeof departmentColors] || "#64748b"}`}
											>
												<div
													class="flex justify-between items-center"
												>
													<div
														class="text-sm font-medium truncate max-w-xs"
														title={goal.title}
													>
														{goal.title}
													</div>
													<div
														class="flex items-center gap-2"
													>
														<div
															class="w-2 h-2 rounded-full {getStatusColor(
																goal.status,
															)}"
														></div>
														<div class="text-sm">
															{goal.progress}%
														</div>
													</div>
												</div>
												<div
													class="flex justify-between text-xs text-muted-foreground"
												>
													<div>
														Owner: {goal.owner}
													</div>
													<div>
														Due: {new Date(
															goal.due_date,
														).toLocaleDateString()}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Key Results Tracker -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Key Results</Card.Title>
						<Card.Description>
							Measurable outcomes to track success
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-5">
							{#each data.teamGoals.key_results as kr}
								<div class="border rounded-lg p-4 space-y-3">
									<div
										class="flex justify-between items-center"
									>
										<div class="text-sm font-medium">
											{kr.title}
										</div>
										<div class="text-sm">
											Due: {new Date(
												kr.due_date,
											).toLocaleDateString()}
										</div>
									</div>

									<div class="space-y-2">
										<div
											class="flex justify-between items-baseline"
										>
											<div
												class="text-xs text-muted-foreground"
											>
												Current: {kr.current}
											</div>
											<div
												class="text-xs text-muted-foreground"
											>
												Target: {kr.target}
											</div>
										</div>
										<div
											class="relative h-2 bg-muted rounded-full overflow-hidden"
										>
											<div
												class="absolute top-0 left-0 h-full bg-primary rounded-full"
												style="width: {Math.min(
													(kr.current / kr.target) *
														100,
													100,
												)}%"
											></div>
										</div>
										<div
											class="text-right text-sm font-medium"
										>
											{Math.round(
												(kr.current / kr.target) * 100,
											)}% complete
										</div>
									</div>
								</div>
							{/each}

							<Button variant="outline" class="w-full">
								<Plus class="h-4 w-4 mr-2" />
								<span>Add Key Result</span>
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Goal Timeline -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Goal Timeline</Card.Title>
					<Card.Description>
						Upcoming goal deadlines and milestones
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div class="relative">
							<!-- Timeline line -->
							<div
								class="absolute top-0 bottom-0 left-28 w-px bg-border"
							></div>

							<!-- Timeline items -->
							<div class="space-y-8">
								{#each [...data.teamGoals.company_level, ...Object.values(data.teamGoals.department_goals).flat()]
									.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
									.slice(0, 5) as goal}
									<div
										class="flex items-start gap-4 relative"
									>
										<div
											class="w-28 flex-shrink-0 text-sm text-right"
										>
											{new Date(
												goal.due_date,
											).toLocaleDateString()}
										</div>
										<div
											class="w-5 h-5 rounded-full bg-primary flex-shrink-0 z-10 mt-1 flex items-center justify-center"
										>
											<div
												class="w-3 h-3 rounded-full bg-background"
											></div>
										</div>
										<div class="flex-grow">
											<div
												class="bg-muted p-3 rounded-lg"
											>
												<div
													class="flex items-center justify-between"
												>
													<div class="font-medium">
														{goal.title}
													</div>
													<Badge
														variant="outline"
														class={getStatusBadge(
															goal.status,
														).color}
													>
														{getStatusBadge(
															goal.status,
														).text}
													</Badge>
												</div>
												<div
													class="text-sm text-muted-foreground mt-1"
												>
													Owner: {goal.owner} • Progress:
													{goal.progress}%
												</div>
												<div class="mt-2">
													<Progress
														value={goal.progress}
														class="h-1.5"
													/>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<div class="flex justify-center pt-4">
							<Button variant="outline">
								<span>View All Goals</span>
								<ArrowRight class="h-4 w-4 ml-2" />
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Resource Allocation Tab -->
		<Tabs.Content value="resources" class="space-y-6">
			<!-- Resource Allocation KPIs -->
			<div class="grid grid-cols-4 gap-4">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Budget Variance</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<FileBarChart
										class="h-5 w-5 text-primary"
									/>
								</div>
								<div>
									<div class="text-2xl font-bold">-5.2%</div>
									<div class="text-xs text-muted-foreground">
										Under budget
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div
									class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-green-500/10 text-green-500 border-green-200"
								>
									<TrendingDown class="h-3.5 w-3.5 mr-1" />
									<span>-$10.7K</span>
								</div>
								<p class="text-xs text-muted-foreground mt-1">
									vs. planned
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Optimized Runway</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<TrendingUp class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">+3.2</div>
									<div class="text-xs text-muted-foreground">
										months potential
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									17.2 months total
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Resource Efficiency</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Sliders class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">82%</div>
									<div class="text-xs text-muted-foreground">
										allocation score
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div
									class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-500 border-amber-200"
								>
									<ArrowUp class="h-3 w-3 mr-1" />
									<span>+4%</span>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium"
							>Allocation Impact</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="rounded-full p-2 bg-primary/10">
									<Target class="h-5 w-5 text-primary" />
								</div>
								<div>
									<div class="text-2xl font-bold">+12%</div>
									<div class="text-xs text-muted-foreground">
										goal velocity
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-sm text-muted-foreground">
									with optimization
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Budget vs. Actual Section -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<div>
							<div class="flex items-center gap-2">
								<Card.Title
									>Budget vs. Actual Spending</Card.Title
								>
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={() =>
										(budgetExpanded = !budgetExpanded)}
								>
									{#if budgetExpanded}
										<ChevronUp class="h-4 w-4" />
									{:else}
										<ChevronDown class="h-4 w-4" />
									{/if}
								</Button>
							</div>
							<Card.Description>
								Compare planned budget against actual spending
								by department
							</Card.Description>
						</div>
						<div class="flex items-center gap-3">
							<div class="flex items-center space-x-2">
								<Button variant="outline" size="sm">
									<FileText class="h-3.5 w-3.5 mr-1" />
									<span>Export</span>
								</Button>
								<Button variant="outline" size="sm">
									<Settings class="h-3.5 w-3.5 mr-1" />
									<span>Settings</span>
								</Button>
							</div>
						</div>
					</div>
				</Card.Header>
				{#if budgetExpanded}
					<Card.Content>
						<div class="space-y-6">
							<!-- Summary cards -->
							<div class="grid grid-cols-3 gap-4">
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Total Budget
									</div>
									<div class="text-2xl font-bold">
										{formatCurrency(250000)}
									</div>
								</div>
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Actual Spend
									</div>
									<div class="text-2xl font-bold">
										{formatCurrency(
											data.financials.total_burn_rate,
										)}
									</div>
								</div>
								<div class="bg-muted rounded-lg p-4">
									<div
										class="text-sm text-muted-foreground mb-1"
									>
										Variance
									</div>
									<div class="flex items-center">
										<div
											class="text-2xl font-bold text-green-600"
										>
											{formatCurrency(
												250000 -
													data.financials
														.total_burn_rate,
											)}
										</div>
										<div
											class="ml-2 text-sm text-green-600"
										>
											(5.2% under)
										</div>
									</div>
								</div>
							</div>

							<!-- Department breakdown -->
							<div class="space-y-4">
								<div class="text-sm font-medium">
									Spending by Department
								</div>

								{#each Object.entries(data.financials.burn_by_department) as [department, amount]}
									<div class="space-y-2">
										<div
											class="flex justify-between items-center"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-3 h-3 rounded-full"
													style="background-color: {departmentColors[
														department as keyof typeof departmentColors
													] || '#64748b'}"
												></div>
												<div class="font-medium">
													{department}
												</div>
											</div>
											<div
												class="flex items-center gap-4"
											>
												<div
													class="text-sm text-muted-foreground w-24 text-right"
												>
													Budget: {formatCurrency(
														amount * 1.05,
													)}
												</div>
												<div
													class="text-sm w-24 text-right"
												>
													Actual: {formatCurrency(
														amount,
													)}
												</div>
												<div
													class="text-sm text-green-600 w-24 text-right"
												>
													{formatCurrency(
														amount * 1.05 - amount,
													)} under
												</div>
											</div>
										</div>
										<div
											class="relative h-2 bg-muted rounded-full overflow-hidden"
										>
											<!-- Actual spending bar -->
											<div
												class="absolute top-0 left-0 h-full rounded-full"
												style="width: {(amount /
													data.financials
														.total_burn_rate) *
													100}%; background-color: {departmentColors[
													department as keyof typeof departmentColors
												] || '#64748b'};"
											></div>
											<!-- Budget line (slightly wider than actual) -->
											{#if showBudgetVariance}
												<div
													class="absolute top-0 h-full border-r-2 border-dashed border-slate-400"
													style="left: {((amount *
														1.05) /
														data.financials
															.total_burn_rate) *
														100}%;"
												></div>
											{/if}
										</div>
									</div>
								{/each}
							</div>

							<!-- Toggle for budget lines -->
							<div class="flex justify-end">
								<Button
									variant="outline"
									size="sm"
									onclick={() =>
										(showBudgetVariance =
											!showBudgetVariance)}
									class="flex items-center gap-2"
								>
									{#if showBudgetVariance}
										<span>Hide Budget Lines</span>
									{:else}
										<span>Show Budget Lines</span>
									{/if}
								</Button>
							</div>
						</div>
					</Card.Content>
				{/if}
			</Card.Root>

			<!-- Runway Calculator -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<div>
							<div class="flex items-center gap-2">
								<Card.Title>Runway Calculator</Card.Title>
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={() =>
										(runwayExpanded = !runwayExpanded)}
								>
									{#if runwayExpanded}
										<ChevronUp class="h-4 w-4" />
									{:else}
										<ChevronDown class="h-4 w-4" />
									{/if}
								</Button>
							</div>
							<Card.Description>
								Simulate runway under different burn rate
								scenarios
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				{#if runwayExpanded}
					<Card.Content>
						<div class="space-y-6">
							<!-- Scenario selector -->
							<div class="flex items-center justify-between">
								<div class="text-sm font-medium">
									Burn Rate Scenario
								</div>
								<div class="flex items-center gap-2">
									<Button
										variant={selectedScenario ===
										"conservative"
											? "default"
											: "outline"}
										size="sm"
										onclick={() =>
											(selectedScenario = "conservative")}
									>
										Conservative
									</Button>
									<Button
										variant={selectedScenario === "baseline"
											? "default"
											: "outline"}
										size="sm"
										onclick={() =>
											(selectedScenario = "baseline")}
									>
										Baseline
									</Button>
									<Button
										variant={selectedScenario ===
										"aggressive"
											? "default"
											: "outline"}
										size="sm"
										onclick={() =>
											(selectedScenario = "aggressive")}
									>
										Aggressive
									</Button>
								</div>
							</div>

							<!-- Burn rate slider -->
							<div class="space-y-2">
								<div class="flex justify-between text-sm">
									<span>Burn Rate Multiplier</span>
									<span class="font-medium"
										>{burnRateMultiplier.toFixed(1)}x</span
									>
								</div>
								<div class="relative h-5 w-full">
									<input
										type="range"
										min="0.5"
										max="1.5"
										step="0.1"
										value={burnRateMultiplier}
										onchange={(e) =>
											(burnRateMultiplier = parseFloat(
												(e.target as HTMLInputElement)
													.value,
											))}
										class="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
									/>
									<div
										class="absolute inset-0 bg-muted rounded-full"
									></div>
									<div
										class="absolute top-0 left-0 h-full bg-primary rounded-full"
										style="width: {((burnRateMultiplier -
											0.5) /
											1) *
											100}%"
									></div>
									<div
										class="absolute top-0 h-full aspect-square rounded-full bg-primary border-2 border-background transform -translate-y-1/2 translate-x-1/2"
										style="left: {((burnRateMultiplier -
											0.5) /
											1) *
											100}%"
									></div>
								</div>
								<div
									class="flex justify-between text-xs text-muted-foreground"
								>
									<span>0.5x (Cost cutting)</span>
									<span>1.0x (Current)</span>
									<span>1.5x (Expansion)</span>
								</div>
							</div>

							<!-- Scenario details -->
							<div class="grid grid-cols-3 gap-4">
								<div class="space-y-4">
									<div
										class="text-sm font-medium text-center"
									>
										Monthly Burn
									</div>
									<div class="text-center text-2xl font-bold">
										{#if selectedScenario === "conservative"}
											{formatCurrency(
												data.financials
													.total_burn_rate *
													0.8 *
													burnRateMultiplier,
											)}
										{:else if selectedScenario === "aggressive"}
											{formatCurrency(
												data.financials
													.total_burn_rate *
													1.2 *
													burnRateMultiplier,
											)}
										{:else}
											{formatCurrency(
												data.financials
													.total_burn_rate *
													burnRateMultiplier,
											)}
										{/if}
									</div>
									<div
										class="text-xs text-muted-foreground text-center"
									>
										{#if selectedScenario === "conservative"}
											20% reduced expenses
										{:else if selectedScenario === "aggressive"}
											20% increased expenses
										{:else}
											Standard expense model
										{/if}
									</div>
								</div>
								<div class="space-y-4">
									<div
										class="text-sm font-medium text-center"
									>
										Projected Runway
									</div>
									<div class="text-center text-2xl font-bold">
										{#if selectedScenario === "conservative"}
											{Math.round(
												(data.financials.runway_months /
													(0.8 *
														burnRateMultiplier)) *
													10,
											) / 10} months
										{:else if selectedScenario === "aggressive"}
											{Math.round(
												(data.financials.runway_months /
													(1.2 *
														burnRateMultiplier)) *
													10,
											) / 10} months
										{:else}
											{Math.round(
												(data.financials.runway_months /
													burnRateMultiplier) *
													10,
											) / 10} months
										{/if}
									</div>
									<div
										class="text-xs text-muted-foreground text-center"
									>
										Until {new Date(
											Date.now() +
												(selectedScenario ===
												"conservative"
													? data.financials
															.runway_months /
														(0.8 *
															burnRateMultiplier)
													: selectedScenario ===
														  "aggressive"
														? data.financials
																.runway_months /
															(1.2 *
																burnRateMultiplier)
														: data.financials
																.runway_months /
															burnRateMultiplier) *
													30 *
													24 *
													60 *
													60 *
													1000,
										).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})}
									</div>
								</div>
								<div class="space-y-4">
									<div
										class="text-sm font-medium text-center"
									>
										Funding Status
									</div>
									<div class="text-center">
										<div
											class={`text-2xl font-bold ${
												(selectedScenario ===
													"conservative" &&
													data.financials
														.runway_months /
														(0.8 *
															burnRateMultiplier) >
														18) ||
												(selectedScenario ===
													"aggressive" &&
													data.financials
														.runway_months /
														(1.2 *
															burnRateMultiplier) >
														18) ||
												(selectedScenario ===
													"baseline" &&
													data.financials
														.runway_months /
														burnRateMultiplier >
														18)
													? "text-green-600"
													: (selectedScenario ===
																"conservative" &&
																data.financials
																	.runway_months /
																	(0.8 *
																		burnRateMultiplier) <
																	12) ||
														  (selectedScenario ===
																"aggressive" &&
																data.financials
																	.runway_months /
																	(1.2 *
																		burnRateMultiplier) <
																	12) ||
														  (selectedScenario ===
																"baseline" &&
																data.financials
																	.runway_months /
																	burnRateMultiplier <
																	12)
														? "text-red-600"
														: "text-amber-600"
											}`}
										>
											{(selectedScenario ===
												"conservative" &&
												data.financials.runway_months /
													(0.8 * burnRateMultiplier) >
													18) ||
											(selectedScenario ===
												"aggressive" &&
												data.financials.runway_months /
													(1.2 * burnRateMultiplier) >
													18) ||
											(selectedScenario === "baseline" &&
												data.financials.runway_months /
													burnRateMultiplier >
													18)
												? "Healthy"
												: (selectedScenario ===
															"conservative" &&
															data.financials
																.runway_months /
																(0.8 *
																	burnRateMultiplier) <
																12) ||
													  (selectedScenario ===
															"aggressive" &&
															data.financials
																.runway_months /
																(1.2 *
																	burnRateMultiplier) <
																12) ||
													  (selectedScenario ===
															"baseline" &&
															data.financials
																.runway_months /
																burnRateMultiplier <
																12)
													? "Critical"
													: "Caution"}
										</div>
									</div>
									<div
										class="text-xs text-muted-foreground text-center"
									>
										{#if (selectedScenario === "conservative" && data.financials.runway_months / (0.8 * burnRateMultiplier) > 18) || (selectedScenario === "aggressive" && data.financials.runway_months / (1.2 * burnRateMultiplier) > 18) || (selectedScenario === "baseline" && data.financials.runway_months / burnRateMultiplier > 18)}
											No immediate funding pressure
										{:else if (selectedScenario === "conservative" && data.financials.runway_months / (0.8 * burnRateMultiplier) < 12) || (selectedScenario === "aggressive" && data.financials.runway_months / (1.2 * burnRateMultiplier) < 12) || (selectedScenario === "baseline" && data.financials.runway_months / burnRateMultiplier < 12)}
											Start fundraising immediately
										{:else}
											Plan next funding round soon
										{/if}
									</div>
								</div>
							</div>

							<!-- Visualization -->
							<div class="space-y-3">
								<div class="text-sm font-medium">
									Runway Visualization
								</div>
								<div
									class="relative h-8 bg-muted rounded-full overflow-hidden"
								>
									<!-- Base runway bar -->
									<div
										class="absolute top-0 left-0 h-full bg-primary"
										style="width: {Math.min(
											100,
											selectedScenario === 'conservative'
												? (data.financials
														.runway_months /
														(0.8 *
															burnRateMultiplier) /
														24) *
														100
												: selectedScenario ===
													  'aggressive'
													? (data.financials
															.runway_months /
															(1.2 *
																burnRateMultiplier) /
															24) *
														100
													: (data.financials
															.runway_months /
															burnRateMultiplier /
															24) *
														100,
										)}%"
									></div>

									<!-- Current position marker -->
									<div
										class="absolute top-0 h-full border-r-2 border-background"
										style="left: 0%;"
									></div>

									<!-- Risk zones -->
									<div
										class="absolute top-0 h-full border-r-2 border-dashed border-amber-500"
										style="left: 50%;"
									></div>
									<div
										class="absolute top-0 h-full border-r-2 border-dashed border-red-500"
										style="left: 33%;"
									></div>

									<!-- Month indicators -->
									<div
										class="absolute -bottom-6 text-xs text-muted-foreground"
										style="left: 0"
									>
										Now
									</div>
									<div
										class="absolute -bottom-6 text-xs text-muted-foreground"
										style="left: 33%"
									>
										12m
									</div>
									<div
										class="absolute -bottom-6 text-xs text-muted-foreground"
										style="left: 50%"
									>
										18m
									</div>
									<div
										class="absolute -bottom-6 text-xs text-muted-foreground"
										style="left: 100%; transform: translateX(-100%)"
									>
										24m+
									</div>
								</div>
							</div>

							<!-- Action buttons -->
							<div class="flex justify-end gap-3">
								<Button variant="outline">Save Scenario</Button>
								<Button>Generate Full Report</Button>
							</div>
						</div>
					</Card.Content>
				{/if}
			</Card.Root>

			<!-- Cash Flow Forecasting -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<div>
							<div class="flex items-center gap-2">
								<Card.Title>Cash Flow Forecasting</Card.Title>
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={() =>
										(cashFlowExpanded = !cashFlowExpanded)}
								>
									{#if cashFlowExpanded}
										<ChevronUp class="h-4 w-4" />
									{:else}
										<ChevronDown class="h-4 w-4" />
									{/if}
								</Button>
							</div>
							<Card.Description>
								Cash flow projections with sensitivity analysis
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				{#if cashFlowExpanded}
					<Card.Content>
						<div class="space-y-6">
							<!-- Cash flow projection chart -->
							<div class="h-72 relative">
								<!-- Chart visualization -->
								<div class="absolute inset-0">
									<!-- Optimistic scenario -->
									<div
										class="absolute bottom-0 left-0 right-0 h-full flex items-end"
									>
										<div class="w-full h-full relative">
											<svg
												class="w-full h-full"
												preserveAspectRatio="none"
												viewBox="0 0 100 100"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M0 100 L0 70 C10 65 20 68 30 60 C40 52 50 45 60 50 C70 55 80 65 90 60 L100 55 L100 100 Z"
													fill="rgba(74, 222, 128, 0.1)"
												/>
												<path
													d="M0 70 C10 65 20 68 30 60 C40 52 50 45 60 50 C70 55 80 65 90 60 L100 55"
													stroke="#4ade80"
													stroke-width="1.5"
													stroke-linecap="round"
												/>
											</svg>
										</div>
									</div>

									<!-- Base scenario -->
									<div
										class="absolute bottom-0 left-0 right-0 h-full flex items-end"
									>
										<div class="w-full h-full relative">
											<svg
												class="w-full h-full"
												preserveAspectRatio="none"
												viewBox="0 0 100 100"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M0 100 L0 80 C10 75 20 78 30 70 C40 62 50 55 60 60 C70 65 80 75 90 70 L100 65 L100 100 Z"
													fill="rgba(59, 130, 246, 0.1)"
												/>
												<path
													d="M0 80 C10 75 20 78 30 70 C40 62 50 55 60 60 C70 65 80 75 90 70 L100 65"
													stroke="#3b82f6"
													stroke-width="1.5"
													stroke-linecap="round"
												/>
											</svg>
										</div>
									</div>

									<!-- Conservative scenario -->
									<div
										class="absolute bottom-0 left-0 right-0 h-full flex items-end"
									>
										<div class="w-full h-full relative">
											<svg
												class="w-full h-full"
												preserveAspectRatio="none"
												viewBox="0 0 100 100"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M0 100 L0 90 C10 85 20 88 30 80 C40 72 50 65 60 70 C70 75 80 85 90 80 L100 75 L100 100 Z"
													fill="rgba(239, 68, 68, 0.1)"
												/>
												<path
													d="M0 90 C10 85 20 88 30 80 C40 72 50 65 60 70 C70 75 80 85 90 80 L100 75"
													stroke="#ef4444"
													stroke-width="1.5"
													stroke-linecap="round"
												/>
											</svg>
										</div>
									</div>

									<!-- X-axis labels -->
									<div
										class="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-6"
									>
										{#each ["Now", "Q1", "Q2", "Q3", "Q4", "Q1", "Q2"] as month, i}
											<div
												class="text-xs text-muted-foreground"
											>
												{month}
											</div>
										{/each}
									</div>

									<!-- Cash flow threshold line -->
									<div
										class="absolute left-0 right-0"
										style="bottom: 40%;"
									>
										<div
											class="border-t border-dashed border-red-400 w-full"
										></div>
										<div
											class="absolute right-0 -top-2 text-xs text-red-400 bg-background px-1"
										>
											Cash depleted
										</div>
									</div>

									<!-- Horizontal grid lines -->
									<div
										class="absolute inset-0 flex flex-col justify-between pt-6 pb-8"
									>
										{#each Array(5) as _, i}
											<div
												class="w-full h-px bg-muted"
											></div>
										{/each}
									</div>
								</div>

								<!-- Y-axis labels (right side) -->
								<div
									class="absolute top-0 right-0 h-full flex flex-col justify-between py-4"
								>
									{#each [formatCurrency(3500000), formatCurrency(2800000), formatCurrency(2100000), formatCurrency(1400000), formatCurrency(700000), "$0"] as amount, i}
										<div
											class="text-xs text-muted-foreground"
										>
											{amount}
										</div>
									{/each}
								</div>
							</div>

							<!-- Scenarios legend -->
							<div class="flex items-center justify-center gap-6">
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-green-400"
									></div>
									<div class="text-sm">
										Optimistic (+10% revenue, -5% costs)
									</div>
								</div>
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-blue-500"
									></div>
									<div class="text-sm">Base case</div>
								</div>
								<div class="flex items-center gap-2">
									<div
										class="w-3 h-3 rounded-full bg-red-500"
									></div>
									<div class="text-sm">
										Conservative (-10% revenue, +5% costs)
									</div>
								</div>
							</div>

							<!-- Sensitivity analysis -->
							<div class="space-y-4 pt-4 border-t">
								<div class="text-sm font-medium">
									Sensitivity Analysis
								</div>
								<div class="grid grid-cols-3 gap-4">
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Base Case Runway
										</div>
										<div class="text-2xl font-bold">
											{data.financials.runway_months} months
										</div>
										<div
											class="text-xs text-muted-foreground"
										>
											Until {new Date(
												Date.now() +
													data.financials
														.runway_months *
														30 *
														24 *
														60 *
														60 *
														1000,
											).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric",
											})}
										</div>
									</div>
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Optimistic Case
										</div>
										<div class="text-2xl font-bold">
											{Math.round(
												data.financials.runway_months *
													1.15,
											)} months
										</div>
										<div class="text-xs text-green-500">
											+{Math.round(
												data.financials.runway_months *
													0.15,
											)} months
										</div>
									</div>
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Conservative Case
										</div>
										<div class="text-2xl font-bold">
											{Math.round(
												data.financials.runway_months *
													0.85,
											)} months
										</div>
										<div class="text-xs text-red-500">
											-{Math.round(
												data.financials.runway_months *
													0.15,
											)} months
										</div>
									</div>
								</div>

								<!-- Risk factors -->
								<div class="grid grid-cols-2 gap-4 mt-4">
									<div
										class="border rounded-lg p-4 space-y-3"
									>
										<div class="font-medium">
											Key Risk Factors
										</div>
										<div class="space-y-2">
											<div class="flex items-start gap-2">
												<AlertTriangle
													class="h-4 w-4 text-amber-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Revenue slippage
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														10% revenue decrease
														shortens runway by 2.1
														months
													</div>
												</div>
											</div>
											<div class="flex items-start gap-2">
												<AlertTriangle
													class="h-4 w-4 text-amber-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Expense overruns
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														10% cost increase
														shortens runway by 1.8
														months
													</div>
												</div>
											</div>
											<div class="flex items-start gap-2">
												<AlertTriangle
													class="h-4 w-4 text-amber-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Hiring velocity
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Accelerated hiring could
														reduce runway by 0.5
														months per hire
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										class="border rounded-lg p-4 space-y-3"
									>
										<div class="font-medium">
											Potential Mitigations
										</div>
										<div class="space-y-2">
											<div class="flex items-start gap-2">
												<CheckCircle2
													class="h-4 w-4 text-green-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Cost optimization
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Reduce non-essential
														expenses to extend
														runway by 1-2 months
													</div>
												</div>
											</div>
											<div class="flex items-start gap-2">
												<CheckCircle2
													class="h-4 w-4 text-green-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Revenue acceleration
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Focus on quick revenue
														opportunities to improve
														cash position
													</div>
												</div>
											</div>
											<div class="flex items-start gap-2">
												<CheckCircle2
													class="h-4 w-4 text-green-500 mt-0.5"
												/>
												<div>
													<div
														class="text-sm font-medium"
													>
														Staged hiring
													</div>
													<div
														class="text-xs text-muted-foreground"
													>
														Prioritize critical
														roles and delay others
														to conserve cash
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Action buttons -->
							<div class="flex justify-end gap-3">
								<Button variant="outline"
									>Adjust Parameters</Button
								>
								<Button>Generate Detailed Report</Button>
							</div>
						</div>
					</Card.Content>
				{/if}
			</Card.Root>

			<!-- Resource Allocation Optimization -->
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<div>
							<div class="flex items-center gap-2">
								<Card.Title
									>Resource Allocation Optimization</Card.Title
								>
								<Button
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={() =>
										(optimizationExpanded =
											!optimizationExpanded)}
								>
									{#if optimizationExpanded}
										<ChevronUp class="h-4 w-4" />
									{:else}
										<ChevronDown class="h-4 w-4" />
									{/if}
								</Button>
							</div>
							<Card.Description>
								Suggestions to optimize resource allocation
								across the organization
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				{#if optimizationExpanded}
					<Card.Content>
						<div class="space-y-6">
							<!-- Current allocation vs. optimized -->
							<div class="space-y-4">
								<div class="text-sm font-medium">
									Current vs. Optimized Allocation
								</div>
								<div class="grid grid-cols-2 gap-8">
									<!-- Current allocation pie chart -->
									<div class="space-y-2">
										<div class="text-sm text-center">
											Current Allocation
										</div>
										<div class="relative w-48 h-48 mx-auto">
											<svg
												viewBox="0 0 100 100"
												class="w-full h-full"
											>
												<!-- Engineering slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#3b82f6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="211.8"
													transform="rotate(-90 50 50)"
												/>
												<!-- Marketing slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#8b5cf6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="254.466"
													transform="rotate(-18.5 50 50)"
												/>
												<!-- Design slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#ec4899"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="268.6"
													transform="rotate(5.4 50 50)"
												/>
												<!-- Product slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#14b8a6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="268.6"
													transform="rotate(19.14 50 50)"
												/>
												<!-- Customer Success slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#f97316"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="275.1"
													transform="rotate(32.88 50 50)"
												/>
												<!-- Operations slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#64748b"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="275.1"
													transform="rotate(41.18 50 50)"
												/>
											</svg>
										</div>
									</div>
									<!-- Optimized allocation pie chart -->
									<div class="space-y-2">
										<div class="text-sm text-center">
											Optimized Allocation
										</div>
										<div class="relative w-48 h-48 mx-auto">
											<svg
												viewBox="0 0 100 100"
												class="w-full h-full"
											>
												<!-- Engineering slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#3b82f6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="217.71"
													transform="rotate(-90 50 50)"
												/>
												<!-- Marketing slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#8b5cf6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="261.53"
													transform="rotate(-25 50 50)"
												/>
												<!-- Design slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#ec4899"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="273.26"
													transform="rotate(1 50 50)"
												/>
												<!-- Product slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#14b8a6"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="261.53"
													transform="rotate(12.9 50 50)"
												/>
												<!-- Customer Success slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#f97316"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="268.6"
													transform="rotate(30 50 50)"
												/>
												<!-- Operations slice -->
												<circle
													cx="50"
													cy="50"
													r="45"
													fill="transparent"
													stroke="#64748b"
													stroke-width="10"
													stroke-dasharray="282.74"
													stroke-dashoffset="277.08"
													transform="rotate(41.18 50 50)"
												/>
											</svg>
										</div>
									</div>
								</div>

								<!-- Legend -->
								<div class="grid grid-cols-3 gap-y-2">
									{#each Object.entries(departmentColors) as [department, color]}
										<div class="flex items-center gap-2">
											<div
												class="w-3 h-3 rounded-full"
												style="background-color: {color}"
											></div>
											<div class="text-sm">
												{department}
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Optimization suggestions -->
							<div class="space-y-4 pt-4 border-t">
								<div class="text-sm font-medium">
									Suggested Reallocation
								</div>

								<div class="space-y-4">
									<!-- Engineering adjustment -->
									<div
										class="border rounded-lg p-4 space-y-3"
									>
										<div
											class="flex justify-between items-center"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-3 h-3 rounded-full"
													style="background-color: #3b82f6"
												></div>
												<div class="font-medium">
													Engineering
												</div>
											</div>
											<div
												class="text-sm flex items-center gap-2"
											>
												<div>
													Current: {formatCurrency(
														98000,
													)}
												</div>
												<ArrowRight
													class="h-3.5 w-3.5"
												/>
												<div>
													Optimized: {formatCurrency(
														92000,
													)}
												</div>
												<div
													class="text-red-500 flex items-center"
												>
													<ArrowDown
														class="h-3.5 w-3.5 mr-1"
													/>
													<span>6.1%</span>
												</div>
											</div>
										</div>
										<div class="text-sm">
											<p>
												Recommend shifting 6.1% of
												engineering resources to product
												development to accelerate
												feature delivery. This
												optimization aligns with current
												company goals and increases the
												efficiency of feature delivery
												by 15%.
											</p>
										</div>
									</div>

									<!-- Marketing adjustment -->
									<div
										class="border rounded-lg p-4 space-y-3"
									>
										<div
											class="flex justify-between items-center"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-3 h-3 rounded-full"
													style="background-color: #8b5cf6"
												></div>
												<div class="font-medium">
													Marketing
												</div>
											</div>
											<div
												class="text-sm flex items-center gap-2"
											>
												<div>
													Current: {formatCurrency(
														35000,
													)}
												</div>
												<ArrowRight
													class="h-3.5 w-3.5"
												/>
												<div>
													Optimized: {formatCurrency(
														33000,
													)}
												</div>
												<div
													class="text-red-500 flex items-center"
												>
													<ArrowDown
														class="h-3.5 w-3.5 mr-1"
													/>
													<span>5.7%</span>
												</div>
											</div>
										</div>
										<div class="text-sm">
											<p>
												Recommend focusing marketing
												resources on highest ROI
												channels based on recent
												performance data. This
												reallocation would improve
												conversion rates by an estimated
												8.2% at a lower overall cost.
											</p>
										</div>
									</div>

									<!-- Product adjustment -->
									<div
										class="border rounded-lg p-4 space-y-3"
									>
										<div
											class="flex justify-between items-center"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-3 h-3 rounded-full"
													style="background-color: #14b8a6"
												></div>
												<div class="font-medium">
													Product
												</div>
											</div>
											<div
												class="text-sm flex items-center gap-2"
											>
												<div>
													Current: {formatCurrency(
														25000,
													)}
												</div>
												<ArrowRight
													class="h-3.5 w-3.5"
												/>
												<div>
													Optimized: {formatCurrency(
														35000,
													)}
												</div>
												<div
													class="text-green-500 flex items-center"
												>
													<ArrowUp
														class="h-3.5 w-3.5 mr-1"
													/>
													<span>40%</span>
												</div>
											</div>
										</div>
										<div class="text-sm">
											<p>
												Recommend increasing product
												resources to accelerate roadmap
												delivery. Analysis shows that a
												40% increase in product
												resources will result in a 23%
												faster time-to-market for key
												features that directly impact
												revenue growth.
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Optimization impact -->
							<div class="space-y-4 pt-4 border-t">
								<div class="text-sm font-medium">
									Projected Impact
								</div>

								<div class="grid grid-cols-3 gap-4">
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Runway Extension
										</div>
										<div class="text-2xl font-bold">
											+3.2 months
										</div>
										<div class="text-xs text-green-500">
											Without reducing headcount
										</div>
									</div>
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Goal Velocity
										</div>
										<div class="text-2xl font-bold">
											+12%
										</div>
										<div class="text-xs text-green-500">
											Faster objective completion
										</div>
									</div>
									<div class="bg-muted rounded-lg p-4">
										<div
											class="text-sm text-muted-foreground mb-1"
										>
											Resource Efficiency
										</div>
										<div class="text-2xl font-bold">
											82%
										</div>
										<div class="text-xs text-green-500">
											+4% improvement
										</div>
									</div>
								</div>
							</div>

							<!-- Action buttons -->
							<div class="flex justify-end gap-3">
								<Button variant="outline"
									>Save Recommendations</Button
								>
								<Button>Apply Optimization</Button>
							</div>
						</div>
					</Card.Content>
				{/if}
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
