<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { FileUpload } from "$lib/components/ui/file-upload";

	const dispatch = createEventDispatcher();

	interface Props {
		formData: any;
	}

	let { formData }: Props = $props();

	let localData = $state({
		documents: formData.documents || [],
		termsAccepted: formData.termsAccepted || false,
		verificationNotes: formData.verificationNotes || "",
	});

	let uploadedFiles = $state([]);

	function handleFileUpload(files: FileList) {
		const newFiles = Array.from(files).map((file) => ({
			name: file.name,
			size: file.size,
			type: file.type,
			uploaded: true,
		}));

		uploadedFiles = [...uploadedFiles, ...newFiles];
		localData.documents = [...localData.documents, ...newFiles];
	}

	function removeDocument(index: number) {
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		localData.documents = localData.documents.filter((_, i) => i !== index);
	}

	function handleSubmit() {
		if (!localData.termsAccepted) {
			alert("Please accept the terms and conditions to continue");
			return;
		}

		dispatch("updateFormData", localData);
		dispatch("next");
	}

	$effect(() => {
		if (formData) {
			localData = {
				documents: formData.documents || [],
				termsAccepted: formData.termsAccepted || false,
				verificationNotes: formData.verificationNotes || "",
			};
			uploadedFiles = formData.documents || [];
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold mb-2">Verification & Documents</h2>
		<p class="text-muted-foreground">
			Upload verification documents to establish credibility with startups
		</p>
	</div>

	<!-- Document Upload Section -->
	<div class="space-y-4">
		<div>
			<h3 class="text-lg font-medium mb-2">Required Documents</h3>
			<p class="text-sm text-muted-foreground mb-4">
				Upload documents to verify your organization's legitimacy and
				investment capabilities
			</p>
		</div>

		<!-- Document Types -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card class="p-4">
				<h4 class="font-medium mb-2">Business Documents</h4>
				<ul class="text-sm text-muted-foreground space-y-1">
					<li>• Business license or registration</li>
					<li>• Tax ID or EIN documentation</li>
					<li>• Articles of incorporation</li>
					<li>• Operating agreement</li>
				</ul>
			</Card>

			<Card class="p-4">
				<h4 class="font-medium mb-2">Investment Documents</h4>
				<ul class="text-sm text-muted-foreground space-y-1">
					<li>• Fund documentation (if applicable)</li>
					<li>• Investment committee charter</li>
					<li>• Due diligence process overview</li>
					<li>• Investment policy statement</li>
				</ul>
			</Card>
		</div>

		<!-- File Upload Area -->
		<Card class="p-6">
			<FileUpload
				onUpload={handleFileUpload}
				accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
				maxSize={10}
				multiple
			>
				<div class="text-center">
					<div class="mb-4">
						<svg
							class="w-12 h-12 text-muted-foreground mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							></path>
						</svg>
					</div>
					<p class="text-lg font-medium mb-1">
						Upload Verification Documents
					</p>
					<p class="text-sm text-muted-foreground">
						Drag and drop files here, or click to browse
					</p>
					<p class="text-xs text-muted-foreground mt-2">
						Supported: PDF, DOC, DOCX, JPG, PNG (max 10MB each)
					</p>
				</div>
			</FileUpload>
		</Card>

		<!-- Uploaded Files List -->
		{#if uploadedFiles.length > 0}
			<div class="space-y-2">
				<h4 class="font-medium">Uploaded Documents</h4>
				{#each uploadedFiles as file, index}
					<Card class="p-3">
						<div class="flex justify-between items-center">
							<div class="flex items-center space-x-3">
								<svg
									class="w-5 h-5 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<div>
									<p class="text-sm font-medium">
										{file.name}
									</p>
									<p class="text-xs text-muted-foreground">
										{(file.size / 1024 / 1024).toFixed(2)} MB
										• {file.type}
									</p>
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onclick={() => removeDocument(index)}
							>
								Remove
							</Button>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Additional Notes -->
	<div class="space-y-4">
		<div>
			<label
				for="verificationNotes"
				class="block text-sm font-medium mb-2"
			>
				Additional Notes (Optional)
			</label>
			<textarea
				id="verificationNotes"
				bind:value={localData.verificationNotes}
				placeholder="Any additional information about your verification documents..."
				class="textarea textarea-bordered w-full"
				rows={3}
			/>
		</div>
	</div>

	<!-- Terms and Conditions -->
	<Card class="p-4 bg-muted/50">
		<div class="flex items-start space-x-3">
			<Checkbox
				id="terms"
				bind:checked={localData.termsAccepted}
				class="mt-1"
			/>
			<div>
				<label for="terms" class="text-sm font-medium cursor-pointer">
					Terms and Conditions
				</label>
				<p class="text-sm text-muted-foreground mt-1">
					I agree to provide accurate information and understand that
					false information may result in account suspension. I also
					agree to use the platform responsibly and in accordance with
					the terms of service.
				</p>
			</div>
		</div>
	</Card>

	<!-- Action Buttons -->
	<div class="flex justify-between pt-4">
		<Button variant="outline" onclick={() => dispatch("previous")}>
			Previous
		</Button>
		<Button onclick={handleSubmit} disabled={!localData.termsAccepted}>
			Next Step
		</Button>
	</div>
</div>
