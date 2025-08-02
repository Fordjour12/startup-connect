import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	pgEnum,
	jsonb,
	decimal,
	check
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

// Enums for various fields
export const roleEnum = pgEnum("role", ["founder", "investor", "support"]);
export const primaryGoalEnum = pgEnum("primary_goal", [
	"find_cofounders",
	"raise_funding",
	"find_investors",
	"offer_mentorship",
	"provide_services",
	"invest_in_startups",
	"network",
	"learn"
]);
export const timeCommitmentEnum = pgEnum("time_commitment", [
	"1-5_hours",
	"5-10_hours",
	"10-20_hours",
	"20+_hours"
]);
export const experienceLevelEnum = pgEnum("experience_level", [
	"beginner",
	"intermediate",
	"expert"
]);
export const geographicPreferenceEnum = pgEnum("geographic_preference", [
	"local",
	"regional",
	"global"
]);
export const workingStyleEnum = pgEnum("working_style", [
	"fast_paced",
	"collaborative",
	"independent",
	"long_term"
]);
export const notificationFrequencyEnum = pgEnum("notification_frequency", [
	"daily",
	"weekly",
	"monthly"
]);
export const startupStageEnum = pgEnum("startup_stage", [
	"idea",
	"pre_seed",
	"seed",
	"series_a",
	"series_b",
	"growth"
]);
export const investmentSizeEnum = pgEnum("investment_size", [
	"under_50k",
	"50k_100k",
	"100k_500k",
	"500k_1m",
	"1m_plus"
]);
export const riskAppetiteEnum = pgEnum("risk_appetite", [
	"conservative",
	"moderate",
	"aggressive"
]);
export const supportTypeEnum = pgEnum("support_type", [
	"mentorship",
	"legal_advice",
	"marketing",
	"technical",
	"financial",
	"operations",
	"sales",
	"hr",
	"design"
]);
export const availabilityEnum = pgEnum("availability", [
	"one_off",
	"ongoing",
	"project_based"
]);

