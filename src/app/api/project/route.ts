import db from "@/db/index";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(255, "Name must be at most 255 characters"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // Convert to Date before inserting
  status: z.enum(["active", "completed", "archived"]).default("active"),
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Middleware to Authenticate User
export const authenticateUser = async (): Promise<number | null> => {
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
// Get Projects (GET)
export async function GET() {
  const userId = await authenticateUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId)); // Fetching all projects for the current user

    return NextResponse.json({ success: true, projects: userProjects }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// Create Project (POST)
export async function POST(req: NextRequest) {
  const userId = await authenticateUser();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsedData = ProjectSchema.parse(body);
    console.log("parsedData", parsedData);
        
    const projectData = {
      ...parsedData,
      userId,
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : null,
    };

    const [newProject] = await db
      .insert(projects)
      .values(projectData)
      .returning();

    return NextResponse.json(
      { success: true, project: newProject },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : error },
      { status: 400 }
    );
  }
}

