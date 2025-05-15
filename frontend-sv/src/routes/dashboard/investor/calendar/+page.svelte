<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from "$lib/components/ui/popover";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import { cn } from "$lib/utils";
	import type { PageData } from "./$types";
	import {
		Calendar,
		ChevronLeft,
		ChevronRight,
		Plus,
		MoreHorizontal,
		Filter,
	} from "@lucide/svelte";
	import {
		format,
		addMonths,
		subMonths,
		getDay,
		getDaysInMonth,
		isSameMonth,
		isSameDay,
		startOfMonth,
		endOfMonth,
		eachDayOfInterval,
		addDays,
		parse,
	} from "date-fns";
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger,
	} from "$lib/components/ui/sheet";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select";

	// Types
	interface CalendarEvent {
		id: number;
		title: string;
		date: string;
		startTime: string;
		endTime: string;
		location: string;
		type: string;
		description?: string;
		participants?: Participant[];
		color?: string;
		status: "confirmed" | "tentative" | "cancelled";
		priority: "high" | "medium" | "low";
	}

	interface Participant {
		id: number;
		name: string;
		avatar: string;
		role?: string;
	}

	// Use server data
	let { data }: { data: PageData } = $props();
	let events = $state<CalendarEvent[]>(data.events || []);

	// Calendar state
	let currentDate = $state(new Date());
	let selectedDate = $state<Date | null>(null);
	let viewMode = $state<"week" | "month">("week");
	let showNewEventSheet = $state(false);

	// Filters
	let filters = $state({
		eventTypes: [] as string[],
		participants: [] as number[],
		priorities: [] as string[],
	});

	// New event form
	let newEvent = $state({
		title: "",
		date: format(new Date(), "yyyy-MM-dd"),
		startTime: "09:00",
		endTime: "10:00",
		location: "",
		type: "",
		description: "",
		participants: [] as number[],
		priority: "medium" as "high" | "medium" | "low",
		status: "tentative" as "confirmed" | "tentative" | "cancelled",
	});

	// Derived values
	let formattedCurrentMonth = $derived(format(currentDate, "MMMM yyyy"));
	let formattedCurrentWeek = $derived(
		`W${Math.ceil(currentDate.getDate() / 7)}`,
	);

	// MOCK DATA FOR DEVELOPMENT (should come from server)
	const eventTypes = $state([
		{ id: "meeting", name: "Meeting", color: "bg-blue-400" },
		{ id: "call", name: "Call", color: "bg-purple-400" },
		{ id: "review", name: "Review", color: "bg-green-400" },
		{ id: "presentation", name: "Presentation", color: "bg-amber-400" },
		{ id: "interview", name: "Interview", color: "bg-pink-400" },
		{ id: "family", name: "Family", color: "bg-red-300" },
	]);

	// Team members (for participants)
	const teamMembers = $state(
		data.teamMembers || [
			{
				id: 1,
				name: "Sofia Safier",
				avatar: "/avatars/sofia.png",
				role: "CEO",
			},
			{
				id: 2,
				name: "Tommy Wilson",
				avatar: "/avatars/tommy.png",
				role: "CTO",
			},
			{
				id: 3,
				name: "Mike Johnson",
				avatar: "/avatars/mike.png",
				role: "Analyst",
			},
			{
				id: 4,
				name: "Pedra Silva",
				avatar: "/avatars/pedra.png",
				role: "Designer",
			},
			{
				id: 5,
				name: "Ely Martinez",
				avatar: "/avatars/ely.png",
				role: "Product",
			},
		],
	);

	// Generate calendar grid
	function getCalendarDays() {
		// Get first day of month (0 = Sunday, 1 = Monday, etc.)
		const firstDayOfMonth = getDay(startOfMonth(currentDate));
		// Get days in month
		const daysInMonth = getDaysInMonth(currentDate);
		// Get calendar start date (might be in previous month)
		const calendarStartDate = startOfMonth(currentDate);
		// Adjust start date to show Sunday as first day
		const adjustedStartDate = addDays(calendarStartDate, -firstDayOfMonth);

		// Generate 42 days (6 weeks) for the calendar
		return eachDayOfInterval({
			start: adjustedStartDate,
			end: addDays(adjustedStartDate, 41),
		});
	}

	// Get days for the current week view
	function getWeekDays() {
		// First find the Sunday of the current week
		const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
		const sundayOfWeek = addDays(currentDate, -currentDay);

		// Return array of 7 days starting from Sunday
		return eachDayOfInterval({
			start: sundayOfWeek,
			end: addDays(sundayOfWeek, 6),
		});
	}

	// Get hour slots for day view
	function getHourSlots() {
		return Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM
	}

	// Get events for a specific date
	function getEventsForDate(date: Date) {
		return events.filter((event) => {
			const eventDate = new Date(event.date);
			return isSameDay(eventDate, date);
		});
	}

	// Format time in 12-hour format
	function formatTime(time: string) {
		const [hours, minutes] = time.split(":").map(Number);
		const period = hours >= 12 ? "PM" : "AM";
		const hour12 = hours % 12 || 12;
		return `${hour12}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""} ${period}`;
	}

	// Format time range
	function formatTimeRange(startTime: string, endTime: string) {
		return `${formatTime(startTime)}–${formatTime(endTime)}`;
	}

	// Check if a specific hour has an event
	function getEventsForHour(date: Date, hour: number) {
		return events.filter((event) => {
			if (!isSameDay(new Date(event.date), date)) return false;

			const startHour = parseInt(event.startTime.split(":")[0]);
			const endHour = parseInt(event.endTime.split(":")[0]);

			// Check if the event spans this hour
			return (startHour <= hour && endHour > hour) || startHour === hour;
		});
	}

	// Calculate event position and duration for week view
	function getEventStyle(event: CalendarEvent) {
		const startHour = parseInt(event.startTime.split(":")[0]);
		const startMinute = parseInt(event.startTime.split(":")[1]);
		const endHour = parseInt(event.endTime.split(":")[0]);
		const endMinute = parseInt(event.endTime.split(":")[1]);

		// Calculate top position (hours from 6 AM, our start)
		const startPosition = (startHour - 6) * 60 + startMinute;

		// Calculate height (duration in minutes)
		const duration =
			endHour * 60 + endMinute - (startHour * 60 + startMinute);

		return {
			top: `${startPosition}px`,
			height: `${duration}px`,
		};
	}

	// Get event type details
	function getEventType(typeId: string) {
		return (
			eventTypes.find((type) => type.id === typeId) || {
				id: typeId,
				name: typeId,
				color: "bg-gray-400",
			}
		);
	}

	// Navigation
	function goToPrevious() {
		currentDate =
			viewMode === "month"
				? subMonths(currentDate, 1)
				: addDays(currentDate, -7);
	}

	function goToNext() {
		currentDate =
			viewMode === "month"
				? addMonths(currentDate, 1)
				: addDays(currentDate, 7);
	}

	function goToToday() {
		currentDate = new Date();
	}

	// Event handling
	function createEvent() {
		// Server would handle this in a real app
		const newId =
			events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;

		const eventToAdd = {
			id: newId,
			title: newEvent.title,
			date: newEvent.date,
			startTime: newEvent.startTime,
			endTime: newEvent.endTime,
			location: newEvent.location,
			type: newEvent.type,
			description: newEvent.description,
			status: newEvent.status,
			priority: newEvent.priority,
			participants: teamMembers.filter((m) =>
				newEvent.participants.includes(m.id),
			),
		};

		events = [...events, eventToAdd];
		resetNewEventForm();
		showNewEventSheet = false;
	}

	function resetNewEventForm() {
		newEvent = {
			title: "",
			date: format(new Date(), "yyyy-MM-dd"),
			startTime: "09:00",
			endTime: "10:00",
			location: "",
			type: "",
			description: "",
			participants: [],
			priority: "medium",
			status: "tentative",
		};
	}

	// Filtering
	function toggleEventTypeFilter(typeId: string) {
		if (filters.eventTypes.includes(typeId)) {
			filters.eventTypes = filters.eventTypes.filter((t) => t !== typeId);
		} else {
			filters.eventTypes = [...filters.eventTypes, typeId];
		}
	}

	function toggleParticipantFilter(participantId: number) {
		if (filters.participants.includes(participantId)) {
			filters.participants = filters.participants.filter(
				(p) => p !== participantId,
			);
		} else {
			filters.participants = [...filters.participants, participantId];
		}
	}

	function togglePriorityFilter(priority: string) {
		if (filters.priorities.includes(priority)) {
			filters.priorities = filters.priorities.filter(
				(p) => p !== priority,
			);
		} else {
			filters.priorities = [...filters.priorities, priority];
		}
	}

	function clearFilters() {
		filters = {
			eventTypes: [],
			participants: [],
			priorities: [],
		};
	}

	// Get filtered events
	function getFilteredEvents() {
		// If no filters are active, return all events
		if (
			filters.eventTypes.length === 0 &&
			filters.participants.length === 0 &&
			filters.priorities.length === 0
		) {
			return events;
		}

		return events.filter((event) => {
			// Check event type filter
			if (
				filters.eventTypes.length > 0 &&
				!filters.eventTypes.includes(event.type)
			) {
				return false;
			}

			// Check priority filter
			if (
				filters.priorities.length > 0 &&
				!filters.priorities.includes(event.priority)
			) {
				return false;
			}

			// Check participant filter
			if (filters.participants.length > 0 && event.participants) {
				const participantIds = event.participants.map((p) => p.id);
				const hasFilteredParticipant = filters.participants.some((id) =>
					participantIds.includes(id),
				);
				if (!hasFilteredParticipant) return false;
			}

			return true;
		});
	}
