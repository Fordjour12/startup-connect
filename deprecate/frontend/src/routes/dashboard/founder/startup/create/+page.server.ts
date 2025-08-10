import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import { startupSchema } from "@/schemas/startup-schema";
import { fail } from "@sveltejs/kit";
import { superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const technologyOptions = [
    { label: "Technology", value: "Technology" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Finance", value: "Finance" },
    { label: "Education", value: "Education" },
    { label: "Retail", value: "Eetail" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Real Estate", value: "Real_Estate" },
    { label: "Energy", value: "Energy" },
    { label: "Transportation", value: "Transportation" },
    { label: "Media", value: "Media" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Food & Beverage", value: "Food_Beverage" },
    { label: "Agriculture", value: "Agriculture" },
    { label: "Hospitality", value: "Hospitality" },
    { label: "Construction", value: "Construction" },
    { label: "Telecommunications", value: "Telecommunications" },
    { label: "Biotechnology", value: "Biotechnology" },
    { label: "Aerospace", value: "Aerospace" },
    { label: "Automotive", value: "Automotive" },
    { label: "E-commerce", value: "Ecommerce" },
    { label: "Gaming", value: "Gaming" },
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Fintech", value: "Fintech" },
    { label: "Health Tech", value: "Health Tech" },
    { label: "Ed Tech", value: "Ed Tech" },
    { label: "Other", value: "Other" },
  ];

  const fundingStageOptions = [
    { label: "Idea", value: "Idea" },
    { label: "MVP", value: "Mvp" },
    { label: "Early Stage", value: "Early Stage" },
    { label: "Pre-Seed", value: "Pre Seed" },
    { label: "Seed", value: "Seed" },
    { label: "Series A", value: "Series A" },
    { label: "Series B", value: "Series B" },
    { label: "Series C", value: "Series C" },
    { label: "IPO", value: "IPO" },
    { label: "Merger/Acquisition", value: "Merger & Acquisition" },
    { label: "Other", value: "Other" },
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

export const actions = {
  default: async (event) => {
    console.log("🚀 Starting startup creation process...");

    // 1. Validate and get form data (including files)
    const form = await superValidate(event, zod(startupSchema));
    if (!form.valid) {
      console.log("❌ Form validation failed:", form.errors);
      return fail(400, withFiles({ form }));
    }

    console.log("✅ Form validation passed");
    console.log("📋 Form data keys:", Object.keys(form.data));

    // 2. Get files from the validated form data
    const logo = form.data.logo as File | null;
    const pitchDeck = form.data.pitchDeck as File | null;
    const demoVideo = form.data.demoVideo as File | null;
    const productScreenshots = form.data.productScreenshots as File[] || [];

    console.log("📁 Files found:", {
      logo: logo ? `${logo.name} (${logo.size} bytes)` : null,
      pitchDeck: pitchDeck ? `${pitchDeck.name} (${pitchDeck.size} bytes)` : null,
      demoVideo: demoVideo ? `${demoVideo.name} (${demoVideo.size} bytes)` : null,
      productScreenshots: productScreenshots.length > 0 ? `${productScreenshots.length} screenshots` : null
    });

    // 3. Prepare files for backend upload
    const filesToUpload = new FormData();
    let hasFiles = false;
    if (logo && logo.size > 0) { filesToUpload.append("logo", logo); hasFiles = true; }
    if (pitchDeck && pitchDeck.size > 0) { filesToUpload.append("pitch_deck", pitchDeck); hasFiles = true; }
    if (demoVideo && demoVideo.size > 0) { filesToUpload.append("demo_video", demoVideo); hasFiles = true; }
    for (const screenshot of productScreenshots) {
      if (screenshot && screenshot.size > 0) { filesToUpload.append("product_screenshots", screenshot); hasFiles = true; }
    }

    console.log("📤 Has files to upload:", hasFiles);

    // 4. Upload files to backend
    let uploadedFileUrls: { logo_url?: string; pitch_deck_url?: string; demo_video_url?: string; } = {};
    if (hasFiles) {
      const access_token = event.cookies.get("access_token");
      console.log("🔐 Access token present:", !!access_token);

      const uploadUrl = `${env.DEPLOYMENT_API_URL}${ApiEndpoint.UPLOAD_STARTUP_FILES}`;
      console.log("📤 Uploading files to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Authorization": `Bearer ${access_token}` },
        body: filesToUpload,
      });

      console.log("📥 Upload response status:", uploadResponse.status);
      console.log("📥 Upload response headers:", Object.fromEntries(uploadResponse.headers.entries()));

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.log("❌ File upload failed:", errorData);
        return fail(uploadResponse.status, withFiles({
          form,
          error: `File upload failed: ${errorData.detail || "Unknown error"}`,
        }));
      }

      const uploadResult = await uploadResponse.json();
      console.log("✅ File upload successful:", uploadResult);

      if (uploadResult.error_count > 0) {
        console.log("⚠️ Some files failed to upload:", uploadResult);
        return fail(400, withFiles({
          form,
          error: `Some files failed to upload. Please try again.`,
        }));
      }

      // Map uploaded files to their URLs
      uploadResult.successful_uploads.forEach((upload: { file_metadata: { file_purpose: any; }; url: any; }) => {
        const purpose = upload.file_metadata?.file_purpose;
        if (purpose === "logo") uploadedFileUrls.logo_url = upload.url;
        if (purpose === "pitch_deck") uploadedFileUrls.pitch_deck_url = upload.url;
        if (purpose === "demo_video") uploadedFileUrls.demo_video_url = upload.url;
        // handle screenshots as needed
      });

      console.log("🔗 Uploaded file URLs:", uploadedFileUrls);
    }

    // 5. Prepare startup data for creation
    const startupData = {
      ...form.data, // all validated fields from supervalidate
      ...uploadedFileUrls,
    };

    // Map frontend field names to backend field names
    const mappedStartupData = {
      name: startupData.name,
      description: startupData.description,
      industry: startupData.industry,
      location: startupData.location,
      funding_stage: startupData.fundingStage, // Map camelCase to snake_case
      // funding_goal: String(startupData.fundingGoal),
      founded_year: String(startupData.foundedYear),
      team_size: startupData.teamSize,
      website: startupData.website,
      business_model: startupData.businessModel,
      target_market: startupData.targetMarket,
      competitors: startupData.competitors,
      is_published: startupData.isPublished,
      team_members: startupData.teamMembers,
      funding: startupData.funding,
      metrics: startupData.metrics,
      social_media: startupData.socialMedia,
      contact: startupData.contact,
      traction: startupData.traction,
      use_of_funds: startupData.useOfFunds,
      timeline: startupData.timeline,
      // File URLs
      logo_url: startupData.logo_url,
      pitch_deck_url: startupData.pitch_deck_url,
      demo_video_url: startupData.demo_video_url,
    };

    console.log("📝 Startup data to create:", {
      name: mappedStartupData.name,
      industry: mappedStartupData.industry,
      location: mappedStartupData.location,
      funding_stage: mappedStartupData.funding_stage,
      hasLogo: !!mappedStartupData.logo_url,
      hasPitchDeck: !!mappedStartupData.pitch_deck_url,
      hasDemoVideo: !!mappedStartupData.demo_video_url
    });

    // 6. Create the startup
    const access_token = event.cookies.get("access_token");
    const createUrl = `${env.DEPLOYMENT_API_URL}${ApiEndpoint.CREATE_STARTUP}`;
    console.log("🏗️ Creating startup at:", createUrl);

    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(mappedStartupData),
    });

    console.log("📥 Create response status:", createResponse.status);
    console.log("📥 Create response headers:", Object.fromEntries(createResponse.headers.entries()));

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      console.log("❌ Startup creation failed:", errorData);
      return fail(createResponse.status, withFiles({
        form,
        error: `Failed to create startup: ${errorData.detail || "Unknown error"}`,
      }));
    }

    const createdStartup = await createResponse.json();
    console.log("✅ Startup created successfully:", createdStartup);

    return withFiles({
      form,
      success: true,
      startup: createdStartup,
      message: "Startup created successfully!",
    });
  }
};
