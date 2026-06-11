import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must be at most 50 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const signInSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const acceptInvitationSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});
