import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { USER_ROLES } from "@/db/schema/auth-schema";
import * as schema from "@/db/schema/auth-schema"
import { organization } from "better-auth/plugins";


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
    organization(),
    admin({
      defaultRole: USER_ROLES.USER,
      adminRoles: [USER_ROLES.ADMIN],
    }),
  ],
  secret: env.SECRET_KEY
});
