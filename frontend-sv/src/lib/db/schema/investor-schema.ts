import {
	pgTable,
	text,
	timestamp,
	integer,
	jsonb,
	boolean
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// =============================================================================
// INVESTOR ORGANIZATION SCHEMA - Investment-specific tables
// =============================================================================

export const investmentPortfolio = pgTable("investment_portfolio", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id").notNull(), // References organization.id
	startupId: text("startup_id").notNull(), // Reference to startup table

	// Investment details
	investmentAmount: integer("investment_amount"), // In cents
	investmentDate: timestamp("investment_date"),
	investmentStage: text("investment_stage"), // "seed", "series_a", etc.
	equityPercentage: text("equity_percentage"), // "5%", "10%", etc.

	// Status and tracking
	status: text("status").default("active"), // "active", "exited", "written_off", "diluted"
	exitDate: timestamp("exit_date"),
	exitValue: integer("exit_value"), // In cents
	returnMultiple: text("return_multiple"), // "2x", "5x", "10x+", etc.

	// Due diligence
	dueDiligenceStatus: text("due_diligence_status"), // "pending", "in_progress", "completed"
	notes: text("notes"),
	documents: text("documents"), // JSON array of document references

	// Metadata
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

export const dueDiligence = pgTable("due_diligence", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id").notNull(), // References organization.id
	startupId: text("startup_id").notNull(),
	assignedTo: text("assigned_to"), // References user.id

	// Workflow status
	status: text("status").default("pending"), // "pending", "in_progress", "completed", "approved", "rejected"
	priority: text("priority").default("medium"), // "low", "medium", "high", "urgent"

	// Checklist items
	checklist: jsonb("checklist").$type<{
		financials: { completed: boolean; notes: string; documents: string[] };
		market: { completed: boolean; notes: string; documents: string[] };
		team: { completed: boolean; notes: string; documents: string[] };
		technology: { completed: boolean; notes: string; documents: string[] };
		legal: { completed: boolean; notes: string; documents: string[] };
		competitive: { completed: boolean; notes: string; documents: string[] };
	}>(),

	// Timeline
	startDate: timestamp("start_date"),
	dueDate: timestamp("due_date"),
	completedDate: timestamp("completed_date"),

	// Results
	recommendation: text("recommendation"), // "invest", "pass", "follow_up"
	confidence: text("confidence"), // "low", "medium", "high"
	summary: text("summary"),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

export const investmentPipeline = pgTable("investment_pipeline", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id").notNull(),
	startupId: text("startup_id").notNull(),

	// Pipeline status
	stage: text("stage").default("discovery"), // "discovery", "initial_screening", "due_diligence", "partner_review", "final_decision", "passed", "invested"
	priority: text("priority").default("medium"), // "low", "medium", "high"

	// Investment details
	proposedAmount: integer("proposed_amount"), // In cents
	proposedEquity: text("proposed_equity"), // "5%", "10%", etc.
	leadInvestor: boolean("lead_investor").default(false),

	// Internal notes
	internalNotes: text("internal_notes"),
	nextSteps: text("next_steps"),

	// Assigned team members
	assignedTo: text("assigned_to"), // JSON array of user IDs

	// Dates
	discoveredDate: timestamp("discovered_date").$defaultFn(() => new Date()),
	lastUpdated: timestamp("last_updated").$defaultFn(() => new Date()),
	decisionDate: timestamp("decision_date"),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

export const organizationActivity = pgTable("organization_activity", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),

	// Activity details
	action: text("action").notNull(), // "member_invited", "investment_added", "due_diligence_started", etc.
	entityType: text("entity_type"), // "member", "investment", "due_diligence", "pipeline"
	entityId: text("entity_id"),
	description: text("description"),

	// Metadata
	metadata: jsonb("metadata"), // Additional context data

	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

// =============================================================================
// CONSTANTS AND TYPES
// =============================================================================

export const INVESTMENT_STAGES = {
	SEED: "seed",
	SERIES_A: "series_a",
	SERIES_B: "series_b",
	SERIES_C: "series_c",
	GROWTH: "growth",
	LATE_STAGE: "late_stage",
	IPO: "ipo"
} as const;

export const PIPELINE_STAGES = {
	DISCOVERY: "discovery",
	INITIAL_SCREENING: "initial_screening",
	DUE_DILIGENCE: "due_diligence",
	PARTNER_REVIEW: "partner_review",
	FINAL_DECISION: "final_decision",
	PASSED: "passed",
	INVESTED: "invested"
} as const;

export const DUE_DILIGENCE_STATUS = {
	PENDING: "pending",
	IN_PROGRESS: "in_progress",
	COMPLETED: "completed",
	APPROVED: "approved",
	REJECTED: "rejected"
} as const;

export const RECOMMENDATIONS = {
	INVEST: "invest",
	PASS: "pass",
	FOLLOW_UP: "follow_up"
} as const;

export const CONFIDENCE_LEVELS = {
	LOW: "low",
	MEDIUM: "medium",
	HIGH: "high"
} as const;

// Type exports
export type InvestmentPortfolio = typeof investmentPortfolio.$inferSelect;
export type NewInvestmentPortfolio = typeof investmentPortfolio.$inferInsert;

export type DueDiligence = typeof dueDiligence.$inferSelect;
export type NewDueDiligence = typeof dueDiligence.$inferInsert;

export type InvestmentPipeline = typeof investmentPipeline.$inferSelect;
export type NewInvestmentPipeline = typeof investmentPipeline.$inferInsert;

export type OrganizationActivity = typeof organizationActivity.$inferSelect;
export type NewOrganizationActivity = typeof organizationActivity.$inferInsert;
