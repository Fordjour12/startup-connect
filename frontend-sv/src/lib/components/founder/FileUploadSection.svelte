<script lang="ts">
	import FileUpload from "$lib/components/file-upload.svelte";
	import { Alert, AlertDescription } from "$lib/components/ui/alert";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Progress } from "$lib/components/ui/progress";
	import StarIcon from "@tabler/icons-svelte/icons/star";
	import UploadIcon from "@tabler/icons-svelte/icons/upload";

	interface Template {
		id: string;
		name: string;
		preview: string;
		slides: number;
		category: string;
		rating: number;
		downloads: number;
	}

	interface Props {
		selectedFiles: File[];
		uploading: boolean;
		uploadProgress: number;
		showTemplates: boolean;
		templates: Template[];
		onUpload: (files: File[]) => void;
		onFilesChange: (files: File[]) => void;
		onDownloadTemplate: (template: Template) => void;
	}

	let {
		selectedFiles,
		uploading,
		uploadProgress,
		showTemplates,
		templates,
		onUpload,
		onFilesChange,
		onDownloadTemplate,
	}: Props = $props();
</script>

<Card class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<UploadIcon class="h-5 w-5" />
			Upload New Pitch Deck
		</CardTitle>
		<CardDescription>
			Upload your pitch deck files. Supported formats: PDF, PowerPoint
			(PPTX, PPT)
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-6">
		<FileUpload
			accept=".pdf,.ppt,.pptx"
			maxSize={50}
			multiple={true}
			bind:files={selectedFiles}
			{onUpload}
		/>

		{#if uploading}
			<div class="space-y-3 p-4 bg-background/50 rounded-lg border">
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium">Uploading and analyzing...</span>
					<span class="font-mono">{Math.round(uploadProgress)}%</span>
				</div>
				<Progress value={uploadProgress} class="h-2" />
			</div>
		{/if}

		<Alert class="border-0 bg-blue-50 dark:bg-blue-950/20">
			<AlertDescription class="flex items-start gap-2">
				<div class="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
					<StarIcon
						class="h-4 w-4 text-blue-600 dark:text-blue-400"
					/>
				</div>
				<div>
					<strong>Pro tip:</strong> Our AI will automatically analyze your
					pitch deck and provide feedback on structure, content, and effectiveness
					compared to successful decks in your industry.
				</div>
			</AlertDescription>
		</Alert>
	</CardContent>
</Card>

<!-- Templates Section -->
{#if showTemplates}
	<Card class="border-0 from-primary/5 to-card bg-gradient-to-t shadow-sm">
		<CardHeader>
			<CardTitle>Pitch Deck Templates</CardTitle>
			<CardDescription>
				Start with proven templates used by successful startups
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div
				class="@lg/main:grid-cols-2 @3xl/main:grid-cols-3 grid grid-cols-1 gap-4"
			>
				{#each templates as template}
					<Card
						class="border bg-background/50 hover:bg-background/80 transition-colors"
					>
						<CardContent class="p-4">
							<div
								class="aspect-video bg-muted rounded-lg mb-3 overflow-hidden border"
							>
								<img
									src={template.preview}
									alt="{template.name} preview"
									class="w-full h-full object-cover"
								/>
							</div>
							<h4 class="font-semibold mb-2">{template.name}</h4>
							<p class="text-sm text-muted-foreground mb-3">
								{template.slides} slides • {template.category}
							</p>
							<div class="flex items-center justify-between mb-4">
								<div class="flex items-center gap-1">
									<StarIcon
										class="h-4 w-4 text-yellow-500 fill-current"
									/>
									<span class="text-sm font-medium"
										>{template.rating}</span
									>
								</div>
								<span class="text-xs text-muted-foreground">
									{template.downloads} downloads
								</span>
							</div>
							<Button
								size="sm"
								variant="outline"
								class="w-full"
								onclick={() => onDownloadTemplate(template)}
							>
								Download Template
							</Button>
						</CardContent>
					</Card>
				{/each}
			</div>
		</CardContent>
	</Card>
{/if}
