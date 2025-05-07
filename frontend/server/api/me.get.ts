import { defineEventHandler, getRequestHeader } from "h3";

export default defineEventHandler(async (event) => {
    console.log("hitting me")

    const config = useRuntimeConfig();
    // Get the token from the Authorization header
    const token = getRequestHeader(event, 'Authorization');

    const response = await $fetch(`${config.public.apiBase}users/me`, {
        headers: {
            "Authorization": token ? `${token}` : '',
        }
    })

    console.log(response)

    return response || null
});