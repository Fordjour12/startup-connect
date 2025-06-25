import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { startupSchema } from "@/schemas/startup-schema";
import { fail, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const technologyOptions = [
    { label: "Technology", value: "technology" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Finance", value: "finance" },
    { label: "Education", value: "education" },
    { label: "Retail", value: "retail" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Real Estate", value: "real_estate" },
    { label: "Energy", value: "energy" },
    { label: "Transportation", value: "transportation" },
    { label: "Media", value: "media" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Food & Beverage", value: "food_beverage" },
    { label: "Agriculture", value: "agriculture" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Construction", value: "construction" },
    { label: "Telecommunications", value: "telecommunications" },
    { label: "Biotechnology", value: "biotechnology" },
    { label: "Aerospace", value: "aerospace" },
    { label: "Automotive", value: "automotive" },
    { label: "E-commerce", value: "ecommerce" },
    { label: "Gaming", value: "gaming" },
    { label: "Cybersecurity", value: "cybersecurity" },
    { label: "Fintech", value: "fintech" },
    { label: "Health Tech", value: "health_tech" },
    { label: "Ed Tech", value: "ed_tech" },
    { label: "Other", value: "other" },
  ];

  const fundingStageOptions = [
    { label: "Idea", value: "idea" },
    { label: "MVP", value: "mvp" },
    { label: "Early Stage", value: "early_stage" },
    { label: "Pre-Seed", value: "pre_seed" },
    { label: "Seed", value: "seed" },
    { label: "Series A", value: "series_a" },
    { label: "Series B", value: "series_b" },
    { label: "Series C", value: "series_c" },
    { label: "IPO", value: "ipo" },
    { label: "Merger/Acquisition", value: "merger_acquisition" },
    { label: "Other", value: "other" },
  ];

  return {
    industry: technologyOptions,
    funding: fundingStageOptions,
    form: await superValidate(zod(startupSchema)),
  };
};

// Interface for API error response
interface ApiError {
  detail: string;
  code?: string;
}

// Interface for file upload response
interface FileUploadResponse {
  success: boolean;
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  file_metadata: Record<string, any>;
  upload_date: string;
}

// Interface for batch upload response
interface BatchUploadResponse {
  total_files: number;
  successful_uploads: FileUploadResponse[];
  failed_uploads: any[];
  success_count: number;
  error_count: number;
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(startupSchema));

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    const { cookies } = event;
    const access_token = cookies.get("access_token");

    if (!access_token) {
      return fail(401, withFiles({
        form,
        error: "Authentication required. Please login to create a startup."
      }));
    }

    try {
      let uploadedFileUrls: Record<string, string> = {};

      // Step 1: Upload files if they exist
      const filesToUpload = new FormData();
      let hasFiles = false;

      if (form.data.logo && form.data.logo.size > 0) {
        filesToUpload.append("logo", form.data.logo);
        hasFiles = true;
      }

      if (form.data.pitchDeck && form.data.pitchDeck.size > 0) {
        filesToUpload.append("pitch_deck", form.data.pitchDeck);
        hasFiles = true;
      }

      if (form.data.demoVideo && form.data.demoVideo.size > 0) {
        filesToUpload.append("demo_video", form.data.demoVideo);
        hasFiles = true;
      }

      if (form.data.productScreenshots && form.data.productScreenshots.length > 0) {
        form.data.productScreenshots.forEach((screenshot, index) => {
          if (screenshot.size > 0) {
            filesToUpload.append("product_screenshots", screenshot);
            hasFiles = true;
          }
        });
      }

      // Upload files if any exist
      if (hasFiles) {
        const uploadResponse = await fetch(
          `${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_STARTUP_FILES}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${access_token}`,
            },
            body: filesToUpload,
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          return fail(uploadResponse.status, withFiles({
            form,
            error: `File upload failed: ${errorData.detail || "Unknown error"}`,
          }));
        }

        const uploadResult: BatchUploadResponse = await uploadResponse.json();

        if (uploadResult.error_count > 0) {
          return fail(400, withFiles({
            form,
            error: `Some files failed to upload. Please try again.`,
          }));
        }

        // Map uploaded files to their URLs
        uploadResult.successful_uploads.forEach((upload) => {
          const metadata = upload.file_metadata;
          const purpose = metadata.file_purpose;

          if (purpose === "logo") {
            uploadedFileUrls.logo_url = upload.url;
          } else if (purpose === "pitch_deck") {
            uploadedFileUrls.pitch_deck_url = upload.url;
          } else if (purpose === "demo_video") {
            uploadedFileUrls.demo_video_url = upload.url;
          }
          // Note: Product screenshots handling may need different logic based on backend requirements
        });
      }

      // Step 2: Prepare startup data for creation
      const startupData = {
        name: form.data.name,
        description: form.data.description,
        industry: form.data.industry,
        location: form.data.location,
        funding_stage: form.data.fundingStage,
        founded_year: form.data.foundedYear,
        team_size: form.data.teamSize,
        website: form.data.website,
        business_model: form.data.businessModel,
        target_market: form.data.targetMarket,
        competitors: form.data.competitors,
        is_published: form.data.isPublished || false,

        // Include uploaded file URLs
        ...uploadedFileUrls,

        // Handle JSON fields
        team_members: form.data.teamMembers || null,
        funding: form.data.funding || null,
        metrics: form.data.metrics || null,
        social_media: form.data.socialMedia || null,
        contact: form.data.contact || null,
        traction: form.data.traction || null,
        use_of_funds: form.data.useOfFunds || null,
        timeline: form.data.timeline || null,
      };

      // Step 3: Create the startup
      const createResponse = await fetch(
        `${env.DEPLOYMENT_API_URL}${ApiEndpoint.CREATE_STARTUP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
          },
          body: JSON.stringify(startupData),
        }
      );

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        return fail(createResponse.status, withFiles({
          form,
          error: `Failed to create startup: ${errorData.detail || "Unknown error"}`,
        }));
      }

      const createdStartup = await createResponse.json();

      // Success - redirect to the created startup or dashboard
      return withFiles({
        form,
        success: true,
        startup: createdStartup,
        message: "Startup created successfully!",
      });

    } catch (error) {
      console.error("Error creating startup:", error);
      return fail(500, withFiles({
        form,
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
      }));
    }
  },
};
