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

export const userShiftPatternShema = z.object({
  name: z
    .string()
    .min(1, "Shift name must be at least 1 characters")
    .max(50, "Shift name must be at most 50 characters"),
  hours: z.number().min(0.5).max(24).multipleOf(0.5),
  work_days: z.number().min(1).max(7),
  off_days: z.number().min(1).max(365),
});

export const userDataSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must be at most 50 characters"),
});
