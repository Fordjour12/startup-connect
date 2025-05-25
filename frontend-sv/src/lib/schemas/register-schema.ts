import { z } from "zod";

export const userTypes = ['startup', 'supporter', 'investor'] as const;

// export const userTypes = ["STARTUP", "SUPPORTER", "INVESTOR", "SERVICE PROVIDER"] as const;
// export const userTypes = ["Startup Founder", "Investor", "Service Provider"] as const;

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  userType: z.enum(userTypes, {
    required_error: "Please select a user type",
  }),
});

export type RegisterSchema = typeof registerSchema;
