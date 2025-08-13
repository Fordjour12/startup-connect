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
  profileImage?: string | null;
  location?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  website?: string | null;
  jobTitle?: string | null;
  industry?: string | null;
  education?: string | null;
  phone?: string | null;
  twitterHandle?: string | null;
  githubProfile?: string | null;
  portfolioWebsite?: string | null;
  city?: string | null;
  timezone?: string | null;
  languages?: string | null;
  employmentStatus?: string | null;
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
  skills: string[];
  experienceLevel: "beginner" | "intermediate" | "expert" | "";
  industries?: string[];
  achievements?: string;
  expertiseAreas?: string;
  certifications?: string;
}

export interface Preferences {
  communicationMethods: string[];
  communicationFrequency: string;
  notificationTypes: string[];
  themePreference: string;
}


// Role-specific interfaces (matching the schemas)
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


//extends FounderInfo, InvestorInfo, SupporterInfo
export interface OnboardingData extends InvestorInfo, SupporterInfo {
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
  "founder-setup", // New role-specific step
  "basic-info",
  "goals",
  "skills",
  "preferences",
  "review",
  "completion"
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];

// New: Get dynamic steps based on user role
export const getOnboardingSteps = (role: UserRole | ""): OnboardingStep[] => {
  const baseSteps: OnboardingStep[] = ["welcome", "role-selection"];

  if (role === "founder") {
    const roleSpecificSteps: OnboardingStep[] = ["founder-setup"];
    const commonSteps: OnboardingStep[] = ["basic-info", "goals", "skills", "preferences", "review", "completion"];
    return [...baseSteps, ...roleSpecificSteps, ...commonSteps];
  }

  // For investors and supporters, skip founder-setup
  const commonSteps: OnboardingStep[] = ["basic-info", "goals", "skills", "preferences", "review", "completion"];
  return [...baseSteps, ...commonSteps];
};

