import { defineEventHandler, readBody, createError, getRequestHeader } from "h3";
import { Startup } from "@/types";



export default defineEventHandler(async (event) => {
  // Get config for API base URL
  const config = useRuntimeConfig()
  
  // Parse request body
  const body = await readBody<Startup>(event)

  console.log(body)
  
  // try {
  //   // Get authorization token from request headers
  //   const token = getRequestHeader(event, 'Authorization')
    
  //   // Send POST request to external API
  //   const response = await $fetch<Startup>(`${config.public.apiBase}startups`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': token || ''
  //     },
  //     body
  //   })
    
  //   return response
  // } catch (error: any) {
  //   // Handle errors
  //   const status = error.response?.status || 500
  //   const statusMessage = error.response?.statusText || 'Internal Server Error'
    
  //   throw createError({
  //     statusCode: status,
  //     statusMessage,
  //     message: error.message
  //   })
  // }
}) 