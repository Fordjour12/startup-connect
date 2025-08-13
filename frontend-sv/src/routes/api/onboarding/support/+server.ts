import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supporterSchema } from '@/z-schema/onboarding-schema';
import { auth } from '@/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { user } from '@/db/schema/auth-schema';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		// Check if user is authenticated
		if (!session?.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is a supporter
		if (session.user.role !== 'support') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		// Parse and validate request body
		const body = await request.json();
		const result = supporterSchema.safeParse(body);

		if (!result.success) {
			return json({ error: 'Invalid data', issues: result.error.issues }, { status: 400 });
		}

		// In a real implementation, you would save this data to your database
		// For now, we'll just return a success response
		console.log('Supporter onboarding data:', result.data);

		// Update user's onboarding status in the database
		await db.update(user).set({
			// Add any relevant fields here
		}).where(eq(user.id, session.user.id));

		return json({ success: true, message: 'Supporter profile updated successfully' });
	} catch (error) {
		console.error('Error processing supporter onboarding:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};