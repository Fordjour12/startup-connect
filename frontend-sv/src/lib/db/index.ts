
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true


const pool = new Pool({ connectionString: env.DEPLOYMENT_DATABASE_URL });

export const db = drizzle({ client: pool, schema });

export * from "./schema";
export * from "./utils/user-profile-operations";
export * from "./utils/onboarding-transformer";


/*

import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!env.DATABASE_URL) {
   throw new Error("Failed to create database client");
}
const client = postgres(env.DATABASE_URL!);
export const db = drizzle({ client });
*/
