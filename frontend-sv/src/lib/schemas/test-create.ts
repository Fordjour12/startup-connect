import { z } from "zod/v3";

export const testCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  logo: z
    .instanceof(File, { message: 'Please upload a logo file.' })
    .refine((f) => f.size < 2_000_000, 'Max 2MB upload size.')
    .refine(
      (f) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'].includes(f.type),
      'Only JPEG, PNG, WebP, SVG and GIF files are allowed.'
    )
    .optional(),
  pitchDeck: z
    .instanceof(File, { message: 'Please upload a pitch deck file.' })
    .refine((f) => f.size < 10_000_000, 'Max 10MB upload size.')
    .refine(
      (f) => ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type),
      'Only PDF, PPT, PPTX, DOC and DOCX files are allowed.'
    )
    .optional(),
  productScreenshots: z
    .array(
      z.instanceof(File, { message: 'Please upload valid screenshot files.' })
        .refine((f) => f.size < 5_000_000, 'Max 5MB per screenshot.')
        .refine(
          (f) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'].includes(f.type),
          'Only JPEG, PNG, WebP and SVG files are allowed for screenshots.'
        )
    )
    .optional(),
  demoVideo: z
    .instanceof(File, { message: 'Please upload a demo video file.' })
    .refine((f) => f.size < 50_000_000, 'Max 50MB upload size.')
    .refine(
      (f) => ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'].includes(f.type),
      'Only MP4, MPEG, MOV and WebM video files are allowed.'
    )
    .optional()
});

export type TestCreateSchema = typeof testCreateSchema;





export const startupSchema = z.object({
  name: z.string().min(2, "Startup name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(1, "Please enter a location"),
  fundingStage: z.string().min(1, "Please select a funding stage"),
  foundedYear: z.number().min(1900, "Please enter a valid year"),
  teamSize: z.number().min(1, "Please enter team size"),
  website: z.string().url("Please enter a valid website URL"),
  isPublished: z.boolean().default(false),
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
