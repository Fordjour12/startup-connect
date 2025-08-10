<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
	    Dialog,
	    DialogContent,
	    DialogDescription,
	    DialogFooter,
	    DialogHeader,
	    DialogTitle,
	} from "$lib/components/ui/dialog";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
// import { endpoints } from "$lib/endpoints";
	import { toast } from "svelte-sonner";

	interface Props {
		investorId: string;
		investorName: string;
		isOpen?: boolean;
		onClose?: () => void;
		onSuccess?: () => void;
	}

	let {
		investorId,
		investorName,
		isOpen = $bindable(false),
		onClose,
		onSuccess,
	}: Props = $props();

	let messageContent = $state("");
	let pitchDeckFile: File | null = $state(null);
	let isSubmitting = $state(false);
	let fileInput: HTMLInputElement | null = $state(null)

	const MAX_FILE_SIZE = 10; // 10MB
	const MAX_MESSAGE_LENGTH = 1000;

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		// Validate file size
		if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
			toast.error(`File size must be less than ${MAX_FILE_SIZE}MB`);
			input.value = "";
			return;
		}

		// Validate file type (PDF, PowerPoint)
		const allowedTypes = [
			"application/pdf",
			"application/vnd.ms-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
		];

		if (!allowedTypes.includes(file.type)) {
			toast.error("Please upload a PDF or PowerPoint file");
			input.value = "";
			return;
		}

		pitchDeckFile = file;
	}

	function removePitchDeck() {
		pitchDeckFile = null;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	async function handleSubmit() {
		if (!messageContent.trim()) {
			toast.error("Please enter a message");
			return;
		}

		if (!pitchDeckFile) {
			toast.error("Please upload a pitch deck");
			return;
		}

		isSubmitting = true;

		try {
			const formData = new FormData();
			formData.append("message_content", messageContent.trim());
			formData.append("pitch_deck_file", pitchDeckFile);

			// const response = await fetch(
			// 	`${endpoints.pitches}/send/${investorId}`,
			// 	{
			// 		method: "POST",
			// 		body: formData,
			// 		credentials: "include",
			// 	},
			// );

			// if (!response.ok) {
			// 	const error = await response.json();
			// 	throw new Error(error.detail || "Failed to send pitch");
			// }

			toast.success(`Pitch sent successfully to ${investorName}!`);

			// Reset form
			messageContent = "";
			pitchDeckFile = null;
			if (fileInput) {
				fileInput.value = "";
			}

			isOpen = false;
			onSuccess?.();
		} catch (error) {
			console.error("Failed to send pitch:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to send pitch",
			);
		} finally {
			isSubmitting = false;
		}
	}

	function handleClose() {
		if (isSubmitting) return; // Prevent closing while submitting

		isOpen = false;
		onClose?.();
	}

	// Calculate remaining characters
	let remainingChars = $derived(MAX_MESSAGE_LENGTH - messageContent.length);
	let isFormValid = $derived(
		messageContent.trim() && pitchDeckFile && !isSubmitting,
	);
</script>

<Dialog bind:open={isOpen} onOpenChange={handleClose}>
	<DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
		<DialogHeader>
			<DialogTitle>Send Pitch to {investorName}</DialogTitle>
			<DialogDescription>
				Compose your message and upload your pitch deck to send to this
				investor.
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-6 py-4">
			<!-- Message Content -->
			<div class="space-y-2">
				<Label for="message">Your Message</Label>
				<Textarea
					id="message"
					bind:value={messageContent}
					placeholder="Write a compelling message to introduce your startup and explain why this investor would be a great fit..."
					class="min-h-[120px] resize-none"
					maxlength={MAX_MESSAGE_LENGTH}
					disabled={isSubmitting}
				/>
				<div class="flex justify-between text-xs text-muted-foreground">
					<span
						>Be clear and concise about your value proposition</span
					>
					<span class:text-destructive={remainingChars < 50}>
						{remainingChars} characters remaining
					</span>
				</div>
			</div>

			<!-- Pitch Deck Upload -->
			<div class="space-y-2">
				<Label for="pitch-deck">Pitch Deck</Label>

				{#if !pitchDeckFile}
					<div
						class="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
					>
						<input
							bind:this={fileInput}
							type="file"
							id="pitch-deck"
							class="hidden"
							accept=".pdf,.ppt,.pptx"
							onchange={handleFileChange}
							disabled={isSubmitting}
						/>
						<label for="pitch-deck" class="cursor-pointer">
							<div class="flex flex-col items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-8 w-8 text-muted-foreground"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
								<span class="text-sm font-medium">
									Click to upload your pitch deck
								</span>
								<span class="text-xs text-muted-foreground">
									PDF or PowerPoint (Max: {MAX_FILE_SIZE}MB)
								</span>
							</div>
						</label>
					</div>
				{:else}
					<div
						class="flex items-center justify-between p-3 bg-muted rounded-lg"
					>
						<div class="flex items-center gap-3">
							<div class="p-2 bg-primary/10 rounded">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium">
									{pitchDeckFile.name}
								</p>
								<p class="text-xs text-muted-foreground">
									{formatFileSize(pitchDeckFile.size)}
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onclick={removePitchDeck}
							disabled={isSubmitting}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Button>
					</div>
				{/if}
			</div>
		</div>

		<DialogFooter>
			<Button
				variant="outline"
				onclick={handleClose}
				disabled={isSubmitting}
			>
				Cancel
			</Button>
			<Button
				onclick={handleSubmit}
				disabled={!isFormValid}
				class="min-w-[100px]"
			>
				{#if isSubmitting}
					<svg
						class="animate-spin -ml-1 mr-2 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Sending...
				{:else}
					Send Pitch
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
