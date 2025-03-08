import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, text, category, subtasks } = body;

    if (!id || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    if (category && !["now", "soon", "later"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { text, category, subtasks },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
