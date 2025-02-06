import { NextRequest, NextResponse } from "next/server";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Zod Schema for Task Validation
const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  projectId: z.number().optional(),
  categoryId: z.number().optional(),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Middleware to Authenticate User
const authenticateUser = async (): Promise<number | null> => {
  const authToken = (await cookies()).get("authToken");
  
  console.log("authToken", authToken);
  

  if (!authToken) return null;

  try {
    const { payload } = await jwtVerify(authToken.value, JWT_SECRET);

    console.log("payload", payload);
    

    if (typeof payload.userId !== "number") {
      console.error("Invalid token payload: userId missing or not a number");
      return null;
    }
    console.log("payload.userId", payload.userId);
    
    return payload.userId; // Extract userId from the verified token
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

// Get Tasks (GET)
export async function GET() {
  const userId = await authenticateUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId)); // Fetching all tasks for the authenticated user

    return NextResponse.json({ success: true, tasks: userTasks }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// Create Task (POST)
export async function POST(req: NextRequest) {
  const userId = await authenticateUser();
  console.log("create task", userId);
  
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    console.log("body", body);
    
    const parsedData = TaskSchema.parse(body);
    const taskData = {
      ...parsedData,
      userId,
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : null,
      projectId: parsedData.projectId ?? 0,
      categoryId: parsedData.categoryId ?? 0,
    };

    console.log("taskData", taskData);
    

    const [newTask] = await db
      .insert(tasks)
      .values(taskData)
      .returning();

    return NextResponse.json({ success: true, tasks: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? error.errors : error }, { status: 400 });
  }
}




