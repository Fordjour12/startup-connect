<script lang="ts">
    import NewStartupForm from "@/components/NewStartupForm.svelte";
    import NewStartupPreview from "@/components/NewStartupPreview.svelte";
    import { Button } from "@/components/ui/button";
    import { startupSchema } from "@/schemas/startup-schema";
    import { cn } from "@/utils";
    import { toast } from "svelte-sonner";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

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

    // // File handling with runes
    // let pitchDeckFile = $state<File | null>(null);
    // let logoFile = $state<File | null>(null);
    // let logoPreview = $state<string | null>(null);
    // let productScreenshots = $state<File[]>([]);
    // let demoVideo = $state<File | null>(null);
    // let screenshotPreviews = $state<string[]>([]);

    // // Handlers for file uploads
    // function handleFileUpload(event: { detail: { files: File[] } }) {
    //     if (event.detail.files.length > 0) {
    //         pitchDeckFile = event.detail.files[0];
    //     }
    // }

    // function handleFileRemove() {
    //     pitchDeckFile = null;
    // }

    // function handleLogoUpload(event: { detail: { files: File[] } }) {
    //     if (event.detail.files.length > 0) {
    //         logoFile = event.detail.files[0];
    //         logoPreview = URL.createObjectURL(event.detail.files[0]);
    //     }
    // }

    // function handleLogoRemove() {
    //     logoFile = null;
    //     if (logoPreview) {
    //         URL.revokeObjectURL(logoPreview);
    //         logoPreview = null;
    //     }
    // }

    // function handleScreenshotUpload(event: { detail: { files: File[] } }) {
    //     productScreenshots = event.detail.files;
    //     screenshotPreviews = event.detail.files.map((file) =>
    //         URL.createObjectURL(file),
    //     );
    // }

    // function handleScreenshotRemove(index: number) {
    //     URL.revokeObjectURL(screenshotPreviews[index]);
    //     productScreenshots = productScreenshots.filter((_, i) => i !== index);
    //     screenshotPreviews = screenshotPreviews.filter((_, i) => i !== index);
    // }

    // function handleDemoVideoUpload(event: { detail: { files: File[] } }) {
    //     if (event.detail.files.length > 0) {
    //         demoVideo = event.detail.files[0];
    //     }
    // }

    // function handleDemoVideoRemove() {
    //     demoVideo = null;
    // }

    // // Team members
    // function addTeamMember() {
    //     const currentTeamMembers = $formData.teamMembers || [];
    //     $formData.teamMembers = [
    //         ...currentTeamMembers,
    //         {
    //             name: "",
    //             role: "",
    //             bio: "",
    //             linkedin: "",
    //         },
    //     ];
    // }

    // function removeTeamMember(index: number) {
    //     const currentTeamMembers = $formData.teamMembers || [];
    //     $formData.teamMembers = currentTeamMembers.filter(
    //         (_, i) => i !== index,
    //     );
    // }

    // // Timeline milestones
    // function addPastMilestone() {
    //     const timeline = $formData.timeline || { past: [], future: [] };
    //     const currentPast = timeline.past || [];

    //     $formData.timeline = {
    //         ...timeline,
    //         past: [
    //             ...currentPast,
    //             {
    //                 date: "",
    //                 title: "",
    //                 description: "",
    //                 type: "achievement" as const,
    //             },
    //         ],
    //     };
    // }

    // function removePastMilestone(index: number) {
    //     if (!$formData.timeline?.past) return;

    //     $formData.timeline = {
    //         ...$formData.timeline,
    //         past: $formData.timeline.past.filter((_, i) => i !== index),
    //     };
    // }

    // function addFutureMilestone() {
    //     const timeline = $formData.timeline || { past: [], future: [] };
    //     const currentFuture = timeline.future || [];

    //     $formData.timeline = {
    //         ...timeline,
    //         future: [
    //             ...currentFuture,
    //             {
    //                 date: "",
    //                 title: "",
    //                 description: "",
    //                 type: "launch" as const,
    //             },
    //         ],
    //     };
    // }

    // function removeFutureMilestone(index: number) {
    //     if (!$formData.timeline?.future) return;

    //     $formData.timeline = {
    //         ...$formData.timeline,
    //         future: $formData.timeline.future.filter((_, i) => i !== index),
    //     };
    // }

    // Toggle functions
    function togglePreview() {
        showPreview = !showPreview;
    }

    function toggleTeamSection() {
        showTeamSection = !showTeamSection;
    }
</script>

<div class="container mx-auto py-5 px-3">
    <div class="mx-auto">
        <div class="flex flex-col gap-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold mb-2">Create New Startup</h1>
                    <p class="text-muted-foreground">
                        Fill in your startup details to create your profile
                    </p>
                </div>
                <Button variant="outline" onclick={() => togglePreview()}>
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
            </div>

            <div
                class={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-8",
                    !showPreview && "!grid-cols-1",
                )}
            >
                <!-- Form Section -->
                <NewStartupForm {data} />

                <!-- Preview Section -->
                <NewStartupPreview {showPreview} {data} />
            </div>
        </div>
    </div>
</div>
