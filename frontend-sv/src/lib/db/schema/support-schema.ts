import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	ticketNumber: text("ticket_number").notNull().unique(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	status: text("status").notNull().$default("open"), // open, in_progress, pending, resolved, closed
	priority: text("priority").notNull().$default("medium"), // critical, high, medium, low
	category: text("category"),
	tags: jsonb("tags").$defaultFn(() => []), // Array of tag strings

	// Customer information
	customerId: text("customer_id").references(() => supportCustomers.id),
	customerEmail: text("customer_email").notNull(),
	customerName: text("customer_name").notNull(),

	// Assignment
	assignedTo: text("assigned_to"),
	assignedBy: text("assigned_by"),
	assignedAt: timestamp("assigned_at"),

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	resolvedAt: timestamp("resolved_at"),
	closedAt: timestamp("closed_at"),

	// SLA tracking
	slaBreachTime: timestamp("sla_breach_time"),
	firstResponseTime: timestamp("first_response_time"),
	resolutionTime: timestamp("resolution_time"),

	// Metadata
	source: text("source").$default("manual"), // email, chat, phone, api, manual
	satisfactionRating: integer("satisfaction_rating"), // 1-5 stars
	feedback: text("feedback")
});

// Support Customers Table
export const supportCustomers = pgTable("support_customers", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	phone: text("phone"),
	company: text("company"),
	customerType: text("customer_type").$default("individual"), // individual, business, enterprise

	// Preferences
	preferredContact: text("preferred_contact").$default("email"), // email, phone, chat
	timezone: text("timezone").$default("UTC"),
	language: text("language").$default("en"),

	// Status
	isVip: boolean("is_vip").$defaultFn(() => false).notNull(),
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),

	// Metadata
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	lastContactAt: timestamp("last_contact_at")
});

// Knowledge Base Articles Table
export const knowledgeArticles = pgTable("knowledge_articles", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	title: text("title").notNull(),
	content: text("content").notNull(),
	summary: text("summary"),
	category: text("category"),
	tags: jsonb("tags").$defaultFn(() => []), // Array of tag strings

	// Status
	status: text("status").notNull().$default("draft"), // draft, published, archived
	isPublished: boolean("is_published").$defaultFn(() => false).notNull(),

	// Author and workflow
	authorId: text("author_id").notNull(),
	reviewerId: text("reviewer_id"),
	approvedBy: text("approved_by"),
	approvedAt: timestamp("approved_at"),

	// Analytics
	viewCount: integer("view_count").$defaultFn(() => 0).notNull(),
	helpfulVotes: integer("helpful_votes").$defaultFn(() => 0).notNull(),
	unhelpfulVotes: integer("unhelpful_votes").$defaultFn(() => 0).notNull(),

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	publishedAt: timestamp("published_at")
});

// Ticket Messages Table
export const ticketMessages = pgTable("ticket_messages", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	ticketId: text("ticket_id").references(() => supportTickets.id, { onDelete: "cascade" }).notNull(),
	authorId: text("author_id").notNull(),
	authorType: text("author_type").notNull(), // customer, agent, system
	message: text("message").notNull(),

	// Metadata
	isInternal: boolean("is_internal").$defaultFn(() => false).notNull(),
	attachments: jsonb("attachments").$defaultFn(() => []), // Array of file objects

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull()
});

// Support Categories Table
export const supportCategories = pgTable("support_categories", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	name: text("name").notNull(),
	description: text("description"),
	color: text("color").$default("#3B82F6"), // Hex color for UI
	icon: text("icon"), // Icon identifier
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
	sortOrder: integer("sort_order").$defaultFn(() => 0).notNull(),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull()
});

// Support Team Members Table (extends user profile)
export const supportTeamMembers = pgTable("support_team_members", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id").notNull().unique(),
	name: text("name").notNull(),
	email: text("email").notNull(),

	// Role and permissions
	role: text("role").$default("agent"), // super_admin, manager, senior_agent, agent, viewer
	permissions: jsonb("permissions").$defaultFn(() => []),

	// Status
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
	isOnline: boolean("is_online").$defaultFn(() => false).notNull(),

	// Work settings
	maxTicketsPerDay: integer("max_tickets_per_day").$defaultFn(() => 15).notNull(),
	workingHours: jsonb("working_hours"), // Time slots for availability

	// Statistics
	ticketsResolved: integer("tickets_resolved").$defaultFn(() => 0).notNull(),
	averageResponseTime: integer("average_response_time"), // in minutes
	customerSatisfaction: integer("customer_satisfaction"), // average rating 1-5

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	lastActiveAt: timestamp("last_active_at")
});

// Ticket Activity Log Table
export const ticketActivityLog = pgTable("ticket_activity_log", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	ticketId: text("ticket_id").references(() => supportTickets.id, { onDelete: "cascade" }).notNull(),
	userId: text("user_id").notNull(),
	action: text("action").notNull(), // created, updated, assigned, status_changed, etc.
	oldValue: text("old_value"),
	newValue: text("new_value"),
	description: text("description"),

	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull()
});

// Constants and Types
export const TICKET_STATUS = {
	OPEN: 'open',
	IN_PROGRESS: 'in_progress',
	PENDING: 'pending',
	RESOLVED: 'resolved',
	CLOSED: 'closed'
} as const;

export const TICKET_PRIORITY = {
	CRITICAL: 'critical',
	HIGH: 'high',
	MEDIUM: 'medium',
	LOW: 'low'
} as const;

export const SUPPORT_ROLES = {
	SUPER_ADMIN: 'super_admin',
	MANAGER: 'manager',
	SENIOR_AGENT: 'senior_agent',
	AGENT: 'agent',
	VIEWER: 'viewer'
} as const;

export const CUSTOMER_TYPES = {
	INDIVIDUAL: 'individual',
	BUSINESS: 'business',
	ENTERPRISE: 'enterprise'
} as const;

// Type definitions
export type SupportTicket = typeof supportTickets.$inferSelect;
export type SupportCustomer = typeof supportCustomers.$inferSelect;
export type KnowledgeArticle = typeof knowledgeArticles.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type SupportCategory = typeof supportCategories.$inferSelect;
export type SupportTeamMember = typeof supportTeamMembers.$inferSelect;
export type TicketActivityLog = typeof ticketActivityLog.$inferSelect;

// Insert types
export type NewSupportTicket = typeof supportTickets.$inferInsert;
export type NewSupportCustomer = typeof supportCustomers.$inferInsert;
export type NewKnowledgeArticle = typeof knowledgeArticles.$inferInsert;
export type NewTicketMessage = typeof ticketMessages.$inferInsert;
export type NewSupportCategory = typeof supportCategories.$inferInsert;
export type NewSupportTeamMember = typeof supportTeamMembers.$inferInsert;
export type NewTicketActivityLog = typeof ticketActivityLog.$inferInsert;
