<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Input } from "$lib/components/ui/input";
	import { Select } from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";

	const dispatch = createEventDispatcher();

	interface Props {
		formData: any;
	}

	let { formData }: Props = $props();

	let localData = $state({
		foundedYear: formData.foundedYear || "",
		teamSize: formData.teamSize || "",
		linkedinUrl: formData.linkedinUrl || "",
		twitterHandle: formData.twitterHandle || "",
		teamMembers: formData.teamMembers || [],
	});

	let newMember = $state({
		name: "",
		title: "",
		email: "",
		role: "",
	});

	function addTeamMember() {
		if (newMember.name && newMember.title) {
			localData.teamMembers = [
				...localData.teamMembers,
				{ ...newMember },
			];
			newMember = { name: "", title: "", email: "", role: "" };
		}
	}

	function removeTeamMember(index: number) {
		localData.teamMembers = localData.teamMembers.filter(
			(_, i) => i !== index,
		);
	}

	function handleSubmit() {
		dispatch("updateFormData", localData);
		dispatch("next");
	}

	$effect(() => {
		if (formData) {
			localData = {
				foundedYear: formData.foundedYear || "",
				teamSize: formData.teamSize || "",
				linkedinUrl: formData.linkedinUrl || "",
				twitterHandle: formData.twitterHandle || "",
				teamMembers: formData.teamMembers || [],
			};
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold mb-2">Team Information</h2>
		<p class="text-muted-foreground">
			Tell us about your team's background and structure
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Founded Year -->
		<div>
			<label for="foundedYear" class="block text-sm font-medium mb-2">
				Founded Year
			</label>
			<Input
				id="foundedYear"
				bind:value={localData.foundedYear}
				placeholder="e.g., 2020"
				type="number"
				min="1900"
				max={new Date().getFullYear()}
			/>
		</div>

		<!-- Team Size -->
		<div>
			<label for="teamSize" class="block text-sm font-medium mb-2">
				Team Size
			</label>
			<Select
				id="teamSize"
				bind:value={localData.teamSize}
				options={[
					{ value: "1-5", label: "1-5 people" },
					{ value: "6-20", label: "6-20 people" },
					{ value: "21-50", label: "21-50 people" },
					{ value: "50+", label: "50+ people" },
				]}
				placeholder="Select team size"
			/>
		</div>

		<!-- LinkedIn URL -->
		<div>
			<label for="linkedinUrl" class="block text-sm font-medium mb-2">
				LinkedIn Company Page
			</label>
			<Input
				id="linkedinUrl"
				bind:value={localData.linkedinUrl}
				placeholder="https://linkedin.com/company/yourcompany"
				type="url"
			/>
		</div>

		<!-- Twitter Handle -->
		<div>
			<label for="twitterHandle" class="block text-sm font-medium mb-2">
				Twitter Handle
			</label>
			<Input
				id="twitterHandle"
				bind:value={localData.twitterHandle}
				placeholder="@yourcompany"
			/>
		</div>
	</div>

	<!-- Team Members Section -->
	<div class="space-y-4">
		<div>
			<h3 class="text-lg font-medium mb-2">Key Team Members</h3>
			<p class="text-sm text-muted-foreground mb-4">
				Add key team members who will be involved in investment
				decisions
			</p>
		</div>

		<!-- Add New Member Form -->
		<Card class="p-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
				<Input bind:value={newMember.name} placeholder="Full Name" />
				<Input bind:value={newMember.title} placeholder="Job Title" />
				<Input
					bind:value={newMember.email}
					placeholder="Email"
					type="email"
				/>
				<Select
					bind:value={newMember.role}
					options={[
						{ value: "partner", label: "Partner" },
						{ value: "analyst", label: "Analyst" },
						{ value: "associate", label: "Associate" },
						{ value: "other", label: "Other" },
					]}
					placeholder="Role"
				/>
			</div>
			<Button onclick={addTeamMember} size="sm" class="w-full md:w-auto">
				Add Team Member
			</Button>
		</Card>

		<!-- Team Members List -->
		{#if localData.teamMembers.length > 0}
			<div class="space-y-3">
				<h4 class="font-medium">Current Team Members</h4>
				{#each localData.teamMembers as member, index}
					<Card class="p-4">
						<div class="flex justify-between items-center">
							<div
								class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1"
							>
								<div>
									<span class="text-sm font-medium"
										>{member.name}</span
									>
								</div>
								<div>
									<span class="text-sm text-muted-foreground"
										>{member.title}</span
									>
								</div>
								<div>
									<span class="text-sm text-muted-foreground"
										>{member.email}</span
									>
								</div>
								<div>
									<span
										class="text-sm text-muted-foreground capitalize"
										>{member.role}</span
									>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onclick={() => removeTeamMember(index)}
								class="ml-4"
							>
								Remove
							</Button>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Action Buttons -->
	<div class="flex justify-between pt-4">
		<Button variant="outline" onclick={() => dispatch("previous")}>
			Previous
		</Button>
		<Button onclick={handleSubmit}>Next Step</Button>
	</div>
</div>
