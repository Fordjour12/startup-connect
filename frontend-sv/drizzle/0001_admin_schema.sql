-- Admin schema migration
-- This file contains all the database tables needed for the admin dashboard

-- Admin session tracking table
CREATE TABLE "admin_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"last_activity" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_session_session_token_unique" ON "admin_session"("session_token");
--> statement-breakpoint

-- Audit log table for tracking administrative actions
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" text,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- System configuration settings table
CREATE TABLE "system_config" (
	"id" text PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "system_config_key_unique" ON "system_config"("key");
--> statement-breakpoint

-- Feature flags table for controlling feature availability
CREATE TABLE "feature_flag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"key" varchar(100) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"rollout_percentage" integer DEFAULT 0 NOT NULL,
	"conditions" jsonb,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feature_flag" ADD CONSTRAINT "feature_flag_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "feature_flag" ADD CONSTRAINT "feature_flag_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "feature_flag_name_unique" ON "feature_flag"("name");
--> statement-breakpoint
CREATE UNIQUE INDEX "feature_flag_key_unique" ON "feature_flag"("key");
--> statement-breakpoint

-- Admin permissions table
CREATE TABLE "admin_permission" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"permission" varchar(100) NOT NULL,
	"resource" varchar(100),
	"resource_id" text,
	"granted_by" text,
	"granted_at" timestamp NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_permission" ADD CONSTRAINT "admin_permission_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_permission" ADD CONSTRAINT "admin_permission_granted_by_user_id_fk" FOREIGN KEY ("granted_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint

-- Security events table
CREATE TABLE "security_event" (
	"id" text PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"details" jsonb,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "security_event" ADD CONSTRAINT "security_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "security_event" ADD CONSTRAINT "security_event_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint

-- Email templates table
CREATE TABLE "email_template" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"variables" jsonb,
	"category" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_template" ADD CONSTRAINT "email_template_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "email_template" ADD CONSTRAINT "email_template_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "email_template_name_unique" ON "email_template"("name");
--> statement-breakpoint

-- Platform metrics table
CREATE TABLE "platform_metric" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"value" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"metadata" jsonb,
	"recorded_at" timestamp NOT NULL
);
--> statement-breakpoint

-- Content moderation table
CREATE TABLE "content_moderation" (
	"id" text PRIMARY KEY NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_id" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"reason" text,
	"flagged_by" varchar(50),
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_moderation" ADD CONSTRAINT "content_moderation_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint

-- Insert default system configuration values
INSERT INTO "system_config" ("id", "key", "value", "description", "category", "is_public", "created_at", "updated_at") VALUES
('platform-name', 'platform.name', '"StartupConnect"', 'Platform display name', 'platform', true, NOW(), NOW()),
('platform-description', 'platform.description', '"Connecting startups with investors"', 'Platform description', 'platform', true, NOW(), NOW()),
('platform-contact-email', 'platform.contactEmail', '"admin@startupconnect.com"', 'Contact email address', 'platform', true, NOW(), NOW()),
('platform-maintenance-mode', 'platform.maintenanceMode', 'false', 'Whether platform is in maintenance mode', 'platform', true, NOW(), NOW()),
('platform-allow-registrations', 'platform.allowRegistrations', 'true', 'Whether new user registrations are allowed', 'platform', true, NOW(), NOW());

-- Insert default email configuration
INSERT INTO "system_config" ("id", "key", "value", "description", "category", "is_public", "created_at", "updated_at") VALUES
('email-smtp-host', 'email.smtpHost', '"smtp.gmail.com"', 'SMTP server hostname', 'email', false, NOW(), NOW()),
('email-smtp-port', 'email.smtpPort', '587', 'SMTP server port', 'email', false, NOW(), NOW()),
('email-smtp-user', 'email.smtpUser', '"noreply@startupconnect.com"', 'SMTP username', 'email', false, NOW(), NOW()),
('email-templates-enabled', 'email.emailTemplates', 'true', 'Whether to use custom email templates', 'email', false, NOW(), NOW()),
('email-notifications-enabled', 'email.notificationEmails', 'true', 'Whether to send notification emails', 'email', false, NOW(), NOW());

-- Insert default security configuration
INSERT INTO "system_config" ("id", "key", "value", "description", "category", "is_public", "created_at", "updated_at") VALUES
('security-two-factor', 'security.twoFactorRequired', 'false', 'Whether 2FA is required for all users', 'security', false, NOW(), NOW()),
('security-session-timeout', 'security.sessionTimeout', '30', 'Session timeout in minutes', 'security', false, NOW(), NOW()),
('security-password-length', 'security.passwordMinLength', '8', 'Minimum password length', 'security', false, NOW(), NOW()),
('security-strong-passwords', 'security.requireStrongPasswords', 'true', 'Whether to require strong passwords', 'security', false, NOW(), NOW());

-- Insert default feature flags
INSERT INTO "feature_flag" ("id", "name", "key", "description", "enabled", "rollout_percentage", "created_at", "updated_at") VALUES
('startup-approvals', 'Startup Approvals', 'startupApprovals', 'Require admin approval for new startups', true, 100, NOW(), NOW()),
('investment-tracking', 'Investment Tracking', 'investmentTracking', 'Track and monitor investments', true, 100, NOW(), NOW()),
('analytics-dashboard', 'Analytics Dashboard', 'analyticsDashboard', 'Show analytics to users', true, 100, NOW(), NOW()),
('messaging-system', 'Messaging System', 'messagingSystem', 'Enable user-to-user messaging', true, 100, NOW(), NOW());
