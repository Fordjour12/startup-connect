import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	decimal,
	jsonb,
	pgEnum,
	check
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

// =============================================================================
// SUPPORTER SCHEMA - Database tables for supporter marketplace functionality
// =============================================================================

// Enums
export const serviceCategoryEnum = pgEnum('service_category', [
	'business_strategy',
	'technical',
	'marketing_sales',
	'legal_finance',
	'operations',
	'mentoring',
	'other'
]);

export const servicePricingTypeEnum = pgEnum('service_pricing_type', [
	'hourly',
	'project',
	'retainer',
	'equity',
	'free'
]);

export const bookingStatusEnum = pgEnum('booking_status', [
	'pending',
	'confirmed',
	'in_progress',
	'completed',
	'cancelled',
	'disputed'
]);

export const communicationTypeEnum = pgEnum('communication_type', [
	'text',
	'file',
	'system',
	'booking_request',
	'booking_confirmation',
	'booking_cancellation'
]);

// Supporter profiles table
export const supporterProfile = pgTable("supporter_profile", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),

	// Professional information
	title: text("title"), // e.g., "Senior Business Consultant"
	company: text("company"),
	yearsExperience: integer("years_experience"),
	hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),

	// Verification and credentials
	isVerified: boolean("is_verified").$defaultFn(() => false).notNull(),
	verificationDocuments: jsonb("verification_documents").$type<{
		certifications?: string[];
		portfolio?: string[];
		references?: string[];
		backgroundCheck?: boolean;
	}>(),

	// Availability and preferences
	availability: jsonb("availability").$type<{
		timezone: string;
		availableHours: {
			monday?: { start: string; end: string }[];
			tuesday?: { start: string; end: string }[];
			wednesday?: { start: string; end: string }[];
			thursday?: { start: string; end: string }[];
			friday?: { start: string; end: string }[];
			saturday?: { start: string; end: string }[];
			sunday?: { start: string; end: string }[];
		};
		maxConcurrentProjects: number;
		responseTimeHours: integer;
	}>(),

	// Specializations and expertise
	specializations: jsonb("specializations").$type<{
		industries: string[];
		skills: string[];
		certifications: string[];
		languages: string[];
		serviceTypes: string[];
	}>(),

	// Performance metrics
	rating: decimal("rating", { precision: 3, scale: 2 }).$defaultFn(() => "0.00"),
	totalReviews: integer("total_reviews").$defaultFn(() => 0),
	completedProjects: integer("completed_projects").$defaultFn(() => 0),
	responseRate: decimal("response_rate", { precision: 5, scale: 2 }).$defaultFn(() => "0.00"),

	// Profile status
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
	isPublic: boolean("is_public").$defaultFn(() => true).notNull(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});

// Services table
export const service = pgTable("service", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	supporterId: text("supporter_id")
		.notNull()
		.references(() => supporterProfile.id, { onDelete: "cascade" }),

	// Service details
	title: text("title").notNull(),
	description: text("description").notNull(),
	category: serviceCategoryEnum("category").notNull(),
	subcategory: text("subcategory"),

	// Pricing
	pricingType: servicePricingTypeEnum("pricing_type").notNull(),
	priceAmount: decimal("price_amount", { precision: 10, scale: 2 }),
	priceCurrency: text("price_currency").$defaultFn(() => "USD"),

	// Service details
	deliverables: jsonb("deliverables").$type<string[]>(),
	duration: text("duration"), // e.g., "2-4 weeks", "1 hour session"
	requirements: text("requirements"),

	// Service status
	isActive: boolean("is_active").$defaultFn(() => true).notNull(),
	isFeatured: boolean("is_featured").$defaultFn(() => false).notNull(),

	// Metrics
	views: integer("views").$defaultFn(() => 0),
	inquiries: integer("inquiries").$defaultFn(() => 0),
	bookings: integer("bookings").$defaultFn(() => 0),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});

// Bookings table
export const booking = pgTable("booking", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	serviceId: text("service_id")
		.notNull()
		.references(() => service.id, { onDelete: "cascade" }),
	supporterId: text("supporter_id")
		.notNull()
		.references(() => supporterProfile.id, { onDelete: "cascade" }),
	startupId: text("startup_id").notNull(), // Will reference startup table when created

	// Booking details
	title: text("title").notNull(),
	description: text("description"),
	status: bookingStatusEnum("status").$defaultFn(() => "pending").notNull(),

	// Scheduling
	scheduledStart: timestamp("scheduled_start"),
	scheduledEnd: timestamp("scheduled_end"),
	duration: integer("duration"), // in minutes

	// Pricing
	agreedPrice: decimal("agreed_price", { precision: 10, scale: 2 }),
	currency: text("currency").$defaultFn(() => "USD"),

	// Communication
	startupNotes: text("startup_notes"),
	supporterNotes: text("supporter_notes"),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});

