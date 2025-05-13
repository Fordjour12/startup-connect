import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { registerSchema } from "@/schemas/register-schema";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(registerSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(registerSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        // TODO: Add your registration logic here
        // For now, we'll just return the form
        return { form };
    },
}; 