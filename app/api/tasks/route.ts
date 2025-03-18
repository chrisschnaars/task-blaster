import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "asc" },
      where: { parentId: null }, // Only fetch parent tasks
      include: {
        subtasks: {
          orderBy: { createdAt: "asc" }, // Order subtasks by creation time
        },
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
