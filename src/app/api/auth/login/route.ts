import { type NextRequest, NextResponse } from "next/server"
import db from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    console.log("Inside login route")


    // Parse request body
    const { email, password } = await req.json()
    console.log("Received email:", email)

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Fetch user from DB
    console.log("Fetching user from database")
    const [user] = await db.select().from(users).where(eq(users.email, email))

    console.log("User found:", user);
    

    // Check if user exists
    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify password
    console.log("Verifying password")
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate JWT Token
    console.log("Generating JWT token")
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    })

    // Set authentication cookie
    console.log("Setting authentication cookie")
    const cookie = await cookies()

    cookie.set("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    })

    console.log("Login successful")
    return NextResponse.json({ user : { name: user.name , email: user.email , id: user.id } , message: "Successfully logged in" })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

