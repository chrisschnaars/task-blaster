import { NextResponse } from "next/server";
import { PrismaClient, Task } from "@prisma/client";

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

    const updatedTask = await prisma.$transaction(async (prisma) => {
      // First delete all existing subtasks
      await prisma.task.deleteMany({
        where: { parentId: id },
      });

      // Update the parent task
      const parent = await prisma.task.update({
        where: { id },
        data: {
          text,
          category,
        },
      });

      // Create new subtasks
      if (subtasks.length > 0) {
        await prisma.task.createMany({
          data: subtasks.map((subtask: Task) => ({
            text: subtask.text,
            completed: subtask.completed,
            category: subtask.category,
            parentId: id,
          })),
        });
      }

      // Return the updated task with its subtasks
      return prisma.task.findUnique({
        where: { id },
        include: {
          subtasks: true,
        },
      });
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
