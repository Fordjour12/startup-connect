<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import { Card, CardContent, CardHeader } from "@/components/ui/card";

    let { showPreview, formData, logoPreview } = $props();

    // Create a safe reactive reference to formData
    let safeFormData = $derived(formData ? $formData : {});
</script>

{#if showPreview && safeFormData}
    <div class="space-y-6">
        <!-- Header Card -->
        <Card class="border-2">
            <CardHeader class="pb-4">
                <div class="flex items-start gap-6">
                    <div
                        class="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center flex-shrink-0"
                    >
                        {#if logoPreview}
                            <img
                                src={logoPreview}
                                alt="Logo"
                                class="w-18 h-18 rounded-lg object-cover"
                            />
                        {:else}
                            <span class="text-3xl">🚀</span>
                        {/if}
                    </div>
                    <div class="flex-1 ">
                        <h1
                            class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-3"
                        >
                            {safeFormData.name || "Your Startup Name"}
                        </h1>
                        <div class="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" class="text-sm">
                                {safeFormData.industry || "Industry"}
                            </Badge>
                            <Badge
                                variant={safeFormData.isPublished
                                    ? "default"
                                    : "outline"}
                                class="text-sm"
                            >
                                {safeFormData.isPublished
                                    ? "Published"
                                    : "Draft"}
                            </Badge>
                        </div>
                        <p class="text-xl text-muted-foreground leading-7">
                            {safeFormData.description ||
                                "Startup description will appear here"}
                        </p>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
                <!-- Company Details -->
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Company Details
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Founded
                                </small>
                                <div class="text-lg font-semibold mt-1">
                                    {safeFormData.foundedYear || "—"}
                                </div>
                            </div>
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Team Size
                                </small>
                                <div class="text-lg font-semibold mt-1">
                                    {safeFormData.teamSize || "—"}
                                </div>
                            </div>
                        </div>
                        <div>
                            <small
                                class="text-sm font-medium leading-none text-muted-foreground"
                            >
                                Location
                            </small>
                            <p class="leading-7 mt-1">
                                {safeFormData.location || "Not specified"}
                            </p>
                        </div>
                        <div>
                            <small
                                class="text-sm font-medium leading-none text-muted-foreground"
                            >
                                Website
                            </small>
                            {#if safeFormData.website}
                                <p class="leading-7 mt-1">
                                    <a
                                        href={safeFormData.website}
                                        target="_blank"
                                        class="font-medium text-primary underline underline-offset-4 break-all"
                                    >
                                        {safeFormData.website}
                                    </a>
                                </p>
                            {:else}
                                <p class="text-sm text-muted-foreground mt-1">
                                    Not specified
                                </p>
                            {/if}
                        </div>
                    </CardContent>
                </Card>

                <!-- Funding -->
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Funding
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Stage
                                </small>
                                <div class="mt-1">
                                    <Badge variant="outline" class="text-sm">
                                        {safeFormData.fundingStage ||
                                            "Not specified"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Total Raised
                                </small>
                                <div class="text-lg font-semibold mt-1">
                                    {safeFormData.funding?.total || "—"}
                                </div>
                            </div>
                        </div>
                        <div>
                            <small
                                class="text-sm font-medium leading-none text-muted-foreground"
                            >
                                Last Round
                            </small>
                            <p class="leading-7 mt-1">
                                {safeFormData.funding?.lastRound ||
                                    "Not specified"}
                            </p>
                        </div>
                        <div>
                            <small
                                class="text-sm font-medium leading-none text-muted-foreground"
                            >
                                Investors
                            </small>
                            <p class="leading-7 mt-1">
                                {safeFormData.funding?.investors ||
                                    "Not specified"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <!-- Contact -->
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Contact
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <small
                                class="text-sm font-medium leading-none text-muted-foreground"
                            >
                                Email
                            </small>
                            <p class="leading-7 mt-1">
                                {safeFormData.contact?.email || "Not specified"}
                            </p>
                        </div>
                        {#if safeFormData.contact?.phone}
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Phone
                                </small>
                                <p class="leading-7 mt-1">
                                    {safeFormData.contact.phone}
                                </p>
                            </div>
                        {/if}
                        {#if safeFormData.contact?.address}
                            <div>
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                >
                                    Address
                                </small>
                                <p class="leading-7 mt-1">
                                    {safeFormData.contact.address}
                                </p>
                            </div>
                        {/if}
                    </CardContent>
                </Card>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
                <!-- Key Metrics -->
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Key Metrics
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div class="grid grid-cols-1 gap-3">
                            <div class="flex justify-between items-center">
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                    >Revenue</small
                                >
                                <div class="text-lg font-semibold">
                                    {safeFormData.metrics?.revenue || "—"}
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                    >Growth</small
                                >
                                <div class="text-lg font-semibold">
                                    {safeFormData.metrics?.growth || "—"}
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <small
                                    class="text-sm font-medium leading-none text-muted-foreground"
                                    >Customers</small
                                >
                                <div class="text-lg font-semibold">
                                    {safeFormData.metrics?.customers || "—"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Traction -->
                {#if safeFormData.traction && (safeFormData.traction.users || safeFormData.traction.revenue || safeFormData.traction.growth || safeFormData.traction.partnerships)}
                    <Card>
                        <CardHeader class="pb-3">
                            <h3
                                class="scroll-m-20 text-2xl font-semibold tracking-tight"
                            >
                                Traction
                            </h3>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            {#if safeFormData.traction.users}
                                <div class="flex justify-between items-center">
                                    <small
                                        class="text-sm font-medium leading-none text-muted-foreground"
                                        >Users</small
                                    >
                                    <div class="text-lg font-semibold">
                                        {safeFormData.traction.users}
                                    </div>
                                </div>
                            {/if}
                            {#if safeFormData.traction.revenue}
                                <div class="flex justify-between items-center">
                                    <small
                                        class="text-sm font-medium leading-none text-muted-foreground"
                                        >Revenue</small
                                    >
                                    <div class="text-lg font-semibold">
                                        {safeFormData.traction.revenue}
                                    </div>
                                </div>
                            {/if}
                            {#if safeFormData.traction.growth}
                                <div class="flex justify-between items-center">
                                    <small
                                        class="text-sm font-medium leading-none text-muted-foreground"
                                        >Growth</small
                                    >
                                    <div class="text-lg font-semibold">
                                        {safeFormData.traction.growth}
                                    </div>
                                </div>
                            {/if}
                            {#if safeFormData.traction.partnerships}
                                <div class="flex justify-between items-center">
                                    <small
                                        class="text-sm font-medium leading-none text-muted-foreground"
                                        >Partnerships</small
                                    >
                                    <div class="text-lg font-semibold">
                                        {safeFormData.traction.partnerships}
                                    </div>
                                </div>
                            {/if}
                        </CardContent>
                    </Card>
                {/if}

                <!-- Social Media -->
                {#if safeFormData.socialMedia && (safeFormData.socialMedia.twitter || safeFormData.socialMedia.linkedin || safeFormData.socialMedia.facebook || safeFormData.socialMedia.instagram)}
                    <Card>
                        <CardHeader class="pb-3">
                            <h3
                                class="scroll-m-20 text-2xl font-semibold tracking-tight"
                            >
                                Social Media
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div class="flex flex-wrap gap-2">
                                {#if safeFormData.socialMedia.twitter}
                                    <a
                                        href={safeFormData.socialMedia.twitter}
                                        target="_blank"
                                        class="inline-block"
                                    >
                                        <Badge
                                            variant="outline"
                                            class="hover:bg-primary/10"
                                            >Twitter</Badge
                                        >
                                    </a>
                                {/if}
                                {#if safeFormData.socialMedia.linkedin}
                                    <a
                                        href={safeFormData.socialMedia.linkedin}
                                        target="_blank"
                                        class="inline-block"
                                    >
                                        <Badge
                                            variant="outline"
                                            class="hover:bg-primary/10"
                                            >LinkedIn</Badge
                                        >
                                    </a>
                                {/if}
                                {#if safeFormData.socialMedia.facebook}
                                    <a
                                        href={safeFormData.socialMedia.facebook}
                                        target="_blank"
                                        class="inline-block"
                                    >
                                        <Badge
                                            variant="outline"
                                            class="hover:bg-primary/10"
                                            >Facebook</Badge
                                        >
                                    </a>
                                {/if}
                                {#if safeFormData.socialMedia.instagram}
                                    <a
                                        href={safeFormData.socialMedia
                                            .instagram}
                                        target="_blank"
                                        class="inline-block"
                                    >
                                        <Badge
                                            variant="outline"
                                            class="hover:bg-primary/10"
                                            >Instagram</Badge
                                        >
                                    </a>
                                {/if}
                            </div>
                        </CardContent>
                    </Card>
                {/if}
            </div>
        </div>

        <!-- Full Width Sections -->
        <div class="space-y-6">
            <!-- Business Model -->
            {#if safeFormData.businessModel}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Business Model
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <p class="leading-7">
                            {safeFormData.businessModel}
                        </p>
                    </CardContent>
                </Card>
            {/if}

            <!-- Target Market -->
            {#if safeFormData.targetMarket}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Target Market
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <p class="leading-7">
                            {safeFormData.targetMarket}
                        </p>
                    </CardContent>
                </Card>
            {/if}

            <!-- Competitors -->
            {#if safeFormData.competitors}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Competitive Landscape
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <p class="leading-7">
                            {safeFormData.competitors}
                        </p>
                    </CardContent>
                </Card>
            {/if}

            <!-- Team -->
            {#if safeFormData.teamMembers && safeFormData.teamMembers.length > 0}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Team
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each safeFormData.teamMembers as member}
                                <div class="p-4 border rounded-lg bg-muted/30">
                                    <h4
                                        class="scroll-m-20 text-xl font-semibold tracking-tight mb-1"
                                    >
                                        {member.name || "Team Member"}
                                    </h4>
                                    <p
                                        class="text-sm font-medium text-primary mb-2"
                                    >
                                        {member.role || "Role"}
                                    </p>
                                    {#if member.bio}
                                        <p
                                            class="text-sm text-muted-foreground leading-7 mb-3"
                                        >
                                            {member.bio}
                                        </p>
                                    {/if}
                                    {#if member.linkedin}
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            class="text-sm font-medium text-primary underline underline-offset-4"
                                        >
                                            LinkedIn Profile →
                                        </a>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </CardContent>
                </Card>
            {/if}

            <!-- Timeline -->
            {#if safeFormData.timeline && (safeFormData.timeline.past?.length || safeFormData.timeline.future?.length)}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Timeline
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        {#if safeFormData.timeline.past && safeFormData.timeline.past.length > 0}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-4"
                                >
                                    Past Milestones
                                </h4>
                                <div class="space-y-4">
                                    {#each safeFormData.timeline.past as milestone}
                                        <div
                                            class="relative pl-6 border-l-2 border-primary"
                                        >
                                            <div
                                                class="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"
                                            ></div>
                                            <div
                                                class="flex items-center gap-3 mb-2"
                                            >
                                                <Badge
                                                    variant="default"
                                                    class="text-xs"
                                                    >{milestone.type}</Badge
                                                >
                                                <small
                                                    class="text-sm font-medium leading-none text-muted-foreground"
                                                >
                                                    {milestone.date}
                                                </small>
                                            </div>
                                            <h5
                                                class="scroll-m-20 text-xl font-semibold tracking-tight mb-1"
                                            >
                                                {milestone.title}
                                            </h5>
                                            <p
                                                class="text-sm text-muted-foreground leading-7"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        {#if safeFormData.timeline.future && safeFormData.timeline.future.length > 0}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground mb-4"
                                >
                                    Future Milestones
                                </h4>
                                <div class="space-y-4">
                                    {#each safeFormData.timeline.future as milestone}
                                        <div
                                            class="relative pl-6 border-l-2 border-dashed border-muted-foreground"
                                        >
                                            <div
                                                class="absolute -left-2 top-0 w-4 h-4 bg-muted-foreground rounded-full"
                                            ></div>
                                            <div
                                                class="flex items-center gap-3 mb-2"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    class="text-xs"
                                                    >{milestone.type}</Badge
                                                >
                                                <small
                                                    class="text-sm font-medium leading-none text-muted-foreground"
                                                >
                                                    {milestone.date}
                                                </small>
                                            </div>
                                            <h5
                                                class="scroll-m-20 text-xl font-semibold tracking-tight mb-1"
                                            >
                                                {milestone.title}
                                            </h5>
                                            <p
                                                class="text-sm text-muted-foreground leading-7"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </CardContent>
                </Card>
            {/if}

            <!-- Use of Funds -->
            {#if safeFormData.useOfFunds}
                <Card>
                    <CardHeader class="pb-3">
                        <h3
                            class="scroll-m-20 text-2xl font-semibold tracking-tight"
                        >
                            Use of Funds
                        </h3>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        {#if safeFormData.useOfFunds.product}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-2"
                                >
                                    Product Development
                                </h4>
                                <p
                                    class="text-sm text-muted-foreground leading-7"
                                >
                                    {safeFormData.useOfFunds.product}
                                </p>
                            </div>
                        {/if}
                        {#if safeFormData.useOfFunds.marketing}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-2"
                                >
                                    Marketing & Sales
                                </h4>
                                <p
                                    class="text-sm text-muted-foreground leading-7"
                                >
                                    {safeFormData.useOfFunds.marketing}
                                </p>
                            </div>
                        {/if}
                        {#if safeFormData.useOfFunds.operations}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-2"
                                >
                                    Operations
                                </h4>
                                <p
                                    class="text-sm text-muted-foreground leading-7"
                                >
                                    {safeFormData.useOfFunds.operations}
                                </p>
                            </div>
                        {/if}
                        {#if safeFormData.useOfFunds.team}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-2"
                                >
                                    Team Expansion
                                </h4>
                                <p
                                    class="text-sm text-muted-foreground leading-7"
                                >
                                    {safeFormData.useOfFunds.team}
                                </p>
                            </div>
                        {/if}
                        {#if safeFormData.useOfFunds.other}
                            <div>
                                <h4
                                    class="scroll-m-20 text-xl font-semibold tracking-tight text-primary mb-2"
                                >
                                    Other
                                </h4>
                                <p
                                    class="text-sm text-muted-foreground leading-7"
                                >
                                    {safeFormData.useOfFunds.other}
                                </p>
                            </div>
                        {/if}
                    </CardContent>
                </Card>
            {/if}
        </div>
    </div>
{/if}
