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
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "@/components/ui/select";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Badge } from "@/components/ui/badge";
    import {
        Building2,
        DollarSign,
        Users,
        Target,
        TrendingUp,
        Briefcase,
    } from "@lucide/svelte";
    import { getRoleSpecificSchema } from "@/schemas/onboarding-schema";

    let currentRole = $derived(onboardingState.formData.role || "founder");
    let roleData = $derived(
        (onboardingState.formData as any)[currentRole] || {},
    );

    // Founder-specific data
    let founderData = $derived(roleData as any);

    // Investor-specific data
    let investorData = $derived(roleData as any);

    // Supporter-specific data
    let supporterData = $derived(roleData as any);

    // Initialize arrays if they don't exist
    $effect(() => {
        if (currentRole === "investor" && !investorData.preferredStages) {
            investorData.preferredStages = [];
        }
        if (currentRole === "supporter" && !supporterData.supportType) {
            supporterData.supportType = [];
        }
    });

    function updateRoleData(data: any) {
        onboardingState.updateFormData({
            [currentRole]: { ...roleData, ...data },
        });
    }

    // Helper functions for array-based checkboxes
    function isPreferredStageSelected(stage: string): boolean {
        return investorData.preferredStages?.includes(stage) || false;
    }

    function togglePreferredStage(stage: string) {
        const currentStages = investorData.preferredStages || [];
        if (currentStages.includes(stage)) {
            investorData.preferredStages = currentStages.filter(
                (s: string) => s !== stage,
            );
        } else {
            investorData.preferredStages = [...currentStages, stage];
        }
        updateRoleData({ preferredStages: investorData.preferredStages });
    }

    function isSupportTypeSelected(type: string): boolean {
        return supporterData.supportType?.includes(type) || false;
    }

    function toggleSupportType(type: string) {
        const currentTypes = supporterData.supportType || [];
        if (currentTypes.includes(type)) {
            supporterData.supportType = currentTypes.filter(
                (t: string) => t !== type,
            );
        } else {
            supporterData.supportType = [...currentTypes, type];
        }
        updateRoleData({ supportType: supporterData.supportType });
    }

    // Validation and submission
    function validateRoleData(): boolean {
        // Clear any previous errors
        onboardingState.clearErrors();

        // Get the current role data
        const dataToValidate = { ...roleData };

        // Convert numeric fields to proper types
        const numericFields = [
            "teamSize",
            "fundingNeeds",
            "equityOffered",
            "portfolioCompanies",
            "hourlyRate",
        ];
        numericFields.forEach((field) => {
            if (
                dataToValidate[field] !== undefined &&
                dataToValidate[field] !== null &&
                dataToValidate[field] !== ""
            ) {
                dataToValidate[field] = Number(dataToValidate[field]);
            }
        });

        console.log("Validating data for role:", currentRole);
        console.log("Data to validate:", dataToValidate);

        // Get the schema for the current role
        const schema = getRoleSpecificSchema(currentRole as any);

        try {
            // Validate with the schema
            schema.parse(dataToValidate);
            console.log("Validation passed!");
            return true;
        } catch (error: any) {
            console.log("Validation failed:", error);

            // Handle Zod validation errors
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: any) => {
                    const fieldName = err.path[0]; // Get the field name
                    const errorMessage = err.message;

                    console.log(`Field error: ${fieldName} - ${errorMessage}`);
                    onboardingState.setError(
                        fieldName,
                        errorMessage,
                        "validation",
                    );
                });
            }

            return false;
        }
    }

    async function handleSubmit() {
        // Clear previous errors
        onboardingState.clearErrors();

        // Debug: Log the current role data
        console.log("Current role:", currentRole);
        console.log("Role data to validate:", roleData);

        // Validate the role-specific data
        if (!validateRoleData()) {
            console.log("Validation failed");
            return;
        }

        console.log("Validation passed, moving to next step");
        // Complete the current step and move to next
        if (onboardingState.nextStep()) {
            // Save progress
            await onboardingState.saveProgress();
        }
    }

    const startupStages = [
        {
            value: "idea",
            label: "Idea Stage",
            description: "Just an idea, no MVP yet",
        },
        {
            value: "pre_seed",
            label: "Pre-seed",
            description: "MVP in development",
        },
        {
            value: "seed",
            label: "Seed",
            description: "MVP ready, initial traction",
        },
        {
            value: "series_a",
            label: "Series A",
            description: "Product-market fit, scaling",
        },
        {
            value: "series_b",
            label: "Series B",
            description: "Growth stage, market expansion",
        },
        {
            value: "growth",
            label: "Growth",
            description: "Established, rapid growth",
        },
    ];

    const investmentSizes = [
        { value: "under_50k", label: "Under $50K" },
        { value: "50k_100k", label: "$50K - $100K" },
        { value: "100k_500k", label: "$100K - $500K" },
        { value: "500k_1m", label: "$500K - $1M" },
        { value: "1m_plus", label: "$1M+" },
    ];

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
            description: "High risk, high potential",
        },
    ];

    const supportTypes = [
        { value: "mentorship", label: "Mentorship", icon: "👨‍🏫" },
        { value: "legal_advice", label: "Legal Advice", icon: "⚖️" },
        { value: "marketing", label: "Marketing", icon: "📢" },
        { value: "technical", label: "Technical", icon: "💻" },
        { value: "financial", label: "Financial", icon: "💰" },
        { value: "operations", label: "Operations", icon: "⚙️" },
        { value: "sales", label: "Sales", icon: "📈" },
        { value: "hr", label: "HR", icon: "👥" },
        { value: "design", label: "Design", icon: "🎨" },
    ];

    const availabilityOptions = [
        { value: "one_off", label: "One-off consultations" },
        { value: "ongoing", label: "Ongoing support" },
        { value: "project_based", label: "Project-based work" },
    ];
