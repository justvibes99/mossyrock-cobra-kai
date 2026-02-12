import { sql } from "@vercel/postgres";
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
    const { rows } = await sql`
      SELECT id, title, excerpt, genre, status, created_at
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
    const { title, excerpt, genre, password } = await request.json();

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

    const { rows } = await sql`
      INSERT INTO stories (title, excerpt, genre)
      VALUES (${title.trim()}, ${excerpt.trim()}, ${genre.trim()})
      RETURNING id, title, excerpt, genre, status, created_at
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
