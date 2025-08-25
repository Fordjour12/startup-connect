import { auth } from "@/auth";
import { json, type RequestHandler } from "@sveltejs/kit";
import { onboardingSchema } from "@/z-schema/onboarding-schema";
import { createUserProfile, getUserProfile, updateUserProfile } from "@/db";

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

    // Check if user already has a profile
    const existingProfile = await getUserProfile(userId);

    console.log("existingProfile:", existingProfile);

    if (existingProfile.success && existingProfile.profile) {
      // Update existing profile
      const updateResult = await updateUserProfile(userId, {
        name: onboardingData.basicInfo.name,
        email: onboardingData.basicInfo.email,
        profileImage: onboardingData.basicInfo.profileImage || null,
        location: onboardingData.basicInfo.location || null,
        bio: onboardingData.basicInfo.bio || null,
        jobTitle: onboardingData.basicInfo.jobTitle || null,
        industry: onboardingData.basicInfo.industry || null,
        education: onboardingData.basicInfo.education || null,
        phone: onboardingData.basicInfo.phone || null,
        twitterHandle: onboardingData.basicInfo.twitterHandle || null,
        linkedinUrl: onboardingData.basicInfo.linkedinUrl || null,
        githubProfile: onboardingData.basicInfo.githubProfile || null,
        portfolioWebsite: onboardingData.basicInfo.portfolioWebsite || null,
        city: onboardingData.basicInfo.city || null,
        timezone: onboardingData.basicInfo.timezone || null,
        languages: onboardingData.basicInfo.languages ? onboardingData.basicInfo.languages.join(", ") : null,
        employmentStatus: onboardingData.basicInfo.employmentStatus || null,

        // Role-specific data
        roleSpecificData: (() => {
          const roleData: any = {};

          if (onboardingData.role === "investor" && onboardingData.investorInfo) {
            roleData.investmentSize = onboardingData.investorInfo.investmentSize;
            roleData.preferredStages = onboardingData.investorInfo.preferredStages;
            roleData.investmentHistory = onboardingData.investorInfo.investmentHistory;
            roleData.riskAppetite = onboardingData.investorInfo.riskAppetite;
            roleData.portfolioCompanies = onboardingData.investorInfo.portfolioCompanies;
          } else if (onboardingData.role === "support" && onboardingData.supporterInfo) {
            roleData.supportType = onboardingData.supporterInfo.supportType;
            roleData.availability = onboardingData.supporterInfo.availability;
            roleData.hourlyRate = onboardingData.supporterInfo.hourlyRate;
            roleData.expertise = onboardingData.supporterInfo.expertise;
          }

          return roleData;
        })(),

        // Goals
        personalGoals: onboardingData.goals.personalGoals ? onboardingData.goals.personalGoals.join(", ") : null,
        platformGoals: onboardingData.goals.platformGoals ? onboardingData.goals.platformGoals.join(", ") : null,
        primaryGoal: onboardingData.goals.primaryGoal,
        specificNeeds: onboardingData.goals.specificNeeds ? onboardingData.goals.specificNeeds.join(", ") : null,
        timeCommitment: onboardingData.goals.timeCommitment,
        additionalGoals: onboardingData.goals.additionalGoals || null,

        // Skills
        skills: onboardingData.skills.skills ? onboardingData.skills.skills.join(", ") : null,
        experienceLevel: onboardingData.skills.experienceLevel,
        industries: onboardingData.skills.industries ? onboardingData.skills.industries.join(", ") : null,
        achievements: onboardingData.skills.achievements || null,
        expertiseAreas: onboardingData.skills.expertiseAreas || null,
        certifications: onboardingData.skills.certifications || null,

        // Preferences
        communicationMethods: onboardingData.preferences.communicationMethods ? onboardingData.preferences.communicationMethods.join(", ") : null,
        communicationFrequency: onboardingData.preferences.communicationFrequency || null,
        notificationTypes: onboardingData.preferences.notificationTypes ? onboardingData.preferences.notificationTypes.join(", ") : null,
        themePreference: onboardingData.preferences.themePreference || null,

        // Mark onboarding as complete
        isOnboardingComplete: true,
        onboardingStep: 5,
      });

      if (updateResult.success) {
        return json({
          success: true,
          message: "Onboarding updated successfully",
          profile: updateResult.profile
        });
      } else {
        return json({ error: "Failed to update profile" }, { status: 500 });
      }
    } else {
      // Create new profile
      const createResult = await createUserProfile(onboardingData, userId);

      if (createResult.success) {
        return json({
          success: true,
          message: "Onboarding completed successfully",
          profile: createResult.profile
        });
      } else {
        return json({ error: "Failed to create profile" }, { status: 500 });
      }
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
