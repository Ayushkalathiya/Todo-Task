import db from "@/db/index"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { CategorySchema } from "../schema"

type RouteContext = {
  params: { id: string };
};


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// Middleware to Authenticate User
const authenticateUser = async (): Promise<number | null> => {
  const authToken = (await cookies()).get("authToken")
  console.log("authToken", authToken)

  if (!authToken) return null

  try {
    const { payload } = await jwtVerify(authToken.value, JWT_SECRET)
    if (typeof payload.userId !== "number") return null
    console.log("payload.userId", payload.userId)

    return payload.userId
  } catch {
    return null
  }
}

// Update Category (PUT)
export async function POST(req: NextRequest, { params }: { params: Promise<RouteContext>}) {
  const userId = await authenticateUser()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if(!params){
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }  

  try {
    const categoryId = (await params).params.id
    const body = await req.json()
    const { name, projectId } = CategorySchema.parse(body)

    const [updatedCategory] = await db
      .update(categories)
      .set({ name, projectId })
      .where(eq(categories.id, Number.parseInt(categoryId)) && eq(categories.userId, userId))
      .returning()

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, category: updatedCategory }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
}

// Delete Category (DELETE)
export async function DELETE( { params }: { params: { id: string } }) {
  const userId = await authenticateUser()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id }  = params;
    const categoryId = id;

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, Number.parseInt(categoryId)) && eq(categories.userId, userId))
      .returning()

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
}

