<script lang="ts">
	// import { page } from "$app/stores";
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
	import { Separator } from "@/components/ui/separator";
	// import { endpoints } from "$lib/endpoints";
	import type { InvestorDetailById } from "@/types/Investor";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let investor: InvestorDetailById = $state(data.investor);
	// let isLoading = $state(true);
	// let error = $state<string | null>(null);
	let isPitchModalOpen = $state(false);

	// const investorId = $derived($page.params.id);

	// $effect(async () => {
	// 	if (investorId) {
	// 		await loadInvestor();
	// 	}
	// });

	// async function loadInvestor() {
	// 	try {
	// 		isLoading = true;
	// 		error = null;

	// const response = await fetch(
	// 	`${endpoints.investors}/${investorId}`,
	// 	{
	// 		credentials: "include",
	// 	},
	// );

	// if (!response.ok) {
	// 	if (response.status === 404) {
	// 		throw new Error("Investor not found");
	// 	}
	// 	throw new Error("Failed to load investor details");
	// }

	// investor = await response.json();
	// 	} catch (err) {
	// 		console.error("Failed to load investor:", err);
	// 		error =
	// 			err instanceof Error ? err.message : "Failed to load investor";
	// 		toast.error("Failed to load investor details");
	// 	} finally {
	// 		isLoading = false;
	// 	}
	// }

	function openPitchModal() {
		isPitchModalOpen = true;
	}

	function closePitchModal() {
		isPitchModalOpen = false;
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
</script>

<svelte:head>
	<title
		>{investor?.name || investor?.firm_name || "Investor"} - StartupConnect</title
	>
	<meta
		name="description"
		content="View investor profile and send your pitch"
	/>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<!-- Back Button -->
	<div class="flex items-center gap-4">
		<Button href="/dashboard/founder/investors" variant="outline" size="sm">
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
					d="M15 19l-7-7 7-7"
				/>
			</svg>
			Back to Investors
		</Button>
	</div>

	{#if investor}
		<div class="space-y-6">
			<!-- Investor Header -->
			<Card>
				<CardHeader>
					<div class="flex items-start gap-6">
						<Avatar class="h-24 w-24">
							<AvatarImage
								src={investor.profile_picture}
								alt={investor.name || investor.firm_name}
							/>
							<AvatarFallback class="text-2xl">
								{(investor.name || investor.firm_name).split(
									" ",
								)[0][0]}
							</AvatarFallback>
						</Avatar>
						<div class="flex-1">
							<h1 class="text-3xl font-bold tracking-tight">
								{investor.name || investor.firm_name}
							</h1>
							<p class="text-xl text-muted-foreground mt-1">
								{investor.firm_name}
							</p>
							{#if investor.location}
								<div
									class="flex items-center gap-2 mt-2 text-muted-foreground"
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
						</div>
						<Button onclick={openPitchModal} size="lg">
							Send Pitch
						</Button>
					</div>
				</CardHeader>
			</Card>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Main Content -->
				<div class="lg:col-span-2 space-y-6">
					<!-- About -->
					{#if investor.bio}
						<Card>
							<CardHeader>
								<CardTitle>About</CardTitle>
							</CardHeader>
							<CardContent>
								<p
									class="text-muted-foreground leading-relaxed"
								>
									{investor.bio}
								</p>
							</CardContent>
						</Card>
					{/if}

					<!-- Investment Focus -->
					{#if investor.investment_focus && investor.investment_focus.length > 0}
						<Card>
							<CardHeader>
								<CardTitle>Investment Focus</CardTitle>
								<CardDescription>
									Industries and sectors this investor is
									interested in
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div class="flex flex-wrap gap-2">
									{#each investor.investment_focus as focus}
										<Badge variant="secondary">
											{focus}
										</Badge>
									{/each}
								</div>
							</CardContent>
						</Card>
					{/if}

					<!-- Investment Stages -->
					{#if investor.preferred_stages && investor.preferred_stages.length > 0}
						<Card>
							<CardHeader>
								<CardTitle>Investment Stages</CardTitle>
								<CardDescription>
									Startup stages this investor typically
									invests in
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div class="flex flex-wrap gap-2">
									{#each investor.preferred_stages as stage}
										<Badge variant="outline">
											{stage}
										</Badge>
									{/each}
								</div>
							</CardContent>
						</Card>
					{/if}
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Investment Details -->
					<Card>
						<CardHeader>
							<CardTitle>Investment Details</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
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
								<Separator />
								<div>
									<h4 class="text-sm font-medium mb-1">
										Location
									</h4>
									<p class="text-sm text-muted-foreground">
										{investor.location}
									</p>
								</div>
							{/if}
						</CardContent>
					</Card>

					<!-- Contact & Links -->
					<Card>
						<CardHeader>
							<CardTitle>Connect</CardTitle>
						</CardHeader>
						<CardContent class="space-y-3">
							{#if investor.website}
								<Button
									href={investor.website}
									target="_blank"
									variant="outline"
									class="w-full justify-start"
								>
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
											d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
										/>
									</svg>
									Website
								</Button>
							{/if}

							{#if investor.linkedin_url}
								<Button
									href={investor.linkedin_url}
									target="_blank"
									variant="outline"
									class="w-full justify-start"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 mr-2"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
										/>
									</svg>
									LinkedIn
								</Button>
							{/if}

							{#if investor.twitter_url}
								<Button
									href={investor.twitter_url}
									target="_blank"
									variant="outline"
									class="w-full justify-start"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 mr-2"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
										/>
									</svg>
									Twitter
								</Button>
							{/if}

							<Separator />

							<Button onclick={openPitchModal} class="w-full">
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
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
									/>
								</svg>
								Send Pitch
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Pitch Modal -->
<!-- {#if investor}
	<SendPitchModal
		investorId={investor.id}
		investorName={investor.name}
		bind:isOpen={isPitchModalOpen}
		onClose={closePitchModal}
		onSuccess={handlePitchSuccess}
	/>
{/if} -->
