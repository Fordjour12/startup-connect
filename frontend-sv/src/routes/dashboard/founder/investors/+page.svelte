<script lang="ts">
	import SendPitchModal from "@/components/SendPitchModal.svelte";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "@/components/ui/avatar";
	import { Badge } from "@/components/ui/badge";
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Input } from "@/components/ui/input";
	import type { InvestorDetails, Investors } from "@/types/Investor";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";
    import LetterA from "@tabler/icons-svelte/icons/letter-a";

	// Get data from SSR load function
	let { data }: { data: PageData } = $props();

	// Initialize with SSR data
	 let investorsData: Investors = $state(data.investors);
	
	let searchQuery = $state("");
	let selectedInvestor: InvestorDetails | null = $state(null);
	let isPitchModalOpen = $state(false);

	let investors: InvestorDetails[] = $derived(investorsData.investors);
	let filteredInvestors: InvestorDetails[] = $derived(investors);


	// Client-side refresh function (optional)
	/*async function loadInvestors() {
		try {
			isLoading = true;
			error = null;

			// const response = await fetch(`${endpoints.investors}`, {
			// 	credentials: "include",
			// });

			// if (!response.ok) {
			// 	throw new Error("Failed to load investors");
			// }

			// const newInvestors = await response.json();
			// investors = newInvestors;
			// filteredInvestors = newInvestors;
		} catch (err) {
			console.error("Failed to load investors:", err);
			error =
				err instanceof Error ? err.message : "Failed to load investors";
			toast.error("Failed to load investors");
		} finally {
			isLoading = false;
		}
	}

	function handleSearch() {
		if (!searchQuery.trim()) {
			filteredInvestors = investors;
			return;
		}

		const query = searchQuery.toLowerCase();
		filteredInvestors = investors.filter(
			(investor) =>
				investor.name.toLowerCase().includes(query) ||
				investor.company?.toLowerCase().includes(query) ||
				investor.investment_focus?.some((focus) =>
					focus.toLowerCase().includes(query),
				) ||
				investor.location?.toLowerCase().includes(query),
		);
	}*/

	function openPitchModal(investor: InvestorDetails) {
		selectedInvestor = investor;
		isPitchModalOpen = true;
	}

	function closePitchModal() {
		isPitchModalOpen = false;
		selectedInvestor = null;
	}

	function handlePitchSuccess() {
		toast.success("Pitch sent successfully!");
		closePitchModal();
	}

	function formatInvestmentRange(min?: number, max?: number): string {
		if (!min && !max) return "Not specified";
		if (min && max)
			return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
		if (min) return `$${min.toLocaleString()}+`;
		if (max) return `Up to $${max.toLocaleString()}`;
		return "Not specified";
	}

	// function getInitials(name: string): string {
	// 	return name
	// 		.split(" ")
	// 		.map((n) => n[0])
	// 		.join("")
	// 		.toUpperCase()
	// 		.slice(0, 2);
	// }

	// Watch search query changes
	/*$effect(() => {
		if (searchQuery !== undefined) {
			handleSearch();
		}
	});*/
</script>

<svelte:head>
	<title>Find Investors - StartupConnect</title>
	<meta
		name="description"
		content="Browse and connect with investors for your startup"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Find Investors</h1>
			<p class="text-muted-foreground">
				Connect with investors who are interested in your industry
			</p>
		</div>
		<!-- <Button onclick={loadInvestors} variant="outline">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 mr-2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
				/>
			</svg>
			Refresh
		</Button> -->
	</div>

	<!-- Search Bar -->
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				bind:value={searchQuery}
				placeholder="Search by name, company, focus area, or location..."
				class="w-full"
			/>
		</div>
	</div>

	<!-- {#if error}
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12 text-destructive mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="text-lg font-semibold mb-2">
					Failed to Load Investors
				</h3>
				<p class="text-muted-foreground mb-4 text-center">{error}</p>
				<Button onclick={loadInvestors}>Try Again</Button>
			</CardContent>
		</Card> -->
	<!--{#if filteredInvestors.length === 0}
		<Card>
			<CardContent
				class="flex flex-col items-center justify-center py-12"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12 text-muted-foreground mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<h3 class="text-lg font-semibold mb-2">
					{searchQuery
						? "No investors found"
						: "No investors available"}
				</h3>
				<p class="text-muted-foreground mb-4 text-center">
					{searchQuery
						? "Try adjusting your search criteria to find more investors."
						: "There are no investors available at the moment. Check back later!"}
				</p>
				{#if searchQuery}
					<Button
						onclick={() => (searchQuery = "")}
						variant="outline"
					>
						Clear Search
					</Button>
				{/if}
			</CardContent>
		</Card>
	{/if} -->
	{#if filteredInvestors.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredInvestors as investor (investor.id)}
				<Card class="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div class="flex items-center gap-3">
							<Avatar class="h-12 w-12">
								<AvatarImage
									src={investor.profile_picture}
									alt={investor.name}
								/>
								<AvatarFallback>
									{investor.name}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle class="text-lg"
									>{investor.name}</CardTitle
								>
								<CardDescription>
									{investor.company || "Independent Investor"}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent class="space-y-4">
						{#if investor.bio}
							<p
								class="text-sm text-muted-foreground line-clamp-3"
							>
								{investor.bio}
							</p>
						{/if}

						{#if investor.investment_focus && investor.investment_focus.length > 0}
							<div>
								<h4 class="text-sm font-medium mb-2">
									Investment Focus
								</h4>
								<div class="flex flex-wrap gap-1">
									{#each investor.investment_focus.slice(0, 3) as focus}
										<Badge
											variant="secondary"
											class="text-xs"
										>
											{focus}
										</Badge>
									{/each}
									{#if investor.investment_focus.length > 3}
										<Badge
											variant="outline"
											class="text-xs"
										>
											+{investor.investment_focus.length -
												3} more
										</Badge>
									{/if}
								</div>
							</div>
						{/if}

						<div>
							<h4 class="text-sm font-medium mb-1">
								Investment Range
							</h4>
							<p class="text-sm text-muted-foreground">
								{formatInvestmentRange(
									investor.min_investment,
									investor.max_investment,
								)}
							</p>
						</div>

						{#if investor.location}
							<div
								class="flex items-center gap-2 text-sm text-muted-foreground"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								{investor.location}
							</div>
						{/if}

						<div class="flex gap-2 pt-2">
							<Button
								href="/dashboard/founder/investors/{investor.id}"
								variant="outline"
								size="sm"
								class="flex-1"
							>
								View Profile
							</Button>
							<Button
								onclick={() => openPitchModal(investor)}
								size="sm"
								class="flex-1"
							>
								Send Pitch
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}
</div>

<!-- Pitch Modal -->
{#if selectedInvestor}
	<SendPitchModal
		investorId={selectedInvestor.id}
		investorName={selectedInvestor.name}
		bind:isOpen={isPitchModalOpen}
		onClose={closePitchModal}
		onSuccess={handlePitchSuccess}
	/>
{/if}
