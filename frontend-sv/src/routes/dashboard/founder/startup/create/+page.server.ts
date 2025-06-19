import { startupSchema } from '@/schemas/startup-schema';
import { ApiEndpoint } from '@/endpoints';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles, fail } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { uploadStartupFiles, mapStartupDataWithFiles, deleteFiles } from '@/services/file-upload.service';

export const load: PageServerLoad = async () => {

  const technologyOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Finance', value: 'finance' },
    { label: 'Education', value: 'education' },
    { label: 'Retail', value: 'retail' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Real Estate', value: 'real_estate' },
    { label: 'Energy', value: 'energy' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Media', value: 'media' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Food & Beverage', value: 'food_beverage' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Hospitality', value: 'hospitality' },
    { label: 'Construction', value: 'construction' },
    { label: 'Telecommunications', value: 'telecommunications' },
    { label: 'Biotechnology', value: 'biotechnology' },
    { label: 'Aerospace', value: 'aerospace' },
    { label: 'Automotive', value: 'automotive' },
    { label: 'E-commerce', value: 'ecommerce' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Cybersecurity', value: 'cybersecurity' },
    { label: 'Fintech', value: 'fintech' },
    { label: 'Health Tech', value: 'health_tech' },
    { label: 'Ed Tech', value: 'ed_tech' },
    { label: 'Other', value: 'other' }
  ]

  const fundingStageOptions = [
    { label: 'Idea', value: 'idea' },
    { label: 'MVP', value: 'mvp' },
    { label: 'Early Stage', value: 'early_stage' },
    { label: 'Pre-Seed', value: 'pre_seed' },
    { label: 'Seed', value: 'seed' },
    { label: 'Series A', value: 'series_a' },
    { label: 'Series B', value: 'series_b' },
    { label: 'Series C', value: 'series_c' },
    { label: 'IPO', value: 'ipo' },
    { label: 'Merger/Acquisition', value: 'merger_acquisition' },
    { label: 'Other', value: 'other' }
  ]

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

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(startupSchema));

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    const cookies = event.cookies.get('access_token');



    let uploadedFiles: Array<any> = [];
    let fileKeys: string[] = [];

    try {
      // Step 1: Upload all files using the service
      console.log('Starting transactional startup creation...');

      const fileUploadData = {
        logo: form.data.logo,
        pitchDeck: form.data.pitchDeck,
        productScreenshots: form.data.productScreenshots,
        demoVideo: form.data.demoVideo,
      };

      const uploadResult = await uploadStartupFiles(fileUploadData, String(cookies));
      uploadedFiles = uploadResult.uploadedFiles;
      fileKeys = uploadResult.fileKeys;

      console.log(`Successfully uploaded ${uploadedFiles.length} files`);

      // Step 2: Prepare startup data with file references
      const startupData = mapStartupDataWithFiles(form.data, uploadedFiles);

      // Step 3: Create startup
      console.log('Creating startup...');
      const createResponse = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.CREATE_STARTUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${cookies}`
        },
        body: JSON.stringify(startupData)
      });

      if (!createResponse.ok) {
        const error: ApiError = await createResponse.json().catch(() => ({
          detail: `Failed to create startup (HTTP ${createResponse.status})`
        }));
        console.error('Startup creation failed:', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          error: error.detail
        });
        throw new Error(error.detail);
      }

      const createdStartup = await createResponse.json();
      console.log('Startup created successfully:', {
        id: createdStartup.id,
        name: createdStartup.name,
        filesUploaded: uploadedFiles.length
      });

      // Success! Redirect to the startup page
      // throw redirect(303, `/dashboard/founder/startup/${createdStartup.id}`);

    } catch (error) {
      console.error('Startup creation transaction failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filesUploaded: uploadedFiles.length,
        fileKeys: fileKeys
      });

      // Step 4: Cleanup uploaded files if startup creation failed
      if (fileKeys.length > 0) {
        console.log(`Cleaning up ${fileKeys.length} uploaded files due to transaction failure...`);
        try {
          await deleteFiles(fileKeys, String(cookies));
          console.log('File cleanup completed successfully');
        } catch (cleanupError) {
          console.error('File cleanup failed:', cleanupError);
          // Continue with error response even if cleanup fails
        }
      }

      // Return error to form with detailed message
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to create startup due to an unexpected error';

      return fail(500, withFiles({
        form,
        error: errorMessage,
        uploadedFileCount: uploadedFiles.length
      }));
    }
  }
}
