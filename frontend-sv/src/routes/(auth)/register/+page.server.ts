import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { registerSchema } from "@/schemas/register-schema";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints"

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(registerSchema))
  };
};

export const actions = {
  default: async ({ request, fetch }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { fullName, email, password, userType } = form.data;

    const user = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        role: userType
      })
    });

    const data = await user.json();
    console.log(data);

    return {
      form,
    };
  }
} satisfies Actions;
