import { db } from "./index";
import { eq, and } from "drizzle-orm";
import {
   onboardingProfile,
   founderProfile,
   investorProfile,
   supporterProfile,
   onboardingProgress,
   type OnboardingData
} from "./schema";
import type { OnboardingData as ZodOnboardingData } from "@/schemas/onboarding-schema";

export interface OnboardingProfileWithRelations {
   id: string;
   userId: string;
   role: string;
   fullName: string;
   email: string;
   location: string;
   bio?: string;
   profilePicture?: string;
   linkedinUrl?: string;
   website?: string;
   primaryGoal: string;
   specificNeeds: string[];
   timeCommitment: string;
   additionalGoals?: string;
   skills: string[];
   experienceLevel: string;
   industries: string[];
   achievements?: string;
   geographicPreference: string;
   communicationStyle: string[];
   workingStyle: string;
   diversityPreference: boolean;
   notificationFrequency: string;
   termsAccepted: boolean;
   privacyAccepted: boolean;
   marketingEmails: boolean;
   isComplete: boolean;
   createdAt: Date;
   updatedAt: Date;
   founderProfile?: {
      id: string;
      startupName: string;
      startupStage: string;
      fundingNeeds?: number;
      teamSize: number;
      startupDescription: string;
      equityOffered?: number;
   };
   investorProfile?: {
      id: string;
      investmentSize: string;
      preferredStages: string[];
      investmentHistory?: string;
      riskAppetite: string;
      portfolioCompanies?: number;
   };
   supporterProfile?: {
      id: string;
      supportType: string[];
      availability: string;
      hourlyRate?: number;
      expertise?: string;
   };
}

export class OnboardingService {
   /**
    * Save onboarding data to the database
    */
   static async saveOnboardingData(userId: string, data: ZodOnboardingData) {
      try {
         // Start a transaction
         return await db.transaction(async (tx) => {
            // Create or update the main onboarding profile
            const profileData = {
               userId,
               role: data.role,
               fullName: data.fullName,
               email: data.email,
               location: data.location,
               bio: data.bio,
               profilePicture: data.profilePicture,
               linkedinUrl: data.linkedinUrl,
               website: data.website,
               primaryGoal: data.primaryGoal,
               specificNeeds: data.specificNeeds,
               timeCommitment: data.timeCommitment,
               additionalGoals: data.additionalGoals,
               skills: data.skills,
               experienceLevel: data.experienceLevel,
               industries: data.industries,
               achievements: data.achievements,
               geographicPreference: data.geographicPreference,
               communicationStyle: data.communicationStyle,
               workingStyle: data.workingStyle,
               diversityPreference: data.diversityPreference,
               notificationFrequency: data.notificationFrequency,
               termsAccepted: data.termsAccepted,
               privacyAccepted: data.privacyAccepted,
               marketingEmails: data.marketingEmails,
               isComplete: true,
            };

            // Check if profile already exists
            const existingProfile = await tx
               .select()
               .from(onboardingProfile)
               .where(eq(onboardingProfile.userId, userId))
               .limit(1);

            let profileId: string;

            if (existingProfile.length > 0) {
               // Update existing profile
               await tx
                  .update(onboardingProfile)
                  .set(profileData)
                  .where(eq(onboardingProfile.userId, userId));
               profileId = existingProfile[0].id;
            } else {
               // Create new profile
               const [newProfile] = await tx
                  .insert(onboardingProfile)
                  .values(profileData)
                  .returning({ id: onboardingProfile.id });
               profileId = newProfile.id;
            }

            // Save role-specific data
            if (data.role === 'founder') {
               const founderData = {
                  onboardingProfileId: profileId,
                  startupName: data.startupName!,
                  startupStage: data.startupStage!,
                  fundingNeeds: data.fundingNeeds ? Number(data.fundingNeeds) : null,
                  teamSize: data.teamSize!,
                  startupDescription: data.startupDescription!,
                  equityOffered: data.equityOffered ? Number(data.equityOffered) : null,
               };

               // Check if founder profile exists
               const existingFounder = await tx
                  .select()
                  .from(founderProfile)
                  .where(eq(founderProfile.onboardingProfileId, profileId))
                  .limit(1);

               if (existingFounder.length > 0) {
                  await tx
                     .update(founderProfile)
                     .set(founderData)
                     .where(eq(founderProfile.onboardingProfileId, profileId));
               } else {
                  await tx.insert(founderProfile).values(founderData);
               }
            } else if (data.role === 'investor') {
               const investorData = {
                  onboardingProfileId: profileId,
                  investmentSize: data.investmentSize!,
                  preferredStages: data.preferredStages!,
                  investmentHistory: data.investmentHistory,
                  riskAppetite: data.riskAppetite!,
                  portfolioCompanies: data.portfolioCompanies ? Number(data.portfolioCompanies) : null,
               };

               // Check if investor profile exists
               const existingInvestor = await tx
                  .select()
                  .from(investorProfile)
                  .where(eq(investorProfile.onboardingProfileId, profileId))
                  .limit(1);

               if (existingInvestor.length > 0) {
                  await tx
                     .update(investorProfile)
                     .set(investorData)
                     .where(eq(investorProfile.onboardingProfileId, profileId));
               } else {
                  await tx.insert(investorProfile).values(investorData);
               }
            } else if (data.role === 'support') {
               const supporterData = {
                  onboardingProfileId: profileId,
                  supportType: data.supportType!,
                  availability: data.availability!,
                  hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : null,
                  expertise: data.expertise,
               };

               // Check if supporter profile exists
               const existingSupporter = await tx
                  .select()
                  .from(supporterProfile)
                  .where(eq(supporterProfile.onboardingProfileId, profileId))
                  .limit(1);

               if (existingSupporter.length > 0) {
                  await tx
                     .update(supporterProfile)
                     .set(supporterData)
                     .where(eq(supporterProfile.onboardingProfileId, profileId));
               } else {
                  await tx.insert(supporterProfile).values(supporterData);
               }
            }

            // Clear onboarding progress
            await tx
               .delete(onboardingProgress)
               .where(eq(onboardingProgress.userId, userId));

            return { success: true, profileId };
         });
      } catch (error) {
         console.error('Error saving onboarding data:', error);
         throw new Error('Failed to save onboarding data');
      }
   }

