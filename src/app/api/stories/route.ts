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

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT id, title, excerpt, genre, status, screenplay, created_at
      FROM stories
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Stories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, excerpt, genre, screenplay, password } = await request.json();

    if (!password || !checkPassword(password)) {
      return NextResponse.json(
        { error: "The cobra rejects you." },
        { status: 401 }
      );
    }

    if (!title || !excerpt || !genre) {
      return NextResponse.json(
        { error: "Title, excerpt, and genre are required" },
        { status: 400 }
      );
    }

    if (title.length > 200 || excerpt.length > 10000 || genre.length > 50) {
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400 }
      );
    }

    const sql = getSQL();
    const rows = await sql`
      INSERT INTO stories (title, excerpt, genre, screenplay)
      VALUES (${title.trim()}, ${excerpt.trim()}, ${genre.trim()}, ${screenplay || null})
      RETURNING id, title, excerpt, genre, status, screenplay, created_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Story creation error:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, password } = await request.json();

    if (!password || !checkPassword(password)) {
      return NextResponse.json(
        { error: "The cobra rejects you." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 }
      );
    }

    const sql = getSQL();
    const rows = await sql`
      DELETE FROM stories WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Story delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
