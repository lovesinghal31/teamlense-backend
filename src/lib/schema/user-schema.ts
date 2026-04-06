import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password is too long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character",
  });

export const userSignupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name is required" })
      .max(50, { message: "Name is too long" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Email must be a valid email address",
      })
      .email({ message: "Invalid email address" }),

    skills: z
      .string()
      .min(1, { message: "Skills are required" })
      .max(999, { message: "Skills are too long" }),

    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: passwordSchema,
});
