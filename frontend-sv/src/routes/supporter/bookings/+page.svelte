<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import {
		Search,
		Calendar,
		Clock,
		MessageSquare,
		CheckCircle,
		XCircle,
		AlertCircle,
		MoreHorizontal,
		Eye,
		Edit,
	} from "@lucide/svelte";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";

	// Mock data - will be replaced with API calls
	let bookings = $state([
		{
			id: "1",
			title: "Business Strategy Consultation",
			startup: "TechFlow Inc.",
			service: "Business Strategy Consulting",
			status: "confirmed",
			scheduledDate: "2024-01-15",
			scheduledTime: "10:00 AM",
			duration: 120,
			amount: 500,
			currency: "USD",
			startupNotes: "Need help with market entry strategy",
			supporterNotes: "",
			createdAt: "2024-01-10",
		},
		{
			id: "2",
			title: "Marketing Strategy Review",
			startup: "GreenTech Solutions",
			service: "Marketing Strategy Review",
			status: "in_progress",
			scheduledDate: "2024-01-12",
			scheduledTime: "2:00 PM",
			duration: 90,
			amount: 750,
			currency: "USD",
			startupNotes: "Focus on digital marketing channels",
			supporterNotes: "Working on competitor analysis",
			createdAt: "2024-01-08",
		},
		{
			id: "3",
			title: "Financial Planning Session",
			startup: "DataViz Pro",
			service: "Financial Planning",
			status: "pending",
			scheduledDate: "2024-01-18",
			scheduledTime: "11:00 AM",
			duration: 60,
			amount: 300,
			currency: "USD",
			startupNotes: "Need help with fundraising strategy",
			supporterNotes: "",
			createdAt: "2024-01-12",
		},
		{
			id: "4",
			title: "Technical Architecture Review",
			startup: "CloudScale Technologies",
			service: "Technical Architecture Review",
			status: "completed",
			scheduledDate: "2024-01-05",
			scheduledTime: "3:00 PM",
			duration: 180,
			amount: 2500,
			currency: "USD",
			startupNotes: "Review our microservices architecture",
			supporterNotes:
				"Completed comprehensive review with recommendations",
			createdAt: "2024-01-01",
		},
	]);

	let searchQuery = $state("");
	let selectedStatus = $state("");
	let selectedDateRange = $state("");
	let isLoading = $state(false);

	const statusOptions = [
		{ value: "", label: "All Status" },
		{ value: "pending", label: "Pending" },
		{ value: "confirmed", label: "Confirmed" },
		{ value: "in_progress", label: "In Progress" },
		{ value: "completed", label: "Completed" },
		{ value: "cancelled", label: "Cancelled" },
	];

	function viewBooking(bookingId: string) {
		goto(`/supporter/bookings/${bookingId}`);
	}

	function updateBookingStatus(bookingId: string, status: string) {
		// TODO: Implement status update functionality
		console.log("Update booking status:", bookingId, status);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case "confirmed":
				return CheckCircle;
			case "in_progress":
				return Clock;
			case "pending":
				return AlertCircle;
			case "completed":
				return CheckCircle;
			case "cancelled":
				return XCircle;
			default:
				return AlertCircle;
		}
	}

	function formatDuration(minutes: number) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
		}
		return `${mins}m`;
	}

	onMount(() => {
		// TODO: Load bookings from API
		console.log("Loading supporter bookings...");
	});
</script>

