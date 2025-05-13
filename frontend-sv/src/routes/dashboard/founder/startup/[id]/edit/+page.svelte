<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "$lib/components/ui/select";
    import { Textarea } from "$lib/components/ui/textarea";
    import { toast } from "svelte-sonner";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        dataType: "json",
        onUpdated: ({ form: f }) => {
            if (f.message && f.valid) {
                toast.success("Startup profile updated successfully!");
            } else if (f.message && !f.valid) {
                toast.error("Failed to update: " + String(f.message));
            }
        },
        onError: (event) => {
            toast.error("An error occurred: " + event.result.error.message);
        },
    });
    const { form: formData, enhance, errors, submitting, message } = form;

    // Initialize optional nested objects if they are undefined to allow binding
    if ($formData.socialMedia === undefined) {
        $formData.socialMedia = {
            twitter: undefined,
            linkedin: undefined,
            facebook: undefined,
            instagram: undefined,
        };
    }
    if ($formData.traction === undefined) {
        $formData.traction = {
            users: undefined,
            revenue: undefined,
            growth: undefined,
            partnerships: undefined,
        };
    }

    // Team members
    function addTeamMember() {
        const currentTeamMembers = $formData.teamMembers || [];
        $formData.teamMembers = [
            ...currentTeamMembers,
            { name: "", role: "", bio: "", linkedin: "" },
        ];
    }

    function removeTeamMember(index: number) {
        const currentTeamMembers = $formData.teamMembers || [];
        $formData.teamMembers = currentTeamMembers.filter(
            (_, i) => i !== index,
        );
    }

    // Timeline milestones
    function addPastMilestone() {
        const timeline = $formData.timeline || { past: [], future: [] };
        const currentPast = timeline.past || [];
        $formData.timeline = {
            ...timeline,
            past: [
                ...currentPast,
                {
                    date: "",
                    title: "",
                    description: "",
                    type: "achievement" as const,
                },
            ],
        };
    }

    function removePastMilestone(index: number) {
        if (!$formData.timeline?.past) return;
        $formData.timeline = {
            ...$formData.timeline,
            past: $formData.timeline.past.filter((_, i) => i !== index),
        };
    }

    function addFutureMilestone() {
        const timeline = $formData.timeline || { past: [], future: [] };
        const currentFuture = timeline.future || [];
        $formData.timeline = {
            ...timeline,
            future: [
                ...currentFuture,
                {
                    date: "",
                    title: "",
                    description: "",
                    type: "launch" as const,
                },
            ],
        };
    }

    function removeFutureMilestone(index: number) {
        if (!$formData.timeline?.future) return;
        $formData.timeline = {
            ...$formData.timeline,
            future: $formData.timeline.future.filter((_, i) => i !== index),
        };
    }
</script>

