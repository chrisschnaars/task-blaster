import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany();
  return Response.json(todos);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  const newTodo = await prisma.todo.create({ data: { text } });
  return Response.json(newTodo);
}
