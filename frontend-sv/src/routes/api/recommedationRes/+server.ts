import { env } from "$env/dynamic/private";
import { ApiEndpoint } from "@/endpoints";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const response = await fetch(
			`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_RECOMMENDATION_EXPLANATION}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `bearer ${cookies.get("access_token")}`,
				},
			},
		);

		if (response.ok) {
			const data = await response.json();
			return new Response(JSON.stringify(data), { status: 200 });
		}
		return new Response(JSON.stringify({ error: "Failed to fetch algorithm explanation" }), { status: 500 });
	} catch (err) {
		console.error("Error fetching algorithm explanation:", err);
		return new Response(JSON.stringify({
			error: "Failed to fetch algorithm explanation",
		}), {
			status: 500,
		});
	}
};