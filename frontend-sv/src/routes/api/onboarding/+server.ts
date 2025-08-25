import { auth } from "@/auth";
import { json, type RequestHandler } from "@sveltejs/kit";
import { onboardingSchema } from "@/z-schema/onboarding-schema";
import { completeOnboarding, getUserProfile } from "@/db";

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse and validate the request body
    const body = await request.json();
    const result = onboardingSchema.safeParse(body);

    if (!result.success) {
      return json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    const onboardingData = result.data;

    console.log("onboardingData:", onboardingData);

    // Complete onboarding - this will update both user role and profile
    const onboardingResult = await completeOnboarding(userId, onboardingData);

    if (onboardingResult.success) {
      return json({
        success: true,
        message: "Onboarding completed successfully",
        profile: onboardingResult.profile,
        user: onboardingResult.user
      });
    } else {
      return json({ error: "Failed to complete onboarding" }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error("Onboarding completion error:", error);
    if (error instanceof Error) {
      return json({ error: error.message || "Internal server error" }, { status: 500 });
    }
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

// GET endpoint to retrieve user's onboarding data
export const GET: RequestHandler = async ({ request }) => {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const profileResult = await getUserProfile(userId);

    if (profileResult.success && profileResult.profile) {
      return json({
        success: true,
        profile: profileResult.profile,
        isOnboardingComplete: profileResult.profile.isOnboardingComplete
      });
    } else {
      return json({
        success: false,
        profile: null,
        isOnboardingComplete: false
      });
    }

  } catch (error: unknown) {
    console.error("Error fetching onboarding data:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
