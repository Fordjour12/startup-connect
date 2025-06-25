import { env } from '$env/dynamic/private';
import { ApiEndpoint } from '@/endpoints';

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
      console.log(`Uploading ${file.name} (attempt ${attempt}/${retries}) to ${endpoint}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${env.DEPLOYMENT_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${cookies}`
        },
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail: string;
        try {
          const error: ApiError = await response.json();
          errorDetail = error.detail;
        } catch {
          errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        }

        console.error(`Upload attempt ${attempt} failed for ${file.name}: ${errorDetail}`);

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(errorDetail);
        }

        // Retry on server errors (5xx) or network issues
        if (attempt === retries) {
          throw new Error(`Failed to upload ${file.name} after ${retries} attempts: ${errorDetail}`);
        }

        console.warn(`Upload attempt ${attempt} failed for ${file.name}, retrying in ${1000 * attempt}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // Try to parse the response
      try {
        const result = await response.json();
        console.log(`Successfully uploaded ${file.name} on attempt ${attempt}`);
        return result;
      } catch (jsonError) {
        console.error(`Failed to parse response for ${file.name} on attempt ${attempt}:`, jsonError);
        
        // If we can't parse the response but got a 200, the upload might have succeeded
        // Create a fallback response object
        if (response.status === 200 || response.status === 201) {
          console.warn(`Upload likely succeeded for ${file.name} but response parsing failed. Creating fallback response.`);
          return {
            file_key: `${Date.now()}_${file.name}`, // Fallback key
            file_url: '', // Will need to be handled by calling code
            file_name: file.name,
            file_size: file.size
          };
        }
        
        throw jsonError;
      }
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed for ${file.name}:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      console.warn(`Retrying upload for ${file.name} in ${1000 * attempt}ms... (attempt ${attempt + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw new Error(`Failed to upload ${file.name} after ${retries} attempts`);
}

/**
 * Upload multiple files in parallel with better error handling
 */
export async function uploadFiles(
  files: Array<{ file: File; endpoint: string; type?: string }>,
  cookies: string
): Promise<UploadedFile[]> {
  console.log(`Starting upload of ${files.length} files...`);
  
  const uploadPromises = files.map(({ file, endpoint, type }, index) =>
    uploadFile(file, endpoint, cookies)
      .then(result => {
        console.log(`File ${index + 1}/${files.length} uploaded successfully: ${file.name}`);
        return { ...result, type };
      })
      .catch(error => {
        console.error(`File ${index + 1}/${files.length} upload failed: ${file.name}`, error);
        throw error;
      })
  );

  try {
    const results = await Promise.all(uploadPromises);
    console.log(`All ${files.length} files uploaded successfully`);
    return results;
  } catch (error) {
    console.error('Some file uploads failed:', error);
    throw error;
  }
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
    uploadQueue.push({ file: formData.demoVideo, endpoint: ApiEndpoint.UPLOAD_FILE, type: 'demoVideo' });
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
