<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import { cn } from "$lib/utils";
	import type { PageData } from "./$types";
	import {
		Calendar as CalendarIcon,
		ChevronLeft,
		ChevronRight,
		Plus,
	} from "@lucide/svelte";
	import { Checkbox } from "$lib/components/ui/checkbox";

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

	// Helper functions
	function formatTime(time: string) {
		const [hour, minute] = time.split(":").map(Number);
		const hour12 = hour % 12 || 12;
		const ampm = hour < 12 ? "AM" : "PM";
		return `${hour12}${minute > 0 ? `:${minute.toString().padStart(2, "0")}` : ""} ${ampm}`;
	}
</script>

<div class="container mx-auto p-4">
	<div class="grid grid-cols-[250px_1fr] gap-6">
		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Calendar header with red box -->
			<div class="flex items-center">
				<div
					class="bg-destructive text-white w-10 h-10 flex items-center justify-center mr-3 rounded"
				>
					<span class="text-lg font-bold">31</span>
				</div>
				<div>
					<div class="flex items-center gap-1">
						<span class="font-semibold">All Calendar</span>
						<ChevronRight class="h-4 w-4 text-muted-foreground" />
					</div>
					<div class="text-xs text-muted-foreground">
						Personal, Teams
					</div>
				</div>
			</div>

			<!-- Mini Calendar -->
			<div>
				<div class="flex items-center justify-between mb-2">
					<button class="p-1">
						<ChevronLeft class="h-4 w-4" />
					</button>
					<span class="text-sm font-medium">March</span>
					<button class="p-1">
						<ChevronRight class="h-4 w-4" />
					</button>
				</div>

				<div class="grid grid-cols-7 text-center text-xs mb-1">
					<span>Mo</span>
					<span>Tu</span>
					<span>We</span>
					<span>Th</span>
					<span>Fr</span>
					<span>Sa</span>
					<span>Su</span>
				</div>

				<div class="grid grid-cols-7 gap-1 text-center text-sm">
					{#each Array.from({ length: 31 }, (_, i) => i + 1) as day}
						<button
							class={cn(
								"w-7 h-7 rounded-full flex items-center justify-center",
								day === 7 &&
									"bg-primary text-primary-foreground",
								day === 9 && "bg-muted",
							)}
						>
							{day}
						</button>
					{/each}
				</div>
			</div>

			<!-- My Schedule -->
			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="font-semibold">My Schedule</h3>
					<button>
						<ChevronRight class="h-4 w-4" />
					</button>
				</div>

				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Checkbox id="daily-standup" checked={true} />
						<label for="daily-standup" class="text-sm"
							>Daily Standup</label
						>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox id="weekly-review" checked={true} />
						<label for="weekly-review" class="text-sm"
							>Weekly Review</label
						>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox id="team-meeting" checked={false} />
						<label for="team-meeting" class="text-sm"
							>Team Meeting</label
						>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox id="lunch-break" checked={false} />
						<label for="lunch-break" class="text-sm"
							>Lunch Break</label
						>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox id="client-meeting" checked={false} />
						<label for="client-meeting" class="text-sm"
							>Client Meeting</label
						>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox id="other" checked={false} />
						<label for="other" class="text-sm">Other</label>
					</div>
				</div>
			</div>

			<!-- Categories -->
			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="font-semibold">Categories</h3>
					<button>
						<ChevronRight class="h-4 w-4" />
					</button>
				</div>

				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-red-500"></div>
						<span class="text-sm">Work</span>
						<span
							class="text-xs bg-gray-100 px-1.5 rounded-full ml-auto"
							>18</span
						>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
						<span class="text-sm">Personal</span>
						<span
							class="text-xs bg-gray-100 px-1.5 rounded-full ml-auto"
							>9</span
						>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
						<span class="text-sm">Breaks</span>
						<span
							class="text-xs bg-gray-100 px-1.5 rounded-full ml-auto"
							>13</span
						>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-blue-500"></div>
						<span class="text-sm">Events</span>
						<span
							class="text-xs bg-gray-100 px-1.5 rounded-full ml-auto"
							>4</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Calendar Area -->
		<div>
			<!-- Top navigation -->
			<div class="mb-6">
				<!-- Breadcrumb and title -->
				<div class="flex justify-between items-center mb-4">
					<div>
						<div
							class="flex items-center gap-2 text-sm text-muted-foreground mb-1"
						>
							<span>Calendar</span>
							<ChevronRight class="h-4 w-4" />
							<span>All Calendar</span>
						</div>
						<h1 class="text-2xl font-semibold">Calendar</h1>
					</div>

					<Button
						variant="outline"
						size="sm"
						class="flex items-center gap-2"
					>
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
							alt="Google Calendar"
							class="w-5 h-5"
						/>
						Sync to Google Calendar
					</Button>
				</div>

				<!-- Calendar controls -->
				<div class="flex justify-between items-center">
					<div class="flex items-center">
						<h2 class="text-xl font-semibold mr-2">March, 2024</h2>
						<ChevronRight class="h-5 w-5 text-muted-foreground" />
						<span class="text-sm text-muted-foreground ml-2"
							>45 event's</span
						>
					</div>

					<div class="flex items-center gap-4">
						<!-- View toggle -->
						<div class="flex border rounded-md overflow-hidden">
							<button class="px-4 py-1 text-sm">Day</button>
							<button class="px-4 py-1 text-sm bg-muted"
								>Week</button
							>
							<button class="px-4 py-1 text-sm">Month</button>
						</div>

						<!-- New event button -->
						<Button>
							<span class="flex items-center gap-2">
								<Plus class="h-4 w-4" />
								New Event
							</span>
						</Button>
					</div>
				</div>
			</div>

			<!-- Calendar Grid -->
			<Card>
				<CardContent class="p-0">
					<!-- Days header row -->
					<div class="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b">
						<div
							class="p-3 text-sm font-medium text-muted-foreground border-r"
						>
							UTC +1
						</div>

						<div class="p-3 text-center border-r">
							<div class="text-sm font-medium">Monday</div>
							<div class="text-xl">7</div>
						</div>
						<div class="p-3 text-center border-r">
							<div class="text-sm font-medium">Tuesday</div>
							<div class="text-xl">8</div>
						</div>
						<div class="p-3 text-center border-r">
							<div class="text-sm font-medium">Wednesday</div>
							<div class="text-xl">9</div>
						</div>
						<div class="p-3 text-center border-r">
							<div class="text-sm font-medium">Thursday</div>
							<div class="text-xl">10</div>
						</div>
					</div>

					<!-- Time grid -->
					<div class="grid grid-cols-[60px_1fr_1fr_1fr_1fr]">
						<!-- Time column -->
						<div class="text-sm text-right pr-2 border-r">
							<div class="h-[60px] pt-1">09 AM</div>
							<div class="h-[60px] pt-1">10 AM</div>
							<div class="h-[60px] pt-1">11 AM</div>
							<div class="h-[60px] pt-1">12 PM</div>
							<div class="h-[60px] pt-1">01 PM</div>
						</div>

						<!-- Monday column -->
						<div class="border-r">
							<!-- 9 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Daily standup
									</div>
									<div class="text-xs mt-1">
										09 AM - 10 AM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>T</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+4
										</div>
									</div>
								</div>
							</div>
							<!-- 10 AM -->
							<div class="h-[60px] border-b"></div>
							<!-- 11 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-blue-500 bg-blue-50"
								>
									<div class="text-xs font-medium">
										Agencies Birthday
									</div>
									<div class="text-xs mt-1">
										11 AM - 01 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>T</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+23
										</div>
									</div>
								</div>
							</div>
							<!-- 12 PM -->
							<div class="h-[60px] border-b"></div>
							<!-- 1 PM -->
							<div class="h-[60px] border-b"></div>
						</div>

						<!-- Tuesday column -->
						<div class="border-r">
							<!-- 9 AM -->
							<div class="h-[60px] border-b"></div>
							<!-- 10 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Weekly Review
									</div>
									<div class="text-xs mt-1">
										10 AM - 12 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>A</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+4
										</div>
									</div>
								</div>
							</div>
							<!-- 11 AM -->
							<div class="h-[60px] border-b"></div>
							<!-- 12 PM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Meeting with Client
									</div>
									<div class="text-xs mt-1">
										12 PM - 01 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>A</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+4
										</div>
									</div>
								</div>
							</div>
							<!-- 1 PM -->
							<div class="h-[60px] border-b"></div>
						</div>

						<!-- Wednesday column -->
						<div class="border-r">
							<!-- 9 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-green-500 bg-green-50"
								>
									<div class="text-xs font-medium">
										Check Up to Doctor
									</div>
									<div class="text-xs mt-1">
										09 AM - 10 AM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>T</AvatarFallback>
										</Avatar>
									</div>
								</div>
							</div>
							<!-- 10 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-blue-500 bg-blue-50"
								>
									<div class="text-xs font-medium">
										Bazaar
									</div>
									<div class="text-xs mt-1">
										10 AM - 12 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>J</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+2
										</div>
									</div>
								</div>
							</div>
							<!-- 11 AM -->
							<div class="h-[60px] border-b"></div>
							<!-- 12 PM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-yellow-500 bg-yellow-50"
								>
									<div class="text-xs font-medium">
										Lunch Break
									</div>
									<div class="text-xs mt-1">
										12 PM - 01 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>J</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+24
										</div>
									</div>
								</div>
							</div>
							<!-- 1 PM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Meeting with Client
									</div>
									<div class="text-xs mt-1">
										01 PM - 02 PM
									</div>
								</div>
							</div>
						</div>

						<!-- Thursday column -->
						<div class="border-r">
							<!-- 9 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Daily standup
									</div>
									<div class="text-xs mt-1">
										09 AM - 10 AM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>T</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
										<div
											class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
										>
											+10
										</div>
									</div>
								</div>
							</div>
							<!-- 10 AM -->
							<div class="h-[60px] border-b"></div>
							<!-- 11 AM -->
							<div class="h-[60px] border-b relative">
								<div
									class="absolute left-1 right-1 rounded overflow-hidden p-2 border-l-4 border-red-500 bg-red-50"
								>
									<div class="text-xs font-medium">
										Meeting with Client
									</div>
									<div class="text-xs mt-1">
										11 PM - 01 PM
									</div>
									<div class="flex -space-x-1 mt-2">
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>S</AvatarFallback>
										</Avatar>
										<Avatar
											class="h-5 w-5 border border-white"
										>
											<AvatarFallback>M</AvatarFallback>
										</Avatar>
									</div>
								</div>
							</div>
							<!-- 12 PM -->
							<div class="h-[60px] border-b"></div>
							<!-- 1 PM -->
							<div class="h-[60px] border-b relative">
								<div
									class="flex -space-x-1 absolute bottom-1 right-1"
								>
									<Avatar class="h-5 w-5 border border-white">
										<AvatarFallback>S</AvatarFallback>
									</Avatar>
									<Avatar class="h-5 w-5 border border-white">
										<AvatarFallback>T</AvatarFallback>
									</Avatar>
									<Avatar class="h-5 w-5 border border-white">
										<AvatarFallback>M</AvatarFallback>
									</Avatar>
									<div
										class="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-white"
									>
										+9
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