   /**
    * Get onboarding profile by user ID
    */
   static async getOnboardingProfile(userId: string): Promise<OnboardingProfileWithRelations | null> {
      try {
         const profile = await db
            .select()
            .from(onboardingProfile)
            .where(eq(onboardingProfile.userId, userId))
            .limit(1);

         if (profile.length === 0) {
            return null;
         }

         const profileData = profile[0];

         // Get role-specific data
         let founderData = null;
         let investorData = null;
         let supporterData = null;

         if (profileData.role === 'founder') {
            const founder = await db
               .select()
               .from(founderProfile)
               .where(eq(founderProfile.onboardingProfileId, profileData.id))
               .limit(1);
            if (founder.length > 0) {
               founderData = founder[0];
            }
         } else if (profileData.role === 'investor') {
            const investor = await db
               .select()
               .from(investorProfile)
               .where(eq(investorProfile.onboardingProfileId, profileData.id))
               .limit(1);
            if (investor.length > 0) {
               investorData = investor[0];
            }
         } else if (profileData.role === 'support') {
            const supporter = await db
               .select()
               .from(supporterProfile)
               .where(eq(supporterProfile.onboardingProfileId, profileData.id))
               .limit(1);
            if (supporter.length > 0) {
               supporterData = supporter[0];
            }
         }

         return {
            ...profileData,
            founderProfile: founderData,
            investorProfile: investorData,
            supporterProfile: supporterData,
         };
      } catch (error) {
         console.error('Error getting onboarding profile:', error);
         throw new Error('Failed to get onboarding profile');
      }
   }

   /**
    * Save onboarding progress
    */
   static async saveProgress(userId: string, currentStepIndex: number, completedSteps: string[], formData: Record<string, any>) {
      try {
         const existingProgress = await db
            .select()
            .from(onboardingProgress)
            .where(eq(onboardingProgress.userId, userId))
            .limit(1);

         if (existingProgress.length > 0) {
            await db
               .update(onboardingProgress)
               .set({
                  currentStepIndex,
                  completedSteps,
                  formData,
                  updatedAt: new Date(),
               })
               .where(eq(onboardingProgress.userId, userId));
         } else {
            await db.insert(onboardingProgress).values({
               userId,
               currentStepIndex,
               completedSteps,
               formData,
            });
         }
      } catch (error) {
         console.error('Error saving onboarding progress:', error);
         throw new Error('Failed to save onboarding progress');
      }
   }

   /**
    * Get onboarding progress
    */
   static async getProgress(userId: string) {
      try {
         const progress = await db
            .select()
            .from(onboardingProgress)
            .where(eq(onboardingProgress.userId, userId))
            .limit(1);

         return progress.length > 0 ? progress[0] : null;
      } catch (error) {
         console.error('Error getting onboarding progress:', error);
         throw new Error('Failed to get onboarding progress');
      }
   }

   /**
    * Check if user has completed onboarding
    */
   static async isOnboardingComplete(userId: string): Promise<boolean> {
      try {
         const profile = await db
            .select({ isComplete: onboardingProfile.isComplete })
            .from(onboardingProfile)
            .where(eq(onboardingProfile.userId, userId))
            .limit(1);

         return profile.length > 0 && profile[0].isComplete;
      } catch (error) {
         console.error('Error checking onboarding completion:', error);
         return false;
      }
   }

   /**
    * Delete onboarding data (for testing or user deletion)
    */
   static async deleteOnboardingData(userId: string) {
      try {
         await db.transaction(async (tx) => {
            // Delete role-specific profiles first (cascade will handle the rest)
            await tx
               .delete(onboardingProfile)
               .where(eq(onboardingProfile.userId, userId));

            // Delete progress
            await tx
               .delete(onboardingProgress)
               .where(eq(onboardingProgress.userId, userId));
         });
      } catch (error) {
         console.error('Error deleting onboarding data:', error);
         throw new Error('Failed to delete onboarding data');
      }
   }
} 