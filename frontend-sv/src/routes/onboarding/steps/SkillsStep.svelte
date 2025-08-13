<script lang="ts">
    import { Button } from "@/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Badge } from "@/components/ui/badge";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import {
        Award,
        Code,
        TrendingUp,
        Plus,
        X,
        Star,
        Target,
        Briefcase,
    } from "@lucide/svelte";

    interface SkillsFormData {
        skills: string[];
        experienceLevel: string;
        industries: string[];
        achievements: string;
        expertiseAreas: string;
        certifications: string;
    }

    interface OnboardingData {
        formData: {
            skills?: SkillsFormData;
            role: string;
        };
        updateFormData: (data: { skills: SkillsFormData }) => void;
        markStepComplete: (step: string) => void;
        goNext: () => Promise<void>;
    }

    interface Props {
        onboarding: OnboardingData;
    }

    let { onboarding }: Props = $props();

    // Form data binding
    let formData = $state<SkillsFormData>({
        skills: onboarding.formData.skills?.skills || [],
        experienceLevel: onboarding.formData.skills?.experienceLevel || "",
        industries: onboarding.formData.skills?.industries || [],
        achievements: onboarding.formData.skills?.achievements || "",
        expertiseAreas: onboarding.formData.skills?.expertiseAreas || "",
        certifications: onboarding.formData.skills?.certifications || "",
    });

    // Input states for tag inputs
    let skillInput = $state("");
    let industryInput = $state("");

    // Validation errors
    let errors = $state<Record<string, string>>({});

    // Form validation - derived value for form validity
    let isFormValid = $derived(Object.keys(errors).length === 0);

    // Effect to update validation errors when form data changes
    $effect(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.experienceLevel) {
            newErrors.experienceLevel = "Please select your experience level";
        }

        if (formData.skills.length === 0) {
            newErrors.skills = "Please add at least one skill";
        }

        errors = newErrors;
    });

    // Function to validate form (for explicit validation calls)
    function validateForm(): boolean {
        return isFormValid;
    }

    // Current role for context
    const currentRole = onboarding.formData.role;

    // Experience level options
    const experienceLevels = [
        {
            value: "beginner",
            label: "Beginner",
            description: "New to the field, learning fundamentals",
            icon: "🌱",
        },
        {
            value: "intermediate",
            label: "Intermediate",
            description: "Some experience, comfortable with basics",
            icon: "🌿",
        },
        {
            value: "expert",
            label: "Expert",
            description: "Extensive experience, recognized expertise",
            icon: "🌳",
        },
    ] as const;

    type ExperienceLevel = (typeof experienceLevels)[number]["value"];

    // Suggested skills based on role
    const suggestedSkills: Record<string, string[]> = {
        FOUNDER: [
            "Leadership",
            "Strategic Planning",
            "Product Management",
            "Team Building",
            "Fundraising",
            "Business Development",
            "Marketing",
            "Sales",
            "Financial Management",
            "Operations",
            "Customer Development",
            "Pitching",
            "Networking",
            "Problem Solving",
            "Decision Making",
            "Communication",
        ],
        INVESTOR: [
            "Due Diligence",
            "Financial Analysis",
            "Market Research",
            "Risk Assessment",
            "Portfolio Management",
            "Valuation",
            "Deal Sourcing",
            "Negotiation",
            "Strategic Advisory",
            "Industry Expertise",
            "Network Building",
            "Exit Planning",
            "Board Governance",
            "Mentoring",
            "Trend Analysis",
            "Investment Strategy",
        ],
        SUPPORT: [
            "Consulting",
            "Project Management",
            "Strategic Advisory",
            "Technical Expertise",
            "Marketing Strategy",
            "Sales Development",
            "Operations Optimization",
            "Financial Planning",
            "Legal Advisory",
            "HR & Recruitment",
            "Design & UX",
            "Software Development",
            "Data Analysis",
            "Business Analysis",
            "Training & Development",
            "Process Improvement",
        ],
    };

    // Common technical skills
    const technicalSkills = [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "SQL",
        "Machine Learning",
        "AI",
        "Blockchain",
        "Cloud Computing",
        "DevOps",
        "Mobile Development",
        "Web Development",
        "Data Science",
        "Cybersecurity",
        "UI/UX Design",
        "Digital Marketing",
    ] as const;

    // Industry options
    const commonIndustries = [
        "Technology",
        "Healthcare",
        "Finance",
        "E-commerce",
        "Education",
        "Manufacturing",
        "Real Estate",
        "Food & Beverage",
        "Entertainment",
        "Transportation",
        "Energy",
        "Agriculture",
        "Retail",
        "Telecommunications",
        "Aerospace",
        "Automotive",
        "Biotechnology",
        "Clean Tech",
        "Gaming",
        "Media",
    ] as const;

    // Auto-save changes
    $effect(() => {
        const timeoutId = setTimeout(() => {
            onboarding.updateFormData({ skills: formData });
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    function addSkill(): void {
        const skill = skillInput.trim();
        if (skill && !formData.skills.includes(skill)) {
            formData.skills = [...formData.skills, skill];
            skillInput = "";
        }
    }

    function addIndustry(): void {
        const industry = industryInput.trim();
        if (industry && !formData.industries.includes(industry)) {
            formData.industries = [...formData.industries, industry];
            industryInput = "";
        }
    }

    function removeSkill(skill: string): void {
        formData.skills = formData.skills.filter((s) => s !== skill);
    }

    function removeIndustry(industry: string): void {
        formData.industries = formData.industries.filter((i) => i !== industry);
    }

    function addSuggestedSkill(skill: string): void {
        if (!formData.skills.includes(skill)) {
            formData.skills = [...formData.skills, skill];
        }
    }

    function addCommonIndustry(industry: string): void {
        if (!formData.industries.includes(industry)) {
            formData.industries = [...formData.industries, industry];
        }
    }

    function handleSkillKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addSkill();
        }
    }

    function handleIndustryKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addIndustry();
        }
    }

    async function handleContinue(): Promise<void> {
        if (validateForm()) {
            onboarding.markStepComplete("skills");
            await onboarding.goNext();
        }
    }
