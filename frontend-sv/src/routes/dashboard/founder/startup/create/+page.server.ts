import { startupSchema } from '@/schemas/startup-schema';
import { ApiEndpoint } from '@/endpoints';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(startupSchema)),
  };
};

// Helper function to upload a file
async function uploadFile(file: File, endpoint: string, authToken: string): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${env.DEPLOYMENT_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return await response.json();
}

// Helper function to delete uploaded files (cleanup on failure)
async function deleteFile(fileKey: string, authToken: string): Promise<void> {
  try {
    await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.DELETE_FILE.replace('{file_key}', fileKey)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error('Failed to cleanup file:', fileKey, error);
  }
}

// Helper function to create startup
async function createStartup(startupData: any, authToken: string): Promise<any> {
  const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.CREATE_STARTUP}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(startupData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Startup creation failed: ${errorText}`);
  }

  return await response.json();
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(startupSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Get auth token from cookies/session
    const authToken = event.cookies.get('authToken');
    if (!authToken) {
      return fail(401, {
        form,
        success: false,
        message: 'Authentication required'
      });
    }

    // Track uploaded files for cleanup on failure
    const uploadedFiles: { key: string; type: string }[] = [];

    try {
      // Get form data including files
      const formData = await event.request.formData();

      // Extract files from form data
      const logoFile = formData.get('logo') as File | null;
      const pitchDeckFile = formData.get('pitchDeck') as File | null;
      const productScreenshots = formData.getAll('productScreenshots') as File[];
      const demoVideo = formData.get('demoVideo') as File | null;

      // Prepare startup data
      const startupData = {
        ...form.data,
        logoUrl: null as string | null,
        pitchDeckUrl: null as string | null,
        productScreenshotUrls: [] as string[],
        demoVideoUrl: null as string | null,
      };

      // Upload logo if provided
      if (logoFile && logoFile.size > 0) {
        // Validate file type and size server-side
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedImageTypes.includes(logoFile.type)) {
          throw new Error('Invalid logo file type. Only JPEG, PNG, and WebP are allowed.');
        }
        if (logoFile.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Logo file size exceeds 5MB limit.');
        }
        
        try {
          const logoUpload = await uploadFile(logoFile, ApiEndpoint.UPLOAD_IMAGE, authToken);
          startupData.logoUrl = logoUpload.url;
          uploadedFiles.push({ key: logoUpload.key, type: 'logo' });
        } catch (error) {
          console.error('Logo upload failed:', error);
          // Continue without logo, but log the error
        }
      }

      // Upload pitch deck if provided
      if (pitchDeckFile && pitchDeckFile.size > 0) {
        // Validate document file type and size
        const allowedDocTypes = [
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedDocTypes.includes(pitchDeckFile.type)) {
          throw new Error('Invalid pitch deck file type. Only PDF, PPT, PPTX, DOC, and DOCX are allowed.');
        }
        if (pitchDeckFile.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('Pitch deck file size exceeds 10MB limit.');
        }

        try {
          const pitchDeckUpload = await uploadFile(pitchDeckFile, ApiEndpoint.UPLOAD_DOCUMENT, authToken);
          startupData.pitchDeckUrl = pitchDeckUpload.url;
          uploadedFiles.push({ key: pitchDeckUpload.key, type: 'pitchDeck' });
        } catch (error) {
          console.error('Pitch deck upload failed:', error);
          // Continue without pitch deck, but log the error
        }
      }

      // Upload product screenshots if provided
      if (productScreenshots.length > 0) {
        for (const screenshot of productScreenshots) {
          if (screenshot.size > 0) {
            try {
              const screenshotUpload = await uploadFile(screenshot, ApiEndpoint.UPLOAD_IMAGE, authToken);
              startupData.productScreenshotUrls.push(screenshotUpload.url);
              uploadedFiles.push({ key: screenshotUpload.key, type: 'screenshot' });
            } catch (error) {
              console.error('Screenshot upload failed:', error);
              // Continue with other screenshots
            }
          }
        }
      }

      // Upload demo video if provided
      if (demoVideo && demoVideo.size > 0) {
        try {
          const demoVideoUpload = await uploadFile(demoVideo, ApiEndpoint.UPLOAD_DOCUMENT, authToken);
          startupData.demoVideoUrl = demoVideoUpload.url;
          uploadedFiles.push({ key: demoVideoUpload.key, type: 'demoVideo' });
        } catch (error) {
          console.error('Demo video upload failed:', error);
          // Continue without demo video
        }
      }

      // Create startup in database
      const createdStartup = await createStartup(startupData, authToken);

      // If startup was published, redirect to the startup page
      if (form.data.isPublished) {
        throw redirect(303, `/startups/${createdStartup.id}`);
      }

      // Otherwise redirect to the founder's startup management page
      throw redirect(303, '/dashboard/founder/startup');

    } catch (error) {
      console.error('Error creating startup:', error);

      // Cleanup uploaded files on failure
      if (uploadedFiles.length > 0) {
        console.log('Cleaning up uploaded files due to error...');
        await Promise.allSettled(
          uploadedFiles.map(file => deleteFile(file.key, authToken))
        );
      }

      // If it's a redirect, re-throw it
      if (error instanceof Response && error.status >= 300 && error.status < 400) {
        throw error;
      }

      // Return the form with error message
      return fail(500, {
        form,
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred while creating your startup. Please try again.'
      });
    }
  }
};
