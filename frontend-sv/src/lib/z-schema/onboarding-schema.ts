import { z } from "zod";
import { USER_ROLES } from "@/db/schema/auth-schema";

// Role selection schema
export const roleSelectionSchema = z.object({
   role: z.enum([USER_ROLES.FOUNDER, USER_ROLES.INVESTOR, USER_ROLES.SUPPORT], {
      required_error: "Please select a role"
   })
});

export type RoleSelection = z.infer<typeof roleSelectionSchema>;
export type UserRole = RoleSelection["role"];

/*
// Founder specific schema
export const founderSchema = z.object({
  startupName: z.string().min(1, "Startup name is required"),
  startupStage: z.enum(["idea", "pre_seed", "seed", "series_a", "series_b", "growth"]),
  fundingNeeds: z.number().optional(),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  startupDescription: z.string().min(10, "Description must be at least 10 characters").max(1000),
  equityOffered: z.number().optional()
});

export type FounderInfo = z.infer<typeof founderSchema>;

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
*/
// Basic info schema
export const basicInfoSchema = z.object({
   name: z.string().min(2, "Name must be at least 2 characters"),
   email: z.string().email("Please enter a valid email address"),
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
   languages: z.string().transform(val => val === "" ? [] : val.split(",").map(lang => lang.trim()).filter(lang => lang.length > 0)).optional(),
   employmentStatus: z.string().transform(val => val === "" ? undefined : val).optional(),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;

// Goals schema
export const goalsSchema = z.object({
   personalGoals: z.array(z.string().min(1, "Goal cannot be empty")).optional(),
   platformGoals: z.array(z.string().min(1, "Goal cannot be empty")).optional(),
   primaryGoal: z.string().optional(),
   specificNeeds: z.array(z.string()).optional(),
   timeCommitment: z.string().optional(),
   additionalGoals: z.string().max(300, "Additional goals must be less than 300 characters").optional()
});

export type Goals = z.infer<typeof goalsSchema>;

// Skills schema
export const skillsSchema = z.object({
   selectedSkills: z.array(z.string()),
   customSkills: z.array(z.string())
});

export type Skills = z.infer<typeof skillsSchema>;

// Preferences schema
export const preferencesSchema = z.object({
   communicationFrequency: z.string().optional(),
   notificationTypes: z.array(z.string()),
   themePreference: z.string().optional()
});

export type Preferences = z.infer<typeof preferencesSchema>;

// Complete onboarding schema
export const onboardingSchema = z.object({
   role: roleSelectionSchema.shape.role,
   basicInfo: basicInfoSchema,
   goals: goalsSchema,
   skills: skillsSchema,
   preferences: preferencesSchema
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
