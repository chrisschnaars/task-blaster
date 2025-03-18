import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, parentId } = body;

    if (typeof id !== "string") {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    if (parentId) {
      // Delete only the subtask from the parent task
      await prisma.task.update({
        where: { id: parentId },
        data: {
          subtasks: {
            delete: { id: id },
          },
        },
      });
    } else {
      // When deleting a parent task, delete all subtasks
      await prisma.task.deleteMany({
        where: { parentId: id },
      });

      await prisma.task.delete({
        where: { id: id },
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
