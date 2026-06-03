import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Company name is too long"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(250, "Location name is too long"),
  description: z.string().optional(),
});
