import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  console.log("Inside me route");

  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET!);

    const { payload } = await jwtVerify(token, secretKey); // Verify and decode the token
    console.log("user payload:", payload);

    const { userId } = payload;

    if (userId === undefined) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const id = parseInt(userId as string, 10);

    // find user by userId
    const user = await db.select().from(users).where(eq(users.id, id));

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
