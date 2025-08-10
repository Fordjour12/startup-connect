<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import type { Note, NewNote } from "$lib/components/investor/types";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let notes = $state<Note[]>(data.notes || []);

	// Note creation
	let newNote = $state<NewNote>({
		company: "",
		title: "",
		content: "",
		tags: "",
	});

	// Filtering and Search
	let selectedCompanyFilter = $state<string>("all");
	let selectedTagFilter = $state<string>("all");
	let searchQuery = $state<string>("");

	// Tabs
	let activeTab = $state<string>("all");

	let allTags = $derived(() => {
		const tagSet = new Set<string>();
		notes.forEach((note) => {
			note.tags.forEach((tag) => tagSet.add(tag));
		});
		return Array.from(tagSet).sort();
	});

	let filteredNotes = $derived(() => {
		return notes.filter((note: Note) => {
			const companyMatch =
				selectedCompanyFilter === "all" ||
				note.company === selectedCompanyFilter;
			const tagMatch =
				selectedTagFilter === "all" ||
				note.tags.includes(selectedTagFilter);
			const searchMatch =
				searchQuery === "" ||
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.content.toLowerCase().includes(searchQuery.toLowerCase());

			if (activeTab === "recent") {
				const sevenDaysAgo = new Date();
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

				let noteDate: Date;
				if (typeof note.date === "string") {
					noteDate = new Date(note.date);
				} else if (note.date instanceof Date) {
					noteDate = note.date;
				} else {
					// This case should ideally not be hit if Note.date is string | Date
					// and data from server is consistent.
					noteDate = new Date(String(note.date)); // Attempt conversion from unknown
				}
				return (
					companyMatch &&
					tagMatch &&
					searchMatch &&
					!isNaN(noteDate.getTime()) &&
					noteDate >= sevenDaysAgo
				);
			}
			return companyMatch && tagMatch && searchMatch;
		});
	});

	function saveNote() {
		if (!newNote.company || !newNote.title || !newNote.content) {
			alert("Company, Title, and Content are required.");
			return;
		}
		const newId =
			notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
		const processedTags = newNote.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag);

		notes = [
			{
				id: newId,
				company: newNote.company,
				date: new Date().toISOString().split("T")[0], // Store as YYYY-MM-DD
				title: newNote.title,
				content: newNote.content,
				tags: processedTags,
			},
			...notes,
		];
		newNote = { company: "", title: "", content: "", tags: "" };
	}

	function formatDate(dateInput: string | Date): string {
		const date =
			typeof dateInput === "string" ? new Date(dateInput) : dateInput;
		if (isNaN(date.getTime())) return "Invalid Date";
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}

	// Props for Select component to ensure string type for value
	interface SelectProps {
		value?: string;
		onValueChange?: (value: string | undefined) => void;
	}
</script>

<div
	class="flex flex-col p-4 md:p-6 lg:p-8 gap-6 h-[calc(100vh-var(--header-height,80px))]"
