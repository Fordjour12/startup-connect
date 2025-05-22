import { startupSchema } from '$lib/schemas/startup-schema';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(startupSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(startupSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    try {
      // Here you would process form data and handle file uploads
      // This would connect to your backend API or database
      
      // Example API call (replace with your actual endpoint)
      /*
      const response = await fetch('/api/create-new-startup', {
        method: 'POST',
        body: JSON.stringify(form.data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create startup');
      }
      */
      
      // Return the form with a success message
      return {
        form,
        success: true,
        message: 'Startup created successfully'
      };
    } catch (error) {
      console.error('Error creating startup:', error);
      
      // Return the form with error message
      return fail(500, {
        form,
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }
};
