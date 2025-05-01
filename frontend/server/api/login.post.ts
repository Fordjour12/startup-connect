import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  console.log('Login endpoint hit')
  const body = await readBody(event);
  const { email, password } = body;
  console.log('Email:', email)
  console.log('Password:', password)
  
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    });
  }

  try {
    const config = useRuntimeConfig();
    // Encode the body as x-www-form-urlencoded
    const formBody = new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      scope: '',
      client_id: '',
      client_secret: ''
    }).toString();

    const response = await $fetch(`${config.public.apiBase}users/login/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    console.log('Backend response:', response)
    return response;
  } catch (error: unknown) {
    console.error('Backend error:', error)
    throw createError({
    //   statusCode: error instanceof Error ? error.status || 500 : 500,
      statusMessage: error instanceof Error ? error.message || 'Failed to login' : 'Failed to login',
    });
  }
});
