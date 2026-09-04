import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Point it at a Postgres database (local or hosted) in your .env.",
  );
}

// Reuse a single client across HMR in dev to avoid exhausting connections.
const globalForDb = globalThis as unknown as { __geakSql?: ReturnType<typeof postgres> };

const sql =
  globalForDb.__geakSql ??
  postgres(connectionString, {
    max: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__geakSql = sql;

export const db = drizzle(sql, { schema });
export type DB = typeof db;
