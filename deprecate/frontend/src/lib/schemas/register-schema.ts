import { z } from "zod";
/* import { USER_ROLES } from "@/db/schema/auth-schema";

// Map USER_ROLES to display names for the form
export const userTypeDisplayNames = {
  [USER_ROLES.FOUNDER]: 'Founder',
  [USER_ROLES.INVESTOR]: 'Investor',
  [USER_ROLES.SUPPORT]: 'Supporter'
} as const;

export const userRoleTypes = Object.values(userTypeDisplayNames) as readonly string[];
*/

export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  // role: z.enum(userRoleTypes as [string, ...string[]], {
  //   required_error: "Please select a user type",
  // }),
});

export type RegisterSchema = typeof registerSchema;

/**
 * Maps user type display names to Better Auth role constants
 * @param userType - The user type from the registration form
 * @returns The corresponding Better Auth role
 */
/*
export function mapUserTypeToRole(userType: string): string {
 switch (userType) {
   case 'Founder':
     return USER_ROLES.FOUNDER;
   case 'Investor':
     return USER_ROLES.INVESTOR;
   case 'Supporter':
     return USER_ROLES.SUPPORT;
   default:
     return USER_ROLES.FOUNDER; // fallback
 }
}
*/
