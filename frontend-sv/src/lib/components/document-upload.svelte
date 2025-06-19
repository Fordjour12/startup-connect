<script lang="ts">
	import { Button } from "$lib/components/ui/button";

	interface Props {
		maxSize?: number; // In MB
		multiple?: boolean;
		files?: File[];
		onUpload?: (files: File[]) => void;
		onRemove?: (index: number) => void;
	}

	let {
		maxSize = 10,
		multiple = false,
		files = $bindable([]),
		onUpload,
		onRemove,
	}: Props = $props();

	// Predefined document formats
	const accept = ".pdf,.ppt,.pptx,.doc,.docx";
	const allowedExtensions = [".pdf", ".ppt", ".pptx", ".doc", ".docx"];

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const selectedFiles: File[] = [];
		let hasInvalidSize = false;
		let hasInvalidType = false;

		for (let i = 0; i < input.files.length; i++) {
			const file = input.files[i];

			// Check file type
			const fileExtension =
				"." + file.name.split(".").pop()?.toLowerCase();
			if (!allowedExtensions.includes(fileExtension)) {
				hasInvalidType = true;
				continue;
			}

			// Check file size
			if (file.size > maxSize * 1024 * 1024) {
				hasInvalidSize = true;
				continue;
			}
			selectedFiles.push(file);
		}

		// Consider adding error state to props and displaying inline errors
		if (hasInvalidType || hasInvalidSize) {
			// Emit error event or update error state for parent component to handle
			// onError?.({ hasInvalidType, hasInvalidSize, maxSize });
		}

		if (selectedFiles.length) {
			files = selectedFiles;
			onUpload?.(selectedFiles);
		}

		// Reset input so the same file can be selected again if needed
		input.value = "";
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		onRemove?.(index);
	}

	function removeAllFiles() {
		files = [];
		onRemove?.(-1);
	}

	function getFileIcon(fileName: string) {
		const extension = fileName.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "pdf":
				return "📄";
			case "ppt":
			case "pptx":
				return "📊";
			case "doc":
			case "docx":
				return "📝";
			default:
				return "📄";
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div
		class="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
	>
		<input
			type="file"
			{accept}
			{multiple}
			class="hidden"
			id="document-upload"
			onchange={handleFileChange}
		/>
		<label for="document-upload" class="cursor-pointer">
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
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<span class="text-sm font-medium">
					{#if files.length}
						Replace document
					{:else}
						Click to upload or drag and drop
					{/if}
				</span>
				<span class="text-xs text-muted-foreground">
					PDF, PPT, PPTX, DOC, DOCX (Max: {maxSize}MB)
				</span>
			</div>
		</label>
	</div>

	{#if files.length > 0}
		<div class="mt-2 space-y-2">
			{#each files as file, index}
				<div
					class="flex items-center justify-between p-2 bg-muted rounded-md"
				>
					<div class="flex items-center gap-2 truncate">
						<span class="text-lg">
							{getFileIcon(file.name)}
						</span>
						<div class="truncate">
							<p class="text-sm truncate">{file.name}</p>
							<p class="text-xs text-muted-foreground">
								{formatFileSize(file.size)}
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onclick={() => removeFile(index)}
						class="h-8 w-8"
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
						<span class="sr-only">Remove</span>
					</Button>
				</div>
			{/each}

			{#if files.length > 1}
				<Button
					variant="outline"
					size="sm"
					onclick={removeAllFiles}
					class="w-full mt-2"
				>
					Remove All Files
				</Button>
			{/if}
		</div>
	{/if}
</div>
