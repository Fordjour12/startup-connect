import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@/db';
import { user } from '@/db/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { USER_ROLES } from '@/db/schema/auth-schema';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { role } = await request.json();

		// Validate role
		if (!role || !Object.values(USER_ROLES).includes(role)) {
			return json(
				{ error: 'Invalid role provided' },
				{ status: 400 }
			);
		}

		// Get user from cookie
		const userCookie = cookies.get('user');
		if (!userCookie) {
			return json(
				{ error: 'User not authenticated' },
				{ status: 401 }
			);
		}

		let userData;
		try {
			userData = JSON.parse(userCookie);
		} catch (error) {
			return json(
				{ error: 'Invalid user data' },
				{ status: 400 }
			);
		}

		// Update user role in database
		await db
			.update(user)
			.set({
				role: role,
				updatedAt: new Date()
			})
			.where(eq(user.id, userData.id));

		// Return success response
		return json({
			success: true,
			message: 'Role updated successfully',
			role: role
		});

	} catch (error) {
		console.error('Error updating user role:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}; 