</script>

<div class="container px-4 py-6 mx-auto">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold">Calendar</h1>
			<p class="text-muted-foreground">Manage your meetings and events</p>
		</div>

		<div class="flex items-center gap-2">
			<Sheet bind:open={showNewEventSheet}>
				<SheetTrigger>
					<Button>
						<Plus class="w-4 h-4 mr-2" />
						New Event
					</Button>
				</SheetTrigger>
				<SheetContent class="sm:max-w-md">
					<SheetHeader>
						<SheetTitle>Create New Event</SheetTitle>
						<SheetDescription>
							Add a new meeting or event to your calendar
						</SheetDescription>
					</SheetHeader>

					<div class="grid gap-4 py-4">
						<div class="grid items-center gap-4">
							<Label for="title">Event Title</Label>
							<Input
								id="title"
								bind:value={newEvent.title}
								placeholder="Team meeting"
							/>
						</div>

						<div class="grid items-center gap-4">
							<Label for="date">Date</Label>
							<Input
								id="date"
								type="date"
								bind:value={newEvent.date}
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div class="grid items-center gap-2">
								<Label for="startTime">Start Time</Label>
								<Input
									id="startTime"
									type="time"
									bind:value={newEvent.startTime}
								/>
							</div>

							<div class="grid items-center gap-2">
								<Label for="endTime">End Time</Label>
								<Input
									id="endTime"
									type="time"
									bind:value={newEvent.endTime}
								/>
							</div>
						</div>

						<div class="grid items-center gap-4">
							<Label for="location">Location</Label>
							<Input
								id="location"
								bind:value={newEvent.location}
								placeholder="Conference Room A"
							/>
						</div>

						<div class="grid items-center gap-4">
							<Label for="type">Event Type</Label>
							<Select
								type="single"
								onValueChange={(value) =>
									(newEvent.type = value)}
							>
								<SelectTrigger>
										placeholder="Select event type"
								</SelectTrigger>
								<SelectContent>
									{#each eventTypes as eventType}
										<SelectItem value={eventType.id}>
											<div class="flex items-center">
												<span
													class={`w-3 h-3 rounded-full mr-2 ${eventType.color}`}
												></span>
												{eventType.name}
											</div>
										</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						</div>

						<div class="grid items-center gap-4">
							<Label for="priority">Priority</Label>
							<Select
								type="single"
								onValueChange={(value) =>
									(newEvent.priority = value as
										| "high"
										| "medium"
										| "low")}
							>
								<SelectTrigger>
									Set priority
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="medium"
										>Medium</SelectItem
									>
									<SelectItem value="low">Low</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div class="grid items-center gap-4">
							<Label for="participants">Participants</Label>
							<div
								class="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2"
							>
								{#each teamMembers as member}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={`member-${member.id}`}
											checked={newEvent.participants.includes(
												member.id,
											)}
											onCheckedChange={() => {
												if (
													newEvent.participants.includes(
														member.id,
													)
												) {
													newEvent.participants =
														newEvent.participants.filter(
															(id) =>
																id !==
																member.id,
														);
												} else {
													newEvent.participants = [
														...newEvent.participants,
														member.id,
													];
												}
											}}
										/>
										<Label
											for={`member-${member.id}`}
											class="flex items-center gap-2 cursor-pointer"
										>
											<Avatar class="h-6 w-6">
												<AvatarImage
													src={member.avatar}
													alt={member.name}
												/>
												<AvatarFallback
													>{member.name.charAt(
														0,
													)}</AvatarFallback
												>
											</Avatar>
											<span>{member.name}</span>
										</Label>
									</div>
								{/each}
							</div>
						</div>

						<div class="grid items-center gap-4">
							<Label for="description">Description</Label>
							<textarea
								id="description"
								bind:value={newEvent.description}
								class="min-h-24 p-2 rounded-md border"
								placeholder="Event details and notes..."
							></textarea>
						</div>
					</div>

					<div
						class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6"
					>
						<Button
							variant="outline"
							onclick={() => (showNewEventSheet = false)}
						>
							Cancel
						</Button>
						<Button onclick={createEvent}>Create Event</Button>
					</div>
				</SheetContent>
			</Sheet>

			<!-- Filter Panel -->
			<Sheet>
				<SheetTrigger>
					<Button variant="outline">
						<Filter class="w-4 h-4 mr-2" />
						Filters
					</Button>
				</SheetTrigger>
				<SheetContent side="right" class="w-[300px]">
					<SheetHeader>
						<SheetTitle>Filters</SheetTitle>
						<SheetDescription>
							Filter events by type, participants, and priority
						</SheetDescription>
					</SheetHeader>

					<div class="space-y-6 py-4">
						<!-- Event Types -->
						<div>
							<h3 class="font-medium mb-3">Event Types</h3>
							<div class="space-y-2">
								{#each eventTypes as eventType}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={`type-${eventType.id}`}
											checked={filters.eventTypes.includes(
												eventType.id,
											)}
											onCheckedChange={() =>
												toggleEventTypeFilter(
													eventType.id,
												)}
										/>
										<Label
											for={`type-${eventType.id}`}
											class="flex items-center gap-2 cursor-pointer"
										>
											<span
												class={`w-3 h-3 rounded-full ${eventType.color}`}
											></span>
											<span>{eventType.name}</span>
										</Label>
									</div>
								{/each}
							</div>
						</div>

						<!-- Team Members -->
						<div>
							<h3 class="font-medium mb-3">Team Members</h3>
							<div class="space-y-2 max-h-44 overflow-y-auto">
								{#each teamMembers as member}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={`filter-member-${member.id}`}
											checked={filters.participants.includes(
												member.id,
											)}
											onCheckedChange={() =>
												toggleParticipantFilter(
													member.id,
												)}
										/>
										<Label
											for={`filter-member-${member.id}`}
											class="flex items-center gap-2 cursor-pointer"
										>
											<Avatar class="h-6 w-6">
												<AvatarImage
													src={member.avatar}
													alt={member.name}
												/>
												<AvatarFallback
													>{member.name.charAt(
														0,
													)}</AvatarFallback
												>
											</Avatar>
											<span>{member.name}</span>
										</Label>
									</div>
								{/each}
							</div>
						</div>

						<!-- Priority -->
						<div>
							<h3 class="font-medium mb-3">Priority</h3>
							<div class="space-y-2">
								{#each ["high", "medium", "low"] as priority}
									<div class="flex items-center space-x-2">
										<Checkbox
											id={`priority-${priority}`}
											checked={filters.priorities.includes(
												priority,
											)}
											onCheckedChange={() =>
												togglePriorityFilter(priority)}
										/>
										<Label
											for={`priority-${priority}`}
											class="capitalize cursor-pointer"
										>
											{priority}
										</Label>
									</div>
								{/each}
							</div>
						</div>

						<Button
							variant="outline"
							class="w-full mt-4"
							onclick={clearFilters}
						>
							Clear All Filters
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	</div>

	<!-- Calendar Header -->
	<Card>
		<CardHeader class="pb-3">
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<div class="font-semibold text-lg">
						{viewMode === "month"
							? formattedCurrentMonth
							: `March 2025 / ${formattedCurrentWeek}`}
					</div>
					<div class="flex items-center ml-4">
						<Button
							variant="ghost"
							size="icon"
							onclick={goToPrevious}
						>
							<ChevronLeft class="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onclick={goToToday}
							>Today</Button
						>
						<Button variant="ghost" size="icon" onclick={goToNext}>
							<ChevronRight class="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<Button
						variant={viewMode === "month" ? "default" : "outline"}
						size="sm"
						onclick={() => (viewMode = "month")}
					>
						Month
					</Button>
					<Button
						variant={viewMode === "week" ? "default" : "outline"}
						size="sm"
						onclick={() => (viewMode = "week")}
					>
						Week
					</Button>
				</div>
			</div>
		</CardHeader>

		<CardContent>
			{#if viewMode === "month"}
				<!-- Month View -->
				<div class="grid grid-cols-7 mb-2">
					{#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as dayName}
						<div
							class="text-center text-sm font-medium text-muted-foreground py-1"
						>
							{dayName}
						</div>
					{/each}
				</div>

				<div
					class="grid grid-cols-7 gap-px bg-muted rounded-md overflow-hidden border"
				>
					{#each getCalendarDays() as day}
						<div
							class={cn(
								"bg-card min-h-24 p-1.5 relative",
								!isSameMonth(day, currentDate) && "opacity-50",
								isSameDay(day, new Date()) &&
									"ring-2 ring-primary ring-inset",
							)}
						>
							<div class="text-right text-sm font-medium mb-1">
								{day.getDate()}
							</div>

							<div class="space-y-1">
								{#each getEventsForDate(day).slice(0, 3) as event}
									<Tooltip>
										<TooltipTrigger>
											<div
												class={cn(
													"text-xs px-1.5 py-0.5 rounded truncate font-medium text-white",
													getEventType(event.type)
														.color,
												)}
											>
												{formatTime(event.startTime)}
												{event.title}
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<div class="text-xs max-w-56">
												<p class="font-medium">
													{event.title}
												</p>
												<p>
													{formatTimeRange(
														event.startTime,
														event.endTime,
													)}
												</p>
												<p>{event.location}</p>
											</div>
										</TooltipContent>
									</Tooltip>
								{/each}

								{#if getEventsForDate(day).length > 3}
									<div
										class="text-center text-xs text-muted-foreground"
									>
										+{getEventsForDate(day).length - 3} more
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Week View -->
				<div class="flex flex-col">
					<!-- Week days header -->
					<div class="grid grid-cols-8 mb-1">
						<div
							class="text-sm font-medium text-muted-foreground py-1 pl-2"
						>
							GMT+1
						</div>
						{#each getWeekDays() as day}
							<div
								class={cn(
									"text-center py-1",
									isSameDay(day, new Date()) &&
										"bg-muted rounded-md",
								)}
							>
								<div class="text-sm font-medium">
									{format(day, "EEE dd")}
								</div>
							</div>
						{/each}
					</div>

					<!-- Time slots -->
					<div
						class="grid grid-cols-8 gap-1 overflow-y-auto max-h-[650px]"
						style="height: 720px"
					>
						<!-- Time labels -->
						<div class="space-y-[60px] pt-[29px]">
							{#each getHourSlots() as hour}
								<div class="h-[1px] relative">
									<span
										class="absolute -top-2.5 text-xs text-muted-foreground"
									>
										{hour === 12
											? "12 PM"
											: hour > 12
												? `${hour - 12} PM`
												: `${hour} AM`}
									</span>
								</div>
							{/each}
						</div>

						<!-- Days columns -->
						{#each getWeekDays() as day}
							<div class="relative border-t border-muted">
								<!-- Hour markers -->
								{#each getHourSlots() as hour}
									<div
										class="h-[60px] border-b border-muted"
									></div>
								{/each}

								<!-- Events -->
								{#each getFilteredEvents().filter( (e) => isSameDay(new Date(e.date), day), ) as event}
									<div
										class="absolute rounded px-1.5 py-1 text-white text-xs overflow-hidden"
										style={`
											top: ${parseInt(event.startTime.split(":")[0]) * 60 + parseInt(event.startTime.split(":")[1]) - 360}px; 
											height: ${
												parseInt(
													event.endTime.split(":")[0],
												) *
													60 +
												parseInt(
													event.endTime.split(":")[1],
												) -
												(parseInt(
													event.startTime.split(
														":",
													)[0],
												) *
													60 +
													parseInt(
														event.startTime.split(
															":",
														)[1],
													))
											}px;
											left: 2px;
											right: 2px;
											${getEventType(event.type).color}
										`}
									>
										<div class="font-medium leading-tight">
											{event.title}
										</div>
										<div class="opacity-90 text-[10px]">
											{formatTime(event.startTime)} - {formatTime(
												event.endTime,
											)}
										</div>

										{#if event.participants && event.participants.length}
											<div
												class="flex -space-x-1 mt-1 max-w-full overflow-hidden"
											>
												{#each event.participants.slice(0, 3) as participant}
													<Avatar
														class="h-4 w-4 border border-white"
													>
														<AvatarImage
															src={participant.avatar}
															alt={participant.name}
														/>
														<AvatarFallback
															class="text-[8px]"
															>{participant.name.charAt(
																0,
															)}</AvatarFallback
														>
													</Avatar>
												{/each}
												{#if event.participants.length > 3}
													<div
														class="h-4 w-4 rounded-full bg-muted-foreground text-[8px] flex items-center justify-center text-white border border-white"
													>
														+{event.participants
															.length - 3}
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
