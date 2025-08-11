import { env } from '$env/dynamic/private';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true


const sql = neon(env.DEPLOYMENT_DATABASE_URL!);
export const db = drizzle({client: sql});
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