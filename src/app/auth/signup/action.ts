"use server";

// Define an interface for types
interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function register(formData: SignupRequestBody) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return await res.json();
}
