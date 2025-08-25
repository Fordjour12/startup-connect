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
    import { Checkbox } from "@/components/ui/checkbox";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import {
        DollarSign,
        TrendingUp,
        Clock,
        Target,
        Building,
        Star,
        Lightbulb,
        HandHeart,
        Rocket,
    } from "@lucide/svelte";
    import type { UserRole } from "@/z-schema/onboarding-schema";

    import type { OnboardingState } from "@/hooks/onboarding-state.svelte";

    interface Props {
        onboarding: OnboardingState;
    }

    let { onboarding }: Props = $props();

    // Add these type definitions at the top of your script
    type InvestmentStage =
        | "Bootstrapped"
        | "Pre-seed"
        | "Seed"
        | "Series A"
        | "Series B"
        | "Series C+"
        | "Acquired";
    type InvestmentSize =
        | "Under-50k"
        | "50k-100k"
        | "100k-500k"
        | "500k-1m"
        | "1m-plus";
    type RiskAppetite = "conservative" | "Moderate" | "Aggressive";
    type Availability = "One Off" | "Ongoing" | "Project Based";

    // Get current role
    const currentRole = onboarding.formData.role as UserRole;

    // Update your state definitions to use undefined instead of null
    let investorData = $state({
        investmentSize:
            onboarding.formData.investorInfo?.investmentSize ||
            (undefined as InvestmentSize | undefined),
        preferredStages:
            onboarding.formData.investorInfo?.preferredStages ||
            ([] as InvestmentStage[]),
        investmentHistory:
            onboarding.formData.investorInfo?.investmentHistory || "",
        riskAppetite:
            onboarding.formData.investorInfo?.riskAppetite ||
            (undefined as RiskAppetite | undefined),
        portfolioCompanies:
            onboarding.formData.investorInfo?.portfolioCompanies || 0,
    });

    // Supporter form data
    let supporterData = $state({
        supportType: onboarding.formData.supporterInfo?.supportType || [],
        availability:
            onboarding.formData.supporterInfo?.availability ||
            (undefined as Availability | undefined),
        hourlyRate: onboarding.formData.supporterInfo?.hourlyRate || null,
        expertise: onboarding.formData.supporterInfo?.expertise || "",
    });

    // Founder form data (future expansion)
    let founderData = $state({
        startupStage: null,
        teamSize: 0,
        fundingStatus: null,
        areasOfNeed: [],
    });

    // Validation errors
    let errors = $state<Record<string, string>>({});

    // Form validation - derived value for form validity
    let isFormValid = $derived(Object.keys(errors).length === 0);

    // Single consolidated effect for validation and auto-save
    $effect(() => {
        // Validation logic
        const newErrors: Record<string, string> = {};

        if (currentRole === "investor") {
            if (!investorData.investmentSize) {
                newErrors.investmentSize =
                    "Please select your typical investment size";
            }
            if (investorData.preferredStages.length === 0) {
                newErrors.preferredStages =
                    "Please select at least one investment stage";
            }
            if (!investorData.riskAppetite) {
                newErrors.riskAppetite = "Please select your risk appetite";
            }
        } else if (currentRole === "support") {
            if (supporterData.supportType.length === 0) {
                newErrors.supportType =
                    "Please select at least one type of support you offer";
            }
            if (!supporterData.availability) {
                newErrors.availability =
                    "Please select your availability preference";
            }
        }

        errors = newErrors;

        // Auto-save logic with debouncing
        const timeoutId = setTimeout(async () => {
            try {
                if (currentRole === "investor") {
                    const cleanData = cleanRoleData(currentRole, investorData);
                    await onboarding.updateRoleSpecificData(
                        currentRole,
                        cleanData,
                    );
                } else if (currentRole === "support") {
                    const cleanData = cleanRoleData(currentRole, supporterData);
                    await onboarding.updateRoleSpecificData(
                        currentRole,
                        cleanData,
                    );
                } else if (currentRole === "founder") {
                    const cleanData = cleanRoleData(currentRole, founderData);
                    await onboarding.updateRoleSpecificData(
                        currentRole,
                        cleanData,
                    );
                }
            } catch (error) {
                console.error("Failed to auto-save:", error);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    // Save data to onboarding state
    async function saveInvestorData() {
        await onboarding.updateRoleSpecificData("investor", investorData);
    }

    async function saveSupporterData() {
        await onboarding.updateRoleSpecificData("support", supporterData);
    }

    // Auto-save when data changes
    // $effect(() => {
    //     if (currentRole === "investor") {
    //         saveInvestorData();
    //     } else if (currentRole === "support") {
    //         saveSupporterData();
    //     }
    // });

    // Function to validate form (for explicit validation calls)
    function validateForm(): boolean {
        return isFormValid;
    }

    // Investment size options
    const investmentSizeOptions = [
        {
            value: "Under-50k",
            label: "Under $50K",
            description: "Angel investments, small checks",
        },
        {
            value: "50k-100k",
            label: "$50K - $100K",
            description: "Seed round participation",
        },
        {
            value: "100k-500k",
            label: "$100K - $500K",
            description: "Lead or co-lead seed rounds",
        },
        {
            value: "500k-1m",
            label: "$500K - $1M",
            description: "Series A participation",
        },
        {
            value: "1m-plus",
            label: "$1M+",
            description: "Major rounds, institutional",
        },
    ];

    // Investment stages
    const investmentStages: Array<{
        value: InvestmentStage;
        label: string;
        description: string;
    }> = [
        {
            value: "Bootstrapped",
            label: "Bootstrapped",
            description: "Self-funded, no external investment",
        },
        {
            value: "Pre-seed",
            label: "Pre-seed",
            description: "Idea stage, MVP development",
        },
        {
            value: "Seed",
            label: "Seed",
            description: "Early revenue, product-market fit",
        },
        {
            value: "Series A",
            label: "Series A",
            description: "Proven traction, scaling",
        },
        {
            value: "Series B",
            label: "Series B",
            description: "Growth stage, market expansion",
        },
        {
            value: "Series C+",
            label: "Series C+",
            description: "Later stage, mature business",
        },
        {
            value: "Acquired",
            label: "Acquired",
            description: "Company has been acquired",
        },
    ];

    // Risk appetite options
    const riskOptions: Array<{
        value: RiskAppetite;
        label: string;
        description: string;
    }> = [
        {
            value: "conservative",
            label: "Conservative",
            description: "Prefer proven models, lower risk",
        },
        {
            value: "Moderate",
            label: "Moderate",
            description: "Balanced approach to risk/reward",
        },
        {
            value: "Aggressive",
            label: "Aggressive",
            description: "High risk, high reward opportunities",
        },
    ];

    // Support types for supporters
    const supportTypes = [
        "Marketing & Growth",
        "Product Development",
        "Technical Consulting",
        "Business Strategy",
        "Legal & Compliance",
        "Design & UX",
        "Sales & Business Development",
        "Financial Planning",
        "HR & Talent",
        "Operations",
        "Mentorship",
        "Other",
    ];

    // Availability options
    const availabilityOptions: Array<{
        value: Availability;
        label: string;
        description: string;
    }> = [
        {
            value: "One Off",
            label: "One-off Projects",
            description: "Specific deliverables, short-term",
        },
        {
            value: "Ongoing",
            label: "Ongoing Support",
            description: "Regular consultations, long-term",
        },
        {
            value: "Project Based",
            label: "Project-based",
            description: "Complete projects, defined scope",
        },
    ];

    // Helper function to clean data before submission
    function cleanRoleData(role: UserRole, data: any) {
        if (role === "investor") {
            return {
                ...data,
                investmentSize: data.investmentSize || null,
                riskAppetite: data.riskAppetite || null,
            };
        } else if (role === "support") {
            return {
                ...data,
                availability: data.availability || null,
            };
        } else if (role === "founder") {
            return {
                ...data,
                startupStage: data.startupStage || null,
                fundingStatus: data.fundingStatus || null,
            };
        }
        return data;
    }

    // Auto-save changes
    // $effect(() => {
    //     const timeoutId = setTimeout(() => {
    //         // Clean the data before auto-saving
    //         if (currentRole === "investor") {
    //             const cleanData = cleanRoleData(currentRole, investorData);
    //             onboarding.updateRoleSpecificData(currentRole, cleanData);
    //         } else if (currentRole === "support") {
    //             const cleanData = cleanRoleData(currentRole, supporterData);
    //             onboarding.updateRoleSpecificData(currentRole, cleanData);
    //         } else if (currentRole === "founder") {
    //             const cleanData = cleanRoleData(currentRole, founderData);
    //             onboarding.updateRoleSpecificData(currentRole, cleanData);
    //         }
    //     }, 500);

    //     return () => clearTimeout(timeoutId);
    // });

    // Fix the function signature
    function toggleInvestmentStage(stage: InvestmentStage) {
        if (investorData.preferredStages.includes(stage)) {
            investorData.preferredStages = investorData.preferredStages.filter(
                (s: string) => s !== stage,
            );
        } else {
            investorData.preferredStages = [
                ...investorData.preferredStages,
                stage,
            ];
        }
    }

    function toggleSupportType(type: string) {
        if (supporterData.supportType.includes(type)) {
            supporterData.supportType = supporterData.supportType.filter(
                (t: string) => t !== type,
            );
        } else {
            supporterData.supportType = [...supporterData.supportType, type];
        }
    }

    async function handleContinue() {
        if (validateForm()) {
            // Mark role-specific step as complete
            await onboarding.markStepComplete("role-specific");
            await onboarding.goNext();
        }
    }
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-heading">
            Tell us more about your {currentRole === "support"
                ? "expertise"
                : currentRole.toLowerCase()} interests
        </h2>
        <p class="font-body text-accent">
            This helps us match you with the most relevant opportunities
        </p>
    </div>

    {#if currentRole === "investor"}
        <!-- Investor-specific form -->
        <div class="space-y-6">
            <!-- Investment Size -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <DollarSign class="size-5 text-role-investor" />
                        Investment Size
                    </CardTitle>
                    <p class="text-sm">What's your typical investment range?</p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <RadioGroup bind:value={investorData.investmentSize}>
                        {#each investmentSizeOptions as option}
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                />
                                <Label
                                    for={option.value}
                                    class="flex-1 cursor-pointer"
                                >
                                    <div class="flex flex-col">
                                        <span class="font-medium">
                                            {option.label}
                                        </span>
                                        <span class="text-sm text-accent">
                                            {option.description}
                                        </span>
                                    </div>
                                </Label>
                            </div>
                        {/each}
                    </RadioGroup>
                    {#if errors.investmentSize}
                        <p class="text-sm text-error">
                            {errors.investmentSize}
                        </p>
                    {/if}
                </CardContent>
            </Card>

            <!-- Preferred Investment Stages -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <TrendingUp class="size-5 text-role-investor" />
                        Preferred Investment Stages
                    </CardTitle>
                    <p class="text-sm">
                        Which stages are you most interested in? (Select
                        multiple)
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid gap-3">
                        {#each investmentStages as stage}
                            <Label
                                class="inline-flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                            >
                                <Checkbox
                                    checked={investorData.preferredStages.includes(
                                        stage.value,
                                    )}
                                    onCheckedChange={() =>
                                        toggleInvestmentStage(stage.value)}
                                />
                                <div class="flex-1 place-items-center">
                                    <h4>{stage.label}</h4>
                                    <p class="text-accent font-body pt-2">
                                        {stage.description}
                                    </p>
                                </div>
                            </Label>
                        {/each}
                    </div>
                    {#if errors.preferredStages}
                        <p class="text-sm text-error">
                            {errors.preferredStages}
                        </p>
                    {/if}
                </CardContent>
            </Card>

            <!-- Risk Appetite -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Target class="size-5 text-role-investor" />
                        Risk Appetite
                    </CardTitle>
                    <p class="text-sm">
                        How would you describe your investment risk tolerance?
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <RadioGroup bind:value={investorData.riskAppetite}>
                        {#each riskOptions as option}
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                />
                                <Label
                                    for={option.value}
                                    class="flex-1 cursor-pointer"
                                >
                                    <div class="flex flex-col">
                                        <span class="font-medium"
                                            >{option.label}</span
                                        >
                                        <span class="text-sm text-accent"
                                            >{option.description}</span
                                        >
                                    </div>
                                </Label>
                            </div>
                        {/each}
                    </RadioGroup>
                    {#if errors.riskAppetite}
                        <p class="text-sm text-error">
                            {errors.riskAppetite}
                        </p>
                    {/if}
                </CardContent>
            </Card>

            <!-- Portfolio Companies -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Building class="size-5 text-role-investor" />
                        Portfolio Companies
                    </CardTitle>
                    <p class="text-sm">
                        How many companies are currently in your portfolio?
                    </p>
                </CardHeader>
                <CardContent>
                    <Input
                        type="number"
                        min="0"
                        placeholder="Enter number of companies"
                        bind:value={investorData.portfolioCompanies}
                        oninput={(e) =>
                            (investorData.portfolioCompanies = parseInt(
                                e.currentTarget.value || "0",
                            ))}
                    />
                </CardContent>
            </Card>

            <!-- Investment History -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Star class="size-5 text-role-investor" />
                        Investment History
                    </CardTitle>
                    <p class="text-sm">
                        Tell us about your investment experience and track
                        record
                    </p>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Describe your investment experience, notable exits, investment philosophy, etc."
                        bind:value={investorData.investmentHistory}
                        maxlength={500}
                        rows={4}
                    />
                    <p class="text-sm mt-2">
                        {investorData.investmentHistory.length}/500
                    </p>
                </CardContent>
            </Card>
        </div>
    {:else if currentRole === "support"}
        <!-- Supporter-specific form -->
        <div class="space-y-6">
            <!-- Support Types -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <HandHeart class="size-5 text-role-support" />
                        Types of Support You Offer
                    </CardTitle>
                    <p class="text-sm">
                        Select all the types of support you can provide
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid gap-3">
                        {#each supportTypes as type}
                            <Label
                                class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                            >
                                <Checkbox
                                    checked={supporterData.supportType.includes(
                                        type,
                                    )}
                                    onCheckedChange={() =>
                                        toggleSupportType(type)}
                                />
                                <div class="flex-1">
                                    <div class="font-medium">{type}</div>
                                </div>
                            </Label>
                        {/each}
                    </div>
                    {#if errors.supportType}
                        <p class="text-sm text-error">{errors.supportType}</p>
                    {/if}
                </CardContent>
            </Card>

            <!-- Availability -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Clock class="size-5 text-role-support" />
                        Availability
                    </CardTitle>
                    <p class="text-sm">
                        How would you prefer to work with startups?
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <RadioGroup bind:value={supporterData.availability}>
                        {#each availabilityOptions as option}
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                />
                                <Label
                                    for={option.value}
                                    class="flex-1 cursor-pointer"
                                >
                                    <div class="flex flex-col">
                                        <span class="font-medium">
                                            {option.label}
                                        </span>
                                        <span class="text-sm text-accent">
                                            {option.description}
                                        </span>
                                    </div>
                                </Label>
                            </div>
                        {/each}
                    </RadioGroup>
                    {#if errors.availability}
                        <p class="text-sm text-error">
                            {errors.availability}
                        </p>
                    {/if}
                </CardContent>
            </Card>

            <!-- Hourly Rate -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <DollarSign class="size-5 text-role-support" />
                        Hourly Rate
                    </CardTitle>
                    <p class="text-sm">
                        What's your typical hourly rate? (Optional)
                    </p>
                </CardHeader>
                <CardContent>
                    <Input
                        type="number"
                        min="0"
                        step="25"
                        placeholder="Enter your hourly rate"
                        bind:value={supporterData.hourlyRate}
                        oninput={(e) =>
                            (supporterData.hourlyRate = e.currentTarget.value
                                ? parseInt(e.currentTarget.value)
                                : null)}
                    />
                </CardContent>
            </Card>

            <!-- Expertise -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Lightbulb class="size-5 text-role-support" />
                        Expertise
                    </CardTitle>
                    <p class="text-sm">
                        Tell us about your specific expertise and experience
                    </p>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Describe your expertise, relevant experience, certifications, etc."
                        bind:value={supporterData.expertise}
                        maxlength={500}
                        rows={4}
                    />
                    <p class="text-sm mt-2">
                        {supporterData.expertise.length}/500 characters
                    </p>
                </CardContent>
            </Card>
        </div>
    {:else if currentRole === "founder"}
        <!-- Founder-specific form (placeholder for future implementation) -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Rocket class="w-5 h-5 text-role-founder" />
                    Founder Details
                </CardTitle>
                <p class="text-sm text-muted">
                    Founder-specific questions will be available soon. For now,
                    you can proceed to the next step.
                </p>
            </CardHeader>
        </Card>
    {/if}

    <!-- Continue Button -->
    <div class="flex justify-center pt-6">
        <Button onclick={handleContinue} disabled={!isFormValid} class="px-8">
            Continue to Goals
        </Button>
    </div>

    <!-- Help Text -->
    <div class="text-center text-sm text-accent">
        <p>This information helps us show you the most relevant matches</p>
        <p>You can always update these preferences later in your profile</p>
    </div>
</div>
