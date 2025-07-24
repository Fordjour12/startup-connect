import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    sveltekitCookies(() => Promise.resolve(getRequestEvent())),
    admin({
      defaultRole: "founder",
      adminRoles: ["755940", "6203875"],
    }),
  ],
  secret: env.SECRET_KEY
});




/* roles: [{
       name: "user",
       permissions: ["read", "write"]
     },
     {
        name: "admin",
        permissions: ["read", "write", "delete"]
      }, {
        name: "moderator",
        permissions: ["read", "write", "delete", "moderate"]
      }] */
