import { z } from "zod";
import { USER_ROLES } from "@/db/schema/auth-schema";

// =============================================================================
// ROLE SELECTION
// =============================================================================

export const roleSelectionSchema = z.object({
  role: z.enum([USER_ROLES.FOUNDER, USER_ROLES.INVESTOR, USER_ROLES.SUPPORT], {
    required_error: "Please select a role"
  })
});

export type RoleSelection = z.infer<typeof roleSelectionSchema>;
export type UserRole = RoleSelection["role"];

// =============================================================================
// USER ROLE-SPECIFIC SCHEMAS
// =============================================================================

// Investor specific schema
export const investorSchema = z.object({
  investmentSize: z.enum(["under_50k", "50k_100k", "100k_500k", "500k_1m", "1m_plus"]),
  preferredStages: z.array(z.enum(["pre_seed", "seed", "series_a", "series_b", "growth"])),
  investmentHistory: z.string().max(500).optional(),
  riskAppetite: z.enum(["conservative", "moderate", "aggressive"]),
  portfolioCompanies: z.number().optional()
});

export type InvestorInfo = z.infer<typeof investorSchema>;

// Supporter specific schema
export const supporterSchema = z.object({
  supportType: z.array(z.string()),
  availability: z.enum(["one_off", "ongoing", "project_based"]),
  hourlyRate: z.number().optional(),
  expertise: z.string().max(500).optional()
});

export type SupporterInfo = z.infer<typeof supporterSchema>;

// =============================================================================
// BASIC INFORMATION
// =============================================================================

export const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  profileImage: z.string().nullable().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").transform(val => val === "" ? undefined : val).optional(),
  jobTitle: z.string().transform(val => val === "" ? undefined : val).optional(),
  industry: z.string().transform(val => val === "" ? undefined : val).optional(),
  education: z.string().transform(val => val === "" ? undefined : val).optional(),
  phone: z.string().transform(val => val === "" ? undefined : val).optional(),
  twitterHandle: z.string().transform(val => val === "" ? undefined : val).optional(),
  linkedinUrl: z.string().refine(val => val === "" || /^https?:\/\/.+/.test(val), "Please enter a valid URL").transform(val => val === "" ? undefined : val).optional(),
  githubProfile: z.string().refine(val => val === "" || /^https?:\/\/.+/.test(val), "Please enter a valid URL").transform(val => val === "" ? undefined : val).optional(),
  portfolioWebsite: z.string().refine(val => val === "" || /^https?:\/\/.+/.test(val), "Please enter a valid URL").transform(val => val === "" ? undefined : val).optional(),
  city: z.string().transform(val => val === "" ? undefined : val).optional(),
  timezone: z.string().transform(val => val === "" ? undefined : val).optional(),
  languages: z.array(z.string()).optional(),
  employmentStatus: z.string().transform(val => val === "" ? undefined : val).optional(),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;

// =============================================================================
// GOALS
// =============================================================================

export const goalsSchema = z.object({
  personalGoals: z.array(z.string().min(1, "Goal cannot be empty")).optional(),
  platformGoals: z.array(z.string().min(1, "Goal cannot be empty")).optional(),
  primaryGoal: z.string().min(1, "Please select your primary goal"),
  specificNeeds: z.array(z.string()).min(1, "Please select at least one specific need"),
  timeCommitment: z.string().min(1, "Please select your time commitment"),
  additionalGoals: z.string().max(300, "Additional goals must be less than 300 characters").optional()
});

export type Goals = z.infer<typeof goalsSchema>;

// =============================================================================
// SKILLS
// =============================================================================

export const skillsSchema = z.object({
  skills: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"], {
    required_error: "Please select your experience level"
  }),
  industries: z.array(z.string()),
  achievements: z.string().max(1000).optional(),
  expertiseAreas: z.string().max(1000).optional(),
  certifications: z.string().max(1000).optional()
});

export type Skills = z.infer<typeof skillsSchema>;

// =============================================================================
// PREFERENCES
// =============================================================================

export const COMMUNICATION_METHODS = [
  "video_calls",
  "email",
  "in_person",
  "chat",
] as const;

export const preferencesSchema = z.object({
  communicationMethods: z
    .array(z.enum(COMMUNICATION_METHODS))
    .min(1, "Please select at least one communication method"),
  communicationFrequency: z.string().optional(),
  notificationTypes: z.array(z.string()),
  themePreference: z.string().optional(),
});

export type Preferences = z.infer<typeof preferencesSchema>;

// =============================================================================
// COMPLETE ONBOARDING SCHEMA
// =============================================================================

export const onboardingSchema = z.object({
  role: roleSelectionSchema.shape.role,
  basicInfo: basicInfoSchema.refine(
    (data) => data.name && data.email,
    "Name and email are required"
  ),
  goals: goalsSchema,
  skills: skillsSchema,
  preferences: preferencesSchema,
  // Add role-specific data
  investorInfo: investorSchema.optional(),
  supporterInfo: supporterSchema.optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
