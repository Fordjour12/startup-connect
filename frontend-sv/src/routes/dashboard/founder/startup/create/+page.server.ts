import { startupSchema } from '@/schemas/startup-schema';
import { ApiEndpoint } from '@/endpoints';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles, fail } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
// import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(startupSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(startupSchema));

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    console.log("form_data", form)

    return withFiles({
      form
    })
  }
}