>
	<header class="flex-shrink-0">
		<h1 class="text-3xl font-bold tracking-tight">Investor Notes</h1>
		<p class="text-muted-foreground">
			Manage and organize collaborative notes about your portfolio
			companies.
		</p>
	</header>

	<div class="grid grid-cols-12 gap-6 flex-1 min-h-0">
		<!-- Sidebar -->
		<aside
			class="col-span-12 md:col-span-5 flex flex-col space-y-6 overflow-y-auto pr-2 scrollbar-thin"
		>
			<Card>
				<CardHeader class="pb-3">
					<CardTitle>Search & Filter</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
						>
							<path
								fill-rule="evenodd"
								d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
								clip-rule="evenodd"
							/>
						</svg>
						<Input
							type="search"
							placeholder="Search notes..."
							class="pl-10"
							bind:value={searchQuery}
						/>
					</div>
					<div class="space-y-1.5">
						<Label class="text-sm font-medium">Company</Label>
						<Select
							type="single"
							{...{
								value: selectedCompanyFilter,
								onValueChange: (v) =>
									(selectedCompanyFilter = v || "all"),
							} as SelectProps}
						>
							<SelectTrigger class="w-full">
								{selectedCompanyFilter === "all"
									? "Filter by company"
									: notes.find(
											(n) =>
												n.company ===
												selectedCompanyFilter,
										)?.company || "Filter by company"}
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all"
									>All Companies</SelectItem
								>
								<SelectItem value="TechFlow AI"
									>TechFlow AI</SelectItem
								>
								<SelectItem value="HealthNova"
									>HealthNova</SelectItem
								>
								<SelectItem value="FinLeap">FinLeap</SelectItem>
								<SelectItem value="GreenScale"
									>GreenScale</SelectItem
								>
							</SelectContent>
						</Select>
					</div>
					{#if allTags.length > 0}
						<div class="space-y-1.5">
							<Label class="text-sm font-medium">Tag</Label>
							<Select
								type="single"
								{...{
									value: selectedTagFilter,
									onValueChange: (v) =>
										(selectedTagFilter = v || "all"),
								} as SelectProps}
							>
								<SelectTrigger class="w-full">
									{selectedTagFilter === "all"
										? "Filter by tag"
										: selectedTagFilter}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Tags</SelectItem
									>
									{#each allTags as tag (tag)}
										<SelectItem value={tag}
											>{tag}</SelectItem
										>
									{/each}
								</SelectContent>
							</Select>
						</div>
					{/if}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Add New Note</CardTitle>
				</CardHeader>
				<CardContent>
					<!-- on:submit|preventDefault={saveNote} -->
					<form class="space-y-4">
						<div class="space-y-1.5">
							<label class="text-sm font-medium" for="new-company"
								>Company</label
							>
							<Select
								type="single"
								{...{
									value: newNote.company,
									onValueChange: (v) =>
										(newNote.company = v || ""),
								} as SelectProps}
								required
							>
								<SelectTrigger id="new-company" class="w-full">
									{newNote.company || "Select company"}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TechFlow AI"
										>TechFlow AI</SelectItem
									>
									<SelectItem value="HealthNova"
										>HealthNova</SelectItem
									>
									<SelectItem value="FinLeap"
										>FinLeap</SelectItem
									>
									<SelectItem value="GreenScale"
										>GreenScale</SelectItem
									>
								</SelectContent>
							</Select>
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium" for="new-title"
								>Title</label
							>
							<Input
								id="new-title"
								bind:value={newNote.title}
								placeholder="Note title"
								required
							/>
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium" for="new-content"
								>Content</label
							>
							<Textarea
								id="new-content"
								bind:value={newNote.content}
								placeholder="Your notes..."
								rows={4}
								required
							/>
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium" for="new-tags"
								>Tags</label
							>
							<Input
								id="new-tags"
								bind:value={newNote.tags}
								placeholder="Comma-separated tags"
							/>
							<p class="text-xs text-muted-foreground">
								e.g., Strategy, Product, Q3
							</p>
						</div>
						<Button type="submit" class="w-full">Save Note</Button>
					</form>
				</CardContent>
			</Card>
		</aside>

		<!-- Main Content -->
		<main class="col-span-12 md:col-span-7 flex flex-col min-h-0">
			<div class="flex-shrink-0 mb-4">
				<Tabs bind:value={activeTab} class="w-full">
					<TabsList>
						<TabsTrigger value="all">All Notes</TabsTrigger>
						<TabsTrigger value="recent">Recent (7 days)</TabsTrigger
						>
					</TabsList>
				</Tabs>
			</div>

			{#if filteredNotes.length === 0}
				<div
					class="flex-1 flex flex-col items-center justify-center text-center p-10 bg-background rounded-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-16 h-16 text-muted-foreground mb-4"
					>
						<path
							d="M11.25 4.533A9.709 9.709 0 0 0 3.75 12a9.709 9.709 0 0 0 7.5 7.467V15A3 3 0 0 1 9 12.101V12a3 3 0 0 1 2.25-2.867V4.533ZM12.75 4.533V9.133A3.001 3.001 0 0 1 15 12v.101A3 3 0 0 1 12.75 15v4.467A9.709 9.709 0 0 0 20.25 12a9.709 9.709 0 0 0-7.5-7.467Z"
						/>
						<path
							fill-rule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM11.25 15a.75.75 0 0 0 1.5 0v-2.648l.053-.005a1.5 1.5 0 0 0 0-2.99L12.75 9.35V6.75a.75.75 0 0 0-1.5 0v2.648l-.053.005a1.5 1.5 0 0 0 0 2.99l.053.004V15Z"
							clip-rule="evenodd"
						/>
					</svg>
					<h3 class="text-xl font-semibold mb-1">No Notes Found</h3>
					<p class="text-muted-foreground">
						Try adjusting your search or filters, or add a new note.
					</p>
				</div>
			{:else}
				<div
					class="flex-1 space-y-4 overflow-y-auto pr-2 pb-4 scrollbar-thin"
				>
					{#each filteredNotes as note (note.id)}
						<Card class="transition-all hover:shadow-lg">
							<CardHeader>
								<div
									class="flex justify-between items-start gap-2"
								>
									<div>
										<CardTitle class="text-lg"
											>{note.title}</CardTitle
										>
										<CardDescription
											class="text-xs text-muted-foreground mt-1"
										>
											<span
												class="font-medium text-foreground"
												>{note.company}</span
											>
											&bull; {formatDate(note.date)}
										</CardDescription>
									</div>
									<div class="flex-shrink-0 flex gap-1">
										<Button
											variant="ghost"
											size="icon"
											class="h-7 w-7"
											aria-label="Edit note"
											title="Edit note"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="w-4 h-4"
											>
												<path
													d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z"
												/>
											</svg>
										</Button>
										<!-- Add Share button/functionality if needed -->
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p
									class="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3"
								>
									{note.content}
								</p>
								{#if note.tags.length > 0}
									<div class="flex flex-wrap gap-1.5 mt-3">
										{#each note.tags as tag (tag)}
											<Badge
												variant="secondary"
												class="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
												onclick={() => {
													selectedTagFilter = tag;
													activeTab = "all";
												}}
											>
												{tag}
											</Badge>
										{/each}
									</div>
								{/if}
							</CardContent>
						</Card>
					{/each}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	/* For a thin scrollbar, if desired */
	.scrollbar-thin::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.scrollbar-thin::-webkit-scrollbar-track {
		background: transparent;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: hsl(var(--border));
		border-radius: 3px;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--ring));
	}
	/* Ensure header height is accounted for in full-height calc if you have a global fixed header */
	/* :global(:root) {
    --header-height: 60px; 
  } */
</style>
