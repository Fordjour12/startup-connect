import { ApiEndpoint } from '@/endpoints';
import { env } from '$env/dynamic/private';

// Interface for uploaded file response
export interface UploadedFile {
  file_key: string;
  file_url: string;
  file_name: string;
  file_size: number;
  type?: string;
}

// Interface for API error response
interface ApiError {
  detail: string;
  code?: string;
}

/**
 * Upload a single file with retry logic
 */
export async function uploadFile(
  file: File,
  endpoint: string,
  cookies: string,
  retries = 3
): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${env.DEPLOYMENT_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${cookies}`
        },
        body: formData
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `Failed to upload ${file.name}`
        }));

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(error.detail);
        }

        // Retry on server errors (5xx) or network issues
        if (attempt === retries) {
          throw new Error(`Failed to upload ${file.name} after ${retries} attempts: ${error.detail}`);
        }

        console.warn(`Upload attempt ${attempt} failed for ${file.name}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Upload attempt ${attempt} failed for ${file.name}, retrying...`, error);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }

  throw new Error(`Failed to upload ${file.name} after ${retries} attempts`);
}

/**
 * Upload multiple files in parallel
 */
export async function uploadFiles(
  files: Array<{ file: File; endpoint: string; type?: string }>,
  cookies: string
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(({ file, endpoint, type }) =>
    uploadFile(file, endpoint, cookies).then(result => ({ ...result, type }))
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete uploaded files (cleanup)
 */
export async function deleteFiles(fileKeys: string[], cookies: string): Promise<void> {
  // Delete files in parallel but don't throw errors if some fail
  const deletePromises = fileKeys.map(async (fileKey) => {
    try {
      await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.DELETE_FILE.replace('{file_key}', fileKey)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `bearer ${cookies}`
        }
      });
    } catch (error) {
      console.error(`Failed to delete file ${fileKey}:`, error);
    }
  });

  await Promise.allSettled(deletePromises);
}

/**
 * Upload startup-specific files with transaction safety
 */
export async function uploadStartupFiles(
  formData: {
    logo?: File;
    pitchDeck?: File;
    productScreenshots?: File[];
    demoVideo?: File;
  },
  cookies: string
): Promise<{ uploadedFiles: UploadedFile[]; fileKeys: string[] }> {
  const uploadQueue: Array<{ file: File; endpoint: string; type: string }> = [];

  // Queue all files for upload
  if (formData.logo) {
    uploadQueue.push({ file: formData.logo, endpoint: ApiEndpoint.UPLOAD_IMAGE, type: 'logo' });
  }

  if (formData.pitchDeck) {
    uploadQueue.push({ file: formData.pitchDeck, endpoint: ApiEndpoint.UPLOAD_DOCUMENT, type: 'pitchDeck' });
  }

  if (formData.productScreenshots) {
    formData.productScreenshots.forEach(screenshot => {
      uploadQueue.push({ file: screenshot, endpoint: ApiEndpoint.UPLOAD_IMAGE, type: 'screenshot' });
    });
  }

  if (formData.demoVideo) {
    uploadQueue.push({ file: formData.demoVideo, endpoint: ApiEndpoint.UPLOAD_DOCUMENT, type: 'demoVideo' });
  }

  // Upload all files in parallel
  const uploadedFiles = await uploadFiles(uploadQueue, cookies);
  const fileKeys = uploadedFiles.map(f => f.file_key);

  return { uploadedFiles, fileKeys };
}

/**
 * Create startup data with file references
 */
export function mapStartupDataWithFiles(
  formData: any,
  uploadedFiles: UploadedFile[]
): any {
  const logoUpload = uploadedFiles.find(f => f.type === 'logo');
  const pitchDeckUpload = uploadedFiles.find(f => f.type === 'pitchDeck');
  const demoVideoUpload = uploadedFiles.find(f => f.type === 'demoVideo');
  const screenshotUploads = uploadedFiles.filter(f => f.type === 'screenshot');

  return {
    name: formData.name,
    description: formData.description,
    industry: formData.industry,
    location: formData.location,
    funding_stage: formData.fundingStage,
    founded_year: formData.foundedYear,
    team_size: formData.teamSize,
    website: formData.website,
    business_model: formData.businessModel,
    target_market: formData.targetMarket,
    competitors: formData.competitors,
    is_published: formData.isPublished,

    // File references
    logo_url: logoUpload?.file_url,
    pitch_deck_url: pitchDeckUpload?.file_url,
    demo_video_url: demoVideoUpload?.file_url,
    product_screenshots_urls: screenshotUploads.map(s => s.file_url),

    // Nested objects
    team_members: formData.teamMembers || [],
    funding: formData.funding,
    metrics: formData.metrics,
    social_media: formData.socialMedia,
    contact: formData.contact,
    traction: formData.traction,
    use_of_funds: formData.useOfFunds,
    timeline: formData.timeline,
  };
}
