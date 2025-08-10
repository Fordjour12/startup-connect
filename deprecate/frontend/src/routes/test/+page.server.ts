import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
   image: async (event) => {
      console.log("Starting image upload");

      try {
         const access_token = event.cookies.get("access_token");
         if (!access_token) {
            return fail(401, { message: "Authentication required" });
         }

         const data = await event.request.formData();
         const image = data.get("file") as File;

         if (!image || image.size === 0) {
            return fail(400, { message: "No image file provided" });
         }

         console.log("Image file details:", {
            name: image.name,
            size: image.size,
            type: image.type,
            lastModified: image.lastModified
         });

         //Create new FormData with correct parameter name for backend
         const uploadData = new FormData();
         uploadData.append("file", image);

         const apiUrl = `${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_IMAGE}`;
         console.log("Upload URL:", apiUrl);

         const uploadResponse = await event.fetch(apiUrl, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${access_token}`,
               // Don't set Content-Type - let the browser set it automatically for FormData
            },
            body: uploadData
         });

         if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log("Image upload successful:", result);
            return { success: true, data: result };
         } else {
            const error = await uploadResponse.json();
            console.error("Image upload failed:", error);
            return fail(uploadResponse.status, { message: error.detail || "Image upload failed" });
         }
      } catch (error) {
         console.error("Image upload error:", error);
         return fail(500, { message: `Image upload failed: ${error}` });
      }
   },

   document: async (event) => {
      console.log("Starting document upload");

      try {
         const access_token = event.cookies.get("access_token");
         if (!access_token) {
            return fail(401, { message: "Authentication required" });
         }

         const data = await event.request.formData();
         const document = data.get("document") as File;

         if (!document || document.size === 0) {
            return fail(400, { message: "No document file provided" });
         }

         // Create new FormData with correct parameter name for backend
         const uploadData = new FormData();
         uploadData.append("file", document);

         const uploadResponse = await event.fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_DOCUMENT}`, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${access_token}`,
            },
            body: uploadData
         });

         if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log("Document upload successful:", result);
            return { success: true, data: result };
         } else {
            const error = await uploadResponse.json();
            console.error("Document upload failed:", error);
            return fail(uploadResponse.status, { message: error.detail || "Document upload failed" });
         }
      } catch (error) {
         console.error("Document upload error:", error);
         return fail(500, { message: `Document upload failed: ${error}` });
      }
   },

   video: async (event) => {
      console.log("Starting video upload");

      try {
         const access_token = event.cookies.get("access_token");
         if (!access_token) {
            return fail(401, { message: "Authentication required" });
         }

         const data = await event.request.formData();
         const video = data.get("video") as File;

         if (!video || video.size === 0) {
            return fail(400, { message: "No video file provided" });
         }

         // Create new FormData with correct parameter name for backend
         const uploadData = new FormData();
         uploadData.append("file", video);

         const uploadResponse = await event.fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_VIDEO}`, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${access_token}`,
            },
            body: uploadData
         });

         if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log("Video upload successful:", result);
            return { success: true, data: result };
         } else {
            const error = await uploadResponse.json();
            console.error("Video upload failed:", error);
            return fail(uploadResponse.status, { message: error.detail || "Video upload failed" });
         }
      } catch (error) {
         console.error("Video upload error:", error);
         return fail(500, { message: `Video upload failed: ${error}` });
      }
   },

   batch: async (event) => {
      console.log("Starting batch upload");

      try {
         const access_token = event.cookies.get("access_token");
         if (!access_token) {
            return fail(401, { message: "Authentication required" });
         }

         const data = await event.request.formData();
         const files = data.getAll("files") as File[];

         if (!files || files.length === 0) {
            return fail(400, { message: "No files provided" });
         }

         // Create new FormData with correct parameter names for backend
         const uploadData = new FormData();
         files.forEach(file => {
            uploadData.append("files", file);
         });

         const uploadResponse = await event.fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_BATCH}`, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${access_token}`,
            },
            body: uploadData
         });

         if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log("Batch upload successful:", result);
            return { success: true, data: result };
         } else {
            const error = await uploadResponse.json();
            console.error("Batch upload failed:", error);
            return fail(uploadResponse.status, { message: error.detail || "Batch upload failed" });
         }
      } catch (error) {
         console.error("Batch upload error:", error);
         return fail(500, { message: `Batch upload failed: ${error}` });
      }
   },

   "startup-files": async (event) => {
      console.log("Starting startup files upload");

      try {
         const access_token = event.cookies.get("access_token");
         if (!access_token) {
            return fail(401, { message: "Authentication required" });
         }

         const data = await event.request.formData();
         const startup_id = data.get("startup_id") as string;

         // Check if at least one file is provided
         const hasFiles = data.get("logo") || data.get("pitch_deck") || data.get("demo_video") || data.get("product_screenshots");
         if (!hasFiles) {
            return fail(400, { message: "At least one file must be provided" });
         }

         // Build the URL with optional startup_id parameter
         let url = `${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_STARTUP_FILES}`;
         if (startup_id) {
            url += `?startup_id=${encodeURIComponent(startup_id)}`;
         }

         const uploadResponse = await event.fetch(url, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${access_token}`,
            },
            body: data
         });

         if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log("Startup files upload successful:", result);
            return { success: true, data: result };
         } else {
            const error = await uploadResponse.json();
            console.error("Startup files upload failed:", error);
            return fail(uploadResponse.status, { message: error.detail || "Startup files upload failed" });
         }
      } catch (error) {
         console.error("Startup files upload error:", error);
         return fail(500, { message: `Startup files upload failed: ${error}` });
      }
   }
} satisfies Actions;
