import db from "@/db/index";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  projectId: z.number(),
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

// Get Categories (GET)
export async function GET() {
  const userId = await authenticateUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId)); // Fetching all categories for the authenticated user

    return NextResponse.json(
      { success: true, categories: userCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Create Category (POST)
export async function POST(req: NextRequest) {
  const userId = await authenticateUser();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    console.log("body", body);

    const { name, projectId } = CategorySchema.parse(body);
    console.log("name", name);
    console.log("projectId", projectId);
    console.log("userId", userId);
    
    

    const [newCategory] = await db
      .insert(categories)
      .values({ name, userId , projectId  }) // Replace 1 with the appropriate projectId value
      .returning();

    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : error },
      { status: 400 }
    );
  }
}
