import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@/auth';
import { db } from '@/db';
import { onboardingProgress } from '@/db/schema/onboarding-schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const { formData, currentStepIndex, completedSteps } = await request.json();

		// Validate required fields
		if (typeof currentStepIndex !== 'number' || !Array.isArray(completedSteps)) {
			return json({ success: false, error: 'Invalid data format' }, { status: 400 });
		}

		// Check if onboarding progress exists for this user
		const existingProgress = await db
			.select()
			.from(onboardingProgress)
			.where(eq(onboardingProgress.userId, session.user.id))
			.limit(1);

		if (existingProgress.length > 0) {
			// Update existing progress
			await db
				.update(onboardingProgress)
				.set({
					formData,
					currentStepIndex,
					completedSteps,
					updatedAt: new Date()
				})
				.where(eq(onboardingProgress.userId, session.user.id));
		} else {
			// Create new progress record
			await db.insert(onboardingProgress).values({
				userId: session.user.id,
				formData,
				currentStepIndex,
				completedSteps,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error saving onboarding progress:', error);
		return json(
			{ success: false, error: 'Failed to save progress' },
			{ status: 500 }
		);
	}
}; 