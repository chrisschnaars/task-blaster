import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { parentId, text } = await req.json();
    if (!parentId || !text)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const subtask = await prisma.task.create({
      data: { text, completed: false, category: "now", parentId },
    });

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
