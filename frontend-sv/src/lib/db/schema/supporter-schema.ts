import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, decimal } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth-schema";

// Supporters table - External consultants, mentors, advisors
export const supporters = pgTable("supporters", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),

	// Profile data stored as JSONB for flexibility
	profileData: jsonb("profile_data").notNull(),

	// Verification status
	verificationStatus: text("verification_status").$default("pending").notNull(), // pending, verified, rejected

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	verifiedAt: timestamp("verified_at")
});

// Services table - What supporters offer
export const services = pgTable("services", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	supporterId: text("supporter_id").references(() => supporters.id, { onDelete: "cascade" }).notNull(),

	// Service details
	title: text("title").notNull(),
	description: text("description"),
	category: text("category").notNull(), // business_strategy, technical, marketing_sales, legal_finance, operations, mentoring
	subcategory: text("subcategory"),

	// Pricing structure
	pricing: jsonb("pricing").notNull(), // { type: 'hourly'|'project'|'retainer', amount: number, currency: string }

	// Availability and scheduling
	availability: jsonb("availability"), // { workingHours: {}, timezone: string, responseTime: number }

	// Service status
	status: text("status").$default("active").notNull(), // active, inactive, draft

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull()
});

// Engagements table - Client relationships and projects
export const engagements = pgTable("engagements", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	serviceId: text("service_id").references(() => services.id, { onDelete: "cascade" }).notNull(),
	startupId: text("startup_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
	supporterId: text("supporter_id").references(() => supporters.id, { onDelete: "cascade" }).notNull(),

	// Engagement status
	status: text("status").$default("proposed").notNull(), // proposed, negotiating, active, completed, cancelled

	// Proposal and contract data
	proposalData: jsonb("proposal_data"), // Scope, deliverables, timeline, milestones
	contractData: jsonb("contract_data"), // Terms, conditions, payment schedule

	// Payment status
	paymentStatus: text("payment_status").$default("pending").notNull(), // pending, partial, completed, disputed

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	startedAt: timestamp("started_at"),
	completedAt: timestamp("completed_at")
});

// Reviews and ratings table
export const supporterReviews = pgTable("supporter_reviews", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	engagementId: text("engagement_id").references(() => engagements.id, { onDelete: "cascade" }).notNull(),
	reviewerId: text("reviewer_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
	supporterId: text("supporter_id").references(() => supporters.id, { onDelete: "cascade" }).notNull(),

	// Rating components
	overallRating: integer("overall_rating").notNull(), // 1-5 stars
	expertiseRating: integer("expertise_rating"),
	communicationRating: integer("communication_rating"),
	valueRating: integer("value_rating"),
	timelinessRating: integer("timeliness_rating"),
	resultsRating: integer("results_rating"),

	// Review content
	reviewText: text("review_text"),
	highlights: jsonb("highlights").$defaultFn(() => []), // Array of highlight strings
	areasForImprovement: jsonb("areas_for_improvement").$defaultFn(() => []), // Array of improvement areas

	// Metrics
	projectSuccess: boolean("project_success"),
	onTimeDelivery: boolean("on_time_delivery"),
	withinBudget: boolean("within_budget"),
	exceededExpectations: boolean("exceeded_expectations"),
	wouldRecommend: boolean("would_recommend"),

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull()
});

// Messages table for communication
export const engagementMessages = pgTable("engagement_messages", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	engagementId: text("engagement_id").references(() => engagements.id, { onDelete: "cascade" }).notNull(),
	senderId: text("sender_id").references(() => user.id, { onDelete: "cascade" }).notNull(),

	// Message content
	messageType: text("message_type").$default("text").notNull(), // text, file, proposal, contract
	content: text("content"),
	attachments: jsonb("attachments").$defaultFn(() => []), // Array of file references

	// Message status
	isRead: boolean("is_read").$defaultFn(() => false).notNull(),
	readAt: timestamp("read_at"),

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull()
});

// Payments table
export const payments = pgTable("payments", {
	id: text("id").primaryKey().$defaultFn(() => createId()),
	engagementId: text("engagement_id").references(() => engagements.id, { onDelete: "cascade" }).notNull(),

	// Payment details
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	currency: text("currency").$default("USD").notNull(),
	paymentMethod: text("payment_method").notNull(), // credit_card, bank_transfer, digital_wallet

	// Payment status
	status: text("status").$default("pending").notNull(), // pending, processing, completed, failed, refunded

	// Transaction details
	transactionId: text("transaction_id"),
	gatewayResponse: jsonb("gateway_response"),

	// Timestamps
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
	completedAt: timestamp("completed_at")
});

// Types for TypeScript
export interface Supporter {
	id: string;
	userId: string;
	profileData: SupporterProfileData;
	verificationStatus: 'pending' | 'verified' | 'rejected';
	createdAt: Date;
	updatedAt: Date;
	verifiedAt?: Date;
}

export interface SupporterProfileData {
	personalInfo: {
		name: string;
		title: string;
		bio: string;
		avatar?: string;
		location: string;
		languages: string[];
	};
	expertise: {
		primaryCategories: string[];
		skills: string[];
		experience: number; // years
		certifications: string[];
	};
	services: {
		serviceTypes: string[];
		pricing: PricingStructure;
		availability: AvailabilitySchedule;
	};
	portfolio: {
		caseStudies: CaseStudy[];
		testimonials: Testimonial[];
		successMetrics: SuccessMetric[];
	};
	credentials: {
		education: Education[];
		workHistory: WorkExperience[];
		achievements: Achievement[];
	};
	preferences: {
		startupStages: string[];
		industries: string[];
		engagementTypes: string[];
		responseTime: number; // hours
	};
}