<svelte:head>
	<title>My Bookings | Supporter Dashboard</title>
	<meta
		name="description"
		content="Manage your service bookings and client engagements"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">My Bookings</h1>
			<p class="text-muted-foreground">
				Manage your service bookings and client engagements
			</p>
		</div>
	</div>

	<!-- Filters -->
	<Card>
		<CardContent class="pt-6">
			<div class="flex flex-wrap items-center gap-4">
				<!-- Search -->
				<div class="relative flex-1 min-w-64">
					<Search
						class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search bookings..."
						class="pl-10"
					/>
				</div>

				<!-- Status Filter -->
				<Select bind:value={selectedStatus}>
					<SelectTrigger class="w-48">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						{#each statusOptions as option}
							<SelectItem value={option.value}
								>{option.label}</SelectItem
							>
						{/each}
					</SelectContent>
				</Select>

				<!-- Date Range Filter -->
				<Select bind:value={selectedDateRange}>
					<SelectTrigger class="w-40">
						<SelectValue placeholder="All Time" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Time</SelectItem>
						<SelectItem value="today">Today</SelectItem>
						<SelectItem value="week">This Week</SelectItem>
						<SelectItem value="month">This Month</SelectItem>
						<SelectItem value="quarter">This Quarter</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Bookings List -->
	<div class="space-y-4">
		{#each bookings as booking}
			<Card class="hover:shadow-lg transition-shadow">
				<CardContent class="p-6">
					<div class="flex items-start justify-between">
						<div class="space-y-4 flex-1">
							<!-- Header -->
							<div class="flex items-start justify-between">
								<div class="space-y-1">
									<h3 class="text-lg font-semibold">
										{booking.title}
									</h3>
									<p class="text-sm text-muted-foreground">
										{booking.startup} • {booking.service}
									</p>
								</div>
								<div class="flex items-center gap-3">
									<Badge
										class={getStatusColor(booking.status)}
									>
										<svelte:component
											this={getStatusIcon(booking.status)}
											class="h-3 w-3 mr-1"
										/>
										{booking.status.replace("_", " ")}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger
											asChild
											let:builder
										>
											<Button
												variant="ghost"
												size="sm"
												builders={[builder]}
											>
												<MoreHorizontal
													class="h-4 w-4"
												/>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onclick={() =>
													viewBooking(booking.id)}
											>
												<Eye class="h-4 w-4 mr-2" />
												View Details
											</DropdownMenuItem>
											{#if booking.status === "pending"}
												<DropdownMenuItem
													onclick={() =>
														updateBookingStatus(
															booking.id,
															"confirmed",
														)}
												>
													<CheckCircle
														class="h-4 w-4 mr-2"
													/>
													Confirm Booking
												</DropdownMenuItem>
											{/if}
											{#if booking.status === "confirmed"}
												<DropdownMenuItem
													onclick={() =>
														updateBookingStatus(
															booking.id,
															"in_progress",
														)}
												>
													<Clock
														class="h-4 w-4 mr-2"
													/>
													Start Session
												</DropdownMenuItem>
											{/if}
											{#if booking.status === "in_progress"}
												<DropdownMenuItem
													onclick={() =>
														updateBookingStatus(
															booking.id,
															"completed",
														)}
												>
													<CheckCircle
														class="h-4 w-4 mr-2"
													/>
													Complete Session
												</DropdownMenuItem>
											{/if}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							<!-- Details Grid -->
							<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div class="flex items-center gap-2">
									<Calendar
										class="h-4 w-4 text-muted-foreground"
									/>
									<div>
										<p class="text-sm font-medium">
											{booking.scheduledDate}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											{booking.scheduledTime}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<Clock
										class="h-4 w-4 text-muted-foreground"
									/>
									<div>
										<p class="text-sm font-medium">
											{formatDuration(booking.duration)}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											Duration
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<MessageSquare
										class="h-4 w-4 text-muted-foreground"
									/>
									<div>
										<p class="text-sm font-medium">
											${booking.amount}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											{booking.currency}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<Calendar
										class="h-4 w-4 text-muted-foreground"
									/>
									<div>
										<p class="text-sm font-medium">
											Booked {booking.createdAt}
										</p>
										<p
											class="text-xs text-muted-foreground"
										>
											Created
										</p>
									</div>
								</div>
							</div>

							<!-- Notes -->
							{#if booking.startupNotes || booking.supporterNotes}
								<div class="space-y-2">
									{#if booking.startupNotes}
										<div>
											<p
												class="text-sm font-medium text-muted-foreground"
											>
												Client Notes:
											</p>
											<p class="text-sm">
												{booking.startupNotes}
											</p>
										</div>
									{/if}
									{#if booking.supporterNotes}
										<div>
											<p
												class="text-sm font-medium text-muted-foreground"
											>
												Your Notes:
											</p>
											<p class="text-sm">
												{booking.supporterNotes}
											</p>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Empty State -->
	{#if bookings.length === 0}
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<Calendar class="h-12 w-12 text-muted-foreground mb-4" />
				<h3 class="text-lg font-semibold mb-2">No bookings yet</h3>
				<p class="text-muted-foreground text-center mb-4">
					When startups book your services, they'll appear here.
				</p>
				<Button onclick={() => goto("/supporter/services")}>
					Manage Services
				</Button>
			</CardContent>
		</Card>
	{/if}
</div>