// Main onboarding profile table
export const onboardingProfile = pgTable("onboarding_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	// Role selection
	role: roleEnum("role").notNull(),

	// Basic information
	fullName: text("full_name").notNull(),
	email: text("email").notNull(),
	location: text("location").notNull(),
	bio: text("bio"),
	profilePicture: text("profile_picture"),
	linkedinUrl: text("linkedin_url"),
	website: text("website"),

	// Goals and objectives
	primaryGoal: primaryGoalEnum("primary_goal").notNull(),
	specificNeeds: jsonb("specific_needs").$type<string[]>().notNull(),
	timeCommitment: timeCommitmentEnum("time_commitment").notNull(),
	additionalGoals: text("additional_goals"),

	// Skills and expertise
	skills: jsonb("skills").$type<string[]>().notNull(),
	experienceLevel: experienceLevelEnum("experience_level").notNull(),
	industries: jsonb("industries").$type<string[]>().notNull(),
	achievements: text("achievements"),

	// Preferences
	geographicPreference: geographicPreferenceEnum("geographic_preference").notNull(),
	communicationStyle: jsonb("communication_style").$type<string[]>().notNull(),
	workingStyle: workingStyleEnum("working_style").notNull(),
	diversityPreference: boolean("diversity_preference").notNull().default(true),
	notificationFrequency: notificationFrequencyEnum("notification_frequency").notNull(),

	// Verification and completion
	termsAccepted: boolean("terms_accepted").notNull(),
	privacyAccepted: boolean("privacy_accepted").notNull(),
	marketingEmails: boolean("marketing_emails").notNull().default(false),

	// Metadata
	isComplete: boolean("is_complete").notNull().default(false),
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
}, (table) => [
	check("email_check", sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`),
	check("linkedin_url_check", sql`${table.linkedinUrl} IS NULL OR ${table.linkedinUrl} ~* '^https?://.*'`),
	check("website_check", sql`${table.website} IS NULL OR ${table.website} ~* '^https?://.*'`),
]);

// Founder-specific information
export const founderProfile = pgTable("founder_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	onboardingProfileId: text("onboarding_profile_id")
		.notNull()
		.references(() => onboardingProfile.id, { onDelete: "cascade" }),

	startupName: text("startup_name").notNull(),
	startupStage: startupStageEnum("startup_stage").notNull(),
	fundingNeeds: decimal("funding_needs", { precision: 15, scale: 2 }),
	teamSize: integer("team_size").notNull(),
	startupDescription: text("startup_description").notNull(),
	equityOffered: decimal("equity_offered", { precision: 5, scale: 2 }),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
}, (table) => [
	check("team_size_check", sql`${table.teamSize} >= 1 AND ${table.teamSize} <= 100`),
	check("equity_offered_check", sql`${table.equityOffered} IS NULL OR (${table.equityOffered} >= 0 AND ${table.equityOffered} <= 100)`),
	check("funding_needs_check", sql`${table.fundingNeeds} IS NULL OR ${table.fundingNeeds} >= 0`),
]);

// Investor-specific information
export const investorProfile = pgTable("investor_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	onboardingProfileId: text("onboarding_profile_id")
		.notNull()
		.references(() => onboardingProfile.id, { onDelete: "cascade" }),

	investmentSize: investmentSizeEnum("investment_size").notNull(),
	preferredStages: jsonb("preferred_stages").$type<string[]>().notNull(),
	investmentHistory: text("investment_history"),
	riskAppetite: riskAppetiteEnum("risk_appetite").notNull(),
	portfolioCompanies: integer("portfolio_companies"),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
}, (table) => [
	check("portfolio_companies_check", sql`${table.portfolioCompanies} IS NULL OR ${table.portfolioCompanies} >= 0`),
]);

// Supporter-specific information
export const supporterProfile = pgTable("supporter_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	onboardingProfileId: text("onboarding_profile_id")
		.notNull()
		.references(() => onboardingProfile.id, { onDelete: "cascade" }),

	supportType: jsonb("support_type").$type<string[]>().notNull(),
	availability: availabilityEnum("availability").notNull(),
	hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
	expertise: text("expertise"),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
}, (table) => [
	check("hourly_rate_check", sql`${table.hourlyRate} IS NULL OR ${table.hourlyRate} >= 0`),
]);

// Onboarding progress tracking
export const onboardingProgress = pgTable("onboarding_progress", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	currentStepIndex: integer("current_step_index").notNull().default(0),
	completedSteps: jsonb("completed_steps").$type<string[]>().notNull().default([]),
	formData: jsonb("form_data").$type<Record<string, any>>(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
}, (table) => [
	check("current_step_index_check", sql`${table.currentStepIndex} >= 0`),
]);

// Relations
export const onboardingProfileRelations = relations(onboardingProfile, ({ one, many }) => ({
	user: one(user, {
		fields: [onboardingProfile.userId],
		references: [user.id],
	}),
	founderProfile: one(founderProfile, {
		fields: [onboardingProfile.id],
		references: [founderProfile.onboardingProfileId],
	}),
	investorProfile: one(investorProfile, {
		fields: [onboardingProfile.id],
		references: [investorProfile.onboardingProfileId],
	}),
	supporterProfile: one(supporterProfile, {
		fields: [onboardingProfile.id],
		references: [supporterProfile.onboardingProfileId],
	}),
}));

export const founderProfileRelations = relations(founderProfile, ({ one }) => ({
	onboardingProfile: one(onboardingProfile, {
		fields: [founderProfile.onboardingProfileId],
		references: [onboardingProfile.id],
	}),
}));

export const investorProfileRelations = relations(investorProfile, ({ one }) => ({
	onboardingProfile: one(onboardingProfile, {
		fields: [investorProfile.onboardingProfileId],
		references: [onboardingProfile.id],
	}),
}));

export const supporterProfileRelations = relations(supporterProfile, ({ one }) => ({
	onboardingProfile: one(onboardingProfile, {
		fields: [supporterProfile.onboardingProfileId],
		references: [onboardingProfile.id],
	}),
}));

export const onboardingProgressRelations = relations(onboardingProgress, ({ one }) => ({
	user: one(user, {
		fields: [onboardingProgress.userId],
		references: [user.id],
	}),
})); 