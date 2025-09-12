import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { auth } from '@/auth';

// POST /api/admin/impersonate - Impersonate a user
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId } = await request.json();

		if (!userId) {
			throw error(400, 'User ID is required');
		}

		// Use Better Auth's impersonation functionality
		const result = await auth.api.impersonateUser({
			body: {
				userId: userId.toString()
			},
			headers: request.headers
		});

		if (result.error) {
			throw error(400, result.error.message || 'Failed to impersonate user');
		}

		// Determine redirect URL based on user role
		const redirectUrl = getRedirectUrlForRole(result.data?.user?.role);

		return json({
			success: true,
			message: 'Successfully impersonating user',
			redirectUrl,
			user: result.data?.user
		});

	} catch (err) {
		console.error('Impersonation error:', err);
		return json({
			success: false,
			error: err instanceof Error ? err.message : 'Failed to impersonate user'
		}, { status: 500 });
	}
};

// DELETE /api/admin/impersonate - Stop impersonating
export const DELETE: RequestHandler = async ({ request }) => {
	try {
		// Use Better Auth's stop impersonation functionality
		const result = await auth.api.stopImpersonating({
			headers: request.headers
		});

		return json({
			success: true,
			message: 'Stopped impersonating user'
		});

	} catch (err) {
		console.error('Stop impersonation error:', err);
		return json({
			success: false,
			error: err instanceof Error ? err.message : 'Failed to stop impersonation'
		}, { status: 500 });
	}
};

function getRedirectUrlForRole(role: string): string {
	switch (role) {
		case 'founder':
			return '/dashboard/founder';
		case 'investor':
			return '/dashboard/investor';
		case 'support':
			return '/dashboard/supporter';
		default:
			return '/dashboard';
	}
}
