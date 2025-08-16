import { db } from "../index";
import { userProfile } from "../schema/user-profile-schema";
import { eq } from "drizzle-orm";
import { transformOnboardingToProfile, transformProfileToOnboarding } from "./onboarding-transformer";
import type { OnboardingData } from "../../z-schema/onboarding-schema";

// =============================================================================
// USER PROFILE DATABASE OPERATIONS
// =============================================================================

/**
 * Create a new user profile from onboarding data
 */
export async function createUserProfile(
	onboardingData: OnboardingData,
	userId: string
) {
	try {
		const profileData = transformOnboardingToProfile(onboardingData, userId);
		const [profile] = await db.insert(userProfile).values(profileData).returning();
		return { success: true, profile };
	} catch (error) {
		console.error("Error creating user profile:", error);
		return { success: false, error };
	}
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
	try {
		const [profile] = await db
			.select()
			.from(userProfile)
			.where(eq(userProfile.userId, userId));

		return { success: true, profile };
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return { success: false, error };
	}
}

/**
 * Update user profile
 */
export async function updateUserProfile(
	userId: string,
	updates: Partial<typeof userProfile.$inferInsert>
) {
	try {
		const [profile] = await db
			.update(userProfile)
			.set({ ...updates, updatedAt: new Date() })
			.where(eq(userProfile.userId, userId))
			.returning();

		return { success: true, profile };
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { success: false, error };
	}
}

/**
 * Check if user has completed onboarding
 */
export async function isOnboardingComplete(userId: string) {
	try {
		const [profile] = await db
			.select({ isOnboardingComplete: userProfile.isOnboardingComplete })
			.from(userProfile)
			.where(eq(userProfile.userId, userId));

		return { success: true, isComplete: profile?.isOnboardingComplete || false };
	} catch (error) {
		console.error("Error checking onboarding status:", error);
		return { success: false, error };
	}
}

/**
 * Get onboarding step for a user
 */
export async function getOnboardingStep(userId: string) {
	try {
		const [profile] = await db
			.select({ onboardingStep: userProfile.onboardingStep })
			.from(userProfile)
			.where(eq(userProfile.userId, userId));

		return { success: true, step: profile?.onboardingStep || 1 };
	} catch (error) {
		console.error("Error getting onboarding step:", error);
		return { success: false, error };
	}
}

/**
 * Update onboarding step
 */
export async function updateOnboardingStep(userId: string, step: number) {
	try {
		const [profile] = await db
			.update(userProfile)
			.set({ onboardingStep: step, updatedAt: new Date() })
			.where(eq(userProfile.userId, userId))
			.returning();

		return { success: true, profile };
	} catch (error) {
		console.error("Error updating onboarding step:", error);
		return { success: false, error };
	}
}

/**
 * Delete user profile (useful for cleanup)
 */
export async function deleteUserProfile(userId: string) {
	try {
		await db.delete(userProfile).where(eq(userProfile.userId, userId));
		return { success: true };
	} catch (error) {
		console.error("Error deleting user profile:", error);
		return { success: false, error };
	}
}
