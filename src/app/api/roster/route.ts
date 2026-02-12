import { getSQL } from "@/lib/db";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function checkPassword(input: string): boolean {
  const expected = process.env.SENSEI_PASSWORD ?? "";
  if (!expected) return false;
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pending = searchParams.get("pending");

    if (pending === "true") {
      const password = request.headers.get("x-sensei-password") ?? "";
      if (!checkPassword(password)) {
        return NextResponse.json(
          { error: "The cobra rejects you." },
          { status: 401 }
        );
      }

      const sql = getSQL();
      const rows = await sql`
        SELECT id, name, dojo_name, enrolled_at
        FROM roster
        WHERE status = 'PENDING'
        ORDER BY enrolled_at DESC
      `;
      return NextResponse.json(rows);
    }

    const sql = getSQL();
    const rows = await sql`
      SELECT name, dojo_name, enrolled_at
      FROM roster
      WHERE status = 'APPROVED'
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

export async function PATCH(request: Request) {
  try {
    const { id, status, password } = await request.json();

    if (!password || !checkPassword(password)) {
      return NextResponse.json(
        { error: "The cobra rejects you." },
        { status: 401 }
      );
    }

    if (!id || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const sql = getSQL();
    const rows = await sql`
      UPDATE roster SET status = ${status} WHERE id = ${id} RETURNING id, name, status
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Roster update error:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}
