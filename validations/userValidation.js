import { z } from "zod";

export const userSchemaZod = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  age: z.number().int().min(0, "Age must be a positive number").optional(),
  password: z.string().min(8, "Password must be at least 2 characters"),
});