<div class="space-y-8 max-w-3xl mx-auto py-10">
    <h1 class="text-3xl font-bold tracking-tight">
        Edit Startup: {data.startupId}
    </h1>
    <p class="text-muted-foreground">
        Update the details for your startup. Click save when you're done.
    </p>

    <form method="POST" use:enhance class="space-y-8">
        <!-- Basic Information -->
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your startup.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="name">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Startup Name</Form.Label>
                            <Input
                                {...props}
                                bind:value={$formData.name}
                                placeholder="e.g., Innovatech Solutions"
                            />
                        {/snippet}
                    </Form.Control>
                    <p class="text-sm text-muted-foreground mt-1">
                        The official name of your startup.
                    </p>
                    <Form.FieldErrors />
                </Form.Field>

                <Form.Field {form} name="description">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Description</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.description}
                                placeholder="Describe your startup's mission and vision..."
                                rows={5}
                            />
                        {/snippet}
                    </Form.Control>
                    <p class="text-sm text-muted-foreground mt-1">
                        A brief overview of what your startup does.
                    </p>
                    <Form.FieldErrors />
                </Form.Field>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Field {form} name="industry">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Industry</Form.Label>
                                <Select
                                    type="single"
                                    {...props}
                                    bind:value={$formData.industry}
                                >
                                    <SelectTrigger class="w-full">
                                        <div
                                            class="w-full text-left placeholder:text-muted-foreground"
                                        >
                                            {$formData.industry ||
                                                "Select industry"}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technology"
                                            >Technology</SelectItem
                                        >
                                        <SelectItem value="Healthcare"
                                            >Healthcare</SelectItem
                                        >
                                        <SelectItem value="Fintech"
                                            >Fintech</SelectItem
                                        >
                                        <SelectItem value="Clean Energy"
                                            >Clean Energy</SelectItem
                                        >
                                        <SelectItem value="E-commerce"
                                            >E-commerce</SelectItem
                                        >
                                        <!-- Add more industries as needed -->
                                    </SelectContent>
                                </Select>
                            {/snippet}
                        </Form.Control>
                        <p class="text-sm text-muted-foreground mt-1">
                            The primary industry your startup operates in.
                        </p>
                        <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name="location">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Location</Form.Label>
                                <Input
                                    {...props}
                                    bind:value={$formData.location}
                                    placeholder="e.g., San Francisco, CA"
                                />
                            {/snippet}
                        </Form.Control>
                        <p class="text-sm text-muted-foreground mt-1">
                            The city and country where your startup is based.
                        </p>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
            </CardContent>
        </Card>

        <!-- Company Details -->
        <Card>
            <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription
                    >Additional information about your company.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Field {form} name="foundedYear">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Founded Year</Form.Label>
                                <Input
                                    {...props}
                                    type="number"
                                    bind:value={$formData.foundedYear}
                                    placeholder="e.g., 2020"
                                />
                            {/snippet}
                        </Form.Control>
                        <p class="text-sm text-muted-foreground mt-1">
                            The year your startup was founded.
                        </p>
                        <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name="teamSize">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Team Size</Form.Label>
                                <Input
                                    {...props}
                                    type="number"
                                    bind:value={$formData.teamSize}
                                    placeholder="e.g., 10"
                                />
                            {/snippet}
                        </Form.Control>
                        <p class="text-sm text-muted-foreground mt-1">
                            The number of full-time employees.
                        </p>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>

                <Form.Field {form} name="website">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Website URL</Form.Label>
                            <Input
                                {...props}
                                type="url"
                                bind:value={$formData.website}
                                placeholder="https://example.com"
                            />
                        {/snippet}
                    </Form.Control>
                    <p class="text-sm text-muted-foreground mt-1">
                        Your startup's official website.
                    </p>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Team Members -->
        <Card>
            <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription
                    >Information about your core team.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                {#if $formData.teamMembers && $formData.teamMembers.length > 0}
                    {#each $formData.teamMembers as member, index}
                        <div class="p-4 border rounded-lg space-y-4 relative">
                            <h4 class="font-medium">Team Member {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                onclick={() => removeTeamMember(index)}
                            >
                                X <span class="sr-only">Remove team member</span
                                >
                            </Button>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Field
                                    {form}
                                    name={`teamMembers[${index}].name`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Name</Form.Label>
                                            <Input
                                                {...props}
                                                bind:value={member.name}
                                                placeholder="Full name"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                                <Form.Field
                                    {form}
                                    name={`teamMembers[${index}].role`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Role</Form.Label>
                                            <Input
                                                {...props}
                                                bind:value={member.role}
                                                placeholder="e.g., CEO, CTO"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>
                            <Form.Field
                                {form}
                                name={`teamMembers[${index}].bio`}
                            >
                                <Form.Control>
                                    {#snippet children({ props })}
                                        <Form.Label>Bio</Form.Label>
                                        <Textarea
                                            {...props}
                                            bind:value={member.bio}
                                            placeholder="Brief bio"
                                            rows={3}
                                        />
                                    {/snippet}
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                            <Form.Field
                                {form}
                                name={`teamMembers[${index}].linkedin`}
                            >
                                <Form.Control>
                                    {#snippet children({ props })}
                                        <Form.Label
                                            >LinkedIn URL (Optional)</Form.Label
                                        >
                                        <Input
                                            {...props}
                                            type="url"
                                            bind:value={member.linkedin}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    {/snippet}
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                        </div>
                    {/each}
                {/if}
                <Button
                    type="button"
                    variant="outline"
                    class="w-full"
                    onclick={() => addTeamMember()}>Add Team Member</Button
                >
            </CardContent>
        </Card>

        <!-- Funding Information -->
        <Card>
            <CardHeader>
                <CardTitle>Funding Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="fundingStage">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Funding Stage</Form.Label>
                            <Select
                                type="single"
                                {...props}
                                bind:value={$formData.fundingStage}
                            >
                                <SelectTrigger class="w-full">
                                    <div
                                        class="w-full text-left placeholder:text-muted-foreground"
                                    >
                                        {$formData.fundingStage ||
                                            "Select funding stage"}
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pre-seed"
                                        >Pre-seed</SelectItem
                                    >
                                    <SelectItem value="Seed">Seed</SelectItem>
                                    <SelectItem value="Series A"
                                        >Series A</SelectItem
                                    >
                                    <SelectItem value="Series B"
                                        >Series B</SelectItem
                                    >
                                    <SelectItem value="Series C+"
                                        >Series C+</SelectItem
                                    >
                                </SelectContent>
                            </Select>
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Field {form} name="funding.total">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Total Funding</Form.Label>
                                <Input
                                    {...props}
                                    bind:value={$formData.funding.total}
                                    placeholder="e.g., $1.5M"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field {form} name="funding.lastRound">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Last Round Size</Form.Label>
                                <Input
                                    {...props}
                                    bind:value={$formData.funding.lastRound}
                                    placeholder="e.g., $500K"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
                <Form.Field {form} name="funding.investors">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Key Investors</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.funding.investors}
                                placeholder="List main investors, comma-separated"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Key Metrics -->
        <Card>
            <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Field {form} name="metrics.revenue">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Revenue (e.g., ARR, MRR)</Form.Label
                                >
                                <Input
                                    {...props}
                                    bind:value={$formData.metrics.revenue}
                                    placeholder="e.g., $1M ARR"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field {form} name="metrics.growth">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label
                                    >Growth Rate (e.g., YoY, MoM)</Form.Label
                                >
                                <Input
                                    {...props}
                                    bind:value={$formData.metrics.growth}
                                    placeholder="e.g., 20% MoM"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
                <Form.Field {form} name="metrics.customers">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Number of Customers/Users</Form.Label>
                            <Input
                                {...props}
                                bind:value={$formData.metrics.customers}
                                placeholder="e.g., 1000+ customers"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Social Media Links -->
        <Card>
            <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription
                    >Links to your startup's social media profiles (Optional).</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="socialMedia.twitter">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Twitter URL</Form.Label>
                            <Input
                                {...props}
                                type="url"
                                value={$formData.socialMedia?.twitter}
                                placeholder="https://twitter.com/yourstartup"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="socialMedia.linkedin">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>LinkedIn URL</Form.Label>
                            <Input
                                {...props}
                                type="url"
                                value={$formData.socialMedia?.linkedin}
                                placeholder="https://linkedin.com/company/yourstartup"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="socialMedia.facebook">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Facebook URL</Form.Label>
                            <Input
                                {...props}
                                type="url"
                                value={$formData.socialMedia?.facebook}
                                placeholder="https://facebook.com/yourstartup"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="socialMedia.instagram">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Instagram URL</Form.Label>
                            <Input
                                {...props}
                                type="url"
                                value={$formData.socialMedia?.instagram}
                                placeholder="https://instagram.com/yourstartup"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Contact Information -->
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="contact.email">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Contact Email</Form.Label>
                            <Input
                                {...props}
                                type="email"
                                bind:value={$formData.contact.email}
                                placeholder="contact@example.com"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="contact.phone">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Contact Phone (Optional)</Form.Label>
                            <Input
                                {...props}
                                type="tel"
                                bind:value={$formData.contact.phone}
                                placeholder="+1234567890"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="contact.address">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Contact Address (Optional)</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.contact.address}
                                placeholder="123 Main St, City, Country"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Business Details -->
        <Card>
            <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription
                    >More about your business operations.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="businessModel">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Business Model</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.businessModel}
                                placeholder="Describe your business model (e.g., SaaS, marketplace)"
                                rows={4}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="targetMarket">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Target Market</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.targetMarket}
                                placeholder="Describe your target customers and market segment"
                                rows={4}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="competitors">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Main Competitors</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.competitors}
                                placeholder="List your key competitors"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Traction (Optional) -->
        <Card>
            <CardHeader>
                <CardTitle>Traction (Optional)</CardTitle>
                <CardDescription
                    >Key achievements and traction points.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="traction.users">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Users/Customers</Form.Label>
                            <Input
                                {...props}
                                value={$formData.traction?.users}
                                placeholder="e.g., 1000+ users"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="traction.revenue">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Revenue Traction</Form.Label>
                            <Input
                                {...props}
                                value={$formData.traction?.revenue}
                                placeholder="e.g., $10k MRR"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="traction.growth">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Growth Metrics</Form.Label>
                            <Input
                                {...props}
                                value={$formData.traction?.growth}
                                placeholder="e.g., 20% MoM growth"
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="traction.partnerships">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Key Partnerships</Form.Label>
                            <Textarea
                                {...props}
                                value={$formData.traction?.partnerships}
                                placeholder="List any significant partnerships"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Use of Funds -->
        <Card>
            <CardHeader>
                <CardTitle>Use of Funds</CardTitle>
                <CardDescription
                    >How you plan to use investment funds.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <Form.Field {form} name="useOfFunds.product">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Product Development</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.useOfFunds.product}
                                placeholder="e.g., Hire 2 engineers, build X feature"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="useOfFunds.marketing">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Marketing & Sales</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.useOfFunds.marketing}
                                placeholder="e.g., Launch ad campaigns, attend Y conference"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="useOfFunds.operations">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Operations</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.useOfFunds.operations}
                                placeholder="e.g., Scale infrastructure, expand support team"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="useOfFunds.team">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Team Expansion</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.useOfFunds.team}
                                placeholder="e.g., Hire Head of Sales"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="useOfFunds.other">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Other Uses (Optional)</Form.Label>
                            <Textarea
                                {...props}
                                bind:value={$formData.useOfFunds.other}
                                placeholder="Any other specific uses for funds"
                                rows={3}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </CardContent>
        </Card>

        <!-- Timeline (Optional) -->
        <Card>
            <CardHeader>
                <CardTitle>Timeline (Optional)</CardTitle>
                <CardDescription
                    >Key past achievements and future milestones.</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- Past Milestones -->
                <div>
                    <h3 class="text-lg font-medium mb-2">Past Milestones</h3>
                    {#if $formData.timeline?.past && $formData.timeline.past.length > 0}
                        {#each $formData.timeline.past as milestone, index}
                            <div
                                class="p-4 border rounded-lg space-y-4 mb-4 relative"
                            >
                                <h4 class="font-medium">
                                    Milestone {index + 1}
                                </h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    class="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                    onclick={() => removePastMilestone(index)}
                                >
                                    X <span class="sr-only"
                                        >Remove past milestone</span
                                    >
                                </Button>
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <Form.Field
                                        {form}
                                        name={`timeline.past[${index}].date`}
                                    >
                                        <Form.Control>
                                            {#snippet children({ props })}
                                                <Form.Label>Date</Form.Label>
                                                <Input
                                                    {...props}
                                                    bind:value={milestone.date}
                                                    placeholder="YYYY-MM-DD or QX YYYY"
                                                />
                                            {/snippet}
                                        </Form.Control>
                                        <Form.FieldErrors />
                                    </Form.Field>
                                    <Form.Field
                                        {form}
                                        name={`timeline.past[${index}].type`}
                                    >
                                        <Form.Control>
                                            {#snippet children({ props })}
                                                <Form.Label>Type</Form.Label>
                                                <Select
                                                    type="single"
                                                    {...props}
                                                    bind:value={milestone.type}
                                                >
                                                    <SelectTrigger
                                                        class="w-full"
                                                    >
                                                        <div
                                                            class="w-full text-left placeholder:text-muted-foreground"
                                                        >
                                                            <!-- {$formData.timeline
                                                                ?.past[index]
                                                                ?.type ||
                                                                "Select type"} -->
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value="achievement"
                                                            >Achievement</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="funding"
                                                            >Funding</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="partnership"
                                                            >Partnership</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="product"
                                                            >Product</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="other"
                                                            >Other</SelectItem
                                                        >
                                                    </SelectContent>
                                                </Select>
                                            {/snippet}
                                        </Form.Control>
                                        <Form.FieldErrors />
                                    </Form.Field>
                                </div>
                                <Form.Field
                                    {form}
                                    name={`timeline.past[${index}].title`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Title</Form.Label>
                                            <Input
                                                {...props}
                                                bind:value={milestone.title}
                                                placeholder="Milestone title"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                                <Form.Field
                                    {form}
                                    name={`timeline.past[${index}].description`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Description</Form.Label>
                                            <Textarea
                                                {...props}
                                                bind:value={
                                                    milestone.description
                                                }
                                                placeholder="Describe the milestone"
                                                rows={3}
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>
                        {/each}
                    {/if}
                    <Button
                        type="button"
                        variant="outline"
                        class="w-full mt-2"
                        onclick={() => addPastMilestone()}
                        >Add Past Milestone</Button
                    >
                </div>

                <!-- Future Milestones -->
                <div>
                    <h3 class="text-lg font-medium mb-2">Future Milestones</h3>
                    {#if $formData.timeline?.future && $formData.timeline.future.length > 0}
                        {#each $formData.timeline.future as milestone, index}
                            <div
                                class="p-4 border rounded-lg space-y-4 mb-4 relative"
                            >
                                <h4 class="font-medium">
                                    Milestone {index + 1}
                                </h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    class="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                    onclick={() => removeFutureMilestone(index)}
                                >
                                    X <span class="sr-only"
                                        >Remove future milestone</span
                                    >
                                </Button>
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <Form.Field
                                        {form}
                                        name={`timeline.future[${index}].date`}
                                    >
                                        <Form.Control>
                                            {#snippet children({ props })}
                                                <Form.Label>Date</Form.Label>
                                                <Input
                                                    {...props}
                                                    bind:value={milestone.date}
                                                    placeholder="YYYY-MM-DD or QX YYYY"
                                                />
                                            {/snippet}
                                        </Form.Control>
                                        <Form.FieldErrors />
                                    </Form.Field>
                                    <Form.Field
                                        {form}
                                        name={`timeline.future[${index}].type`}
                                    >
                                        <Form.Control>
                                            {#snippet children({ props })}
                                                <Form.Label>Type</Form.Label>
                                                <Select
                                                    type="single"
                                                    {...props}
                                                    bind:value={milestone.type}
                                                >
                                                    <SelectTrigger
                                                        class="w-full"
                                                    >
                                                        <div
                                                            class="w-full text-left placeholder:text-muted-foreground"
                                                        >
                                                            <!-- {$formData.timeline
                                                                .future[index]
                                                                .type ||
                                                                "Select type"} -->
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value="launch"
                                                            >Launch</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="funding"
                                                            >Funding</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="partnership"
                                                            >Partnership</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="product"
                                                            >Product</SelectItem
                                                        >
                                                        <SelectItem
                                                            value="other"
                                                            >Other</SelectItem
                                                        >
                                                    </SelectContent>
                                                </Select>
                                            {/snippet}
                                        </Form.Control>
                                        <Form.FieldErrors />
                                    </Form.Field>
                                </div>
                                <Form.Field
                                    {form}
                                    name={`timeline.future[${index}].title`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Title</Form.Label>
                                            <Input
                                                {...props}
                                                bind:value={milestone.title}
                                                placeholder="Milestone title"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                                <Form.Field
                                    {form}
                                    name={`timeline.future[${index}].description`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Description</Form.Label>
                                            <Textarea
                                                {...props}
                                                bind:value={
                                                    milestone.description
                                                }
                                                placeholder="Describe the milestone"
                                                rows={3}
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>
                        {/each}
                    {/if}
                    <Button
                        type="button"
                        variant="outline"
                        class="w-full mt-2"
                        onclick={() => addFutureMilestone()}
                        >Add Future Milestone</Button
                    >
                </div>
            </CardContent>
        </Card>

        <Form.Button type="submit" class="w-full" disabled={$submitting}>
            {#if $submitting}
                <span class="animate-spin mr-2">⏳</span> Saving...
            {:else}
                Save Changes
            {/if}
        </Form.Button>
        {#if $message && typeof $message === "string" && $message.length > 0}
            <!-- class:text-green-600={$valid}
                class:text-destructive={!$valid} -->
            <p class="text-sm font-medium">
                {$message}
            </p>
        {/if}
    </form>
</div>
