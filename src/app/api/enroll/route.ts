import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { dojoNames } from "@/lib/dojo-names";

export async function POST(request: Request) {
  try {
    const { name, path } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const validPaths = ["Warrior", "Scholar", "Shadow", "Berserker"];
    const chosenPath = validPaths.includes(path) ? path : "Warrior";

    const dojoName = dojoNames[Math.floor(Math.random() * dojoNames.length)];

    await sql`
      INSERT INTO roster (name, dojo_name, path)
      VALUES (${name.trim()}, ${dojoName}, ${chosenPath})
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
