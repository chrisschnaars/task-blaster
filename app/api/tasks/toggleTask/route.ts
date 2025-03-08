import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, completed } = body;

    if (typeof id !== "string" || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    // Check if it's a subtask and update parent if all subtasks are complete
    if (updatedTask.parentId) {
      const parentId = updatedTask.parentId;

      const remainingSubtasks = await prisma.task.count({
        where: { parentId, completed: false },
      });

      if (remainingSubtasks === 0) {
        await prisma.task.update({
          where: { id: parentId },
          data: { completed: true },
        });
      }
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
