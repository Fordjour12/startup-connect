import type { OnboardingData } from "../../z-schema/onboarding-schema";
import type { NewUserProfile } from "../schema/user-profile-schema";
import { arrayToString } from "../schema/user-profile-schema";

// =============================================================================
// TRANSFORM ONBOARDING DATA TO DATABASE FORMAT
// =============================================================================

export function transformOnboardingToProfile(
	onboardingData: OnboardingData,
	userId: string
): NewUserProfile {
	const { role, basicInfo, goals, skills, preferences, investorInfo, supporterInfo } = onboardingData;

	// Transform role-specific data
	const roleSpecificData: any = {};

	if (role === "investor" && investorInfo) {
		roleSpecificData.investmentSize = investorInfo.investmentSize;
		roleSpecificData.preferredStages = investorInfo.preferredStages;
		roleSpecificData.investmentHistory = investorInfo.investmentHistory;
		roleSpecificData.riskAppetite = investorInfo.riskAppetite;
		roleSpecificData.portfolioCompanies = investorInfo.portfolioCompanies;
	} else if (role === "support" && supporterInfo) {
		roleSpecificData.supportType = supporterInfo.supportType;
		roleSpecificData.availability = supporterInfo.availability;
		roleSpecificData.hourlyRate = supporterInfo.hourlyRate;
		roleSpecificData.expertise = supporterInfo.expertise;
	}

	return {
		userId,
		name: basicInfo.name,
		email: basicInfo.email,
		profileImage: basicInfo.profileImage || null,
		location: basicInfo.location || null,
		bio: basicInfo.bio || null,
		jobTitle: basicInfo.jobTitle || null,
		industry: basicInfo.industry || null,
		education: basicInfo.education || null,
		phone: basicInfo.phone || null,
		twitterHandle: basicInfo.twitterHandle || null,
		linkedinUrl: basicInfo.linkedinUrl || null,
		githubProfile: basicInfo.githubProfile || null,
		portfolioWebsite: basicInfo.portfolioWebsite || null,
		city: basicInfo.city || null,
		timezone: basicInfo.timezone || null,
		languages: basicInfo.languages ? arrayToString(basicInfo.languages) : null,
		employmentStatus: basicInfo.employmentStatus || null,

		roleSpecificData,

		personalGoals: goals.personalGoals ? arrayToString(goals.personalGoals) : null,
		platformGoals: goals.platformGoals ? arrayToString(goals.platformGoals) : null,
		primaryGoal: goals.primaryGoal,
		specificNeeds: goals.specificNeeds ? arrayToString(goals.specificNeeds) : null,
		timeCommitment: goals.timeCommitment,
		additionalGoals: goals.additionalGoals || null,

		skills: skills.skills ? arrayToString(skills.skills) : null,
		experienceLevel: skills.experienceLevel,
		industries: skills.industries ? arrayToString(skills.industries) : null,
		achievements: skills.achievements || null,
		expertiseAreas: skills.expertiseAreas || null,
		certifications: skills.certifications || null,

		communicationMethods: preferences.communicationMethods ? arrayToString(preferences.communicationMethods) : null,
		communicationFrequency: preferences.communicationFrequency || null,
		notificationTypes: preferences.notificationTypes ? arrayToString(preferences.notificationTypes) : null,
		themePreference: preferences.themePreference || null,

		isOnboardingComplete: true,
		onboardingStep: 5, // Assuming 5 steps in onboarding
	};
}

// =============================================================================
// TRANSFORM DATABASE DATA BACK TO ONBOARDING FORMAT
// =============================================================================

export function transformProfileToOnboarding(
	profile: any
): Partial<OnboardingData> {
	const result: Partial<OnboardingData> = {
		basicInfo: {
			name: profile.name,
			email: profile.email,
			profileImage: profile.profileImage,
			location: profile.location,
			bio: profile.bio,
			jobTitle: profile.jobTitle,
			industry: profile.industry,
			education: profile.education,
			phone: profile.phone,
			twitterHandle: profile.twitterHandle,
			linkedinUrl: profile.linkedinUrl,
			githubProfile: profile.githubProfile,
			portfolioWebsite: profile.portfolioWebsite,
			city: profile.city,
			timezone: profile.timezone,
			languages: profile.languages ? profile.languages.split(",").map((lang: string) => lang.trim()) : [],
			employmentStatus: profile.employmentStatus,
		},
		goals: {
			personalGoals: profile.personalGoals ? profile.personalGoals.split(",").map((goal: string) => goal.trim()) : [],
			platformGoals: profile.platformGoals ? profile.platformGoals.split(",").map((goal: string) => goal.trim()) : [],
			primaryGoal: profile.primaryGoal,
			specificNeeds: profile.specificNeeds ? profile.specificNeeds.split(",").map((need: string) => need.trim()) : [],
			timeCommitment: profile.timeCommitment,
			additionalGoals: profile.additionalGoals,
		},
		skills: {
			skills: profile.skills ? profile.skills.split(",").map((skill: string) => skill.trim()) : [],
			experienceLevel: profile.experienceLevel,
			industries: profile.industries ? profile.industries.split(",").map((industry: string) => industry.trim()) : [],
			achievements: profile.achievements,
			expertiseAreas: profile.expertiseAreas,
			certifications: profile.certifications,
		},
		preferences: {
			communicationMethods: profile.communicationMethods ? profile.communicationMethods.split(",").map((method: string) => method.trim()) : [],
			communicationFrequency: profile.communicationFrequency,
			notificationTypes: profile.notificationTypes ? profile.notificationTypes.split(",").map((type: string) => type.trim()) : [],
			themePreference: profile.themePreference,
		},
	};

	// Transform role-specific data back
	if (profile.roleSpecificData) {
		const roleData = profile.roleSpecificData;

		if (roleData.investmentSize) {
			result.investorInfo = {
				investmentSize: roleData.investmentSize,
				preferredStages: roleData.preferredStages || [],
				investmentHistory: roleData.investmentHistory,
				riskAppetite: roleData.riskAppetite,
				portfolioCompanies: roleData.portfolioCompanies,
			};
		} else if (roleData.supportType) {
			result.supporterInfo = {
				supportType: roleData.supportType,
				availability: roleData.availability,
				hourlyRate: roleData.hourlyRate,
				expertise: roleData.expertise,
			};
		}
	}

	return result;
}
