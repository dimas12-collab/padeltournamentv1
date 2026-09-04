import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Keep Next's static build from opening a database connection. Runtime requests
// still fail clearly when the developer has not configured DATABASE_URL.
const connectionString = process.env.DATABASE_URL ?? "postgresql://missing-database-url:missing@127.0.0.1:1/missing";

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export type Database = typeof db;
