import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@/auth';
import { db } from '@/db';
import { onboardingProgress } from '@/db/schema/onboarding-schema';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// Delete onboarding progress for this user
		await db
			.delete(onboardingProgress)
			.where(eq(onboardingProgress.userId, session.user.id));

		return json({ success: true, message: 'Onboarding progress cleared' });
	} catch (error) {
		console.error('Error clearing onboarding progress:', error);
		return json(
			{ success: false, error: 'Failed to clear progress' },
			{ status: 500 }
		);
	}
}; 