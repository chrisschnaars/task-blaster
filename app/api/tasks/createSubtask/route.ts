import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { text, category, parentId } = await req.json();

  try {
    const newTask = await prisma.task.create({
      data: { text, category, parentId: parentId || null, completed: false },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
