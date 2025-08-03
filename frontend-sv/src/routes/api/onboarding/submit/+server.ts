import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@/auth';
import { OnboardingService } from '@/db/onboarding';
import { onboardingSchema } from '@/schemas/onboarding-schema';
import { db } from '@/db';
import { user } from '@/db/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { USER_ROLES } from '@/db/schema/auth-schema';

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

    // Use OnboardingService to save data properly
    const result = await OnboardingService.saveOnboardingData(session.user.id, validationResult.data);

    if (!result.success) {
      return json(
        { success: false, error: 'Failed to save onboarding data' },
        { status: 500 }
      );
    }

    // Update the user's role in the main user table
    const userRole = onboardingData.role === 'support' ? USER_ROLES.SUPPORT : onboardingData.role;

    await db
      .update(user)
      .set({
        role: userRole,
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id));

    return json({
      success: true,
      message: 'Onboarding completed successfully',
      profileId: result.profileId,
      role: userRole
    });
  } catch (error) {
    console.error('Error submitting onboarding data:', error);
    return json(
      { success: false, error: 'Failed to submit onboarding data' },
      { status: 500 }
    );
  }
};
