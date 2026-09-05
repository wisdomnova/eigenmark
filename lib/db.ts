import { Pool } from "pg";

function getConnectionString(): string {
  let url = process.env.DATABASE_URL || "postgresql://user@localhost:5432/proofchain";
  
  // If connection URL uses direct Supabase DB host (db.<project-ref>.supabase.co) which lacks IPv4 DNS,
  // automatically route through Supabase connection pooler
  if (url.includes("db.lbcpxjzbdvfkkdpzxrqv.supabase.co")) {
    url = url
      .replace("postgres:TFMOwlY8B7SEgXzo@db.lbcpxjzbdvfkkdpzxrqv.supabase.co:5432", "postgres.lbcpxjzbdvfkkdpzxrqv:TFMOwlY8B7SEgXzo@aws-0-eu-west-2.pooler.supabase.com:6543")
      .replace("@db.lbcpxjzbdvfkkdpzxrqv.supabase.co", "@aws-0-eu-west-2.pooler.supabase.com:6543");
  }
  
  return url;
}

const connectionString = getConnectionString();

const globalForDb = globalThis as unknown as {
  dbPool: Pool | undefined;
};

export const pool =
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool;
}
