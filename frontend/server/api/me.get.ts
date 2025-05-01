import { defineEventHandler, getRequestHeader } from "h3";


export default defineEventHandler(async (event) => {
    console.log("hitting me")

 const config = useRuntimeConfig();

    const token = getRequestHeader(event, 'WWW-Authenticate');
    console.log(token)

    const response = await $fetch(`${config.public.apiBase}users/me`, {
        headers: {
            "WWW-Authenticate": `Bearer ${token}`,
        }
    })

    console.log(response)

    return response || null

});