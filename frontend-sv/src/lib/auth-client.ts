import { createAuthClient } from "better-auth/svelte";
import { env } from "$env/dynamic/public";
import { adminClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  baseURL: env.PUBLIC_BASE_API_URL,
  fetchOptions: {},
  plugins: [
    organizationClient(),
    adminClient()

  ],
});
