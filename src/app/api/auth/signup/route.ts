import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; 

// Define TypeScript interfaces for better type safety
interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

interface SignupResponse {
  id: number;
  name: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("Inside signup route");

    // Parse JSON body correctly
    const body: SignupRequestBody = await req.json();
    console.log("Parsed body:", body);

    // Validate input
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const { name, email, password, avatarUrl } = body;

    // Check if the user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database and return the new user details
    const [newUser]: SignupResponse[] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashedPassword,
        avatarUrl,
      })
      .returning({ id: users.id, name: users.name });

    // Generate JWT Token for authentication
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // Set authentication cookie
    (await cookies()).set("authToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
