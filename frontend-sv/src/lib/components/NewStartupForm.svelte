<script lang="ts">
    import FileUpload from "$lib/components/file-upload.svelte";
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
    import {
        type StartupSchema,
        startupSchema,
    } from "@/schemas/startup-schema";
    import { LoaderCircle } from "@lucide/svelte";
    import { toast } from "svelte-sonner";
    import {
        type Infer,
        superForm,
        type SuperValidated,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";

    let { data }: { data: { form: SuperValidated<Infer<StartupSchema>> } } =
        $props();

    // Use superForm to manage the form state
    const form = superForm(data.form, {
        dataType: "json",
        validators: zodClient(startupSchema),
        onUpdate({ form }) {
            if (form.valid) {
                toast.success("Startup profile saved");
            }
        },
        onError(result) {
            toast.error("Failed to save startup profile", {
                description: "Please check the form for errors",
            });
        },
    });

    const {
        form: formData,
        errors,
        enhance,
        delayed,
        message,
        submitting,
    } = form;

    // State with Svelte 5 runes
    let showPreview = $state(true);
    let showTeamSection = $state(false);

    // File handling with runes
    let pitchDeckFile = $state<File | null>(null);
    let logoFile = $state<File | null>(null);
    let logoPreview = $state<string | null>(null);
    let productScreenshots = $state<File[]>([]);
    let demoVideo = $state<File | null>(null);
    let screenshotPreviews = $state<string[]>([]);

    // Handlers for file uploads
    function handleFileUpload(event: { detail: { files: File[] } }) {
        if (event.detail.files.length > 0) {
            pitchDeckFile = event.detail.files[0];
        }
    }

    function handleFileRemove() {
        pitchDeckFile = null;
    }

    function handleLogoUpload(event: { detail: { files: File[] } }) {
        if (event.detail.files.length > 0) {
            logoFile = event.detail.files[0];
            logoPreview = URL.createObjectURL(event.detail.files[0]);
        }
    }

    function handleLogoRemove() {
        logoFile = null;
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
            logoPreview = null;
        }
    }

    function handleScreenshotUpload(event: { detail: { files: File[] } }) {
        productScreenshots = event.detail.files;
        screenshotPreviews = event.detail.files.map((file) =>
            URL.createObjectURL(file),
        );
    }

    function handleScreenshotRemove(index: number) {
        URL.revokeObjectURL(screenshotPreviews[index]);
        productScreenshots = productScreenshots.filter((_, i) => i !== index);
        screenshotPreviews = screenshotPreviews.filter((_, i) => i !== index);
    }

    function handleDemoVideoUpload(event: { detail: { files: File[] } }) {
        if (event.detail.files.length > 0) {
            demoVideo = event.detail.files[0];
        }
    }

    function handleDemoVideoRemove() {
        demoVideo = null;
    }

    // Team members
    function addTeamMember() {
        const currentTeamMembers = $formData.teamMembers || [];
        $formData.teamMembers = [
            ...currentTeamMembers,
            {
                name: "",
                role: "",
                bio: "",
                linkedin: "",
            },
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

    // Toggle functions
    function togglePreview() {
        showPreview = !showPreview;
    }

    function toggleTeamSection() {
        showTeamSection = !showTeamSection;
    }
</script>

<form method="POST" use:enhance class="space-y-8">
    <!-- Basic Information -->
    <Card>
        <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your startup</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Logo Upload -->
            <!-- <div>
                <Form.Label>Startup Logo</Form.Label>
                <div class="flex items-start gap-4">
                    <div class="flex-1">
                        <FileUpload
                            accept="image/*"
                            maxSize={2}
                            multiple={false}
                            onupload={handleLogoUpload}
                            onremove={handleLogoRemove}
                        />
                        <p class="text-sm text-muted-foreground mt-2">
                            Upload your startup logo (max 2MB, recommended size:
                  nt           400x400px)
                        </p>
                    </div>
                </div>
            </div> -->

            <Form.Field {form} name="name">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Startup Name</Form.Label>
                        <Input
                            {...props}
                            placeholder="Enter your startup name"
                            bind:value={$formData.name}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.name}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.name}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="description">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Description</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe your startup"
                            class="min-h-[100px]"
                            bind:value={$formData.description}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.description}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.description}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <div class="grid grid-cols-2 gap-4">
                <Form.Field {form} name="industry">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Industry</Form.Label>
                            <Select
                                type="single"
                                bind:value={$formData.industry}
                                {...props}
                            >
                                <SelectTrigger>
                                    <div class="placeholder">
                                        Select industry
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
                                </SelectContent>
                            </Select>
                        {/snippet}
                    </Form.Control>
                    {#if $errors.industry}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.industry}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>

                <Form.Field {form} name="location">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Location</Form.Label>
                            <Input
                                {...props}
                                placeholder="City, Country"
                                bind:value={$formData.location}
                            />
                        {/snippet}
                    </Form.Control>
                    {#if $errors.location}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.location}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>
            </div>
        </CardContent>
    </Card>

    <!-- Company Details -->
    <Card>
        <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription
                >Additional information about your company</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <Form.Field {form} name="foundedYear">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Founded Year</Form.Label>
                            <Input
                                {...props}
                                type="number"
                                placeholder="YYYY"
                                bind:value={$formData.foundedYear}
                            />
                        {/snippet}
                    </Form.Control>
                    {#if $errors.foundedYear}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.foundedYear}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>

                <Form.Field {form} name="teamSize">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Team Size</Form.Label>
                            <Input
                                {...props}
                                type="number"
                                placeholder="Number of employees"
                                bind:value={$formData.teamSize}
                            />
                        {/snippet}
                    </Form.Control>
                    {#if $errors.teamSize}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.teamSize}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>
            </div>

            <Form.Field {form} name="website">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Website</Form.Label>
                        <Input
                            {...props}
                            placeholder="https://your-startup.com"
                            bind:value={$formData.website}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.website}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.website}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Funding Information -->
    <Card>
        <CardHeader>
            <CardTitle>Funding Information</CardTitle>
            <CardDescription>Details about your funding status</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <Form.Field {form} name="fundingStage">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Funding Stage</Form.Label>
                        <Select
                            type="single"
                            bind:value={$formData.fundingStage}
                            {...props}
                        >
                            <SelectTrigger>
                                <div class="placeholder">
                                    Select funding stage
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
                {#if $errors.fundingStage}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.fundingStage}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <div class="grid grid-cols-2 gap-4">
                <Form.Field {form} name="funding.total">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Total Funding</Form.Label>
                            <Input
                                {...props}
                                placeholder="e.g., $1M"
                                bind:value={$formData.funding.total}
                            />
                        {/snippet}
                    </Form.Control>
                    <!-- {#if $errors["funding.total"]} -->
                    <Form.FieldErrors class="text-destructive text-sm">
                        <!-- {$errors["funding.total"]} -->
                    </Form.FieldErrors>
                    <!-- {/if} -->
                </Form.Field>

                <Form.Field {form} name="funding.lastRound">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Last Round</Form.Label>
                            <Input
                                {...props}
                                placeholder="e.g., Series A"
                                bind:value={$formData.funding.lastRound}
                            />
                        {/snippet}
                    </Form.Control>
                    <!-- {#if $errors["funding.lastRound"]} -->
                    <Form.FieldErrors class="text-destructive text-sm">
                        <!-- {$errors["funding.lastRound"]} -->
                    </Form.FieldErrors>
                    <!-- {/if} -->
                </Form.Field>
            </div>

            <Form.Field {form} name="funding.investors">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Investors</Form.Label>
                        <Input
                            {...props}
                            placeholder="List your investors (comma-separated)"
                            bind:value={$formData.funding.investors}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.funding?.investors}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.funding?.investors}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Key Metrics -->
    <Card>
        <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Your startup's performance metrics</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <Form.Field {form} name="metrics.revenue">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Revenue</Form.Label>
                            <Input
                                {...props}
                                placeholder="e.g., $500K ARR"
                                bind:value={$formData.metrics.revenue}
                            />
                        {/snippet}
                    </Form.Control>
                    {#if $errors.metrics?.revenue}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.metrics?.revenue}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>

                <Form.Field {form} name="metrics.growth">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Growth Rate</Form.Label>
                            <Input
                                {...props}
                                placeholder="e.g., 200% YoY"
                                bind:value={$formData.metrics.growth}
                            />
                        {/snippet}
                    </Form.Control>
                    {#if $errors.metrics?.growth}
                        <Form.FieldErrors class="text-destructive text-sm">
                            {$errors.metrics?.growth}
                        </Form.FieldErrors>
                    {/if}
                </Form.Field>
            </div>

            <Form.Field {form} name="metrics.customers">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Number of Customers</Form.Label>
                        <Input
                            {...props}
                            placeholder="e.g., 50+ Enterprise Clients"
                            bind:value={$formData.metrics.customers}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.metrics?.customers}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.metrics?.customers}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Team Section -->
    <Card>
        <CardHeader>
            <div class="flex items-center justify-between">
                <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription
                        >Add information about your team</CardDescription
                    >
                </div>
                <Button
                    variant="outline"
                    type="button"
                    onclick={() => toggleTeamSection()}
                >
                    {showTeamSection
                        ? "Hide Team Section"
                        : "Show Team Section"}
                </Button>
            </div>
        </CardHeader>
        {#if showTeamSection}
            <CardContent class="space-y-4">
                {#if $formData.teamMembers && $formData.teamMembers.length > 0}
                    {#each $formData.teamMembers as member, index}
                        <div class="p-4 border rounded-lg space-y-4">
                            <div class="flex justify-between items-center">
                                <h3 class="font-medium">
                                    Team Member {index + 1}
                                </h3>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onclick={() => removeTeamMember(index)}
                                    class="text-destructive"
                                >
                                    Remove
                                </Button>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <Form.Field
                                    {form}
                                    name={`teamMembers[${index}].name`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Name</Form.Label>
                                            <Input
                                                {...props}
                                                placeholder="Full name"
                                                bind:value={member.name}
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    {#if $errors.teamMembers?.[index]?.name}
                                        <Form.FieldErrors
                                            class="text-destructive text-sm"
                                        >
                                            {$errors.teamMembers[index].name}
                                        </Form.FieldErrors>
                                    {/if}
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
                                                placeholder="e.g., CEO, CTO"
                                                bind:value={member.role}
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    {#if $errors.teamMembers?.[index]?.role}
                                        <Form.FieldErrors
                                            class="text-destructive text-sm"
                                        >
                                            {$errors.teamMembers[index].role}
                                        </Form.FieldErrors>
                                    {/if}
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
                                            placeholder="Brief description of experience and expertise"
                                            bind:value={member.bio}
                                        />
                                    {/snippet}
                                </Form.Control>
                                {#if $errors.teamMembers?.[index]?.bio}
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        {$errors.teamMembers[index].bio}
                                    </Form.FieldErrors>
                                {/if}
                            </Form.Field>
                            <Form.Field
                                {form}
                                name={`teamMembers[${index}].linkedin`}
                            >
                                <Form.Control>
                                    {#snippet children({ props })}
                                        <Form.Label
                                            >LinkedIn Profile (Optional)</Form.Label
                                        >
                                        <Input
                                            {...props}
                                            placeholder="https://linkedin.com/in/..."
                                            bind:value={member.linkedin}
                                        />
                                    {/snippet}
                                </Form.Control>
                                {#if $errors.teamMembers?.[index]?.linkedin}
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        {$errors.teamMembers[index].linkedin}
                                    </Form.FieldErrors>
                                {/if}
                            </Form.Field>
                        </div>
                    {/each}
                {/if}
                <Button
                    type="button"
                    variant="outline"
                    onclick={() => addTeamMember()}
                    class="w-full"
                >
                    Add Team Member
                </Button>
            </CardContent>
        {/if}
    </Card>

    <!-- Pitch Deck Upload -->
    <Card>
        <CardHeader>
            <CardTitle>Pitch Deck</CardTitle>
            <CardDescription
                >Upload your startup's pitch deck (PDF, PPT, or PPTX)</CardDescription
            >
        </CardHeader>
        <CardContent>
            <FileUpload
                accept=".pdf,.ppt,.pptx"
                maxSize={10}
                multiple={false}
                on:upload={handleFileUpload}
                on:remove={handleFileRemove}
            />
        </CardContent>
    </Card>

    <!-- Social Media Links -->
    <Card>
        <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription
                >Add your startup's social media profiles</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-4">
            <Form.Field {form} name="socialMedia.twitter">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Twitter</Form.Label>
                        <Input
                            {...props}
                            placeholder="https://twitter.com/yourstartup"
                            value={$formData.socialMedia?.twitter}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.socialMedia?.twitter}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.socialMedia?.twitter}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="socialMedia.linkedin">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>LinkedIn</Form.Label>
                        <Input
                            {...props}
                            placeholder="https://linkedin.com/company/yourstartup"
                            value={$formData.socialMedia?.linkedin}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.socialMedia?.linkedin}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.socialMedia?.linkedin}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="socialMedia.facebook">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Facebook</Form.Label>
                        <Input
                            {...props}
                            placeholder="https://facebook.com/yourstartup"
                            value={$formData.socialMedia?.facebook}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.socialMedia?.facebook}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.socialMedia?.facebook}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="socialMedia.instagram">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Instagram</Form.Label>
                        <Input
                            {...props}
                            placeholder="https://instagram.com/yourstartup"
                            value={$formData.socialMedia?.instagram}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.socialMedia?.instagram}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.socialMedia?.instagram}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Contact Information -->
    <Card>
        <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How investors can reach you</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <Form.Field {form} name="contact.email">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Email</Form.Label>
                        <Input
                            {...props}
                            type="email"
                            placeholder="contact@yourstartup.com"
                            bind:value={$formData.contact.email}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.contact?.email}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.contact?.email}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="contact.phone">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Phone (Optional)</Form.Label>
                        <Input
                            {...props}
                            placeholder="+1 (555) 123-4567"
                            bind:value={$formData.contact.phone}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.contact?.phone}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.contact?.phone}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="contact.address">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Address (Optional)</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="123 Startup St, Tech City, 12345"
                            bind:value={$formData.contact.address}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.contact?.address}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.contact?.address}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Business Model -->
    <Card>
        <CardHeader>
            <CardTitle>Business Model</CardTitle>
            <CardDescription
                >Explain how your startup makes or will make money</CardDescription
            >
        </CardHeader>
        <CardContent>
            <Form.Field {form} name="businessModel">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Business Model</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe your revenue streams, pricing model, and business strategy"
                            class="min-h-[150px]"
                            bind:value={$formData.businessModel}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.businessModel}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.businessModel}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Target Market -->
    <Card>
        <CardHeader>
            <CardTitle>Target Market</CardTitle>
            <CardDescription
                >Define your ideal customers and market opportunity</CardDescription
            >
        </CardHeader>
        <CardContent>
            <Form.Field {form} name="targetMarket">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Target Market</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe your target audience, market size, and growth potential"
                            class="min-h-[150px]"
                            bind:value={$formData.targetMarket}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.targetMarket}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.targetMarket}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Competitors -->
    <Card>
        <CardHeader>
            <CardTitle>Competitors</CardTitle>
            <CardDescription
                >Identify your main competitors and your competitive advantage</CardDescription
            >
        </CardHeader>
        <CardContent>
            <Form.Field {form} name="competitors">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Competitors</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="List your main competitors and explain what sets you apart"
                            class="min-h-[150px]"
                            bind:value={$formData.competitors}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.competitors}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.competitors}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Traction -->
    <Card>
        <CardHeader>
            <CardTitle>Traction</CardTitle>
            <CardDescription
                >Share your startup's progress and milestones (Optional)</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-4">
            <Form.Field {form} name="traction.users">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Users/Customers (Optional)</Form.Label>
                        <Input
                            {...props}
                            placeholder="e.g., 10,000 active users"
                            value={$formData.traction?.users}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.traction?.users}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.traction?.users}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="traction.revenue">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Revenue Traction (Optional)</Form.Label>
                        <Input
                            {...props}
                            placeholder="e.g., $50K MRR with 15% MoM growth"
                            value={$formData.traction?.revenue}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.traction?.revenue}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.traction?.revenue}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="traction.growth">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Growth Metrics (Optional)</Form.Label>
                        <Input
                            {...props}
                            placeholder="e.g., 30% month-over-month user growth"
                            value={$formData.traction?.growth}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.traction?.growth}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.traction?.growth}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="traction.partnerships">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Partnerships (Optional)</Form.Label>
                        <Input
                            {...props}
                            placeholder="e.g., Strategic partnership with Amazon, Microsoft"
                            value={$formData.traction?.partnerships}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.traction?.partnerships}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.traction?.partnerships}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Use of Funds -->
    <Card>
        <CardHeader>
            <CardTitle>Use of Funds</CardTitle>
            <CardDescription
                >Explain how you plan to use the investment</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-4">
            <Form.Field {form} name="useOfFunds.product">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Product Development</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe how funds will be used for product development"
                            value={$formData.useOfFunds?.product}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.useOfFunds?.product}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.useOfFunds?.product}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="useOfFunds.marketing">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Marketing & Sales</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe your marketing and sales plans"
                            value={$formData.useOfFunds?.marketing}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.useOfFunds?.marketing}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.useOfFunds?.marketing}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="useOfFunds.operations">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Operations</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe operational expenses and infrastructure plans"
                            value={$formData.useOfFunds?.operations}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.useOfFunds?.operations}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.useOfFunds?.operations}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="useOfFunds.team">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Team Expansion</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe hiring plans and team growth strategy"
                            value={$formData.useOfFunds?.team}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.useOfFunds?.team}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.useOfFunds?.team}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>

            <Form.Field {form} name="useOfFunds.other">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Other (Optional)</Form.Label>
                        <Textarea
                            {...props}
                            placeholder="Describe any other use of funds not covered above"
                            value={$formData.useOfFunds?.other}
                        />
                    {/snippet}
                </Form.Control>
                {#if $errors.useOfFunds?.other}
                    <Form.FieldErrors class="text-destructive text-sm">
                        {$errors.useOfFunds?.other}
                    </Form.FieldErrors>
                {/if}
            </Form.Field>
        </CardContent>
    </Card>

    <!-- Timeline -->
    <Card>
        <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>
                Share your past achievements and future plans
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
            <!-- Past Milestones -->
            <div>
                <h3 class="text-lg font-medium mb-4">Past Milestones</h3>

                {#if $formData.timeline?.past && $formData.timeline.past.length > 0}
                    {#each $formData.timeline.past as _, index}
                        <div class="p-4 border rounded-lg space-y-4 mb-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-medium">
                                    Milestone {index + 1}
                                </h4>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onclick={() => removePastMilestone(index)}
                                    class="text-destructive"
                                >
                                    Remove
                                </Button>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <Form.Field
                                    {form}
                                    name={`timeline.past[${index}].date`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Date</Form.Label>
                                            <Input
                                                {...props}
                                                placeholder="e.g., January 2023"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <!-- {#if $errors.timeline?.past?.[index]?.date} -->
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        <!-- {$errors.timeline.past[index].date} -->
                                    </Form.FieldErrors>
                                    <!-- {/if} -->
                                </Form.Field>

                                <Form.Field
                                    {form}
                                    name={`timeline.past[${index}].type`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Type</Form.Label>
                                            <Select type="single" {...props}>
                                                <SelectTrigger>
                                                    <div class="placeholder">
                                                        Select milestone type
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="achievement"
                                                        >Achievement</SelectItem
                                                    >
                                                    <SelectItem value="funding"
                                                        >Funding</SelectItem
                                                    >
                                                    <SelectItem
                                                        value="partnership"
                                                        >Partnership</SelectItem
                                                    >
                                                    <SelectItem value="product"
                                                        >Product</SelectItem
                                                    >
                                                    <SelectItem value="other"
                                                        >Other</SelectItem
                                                    >
                                                </SelectContent>
                                            </Select>
                                        {/snippet}
                                    </Form.Control>
                                    <!-- {#if $errors.timeline?.past?.[index]?.type} -->
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        <!-- {$errors.timeline.past[index].type} -->
                                    </Form.FieldErrors>
                                    <!-- {/if} -->
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
                                            placeholder="e.g., Secured seed funding"
                                        />
                                    {/snippet}
                                </Form.Control>
                                <!-- {#if $errors.timeline?.past?.[index]?.title} -->
                                <Form.FieldErrors
                                    class="text-destructive text-sm"
                                >
                                    <!-- {$errors.timeline.past[index].title} -->
                                </Form.FieldErrors>
                                <!-- {/if} -->
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
                                            placeholder="Describe the milestone"
                                        />
                                    {/snippet}
                                </Form.Control>
                                <!-- {#if $errors.timeline?.past?.[index]?.description} -->
                                <Form.FieldErrors
                                    class="text-destructive text-sm"
                                >
                                    <!-- {$errors.timeline.past[index]
                                            .description} -->
                                </Form.FieldErrors>
                                <!-- {/if} -->
                            </Form.Field>
                        </div>
                    {/each}
                {/if}

                <Button
                    type="button"
                    variant="outline"
                    onclick={() => addPastMilestone()}
                    class="w-full"
                >
                    Add Past Milestone
                </Button>
            </div>

            <!-- Future Milestones -->
            <div>
                <h3 class="text-lg font-medium mb-4">Future Milestones</h3>

                {#if $formData.timeline?.future && $formData.timeline.future.length > 0}
                    {#each $formData.timeline.future as _, index}
                        <div class="p-4 border rounded-lg space-y-4 mb-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-medium">
                                    Milestone {index + 1}
                                </h4>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onclick={() => removeFutureMilestone(index)}
                                    class="text-destructive"
                                >
                                    Remove
                                </Button>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <Form.Field
                                    {form}
                                    name={`timeline.future[${index}].date`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Date</Form.Label>
                                            <Input
                                                {...props}
                                                placeholder="e.g., Q3 2024"
                                            />
                                        {/snippet}
                                    </Form.Control>
                                    <!-- {#if $errors.timeline?.future?.[index]?.date} -->
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        <!-- {$errors.timeline.future[index]
                                                .date} -->
                                    </Form.FieldErrors>
                                    <!-- {/if} -->
                                </Form.Field>

                                <Form.Field
                                    {form}
                                    name={`timeline.future[${index}].type`}
                                >
                                    <Form.Control>
                                        {#snippet children({ props })}
                                            <Form.Label>Type</Form.Label>
                                            <Select type="single" {...props}>
                                                <SelectTrigger>
                                                    <div class="placeholder">
                                                        Select milestone type
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="launch"
                                                        >Launch</SelectItem
                                                    >
                                                    <SelectItem value="funding"
                                                        >Funding</SelectItem
                                                    >
                                                    <SelectItem
                                                        value="partnership"
                                                        >Partnership</SelectItem
                                                    >
                                                    <SelectItem value="product"
                                                        >Product</SelectItem
                                                    >
                                                    <SelectItem value="other"
                                                        >Other</SelectItem
                                                    >
                                                </SelectContent>
                                            </Select>
                                        {/snippet}
                                    </Form.Control>
                                    <!-- {#if $errors.timeline?.future?.[index]?.type} -->
                                    <Form.FieldErrors
                                        class="text-destructive text-sm"
                                    >
                                        <!-- {$errors.timeline.future[index]
                                                .type} -->
                                    </Form.FieldErrors>
                                    <!-- {/if} -->
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
                                            placeholder="e.g., Product Launch"
                                        />
                                    {/snippet}
                                </Form.Control>
                                <!-- {#if $errors.timeline?.future?.[index]?.title} -->
                                <Form.FieldErrors
                                    class="text-destructive text-sm"
                                >
                                    <!-- {$errors.timeline.future[index].title} -->
                                </Form.FieldErrors>
                                <!-- {/if} -->
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
                                            placeholder="Describe the planned milestone"
                                        />
                                    {/snippet}
                                </Form.Control>
                                <!-- {#if $errors.timeline?.future?.[index]?.description} -->
                                <Form.FieldErrors
                                    class="text-destructive text-sm"
                                >
                                    <!-- {$errors.timeline.future[index]
                                            .description} -->
                                </Form.FieldErrors>
                                <!-- {/if} -->
                            </Form.Field>
                        </div>
                    {/each}
                {/if}

                <Button
                    type="button"
                    variant="outline"
                    onclick={() => addFutureMilestone()}
                    class="w-full"
                >
                    Add Future Milestone
                </Button>
            </div>
        </CardContent>
    </Card>

    <!-- Submit Button -->
    <div class="flex justify-end">
        <Form.Button class="w-full" disabled={$delayed || $submitting}>
            {#if $delayed || $submitting}
                <div class="flex items-center justify-center gap-2">
                    <LoaderCircle
                        class="h-5 w-5 animate-spin"
                        strokeWidth={2}
                    />
                    <span>Creating Startup...</span>
                </div>
            {:else}
                <span>Create Startup</span>
            {/if}
        </Form.Button>
    </div>
</form>