// New: Check if a step should be shown for the current role
export const shouldShowStep = (step: OnboardingStep, role: UserRole | ""): boolean => {
  if (step === "founder-setup") {
    return role === "founder";
  }
  return true;
};

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
      website: "",
      jobTitle: "",
      industry: "",
      education: "",
      phone: "",
      twitterHandle: "",
      githubProfile: "",
      portfolioWebsite: "",
      city: "",
      timezone: "",
      languages: "",
      employmentStatus: ""
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
      skills: [],
      experienceLevel: "",
      industries: [],
      achievements: "",
      expertiseAreas: "",
      certifications: "",
    },
    preferences: {
      communicationMethods: [],
      communicationFrequency: "",
      notificationTypes: [],
      themePreference: ""
    },

  });
  visitedSteps = $state<Set<OnboardingStep>>(new Set(["welcome"]));

  // New: Step completion tracking
  stepCompletion = $state<Record<OnboardingStep, boolean>>({
    welcome: false,
    "role-selection": false,
    "founder-setup": false,
    "basic-info": false,
    goals: false,
    skills: false,
    preferences: false,
    review: false,
    completion: false
  });

  // New: Navigation history
  navigationHistory = $state<OnboardingStep[]>(["welcome"]);

  // New: Check if user can access a specific step
  canAccessStep(step: OnboardingStep): boolean {
    const stepIndex = ONBOARDING_STEPS.indexOf(step);
    const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);

    // Can always access current step and previous steps
    if (stepIndex <= currentIndex) return true;

    // Can access next step only if current step is complete
    if (stepIndex === currentIndex + 1) {
      return this.isStepComplete(this.currentStep);
    }

    // Can't skip ahead more than one step
    return false;
  }

  // New: Check if a step is complete
  isStepComplete(step: OnboardingStep): boolean {
    return this.stepCompletion[step] || false;
  }

  // New: Mark a step as complete
  markStepComplete(step: OnboardingStep) {
    this.stepCompletion[step] = true;
    this.saveProgress();
  }

  // New: Mark a step as incomplete (when going back to edit)
  markStepIncomplete(step: OnboardingStep) {
    this.stepCompletion[step] = false;
    this.saveProgress();
  }

  // Enhanced: Save progress to localStorage
  saveProgress() {
    if (typeof window !== 'undefined') {
      try {
        const progressData = {
          currentStep: this.currentStep,
          formData: this.formData,
          stepCompletion: this.stepCompletion,
          visitedSteps: Array.from(this.visitedSteps),
          navigationHistory: this.navigationHistory,
          timestamp: Date.now()
        };
        localStorage.setItem('onboarding_progress', JSON.stringify(progressData));
      } catch (error) {
        console.warn('Failed to save onboarding progress:', error);
      }
    }
  }

  // New: Load progress from localStorage
  loadProgress() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('onboarding_progress');
        if (saved) {
          const progressData = JSON.parse(saved);

          // Check if saved data is recent (within 24 hours)
          const isRecent = Date.now() - progressData.timestamp < 24 * 60 * 60 * 1000;

          if (isRecent) {
            this.currentStep = progressData.currentStep || "welcome";
            this.formData = { ...this.formData, ...progressData.formData };
            this.stepCompletion = { ...this.stepCompletion, ...progressData.stepCompletion };
            this.visitedSteps = new Set(progressData.visitedSteps || ["welcome"]);
            this.navigationHistory = progressData.navigationHistory || ["welcome"];

            console.log('Onboarding progress restored from:', this.currentStep);
            return true;
          } else {
            // Clear old progress
            localStorage.removeItem('onboarding_progress');
          }
        }
      } catch (error) {
        console.warn('Failed to load onboarding progress:', error);
        localStorage.removeItem('onboarding_progress');
      }
    }
    return false;
  }

  // Enhanced: Next step with completion tracking
  nextStep() {
    const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      // Mark current step as complete
      this.markStepComplete(this.currentStep);

      const nextStep = ONBOARDING_STEPS[currentIndex + 1];
      this.currentStep = nextStep;
      this.visitedSteps.add(nextStep);
      this.navigationHistory.push(nextStep);

      // Save progress after navigation
      this.saveProgress();
    }
  }

  // Enhanced: Previous step with validation
  previousStep() {
    const currentIndex = ONBOARDING_STEPS.indexOf(this.currentStep);
    if (currentIndex > 0) {
      const previousStep = ONBOARDING_STEPS[currentIndex - 1];
      this.currentStep = previousStep;

      // Mark current step as incomplete since we're going back to edit
      this.markStepIncomplete(ONBOARDING_STEPS[currentIndex]);

      // Save progress after navigation
      this.saveProgress();
    }
  }

  // Enhanced: Go to specific step with validation
  goToStep(step: OnboardingStep) {
    if (this.canAccessStep(step)) {
      this.currentStep = step;
      this.visitedSteps.add(step);

      // Add to navigation history if not already there
      if (!this.navigationHistory.includes(step)) {
        this.navigationHistory.push(step);
      }

      // Save progress after navigation
      this.saveProgress();
    } else {
      console.warn(`Cannot navigate to step: ${step}`);
    }
  }

  // Enhanced: Update form data with progress saving
  updateFormData(data: Partial<OnboardingData>) {
    this.formData = { ...this.formData, ...data };
    this.saveProgress();
  }

  // Enhanced: Reset with progress clearing
  reset() {
    this.currentStep = "welcome";
    this.formData = {
      role: "",
      basicInfo: {
        name: "",
        email: "",
        profileImage: "",
        location: "",
        bio: "",
        website: "",
        jobTitle: "",
        industry: "",
        education: "",
        phone: "",
        twitterHandle: "",
        githubProfile: "",
        portfolioWebsite: "",
        city: "",
        timezone: "",
        languages: "",
        employmentStatus: "",
      },
      goals: {
        personalGoals: [],
        platformGoals: [],
        primaryGoal: "",
        specificNeeds: [],
        timeCommitment: "",
        additionalGoals: "",
      },
      skills: {
        skills: [],
        experienceLevel: "",
        industries: [],
        achievements: "",
        expertiseAreas: "",
        certifications: "",
      },
      preferences: {
        communicationMethods: [],
        communicationFrequency: "",
        notificationTypes: [],
        themePreference: ""
      },
    };

    this.visitedSteps = new Set(["welcome"]);
    this.navigationHistory = ["welcome"];
    this.stepCompletion = {
      welcome: false,
      "role-selection": false,
      "founder-setup": false,
      "basic-info": false,
      goals: false,
      skills: false,
      preferences: false,
      review: false,
      completion: false
    };

    // Clear saved progress
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_progress');
    }
  }

  // Enhanced: Get progress percentage based on completion
  get progress() {
    const completedSteps = Object.values(this.stepCompletion).filter(Boolean).length;
    return Math.round((completedSteps / ONBOARDING_STEPS.length) * 100);
  }

  // New: Get progress for specific step
  getStepProgress(step: OnboardingStep): number {
    const stepIndex = ONBOARDING_STEPS.indexOf(step);
    const completedBefore = Object.entries(this.stepCompletion)
      .filter(([s, completed]) => completed && ONBOARDING_STEPS.indexOf(s as OnboardingStep) < stepIndex)
      .length;

    return Math.round((completedBefore / stepIndex) * 100);
  }

  // New: Check if onboarding is complete
  get isComplete() {
    return this.currentStep === "completion" &&
      Object.values(this.stepCompletion).every(Boolean);
  }

  // New: Get next incomplete step
  get nextIncompleteStep(): OnboardingStep | null {
    for (const step of ONBOARDING_STEPS) {
      if (!this.stepCompletion[step]) {
        return step;
      }
    }
    return null;
  }

  // Enhanced: Submit with progress clearing
  async submit() {
    try {
      // Mark all steps as complete
      ONBOARDING_STEPS.forEach(step => this.markStepComplete(step));

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

      // Clear saved progress on successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding_progress');
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
