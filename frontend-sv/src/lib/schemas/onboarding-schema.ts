import { z } from 'zod';

// Role selection schema
export const roleSelectionSchema = z.object({
	role: z.enum(['founder', 'investor', 'support'], {
		required_error: 'Please select a role'
	})
});

// Basic information schema
export const basicInfoSchema = z.object({
	fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
	email: z.string().email('Please enter a valid email address'),
	location: z.string().min(2, 'Location is required').max(100, 'Location is too long'),
	bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
	profilePicture: z.string().optional(),
	linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
	website: z.string().url('Please enter a valid website URL').optional().or(z.literal(''))
});

// Goals and objectives schema
export const goalsSchema = z.object({
	primaryGoal: z.enum([
		'find_cofounders',
		'raise_funding',
		'find_investors',
		'offer_mentorship',
		'provide_services',
		'invest_in_startups',
		'network',
		'learn'
	], {
		required_error: 'Please select your primary goal'
	}),
	specificNeeds: z.array(z.string()).min(1, 'Please select at least one specific need'),
	timeCommitment: z.enum(['1-5_hours', '5-10_hours', '10-20_hours', '20+_hours'], {
		required_error: 'Please select your time commitment'
	}),
	additionalGoals: z.string().max(300, 'Additional goals must be less than 300 characters').optional()
});

// Skills and expertise schema
export const skillsSchema = z.object({
	skills: z.array(z.string()).min(1, 'Please select at least one skill'),
	experienceLevel: z.enum(['beginner', 'intermediate', 'expert'], {
		required_error: 'Please select your experience level'
	}),
	industries: z.array(z.string()).min(1, 'Please select at least one industry'),
	achievements: z.string().max(500, 'Achievements must be less than 500 characters').optional()
});

// Preferences schema
export const preferencesSchema = z.object({
	geographicPreference: z.enum(['local', 'regional', 'global'], {
		required_error: 'Please select your geographic preference'
	}),
	communicationStyle: z.array(z.enum(['video_calls', 'email', 'in_person', 'chat'])).min(1, 'Please select at least one communication style'),
	workingStyle: z.enum(['fast_paced', 'collaborative', 'independent', 'long_term'], {
		required_error: 'Please select your working style'
	}),
	diversityPreference: z.boolean().default(true),
	notificationFrequency: z.enum(['daily', 'weekly', 'monthly'], {
		required_error: 'Please select your notification frequency'
	})
});

// Founder-specific schema
export const founderSchema = z.object({
	startupName: z.string().min(2, 'Startup name must be at least 2 characters').max(100, 'Startup name is too long'),
	startupStage: z.enum(['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'growth'], {
		required_error: 'Please select your startup stage'
	}),
	fundingNeeds: z.number().min(0, 'Funding needs cannot be negative').optional(),
	teamSize: z.number().min(1, 'Team size must be at least 1').max(100, 'Team size is too large'),
	startupDescription: z.string().min(10, 'Startup description must be at least 10 characters').max(1000, 'Startup description is too long'),
	equityOffered: z.number().min(0).max(100, 'Equity cannot exceed 100%').optional()
});

// Investor-specific schema
export const investorSchema = z.object({
	investmentSize: z.enum(['under_50k', '50k_100k', '100k_500k', '500k_1m', '1m_plus'], {
		required_error: 'Please select your investment size range'
	}),
	preferredStages: z.array(z.enum(['pre_seed', 'seed', 'series_a', 'series_b', 'growth'])).min(1, 'Please select at least one preferred stage'),
	investmentHistory: z.string().max(500, 'Investment history must be less than 500 characters').optional(),
	riskAppetite: z.enum(['conservative', 'moderate', 'aggressive'], {
		required_error: 'Please select your risk appetite'
	}),
	portfolioCompanies: z.number().min(0, 'Portfolio companies cannot be negative').optional()
});

// Supporter-specific schema
export const supporterSchema = z.object({
	supportType: z.array(z.enum([
		'mentorship',
		'legal_advice',
		'marketing',
		'technical',
		'financial',
		'operations',
		'sales',
		'hr',
		'design'
	])).min(1, 'Please select at least one support type'),
	availability: z.enum(['one_off', 'ongoing', 'project_based'], {
		required_error: 'Please select your availability'
	}),
	hourlyRate: z.number().min(0, 'Hourly rate cannot be negative').optional(),
	expertise: z.string().max(500, 'Expertise description must be less than 500 characters').optional()
});

// Complete onboarding schema
export const onboardingSchema = z.object({
	// Step 1: Role selection
	role: roleSelectionSchema.shape.role,

	// Step 2: Basic information
	...basicInfoSchema.shape,

	// Step 3: Goals
	...goalsSchema.shape,

	// Step 4: Skills
	...skillsSchema.shape,

	// Step 5: Preferences
	...preferencesSchema.shape,

	// Step 6: Role-specific information (all optional)
	...Object.fromEntries(
		Object.entries(founderSchema.shape).map(([key, value]) => [key, value.optional()])
	),
	...Object.fromEntries(
		Object.entries(investorSchema.shape).map(([key, value]) => [key, value.optional()])
	),
	...Object.fromEntries(
		Object.entries(supporterSchema.shape).map(([key, value]) => [key, value.optional()])
	),

	// Step 7: Verification and completion
	termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
	privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
	marketingEmails: z.boolean().default(false)
});

// Individual step schemas for validation
export const stepSchemas = {
	role: roleSelectionSchema,
	basicInfo: basicInfoSchema,
	goals: goalsSchema,
	skills: skillsSchema,
	preferences: preferencesSchema,
	founder: founderSchema,
	investor: investorSchema,
	supporter: supporterSchema
};

// Type exports
export type RoleSelection = z.infer<typeof roleSelectionSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type Goals = z.infer<typeof goalsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type FounderInfo = z.infer<typeof founderSchema>;
export type InvestorInfo = z.infer<typeof investorSchema>;
export type SupporterInfo = z.infer<typeof supporterSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>; 