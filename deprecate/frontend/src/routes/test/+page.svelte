<script lang="ts">
   import { enhance } from "$app/forms";
   import { Alert, AlertDescription } from "@/components/ui/alert";
   import { Badge } from "@/components/ui/badge";
   import { Button } from "@/components/ui/button";
   import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
   } from "@/components/ui/card";
   import { cn } from "@/utils";
   import {
      CheckCircle,
      FileText,
      Image,
      Upload,
      Video,
      XCircle,
   } from "@lucide/svelte";

   // Reactive state for upload results
   let uploadResults = $state<Record<string, any>>({});
   let isUploading = $state<Record<string, boolean>>({});
   let uploadErrors = $state<Record<string, string>>({});

   // Handle form submission with progress tracking
   function handleUpload(formType: string) {
      return async ({ form, data, action, cancel }) => {
         isUploading[formType] = true;
         uploadErrors[formType] = "";

         try {
            const response = await fetch(action, {
               method: "POST",
               body: data,
            });

            const result = await response.json();

            if (response.ok && result.success) {
               uploadResults[formType] = result.data;
            } else {
               uploadErrors[formType] = result.message || "Upload failed";
            }
         } catch (error) {
            uploadErrors[formType] = `Network error: ${error}`;
         } finally {
            isUploading[formType] = false;
         }
      };
   }
</script>

