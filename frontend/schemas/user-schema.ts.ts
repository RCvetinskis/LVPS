import { z } from "zod";

export const userInvitationSchema = z.object({
  email: z.email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must be at most 50 characters"),
});
