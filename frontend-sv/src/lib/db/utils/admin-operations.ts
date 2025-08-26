import { db } from '../index';
import {
	auditLog,
	adminSession,
	systemConfig,
	featureFlag,
	adminPermission,
	securityEvent,
	emailTemplate,
	platformMetric,
	contentModeration
} from '../schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

// Audit Log Operations
export const auditLogOperations = {
	// Create audit log entry
	create: async (data: {
		userId?: string;
		action: string;
		entityType: string;
		entityId?: string;
		oldValues?: any;
		newValues?: any;
		ipAddress?: string;
		userAgent?: string;
		metadata?: any;
	}) => {
		return await db.insert(auditLog).values({
			userId: data.userId,
			action: data.action,
			entityType: data.entityType,
			entityId: data.entityId,
			oldValues: data.oldValues,
			newValues: data.newValues,
			ipAddress: data.ipAddress,
			userAgent: data.userAgent,
			metadata: data.metadata,
		}).returning();
	},

	// Get audit logs with pagination
	getLogs: async (options: {
		limit?: number;
		offset?: number;
		userId?: string;
		action?: string;
		entityType?: string;
		startDate?: Date;
		endDate?: Date;
	} = {}) => {
		const conditions = [];

		if (options.userId) conditions.push(eq(auditLog.userId, options.userId));
		if (options.action) conditions.push(eq(auditLog.action, options.action));
		if (options.entityType) conditions.push(eq(auditLog.entityType, options.entityType));
		if (options.startDate) conditions.push(gte(auditLog.timestamp, options.startDate));
		if (options.endDate) conditions.push(lte(auditLog.timestamp, options.endDate));

		return await db
			.select()
			.from(auditLog)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(auditLog.timestamp))
			.limit(options.limit || 50)
			.offset(options.offset || 0);
	},
};

// System Configuration Operations
export const systemConfigOperations = {
	// Get configuration value
	get: async (key: string) => {
		const result = await db
			.select()
			.from(systemConfig)
			.where(eq(systemConfig.key, key))
			.limit(1);

		return result[0] || null;
	},

	// Set configuration value
	set: async (key: string, value: any, updatedBy?: string, description?: string, category?: string) => {
		const existing = await systemConfigOperations.get(key);

		if (existing) {
			return await db
				.update(systemConfig)
				.set({
					value,
					description: description || existing.description,
					category: category || existing.category,
					updatedBy,
					updatedAt: new Date(),
				})
				.where(eq(systemConfig.key, key))
				.returning();
		} else {
			return await db.insert(systemConfig).values({
				key,
				value,
				description,
				category: category || 'general',
				updatedBy,
			}).returning();
		}
	},

	// Get all configuration by category
	getByCategory: async (category: string) => {
		return await db
			.select()
			.from(systemConfig)
			.where(eq(systemConfig.category, category));
	},
};

// Feature Flag Operations
export const featureFlagOperations = {
	// Check if feature is enabled for user
	isEnabled: async (key: string, userId?: string): Promise<boolean> => {
		const flag = await db
			.select()
			.from(featureFlag)
			.where(eq(featureFlag.key, key))
			.limit(1);

		if (!flag[0]) return false;

		// If not enabled globally, return false
		if (!flag[0].enabled) return false;

		// If rollout is 100%, return true
		if (flag[0].rolloutPercentage >= 100) return true;

		// TODO: Implement user-based rollout logic
		return Math.random() * 100 < flag[0].rolloutPercentage;
	},

	// Get all feature flags
	getAll: async () => {
		return await db.select().from(featureFlag).orderBy(featureFlag.name);
	},

	// Update feature flag
	update: async (key: string, updates: Partial<typeof featureFlag.$inferInsert>, updatedBy?: string) => {
		return await db
			.update(featureFlag)
			.set({
				...updates,
				updatedBy,
				updatedAt: new Date(),
			})
			.where(eq(featureFlag.key, key))
			.returning();
	},
};

