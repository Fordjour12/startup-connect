import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@/auth';
import { db } from '@/db';
import { onboardingProgress, users } from '@/db/schema/onboarding-schema';
import { eq } from 'drizzle-orm';
import { onboardingSchema } from '@/lib/schemas/onboarding-schema';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const onboardingData = await request.json();

		// Validate onboarding data with Zod schema
		const validationResult = onboardingSchema.safeParse(onboardingData);
		if (!validationResult.success) {
			return json(
				{
					success: false,
					error: 'Invalid onboarding data',
					details: validationResult.error.errors
				},
				{ status: 400 }
			);
		}

		// Map onboarding role back to database role
		const roleMapping: Record<string, string> = {
			'founder': 'founder',
			'investor': 'investor',
			'supporter': 'support', // Map onboarding 'supporter' back to database 'support'
			'user': 'founder' // Map Better Auth default 'user' to 'founder'
		};

		const databaseRole = roleMapping[onboardingData.role] || onboardingData.role;

		// Update user profile with onboarding data
		await db
			.update(users)
			.set({
				role: databaseRole,
				profile: JSON.stringify({
					basicInfo: onboardingData,
					roleSpecific: onboardingData[onboardingData.role],
					verification: onboardingData.verification,
					onboardingCompleted: true,
					onboardingCompletedAt: new Date()
				}),
				updatedAt: new Date()
			})
			.where(eq(users.id, session.user.id));

		// Update onboarding progress with final data
		await db
			.update(onboardingProgress)
			.set({
				formData: onboardingData,
				currentStepIndex: 8, // Completion step
				completedSteps: ['welcome', 'role', 'basicInfo', 'goals', 'skills', 'preferences', 'roleSpecific', 'verification', 'completion'],
				updatedAt: new Date()
			})
			.where(eq(onboardingProgress.userId, session.user.id));

		return json({
			success: true,
			message: 'Onboarding completed successfully',
			role: onboardingData.role
		});
	} catch (error) {
		console.error('Error submitting onboarding data:', error);
		return json(
			{ success: false, error: 'Failed to submit onboarding data' },
			{ status: 500 }
		);
	}
}; 