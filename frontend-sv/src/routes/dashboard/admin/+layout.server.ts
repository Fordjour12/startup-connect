import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	// Check if user has admin role
	// In a real app, this would check the user's session/permissions
	const user = locals.user || {
		id: 1,
		name: "Admin User",
		email: "admin@startupconnect.com",
		role: "admin"
	};

	// If user is not admin, redirect to appropriate dashboard
	if (user.role !== "admin") {
		throw new Error("Access denied: Admin privileges required");
	}

	// Return admin-specific data
	return {
		user,
		adminPermissions: {
			canManageUsers: true,
			canViewAnalytics: true,
			canManageContent: true,
			canConfigureSettings: true,
			canViewSecurity: true
		}
	};
};
