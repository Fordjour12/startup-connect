<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Textarea } from "@/components/ui/textarea";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "@/components/ui/select";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "@/components/ui/tabs";
	import { Badge } from "@/components/ui/badge";
	import {
		Save,
		Plus,
		Edit,
		Trash2,
		MapPin,
		Globe,
		Briefcase,
		GraduationCap,
		Award,
		Star,
	} from "lucide-svelte";

	// Mock profile data
	let profileData = $state({
		personalInfo: {
			name: "Dr. Sarah Johnson",
			title: "Senior Business Strategy Consultant",
			bio: "Experienced business strategist with 15+ years helping startups scale and succeed.",
			location: "San Francisco, CA",
			languages: ["English", "Spanish"],
		},
		expertise: {
			primaryCategories: ["Business Strategy", "Marketing & Sales"],
			skills: [
				"Strategic Planning",
				"Market Analysis",
				"Go-to-Market Strategy",
			],
			experience: 15,
			certifications: ["Certified Business Strategy Professional"],
		},
		services: {
			pricing: { type: "hourly", amount: 150, currency: "USD" },
			availability: { timezone: "PST", responseTime: 4 },
		},
	});

	let isEditing = $state(false);
	let activeTab = $state("personal");

	function saveProfile() {
		console.log("Saving profile:", profileData);
		isEditing = false;
	}
</script>

<svelte:head>
	<title>Profile Management | Supporter Dashboard</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">
				Profile Management
			</h1>
			<p class="text-muted-foreground">
				Manage your profile and showcase your expertise
			</p>
		</div>
		<div class="flex items-center gap-2">
			{#if isEditing}
				<Button variant="outline" onclick={() => (isEditing = false)}
					>Cancel</Button
				>
				<Button onclick={() => saveProfile()}>
					<Save class="h-4 w-4 mr-2" />
					Save Changes
				</Button>
			{:else}
				<Button onclick={() => (isEditing = true)}>
					<Edit class="h-4 w-4 mr-2" />
					Edit Profile
				</Button>
			{/if}
		</div>
	</div>

	<Tabs bind:value={activeTab} class="space-y-6">
		<TabsList class="grid w-full grid-cols-6">
			<TabsTrigger value="personal">Personal</TabsTrigger>
			<TabsTrigger value="expertise">Expertise</TabsTrigger>
			<TabsTrigger value="services">Services</TabsTrigger>
			<TabsTrigger value="portfolio">Portfolio</TabsTrigger>
			<TabsTrigger value="credentials">Credentials</TabsTrigger>
			<TabsTrigger value="preferences">Preferences</TabsTrigger>
		</TabsList>

		<TabsContent value="personal" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<Label for="name">Full Name</Label>
							<Input
								id="name"
								bind:value={profileData.personalInfo.name}
								disabled={!isEditing}
							/>
						</div>
						<div class="space-y-2">
							<Label for="title">Professional Title</Label>
							<Input
								id="title"
								bind:value={profileData.personalInfo.title}
								disabled={!isEditing}
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="bio">Professional Bio</Label>
						<Textarea
							id="bio"
							bind:value={profileData.personalInfo.bio}
							rows={4}
							disabled={!isEditing}
						/>
					</div>

					<div class="space-y-2">
						<Label for="location">Location</Label>
						<Input
							id="location"
							bind:value={profileData.personalInfo.location}
							disabled={!isEditing}
						/>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="expertise" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Expertise & Skills</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="space-y-2">
						<Label>Primary Categories</Label>
						<div class="flex flex-wrap gap-2">
							{#each profileData.expertise.primaryCategories as category}
								<Badge variant="outline">{category}</Badge>
							{/each}
						</div>
					</div>

					<div class="space-y-2">
						<Label>Skills</Label>
						<div class="flex flex-wrap gap-2">
							{#each profileData.expertise.skills as skill}
								<Badge variant="secondary">{skill}</Badge>
							{/each}
						</div>
					</div>

					<div class="space-y-2">
						<Label for="experience">Years of Experience</Label>
						<Input
							id="experience"
							type="number"
							bind:value={profileData.expertise.experience}
							disabled={!isEditing}
						/>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="services" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Service Offerings</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="space-y-2">
							<Label>Pricing Type</Label>
							<Select
								bind:value={profileData.services.pricing.type}
								disabled={!isEditing}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="hourly"
										>Hourly Rate</SelectItem
									>
									<SelectItem value="project"
										>Project-Based</SelectItem
									>
									<SelectItem value="retainer"
										>Retainer</SelectItem
									>
								</SelectContent>
							</Select>
						</div>
						<div class="space-y-2">
							<Label>Amount</Label>
							<Input
								type="number"
								bind:value={profileData.services.pricing.amount}
								disabled={!isEditing}
							/>
						</div>
						<div class="space-y-2">
							<Label>Currency</Label>
							<Select
								bind:value={
									profileData.services.pricing.currency
								}
								disabled={!isEditing}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USD">USD ($)</SelectItem>
									<SelectItem value="EUR">EUR (€)</SelectItem>
									<SelectItem value="GBP">GBP (£)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="portfolio" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Portfolio</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						Portfolio content will be implemented here
					</p>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="credentials" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Credentials</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						Credentials content will be implemented here
					</p>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="preferences" class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground">
						Preferences content will be implemented here
					</p>
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>
