import { startupSchema } from "$lib/schemas/startup-schema";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import type { StartupDetails } from "@/types/startup";


export const load: PageServerLoad = async ({ params }) => {
    const startupId = params.id;
    const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_STARTUP_DETAILS.replace('{startup_id}', startupId)}`);
    const startupData: StartupDetails = await response.json();

    if (!startupData) {
        error(404, "Startup not found");
    }

    const form = await superValidate(startupData, zod(startupSchema));

    return {
        form,
        startupId, // Pass the ID to the page if needed (e.g., for the form action)
    };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const startupId = params.id;
        const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_STARTUP_DETAILS.replace('{startup_id}', startupId)}`);
        const startupData: StartupDetails = await response.json();

        if (!startupData) {
            error(404, "Startup not found during update attempt");
        }


        const form = await superValidate(startupData, zod(startupSchema));

        if (!form.valid) {
            // Return validation errors
            return fail(400, { form });
        }

        // TODO: Update the actual data in your database
        console.log("Updating startup:", startupId, form.data);
        // Example: Update mock data (won't persist across requests unless handled differently)
        // mockStartups[startupId] = { ...existingData, ...form.data };

        // Return the validated form data on success
        return { form };
    },
};
