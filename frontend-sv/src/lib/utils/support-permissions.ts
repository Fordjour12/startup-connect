import { SUPPORT_ROLES } from '$lib/db/schema';

// Define permissions for each support role
export const SUPPORT_ROLE_PERMISSIONS = {
	[SUPPORT_ROLES.SUPER_ADMIN]: [
		// Full system access
		'tickets:read', 'tickets:create', 'tickets:update', 'tickets:delete', 'tickets:assign',
		'customers:read', 'customers:create', 'customers:update', 'customers:delete',
		'knowledge:read', 'knowledge:create', 'knowledge:update', 'knowledge:delete', 'knowledge:publish',
		'analytics:read', 'analytics:export',
		'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage',
		'settings:read', 'settings:update', 'settings:manage',
		'reports:read', 'reports:create', 'reports:export'
	],

	[SUPPORT_ROLES.MANAGER]: [
		// Team management and oversight
		'tickets:read', 'tickets:create', 'tickets:update', 'tickets:assign', 'tickets:reassign',
		'customers:read', 'customers:create', 'customers:update',
		'knowledge:read', 'knowledge:create', 'knowledge:update', 'knowledge:publish',
		'analytics:read', 'analytics:export',
		'users:read', 'users:update', // Can update team members
		'team:manage', 'team:performance',
		'reports:read', 'reports:create', 'reports:export',
		'sla:manage', 'sla:override'
	],

	[SUPPORT_ROLES.SENIOR_AGENT]: [
		// Advanced agent with mentoring capabilities
		'tickets:read', 'tickets:create', 'tickets:update', 'tickets:assign',
		'tickets:escalate', 'tickets:close', 'tickets:reopen',
		'customers:read', 'customers:create', 'customers:update',
		'knowledge:read', 'knowledge:create', 'knowledge:update',
		'analytics:read',
		'users:read', // Can view team members
		'mentoring:provide', 'quality:review',
		'reports:read'
	],

	[SUPPORT_ROLES.AGENT]: [
		// Standard agent permissions
		'tickets:read', 'tickets:create', 'tickets:update',
		'tickets:close', 'tickets:reopen',
		'customers:read', 'customers:create', 'customers:update',
		'knowledge:read', 'knowledge:create', 'knowledge:update',
		'analytics:read', // Limited to personal performance
		'reports:read'
	],

	[SUPPORT_ROLES.VIEWER]: [
		// Read-only access for training and monitoring
		'tickets:read',
		'customers:read',
		'knowledge:read',
		'analytics:read',
		'reports:read'
	]
};

// Role hierarchy for determining access levels
export const SUPPORT_ROLE_HIERARCHY = {
	[SUPPORT_ROLES.SUPER_ADMIN]: 100,
	[SUPPORT_ROLES.MANAGER]: 80,
	[SUPPORT_ROLES.SENIOR_AGENT]: 60,
	[SUPPORT_ROLES.AGENT]: 40,
	[SUPPORT_ROLES.VIEWER]: 10
};

// Ticket-specific permissions based on assignment and status
export const TICKET_PERMISSIONS = {
	// Who can view tickets
	VIEW_ANY: 'tickets:read',
	VIEW_OWN: 'tickets:read_own',
	VIEW_ASSIGNED: 'tickets:read_assigned',

	// Who can create tickets
	CREATE: 'tickets:create',

	// Who can update tickets
	UPDATE_ANY: 'tickets:update',
	UPDATE_OWN: 'tickets:update_own',
	UPDATE_ASSIGNED: 'tickets:update_assigned',

	// Who can assign tickets
	ASSIGN: 'tickets:assign',
	REASSIGN: 'tickets:reassign',

	// Status change permissions
	CLOSE: 'tickets:close',
	REOPEN: 'tickets:reopen',
	ESCALATE: 'tickets:escalate',

	// Who can delete tickets
	DELETE: 'tickets:delete'
};

export class SupportPermissionManager {
	private userRole: string;
	private userId?: string;
	private isAssignedToTicket?: boolean;
	private ticketOwnerId?: string;

	constructor(userRole: string, userId?: string) {
		this.userRole = userRole;
		this.userId = userId;
	}

