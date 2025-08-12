import { auth } from "@/auth";
import { json, type RequestHandler } from "@sveltejs/kit";
import { onboardingSchema } from "@/z-schema/onboarding-schema";

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const result = onboardingSchema.safeParse(body);

    if (!result.success) {
      return json({ error: "Invalid data", issues: result.error.issues }, { status: 400 });
    }

    // In a real implementation, you would save all onboarding data to your database
    // For example, you might have separate tables for user profiles, goals, skills, etc.

    return json({ 
      success: true, 
      message: "Onboarding completed successfully"
    });

  } catch (error: unknown) {
    console.error("Onboarding completion error:", error);
    if (error instanceof Error) {
      return json({ error: error.message || "Internal server error" }, { status: 500 });
    }
    return json({ error: "Internal server error" }, { status: 500 });
  }
};