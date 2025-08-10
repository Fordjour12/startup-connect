<script lang="ts">
    import { onboardingState } from "@/hooks/onboarding-state.svelte";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { Checkbox } from "@/components/ui/checkbox";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "@/components/ui/select";
    import { Badge } from "@/components/ui/badge";
    import { Progress } from "@/components/ui/progress";
    import {
        Building2,
        TrendingUp,
        Users,
        DollarSign,
        Target,
        Clock,
        MapPin,
        Briefcase,
        Award,
        Star,
    } from "@lucide/svelte";
    import { cn } from "@/utils";
    import {
        founderSchema,
        investorSchema,
        supporterSchema,
        type FounderInfo,
        type InvestorInfo,
        type SupporterInfo,
        type UserRole,
    } from "@/schemas/onboarding-schema";
    import { toast } from "svelte-sonner";
    import { z } from "zod";

    // Form data with proper typing for all roles
    let founderData = $state<FounderInfo>({
        startupName: "",
        startupStage: "" as FounderInfo["startupStage"],
        fundingNeeds: undefined,
        teamSize: 1,
        startupDescription: "",
        equityOffered: undefined,
    });

    let investorData = $state<InvestorInfo>({
        investmentSize: "" as InvestorInfo["investmentSize"],
        preferredStages: [],
        investmentHistory: "",
        riskAppetite: "" as InvestorInfo["riskAppetite"],
        portfolioCompanies: undefined,
    });

    let supporterData = $state<SupporterInfo>({
        supportType: [],
        availability: "" as SupporterInfo["availability"],
        hourlyRate: undefined,
        expertise: "",
    });

    // Validation state
    let validationErrors = $state<Record<string, string>>({});

    // Get current role from onboarding state
    let currentRole = $derived(onboardingState.formData.role as UserRole);

    // Initialize form data based on current role - only on first load
    let initialized = $state(false);
    let lastRole = $state<string | null>(null);

    $effect(() => {
        // Only initialize if we haven't initialized yet OR if the role has changed
        if ((!initialized || lastRole !== currentRole) && currentRole) {
            // Clear validation errors when role changes
            validationErrors = {};

            if (currentRole === "founder") {
                const formData =
                    onboardingState.formData as Partial<FounderInfo>;
                founderData = {
                    startupName: formData.startupName || "",
                    startupStage:
                        (formData.startupStage as FounderInfo["startupStage"]) ||
                        ("" as FounderInfo["startupStage"]),
                    fundingNeeds: formData.fundingNeeds,
                    teamSize: formData.teamSize || 1,
                    startupDescription: formData.startupDescription || "",
                    equityOffered: formData.equityOffered,
                };
            } else if (currentRole === "investor") {
                const formData =
                    onboardingState.formData as Partial<InvestorInfo>;
                investorData = {
                    investmentSize:
                        (formData.investmentSize as InvestorInfo["investmentSize"]) ||
                        ("" as InvestorInfo["investmentSize"]),
                    preferredStages:
                        (formData.preferredStages as InvestorInfo["preferredStages"]) ||
                        [],
                    investmentHistory: formData.investmentHistory || "",
                    riskAppetite:
                        (formData.riskAppetite as InvestorInfo["riskAppetite"]) ||
                        ("" as InvestorInfo["riskAppetite"]),
                    portfolioCompanies: formData.portfolioCompanies,
                };
            } else if (currentRole === "support") {
                const formData =
                    onboardingState.formData as Partial<SupporterInfo>;
                supporterData = {
                    supportType:
                        (formData.supportType as SupporterInfo["supportType"]) ||
                        [],
                    availability:
                        (formData.availability as SupporterInfo["availability"]) ||
                        ("" as SupporterInfo["availability"]),
                    hourlyRate: formData.hourlyRate,
                    expertise: formData.expertise || "",
                };
            }
            initialized = true;
            lastRole = currentRole;
        }
    });

    // Validate form based on current role
    function validateForm(): boolean {
        try {
            if (currentRole === "founder") {
                founderSchema.parse(founderData);
            } else if (currentRole === "investor") {
                investorSchema.parse(investorData);
            } else if (currentRole === "support") {
                supporterSchema.parse(supporterData);
            }
            validationErrors = {};
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const zodErrors = error.errors;
                const newErrors: Record<string, string> = {};

                zodErrors.forEach((err) => {
                    const field = err.path[0];
                    newErrors[field] = err.message;
                });

                validationErrors = newErrors;
            }
            return false;
        }
    }

    // Get error for a specific field
    function getFieldError(field: string): string {
        return validationErrors[field] || "";
    }

    // Handle next step
    const handleNext = () => {
        if (validateForm()) {
            // Update onboarding state with role-specific data
            if (currentRole === "founder") {
                onboardingState.updateFormData(founderData);
            } else if (currentRole === "investor") {
                onboardingState.updateFormData(investorData);
            } else if (currentRole === "support") {
                onboardingState.updateFormData(supporterData);
            }

            onboardingState.nextStep();
            toast.success(
                `${getRoleDisplayName(currentRole)} details saved successfully!`,
            );
        } else {
            toast.error("Please fix the errors before continuing.");
        }
    };

    // Helper function to get role display name
    function getRoleDisplayName(role: UserRole): string {
        const roleNames = {
            founder: "Founder",
            investor: "Investor",
            support: "Supporter",
        };
        return roleNames[role];
    }

    // Handle checkbox toggles for arrays
    function handleArrayToggle<T>(array: T[], item: T): T[] {
        if (array.includes(item)) {
            return array.filter((i) => i !== item);
        } else {
            return [...array, item];
        }
    }

    // Data for form options
    const startupStages = [
        {
            value: "idea",
            label: "Idea Stage",
            description: "Just an idea, no product yet",
        },
        {
            value: "pre_seed",
            label: "Pre-Seed",
            description: "Building MVP, no funding",
        },
        {
            value: "seed",
            label: "Seed",
            description: "Product launched, seeking seed funding",
        },
        {
            value: "series_a",
            label: "Series A",
            description: "Proven product, seeking Series A",
        },
        {
            value: "series_b",
            label: "Series B",
            description: "Scaling, seeking Series B",
        },
        {
            value: "growth",
            label: "Growth",
            description: "Established, focused on growth",
        },
    ] as const;

    const investmentSizes = [
        {
            value: "under_50k",
            label: "Under $50K",
            description: "Small investments",
        },
        {
            value: "50k_100k",
            label: "$50K - $100K",
            description: "Medium investments",
        },
        {
            value: "100k_500k",
            label: "$100K - $500K",
            description: "Large investments",
        },
        {
            value: "500k_1m",
            label: "$500K - $1M",
            description: "Major investments",
        },
        {
            value: "1m_plus",
            label: "$1M+",
            description: "Enterprise investments",
        },
    ] as const;

    const preferredStages = [
        { value: "pre_seed", label: "Pre-Seed" },
        { value: "seed", label: "Seed" },
        { value: "series_a", label: "Series A" },
        { value: "series_b", label: "Series B" },
        { value: "growth", label: "Growth" },
    ] as const;

    const riskAppetites = [
        {
            value: "conservative",
            label: "Conservative",
            description: "Low risk, stable returns",
        },
        {
            value: "moderate",
            label: "Moderate",
            description: "Balanced risk and return",
        },
        {
            value: "aggressive",
            label: "Aggressive",
            description: "High risk, high potential return",
        },
    ] as const;

    const supportTypes = [
        { value: "mentorship", label: "Mentorship", icon: "🎯" },
        { value: "legal_advice", label: "Legal Advice", icon: "⚖️" },
        { value: "marketing", label: "Marketing", icon: "📢" },
        { value: "technical", label: "Technical", icon: "💻" },
        { value: "financial", label: "Financial", icon: "💰" },
        { value: "operations", label: "Operations", icon: "⚙️" },
        { value: "sales", label: "Sales", icon: "📈" },
        { value: "hr", label: "HR", icon: "👥" },
        { value: "design", label: "Design", icon: "🎨" },
    ] as const;

    const availabilityOptions = [
        {
            value: "one_off",
            label: "One-off Consultations",
            description: "Single sessions",
        },
        {
            value: "ongoing",
            label: "Ongoing Support",
            description: "Regular check-ins",
        },
        {
            value: "project_based",
            label: "Project-based",
            description: "Complete project support",
        },
    ] as const;
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
        <div
            class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
        >
            {#if currentRole === "founder"}
                <Building2 class="w-6 h-6 text-primary" />
            {:else if currentRole === "investor"}
                <TrendingUp class="w-6 h-6 text-primary" />
            {:else if currentRole === "support"}
                <Users class="w-6 h-6 text-primary" />
            {/if}
        </div>
        <h2 class="text-2xl font-semibold">
            {#if currentRole === "founder"}
                Tell us about your startup
            {:else if currentRole === "investor"}
                Tell us about your investment profile
            {:else if currentRole === "support"}
                Tell us about your support services
            {/if}
        </h2>
        <p class="text-muted-foreground">
            {#if currentRole === "founder"}
                Help investors and partners understand your startup better
            {:else if currentRole === "investor"}
                Help founders understand your investment criteria
            {:else if currentRole === "support"}
                Help founders understand how you can support them
            {/if}
        </p>
    </div>

    <!-- Founder Form -->
    {#if currentRole === "founder"}
        <!-- Startup Information -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <Building2 class="w-5 h-5" />
                    <span>Startup Information</span>
                </CardTitle>
                <CardDescription>
                    Basic information about your startup
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Startup Name -->
                <div class="space-y-2">
                    <Label for="startupName">Startup Name *</Label>
                    <Input
                        id="startupName"
                        type="text"
                        placeholder="Enter your startup name"
                        bind:value={founderData.startupName}
                        class={cn(
                            getFieldError("startupName") &&
                                "border-destructive",
                        )}
                    />
                    {#if getFieldError("startupName")}
                        <p class="text-sm text-destructive">
                            {getFieldError("startupName")}
                        </p>
                    {/if}
                </div>

                <!-- Startup Stage -->
                <div class="space-y-2">
                    <Label for="startupStage">Startup Stage *</Label>
                    <Select type="single" bind:value={founderData.startupStage}>
                        <SelectTrigger
                            class={cn(
                                getFieldError("startupStage") &&
                                    "border-destructive",
                                "w-full",
                            )}
                        >
                            {founderData.startupStage ||
                                "Select your startup stage"}
                        </SelectTrigger>
                        <SelectContent>
                            {#each startupStages as stage}
                                <SelectItem value={stage.value}>
                                    <div>
                                        <div class="font-medium">
                                            {stage.label}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground"
                                        >
                                            {stage.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                    {#if getFieldError("startupStage")}
                        <p class="text-sm text-destructive">
                            {getFieldError("startupStage")}
                        </p>
                    {/if}
                </div>

                <!-- Team Size -->
                <div class="space-y-2">
                    <Label for="teamSize">Team Size *</Label>
                    <Input
                        id="teamSize"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="Number of team members"
                        bind:value={founderData.teamSize}
                        class={cn(
                            getFieldError("teamSize") && "border-destructive",
                        )}
                    />
                    {#if getFieldError("teamSize")}
                        <p class="text-sm text-destructive">
                            {getFieldError("teamSize")}
                        </p>
                    {/if}
                </div>
            </CardContent>
        </Card>

        <!-- Funding Information -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <DollarSign class="w-5 h-5" />
                    <span>Funding Information</span>
                </CardTitle>
                <CardDescription>
                    Details about your funding needs and equity
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Funding Needs -->
                <div class="space-y-2">
                    <Label for="fundingNeeds">Funding Needs (USD)</Label>
                    <Input
                        id="fundingNeeds"
                        type="number"
                        min="0"
                        placeholder="Amount you're seeking (optional)"
                        bind:value={founderData.fundingNeeds}
                        class={cn(
                            getFieldError("fundingNeeds") &&
                                "border-destructive",
                        )}
                    />
                    {#if getFieldError("fundingNeeds")}
                        <p class="text-sm text-destructive">
                            {getFieldError("fundingNeeds")}
                        </p>
                    {/if}
                </div>

                <!-- Equity Offered -->
                <div class="space-y-2">
                    <Label for="equityOffered">Equity Offered (%)</Label>
                    <Input
                        id="equityOffered"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Percentage of equity (optional)"
                        bind:value={founderData.equityOffered}
                        class={cn(
                            getFieldError("equityOffered") &&
                                "border-destructive",
                        )}
                    />
                    {#if getFieldError("equityOffered")}
                        <p class="text-sm text-destructive">
                            {getFieldError("equityOffered")}
                        </p>
                    {/if}
                </div>
            </CardContent>
        </Card>

        <!-- Startup Description -->
        <Card>
            <CardHeader>
                <CardTitle>Startup Description *</CardTitle>
                <CardDescription>
                    Tell us about your startup, what problem you're solving, and
                    your vision
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Describe your startup, the problem you're solving, your solution, target market, and vision..."
                    bind:value={founderData.startupDescription}
                    rows={6}
                    maxlength={1000}
                    class={cn(
                        getFieldError("startupDescription") &&
                            "border-destructive",
                    )}
                />
                <p class="text-xs text-muted-foreground mt-2">
                    {founderData.startupDescription?.length || 0}/1000
                    characters
                </p>
                {#if getFieldError("startupDescription")}
                    <p class="text-sm text-destructive mt-2">
                        {getFieldError("startupDescription")}
                    </p>
                {/if}
            </CardContent>
        </Card>
    {/if}

    <!-- Investor Form -->
    {#if currentRole === "investor"}
        <!-- Investment Profile -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <TrendingUp class="w-5 h-5" />
                    <span>Investment Profile</span>
                </CardTitle>
                <CardDescription>
                    Tell us about your investment preferences and criteria
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Investment Size -->
                <div class="space-y-2">
                    <Label for="investmentSize">Investment Size Range *</Label>
                    <Select
                        type="single"
                        bind:value={investorData.investmentSize}
                    >
                        <SelectTrigger
                            class={cn(
                                getFieldError("investmentSize") &&
                                    "border-destructive",
                            )}
                        >
                            {investorData.investmentSize ||
                                "Select your investment size range"}
                        </SelectTrigger>
                        <SelectContent>
                            {#each investmentSizes as size}
                                <SelectItem value={size.value}>
                                    <div>
                                        <div class="font-medium">
                                            {size.label}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground"
                                        >
                                            {size.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                    {#if getFieldError("investmentSize")}
                        <p class="text-sm text-destructive">
                            {getFieldError("investmentSize")}
                        </p>
                    {/if}
                </div>

                <!-- Preferred Stages -->
                <div class="space-y-2">
                    <Label>Preferred Stages *</Label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {#each preferredStages as stage}
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id={stage.value}
                                    checked={investorData.preferredStages.includes(
                                        stage.value,
                                    )}
                                    onCheckedChange={() =>
                                        (investorData.preferredStages =
                                            handleArrayToggle(
                                                investorData.preferredStages,
                                                stage.value,
                                            ))}
                                />
                                <Label
                                    for={stage.value}
                                    class="text-sm cursor-pointer"
                                >
                                    {stage.label}
                                </Label>
                            </div>
                        {/each}
                    </div>
                    {#if getFieldError("preferredStages")}
                        <p class="text-sm text-destructive">
                            {getFieldError("preferredStages")}
                        </p>
                    {/if}
                </div>

                <!-- Risk Appetite -->
                <div class="space-y-2">
                    <Label for="riskAppetite">Risk Appetite *</Label>
                    <Select
                        type="single"
                        bind:value={investorData.riskAppetite}
                    >
                        <SelectTrigger
                            class={cn(
                                getFieldError("riskAppetite") &&
                                    "border-destructive",
                            )}
                        >
                            {investorData.riskAppetite ||
                                "Select your risk appetite"}
                        </SelectTrigger>
                        <SelectContent>
                            {#each riskAppetites as appetite}
                                <SelectItem value={appetite.value}>
                                    <div>
                                        <div class="font-medium">
                                            {appetite.label}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground"
                                        >
                                            {appetite.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                    {#if getFieldError("riskAppetite")}
                        <p class="text-sm text-destructive">
                            {getFieldError("riskAppetite")}
                        </p>
                    {/if}
                </div>

                <!-- Portfolio Companies -->
                <div class="space-y-2">
                    <Label for="portfolioCompanies"
                        >Number of Portfolio Companies</Label
                    >
                    <Input
                        id="portfolioCompanies"
                        type="number"
                        min="0"
                        placeholder="How many companies in your portfolio (optional)"
                        bind:value={investorData.portfolioCompanies}
                        class={cn(
                            getFieldError("portfolioCompanies") &&
                                "border-destructive",
                        )}
                    />
                    {#if getFieldError("portfolioCompanies")}
                        <p class="text-sm text-destructive">
                            {getFieldError("portfolioCompanies")}
                        </p>
                    {/if}
                </div>
            </CardContent>
        </Card>

        <!-- Investment History -->
        <Card>
            <CardHeader>
                <CardTitle>Investment History</CardTitle>
                <CardDescription>
                    Tell us about your past investments and experience
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Describe your investment history, notable exits, and experience in the startup ecosystem..."
                    bind:value={investorData.investmentHistory}
                    rows={4}
                    maxlength={500}
                    class={cn(
                        getFieldError("investmentHistory") &&
                            "border-destructive",
                    )}
                />
                <p class="text-xs text-muted-foreground mt-2">
                    {investorData.investmentHistory?.length || 0}/500 characters
                </p>
                {#if getFieldError("investmentHistory")}
                    <p class="text-sm text-destructive mt-2">
                        {getFieldError("investmentHistory")}
                    </p>
                {/if}
            </CardContent>
        </Card>
    {/if}

    <!-- Supporter Form -->
    {#if currentRole === "support"}
        <!-- Support Services -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center space-x-2">
                    <Users class="w-5 h-5" />
                    <span>Support Services</span>
                </CardTitle>
                <CardDescription>
                    What types of support can you provide to founders?
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Support Types -->
                <div class="space-y-2">
                    <Label>Types of Support *</Label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {#each supportTypes as type}
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id={type.value}
                                    checked={supporterData.supportType.includes(
                                        type.value,
                                    )}
                                    onCheckedChange={() =>
                                        (supporterData.supportType =
                                            handleArrayToggle(
                                                supporterData.supportType,
                                                type.value,
                                            ))}
                                />
                                <Label
                                    for={type.value}
                                    class="text-sm cursor-pointer flex items-center space-x-2"
                                >
                                    <span>{type.icon}</span>
                                    <span>{type.label}</span>
                                </Label>
                            </div>
                        {/each}
                    </div>
                    {#if getFieldError("supportType")}
                        <p class="text-sm text-destructive">
                            {getFieldError("supportType")}
                        </p>
                    {/if}
                </div>

                <!-- Availability -->
                <div class="space-y-2">
                    <Label for="availability">Availability *</Label>
                    <Select
                        type="single"
                        bind:value={supporterData.availability}
                    >
                        <SelectTrigger
                            class={cn(
                                getFieldError("availability") &&
                                    "border-destructive",
                            )}
                        >
                            {supporterData.availability ||
                                "Select your availability"}
                        </SelectTrigger>
                        <SelectContent>
                            {#each availabilityOptions as option}
                                <SelectItem value={option.value}>
                                    <div>
                                        <div class="font-medium">
                                            {option.label}
                                        </div>
                                        <div
                                            class="text-sm text-muted-foreground"
                                        >
                                            {option.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                    {#if getFieldError("availability")}
                        <p class="text-sm text-destructive">
                            {getFieldError("availability")}
                        </p>
                    {/if}
                </div>

                <!-- Hourly Rate -->
                <div class="space-y-2">
                    <Label for="hourlyRate">Hourly Rate (USD)</Label>
                    <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        placeholder="Your hourly rate (optional)"
                        bind:value={supporterData.hourlyRate}
                        class={cn(
                            getFieldError("hourlyRate") && "border-destructive",
                        )}
                    />
                    {#if getFieldError("hourlyRate")}
                        <p class="text-sm text-destructive">
                            {getFieldError("hourlyRate")}
                        </p>
                    {/if}
                </div>
            </CardContent>
        </Card>

        <!-- Expertise -->
        <Card>
            <CardHeader>
                <CardTitle>Expertise & Experience</CardTitle>
                <CardDescription>
                    Tell us about your expertise and how you can help founders
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Describe your expertise, experience, and how you can help founders succeed..."
                    bind:value={supporterData.expertise}
                    rows={4}
                    maxlength={500}
                    class={cn(
                        getFieldError("expertise") && "border-destructive",
                    )}
                />
                <p class="text-xs text-muted-foreground mt-2">
                    {supporterData.expertise?.length || 0}/500 characters
                </p>
                {#if getFieldError("expertise")}
                    <p class="text-sm text-destructive mt-2">
                        {getFieldError("expertise")}
                    </p>
                {/if}
            </CardContent>
        </Card>
    {/if}

    <!-- Tips Card -->
    <Card class="border-blue-200 bg-blue-50/50">
        <CardContent class="pt-6">
            <div class="flex items-start space-x-3">
                <div
                    class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5"
                >
                    <span class="text-white text-xs">💡</span>
                </div>
                <div class="text-sm">
                    <p class="font-medium text-blue-900 mb-1">Profile Tips</p>
                    <ul class="text-blue-700 space-y-1">
                        {#if currentRole === "founder"}
                            <li>
                                • Be specific about your startup stage and
                                funding needs
                            </li>
                            <li>
                                • Clearly describe the problem you're solving
                            </li>
                            <li>
                                • Mention your team size and key achievements
                            </li>
                            <li>• Be realistic about equity offerings</li>
                        {:else if currentRole === "investor"}
                            <li>• Be clear about your investment criteria</li>
                            <li>
                                • Mention your investment history and expertise
                            </li>
                            <li>
                                • Specify your preferred stages and risk
                                appetite
                            </li>
                            <li>• Include any notable exits or successes</li>
                        {:else if currentRole === "support"}
                            <li>
                                • Be specific about the types of support you
                                offer
                            </li>
                            <li>
                                • Mention your relevant experience and expertise
                            </li>
                            <li>
                                • Be clear about your availability and rates
                            </li>
                            <li>
                                • Highlight any specializations or unique value
                            </li>
                        {/if}
                    </ul>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4">
        <Button
            variant="outline"
            onclick={() => onboardingState.previousStep()}
        >
            Back
        </Button>

        <Button onclick={handleNext}>Continue</Button>
    </div>
</div>