	/**
	 * Check if the user has a specific permission
	 */
	hasPermission(permission: string): boolean {
		const rolePermissions = SUPPORT_ROLE_PERMISSIONS[this.userRole as keyof typeof SUPPORT_ROLE_PERMISSIONS];
		return rolePermissions?.includes(permission) || false;
	}

	/**
	 * Check if the user has any of the specified permissions
	 */
	hasAnyPermission(permissions: string[]): boolean {
		return permissions.some(permission => this.hasPermission(permission));
	}

	/**
	 * Check if the user has all of the specified permissions
	 */
	hasAllPermissions(permissions: string[]): boolean {
		return permissions.every(permission => this.hasPermission(permission));
	}

	/**
	 * Set ticket context for permission checking
	 */
	setTicketContext(assignedToId?: string, ticketOwnerId?: string): SupportPermissionManager {
		this.isAssignedToTicket = assignedToId === this.userId;
		this.ticketOwnerId = ticketOwnerId;
		return this;
	}

	/**
	 * Check if user can view a specific ticket
	 */
	canViewTicket(): boolean {
		// Super admins and managers can view all tickets
		if (this.hasPermission('tickets:read')) {
			return true;
		}

		// Agents can view tickets assigned to them
		if (this.hasPermission('tickets:read_assigned') && this.isAssignedToTicket) {
			return true;
		}

		// Users can view their own tickets (if customer)
		if (this.hasPermission('tickets:read_own') && this.ticketOwnerId === this.userId) {
			return true;
		}

		return false;
	}

	/**
	 * Check if user can update a specific ticket
	 */
	canUpdateTicket(): boolean {
		// Super admins and managers can update any ticket
		if (this.hasPermission('tickets:update')) {
			return true;
		}

		// Agents can update tickets assigned to them
		if (this.hasPermission('tickets:update_assigned') && this.isAssignedToTicket) {
			return true;
		}

		// Users can update their own tickets (limited fields)
		if (this.hasPermission('tickets:update_own') && this.ticketOwnerId === this.userId) {
			return true;
		}

		return false;
	}

	/**
	 * Check if user can assign tickets
	 */
	canAssignTickets(): boolean {
		return this.hasPermission('tickets:assign');
	}

	/**
	 * Check if user can reassign tickets
	 */
	canReassignTickets(): boolean {
		return this.hasPermission('tickets:reassign');
	}

	/**
	 * Check if user can close tickets
	 */
	canCloseTickets(): boolean {
		return this.hasPermission('tickets:close');
	}

	/**
	 * Check if user can reopen tickets
	 */
	canReopenTickets(): boolean {
		return this.hasPermission('tickets:reopen');
	}

	/**
	 * Check if user can escalate tickets
	 */
	canEscalateTickets(): boolean {
		return this.hasPermission('tickets:escalate');
	}

	/**
	 * Check if user can manage another user with the given role
	 */
	canManageRole(targetRole: string): boolean {
		const userLevel = SUPPORT_ROLE_HIERARCHY[this.userRole as keyof typeof SUPPORT_ROLE_HIERARCHY] || 0;
		const targetLevel = SUPPORT_ROLE_HIERARCHY[targetRole as keyof typeof SUPPORT_ROLE_HIERARCHY] || 0;

		// Super admins can manage anyone
		if (this.userRole === SUPPORT_ROLES.SUPER_ADMIN) {
			return true;
		}

		// Managers can manage agents and viewers, but not other managers or super admins
		if (this.userRole === SUPPORT_ROLES.MANAGER) {
			return targetLevel < userLevel && targetRole !== SUPPORT_ROLES.SUPER_ADMIN;
		}

		// Senior agents cannot manage others
		return false;
	}

	/**
	 * Get all permissions for the current user role
	 */
	getPermissions(): string[] {
		return SUPPORT_ROLE_PERMISSIONS[this.userRole as keyof typeof SUPPORT_ROLE_PERMISSIONS] || [];
	}

	/**
	 * Check if the user is an admin or manager
	 */
	isAdmin(): boolean {
		return [SUPPORT_ROLES.SUPER_ADMIN, SUPPORT_ROLES.MANAGER].includes(this.userRole);
	}

	/**
	 * Check if the user is a super admin
	 */
	isSuperAdmin(): boolean {
		return this.userRole === SUPPORT_ROLES.SUPER_ADMIN;
	}

