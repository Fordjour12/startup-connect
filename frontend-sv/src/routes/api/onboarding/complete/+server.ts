import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OnboardingService } from '@/db/onboarding';
import type { OnboardingData } from '@/schemas/onboarding-schema';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const formData: OnboardingData = await request.json();
		
		// Get user ID from session/auth context
		const userId = locals.user?.id;
		if (!userId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Validate the data (you might want to add Zod validation here)
		if (!formData.role || !formData.fullName || !formData.email) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const result = await OnboardingService.saveOnboardingData(userId, formData);
		
		if (!result.success) {
			return json({ error: 'Failed to save onboarding data' }, { status: 500 });
		}

		return json({ 
			success: true, 
			profileId: result.profileId 
		});
	} catch (error) {
		console.error('Error completing onboarding:', error);
		return json({ error: 'Failed to complete onboarding' }, { status: 500 });
	}
}; 