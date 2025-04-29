import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, role, name } = body;

  if (!email || !password || !role || !name) {
    console.log('Missing required fields')
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and role are required',
    });
  }

  try {
    const config = useRuntimeConfig();
    console.log('Making request to backend:', `${config.public.apiBase}user/signup`)
    const response = await $fetch(`${config.public.apiBase}users/signup`, {
      method: 'POST',
      body: {
        full_name: name,
        email,
        password,
        role,
      },
    });
    console.log('Backend response:', response)
    return response;
  } catch (error: unknown) {
    console.error('Backend error:', error)
    throw createError({
      // statusCode: error instanceof Error ? error.status || 500 : 500,
      statusMessage: error instanceof Error ? error.message || 'Failed to sign up' : 'Failed to sign up',
    });
  }
});
