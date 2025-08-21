// Founder specific schema
export const founderSchema = z.object({
  startups: z.array(z.object({
    name: z.string().min(2, "Startup name must be at least 2 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters"),
    website: z.string().refine(val => val === "" || /^https?:\/\/.+/.test(val), "Please enter a valid URL").optional(),
    foundedYear: z.number().min(2000).max(new Date().getFullYear()).optional(),
    stage: z.enum(["Pre-seed", "Seed", "Series A", "Series B", "Growth", "Established"]),
    industry: z.string().min(1, "Industry is required"),
    teamSize: z.number().min(1),
    fundingStage: z.enum(["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Acquired"]),
    currentFunding: z.string().optional(),
    seekingFunding: z.boolean().default(false),
    fundingAmount: z.string().optional(),
    pitchDeck: z.string().optional(),
    videoPitch: z.string().optional(),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional()
    }).optional()
  })).min(1, "Please add at least one startup"),
  primaryStartupIndex: z.number().min(0).optional(),
  startupExperience: z.enum(["First-time founder", "Serial entrepreneur", "Corporate background", "Other"]),
  entrepreneurialBackground: z.string().max(1000, "Background must be less than 1000 characters").optional(),
  keyChallenges: z.array(z.string()).optional(),
  growthGoals: z.array(z.string()).optional(),
  mentorshipNeeds: z.array(z.string()).optional()
});

export type FounderInfo = z.infer<typeof founderSchema>;
