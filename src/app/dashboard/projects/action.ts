
//get all projects
export async function getProjects() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}