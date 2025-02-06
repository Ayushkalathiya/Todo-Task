// call /api/auth/login


export async function login(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("response:", response);

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  } catch (error) {
    console.error("Login failed", error);
    throw new Error(
      "Login failed. Please check your credentials and try again."
    );
  }
}
