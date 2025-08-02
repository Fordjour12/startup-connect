import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OnboardingService } from '@/db/onboarding';
import { auth } from '@/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { currentStepIndex, completedSteps, formData } = await request.json();

		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;

		await OnboardingService.saveProgress(userId, currentStepIndex, completedSteps, formData);

		return json({ success: true });
	} catch (error) {
		console.error('Error saving onboarding progress:', error);
		return json({ error: 'Failed to save progress' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;

		const progress = await OnboardingService.getProgress(userId);

		return json({ progress });
	} catch (error) {
		console.error('Error loading onboarding progress:', error);
		return json({ error: 'Failed to load progress' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;

		await OnboardingService.deleteOnboardingData(userId);

		return json({ success: true });
	} catch (error) {
		console.error('Error clearing onboarding progress:', error);
		return json({ error: 'Failed to clear progress' }, { status: 500 });
	}
}; 