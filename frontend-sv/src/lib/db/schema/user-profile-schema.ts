import {
	pgTable,
	text,
	timestamp,
	jsonb,
	integer,
	boolean
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth-schema";

// =============================================================================
// USER PROFILE SCHEMA - Stores onboarding and profile information
// =============================================================================

export const userProfile = pgTable("user_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),

	// Relationship to user table
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),

	// Basic Information
	name: text("name").notNull(),
	email: text("email").notNull(),
	profileImage: text("profile_image"),
	location: text("location"),
	bio: text("bio"),
	jobTitle: text("job_title"),
	industry: text("industry"),
	education: text("education"),
	phone: text("phone"),
	twitterHandle: text("twitter_handle"),
	linkedinUrl: text("linkedin_url"),
	githubProfile: text("github_profile"),
	portfolioWebsite: text("portfolio_website"),
	city: text("city"),
	timezone: text("timezone"),
	languages: text("languages"), // Stored as comma-separated string
	employmentStatus: text("employment_status"),

	// Role-specific information stored as JSON for flexibility
	roleSpecificData: jsonb("role_specific_data").$type<{
		// Investor specific data
		investmentSize?: "under_50k" | "50k_100k" | "100k_500k" | "500k_1m" | "1m_plus";
		preferredStages?: string[];
		investmentHistory?: string;
		riskAppetite?: "conservative" | "moderate" | "aggressive";
		portfolioCompanies?: number;

		// Supporter specific data
		supportType?: string[];
		availability?: "one_off" | "ongoing" | "project_based";
		hourlyRate?: number;
		expertise?: string;
	}>(),

	// Goals and Preferences
	personalGoals: text("personal_goals"), // Stored as comma-separated string
	platformGoals: text("platform_goals"), // Stored as comma-separated string
	primaryGoal: text("primary_goal"),
	specificNeeds: text("specific_needs"), // Stored as comma-separated string
	timeCommitment: text("time_commitment"),
	additionalGoals: text("additional_goals"),

	// Skills and Experience
	skills: text("skills"), // Stored as comma-separated string
	experienceLevel: text("experience_level"),
	industries: text("industries"), // Stored as comma-separated string
	achievements: text("achievements"),
	expertiseAreas: text("expertise_areas"),
	certifications: text("certifications"),

	// Communication Preferences
	communicationMethods: text("communication_methods"), // Stored as comma-separated string
	communicationFrequency: text("communication_frequency"),
	notificationTypes: text("notification_types"), // Stored as comma-separated string
	themePreference: text("theme_preference"),

	// Metadata
	isOnboardingComplete: boolean("is_onboarding_complete").$defaultFn(() => false).notNull(),
	onboardingStep: integer("onboarding_step").$defaultFn(() => 1).notNull(),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.$onUpdateFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// =============================================================================
// HELPER FUNCTIONS FOR DATA TRANSFORMATION
// =============================================================================

// Helper function to convert array to comma-separated string for storage
export const arrayToString = (arr: string[] | undefined): string | null => {
	if (!arr || arr.length === 0) return null;
	return arr.join(", ");
};

// Helper function to convert comma-separated string back to array
export const stringToArray = (str: string | null): string[] => {
	if (!str) return [];
	return str.split(",").map(item => item.trim()).filter(item => item.length > 0);
};

// =============================================================================
// TYPES
// =============================================================================

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
