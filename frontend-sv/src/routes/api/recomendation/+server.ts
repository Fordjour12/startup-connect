import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
		try {
			const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_RECOMMENDATIONS}`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `bearer ${cookies.get("access_token")}`,
				},
			});


			if (!response.ok) {
				throw new Error(
					`Failed to fetch recommendations: ${response.statusText}`,
				);
			}

			const data = await response.json();
			console.log(data);
			return new Response(JSON.stringify(data), { status: 200 });
		} catch (err) {
			console.error("Error fetching recommendations:", err);
			return new Response(JSON.stringify({ error: "Failed to fetch recommendations" }), { status: 500 });
		}
	};