<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import InvestorNavigation from "@/components/investor/InvestorNavigation.svelte";
	import type { PageData } from "./$types";

	// Get server-loaded data
	let { data }: { data: PageData } = $props();

	// Initialize reactive state from server data
	let founders = $state(data.founders);
	let messages = $state(data.messages);
	let meetings = $state(data.meetings);
	let updates = $state(data.updates);
	let notes = $state(data.notes);

	// Select first founder by default
	let selectedFounder = $state(founders[0]);

	// Active tab
	let activeTab = $state("messages");

	// New message input
	let newMessage = $state("");

	// Note creation
	let newNote = $state({
		company: "",
		title: "",
		content: "",
		tags: "",
	});

	// Send a message
	function sendMessage() {
		if (!newMessage.trim()) return;

		messages = [
			...messages,
			{
				id: messages.length + 1,
				senderId: "investor",
				text: newMessage,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				isRead: false,
			},
		];

		newMessage = "";
	}

	// Select a founder to chat with
	function selectFounder(founder) {
		selectedFounder = founder;
		// In a real app, this would fetch messages for this founder
	}

	// Add a new meeting
	function scheduleMeeting() {
		// This would open a meeting scheduler modal in the real implementation
		alert("Meeting scheduler would open here");
	}

	// Add a new note
	function saveNote() {
		if (!newNote.company || !newNote.title || !newNote.content) {
			alert("Please fill out all required fields");
			return;
		}

		notes = [
			{
				id: notes.length + 1,
				company: newNote.company,
				date: new Date().toLocaleDateString(),
				title: newNote.title,
				content: newNote.content,
				tags: newNote.tags.split(",").map((tag) => tag.trim()),
			},
			...notes,
		];

		// Reset form
		newNote = {
			company: "",
			title: "",
			content: "",
			tags: "",
		};
	}

	// Mark an update as read
	function markUpdateAsRead(updateId) {
		updates = updates.map((update) =>
			update.id === updateId ? { ...update, read: true } : update,
		);
	}

	// Get class for message styling
	function getMessageClass(message) {
		const isSelf = message.senderId === "investor";
		return isSelf
			? "bg-primary text-primary-foreground self-end"
			: "bg-secondary self-start";
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold mb-2">Founder Engagement</h1>
			<p class="text-muted-foreground mb-6">
				Communicate and collaborate with founders in your portfolio
			</p>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
		<div class="md:col-span-1">
			<div class="bg-card rounded-lg shadow p-4">
				<InvestorNavigation />
			</div>
		</div>

		<div class="md:col-span-3 lg:col-span-4">
			<Tabs
				value={activeTab}
				onValueChange={(value) => (activeTab = value)}
				class="w-full"
			>
				<TabsList class="grid grid-cols-4 mb-4">
					<TabsTrigger value="messages">Messages</TabsTrigger>
					<TabsTrigger value="meetings">Meetings</TabsTrigger>
					<TabsTrigger value="updates">Updates</TabsTrigger>
					<TabsTrigger value="notes">Notes</TabsTrigger>
				</TabsList>

				<!-- Messages Tab -->
				<TabsContent value="messages" class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Founders List -->
						<div
							class="md:col-span-1 border rounded-lg overflow-hidden"
						>
							<div class="p-3 border-b bg-muted">
								<h3 class="font-medium">Portfolio Founders</h3>
							</div>
							<div class="divide-y max-h-[600px] overflow-y-auto">
								{#each founders as founder}
									<button
										class="w-full p-3 flex items-center hover:bg-secondary transition-colors text-left {selectedFounder.id ===
										founder.id
											? 'bg-secondary'
											: ''}"
										onclick={() => selectFounder(founder)}
									>
										<div class="relative flex-shrink-0">
											<img
												src={founder.avatar}
												alt={founder.name}
												class="w-10 h-10 rounded-full mr-3"
											/>
											{#if founder.status === "online"}
												<div
													class="absolute bottom-0 right-3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"
												></div>
											{/if}
										</div>
										<div class="flex-grow min-w-0">
											<div
												class="flex justify-between items-center"
											>
												<h4
													class="font-medium truncate"
												>
													{founder.name}
												</h4>
												<span
													class="text-xs text-muted-foreground whitespace-nowrap"
													>{founder.lastMessageDate}</span
												>
											</div>
											<p
												class="text-sm text-muted-foreground truncate"
											>
												{founder.company}
											</p>
											<p class="text-xs truncate">
												{founder.lastMessage}
											</p>
										</div>
										{#if founder.unread > 0}
											<Badge class="ml-2"
												>{founder.unread}</Badge
											>
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<!-- Chat Area -->
						<div
							class="md:col-span-2 border rounded-lg flex flex-col h-[600px]"
						>
							<!-- Chat Header -->
							<div class="border-b p-3 flex items-center">
								<img
									src={selectedFounder.avatar}
									alt={selectedFounder.name}
									class="w-10 h-10 rounded-full mr-3"
								/>
								<div>
									<h4 class="font-medium">
										{selectedFounder.name}
									</h4>
									<p class="text-sm text-muted-foreground">
										{selectedFounder.company}
									</p>
								</div>
								<div class="ml-auto">
									<Button
										variant="outline"
										size="sm"
										onclick={scheduleMeeting}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2"
											><rect
												width="18"
												height="18"
												x="3"
												y="4"
												rx="2"
												ry="2"
											/><line
												x1="16"
												x2="16"
												y1="2"
												y2="6"
											/><line
												x1="8"
												x2="8"
												y1="2"
												y2="6"
											/><line
												x1="3"
												x2="21"
												y1="10"
												y2="10"
											/></svg
										>
										Schedule
									</Button>
								</div>
							</div>

							<!-- Messages -->
							<div
								class="flex-grow p-4 overflow-y-auto flex flex-col space-y-3"
							>
								{#each messages as message}
									<div
										class="flex flex-col {message.senderId ===
										'investor'
											? 'items-end'
											: 'items-start'}"
									>
										<div
											class="{getMessageClass(
												message,
											)} max-w-[80%] rounded-lg p-3"
										>
											<p>{message.text}</p>
										</div>
										<span
											class="text-xs text-muted-foreground mt-1"
											>{message.timestamp}</span
										>
									</div>
								{/each}
							</div>

							<!-- Message Input -->
							<div class="border-t p-3">
								<form class="flex items-center">
									<!-- onsubmit|preventDefault={sendMessage} -->
									<Textarea
										bind:value={newMessage}
										placeholder="Type your message..."
										class="min-h-[40px] max-h-[120px] resize-none mr-2"
									/>
									<Button type="submit" size="sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2"
											><line
												x1="22"
												x2="11"
												y1="2"
												y2="13"
											/><polygon
												points="22 2 15 22 11 13 2 9 22 2"
											/></svg
										>
										Send
									</Button>
								</form>
							</div>
						</div>
					</div>
				</TabsContent>

				<!-- Meetings Tab -->
				<TabsContent value="meetings" class="space-y-4">
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-xl font-semibold">Upcoming Meetings</h3>
						<Button onclick={scheduleMeeting}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-2"
								><line x1="12" x2="12" y1="5" y2="19" /><line
									x1="5"
									x2="19"
									y1="12"
									y2="12"
								/></svg
							>
							Schedule Meeting
						</Button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each meetings as meeting}
							<Card>
								<CardHeader>
									<CardTitle
										class="flex justify-between items-center"
									>
										<span>{meeting.type}</span>
										<Badge
											variant={meeting.type ===
											"Board Meeting"
												? "destructive"
												: "default"}
										>
											{meeting.date}
										</Badge>
									</CardTitle>
									<CardDescription>
										{meeting.time} • {meeting.location}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span class="text-muted-foreground"
												>Founder:</span
											>
											<span class="font-medium"
												>{meeting.founder}</span
											>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground"
												>Company:</span
											>
											<span class="font-medium"
												>{meeting.company}</span
											>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground"
												>Agenda:</span
											>
											<span class="font-medium"
												>{meeting.agenda}</span
											>
										</div>
									</div>
								</CardContent>
								<CardFooter class="flex justify-end space-x-2">
									<Button variant="outline" size="sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2"
											><line
												x1="12"
												x2="12"
												y1="5"
												y2="19"
											/><line
												x1="5"
												x2="19"
												y1="12"
												y2="12"
											/></svg
										>
										Add Notes
									</Button>
									<Button size="sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2"
											><path
												d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"
											/><circle
												cx="18"
												cy="18"
												r="3"
											/><path d="m22 22-1.5-1.5" /></svg
										>
										Join Meeting
									</Button>
								</CardFooter>
							</Card>
						{/each}
					</div>
				</TabsContent>

				<!-- Updates Tab -->
				<TabsContent value="updates" class="space-y-4">
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-xl font-semibold">
							Portfolio Company Updates
						</h3>
						<Select type="single">
							<SelectTrigger class="w-[180px]">
								Filter by company
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all"
									>All Companies</SelectItem
								>
								<SelectItem value="techflow"
									>TechFlow AI</SelectItem
								>
								<SelectItem value="healthnova"
									>HealthNova</SelectItem
								>
								<SelectItem value="finleap">FinLeap</SelectItem>
								<SelectItem value="greenscale"
									>GreenScale</SelectItem
								>
							</SelectContent>
						</Select>
					</div>

					{#each updates as update}
						<Card class={update.read ? "opacity-75" : ""}>
							<CardHeader>
								<div class="flex justify-between">
									<CardTitle>{update.title}</CardTitle>
									{#if !update.read}
										<Badge variant="destructive">New</Badge>
									{/if}
								</div>
								<CardDescription>
									{update.company} • {update.date}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div class="grid grid-cols-4 gap-4 mb-4">
									<div class="border rounded p-3 text-center">
										<p
											class="text-sm text-muted-foreground"
										>
											Revenue
										</p>
										<p class="font-bold">
											{update.metrics.revenue}
										</p>
									</div>
									<div class="border rounded p-3 text-center">
										<p
											class="text-sm text-muted-foreground"
										>
											Users
										</p>
										<p class="font-bold">
											{update.metrics.users}
										</p>
									</div>
									<div class="border rounded p-3 text-center">
										<p
											class="text-sm text-muted-foreground"
										>
											Burn
										</p>
										<p class="font-bold">
											{update.metrics.burn}
										</p>
									</div>
									<div class="border rounded p-3 text-center">
										<p
											class="text-sm text-muted-foreground"
										>
											Runway
										</p>
										<p class="font-bold">
											{update.metrics.runway}
										</p>
									</div>
								</div>

								<div class="mb-4">
									<h4 class="font-medium mb-2">Highlights</h4>
									<ul class="list-disc list-inside space-y-1">
										{#each update.highlights as highlight}
											<li class="text-sm">{highlight}</li>
										{/each}
									</ul>
								</div>

								<div>
									<h4 class="font-medium mb-2">Challenges</h4>
									<ul class="list-disc list-inside space-y-1">
										{#each update.challenges as challenge}
											<li class="text-sm">{challenge}</li>
										{/each}
									</ul>
								</div>
							</CardContent>
							<CardFooter class="flex justify-end space-x-2">
								{#if !update.read}
									<Button
										variant="outline"
										size="sm"
										onclick={() =>
											markUpdateAsRead(update.id)}
									>
										Mark as Read
									</Button>
								{/if}
								<Button size="sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2"
										><path
											d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
										/></svg
									>
									Provide Feedback
								</Button>
							</CardFooter>
						</Card>
					{/each}
				</TabsContent>

				<!-- Notes Tab -->
				<TabsContent value="notes" class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<!-- Create Note Form -->
						<div class="md:col-span-1">
							<Card>
								<CardHeader>
									<CardTitle>Add Note</CardTitle>
									<CardDescription
										>Create collaborative notes about
										portfolio companies</CardDescription
									>
								</CardHeader>
								<CardContent>
									<form class="space-y-4">
										<div class="space-y-2">
											<label
												class="text-sm font-medium"
												for="company">Company</label
											>
											<Select type="single">
												<SelectTrigger>
													Select company
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="techflow"
														>TechFlow AI</SelectItem
													>
													<SelectItem
														value="healthnova"
														>HealthNova</SelectItem
													>
													<SelectItem value="finleap"
														>FinLeap</SelectItem
													>
													<SelectItem
														value="greenscale"
														>GreenScale</SelectItem
													>
												</SelectContent>
											</Select>
										</div>

										<div class="space-y-2">
											<label
												class="text-sm font-medium"
												for="title">Title</label
											>
											<Input
												id="title"
												bind:value={newNote.title}
												placeholder="Note title"
											/>
										</div>

										<div class="space-y-2">
											<label
												class="text-sm font-medium"
												for="content">Content</label
											>
											<Textarea
												id="content"
												bind:value={newNote.content}
												placeholder="Your notes..."
												rows={6}
											/>
										</div>

										<div class="space-y-2">
											<label
												class="text-sm font-medium"
												for="tags">Tags</label
											>
											<Input
												id="tags"
												bind:value={newNote.tags}
												placeholder="Separate tags with commas"
											/>
											<p
												class="text-xs text-muted-foreground"
											>
												Example: Strategy, Product, Team
											</p>
										</div>
									</form>
								</CardContent>
								<CardFooter>
									<Button class="w-full" onclick={saveNote}
										>Save Note</Button
									>
								</CardFooter>
							</Card>
						</div>

						<!-- Notes List -->
						<div class="md:col-span-2">
							<div class="flex justify-between items-center mb-4">
								<h3 class="text-xl font-semibold">
									Collaboration Notes
								</h3>
								<div class="flex items-center space-x-2">
									<Select type="single">
										<SelectTrigger class="w-[180px]">
											Filter by company
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all"
												>All Companies</SelectItem
											>
											<SelectItem value="techflow"
												>TechFlow AI</SelectItem
											>
											<SelectItem value="healthnova"
												>HealthNova</SelectItem
											>
											<SelectItem value="finleap"
												>FinLeap</SelectItem
											>
											<SelectItem value="greenscale"
												>GreenScale</SelectItem
											>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div class="space-y-4">
								{#each notes as note}
									<Card>
										<CardHeader>
											<div
												class="flex justify-between items-center"
											>
												<CardTitle
													>{note.title}</CardTitle
												>
												<span
													class="text-sm text-muted-foreground"
													>{note.date}</span
												>
											</div>
											<CardDescription
												>{note.company}</CardDescription
											>
										</CardHeader>
										<CardContent>
											<p class="text-sm">
												{note.content}
											</p>
											<div
												class="flex flex-wrap gap-2 mt-4"
											>
												{#each note.tags as tag}
													<Badge variant="outline"
														>{tag}</Badge
													>
												{/each}
											</div>
										</CardContent>
										<CardFooter
											class="flex justify-end space-x-2"
										>
											<Button variant="outline" size="sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="mr-2"
													><path
														d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
													/><path
														d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
													/></svg
												>
												Edit
											</Button>
											<Button variant="outline" size="sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="mr-2"
													><path
														d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
													/><polyline
														points="16 6 12 2 8 6"
													/><line
														x1="12"
														x2="12"
														y1="2"
														y2="15"
													/></svg
												>
												Share
											</Button>
										</CardFooter>
									</Card>
								{/each}
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
</div>