<div class="container mx-auto p-6 space-y-8">
   <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Upload Endpoint Testing</h1>
      <p class="text-muted-foreground">
         Test all upload endpoints and verify database writing functionality
      </p>
   </div>

   <!-- Single File Uploads -->
   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Image Upload -->
      <Card>
         <CardHeader>
            <CardTitle class="flex items-center gap-2">
               <Image class="w-5 h-5" />
               Image Upload
            </CardTitle>
            <CardDescription
               >Test single image upload with processing</CardDescription
            >
         </CardHeader>
         <CardContent class="space-y-4">
            <form
               method="post"
               action="?/image"
               enctype="multipart/form-data"
               use:enhance
            >
               <!-- use:enhance={handleUpload("image")} -->

               <div class="space-y-2">
                  <label for="image" class="text-sm font-medium"
                     >Select Image</label
                  >
                  <input
                     id="image"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="file"
                     type="file"
                     accept="image/*"
                     required
                  />
               </div>
               <Button
                  type="submit"
                  disabled={isUploading.image}
                  class="w-full mt-4"
               >
                  {#if isUploading.image}
                     <Upload class="w-4 h-4 mr-2 animate-spin" />
                     Uploading...
                  {:else}
                     <Upload class="w-4 h-4 mr-2" />
                     Upload Image
                  {/if}
               </Button>
            </form>

            {#if uploadResults.image}
               <Alert class="border-green-200 bg-green-50">
                  <CheckCircle class="h-4 w-4 text-green-600" />
                  <AlertDescription class="text-green-800">
                     <div class="font-medium">Upload Successful!</div>
                     <div class="text-sm mt-1">
                        <div>File ID: {uploadResults.image.file_id}</div>
                        <div>
                           Size: {(uploadResults.image.size / 1024).toFixed(1)} KB
                        </div>
                        {#if uploadResults.image.thumbnail_url}
                           <div class="mt-2">
                              <img
                                 src={uploadResults.image.thumbnail_url}
                                 alt="Thumbnail"
                                 class="w-16 h-16 object-cover rounded"
                              />
                           </div>
                        {/if}
                     </div>
                  </AlertDescription>
               </Alert>
            {/if}

            {#if uploadErrors.image}
               <Alert class="border-red-200 bg-red-50">
                  <XCircle class="h-4 w-4 text-red-600" />
                  <AlertDescription class="text-red-800">
                     {uploadErrors.image}
                  </AlertDescription>
               </Alert>
            {/if}
         </CardContent>
      </Card>

      <!-- Document Upload -->
      <Card>
         <CardHeader>
            <CardTitle class="flex items-center gap-2">
               <FileText class="w-5 h-5" />
               Document Upload
            </CardTitle>
            <CardDescription
               >Test document upload (PDF, Word, etc.)</CardDescription
            >
         </CardHeader>
         <CardContent class="space-y-4">
            <form
               method="post"
               action="?/document"
               enctype="multipart/form-data"
               use:enhance
            >
               <div class="space-y-2">
                  <label for="document" class="text-sm font-medium"
                     >Select Document</label
                  >
                  <input
                     id="document"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="document"
                     type="file"
                     accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.json"
                     required
                  />
               </div>
               <Button
                  type="submit"
                  disabled={isUploading.document}
                  class="w-full mt-4"
               >
                  {#if isUploading.document}
                     <Upload class="w-4 h-4 mr-2 animate-spin" />
                     Uploading...
                  {:else}
                     <Upload class="w-4 h-4 mr-2" />
                     Upload Document
                  {/if}
               </Button>
            </form>

            {#if uploadResults.document}
               <Alert class="border-green-200 bg-green-50">
                  <CheckCircle class="h-4 w-4 text-green-600" />
                  <AlertDescription class="text-green-800">
                     <div class="font-medium">Upload Successful!</div>
                     <div class="text-sm mt-1">
                        <div>File ID: {uploadResults.document.file_id}</div>
                        <div>
                           Size: {(uploadResults.document.size / 1024).toFixed(
                              1,
                           )} KB
                        </div>
                     </div>
                  </AlertDescription>
               </Alert>
            {/if}

            {#if uploadErrors.document}
               <Alert class="border-red-200 bg-red-50">
                  <XCircle class="h-4 w-4 text-red-600" />
                  <AlertDescription class="text-red-800">
                     {uploadErrors.document}
                  </AlertDescription>
               </Alert>
            {/if}
         </CardContent>
      </Card>

      <!-- Video Upload -->
      <Card>
         <CardHeader>
            <CardTitle class="flex items-center gap-2">
               <Video class="w-5 h-5" />
               Video Upload
            </CardTitle>
            <CardDescription
               >Test video upload (MP4, WebM, etc.)</CardDescription
            >
         </CardHeader>
         <CardContent class="space-y-4">
            <form
               method="post"
               action="?/video"
               enctype="multipart/form-data"
               use:enhance
            >
               <div class="space-y-2">
                  <label for="video" class="text-sm font-medium"
                     >Select Video</label
                  >
                  <input
                     id="video"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="video"
                     type="file"
                     accept="video/*"
                     required
                  />
               </div>
               <Button
                  type="submit"
                  disabled={isUploading.video}
                  class="w-full mt-4"
               >
                  {#if isUploading.video}
                     <Upload class="w-4 h-4 mr-2 animate-spin" />
                     Uploading...
                  {:else}
                     <Upload class="w-4 h-4 mr-2" />
                     Upload Video
                  {/if}
               </Button>
            </form>

            {#if uploadResults.video}
               <Alert class="border-green-200 bg-green-50">
                  <CheckCircle class="h-4 w-4 text-green-600" />
                  <AlertDescription class="text-green-800">
                     <div class="font-medium">Upload Successful!</div>
                     <div class="text-sm mt-1">
                        <div>File ID: {uploadResults.video.file_id}</div>
                        <div>
                           Size: {(
                              uploadResults.video.size /
                              1024 /
                              1024
                           ).toFixed(1)} MB
                        </div>
                     </div>
                  </AlertDescription>
               </Alert>
            {/if}

            {#if uploadErrors.video}
               <Alert class="border-red-200 bg-red-50">
                  <XCircle class="h-4 w-4 text-red-600" />
                  <AlertDescription class="text-red-800">
                     {uploadErrors.video}
                  </AlertDescription>
               </Alert>
            {/if}
         </CardContent>
      </Card>
   </div>

   <!-- Batch Upload Testing -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center gap-2">
            <Upload class="w-5 h-5" />
            Batch Upload Testing
         </CardTitle>
         <CardDescription
            >Test parallel batch upload with multiple files</CardDescription
         >
      </CardHeader>
      <CardContent class="space-y-4">
         <form
            method="post"
            action="?/batch"
            enctype="multipart/form-data"
            use:enhance
         >
            <div class="space-y-2">
               <label for="batch-files" class="text-sm font-medium"
                  >Select Multiple Files</label
               >
               <input
                  id="batch-files"
                  class={cn(
                     "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                     "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                     "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                  name="files"
                  type="file"
                  multiple
                  required
               />
               <p class="text-xs text-muted-foreground">
                  Select multiple files to test parallel upload
               </p>
            </div>
            <Button
               type="submit"
               disabled={isUploading.batch}
               class="w-full mt-4"
            >
               {#if isUploading.batch}
                  <Upload class="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
               {:else}
                  <Upload class="w-4 h-4 mr-2" />
                  Upload Batch
               {/if}
            </Button>
         </form>

         {#if uploadResults.batch}
            <Alert class="border-green-200 bg-green-50">
               <CheckCircle class="h-4 w-4 text-green-600" />
               <AlertDescription class="text-green-800">
                  <div class="font-medium">Batch Upload Results</div>
                  <div class="text-sm mt-1 space-y-1">
                     <div>Total Files: {uploadResults.batch.total_files}</div>
                     <div>Successful: {uploadResults.batch.success_count}</div>
                     <div>Failed: {uploadResults.batch.error_count}</div>
                     {#if uploadResults.batch.successful_uploads?.length > 0}
                        <div class="mt-2">
                           <div class="font-medium">Successful Uploads:</div>
                           {#each uploadResults.batch.successful_uploads as upload}
                              <div
                                 class="text-xs bg-green-100 p-1 rounded mt-1"
                              >
                                 {upload.filename} ({(
                                    upload.size / 1024
                                 ).toFixed(1)} KB)
                              </div>
                           {/each}
                        </div>
                     {/if}
                  </div>
               </AlertDescription>
            </Alert>
         {/if}

         {#if uploadErrors.batch}
            <Alert class="border-red-200 bg-red-50">
               <XCircle class="h-4 w-4 text-red-600" />
               <AlertDescription class="text-red-800">
                  {uploadErrors.batch}
               </AlertDescription>
            </Alert>
         {/if}
      </CardContent>
   </Card>

   <!-- Startup Files Upload Testing -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center gap-2">
            <Upload class="w-5 h-5" />
            Startup Files Upload
         </CardTitle>
         <CardDescription
            >Test startup-specific file upload with database linking</CardDescription
         >
      </CardHeader>
      <CardContent class="space-y-4">
         <form
            method="post"
            action="?/startup-files"
            enctype="multipart/form-data"
            use:enhance
         >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="space-y-2">
                  <label for="logo" class="text-sm font-medium"
                     >Startup Logo</label
                  >
                  <input
                     id="logo"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="logo"
                     type="file"
                     accept="image/*"
                  />
               </div>
               <div class="space-y-2">
                  <label for="pitch-deck" class="text-sm font-medium"
                     >Pitch Deck</label
                  >
                  <input
                     id="pitch-deck"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="pitch_deck"
                     type="file"
                     accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
               </div>
               <div class="space-y-2">
                  <label for="demo-video" class="text-sm font-medium"
                     >Demo Video</label
                  >
                  <input
                     id="demo-video"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="demo_video"
                     type="file"
                     accept="video/*"
                  />
               </div>
               <div class="space-y-2">
                  <label for="screenshots" class="text-sm font-medium"
                     >Product Screenshots</label
                  >
                  <input
                     id="screenshots"
                     class={cn(
                        "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                     )}
                     name="product_screenshots"
                     type="file"
                     accept="image/*"
                     multiple
                  />
               </div>
            </div>
            <div class="space-y-2 mt-4">
               <label for="startup-id" class="text-sm font-medium"
                  >Startup ID (Optional)</label
               >
               <input
                  id="startup-id"
                  class={cn(
                     "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                     "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                     "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                  name="startup_id"
                  type="text"
                  placeholder="Enter startup UUID to link files"
               />
            </div>
            <Button
               type="submit"
               disabled={isUploading["startup-files"]}
               class="w-full mt-4"
            >
               {#if isUploading["startup-files"]}
                  <Upload class="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
               {:else}
                  <Upload class="w-4 h-4 mr-2" />
                  Upload Startup Files
               {/if}
            </Button>
         </form>

         {#if uploadResults["startup-files"]}
            <Alert class="border-green-200 bg-green-50">
               <CheckCircle class="h-4 w-4 text-green-600" />
               <AlertDescription class="text-green-800">
                  <div class="font-medium">
                     Startup Files Upload Successful!
                  </div>
                  <div class="text-sm mt-1 space-y-1">
                     <div>
                        Total Files: {uploadResults["startup-files"]
                           .total_files}
                     </div>
                     <div>
                        Successful: {uploadResults["startup-files"]
                           .success_count}
                     </div>
                     {#if uploadResults["startup-files"].successful_uploads?.length > 0}
                        <div class="mt-2">
                           <div class="font-medium">Uploaded Files:</div>
                           {#each uploadResults["startup-files"].successful_uploads as upload}
                              <div
                                 class="text-xs bg-green-100 p-1 rounded mt-1"
                              >
                                 {upload.filename} ({(
                                    upload.size / 1024
                                 ).toFixed(1)} KB)
                              </div>
                           {/each}
                        </div>
                     {/if}
                  </div>
               </AlertDescription>
            </Alert>
         {/if}

         {#if uploadErrors["startup-files"]}
            <Alert class="border-red-200 bg-red-50">
               <XCircle class="h-4 w-4 text-red-600" />
               <AlertDescription class="text-red-800">
                  {uploadErrors["startup-files"]}
               </AlertDescription>
            </Alert>
         {/if}
      </CardContent>
   </Card>

   <!-- Upload Status Summary -->
   {#if Object.keys(uploadResults).length > 0}
      <Card>
         <CardHeader>
            <CardTitle>Upload Test Summary</CardTitle>
            <CardDescription>Overview of all upload tests</CardDescription>
         </CardHeader>
         <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {#each Object.entries(uploadResults) as [type, result]}
                  <div class="p-3 border rounded-lg">
                     <div class="flex items-center gap-2 mb-2">
                        <Badge
                           variant={result.success ? "default" : "destructive"}
                        >
                           {type}
                        </Badge>
                        {#if result.success}
                           <CheckCircle class="w-4 h-4 text-green-600" />
                        {:else}
                           <XCircle class="w-4 h-4 text-red-600" />
                        {/if}
                     </div>
                     {#if result.file_id}
                        <div class="text-xs text-muted-foreground">
                           ID: {result.file_id}
                        </div>
                     {/if}
                  </div>
               {/each}
            </div>
         </CardContent>
      </Card>
   {/if}

   <!-- Health Check Section -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center gap-2">
            <CheckCircle class="w-5 h-5" />
            Upload Service Health Check
         </CardTitle>
         <CardDescription
            >Verify upload service and database connectivity</CardDescription
         >
      </CardHeader>
      <CardContent class="space-y-4">
         <Button
            onclick={async () => {
               try {
                  const access_token = document.cookie
                     .split("; ")
                     .find((row) => row.startsWith("access_token="))
                     ?.split("=")[1];
                  if (!access_token) {
                     alert("Please log in first to test upload service");
                     return;
                  }

                  console.log("Access token:", access_token);

                  const response = await fetch("/api/upload-health", {
                     headers: {
                        Authorization: `Bearer ${access_token}`,
                     },
                  });

                  if (response.ok) {
                     const health = await response.json();
                     alert(
                        `Upload Service Status: ${health.status}\nStorage: ${health.storage}\nBucket: ${health.bucket}`,
                     );
                  } else {
                     alert("Upload service health check failed");
                  }
               } catch (error) {
                  alert(`Health check error: ${error}`);
               }
            }}
         >
            Check Upload Service Health
         </Button>

         <div class="text-sm text-muted-foreground">
            <p>This will test:</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
               <li>Upload service connectivity</li>
               <li>MinIO storage connection</li>
               <li>Database connectivity</li>
               <li>Authentication status</li>
            </ul>
         </div>
      </CardContent>
   </Card>
</div>
