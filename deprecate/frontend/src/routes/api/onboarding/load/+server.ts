import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@/auth';
import { db } from '@/db';
import { onboardingProgress } from '@/db/schema/onboarding-schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// Get onboarding progress for this user
		const progress = await db
			.select()
			.from(onboardingProgress)
			.where(eq(onboardingProgress.userId, session.user.id))
			.limit(1);

		if (progress.length === 0) {
			return json({ success: true, data: null });
		}

		const userProgress = progress[0];

		return json({
			success: true,
			data: {
				formData: userProgress.formData || {},
				currentStepIndex: userProgress.currentStepIndex,
				completedSteps: userProgress.completedSteps || [],
				createdAt: userProgress.createdAt,
				updatedAt: userProgress.updatedAt
			}
		});
	} catch (error) {
		console.error('Error loading onboarding progress:', error);
		return json(
			{ success: false, error: 'Failed to load progress' },
			{ status: 500 }
		);
	}
}; 