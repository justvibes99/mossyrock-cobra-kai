import { getSQL } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT name, dojo_name, path, enrolled_at
      FROM roster
      ORDER BY enrolled_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Roster fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roster" },
      { status: 500 }
    );
  }
}
