import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Invalidate the session or token by clearing cookies
    const response = NextResponse.json({ message: "Successfully logged out" });

    // Remove the authentication cookie
    response.cookies.set({
      name: "authToken",
      value: "",
      path: "/",
      httpOnly: true,
      maxAge: 0, // Immediately expire the cookie
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
