import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OnboardingService } from '@/db/onboarding';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { currentStepIndex, completedSteps, formData } = await request.json();

		// Get user ID from session/auth context
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		await OnboardingService.saveProgress(userId, currentStepIndex, completedSteps, formData);

		return json({ success: true });
	} catch (error) {
		console.error('Error saving onboarding progress:', error);
		return json({ error: 'Failed to save progress' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// Get user ID from session/auth context
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const progress = await OnboardingService.getProgress(userId);

		return json({ progress });
	} catch (error) {
		console.error('Error loading onboarding progress:', error);
		return json({ error: 'Failed to load progress' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals }) => {
	try {
		// Get user ID from session/auth context
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		await OnboardingService.deleteOnboardingData(userId);

		return json({ success: true });
	} catch (error) {
		console.error('Error clearing onboarding progress:', error);
		return json({ error: 'Failed to clear progress' }, { status: 500 });
	}
}; 