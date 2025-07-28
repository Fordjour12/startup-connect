<script lang="ts">
	import { onboardingState } from "@/hooks/onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Badge } from "@/components/ui/badge";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Textarea } from "@/components/ui/textarea";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "@/components/ui/select";
	import { Check, Plus, X } from "@lucide/svelte";
	import { cn } from "@/utils";

	// Common skills by category
	const skillCategories = {
		technical: [
			"JavaScript",
			"TypeScript",
			"React",
			"Vue",
			"Angular",
			"Node.js",
			"Python",
			"Java",
			"C++",
			"C#",
			"Go",
			"Rust",
			"PHP",
			"Ruby",
			"Swift",
			"Kotlin",
			"Flutter",
			"React Native",
			"AWS",
			"Azure",
			"GCP",
			"Docker",
			"Kubernetes",
			"Machine Learning",
			"AI",
			"Data Science",
			"DevOps",
			"Cybersecurity",
			"Blockchain",
			"Mobile Development",
		],
		business: [
			"Business Development",
			"Sales",
			"Marketing",
			"Digital Marketing",
			"SEO",
			"Content Marketing",
			"Social Media",
			"Product Management",
			"Project Management",
			"Strategy",
			"Operations",
			"Finance",
			"Accounting",
			"Legal",
			"Human Resources",
			"Customer Success",
			"Partnerships",
			"Investor Relations",
			"Fundraising",
		],
		design: [
			"UI/UX Design",
			"Graphic Design",
			"Product Design",
			"Brand Design",
			"Web Design",
			"Mobile Design",
			"Illustration",
			"Animation",
			"Video Editing",
			"3D Modeling",
			"Prototyping",
			"User Research",
		],
		other: [
			"Leadership",
			"Team Building",
			"Communication",
			"Public Speaking",
			"Writing",
			"Research",
			"Analytics",
			"Data Analysis",
			"Consulting",
			"Mentoring",
			"Coaching",
			"Event Planning",
			"Community Building",
		],
	};

	let newSkill = $state("");

	// Get current skills directly from onboarding state without $derived
	function getCurrentSkills() {
		return onboardingState.formData.skills || [];
	}

	// Get current industries directly from onboarding state without $derived
	function getCurrentIndustries() {
		return onboardingState.formData.industries || [];
	}

	function toggleIndustry(industry: string) {
		const currentIndustries = getCurrentIndustries();
		const newIndustries = currentIndustries.includes(industry)
			? currentIndustries.filter((i) => i !== industry)
			: [...currentIndustries, industry];

		onboardingState.updateFormData({
			industries: newIndustries,
		});
	}

	function addSkill() {
		const currentSkills = getCurrentSkills();
		if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
			onboardingState.updateFormData({
				skills: [...currentSkills, newSkill.trim()],
			});
			newSkill = "";
		}
	}

	function removeSkill(skill: string) {
		const currentSkills = getCurrentSkills();
		onboardingState.updateFormData({
			skills: currentSkills.filter((s) => s !== skill),
		});
	}

	function addPresetSkill(skill: string) {
		const currentSkills = getCurrentSkills();
		if (!currentSkills.includes(skill)) {
			onboardingState.updateFormData({
				skills: [...currentSkills, skill],
			});
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			addSkill();
		}
	}

	// Validation logic
	let isValid = $derived(() => {
		const skills = getCurrentSkills();
		const industries = getCurrentIndustries();
		const experienceLevel = onboardingState.formData.experienceLevel;

		return (
			skills.length > 0 &&
			industries.length > 0 &&
			experienceLevel &&
			["beginner", "intermediate", "expert"].includes(experienceLevel)
		);
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center space-y-2">
		<h1 class="text-3xl font-bold">Skills & Expertise</h1>
		<p class="text-muted-foreground">
			What skills and expertise do you bring to the table? This helps us
			connect you with the right opportunities.
		</p>
	</div>

	<!-- Current Skills Display -->
	{#if getCurrentSkills().length > 0}
		<Card>
			<CardHeader>
				<CardTitle>Your Skills</CardTitle>
				<CardDescription>
					You've added {getCurrentSkills().length} skill{getCurrentSkills()
						.length === 1
						? ""
						: "s"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-2">
					{#each getCurrentSkills() as skill}
						<Badge
							variant="secondary"
							class="flex items-center gap-1"
						>
							{skill}
							<button
								onclick={() => removeSkill(skill)}
								class="ml-1 hover:text-destructive transition-colors"
							>
								<X class="w-3 h-3" />
							</button>
						</Badge>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Add New Skill -->
	<Card>
		<CardHeader>
			<CardTitle>Add Your Skills</CardTitle>
			<CardDescription>
				Add your skills and expertise. You can type custom skills or
				select from common ones below.
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex gap-2">
				<Input
					placeholder="Type a skill (e.g., React, Marketing, UI/UX Design)"
					bind:value={newSkill}
					onkeypress={handleKeyPress}
					class="flex-1"
				/>
				<Button onclick={addSkill} disabled={!newSkill.trim()}>
					<Plus class="w-4 h-4 mr-2" />
					Add
				</Button>
			</div>
		</CardContent>
	</Card>

	<!-- Preset Skills by Category -->
	<Card>
		<CardHeader>
			<CardTitle>Common Skills</CardTitle>
			<CardDescription>
				Click on skills to add them to your profile
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-6">
			{#each Object.entries(skillCategories) as [category, skills]}
				<div class="space-y-3">
					<h3
						class="text-sm font-medium text-muted-foreground uppercase tracking-wide"
					>
						{category}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each skills as skill}
							<Button
								onclick={() => addPresetSkill(skill)}
								class={cn(
									"px-3 py-1 text-sm rounded-full border transition-colors",
									getCurrentSkills().includes(skill)
										? "bg-primary text-primary-foreground border-primary"
										: "bg-background text-foreground border-border hover:bg-muted",
								)}
								disabled={getCurrentSkills().includes(skill)}
							>
								{#if getCurrentSkills().includes(skill)}
									<Check class="w-3 h-3 mr-1 inline" />
								{/if}
								{skill}
							</Button>
						{/each}
					</div>
				</div>
			{/each}
		</CardContent>
	</Card>

	<!-- Experience Level -->
	<Card>
		<CardHeader>
			<CardTitle>Experience Level</CardTitle>
			<CardDescription>
				Tell us about your experience level and expertise areas
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="experience-level">Years of Experience</Label>
				<Select
					type="single"
					bind:value={onboardingState.formData.experienceLevel}
				>
					<SelectTrigger class="w-full">
						{onboardingState.formData.experienceLevel ||
							"Select experience level"}
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="beginner"
							>Beginner (0-2 years)</SelectItem
						>
						<SelectItem value="intermediate"
							>Intermediate (3-5 years)</SelectItem
						>
						<SelectItem value="expert">Expert (6+ years)</SelectItem
						>
					</SelectContent>
				</Select>
			</div>

			<div class="space-y-2">
				<Label for="industries">Industries</Label>
				<div class="flex flex-wrap gap-2">
					{#each ["Technology", "Healthcare", "Finance", "Education", "E-commerce", "Manufacturing", "Real Estate", "Entertainment", "Transportation", "Energy", "Food & Beverage", "Fashion", "Sports", "Media", "Non-profit"] as industry}
						<Button
							onclick={() => toggleIndustry(industry)}
							variant={getCurrentIndustries().includes(industry)
								? "default"
								: "outline"}
							size="sm"
						>
							{industry}
						</Button>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<Label for="expertise-areas">Areas of Expertise</Label>
				<Textarea
					id="expertise-areas"
					placeholder="Describe your areas of expertise, specializations, or unique skills..."
					bind:value={onboardingState.formData.expertiseAreas}
					rows={3}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Certifications & Achievements -->
	<Card>
		<CardHeader>
			<CardTitle>Certifications & Achievements</CardTitle>
			<CardDescription>
				Add any relevant certifications, awards, or notable achievements
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Textarea
				placeholder="List your certifications, awards, publications, or other notable achievements..."
				bind:value={onboardingState.formData.certifications}
				rows={4}
			/>
		</CardContent>
	</Card>
</div>