export interface Service {
	id: string;
	supporterId: string;
	title: string;
	description?: string;
	category: string;
	subcategory?: string;
	pricing: PricingStructure;
	availability?: AvailabilitySchedule;
	status: 'active' | 'inactive' | 'draft';
	createdAt: Date;
	updatedAt: Date;
}

export interface Engagement {
	id: string;
	serviceId: string;
	startupId: string;
	supporterId: string;
	status: 'proposed' | 'negotiating' | 'active' | 'completed' | 'cancelled';
	proposalData?: ProposalData;
	contractData?: ContractData;
	paymentStatus: 'pending' | 'partial' | 'completed' | 'disputed';
	createdAt: Date;
	updatedAt: Date;
	startedAt?: Date;
	completedAt?: Date;
}

export interface SupporterReview {
	id: string;
	engagementId: string;
	reviewerId: string;
	supporterId: string;
	overallRating: number;
	expertiseRating?: number;
	communicationRating?: number;
	valueRating?: number;
	timelinessRating?: number;
	resultsRating?: number;
	reviewText?: string;
	highlights: string[];
	areasForImprovement: string[];
	projectSuccess?: boolean;
	onTimeDelivery?: boolean;
	withinBudget?: boolean;
	exceededExpectations?: boolean;
	wouldRecommend?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface EngagementMessage {
	id: string;
	engagementId: string;
	senderId: string;
	messageType: 'text' | 'file' | 'proposal' | 'contract';
	content?: string;
	attachments: string[];
	isRead: boolean;
	readAt?: Date;
	createdAt: Date;
}

export interface Payment {
	id: string;
	engagementId: string;
	amount: number;
	currency: string;
	paymentMethod: string;
	status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
	transactionId?: string;
	gatewayResponse?: any;
	createdAt: Date;
	updatedAt: Date;
	completedAt?: Date;
}

// Supporting interfaces
export interface PricingStructure {
	type: 'hourly' | 'project' | 'retainer';
	amount: number;
	currency: string;
	details?: string;
}

export interface AvailabilitySchedule {
	workingHours: Record<string, { start: string; end: string }>;
	timezone: string;
	responseTime: number; // hours
}

export interface CaseStudy {
	title: string;
	description: string;
	results: string;
	clientIndustry: string;
	projectValue?: number;
}

export interface Testimonial {
	clientName: string;
	clientTitle: string;
	clientCompany: string;
	content: string;
	rating: number;
}

export interface SuccessMetric {
	metric: string;
	value: string;
	description: string;
}

export interface Education {
	institution: string;
	degree: string;
	field: string;
	graduationYear: number;
}

export interface WorkExperience {
	company: string;
	title: string;
	startDate: string;
	endDate?: string;
	description: string;
}

export interface Achievement {
	title: string;
	description: string;
	year: number;
	issuer?: string;
}

export interface ProposalData {
	scope: string[];
	deliverables: string[];
	timeline: {
		startDate: string;
		endDate: string;
		milestones: Milestone[];
	};
}

export interface ContractData {
	terms: string[];
	paymentSchedule: PaymentSchedule[];
	cancellationPolicy: string;
	confidentialityTerms: string;
}

export interface Milestone {
	title: string;
	description: string;
	dueDate: string;
	deliverable: string;
}

export interface PaymentSchedule {
	amount: number;
	dueDate: string;
	trigger: string; // milestone, date, etc.
}

// New supporter types for database operations
export interface NewSupporter {
	userId: string;
	profileData: SupporterProfileData;
	verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface NewService {
	supporterId: string;
	title: string;
	description?: string;
	category: string;
	subcategory?: string;
	pricing: PricingStructure;
	availability?: AvailabilitySchedule;
	status?: 'active' | 'inactive' | 'draft';
}

export interface NewEngagement {
	serviceId: string;
	startupId: string;
	supporterId: string;
	status?: 'proposed' | 'negotiating' | 'active' | 'completed' | 'cancelled';
	proposalData?: ProposalData;
	contractData?: ContractData;
	paymentStatus?: 'pending' | 'partial' | 'completed' | 'disputed';
}

export interface NewSupporterReview {
	engagementId: string;
	reviewerId: string;
	supporterId: string;
	overallRating: number;
	expertiseRating?: number;
	communicationRating?: number;
	valueRating?: number;
	timelinessRating?: number;
	resultsRating?: number;
	reviewText?: string;
	highlights?: string[];
	areasForImprovement?: string[];
	projectSuccess?: boolean;
	onTimeDelivery?: boolean;
	withinBudget?: boolean;
	exceededExpectations?: boolean;
	wouldRecommend?: boolean;
}

export interface NewEngagementMessage {
	engagementId: string;
	senderId: string;
	messageType: 'text' | 'file' | 'proposal' | 'contract';
	content?: string;
	attachments?: string[];
}

export interface NewPayment {
	engagementId: string;
	amount: number;
	currency?: string;
	paymentMethod: string;
	status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
	transactionId?: string;
	gatewayResponse?: any;
}
