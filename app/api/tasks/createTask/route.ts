import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, category, subtasks } = body;
    if (!text) {
      return NextResponse.json(
        { error: "Task content is empty" },
        { status: 400 }
      );
    }

    const taskWithSubtasks = await prisma.$transaction(async (prisma) => {
      // Create the parent task
      const parent = await prisma.task.create({
        data: { text: text, completed: false, category: "now" },
      });

      // Create and link subtasks
      if (subtasks.length > 0) {
        const subtaskRecords = subtasks.map((subtask: string) => ({
          text: subtask,
          completed: false,
          category: category,
          parentId: parent.id,
        }));

        await prisma.task.createMany({ data: subtaskRecords });
      }

      return prisma.task.findUnique({
        where: { id: parent.id },
        include: { subtasks: true }, // Include subtasks in the response
      });
    });

    return NextResponse.json(taskWithSubtasks, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
