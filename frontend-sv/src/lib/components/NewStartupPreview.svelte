<script lang="ts">
	import { Card, CardContent, CardHeader } from "@/components/ui/card";
	import type { StartupSchema } from "@/schemas/startup-schema";
	import type { Infer, SuperValidated } from "sveltekit-superforms";

	let {
		showPreview,
		data,
	}: {
		showPreview: boolean;
		data: { form: SuperValidated<Infer<StartupSchema>> };
	} = $props();
</script>

{#if showPreview}
	<div class="space-y-8">
		<Card>
			<CardHeader>
				<!-- <div class="flex items-center gap-4">
                                    {#if logoPreview}
                                        <img
                                            src={logoPreview}
                                            alt="Startup logo"
                                            class="w-16 h-16 rounded-lg object-cover"
                                        />
                                    {:else}
                                        <div
                                            class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center"
                                        >
                                            <span class="text-2xl">🚀</span>
                                        </div>
                                    {/if}
                                    <div>
                                        <CardTitle
                                            >{$formData.name ||
                                                "Your Startup Name"}</CardTitle
                                        >
                                        <CardDescription
                                            >{$formData.industry ||
                                                "Industry"}</CardDescription
                                        >
                                    </div>
                                </div> -->
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- <div>
                                    <h3 class="text-lg font-semibold mb-2">
                                        About
                                    </h3>
                                    <p class="text-muted-foreground">
                                        {$formData.description ||
                                            "Startup description will appear here"}
                                    </p>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <h3 class="text-lg font-semibold">
                                            Key Metrics
                                        </h3>
                                        <div class="space-y-2">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-muted-foreground"
                                                    >Revenue:</span
                                                >
                                                <span
                                                    >{$formData.metrics
                                                        ?.revenue ||
                                                        "Not specified"}</span
                                                >
                                            </div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-muted-foreground"
                                                    >Growth:</span
                                                >
                                                <span
                                                    >{$formData.metrics
                                                        ?.growth ||
                                                        "Not specified"}</span
                                                >
                                            </div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-muted-foreground"
                                                    >Customers:</span
                                                >
                                                <span
                                                    >{$formData.metrics
                                                        ?.customers ||
                                                        "Not specified"}</span
                                                >
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <h3 class="text-lg font-semibold">
                                            Funding
                                        </h3>
                                        <div class="space-y-2">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-muted-foreground"
                                                    >Total:</span
                                                >
                                                <span
                                                    >{$formData.funding
                                                        ?.total ||
                                                        "Not specified"}</span
                                                >
                                            </div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-muted-foreground"
                                                    >Last Round:</span
                                                >
                                                <span
                                                    >{$formData.funding
                                                        ?.lastRound ||
                                                        "Not specified"}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
 -->
				<!-- More preview sections would follow the same pattern -->
				<!-- ... -->
			</CardContent>
		</Card>
	</div>
{/if}
