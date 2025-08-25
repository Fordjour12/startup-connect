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
    import { Checkbox } from "@/components/ui/checkbox";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import {
        DollarSign,
        TrendingUp,
        Users,
        Clock,
        Target,
        Briefcase,
        Building,
        Star,
        Lightbulb,
        HandHeart,
        Rocket,
    } from "@lucide/svelte";
    import type { UserRole } from "@/z-schema/onboarding-schema";

    interface Props {
        onboarding: any;
    }

    let { onboarding }: Props = $props();

    // Get current role
    const currentRole = onboarding.formData.role as UserRole;

    // Investor form data
    let investorData = $state({
        investmentSize:
            onboarding.formData.investorInfo?.investmentSize || null,
        preferredStages:
            onboarding.formData.investorInfo?.preferredStages || [],
        investmentHistory:
            onboarding.formData.investorInfo?.investmentHistory || "",
        riskAppetite: onboarding.formData.investorInfo?.riskAppetite || null,
        portfolioCompanies:
            onboarding.formData.investorInfo?.portfolioCompanies || 0,
    });

    // Supporter form data
    let supporterData = $state({
        supportType: onboarding.formData.supporterInfo?.supportType || [],
        availability: onboarding.formData.supporterInfo?.availability || null,
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

    // Effect to update validation errors when form data changes
    $effect(() => {
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
    });

    // Function to validate form (for explicit validation calls)
    function validateForm(): boolean {
        return isFormValid;
    }

    // Investment size options
    const investmentSizeOptions = [
        {
            value: "under_50k",
            label: "Under $50K",
            description: "Angel investments, small checks",
        },
        {
            value: "50k_100k",
            label: "$50K - $100K",
            description: "Seed round participation",
        },
        {
            value: "100k_500k",
            label: "$100K - $500K",
            description: "Lead or co-lead seed rounds",
        },
        {
            value: "500k_1m",
            label: "$500K - $1M",
            description: "Series A participation",
        },
        {
            value: "1m_plus",
            label: "$1M+",
            description: "Major rounds, institutional",
        },
    ];

    // Investment stages
    const investmentStages = [
        {
            value: "pre_seed",
            label: "Pre-seed",
            description: "Idea stage, MVP development",
        },
        {
            value: "seed",
            label: "Seed",
            description: "Early revenue, product-market fit",
        },
        {
            value: "series_a",
            label: "Series A",
            description: "Proven traction, scaling",
        },
        {
            value: "series_b",
            label: "Series B",
            description: "Growth stage, market expansion",
        },
        {
            value: "growth",
            label: "Growth",
            description: "Later stage, mature business",
        },
    ];

    // Risk appetite options
    const riskOptions = [
        {
            value: "conservative",
            label: "Conservative",
            description: "Prefer proven models, lower risk",
        },
        {
            value: "moderate",
            label: "Moderate",
            description: "Balanced approach to risk/reward",
        },
        {
            value: "aggressive",
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
    const availabilityOptions = [
        {
            value: "one_off",
            label: "One-off Projects",
            description: "Specific deliverables, short-term",
        },
        {
            value: "ongoing",
            label: "Ongoing Support",
            description: "Regular consultations, long-term",
        },
        {
            value: "project_based",
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
    $effect(() => {
        const timeoutId = setTimeout(() => {
            // Clean the data before auto-saving
            if (currentRole === "investor") {
                const cleanData = cleanRoleData(currentRole, investorData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            } else if (currentRole === "support") {
                const cleanData = cleanRoleData(currentRole, supporterData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            } else if (currentRole === "founder") {
                const cleanData = cleanRoleData(currentRole, founderData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    });

    function toggleInvestmentStage(stage: string) {
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
            // Ensure form data is updated before proceeding
            if (currentRole === "investor") {
                const cleanData = cleanRoleData(currentRole, investorData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            } else if (currentRole === "support") {
                const cleanData = cleanRoleData(currentRole, supporterData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            } else if (currentRole === "founder") {
                const cleanData = cleanRoleData(currentRole, founderData);
                onboarding.updateRoleSpecificData(currentRole, cleanData);
            }

            onboarding.markStepComplete("role-specific");
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
        <p class="text-muted">
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
                        <DollarSign class="w-5 h-5 text-role-investor" />
                        Investment Size
                    </CardTitle>
                    <p class="text-sm text-muted">
                        What's your typical investment range?
                    </p>
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
                                        <span class="font-medium"
                                            >{option.label}</span
                                        >
                                        <span class="text-sm text-muted"
                                            >{option.description}</span
                                        >
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
                        <TrendingUp class="w-5 h-5 text-role-investor" />
                        Preferred Investment Stages
                    </CardTitle>
                    <p class="text-sm text-muted">
                        Which stages are you most interested in? (Select
                        multiple)
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid gap-3">
                        {#each investmentStages as stage}
                            <button
                                class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                                onclick={() =>
                                    toggleInvestmentStage(stage.value)}
                            >
                                <Checkbox
                                    checked={investorData.preferredStages.includes(
                                        stage.value,
                                    )}
                                    onCheckedChange={() =>
                                        toggleInvestmentStage(stage.value)}
                                />
                                <div class="flex-1">
                                    <div class="font-medium">{stage.label}</div>
                                    <div class="text-sm text-muted">
                                        {stage.description}
                                    </div>
                                </div>
                            </button>
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
                        <Target class="w-5 h-5 text-role-investor" />
                        Risk Appetite
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                                        <span class="text-sm text-muted"
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
                        <Building class="w-5 h-5 text-role-investor" />
                        Portfolio Companies
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                        <Star class="w-5 h-5 text-role-investor" />
                        Investment History
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                    <p class="text-sm text-muted mt-2">
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
                        <HandHeart class="w-5 h-5 text-role-support" />
                        Types of Support You Offer
                    </CardTitle>
                    <p class="text-sm text-muted">
                        Select all the types of support you can provide
                    </p>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid gap-3">
                        {#each supportTypes as type}
                            <button
                                class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                                onclick={() => toggleSupportType(type)}
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
                            </button>
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
                        <Clock class="w-5 h-5 text-role-support" />
                        Availability
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                                        <span class="font-medium"
                                            >{option.label}</span
                                        >
                                        <span class="text-sm text-muted"
                                            >{option.description}</span
                                        >
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
                        <DollarSign class="w-5 h-5 text-role-support" />
                        Hourly Rate
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                        <Lightbulb class="w-5 h-5 text-role-support" />
                        Expertise
                    </CardTitle>
                    <p class="text-sm text-muted">
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
                    <p class="text-sm text-muted mt-2">
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
        <Button
            onclick={handleContinue}
            disabled={!isFormValid}
            size="lg"
            class="px-8"
        >
            Continue to Goals
        </Button>
    </div>

    <!-- Help Text -->
    <div class="text-center text-sm text-muted">
        <p>This information helps us show you the most relevant matches</p>
        <p>You can always update these preferences later in your profile</p>
    </div>
</div>
