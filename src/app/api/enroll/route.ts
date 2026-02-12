import { getSQL } from "@/lib/db";
import { NextResponse } from "next/server";
import { dojoNames } from "@/lib/dojo-names";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const dojoName = dojoNames[Math.floor(Math.random() * dojoNames.length)];

    const sql = getSQL();
    await sql`
      INSERT INTO roster (name, dojo_name, status)
      VALUES (${name.trim()}, ${dojoName}, 'PENDING')
    `;

    return NextResponse.json({ dojo_name: dojoName });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json(
      { error: "Failed to enroll. The cobra is displeased." },
      { status: 500 }
    );
  }
}
