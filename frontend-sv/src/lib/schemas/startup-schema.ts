import { z } from "zod";

export const startupSchema = z.object({
  name: z.string().min(2, "Startup name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(1, "Please enter a location"),
  fundingStage: z.string().min(1, "Please select a funding stage"),
  foundedYear: z.number().min(1900, "Please enter a valid year"),
  teamSize: z.number().min(1, "Please enter team size"),
  website: z.string().url("Please enter a valid website URL"),
  teamMembers: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    bio: z.string().min(1, "Bio is required"),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional()
  })).optional(),
  funding: z.object({
    total: z.string().min(1, "Please enter total funding"),
    lastRound: z.string().min(1, "Please enter last round"),
    investors: z.string().min(1, "Please enter investors")
  }),
  metrics: z.object({
    revenue: z.string().min(1, "Please enter revenue"),
    growth: z.string().min(1, "Please enter growth"),
    customers: z.string().min(1, "Please enter number of customers")
  }),
  socialMedia: z.object({
    twitter: z.string().url("Please enter a valid Twitter URL").optional(),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional(),
    facebook: z.string().url("Please enter a valid Facebook URL").optional(),
    instagram: z.string().url("Please enter a valid Instagram URL").optional()
  }).optional(),
  contact: z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    address: z.string().optional()
  }),
  businessModel: z.string().min(1, "Please describe your business model"),
  targetMarket: z.string().min(1, "Please describe your target market"),
  competitors: z.string().min(1, "Please list your main competitors"),
  traction: z.object({
    users: z.string().optional(),
    revenue: z.string().optional(),
    growth: z.string().optional(),
    partnerships: z.string().optional()
  }).optional(),
  useOfFunds: z.object({
    product: z.string().min(1, "Please describe product development plans"),
    marketing: z.string().min(1, "Please describe marketing plans"),
    operations: z.string().min(1, "Please describe operational plans"),
    team: z.string().min(1, "Please describe team expansion plans"),
    other: z.string().optional()
  }),
  timeline: z.object({
    past: z.array(z.object({
      date: z.string().min(1, "Date is required"),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["achievement", "funding", "partnership", "product", "other"])
    })).optional(),
    future: z.array(z.object({
      date: z.string().min(1, "Date is required"),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["launch", "funding", "partnership", "product", "other"])
    })).optional()
  }).optional()
});

export type StartupSchema = typeof startupSchema; 