// Security Event Operations
export const securityEventOperations = {
	// Create security event
	create: async (data: {
		type: string;
		severity: string;
		message: string;
		details?: any;
		userId?: string;
		ipAddress?: string;
		userAgent?: string;
	}) => {
		return await db.insert(securityEvent).values(data).returning();
	},

	// Get security events
	getEvents: async (options: {
		limit?: number;
		resolved?: boolean;
		severity?: string;
		type?: string;
	} = {}) => {
		const conditions = [];

		if (options.resolved !== undefined) {
			conditions.push(eq(securityEvent.resolved, options.resolved));
		}
		if (options.severity) {
			conditions.push(eq(securityEvent.severity, options.severity));
		}
		if (options.type) {
			conditions.push(eq(securityEvent.type, options.type));
		}

		return await db
			.select()
			.from(securityEvent)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(securityEvent.createdAt))
			.limit(options.limit || 50);
	},

	// Mark event as resolved
	resolve: async (eventId: string, resolvedBy: string) => {
		return await db
			.update(securityEvent)
			.set({
				resolved: true,
				resolvedBy,
				resolvedAt: new Date(),
			})
			.where(eq(securityEvent.id, eventId))
			.returning();
	},
};

// Platform Metrics Operations
export const platformMetricsOperations = {
	// Record metric
	record: async (data: {
		name: string;
		value: number;
		category: string;
		metadata?: any;
	}) => {
		return await db.insert(platformMetric).values({
			...data,
			recordedAt: new Date(),
		}).returning();
	},

	// Get metrics by category and date range
	getMetrics: async (category: string, startDate?: Date, endDate?: Date) => {
		const conditions = [eq(platformMetric.category, category)];

		if (startDate) conditions.push(gte(platformMetric.recordedAt, startDate));
		if (endDate) conditions.push(lte(platformMetric.recordedAt, endDate));

		return await db
			.select()
			.from(platformMetric)
			.where(and(...conditions))
			.orderBy(desc(platformMetric.recordedAt));
	},

	// Get latest metric value
	getLatest: async (name: string) => {
		const result = await db
			.select()
			.from(platformMetric)
			.where(eq(platformMetric.name, name))
			.orderBy(desc(platformMetric.recordedAt))
			.limit(1);

		return result[0] || null;
	},
};

// Content Moderation Operations
export const contentModerationOperations = {
	// Add to moderation queue
	addToQueue: async (data: {
		contentType: string;
		contentId: string;
		status?: string;
		reason?: string;
		flaggedBy?: string;
	}) => {
		return await db.insert(contentModeration).values({
			...data,
			status: data.status || 'pending',
		}).returning();
	},

	// Get moderation queue
	getQueue: async (status?: string) => {
		const conditions = [];
		if (status) conditions.push(eq(contentModeration.status, status));

		return await db
			.select()
			.from(contentModeration)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(contentModeration.createdAt));
	},

	// Update moderation status
	updateStatus: async (id: string, status: string, reviewedBy: string, reason?: string) => {
		return await db
			.update(contentModeration)
			.set({
				status,
				reason,
				reviewedBy,
				reviewedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(contentModeration.id, id))
			.returning();
	},
};

// Admin Session Operations
export const adminSessionOperations = {
	// Create admin session
	create: async (data: {
		userId: string;
		sessionToken: string;
		ipAddress?: string;
		userAgent?: string;
		expires: Date;
	}) => {
		return await db.insert(adminSession).values({
			...data,
			lastActivity: new Date(),
		}).returning();
	},

	// Get session by token
	getByToken: async (token: string) => {
		return await db
			.select()
			.from(adminSession)
			.where(eq(adminSession.sessionToken, token))
			.limit(1);
	},

	// Update last activity
	updateActivity: async (sessionId: string) => {
		return await db
			.update(adminSession)
			.set({ lastActivity: new Date() })
			.where(eq(adminSession.id, sessionId))
			.returning();
	},
};

// Admin Permission Operations
export const adminPermissionOperations = {
	// Check if user has permission
	hasPermission: async (userId: string, permission: string, resource?: string): Promise<boolean> => {
		const conditions = [
			eq(adminPermission.userId, userId),
			eq(adminPermission.permission, permission),
			eq(adminPermission.isActive, true),
		];

		if (resource) {
			conditions.push(eq(adminPermission.resource, resource));
		}

		const result = await db
			.select()
			.from(adminPermission)
			.where(and(...conditions))
			.limit(1);

		return result.length > 0;
	},

	// Grant permission
	grant: async (data: {
		userId: string;
		permission: string;
		resource?: string;
		resourceId?: string;
		grantedBy: string;
		expiresAt?: Date;
	}) => {
		return await db.insert(adminPermission).values(data).returning();
	},

	// Revoke permission
	revoke: async (userId: string, permission: string, resource?: string) => {
		const conditions = [
			eq(adminPermission.userId, userId),
			eq(adminPermission.permission, permission),
		];

		if (resource) {
			conditions.push(eq(adminPermission.resource, resource));
		}

		return await db
			.update(adminPermission)
			.set({ isActive: false })
			.where(and(...conditions))
			.returning();
	},
};
