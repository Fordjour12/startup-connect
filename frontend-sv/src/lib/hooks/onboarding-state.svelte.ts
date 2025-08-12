import { USER_ROLES, type UserRole } from "@/db/schema/auth-schema";

// Define the specific roles for onboarding
export const ONBOARDING_ROLES = [
   {
      id: USER_ROLES.FOUNDER,
      title: "Founder",
      description: "I'm building or managing a startup/company",
      icon: "🚀",
      features: [
         "Create and manage your company profile",
         "Post funding opportunities",
         "Connect with potential investors"
      ]
   },
   {
      id: USER_ROLES.INVESTOR,
      title: "Investor",
      description: "I'm looking to invest in startups and companies",
      icon: "💰",
      features: [
         "Discover investment opportunities",
         "Connect with founders",
         "Track your investment portfolio"
      ]
   },
   {
      id: USER_ROLES.SUPPORT,
      title: "Support",
      description: "I'm here to provide support services",
      icon: "🛠️",
      features: [
         "Offer professional services",
         "Connect with clients",
         "Manage your service portfolio"
      ]
   }
];

// Define types for onboarding data
export interface BasicInfo {
   name: string;
   email: string;
   profileImage?: string;
   location?: string;
   bio?: string;
   linkedinUrl?: string;
   website?: string;
}

export interface Goals {
   personalGoals: string[];
   platformGoals: string[];
   primaryGoal?: string;
   specificNeeds?: string[];
   timeCommitment?: string;
   additionalGoals?: string;
}

export interface Skills {
   selectedSkills: string[];
   customSkills: string[];
}

export interface Preferences {
   communicationFrequency: string;
   notificationTypes: string[];
   themePreference: string;
}

/*
// Role-specific interfaces (matching the schemas)
export interface FounderInfo {
  startupName?: string;
  startupStage?: "idea" | "pre_seed" | "seed" | "series_a" | "series_b" | "growth";
  fundingNeeds?: number;
  teamSize?: number;
  startupDescription?: string;
  equityOffered?: number;
}

export interface InvestorInfo {
  investmentSize?: "under_50k" | "50k_100k" | "100k_500k" | "500k_1m" | "1m_plus";
  preferredStages?: ("pre_seed" | "seed" | "series_a" | "series_b" | "growth")[];
  investmentHistory?: string;
  riskAppetite?: "conservative" | "moderate" | "aggressive";
  portfolioCompanies?: number;
}

export interface SupporterInfo {
  supportType?: string[];
  availability?: "one_off" | "ongoing" | "project_based";
  hourlyRate?: number;
  expertise?: string;
}
*/

//extends FounderInfo, InvestorInfo, SupporterInfo 
export interface OnboardingData {
   role: UserRole | "";
   basicInfo: BasicInfo;
   goals: Goals;
   skills: Skills;
   preferences: Preferences;
}


//"role-details",


// Define the onboarding steps
export const ONBOARDING_STEPS = [
   "welcome",
   "role-selection",
   "basic-info",
   "goals",
   "skills",
   "preferences",
   "review",
   "completion"
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];

class OnboardingState {
   currentStep = $state<OnboardingStep>("welcome");
   formData = $state<OnboardingData>({
      role: "",
      basicInfo: {
         name: "",
         email: "",
         profileImage: "",
         location: "",
         bio: "",
         linkedinUrl: "",
         website: ""
      },
      goals: {
         personalGoals: [],
         platformGoals: [],
         primaryGoal: "",
         specificNeeds: [],
         timeCommitment: "",
         additionalGoals: ""
      },
      skills: {
         selectedSkills: [],
         customSkills: []
      },
      preferences: {
         communicationFrequency: "",
         notificationTypes: [],
         themePreference: ""
      },
      // Founder fields
      /*
      startupName: "",
      startupStage: undefined,
      fundingNeeds: undefined,
      teamSize: undefined,
      startupDescription: "",
      equityOffered: undefined,
      // Investor fields
      investmentSize: undefined,
      preferredStages: [],
      investmentHistory: "",
      riskAppetite: undefined,
      portfolioCompanies: undefined,
      // Supporter fields
      supportType: [],
      availability: undefined,
      hourlyRate: undefined,
      expertise: ""
      */
   });
   visitedSteps = $state<Set<OnboardingStep>>(new Set(["welcome"]));

   nextStep() {
      const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);
      if (currentIndex < ONBOARDING_STEPS.length - 1) {
         const nextStep = ONBOARDING_STEPS[currentIndex + 1];
         this.currentStep = nextStep;
         this.visitedSteps.add(nextStep);
      }
   }

   previousStep() {
      const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);
      if (currentIndex > 0) {
         this.currentStep = ONBOARDING_STEPS[currentIndex - 1];
      }
   }

   goToStep(step: OnboardingStep) {
      this.currentStep = step;
      this.visitedSteps.add(step);
   }

   updateFormData(data: Partial<OnboardingData>) {
      this.formData = { ...this.formData, ...data };
   }

   reset() {
      this.currentStep = "welcome";
      this.formData = {
         role: "",
         basicInfo: {
            name: "",
            email: "",
            profileImage: "",
            location: "",
            bio: ""
         },
         goals: {
            personalGoals: [],
            platformGoals: []
         },
         skills: {
            selectedSkills: [],
            customSkills: []
         },
         preferences: {
            communicationFrequency: "",
            notificationTypes: [],
            themePreference: ""
         },

         // Founder fields
         /*
         startupName: "",
         startupStage: undefined,
         fundingNeeds: undefined,
         teamSize: undefined,
         startupDescription: "",
         equityOffered: undefined,
         // Investor fields
         investmentSize: undefined,
         preferredStages: [],
         investmentHistory: "",
         riskAppetite: undefined,
         portfolioCompanies: undefined,
         // Supporter fields
         supportType: [],
         availability: undefined,
         hourlyRate: undefined,
         expertise: ""
         */
      };

      this.visitedSteps = new Set(["welcome"]);
   }

   get progress() {
      const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);
      return Math.round((currentIndex / (ONBOARDING_STEPS.length - 1)) * 100);
   }

   get isComplete() {
      return this.currentStep === "completion";
   }

   async submit() {
      try {
         // Send onboarding data to API
         const response = await fetch("/api/onboarding", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(this.formData),
         });

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.error || "Failed to complete onboarding");
         }

         return { success: true, data: result };
      } catch (error: unknown) {
         console.error("Onboarding submission error:", error);
         if (error instanceof Error) {
            return { success: false, error: error.message || "Failed to complete onboarding" };
         }
         return { success: false, error: "Failed to complete onboarding" };
      }
   }
}

export const onboardingState = new OnboardingState();
