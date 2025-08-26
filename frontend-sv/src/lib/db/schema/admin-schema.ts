import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	jsonb,
	uuid,
	varchar,
	serial
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth-schema";

// Admin session tracking
const adminSession = pgTable("admin_session", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
	sessionToken: text("session_token").notNull().unique(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	expires: timestamp("expires").notNull(),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	lastActivity: timestamp("last_activity").$defaultFn(() => new Date()).notNull(),
});

// Audit log for tracking all administrative actions
const auditLog = pgTable("audit_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	action: varchar("action", { length: 100 }).notNull(), // e.g., "user_created", "user_deleted", "settings_updated"
	entityType: varchar("entity_type", { length: 50 }).notNull(), // e.g., "user", "startup", "investment"
	entityId: text("entity_id"), // ID of the affected entity
	oldValues: jsonb("old_values"), // Previous state (for updates)
	newValues: jsonb("new_values"), // New state (for creates/updates)
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	timestamp: timestamp("timestamp").$defaultFn(() => new Date()).notNull(),
	metadata: jsonb("metadata"), // Additional context
});

// System configuration settings
const systemConfig = pgTable("system_config", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	key: varchar("key", { length: 100 }).notNull().unique(),
	value: jsonb("value").notNull(),
	description: text("description"),
	category: varchar("category", { length: 50 }).notNull(), // e.g., "platform", "email", "security"
	isPublic: boolean("is_public").$defaultFn(() => false).notNull(),
	updatedBy: text("updated_by").references(() => user.id),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

// Feature flags for controlling feature availability
const featureFlag = pgTable("feature_flag", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	name: varchar("name", { length: 100 }).notNull().unique(),
	key: varchar("key", { length: 100 }).notNull().unique(),
	description: text("description"),
	enabled: boolean("enabled").$defaultFn(() => false).notNull(),
	rolloutPercentage: integer("rollout_percentage").$defaultFn(() => 0).notNull(), // 0-100
	conditions: jsonb("conditions"), // User/role targeting rules
	createdBy: text("created_by").references(() => user.id),
	updatedBy: text("updated_by").references(() => user.id),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

// Admin user permissions and roles
const adminPermission = pgTable("admin_permission", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
	permission: varchar("permission", { length: 100 }).notNull(), // e.g., "user.manage", "content.approve"
	resource: varchar("resource", { length: 100 }), // e.g., "users", "startups"
	resourceId: text("resource_id"), // Specific resource ID or null for all
	grantedBy: text("granted_by").references(() => user.id),
	grantedAt: timestamp("granted_at").$defaultFn(() => new Date()).notNull(),
	expiresAt: timestamp("expires_at"),
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
});

// Security events and alerts
const securityEvent = pgTable("security_event", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	type: varchar("type", { length: 50 }).notNull(), // e.g., "failed_login", "suspicious_activity"
	severity: varchar("severity", { length: 20 }).notNull(), // "low", "medium", "high", "critical"
	message: text("message").notNull(),
	details: jsonb("details"), // Additional event data
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	resolved: boolean("resolved").$defaultFn(() => false).notNull(),
	resolvedBy: text("resolved_by").references(() => user.id),
	resolvedAt: timestamp("resolved_at"),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

// Email templates for system notifications
const emailTemplate = pgTable("email_template", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	name: varchar("name", { length: 100 }).notNull().unique(),
	subject: varchar("subject", { length: 200 }).notNull(),
	body: text("body").notNull(),
	variables: jsonb("variables"), // Available template variables
	category: varchar("category", { length: 50 }).notNull(), // e.g., "welcome", "notification", "alert"
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
	createdBy: text("created_by").references(() => user.id),
	updatedBy: text("updated_by").references(() => user.id),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

// Platform analytics and metrics storage
const platformMetric = pgTable("platform_metric", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	name: varchar("name", { length: 100 }).notNull(),
	value: integer("value").notNull(),
	category: varchar("category", { length: 50 }).notNull(), // e.g., "users", "startups", "investments"
	metadata: jsonb("metadata"),
	recordedAt: timestamp("recorded_at").$defaultFn(() => new Date()).notNull(),
});

// Content moderation queue
const contentModeration = pgTable("content_moderation", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	contentType: varchar("content_type", { length: 50 }).notNull(), // e.g., "startup", "investment", "document"
	contentId: text("content_id").notNull(),
	status: varchar("status", { length: 20 }).notNull(), // "pending", "approved", "rejected", "flagged"
	reason: text("reason"), // Reason for rejection/flag
	flaggedBy: varchar("flagged_by", { length: 50 }), // "user", "system", "admin"
	reviewedBy: text("reviewed_by").references(() => user.id),
	reviewedAt: timestamp("reviewed_at"),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});

// Export all admin-related tables
export {
	adminSession,
	auditLog,
	systemConfig,
	featureFlag,
	adminPermission,
	securityEvent,
	emailTemplate,
	platformMetric,
	contentModeration
};