// Communications table
export const communication = pgTable("communication", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	bookingId: text("booking_id")
		.references(() => booking.id, { onDelete: "cascade" }),
	senderId: text("sender_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	recipientId: text("recipient_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	// Message content
	type: communicationTypeEnum("type").notNull(),
	subject: text("subject"),
	content: text("content"),
	attachments: jsonb("attachments").$type<{
		filename: string;
		url: string;
		size: number;
		type: string;
	}[]>(),

	// Status
	isRead: boolean("is_read").$defaultFn(() => false).notNull(),
	readAt: timestamp("read_at"),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
});

// Reviews table
export const review = pgTable("review", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	bookingId: text("booking_id")
		.notNull()
		.references(() => booking.id, { onDelete: "cascade" }),
	reviewerId: text("reviewer_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	supporterId: text("supporter_id")
		.notNull()
		.references(() => supporterProfile.id, { onDelete: "cascade" }),

	// Review content
	rating: integer("rating").notNull(),
	title: text("title"),
	comment: text("comment"),

	// Review categories
	categories: jsonb("categories").$type<{
		communication: number;
		quality: number;
		timeliness: number;
		value: number;
	}>(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
});

// =============================================================================
// RELATIONS
// =============================================================================

export const supporterProfileRelations = relations(supporterProfile, ({ one, many }) => ({
	user: one(user, {
		fields: [supporterProfile.userId],
		references: [user.id],
	}),
	services: many(service),
	bookings: many(booking),
	reviews: many(review),
}));

export const serviceRelations = relations(service, ({ one, many }) => ({
	supporter: one(supporterProfile, {
		fields: [service.supporterId],
		references: [supporterProfile.id],
	}),
	bookings: many(booking),
}));

export const bookingRelations = relations(booking, ({ one, many }) => ({
	service: one(service, {
		fields: [booking.serviceId],
		references: [service.id],
	}),
	supporter: one(supporterProfile, {
		fields: [booking.supporterId],
		references: [supporterProfile.id],
	}),
	communications: many(communication),
	reviews: many(review),
}));

export const communicationRelations = relations(communication, ({ one }) => ({
	booking: one(booking, {
		fields: [communication.bookingId],
		references: [booking.id],
	}),
	sender: one(user, {
		fields: [communication.senderId],
		references: [user.id],
	}),
	recipient: one(user, {
		fields: [communication.recipientId],
		references: [user.id],
	}),
}));

export const reviewRelations = relations(review, ({ one }) => ({
	booking: one(booking, {
		fields: [review.bookingId],
		references: [booking.id],
	}),
	reviewer: one(user, {
		fields: [review.reviewerId],
		references: [user.id],
	}),
	supporter: one(supporterProfile, {
		fields: [review.supporterId],
		references: [supporterProfile.id],
	}),
}));

// =============================================================================
// TYPES
// =============================================================================

export interface SupporterProfileData {
	id: string;
	userId: string;
	title?: string;
	company?: string;
	yearsExperience?: number;
	hourlyRate?: string;
	isVerified: boolean;
	verificationDocuments?: {
		certifications?: string[];
		portfolio?: string[];
		references?: string[];
		backgroundCheck?: boolean;
	};
	availability?: {
		timezone: string;
		availableHours: {
			monday?: { start: string; end: string }[];
			tuesday?: { start: string; end: string }[];
			wednesday?: { start: string; end: string }[];
			thursday?: { start: string; end: string }[];
			friday?: { start: string; end: string }[];
			saturday?: { start: string; end: string }[];
			sunday?: { start: string; end: string }[];
		};
		maxConcurrentProjects: number;
		responseTimeHours: number;
	};
	specializations?: {
		industries: string[];
		skills: string[];
		certifications: string[];
		languages: string[];
		serviceTypes: string[];
	};
	rating: string;
	totalReviews: number;
	completedProjects: number;
	responseRate: string;
	isActive: boolean;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ServiceData {
	id: string;
	supporterId: string;
	title: string;
	description: string;
	category: string;
	subcategory?: string;
	pricingType: string;
	priceAmount?: string;
	priceCurrency: string;
	deliverables?: string[];
	duration?: string;
	requirements?: string;
	isActive: boolean;
	isFeatured: boolean;
	views: number;
	inquiries: number;
	bookings: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface BookingData {
	id: string;
	serviceId: string;
	supporterId: string;
	startupId: string;
	title: string;
	description?: string;
	status: string;
	scheduledStart?: Date;
	scheduledEnd?: Date;
	duration?: number;
	agreedPrice?: string;
	currency: string;
	startupNotes?: string;
	supporterNotes?: string;
	createdAt: Date;
	updatedAt: Date;
}