import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, ProjectSchema } from "../route";
import db from "@/db";
import { eq } from "drizzle-orm";
import { projects } from "@/db/schema";
import { z } from "zod";

// Update Project (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await authenticateUser();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { ...data } = await req.json();
    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (!id)
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );

    const parsedData = ProjectSchema.partial().parse(data);
    const updateData = {
      ...parsedData,
      updatedAt: new Date(),
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : null,
    };

    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    if (!updatedProject)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : error},
      { status: 400 }
    );
  }
}

// Delete Project (DELETE)
export async function DELETE(
  
  { params }: { params: { id: string } }
) {
  const userId = await authenticateUser();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (!id)
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );

    const result = await db.delete(projects).where(eq(projects.id, projectId));
    if (result.rowCount === 0)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
