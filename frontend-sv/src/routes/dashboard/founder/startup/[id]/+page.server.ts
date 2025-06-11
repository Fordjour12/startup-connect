import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import type { StartupDetails } from "@/types/startup";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ params }) => {
    const startupId = params.id;

    const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_STARTUP_DETAILS.replace('{startup_id}', startupId)}`);

    if (!response.ok) {
        error(404, "Startup not found");
    }

    const startupData: StartupDetails = await response.json();
    console.log(startupData);
    return {
        startup: startupData,
    };
};
