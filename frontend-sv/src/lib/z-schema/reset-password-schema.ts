import { z } from "zod";

const baseSchema = z.object({
    token: z.string().min(1, { message: "Reset token is required" }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
});

export const resetPasswordSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type ResetPasswordSchema = typeof resetPasswordSchema; 