</script>

<div class="space-y-8">{@const StepComponent = getStepComponent(
    </div>

    <!-- Experience Level -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Star class="w-5 h-5 text-yellow-600" />
                Experience Level *
            </CardTitle>
            <p class="text-sm text-gray-600">
                How would you describe your overall professional experience?
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <RadioGroup bind:value={formData.experienceLevel}>
                {#each experienceLevels as level}
                    <div
                        class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                        <RadioGroupItem
                            value={level.value}
                            id={level.value}
                            class="mt-1"
                        />
                        <Label for={level.value} class="flex-1 cursor-pointer">
                            <div class="flex items-start gap-3">
                                <span class="text-2xl">{level.icon}</span>
                                <div>
                                    <div class="font-medium">{level.label}</div>
                                    <div class="text-sm text-gray-500 mt-1">
                                        {level.description}
                                    </div>
                                </div>
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
            {#if errors.experienceLevel}
                <p class="text-sm text-red-500">{errors.experienceLevel}</p>
            {/if}
        </CardContent>
    </Card>

    <!-- Skills -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Code class="w-5 h-5 text-blue-600" />
                Skills & Expertise *
            </CardTitle>
            <p class="text-sm text-gray-600">
                Add your key skills, both technical and soft skills
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Role-based Suggested Skills -->
            {#if currentRole && suggestedSkills[currentRole]}
                <div class="space-y-3">
                    <Label class="text-sm font-medium"
                        >Suggested skills for {currentRole.toLowerCase()}s:</Label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each suggestedSkills[currentRole].slice(0, 12) as skill}
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={() => addSuggestedSkill(skill)}
                                disabled={formData.skills.includes(skill)}
                                class="text-xs h-8"
                            >
                                <Plus class="w-3 h-3 mr-1" />
                                {skill}
                            </Button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Technical Skills -->
            <div class="space-y-3">
                <Label class="text-sm font-medium"
                    >Common technical skills:</Label
                >
                <div class="flex flex-wrap gap-2">
                    {#each technicalSkills.slice(0, 12) as skill}
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={() => addSuggestedSkill(skill)}
                            disabled={formData.skills.includes(skill)}
                            class="text-xs h-8"
                        >
                            <Plus class="w-3 h-3 mr-1" />
                            {skill}
                        </Button>
                    {/each}
                </div>
            </div>

            <!-- Custom Skill Input -->
            <div class="space-y-2">
                <Label for="skill-input">Add your own skills:</Label>
                <div class="flex gap-2">
                    <Input
                        id="skill-input"
                        bind:value={skillInput}
                        placeholder="Type a skill and press Enter or comma"
                        onkeydown={handleSkillKeydown}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onclick={addSkill}
                        disabled={!skillInput.trim()}
                    >
                        <Plus class="w-4 h-4" />
                    </Button>
                </div>
                <p class="text-xs text-gray-500">
                    Press Enter or comma to add multiple skills quickly
                </p>
            </div>

            <!-- Selected Skills -->
            {#if formData.skills.length > 0}
                <div class="space-y-2">
                    <Label class="text-sm font-medium">Your skills:</Label>
                    <div class="flex flex-wrap gap-2">
                        {#each formData.skills as skill}
                            <Badge
                                variant="secondary"
                                class="cursor-pointer hover:bg-red-100 transition-colors"
                                onclick={() => removeSkill(skill)}
                            >
                                {skill}
                                <X class="w-3 h-3 ml-1" />
                            </Badge>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if errors.skills}
                <p class="text-sm text-red-500">{errors.skills}</p>
            {/if}
        </CardContent>
    </Card>

    <!-- Industries -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-green-600" />
                Industry Experience
            </CardTitle>
            <p class="text-sm text-gray-600">
                Which industries have you worked in or have experience with?
                (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Common Industries -->
            <div class="space-y-3">
                <Label class="text-sm font-medium">Common industries:</Label>
                <div class="flex flex-wrap gap-2">
                    {#each commonIndustries.slice(0, 12) as industry}
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={() => addCommonIndustry(industry)}
                            disabled={formData.industries.includes(industry)}
                            class="text-xs h-8"
                        >
                            <Plus class="w-3 h-3 mr-1" />
                            {industry}
                        </Button>
                    {/each}
                </div>
            </div>

            <!-- Custom Industry Input -->
            <div class="space-y-2">
                <Label for="industry-input">Add other industries:</Label>
                <div class="flex gap-2">
                    <Input
                        id="industry-input"
                        bind:value={industryInput}
                        placeholder="Type an industry and press Enter"
                        onkeydown={handleIndustryKeydown}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onclick={addIndustry}
                        disabled={!industryInput.trim()}
                    >
                        <Plus class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <!-- Selected Industries -->
            {#if formData.industries.length > 0}
                <div class="space-y-2">
                    <Label class="text-sm font-medium">Your industries:</Label>
                    <div class="flex flex-wrap gap-2">
                        {#each formData.industries as industry}
                            <Badge
                                variant="outline"
                                class="cursor-pointer hover:bg-red-100 transition-colors"
                                onclick={() => removeIndustry(industry)}
                            >
                                {industry}
                                <X class="w-3 h-3 ml-1" />
                            </Badge>
                        {/each}
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Areas of Expertise -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Target class="w-5 h-5 text-purple-600" />
                Areas of Expertise
            </CardTitle>
            <p class="text-sm text-gray-600">
                Describe your specific areas of expertise in more detail
                (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Textarea
                    id="expertise-areas"
                    bind:value={formData.expertiseAreas}
                    placeholder="Describe your specific areas of expertise, what makes you unique, or specialized knowledge you have..."
                    rows={4}
                    maxlength={1000}
                />
                <p class="text-xs text-gray-500">
                    {formData.expertiseAreas.length}/1000 characters
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Achievements -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Award class="w-5 h-5 text-yellow-600" />
                Notable Achievements
            </CardTitle>
            <p class="text-sm text-gray-600">
                Share any significant accomplishments, awards, or milestones
                (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Textarea
                    id="achievements"
                    bind:value={formData.achievements}
                    placeholder="Share your professional achievements, awards, successful projects, or other accomplishments..."
                    rows={4}
                    maxlength={1000}
                />
                <p class="text-xs text-gray-500">
                    {formData.achievements.length}/1000 characters
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Certifications -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Briefcase class="w-5 h-5 text-indigo-600" />
                Certifications & Credentials
            </CardTitle>
            <p class="text-sm text-gray-600">
                List any relevant certifications, licenses, or credentials
                (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Textarea
                    id="certifications"
                    bind:value={formData.certifications}
                    placeholder="List your certifications, professional licenses, degrees, or other credentials..."
                    rows={3}
                    maxlength={1000}
                />
                <p class="text-xs text-gray-500">
                    {formData.certifications.length}/1000 characters
                </p>
            </div>
        </CardContent>
    </Card>

    <!-- Continue Button -->
    <div class="flex justify-center pt-6">
        <Button
            onclick={handleContinue}
            disabled={!isFormValid}
            size="lg"
            class="px-8"
        >
            Continue to Preferences
        </Button>
    </div>

    <!-- Help Text -->
    <div class="text-center text-sm text-gray-500 space-y-2">
        <p>
            Your skills help us match you with relevant opportunities and
            connections
        </p>
        <p>You can always update your skills profile later</p>
    </div>
</div>
