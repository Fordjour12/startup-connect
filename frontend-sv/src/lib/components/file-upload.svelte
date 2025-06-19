<script lang="ts">
    import { Button } from "@/components/ui/button";
    import { cn } from "@/utils";
    import { Upload, X, File as FileIcon, Image } from "@lucide/svelte";
    import { browser } from "$app/environment";
    import { untrack } from "svelte";

    interface Props {
        accept?: string;
        maxSize?: number; // In MB
        multiple?: boolean;
        files?: FileList;
        placeholder?: string;
        class?: string;
        disabled?: boolean;
        showPreview?: boolean;
        onUpload?: (files: File[]) => void;
        onRemove?: (index: number) => void;
        persistFiles?: boolean; // New prop to persist files even if external binding is reset
        [key: string]: any; // Allow any additional props
    }

    let {
        accept = "*",
        maxSize = 50,
        multiple = false,
        files = $bindable(),
        placeholder = "Upload files",
        class: className = "",
        disabled = false,
        showPreview = true,
        onUpload,
        onRemove,
        persistFiles = false,
        ...restProps
    }: Props = $props();

    let dragOver = $state(false);
    let inputElement: HTMLInputElement;

    // Internal file state with preview URLs
    interface FileWithPreview {
        file: File;
        previewUrl?: string;
        id: string;
    }

    let internalFiles = $state<FileWithPreview[]>([]);

    // Track files length and last modified to avoid unnecessary updates
    let previousFilesLength = $state(0);
    let previousFilesSignature = $state("");

    // Sync internal files with external files binding
    $effect(() => {
        if (!browser) return;

        // Only clear internal files if files is explicitly set to an empty FileList
        // Don't clear if files is just undefined/null (which might happen during form navigation)
        // Also don't clear if persistFiles is enabled
        if (
            files !== undefined &&
            files !== null &&
            files.length === 0 &&
            !persistFiles
        ) {
            // Only clear if we previously had files
            if (internalFiles.length > 0 && previousFilesLength > 0) {
                // Clean up preview URLs before clearing
                internalFiles.forEach((fileWithPreview) => {
                    if (fileWithPreview.previewUrl) {
                        try {
                            URL.revokeObjectURL(fileWithPreview.previewUrl);
                        } catch (error) {
                            // Ignore cleanup errors
                        }
                    }
                });
                internalFiles = [];
                previousFilesLength = 0;
                previousFilesSignature = "";
            }
            return;
        }

        // If files is undefined/null, preserve existing internal files
        if (!files) {
            return;
        }

        const currentFiles = Array.from(files);

        // Create a signature to detect actual changes
        const currentSignature = currentFiles
            .map((f) => `${f.name}-${f.size}-${f.lastModified}`)
            .join("|");

        // Skip if files haven't actually changed
        if (
            currentFiles.length === previousFilesLength &&
            currentSignature === previousFilesSignature
        ) {
            return;
        }

        const newInternalFiles: FileWithPreview[] = [];
        const urlsToCleanup: string[] = [];

        currentFiles.forEach((file) => {
            // Check if this file already exists in our internal state
            const existing = internalFiles.find(
                (f) =>
                    f.file.name === file.name &&
                    f.file.size === file.size &&
                    f.file.lastModified === file.lastModified,
            );

            if (existing) {
                // Keep existing file with its preview
                newInternalFiles.push(existing);
            } else {
                // Create new file entry
                const id = `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`;
                const fileWithPreview: FileWithPreview = {
                    file,
                    id,
                    previewUrl: isImageFile(file)
                        ? createPreviewUrl(file)
                        : undefined,
                };
                newInternalFiles.push(fileWithPreview);
            }
        });

        // Clean up old preview URLs
        internalFiles.forEach((oldFile) => {
            if (
                !newInternalFiles.find((f) => f.id === oldFile.id) &&
                oldFile.previewUrl
            ) {
                urlsToCleanup.push(oldFile.previewUrl);
            }
        });

        // Update state
        internalFiles = newInternalFiles;
        previousFilesLength = currentFiles.length;
        previousFilesSignature = currentSignature;

        // Clean up URLs after state update to avoid timing issues
        if (urlsToCleanup.length > 0) {
            // Use setTimeout to avoid blocking the render
            setTimeout(() => {
                urlsToCleanup.forEach((url) => {
                    try {
                        URL.revokeObjectURL(url);
                    } catch (error) {
                        // Ignore cleanup errors
                    }
                });
            }, 0);
        }
    });

    function createPreviewUrl(file: File): string {
        if (!browser) return "";
        try {
            return URL.createObjectURL(file);
        } catch (error) {
            console.warn("Failed to create image preview:", error);
            return "";
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    function validateFile(file: File): string | null {
        // Check file type
        if (accept !== "*") {
            const allowedTypes = accept.split(",").map((t) => t.trim());
            const fileExtension =
                "." + file.name.split(".").pop()?.toLowerCase();

            if (
                !allowedTypes.includes(fileExtension) &&
                !allowedTypes.includes(file.type)
            ) {
                return `Invalid file type. Accepted types: ${accept}`;
            }
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return `File size exceeds ${maxSize}MB limit`;
        }

        return null;
    }

    function processFiles(newFiles: FileList | File[]) {
        if (!browser) return;

        const fileList = Array.isArray(newFiles)
            ? newFiles
            : Array.from(newFiles);
        const validFiles: File[] = [];
        const errorMessages: string[] = [];

        for (const file of fileList) {
            const error = validateFile(file);
            if (error) {
                errorMessages.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        }

        if (errorMessages.length > 0) {
            console.error(errorMessages.join("\n"));
        }

        if (validFiles.length > 0) {
            let finalFiles: File[];

            if (multiple) {
                const currentFiles = untrack(() =>
                    files ? Array.from(files) : [],
                );
                finalFiles = [...currentFiles, ...validFiles];
            } else {
                finalFiles = [validFiles[0]]; // Only take the first file for single upload
            }

            // Create new FileList for form compatibility - only in browser
            if (typeof DataTransfer !== "undefined") {
                const dt = new DataTransfer();
                finalFiles.forEach((file) => dt.items.add(file));
                files = dt.files;
            }

            onUpload?.(finalFiles);
        }
    }

    function handleFileSelect(event: Event) {
        if (!browser) return;

        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        processFiles(input.files);

        // Don't reset input immediately if persistFiles is enabled
        if (!persistFiles) {
            // Reset input
            input.value = "";
        }
    }

    function handleDrop(event: DragEvent) {
        if (!browser) return;

        event.preventDefault();
        dragOver = false;

        if (disabled) return;

        const droppedFiles = event.dataTransfer?.files;
        if (droppedFiles?.length) {
            processFiles(droppedFiles);
        }
    }

    function handleDragOver(event: DragEvent) {
        if (!browser) return;

        event.preventDefault();
        if (!disabled) {
            dragOver = true;
        }
    }

    function handleDragLeave(event: DragEvent) {
        if (!browser) return;

        event.preventDefault();
        dragOver = false;
    }

    function removeFile(index: number) {
        if (!browser) return;

        const currentFiles = untrack(() => (files ? Array.from(files) : []));
        const newFiles = currentFiles.filter((_, i) => i !== index);

        // Create new FileList - only in browser
        if (typeof DataTransfer !== "undefined") {
            const dt = new DataTransfer();
            newFiles.forEach((file) => dt.items.add(file));
            files = dt.files;
        }

        onRemove?.(index);
    }

    function clearAllFiles() {
        if (!browser) return;

        if (typeof DataTransfer !== "undefined") {
            const dt = new DataTransfer();
            files = dt.files;
        }
        onRemove?.(-1);
    }

    function openFileDialog() {
        if (!browser || disabled) return;
        inputElement?.click();
    }

    function isImageFile(file: File): boolean {
        return file.type.startsWith("image/");
    }

    // Cleanup all preview URLs when component is destroyed
    $effect(() => {
        // Capture current files for cleanup
        const currentInternalFiles = [...internalFiles];

        return () => {
            if (browser && currentInternalFiles.length > 0) {
                currentInternalFiles.forEach((fileWithPreview) => {
                    if (fileWithPreview.previewUrl) {
                        try {
                            URL.revokeObjectURL(fileWithPreview.previewUrl);
                        } catch (error) {
                            // Ignore cleanup errors
                        }
                    }
                });
            }
        };
    });
</script>

<div class={cn("w-full", className)}>
    <!-- Hidden file input -->
    <input
        bind:this={inputElement}
        type="file"
        bind:files
        {accept}
        {multiple}
        {disabled}
        class="hidden"
        onchange={handleFileSelect}
        {...restProps}
    />

    <!-- Drop zone -->
    <div
        class={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
            dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed",
            internalFiles.length > 0 ? "p-4" : "p-8",
        )}
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        onclick={openFileDialog}
        role="button"
        tabindex={disabled ? -1 : 0}
        onkeydown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
                e.preventDefault();
                openFileDialog();
            }
        }}
    >
        {#if internalFiles.length === 0}
            <!-- Empty state -->
            <div class="text-center">
                <div
                    class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted"
                >
                    <Upload class="h-6 w-6 text-muted-foreground" />
                </div>
                <div class="mb-2">
                    <p class="text-sm font-medium">
                        {placeholder}
                    </p>
                    <p class="text-xs text-muted-foreground">
                        Drop your files here, or browse
                    </p>
                </div>
                <p class="text-xs text-muted-foreground">
                    {accept !== "*"
                        ? `${accept.replace(/\*/g, "All")} files`
                        : "All files"}
                    (Max: {maxSize}MB{multiple ? " each" : ""})
                </p>
            </div>
        {:else}
            <!-- Files preview -->
            <div class="space-y-3">
                {#if showPreview}
                    {#each internalFiles as fileWithPreview, index (fileWithPreview.id)}
                        <div
                            class="flex items-center gap-3 rounded-lg border bg-card p-3"
                        >
                            <!-- File icon/preview -->
                            <div class="flex-shrink-0">
                                {#if fileWithPreview.previewUrl}
                                    <img
                                        src={fileWithPreview.previewUrl}
                                        alt={fileWithPreview.file.name}
                                        class="h-10 w-10 rounded object-cover"
                                    />
                                {:else}
                                    <div
                                        class="flex h-10 w-10 items-center justify-center rounded bg-muted"
                                    >
                                        <FileIcon
                                            class="h-5 w-5 text-muted-foreground"
                                        />
                                    </div>
                                {/if}
                            </div>

                            <!-- File info -->
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-medium truncate">
                                    {fileWithPreview.file.name}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {formatFileSize(fileWithPreview.file.size)}
                                </p>
                            </div>

                            <!-- Remove button -->
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onclick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                {disabled}
                            >
                                <X class="h-4 w-4" />
                                <span class="sr-only"
                                    >Remove {fileWithPreview.file.name}</span
                                >
                            </Button>
                        </div>
                    {/each}
                {/if}

                <!-- Actions -->
                <div class="flex items-center justify-between pt-2 border-t">
                    <p class="text-xs text-muted-foreground">
                        {internalFiles.length} file{internalFiles.length !== 1
                            ? "s"
                            : ""} selected
                    </p>
                    <div class="flex gap-2">
                        {#if multiple && internalFiles.length > 1}
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={(e) => {
                                    e.stopPropagation();
                                    clearAllFiles();
                                }}
                                {disabled}
                            >
                                Clear all
                            </Button>
                        {/if}
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={(e) => {
                                e.stopPropagation();
                                openFileDialog();
                            }}
                            {disabled}
                        >
                            {multiple ? "Add more" : "Replace"}
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