</script>

<div class="space-y-6">
    <!-- Header -->
    <!-- <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Role Details</h1>
        <p class="text-muted-foreground">
            Tell us more about your specific role and experience.
        </p>
    </div> -->

    {#if currentRole === "founder"}
        <!-- Founder Details -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Building2 class="w-5 h-5" />
                    Startup Information
                </CardTitle>
                <CardDescription>
                    Tell us about your startup and what you're building
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label for="startup-name">Startup Name *</Label>
                    <Input
                        id="startup-name"
                        placeholder="Enter your startup name"
                        bind:value={founderData.startupName}
                        oninput={() =>
                            updateRoleData({
                                startupName: founderData.startupName,
                            })}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="startup-stage">Startup Stage *</Label>
                    <Select
                        type="single"
                        bind:value={founderData.startupStage}
                        onValueChange={() =>
                            updateRoleData({
                                startupStage: founderData.startupStage,
                            })}
                    >
                        <SelectTrigger>Select your startup stage</SelectTrigger>
                        <SelectContent>
                            {#each startupStages as stage}
                                <SelectItem value={stage.value}>
                                    <div class="flex flex-col">
                                        <span class="font-medium"
                                            >{stage.label}</span
                                        >
                                        <span
                                            class="text-xs text-muted-foreground"
                                            >{stage.description}</span
                                        >
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <Label for="startup-description"
                        >Startup Description *</Label
                    >
                    <Textarea
                        id="startup-description"
                        placeholder="Describe your startup, what problem you're solving, and your vision..."
                        bind:value={founderData.startupDescription}
                        oninput={() =>
                            updateRoleData({
                                startupDescription:
                                    founderData.startupDescription,
                            })}
                        rows={4}
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label for="team-size">Team Size *</Label>
                        <Input
                            id="team-size"
                            type="number"
                            placeholder="Number of team members"
                            bind:value={founderData.teamSize}
                            oninput={() =>
                                updateRoleData({
                                    teamSize: founderData.teamSize,
                                })}
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="funding-needs">Funding Needs (USD)</Label>
                        <Input
                            id="funding-needs"
                            type="number"
                            placeholder="Amount needed"
                            bind:value={founderData.fundingNeeds}
                            oninput={() =>
                                updateRoleData({
                                    fundingNeeds: founderData.fundingNeeds,
                                })}
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="equity-offered">Equity Offered (%)</Label>
                    <Input
                        id="equity-offered"
                        type="number"
                        placeholder="Percentage of equity"
                        bind:value={founderData.equityOffered}
                        oninput={() =>
                            updateRoleData({
                                equityOffered: founderData.equityOffered,
                            })}
                    />
                </div>
            </CardContent>
        </Card>
    {:else if currentRole === "investor"}
        <!-- Investor Details -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <DollarSign class="w-5 h-5" />
                    Investment Profile
                </CardTitle>
                <CardDescription>
                    Tell us about your investment preferences and experience
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label for="investment-size">Investment Size Range *</Label>
                    <Select
                        type="single"
                        bind:value={investorData.investmentSize}
                        onValueChange={() =>
                            updateRoleData({
                                investmentSize: investorData.investmentSize,
                            })}
                    >
                        <SelectTrigger>
                            "Select your investment size range"
                        </SelectTrigger>
                        <SelectContent>
                            {#each investmentSizes as size}
                                <SelectItem value={size.value}
                                    >{size.label}</SelectItem
                                >
                            {/each}
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <Label>Preferred Investment Stages *</Label>
                    <div class="grid grid-cols-2 gap-2">
                        {#each startupStages as stage}
                            <label class="flex items-center space-x-2">
                                <Checkbox
                                    checked={isPreferredStageSelected(
                                        stage.value,
                                    )}
                                    onclick={() =>
                                        togglePreferredStage(stage.value)}
                                />
                                <span>{stage.label}</span>
                            </label>
                        {/each}
                    </div>
                    {#if investorData.preferredStages && investorData.preferredStages.length === 0}
                        <p class="text-sm text-destructive">
                            Please select at least one preferred stage
                        </p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <Label for="risk-appetite">Risk Appetite *</Label>
                    <Select
                        type="single"
                        bind:value={investorData.riskAppetite}
                        onValueChange={() =>
                            updateRoleData({
                                riskAppetite: investorData.riskAppetite,
                            })}
                    >
                        <SelectTrigger>Select your risk appetite</SelectTrigger>
                        <SelectContent>
                            {#each riskAppetites as risk}
                                <SelectItem value={risk.value}>
                                    <div class="flex flex-col">
                                        <span class="font-medium"
                                            >{risk.label}</span
                                        >
                                        <span
                                            class="text-xs text-muted-foreground"
                                            >{risk.description}</span
                                        >
                                    </div>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label for="portfolio-companies"
                            >Portfolio Companies</Label
                        >
                        <Input
                            id="portfolio-companies"
                            type="number"
                            placeholder="Number of companies"
                            bind:value={investorData.portfolioCompanies}
                            oninput={() =>
                                updateRoleData({
                                    portfolioCompanies:
                                        investorData.portfolioCompanies,
                                })}
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="hourly-rate">Hourly Rate (USD)</Label>
                        <Input
                            id="hourly-rate"
                            type="number"
                            placeholder="Your hourly rate"
                            bind:value={investorData.hourlyRate}
                            onchange={() =>
                                updateRoleData({
                                    hourlyRate: investorData.hourlyRate,
                                })}
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="investment-history">Investment History</Label>
                    <Textarea
                        id="investment-history"
                        placeholder="Describe your investment experience, successful exits, or notable investments..."
                        bind:value={investorData.investmentHistory}
                        onchange={() =>
                            updateRoleData({
                                investmentHistory:
                                    investorData.investmentHistory,
                            })}
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    {:else if currentRole === "supporter"}
        <!-- Supporter Details -->
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Users class="w-5 h-5" />
                    Support Services
                </CardTitle>
                <CardDescription>
                    Tell us about the services you provide and your expertise
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Support Types *</Label>
                    <div class="grid grid-cols-2 gap-2">
                        {#each supportTypes as type}
                            <label class="flex items-center space-x-2">
                                <Checkbox
                                    checked={isSupportTypeSelected(type.value)}
                                    onclick={() =>
                                        toggleSupportType(type.value)}
                                />
                                <span>{type.icon} {type.label}</span>
                            </label>
                        {/each}
                    </div>
                    {#if supporterData.supportType && supporterData.supportType.length === 0}
                        <p class="text-sm text-destructive">
                            Please select at least one support type
                        </p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <Label for="availability">Availability *</Label>
                    <Select
                        type="single"
                        bind:value={supporterData.availability}
                        onValueChange={() =>
                            updateRoleData({
                                availability: supporterData.availability,
                            })}
                    >
                        <SelectTrigger>Select your availability"</SelectTrigger>
                        <SelectContent>
                            {#each availabilityOptions as option}
                                <SelectItem value={option.value}
                                    >{option.label}</SelectItem
                                >
                            {/each}
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <Label for="hourly-rate">Hourly Rate (USD)</Label>
                    <Input
                        id="hourly-rate"
                        type="number"
                        placeholder="Your hourly rate"
                        bind:value={supporterData.hourlyRate}
                        oninput={() =>
                            updateRoleData({
                                hourlyRate: supporterData.hourlyRate,
                            })}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="expertise">Areas of Expertise</Label>
                    <Textarea
                        id="expertise"
                        placeholder="Describe your specific areas of expertise, experience, and what makes you unique..."
                        bind:value={supporterData.expertise}
                        oninput={() =>
                            updateRoleData({
                                expertise: supporterData.expertise,
                            })}
                        rows={4}
                    />
                </div>
            </CardContent>
        </Card>
    {/if}

    <!-- Additional Information -->
    <Card>
        <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
                Any other details you'd like to share about your role and
                experience
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea
                placeholder="Share any additional information about your experience, achievements, or specific requirements..."
                bind:value={roleData.additionalInfo}
                oninput={() =>
                    updateRoleData({ additionalInfo: roleData.additionalInfo })}
                rows={4}
            />
        </CardContent>
    </Card>

    <!-- Debug Information (temporary) -->
    <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <p class="text-sm text-blue-800 font-medium mb-2">Debug Info:</p>
        <p class="text-xs text-blue-700">Current Role: {currentRole}</p>
        <p class="text-xs text-blue-700">
            Form Data: {JSON.stringify(roleData, null, 2)}
        </p>
        <p class="text-xs text-blue-700">
            Errors: {JSON.stringify(onboardingState.errors, null, 2)}
        </p>
    </div>

    <!-- Validation Error Display -->
    {#if Object.keys(onboardingState.errors).length > 0}
        <div
            class="bg-destructive/10 border border-destructive/20 rounded-md p-3"
        >
            <p class="text-sm text-destructive font-medium mb-2">
                Please fix the following errors:
            </p>
            <ul class="text-sm text-destructive space-y-1">
                {#each Object.entries(onboardingState.errors) as [field, error]}
                    <li>• {error.message}</li>
                {/each}
            </ul>
        </div>
    {/if}

    <!-- Submit Button -->
    <div class="flex justify-end pt-6">
        <Button
            onclick={() => handleSubmit()}
            disabled={onboardingState.isSubmitting}
            class="min-w-[120px]"
        >
            {#if onboardingState.isSubmitting}
                Saving...
            {:else}
                Continue
            {/if}
        </Button>
    </div>
</div>