	/**
	 * Check if the user is a manager
	 */
	isManager(): boolean {
		return this.userRole === SUPPORT_ROLES.MANAGER;
	}

	/**
	 * Check if the user is an agent (any level)
	 */
	isAgent(): boolean {
		return [SUPPORT_ROLES.SENIOR_AGENT, SUPPORT_ROLES.AGENT].includes(this.userRole);
	}

	/**
	 * Check if the user is a senior agent
	 */
	isSeniorAgent(): boolean {
		return this.userRole === SUPPORT_ROLES.SENIOR_AGENT;
	}
}

/**
 * Create a support permission manager for a user role
 */
export function createSupportPermissionManager(userRole: string, userId?: string): SupportPermissionManager {
	return new SupportPermissionManager(userRole, userId);
}

/**
 * Common permission checks for support system
 */
export const SUPPORT_PERMISSIONS = {
	// Tickets
	TICKETS_READ: 'tickets:read',
	TICKETS_CREATE: 'tickets:create',
	TICKETS_UPDATE: 'tickets:update',
	TICKETS_DELETE: 'tickets:delete',
	TICKETS_ASSIGN: 'tickets:assign',
	TICKETS_CLOSE: 'tickets:close',
	TICKETS_REOPEN: 'tickets:reopen',
	TICKETS_ESCALATE: 'tickets:escalate',

	// Customers
	CUSTOMERS_READ: 'customers:read',
	CUSTOMERS_CREATE: 'customers:create',
	CUSTOMERS_UPDATE: 'customers:update',
	CUSTOMERS_DELETE: 'customers:delete',

	// Knowledge Base
	KNOWLEDGE_READ: 'knowledge:read',
	KNOWLEDGE_CREATE: 'knowledge:create',
	KNOWLEDGE_UPDATE: 'knowledge:update',
	KNOWLEDGE_DELETE: 'knowledge:delete',
	KNOWLEDGE_PUBLISH: 'knowledge:publish',

	// Analytics
	ANALYTICS_READ: 'analytics:read',
	ANALYTICS_EXPORT: 'analytics:export',

	// Users/Team
	USERS_READ: 'users:read',
	USERS_CREATE: 'users:create',
	USERS_UPDATE: 'users:update',
	USERS_DELETE: 'users:delete',
	USERS_MANAGE: 'users:manage',
	TEAM_MANAGE: 'team:manage',
	TEAM_PERFORMANCE: 'team:performance',

	// Settings
	SETTINGS_READ: 'settings:read',
	SETTINGS_UPDATE: 'settings:update',
	SETTINGS_MANAGE: 'settings:manage',

	// Reports
	REPORTS_READ: 'reports:read',
	REPORTS_CREATE: 'reports:create',
	REPORTS_EXPORT: 'reports:export',

	// SLA
	SLA_MANAGE: 'sla:manage',
	SLA_OVERRIDE: 'sla:override',

	// Quality
	QUALITY_REVIEW: 'quality:review',
	MENTORING_PROVIDE: 'mentoring:provide'
} as const;

/**
 * Helper function to check permissions in API routes
 */
export function requireSupportPermission(userRole: string, requiredPermission: string): void {
	const permissionManager = createSupportPermissionManager(userRole);

	if (!permissionManager.hasPermission(requiredPermission)) {
		throw new Error(`Permission denied: ${requiredPermission}`);
	}
}

/**
 * Helper function to check if user can access support system
 */
export function canAccessSupportSystem(userId: string, userRole: string): boolean {
	const permissionManager = createSupportPermissionManager(userRole, userId);
	return permissionManager.hasPermission(SUPPORT_PERMISSIONS.TICKETS_READ);
}

/**
 * Helper function to check if user can manage support tickets
 */
export function canManageSupportTickets(userId: string, userRole: string): boolean {
	const permissionManager = createSupportPermissionManager(userRole, userId);
	return permissionManager.hasPermission(SUPPORT_PERMISSIONS.TICKETS_UPDATE);
}

/**
 * Helper function to check if user can manage support team
 */
export function canManageSupportTeam(userId: string, userRole: string): boolean {
	const permissionManager = createSupportPermissionManager(userRole, userId);
	return permissionManager.hasPermission(SUPPORT_PERMISSIONS.TEAM_MANAGE);
}
