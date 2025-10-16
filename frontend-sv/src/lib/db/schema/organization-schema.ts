import {
	pgTable,
	text,
	timestamp,
	integer,
	boolean
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { organization, member, user } from "./auth-schema";

// =============================================================================
// ENHANCED ORGANIZATION SCHEMA - Investor-specific organization fields
// =============================================================================

export const organizationProfile = pgTable("organization_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),

	// Organization type and focus
	organizationType: text("organization_type").notNull(), // "investment_firm", "angel_group", "vc_fund", "family_office", "corporate_venture"
	investmentFocus: text("investment_focus"), // "seed", "series_a", "series_b", "growth", "late_stage"
	totalAssetsUnderManagement: text("aum"), // "Under-10M", "10M-100M", "100M-1B", "1B+"
	investmentSizeRange: text("investment_size_range"), // "50k-500k", "500k-2M", "2M-10M", "10M+"
	geographicFocus: text("geographic_focus"), // "North America", "Europe", "Asia", "Global", "Local"
	sectorFocus: text("sector_focus"), // "SaaS", "FinTech", "HealthTech", "EdTech", "CleanTech", "General"

	// Organization details
	foundedYear: integer("founded_year"),
	headquarters: text("headquarters"),
	website: text("website"),
	description: text("description"),
	teamSize: text("team_size"), // "1-5", "6-20", "21-50", "50+"

	// Verification status
	isVerified: boolean("is_verified").$defaultFn(() => false).notNull(),
	verificationDate: timestamp("verification_date"),

	// Investment criteria
	minInvestmentSize: integer("min_investment_size"), // In cents
	maxInvestmentSize: integer("max_investment_size"), // In cents
	preferredDealFlow: text("preferred_deal_flow"), // "direct", "syndicates", "both"

	// Contact information
	contactEmail: text("contact_email"),
	contactPhone: text("contact_phone"),
	linkedinUrl: text("linkedin_url"),
	twitterHandle: text("twitter_handle"),

	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.$onUpdateFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// Enhanced member roles for organizations
export const ORGANIZATION_ROLES = {
	OWNER: "owner",
	ADMIN: "admin",
	INVESTMENT_PARTNER: "investment_partner",
	INVESTMENT_ANALYST: "investment_analyst",
	OPERATIONS: "operations",
	MEMBER: "member",
	VIEWER: "viewer"
} as const;

export type OrganizationRole = typeof ORGANIZATION_ROLES[keyof typeof ORGANIZATION_ROLES];

export const organizationMember = pgTable("organization_member", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	role: text("role").default(ORGANIZATION_ROLES.MEMBER).notNull(),
	permissions: text("permissions"), // JSON array of permission strings
	invitedBy: text("invited_by").references(() => user.id),
	joinedAt: timestamp("joined_at"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.$onUpdateFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// =============================================================================
// CONSTANTS AND TYPES
// =============================================================================

export const ORGANIZATION_TYPES = {
	INVESTMENT_FIRM: "investment_firm",
	ANGEL_GROUP: "angel_group",
	VC_FUND: "vc_fund",
	FAMILY_OFFICE: "family_office",
	CORPORATE_VENTURE: "corporate_venture"
} as const;

export const INVESTMENT_FOCUS = {
	SEED: "seed",
	SERIES_A: "series_a",
	SERIES_B: "series_b",
	GROWTH: "growth",
	LATE_STAGE: "late_stage"
} as const;

export const AUM_RANGES = {
	UNDER_10M: "Under-10M",
	TEN_TO_100M: "10M-100M",
	HUNDRED_M_TO_1B: "100M-1B",
	OVER_1B: "1B+"
} as const;

export const INVESTMENT_SIZE_RANGES = {
	FIFTY_K_TO_500K: "50k-500k",
	FIVE_HUNDRED_K_TO_2M: "500k-2M",
	TWO_M_TO_10M: "2M-10M",
	OVER_10M: "10M+"
} as const;

export const GEOGRAPHIC_FOCUS = {
	NORTH_AMERICA: "North America",
	EUROPE: "Europe",
	ASIA: "Asia",
	GLOBAL: "Global",
	LOCAL: "Local"
} as const;

export const SECTOR_FOCUS = {
	SAAS: "SaaS",
	FINTECH: "FinTech",
	HEALTHTECH: "HealthTech",
	EDTECH: "EdTech",
	CLEANTECH: "CleanTech",
	GENERAL: "General"
} as const;

export const DEAL_FLOW_PREFERENCES = {
	DIRECT: "direct",
	SYNDICATES: "syndicates",
	BOTH: "both"
} as const;

// Type exports
export type OrganizationProfile = typeof organizationProfile.$inferSelect;
export type NewOrganizationProfile = typeof organizationProfile.$inferInsert;

export type OrganizationMember = typeof organizationMember.$inferSelect;
export type NewOrganizationMember = typeof organizationMember.$inferInsert;
