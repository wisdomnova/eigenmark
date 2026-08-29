import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query(
      `SELECT id, asset_hash as "assetId", licensee_address as "licenseeAddress", 
              transaction_hash as "transactionHash", price, royalty_split as "royaltySplit", 
              created_at as timestamp 
       FROM licensing_agreements 
       ORDER BY id ASC`
    );
    
    const formattedRows = res.rows.map((row) => ({
      ...row,
      id: String(row.id),
      price: parseFloat(row.price),
      royaltySplit: parseFloat(row.royaltySplit),
      timestamp: new Date(row.timestamp).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + " " + new Date(row.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    
    return NextResponse.json(formattedRows);
  } catch (error: any) {
    console.error("Database query agreements failed:", error);
    return NextResponse.json(
      { error: "Database query agreements failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      assetId, // maps to asset_hash in database
      licenseeAddress,
      transactionHash,
      price,
      royaltySplit,
    } = await request.json();

    if (!assetId || !licenseeAddress || !transactionHash || price === undefined || royaltySplit === undefined) {
      return NextResponse.json(
        { error: "Missing required agreement parameters" },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `INSERT INTO licensing_agreements (asset_hash, licensee_address, transaction_hash, price, royalty_split)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, asset_hash as "assetId", licensee_address as "licenseeAddress", 
                 transaction_hash as "transactionHash", price, royalty_split as "royaltySplit", 
                 created_at as timestamp`,
      [
        assetId,
        licenseeAddress,
        transactionHash,
        price,
        royaltySplit,
      ]
    );

    const row = res.rows[0];
    const formattedAgreement = {
      ...row,
      id: String(row.id),
      price: parseFloat(row.price),
      royaltySplit: parseFloat(row.royaltySplit),
      timestamp: new Date(row.timestamp).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + " " + new Date(row.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return NextResponse.json(formattedAgreement);
  } catch (error: any) {
    console.error("Database insert agreement failed:", error);
    return NextResponse.json(
      { error: "Database insert agreement failed" },
      { status: 500 }
    );
  }
}
