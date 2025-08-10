import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { USER_ROLES } from "@/db/schema/auth-schema";
import * as schema from "@/db/schema/auth-schema"


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema
  }),
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
  plugins: [
    sveltekitCookies(() => Promise.resolve(getRequestEvent())),
    admin({
      // defaultRole: "user", // Set a default role for new users
      // adminRoles: [USER_ROLES.MODERATOR, USER_ROLES.ADMIN],
    }),
  ],
  secret: env.SECRET_KEY
});
