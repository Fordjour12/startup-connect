import * as schema from './schema';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle as NeonAdapter } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { env } from "$env/dynamic/private";
import { drizzle as PostgresqlAdapter } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: ReturnType<typeof NeonAdapter> | ReturnType<typeof PostgresqlAdapter>;

if (env.NODE_ENV === "production") {
  if (!env.DEPLOYMENT_DATABASE_URL) {
    throw new Error("Failed to create database client");
  }
  neonConfig.webSocketConstructor = ws;

  // To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
  // neonConfig.poolQueryViaFetch = true

  const pool = new Pool({ connectionString: env.DEPLOYMENT_DATABASE_URL });

  db = NeonAdapter({ client: pool, schema });

} else {
  if (!env.DATABASE_URL) {
    throw new Error("Failed to create database client");
  }
  const client = postgres(env.DATABASE_URL!);
  db = PostgresqlAdapter(client, { schema });
}


export { db };
export * from "./schema";
export * from "./utils/user-profile-operations";
export * from "./utils/onboarding-transformer";
export * from "./utils/admin-operations";
