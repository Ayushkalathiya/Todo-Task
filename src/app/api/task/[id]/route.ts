import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

// Zod Schema for Task Validation
const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  projectId: z.number().optional().nullable(),
  categoryId: z.number().optional().nullable(),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Middleware to Authenticate User
const authenticateUser = async (): Promise<number | null> => {
  const authToken = (await cookies()).get("authToken");
  console.log("authToken", authToken);

  if (!authToken) return null;

  try {
    const { payload } = await jwtVerify(authToken.value, JWT_SECRET);
    if (typeof payload.userId !== "number") return null;
    console.log("payload.userId", payload.userId);

    return payload.userId;
  } catch {
    return null;
  }
};

// delete task by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await authenticateUser();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("delete task", userId);

  try {
    const { id } = await params;

    const taskId = parseInt(id, 10);
    if (!id)
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );

    const result = await db.delete(tasks).where(eq(tasks.id, taskId));
    if (result.rowCount === 0)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error ) },
      { status: 400 }
    );
  }
}

// Update Task (PUT)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await authenticateUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {  ...data } = await req.json();
    const { id } = await params;
  
    console.log("data", data);
    
    const taskId = parseInt(id, 10);

    if (!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

    const parsedData = TaskSchema.partial().parse(data);
    console.log("Update task", parsedData);
    

    
    const updateData = {
      ...parsedData,
      updatedAt: new Date(),
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : null,
      projectId: parsedData.projectId ?? undefined,
      categoryId: parsedData.categoryId ?? undefined,
    };

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, tasks: updatedTask });
  } catch (error) {
    console.log("error", error);
    
    return NextResponse.json({ error: error instanceof z.ZodError ? error.errors : error}, { status: 400 });
  }
}

// mark task as completed
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await authenticateUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const taskId = parseInt(id, 10);
    if (!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

    // do if false to true and vice versa
    const [updatedTask] = await db
    .update(tasks)
    .set({ completed: sql`NOT tasks.completed` }) // Use sql tagged template for NOT
    .where(eq(tasks.id, taskId))
    .returning();
  

    if (!updatedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, tasks: updatedTask });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}