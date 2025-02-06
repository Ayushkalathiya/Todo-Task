import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  projectId: z.number(),
});
