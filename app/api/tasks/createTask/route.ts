import { NextResponse } from "next/server";
import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, category, subtasks } = body;

    // Handle empty task content
    if (!text) {
      return NextResponse.json(
        { error: "Task content is empty" },
        { status: 400 }
      );
    }

    const taskWithSubtasks = await prisma.$transaction(async (prisma) => {
      // Create the parent task
      const parent = await prisma.task.create({
        data: {
          text: text,
          completed: false,
          category: category,
          parentId: null,
        },
      });

      // Create and link subtasks
      if (subtasks.length > 0) {
        const subtaskRecords = subtasks.map((subtask: Task) => ({
          text: subtask.text,
          completed: subtask.completed,
          category: category,
          parentId: parent.id,
        }));

        await prisma.task.createMany({ data: subtaskRecords });
      }

      return parent;
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
