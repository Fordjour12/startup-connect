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
    import { Checkbox } from "@/components/ui/checkbox";
    import {
        Target,
        Plus,
        X,
        Clock,
        Heart,
        TrendingUp,
        Users,
        Lightbulb,
        Rocket,
        DollarSign,
        MessageCircle,
    } from "@lucide/svelte";

    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    // Form data binding
    let formData = $state({
        personalGoals: onboarding.formData.goals?.personalGoals || [],
        platformGoals: onboarding.formData.goals?.platformGoals || [],
        primaryGoal: onboarding.formData.goals?.primaryGoal || "",
        specificNeeds: onboarding.formData.goals?.specificNeeds || [],
        timeCommitment: onboarding.formData.goals?.timeCommitment || "",
        additionalGoals: onboarding.formData.goals?.additionalGoals || "",
    });

    // Input states for tag inputs
    let personalGoalInput = $state("");
    let platformGoalInput = $state("");

    // Validation errors
    let errors = $state<Record<string, string>>({});

    // Form validation - derived value for form validity
    let isFormValid = $derived(Object.keys(errors).length === 0);

    // Effect to update validation errors when form data changes
    $effect(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.primaryGoal) {
            newErrors.primaryGoal = "Please select your primary goal";
        }

        if (formData.specificNeeds.length === 0) {
            newErrors.specificNeeds =
                "Please select at least one specific need";
        }

        if (!formData.timeCommitment) {
            newErrors.timeCommitment = "Please select your time commitment";
        }

        errors = newErrors;
    });

    // Function to validate form (for explicit validation calls)
    function validateForm(): boolean {
        return isFormValid;
    }

    // Suggested goals based on role
    const currentRole = onboarding.formData.role;

    const suggestedPersonalGoals = {
        founder: [
            "Build a successful company",
            "Create jobs and opportunities",
            "Solve a meaningful problem",
            "Achieve financial independence",
            "Learn from experienced mentors",
            "Build a strong network",
            "Develop leadership skills",
            "Make a positive impact",
        ],
        investor: [
            "Generate strong returns",
            "Support innovative companies",
            "Diversify investment portfolio",
            "Build industry expertise",
            "Help entrepreneurs succeed",
            "Stay ahead of market trends",
            "Create lasting partnerships",
            "Give back to the ecosystem",
        ],
        support: [
            "Share knowledge and expertise",
            "Build professional reputation",
            "Expand professional network",
            "Generate additional income",
            "Work with innovative companies",
            "Develop new skills",
            "Make meaningful contributions",
            "Build long-term relationships",
        ],
    };

    const suggestedPlatformGoals = {
        founder: [
            "Find co-founders",
            "Raise funding",
            "Get mentorship",
            "Find beta customers",
            "Build partnerships",
            "Get product feedback",
            "Access resources",
            "Join startup community",
        ],
        investor: [
            "Discover deals",
            "Connect with founders",
            "Access due diligence data",
            "Build deal flow",
            "Network with other investors",
            "Stay updated on trends",
            "Find co-investment opportunities",
            "Track portfolio companies",
        ],
        support: [
            "Find clients",
            "Showcase expertise",
            "Build reputation",
            "Network with startups",
            "Share knowledge",
            "Find collaboration opportunities",
            "Access startup ecosystem",
            "Develop case studies",
        ],
    };

    // Primary goal options
    const primaryGoalOptions = {
        founder: [
            {
                value: "raise_funding",
                label: "Raise Funding",
                description: "Connect with investors and secure capital",
                icon: DollarSign,
            },
            {
                value: "find_cofounders",
                label: "Find Co-founders",
                description: "Build your founding team",
                icon: Users,
            },
            {
                value: "get_mentorship",
                label: "Get Mentorship",
                description: "Learn from experienced entrepreneurs",
                icon: Lightbulb,
            },
            {
                value: "build_network",
                label: "Build Network",
                description: "Connect with the startup community",
                icon: MessageCircle,
            },
        ],
        investor: [
            {
                value: "find_deals",
                label: "Find Investment Opportunities",
                description: "Discover promising startups to invest in",
                icon: TrendingUp,
            },
            {
                value: "build_portfolio",
                label: "Build Portfolio",
                description: "Diversify and grow investment portfolio",
                icon: Target,
            },
            {
                value: "network_founders",
                label: "Network with Founders",
                description: "Connect with entrepreneurs and other investors",
                icon: Users,
            },
            {
                value: "market_insights",
                label: "Market Insights",
                description: "Stay updated on industry trends",
                icon: Lightbulb,
            },
        ],
        support: [
            {
                value: "find_clients",
                label: "Find Clients",
                description: "Connect with startups needing your services",
                icon: Users,
            },
            {
                value: "build_reputation",
                label: "Build Reputation",
                description: "Showcase expertise and build credibility",
                icon: Target,
            },
            {
                value: "give_back",
                label: "Give Back",
                description: "Help entrepreneurs and startups succeed",
                icon: Heart,
            },
            {
                value: "learn_grow",
                label: "Learn & Grow",
                description: "Develop skills working with diverse companies",
                icon: Rocket,
            },
        ],
    };

    // Specific needs options
    const specificNeedsOptions = {
        founder: [
            "Technical co-founder",
            "Business co-founder",
            "Seed funding",
            "Series A funding",
            "Product development help",
            "Marketing expertise",
            "Legal guidance",
            "Customer acquisition",
            "Team building",
            "Strategy consultation",
        ],
        investor: [
            "Deal sourcing",
            "Due diligence support",
            "Industry expertise",
            "Co-investment partners",
            "Portfolio management",
            "Exit opportunities",
            "Market research",
            "Startup evaluation",
        ],
        support: [
            "Marketing projects",
            "Technical consulting",
            "Business strategy",
            "Design work",
            "Legal services",
            "Financial planning",
            "Operations support",
            "Mentoring opportunities",
        ],
    };

    // Time commitment options
    const timeCommitmentOptions = [
        {
            value: "casual",
            label: "Casual (1-5 hours/week)",
            description: "Light involvement, flexible schedule",
        },
        {
            value: "regular",
            label: "Regular (5-15 hours/week)",
            description: "Consistent but manageable commitment",
        },
        {
            value: "intensive",
            label: "Intensive (15+ hours/week)",
            description: "High involvement, serious commitment",
        },
        {
            value: "full_time",
            label: "Full-time focus",
            description: "Primary focus and dedication",
        },
    ];

    // Auto-save changes
    $effect(() => {
        const timeoutId = setTimeout(() => {
            onboarding.updateFormData({ goals: formData });
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    function addPersonalGoal() {
        if (
            personalGoalInput.trim() &&
            !formData.personalGoals.includes(personalGoalInput.trim())
        ) {
            formData.personalGoals = [
                ...formData.personalGoals,
                personalGoalInput.trim(),
            ];
            personalGoalInput = "";
        }
    }

    function addPlatformGoal() {
        if (
            platformGoalInput.trim() &&
            !formData.platformGoals.includes(platformGoalInput.trim())
        ) {
            formData.platformGoals = [
                ...formData.platformGoals,
                platformGoalInput.trim(),
            ];
            platformGoalInput = "";
        }
    }

    function removePersonalGoal(goal: string) {
        formData.personalGoals = formData.personalGoals.filter(
            (g: any) => g !== goal,
        );
    }

    function removePlatformGoal(goal: string) {
        formData.platformGoals = formData.platformGoals.filter(
            (g: any) => g !== goal,
        );
    }

    function addSuggestedPersonalGoal(goal: string) {
        if (!formData.personalGoals.includes(goal)) {
            formData.personalGoals = [...formData.personalGoals, goal];
        }
    }

    function addSuggestedPlatformGoal(goal: string) {
        if (!formData.platformGoals.includes(goal)) {
            formData.platformGoals = [...formData.platformGoals, goal];
        }
    }

    function toggleSpecificNeed(need: string) {
        if (formData.specificNeeds.includes(need)) {
            formData.specificNeeds = formData.specificNeeds.filter(
                (n: any) => n !== need,
            );
        } else {
            formData.specificNeeds = [...formData.specificNeeds, need];
        }
    }

    function handlePersonalGoalKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addPersonalGoal();
        }
    }

    function handlePlatformGoalKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addPlatformGoal();
        }
    }

    async function handleContinue() {
        if (validateForm()) {
            onboarding.markStepComplete("goals");
            await onboarding.goNext();
        }
    }
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">What are your goals?</h2>
        <p class="text-gray-600">
            Help us understand what you want to achieve on Startup Connect
        </p>
    </div>

    <!-- Personal Goals -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Target class="w-5 h-5 text-blue-600" />
                Personal Goals
            </CardTitle>
            <p class="text-sm text-gray-600">
                What do you personally hope to achieve? (Optional but
                recommended)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Suggested Goals -->
            {#if currentRole && suggestedPersonalGoals[currentRole]}
                <div class="space-y-3">
                    <Label class="text-sm font-medium"
                        >Suggested goals for {currentRole.toLowerCase()}s:</Label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each suggestedPersonalGoals[currentRole] as goal}
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={() => addSuggestedPersonalGoal(goal)}
                                disabled={formData.personalGoals.includes(goal)}
                                class="text-xs h-8"
                            >
                                <Plus class="w-3 h-3 mr-1" />
                                {goal}
                            </Button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Custom Goal Input -->
            <div class="space-y-2">
                <Label for="personal-goal">Add your own goals:</Label>
                <div class="flex gap-2">
                    <Input
                        id="personal-goal"
                        bind:value={personalGoalInput}
                        placeholder="Type a personal goal and press Enter"
                        onkeydown={handlePersonalGoalKeydown}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onclick={addPersonalGoal}
                        disabled={!personalGoalInput.trim()}
                    >
                        <Plus class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <!-- Selected Personal Goals -->
            {#if formData.personalGoals.length > 0}
                <div class="space-y-2">
                    <Label class="text-sm font-medium"
                        >Your personal goals:</Label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each formData.personalGoals as goal}
                            <Badge
                                variant="secondary"
                                class="cursor-pointer hover:bg-red-100 transition-colors"
                                onclick={() => removePersonalGoal(goal)}
                            >
                                {goal}
                                <X class="w-3 h-3 ml-1" />
                            </Badge>
                        {/each}
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Platform Goals -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Rocket class="w-5 h-5 text-blue-600" />
                Platform Goals
            </CardTitle>
            <p class="text-sm text-gray-600">
                What do you want to accomplish on Startup Connect? (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Suggested Platform Goals -->
            {#if currentRole && suggestedPlatformGoals[currentRole]}
                <div class="space-y-3">
                    <Label class="text-sm font-medium"
                        >Common platform goals:</Label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each suggestedPlatformGoals[currentRole] as goal}
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={() => addSuggestedPlatformGoal(goal)}
                                disabled={formData.platformGoals.includes(goal)}
                                class="text-xs h-8"
                            >
                                <Plus class="w-3 h-3 mr-1" />
                                {goal}
                            </Button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Custom Platform Goal Input -->
            <div class="space-y-2">
                <Label for="platform-goal">Add your own platform goals:</Label>
                <div class="flex gap-2">
                    <Input
                        id="platform-goal"
                        bind:value={platformGoalInput}
                        placeholder="Type a platform goal and press Enter"
                        onkeydown={handlePlatformGoalKeydown}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onclick={addPlatformGoal}
                        disabled={!platformGoalInput.trim()}
                    >
                        <Plus class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <!-- Selected Platform Goals -->
            {#if formData.platformGoals.length > 0}
                <div class="space-y-2">
                    <Label class="text-sm font-medium"
                        >Your platform goals:</Label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each formData.platformGoals as goal}
                            <Badge
                                variant="secondary"
                                class="cursor-pointer hover:bg-red-100 transition-colors"
                                onclick={() => removePlatformGoal(goal)}
                            >
                                {goal}
                                <X class="w-3 h-3 ml-1" />
                            </Badge>
                        {/each}
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>

    <!-- Primary Goal -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-green-600" />
                Primary Goal *
            </CardTitle>
            <p class="text-sm text-gray-600">
                What's the most important thing you want to achieve right now?
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <RadioGroup bind:value={formData.primaryGoal}>
                {#each (currentRole && primaryGoalOptions[currentRole]) || [] as option}
                    <div
                        class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            class="mt-1"
                        />
                        <Label for={option.value} class="flex-1 cursor-pointer">
                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-gray-100 rounded-lg">
                                    <option.icon class="size-4 text-gray-600" />
                                </div>
                                <div>
                                    <div class="font-medium">
                                        {option.label}
                                    </div>
                                    <div class="text-sm text-gray-500 mt-1">
                                        {option.description}
                                    </div>
                                </div>
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
            {#if errors.primaryGoal}
                <p class="text-sm text-red-500">{errors.primaryGoal}</p>
            {/if}
        </CardContent>
    </Card>

    <!-- Specific Needs -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Users class="w-5 h-5 text-purple-600" />
                Specific Needs *
            </CardTitle>
            <p class="text-sm text-gray-600">
                What specific help or support are you looking for? (Select
                multiple)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each (currentRole && specificNeedsOptions[currentRole]) || [] as need}
                    <button
                        class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onclick={() => toggleSpecificNeed(need)}
                    >
                        <Checkbox
                            checked={formData.specificNeeds.includes(need)}
                            onCheckedChange={() => toggleSpecificNeed(need)}
                        />
                        <Label class="text-sm cursor-pointer flex-1"
                            >{need}</Label
                        >
                    </button>
                {/each}
            </div>
            {#if errors.specificNeeds}
                <p class="text-sm text-red-500">{errors.specificNeeds}</p>
            {/if}
        </CardContent>
    </Card>

    <!-- Time Commitment -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-orange-600" />
                Time Commitment *
            </CardTitle>
            <p class="text-sm text-gray-600">
                How much time can you dedicate to your startup activities?
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <RadioGroup bind:value={formData.timeCommitment}>
                {#each timeCommitmentOptions as option}
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                        />
                        <Label for={option.value} class="flex-1 cursor-pointer">
                            <div class="flex flex-col">
                                <span class="font-medium">{option.label}</span>
                                <span class="text-sm text-gray-500"
                                    >{option.description}</span
                                >
                            </div>
                        </Label>
                    </div>
                {/each}
            </RadioGroup>
            {#if errors.timeCommitment}
                <p class="text-sm text-red-500">{errors.timeCommitment}</p>
            {/if}
        </CardContent>
    </Card>

    <!-- Additional Goals -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                <Lightbulb class="w-5 h-5 text-yellow-600" />
                Additional Goals & Notes
            </CardTitle>
            <p class="text-sm text-gray-600">
                Anything else you'd like to share about your goals? (Optional)
            </p>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Textarea
                    id="additional-goals"
                    bind:value={formData.additionalGoals}
                    placeholder="Share any additional goals, context, or specific things you're looking for..."
                    rows={4}
                    maxlength={300}
                />
                <p class="text-xs text-gray-500">
                    {formData.additionalGoals.length}/300 characters
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
            Continue to Skills
        </Button>
    </div>

    <!-- Help Text -->
    <div class="text-center text-sm text-gray-500">
        <p>
            Your goals help us personalize your experience and show you relevant
            matches
        </p>
        <p>You can always update your goals later in your profile settings</p>
    </div>
</div>
