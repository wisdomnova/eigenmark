import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { walletAddress, name, role } = await request.json();
    if (!walletAddress || !name || !role) {
      return NextResponse.json(
        { error: "Missing required profile parameters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const checkRes = await pool.query(
      "SELECT id, wallet_address, name, role, created_at FROM users WHERE wallet_address = $1",
      [walletAddress]
    );

    if (checkRes.rows.length > 0) {
      return NextResponse.json(checkRes.rows[0]);
    }

    // Insert new user
    const insertRes = await pool.query(
      "INSERT INTO users (wallet_address, name, role) VALUES ($1, $2, $3) RETURNING id, wallet_address, name, role, created_at",
      [walletAddress, name, role]
    );

    return NextResponse.json(insertRes.rows[0]);
  } catch (error: any) {
    console.error("Database user query failed:", error);
    return NextResponse.json(
      { error: "Database profile operation failed" },
      { status: 500 }
    );
  }
}
