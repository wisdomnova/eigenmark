import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://user@localhost:5432/proofchain";

const globalForDb = globalThis as unknown as {
  dbPool: Pool | undefined;
};

export const pool = globalForDb.dbPool ?? new Pool({
  connectionString,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool;
}
