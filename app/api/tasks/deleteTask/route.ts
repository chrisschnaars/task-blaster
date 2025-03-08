import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { taskId, parentId } = body;

    if (typeof taskId !== "string") {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    if (parentId) {
      // Delete only the subtask from the parent task
      await prisma.task.update({
        where: { id: parentId },
        data: {
          subtasks: {
            delete: { id: taskId },
          },
        },
      });
    } else {
      // Delete the entire task
      await prisma.task.delete({
        where: { id: taskId },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
