import { ORGANIZATION_ROLES } from '$lib/db/schema';

// Define permissions for each role
export const ROLE_PERMISSIONS = {
	[ORGANIZATION_ROLES.OWNER]: [
		// Organization management
		'organization:read',
		'organization:update',
		'organization:delete',

		// Member management
		'members:read',
		'members:invite',
		'members:update',
		'members:remove',

		// Investment management
		'investments:read',
		'investments:create',
		'investments:update',
		'investments:delete',

		// Due diligence
		'due_diligence:read',
		'due_diligence:create',
		'due_diligence:update',
		'due_diligence:delete',
		'due_diligence:complete',

		// Settings and admin
		'settings:read',
		'settings:update',
		'admin:access'
	],

	[ORGANIZATION_ROLES.ADMIN]: [
		// Organization management
		'organization:read',
		'organization:update',

		// Member management
		'members:read',
		'members:invite',
		'members:update',
		'members:remove',

		// Investment management
		'investments:read',
		'investments:create',
		'investments:update',
		'investments:delete',

		// Due diligence
		'due_diligence:read',
		'due_diligence:create',
		'due_diligence:update',
		'due_diligence:delete',
		'due_diligence:complete',

		// Settings
		'settings:read',
		'settings:update'
	],

	[ORGANIZATION_ROLES.INVESTMENT_PARTNER]: [
		// Organization management
		'organization:read',

		// Member management
		'members:read',
		'members:invite',

		// Investment management
		'investments:read',
		'investments:create',
		'investments:update',

		// Due diligence
		'due_diligence:read',
		'due_diligence:create',
		'due_diligence:update',
		'due_diligence:complete'
	],

	[ORGANIZATION_ROLES.INVESTMENT_ANALYST]: [
		// Organization management
		'organization:read',

		// Member management
		'members:read',

		// Investment management
		'investments:read',
		'investments:create',
		'investments:update',

		// Due diligence
		'due_diligence:read',
		'due_diligence:create',
		'due_diligence:update'
	],

	[ORGANIZATION_ROLES.OPERATIONS]: [
		// Organization management
		'organization:read',

		// Member management
		'members:read',

		// Investment management
		'investments:read',
		'investments:create',
		'investments:update',

		// Due diligence
		'due_diligence:read'
	],

	[ORGANIZATION_ROLES.MEMBER]: [
		// Organization management
		'organization:read',

		// Member management
		'members:read',

		// Investment management
		'investments:read',

		// Due diligence
		'due_diligence:read'
	],

	[ORGANIZATION_ROLES.VIEWER]: [
		// Organization management
		'organization:read',

		// Member management
		'members:read',

		// Investment management
		'investments:read',

		// Due diligence
		'due_diligence:read'
	]
};

// Role hierarchy for determining access levels
export const ROLE_HIERARCHY = {
	[ORGANIZATION_ROLES.OWNER]: 100,
	[ORGANIZATION_ROLES.ADMIN]: 80,
	[ORGANIZATION_ROLES.INVESTMENT_PARTNER]: 60,
	[ORGANIZATION_ROLES.INVESTMENT_ANALYST]: 40,
	[ORGANIZATION_ROLES.OPERATIONS]: 30,
	[ORGANIZATION_ROLES.MEMBER]: 20,
	[ORGANIZATION_ROLES.VIEWER]: 10
};

export class PermissionManager {
	private userRole: string;

	constructor(userRole: string) {
		this.userRole = userRole;
	}

	/**
	 * Check if the user has a specific permission
	 */
	hasPermission(permission: string): boolean {
		const rolePermissions = ROLE_PERMISSIONS[this.userRole as keyof typeof ROLE_PERMISSIONS];
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
	 * Check if the user can manage another user with the given role
	 */
	canManageRole(targetRole: string): boolean {
		const userLevel = ROLE_HIERARCHY[this.userRole as keyof typeof ROLE_HIERARCHY] || 0;
		const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;

		// Owners and admins can manage lower-level roles
		if (this.userRole === ORGANIZATION_ROLES.OWNER) {
			return targetLevel < userLevel;
		}

		if (this.userRole === ORGANIZATION_ROLES.ADMIN) {
			return targetLevel < userLevel && targetRole !== ORGANIZATION_ROLES.OWNER;
		}

		// Other roles cannot manage anyone
		return false;
	}

	/**
	 * Get all permissions for the current user role
	 */
	getPermissions(): string[] {
		return ROLE_PERMISSIONS[this.userRole as keyof typeof ROLE_PERMISSIONS] || [];
	}

	/**
	 * Check if the user is an admin or owner
	 */
	isAdmin(): boolean {
		return [ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.ADMIN].includes(this.userRole);
	}

	/**
	 * Check if the user is the owner
	 */
	isOwner(): boolean {
		return this.userRole === ORGANIZATION_ROLES.OWNER;
	}
}

/**
 * Create a permission manager for a user role
 */
export function createPermissionManager(userRole: string): PermissionManager {
	return new PermissionManager(userRole);
}

/**
 * Common permission checks
 */
export const PERMISSIONS = {
	// Organization
	ORGANIZATION_READ: 'organization:read',
	ORGANIZATION_UPDATE: 'organization:update',
	ORGANIZATION_DELETE: 'organization:delete',

	// Members
	MEMBERS_READ: 'members:read',
	MEMBERS_INVITE: 'members:invite',
	MEMBERS_UPDATE: 'members:update',
	MEMBERS_REMOVE: 'members:remove',

	// Investments
	INVESTMENTS_READ: 'investments:read',
	INVESTMENTS_CREATE: 'investments:create',
	INVESTMENTS_UPDATE: 'investments:update',
	INVESTMENTS_DELETE: 'investments:delete',

	// Due Diligence
	DUE_DILIGENCE_READ: 'due_diligence:read',
	DUE_DILIGENCE_CREATE: 'due_diligence:create',
	DUE_DILIGENCE_UPDATE: 'due_diligence:update',
	DUE_DILIGENCE_DELETE: 'due_diligence:delete',
	DUE_DILIGENCE_COMPLETE: 'due_diligence:complete',

	// Settings
	SETTINGS_READ: 'settings:read',
	SETTINGS_UPDATE: 'settings:update',

	// Admin
	ADMIN_ACCESS: 'admin:access'
} as const;

/**
 * Helper function to check permissions in API routes
 */
export function requirePermission(userRole: string, requiredPermission: string): void {
	const permissionManager = createPermissionManager(userRole);

	if (!permissionManager.hasPermission(requiredPermission)) {
		throw new Error(`Permission denied: ${requiredPermission}`);
	}
}

/**
 * Helper function to check if user can access organization
 */
export function canAccessOrganization(userId: string, orgId: string, userRole: string): boolean {
	// In a real implementation, this would check the database
	// For now, we'll assume users can access organizations they're members of
	const permissionManager = createPermissionManager(userRole);
	return permissionManager.hasPermission(PERMISSIONS.ORGANIZATION_READ);
}

/**
 * Helper function to check if user can manage organization
 */
export function canManageOrganization(userId: string, orgId: string, userRole: string): boolean {
	const permissionManager = createPermissionManager(userRole);
	return permissionManager.hasPermission(PERMISSIONS.ORGANIZATION_UPDATE);
}
