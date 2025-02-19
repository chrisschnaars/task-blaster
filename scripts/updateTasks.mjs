import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateExistingTasks() {
  try {
    await prisma.task.updateMany({
      data: { category: "now" },
    });
    console.log("Updated existing tasks with default category.");
  } catch (error) {
    console.error("Error updating tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingTasks();
