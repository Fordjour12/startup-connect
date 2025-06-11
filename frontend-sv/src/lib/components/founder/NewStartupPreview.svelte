<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";

    let { showPreview, formData, logoPreview } = $props();
</script>

{#if showPreview}
    <div class="space-y-8">
        <Card>
            <CardHeader>
                <div class="flex items-center gap-4">
                    <div
                        class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center"
                    >
                        {#if logoPreview}
                            <img src={logoPreview} alt="Logo" class="w-16 h-16 rounded-lg" />
                        {:else}
                            <span class="text-2xl">🚀</span>
                        {/if}
                    </div>
                    <div>
                        <CardTitle
                            >{$formData.name || "Your Startup Name"}</CardTitle
                        >
                        <CardDescription
                            >{$formData.industry || "Industry"}</CardDescription
                        >
                    </div>
                </div>
            </CardHeader>
            <CardContent class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-2">About</h3>
                    <p class="text-muted-foreground">
                        {$formData.description ||
                            "Startup description will appear here"}
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-lg font-semibold mb-2">
                                Company Details
                            </h3>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Founded:</span
                                    >
                                    <span
                                        >{$formData.foundedYear ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Location:</span
                                    >
                                    <span
                                        >{$formData.location ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Team Size:</span
                                    >
                                    <span
                                        >{$formData.teamSize ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Website:</span
                                    >
                                    {#if $formData.website}
                                        <a
                                            href={$formData.website}
                                            target="_blank"
                                            class="text-primary hover:underline"
                                        >
                                            {$formData.website}
                                        </a>
                                    {:else}
                                        <span>Not specified</span>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mb-2">Funding</h3>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Stage:</span
                                    >
                                    <Badge variant="outline"
                                        >{$formData.fundingStage ||
                                            "Not specified"}</Badge
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Total:</span
                                    >
                                    <span
                                        >{$formData.funding?.total ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Last Round:</span
                                    >
                                    <span
                                        >{$formData.funding?.lastRound ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Investors:</span
                                    >
                                    <span
                                        >{$formData.funding?.investors ||
                                            "Not specified"}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <h3 class="text-lg font-semibold mb-2">
                                Key Metrics
                            </h3>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Revenue:</span
                                    >
                                    <span
                                        >{$formData.metrics?.revenue ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Growth:</span
                                    >
                                    <span
                                        >{$formData.metrics?.growth ||
                                            "Not specified"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Customers:</span
                                    >
                                    <span
                                        >{$formData.metrics?.customers ||
                                            "Not specified"}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mb-2">Contact</h3>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Email:</span
                                    >
                                    <span
                                        >{$formData.contact?.email ||
                                            "Not specified"}</span
                                    >
                                </div>
                                {#if $formData.contact?.phone}
                                    <div class="flex items-center gap-2">
                                        <span class="text-muted-foreground"
                                            >Phone:</span
                                        >
                                        <span>{$formData.contact.phone}</span>
                                    </div>
                                {/if}
                                {#if $formData.contact?.address}
                                    <div class="flex items-center gap-2">
                                        <span class="text-muted-foreground"
                                            >Address:</span
                                        >
                                        <span>{$formData.contact.address}</span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                {#if $formData.businessModel}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">
                            Business Model
                        </h3>
                        <p class="text-muted-foreground">
                            {$formData.businessModel}
                        </p>
                    </div>
                {/if}

                {#if $formData.targetMarket}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">
                            Target Market
                        </h3>
                        <p class="text-muted-foreground">
                            {$formData.targetMarket}
                        </p>
                    </div>
                {/if}

                {#if $formData.competitors}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Competitors</h3>
                        <p class="text-muted-foreground">
                            {$formData.competitors}
                        </p>
                    </div>
                {/if}

                {#if $formData.traction && ($formData.traction.users || $formData.traction.revenue || $formData.traction.growth || $formData.traction.partnerships)}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Traction</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#if $formData.traction.users}
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Users:</span
                                    >
                                    <span>{$formData.traction.users}</span>
                                </div>
                            {/if}
                            {#if $formData.traction.revenue}
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Revenue:</span
                                    >
                                    <span>{$formData.traction.revenue}</span>
                                </div>
                            {/if}
                            {#if $formData.traction.growth}
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Growth:</span
                                    >
                                    <span>{$formData.traction.growth}</span>
                                </div>
                            {/if}
                            {#if $formData.traction.partnerships}
                                <div class="flex items-center gap-2">
                                    <span class="text-muted-foreground"
                                        >Partnerships:</span
                                    >
                                    <span
                                        >{$formData.traction.partnerships}</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}

                {#if $formData.teamMembers && $formData.teamMembers.length > 0}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Team</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each $formData.teamMembers as member}
                                <Card>
                                    <CardContent class="p-4">
                                        <h4 class="font-medium">
                                            {member.name || "Team Member"}
                                        </h4>
                                        <p
                                            class="text-sm text-muted-foreground"
                                        >
                                            {member.role || "Role"}
                                        </p>
                                        {#if member.bio}
                                            <p class="text-sm mt-2">
                                                {member.bio}
                                            </p>
                                        {/if}
                                        {#if member.linkedin}
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                class="text-sm text-primary hover:underline"
                                            >
                                                LinkedIn Profile
                                            </a>
                                        {/if}
                                    </CardContent>
                                </Card>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if $formData.timeline && ($formData.timeline.past?.length || $formData.timeline.future?.length)}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Timeline</h3>

                        {#if $formData.timeline.past && $formData.timeline.past.length > 0}
                            <div class="mb-4">
                                <h4 class="font-medium mb-2">
                                    Past Milestones
                                </h4>
                                <div class="space-y-2">
                                    {#each $formData.timeline.past as milestone}
                                        <div
                                            class="border-l-2 border-primary pl-4"
                                        >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    class="text-xs"
                                                    >{milestone.type}</Badge
                                                >
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                    >{milestone.date}</span
                                                >
                                            </div>
                                            <h5 class="font-medium">
                                                {milestone.title}
                                            </h5>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        {#if $formData.timeline.future && $formData.timeline.future.length > 0}
                            <div>
                                <h4 class="font-medium mb-2">
                                    Future Milestones
                                </h4>
                                <div class="space-y-2">
                                    {#each $formData.timeline.future as milestone}
                                        <div
                                            class="border-l-2 border-dashed border-muted-foreground pl-4"
                                        >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    class="text-xs"
                                                    >{milestone.type}</Badge
                                                >
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                    >{milestone.date}</span
                                                >
                                            </div>
                                            <h5 class="font-medium">
                                                {milestone.title}
                                            </h5>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {milestone.description}
                                            </p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if $formData.useOfFunds}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Use of Funds</h3>
                        <div class="space-y-3">
                            {#if $formData.useOfFunds.product}
                                <div>
                                    <h4 class="font-medium">
                                        Product Development
                                    </h4>
                                    <p class="text-sm text-muted-foreground">
                                        {$formData.useOfFunds.product}
                                    </p>
                                </div>
                            {/if}
                            {#if $formData.useOfFunds.marketing}
                                <div>
                                    <h4 class="font-medium">
                                        Marketing & Sales
                                    </h4>
                                    <p class="text-sm text-muted-foreground">
                                        {$formData.useOfFunds.marketing}
                                    </p>
                                </div>
                            {/if}
                            {#if $formData.useOfFunds.operations}
                                <div>
                                    <h4 class="font-medium">Operations</h4>
                                    <p class="text-sm text-muted-foreground">
                                        {$formData.useOfFunds.operations}
                                    </p>
                                </div>
                            {/if}
                            {#if $formData.useOfFunds.team}
                                <div>
                                    <h4 class="font-medium">Team Expansion</h4>
                                    <p class="text-sm text-muted-foreground">
                                        {$formData.useOfFunds.team}
                                    </p>
                                </div>
                            {/if}
                            {#if $formData.useOfFunds.other}
                                <div>
                                    <h4 class="font-medium">Other</h4>
                                    <p class="text-sm text-muted-foreground">
                                        {$formData.useOfFunds.other}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}

                {#if $formData.socialMedia && ($formData.socialMedia.twitter || $formData.socialMedia.linkedin || $formData.socialMedia.facebook || $formData.socialMedia.instagram)}
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Social Media</h3>
                        <div class="flex flex-wrap gap-2">
                            {#if $formData.socialMedia.twitter}
                                <a
                                    href={$formData.socialMedia.twitter}
                                    target="_blank"
                                    class="text-primary hover:underline"
                                >
                                    <Badge variant="outline">Twitter</Badge>
                                </a>
                            {/if}
                            {#if $formData.socialMedia.linkedin}
                                <a
                                    href={$formData.socialMedia.linkedin}
                                    target="_blank"
                                    class="text-primary hover:underline"
                                >
                                    <Badge variant="outline">LinkedIn</Badge>
                                </a>
                            {/if}
                            {#if $formData.socialMedia.facebook}
                                <a
                                    href={$formData.socialMedia.facebook}
                                    target="_blank"
                                    class="text-primary hover:underline"
                                >
                                    <Badge variant="outline">Facebook</Badge>
                                </a>
                            {/if}
                            {#if $formData.socialMedia.instagram}
                                <a
                                    href={$formData.socialMedia.instagram}
                                    target="_blank"
                                    class="text-primary hover:underline"
                                >
                                    <Badge variant="outline">Instagram</Badge>
                                </a>
                            {/if}
                        </div>
                    </div>
                {/if}

                <div class="flex items-center gap-2">
                    <span class="text-muted-foreground">Status:</span>
                    <Badge
                        variant={$formData.isPublished
                            ? "default"
                            : "secondary"}
                    >
                        {$formData.isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    </div>
{/if}
