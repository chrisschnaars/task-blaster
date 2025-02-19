import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, category = "now" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }
    if (!["now", "soon", "later"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: { text, completed: false, category },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
