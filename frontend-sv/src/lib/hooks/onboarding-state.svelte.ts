import { browser } from '$app/environment';
import type { OnboardingData, UserRole } from '@/z-schema/onboarding-schema';
import {
  roleSelectionSchema,
  basicInfoSchema,
  goalsSchema,
  skillsSchema,
  preferencesSchema,
  investorSchema,
  supporterSchema,
  onboardingSchema
} from '@/z-schema/onboarding-schema';

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

export type OnboardingStep =
  | 'welcome'
  | 'role-selection'
  | 'basic-info'
  | 'role-specific'
  | 'goals'
  | 'skills'
  | 'preferences'
  | 'review'
  | 'completion';

export type StepValidationResult = {
  isValid: boolean;
  errors?: string[];
};

const STORAGE_KEY = 'startup_connect_onboarding_progress';

// =============================================================================
// ONBOARDING STATE CLASS
// =============================================================================

class OnboardingState {
  // Core state
  currentStep = $state<OnboardingStep>('welcome');
  formData = $state<Partial<OnboardingData>>({
    role: undefined,
    basicInfo: undefined,
    goals: {
      personalGoals: [],
      platformGoals: [],
      specificNeeds: [],
      primaryGoal: '',
      timeCommitment: ''
    },
    skills: {
      skills: [],
      industries: [],
      experienceLevel: 'beginner'
    },
    preferences: {
      communicationMethods: [],
      notificationTypes: [],
      communicationFrequency: '',
      themePreference: ''
    },
    investorInfo: undefined,
    supporterInfo: undefined
  });

  // Step completion tracking
  stepCompletion = $state<Record<OnboardingStep, boolean>>({
    'welcome': false,
    'role-selection': false,
    'basic-info': false,
    'role-specific': false,
    'goals': false,
    'skills': false,
    'preferences': false,
    'review': false,
    'completion': false
  });

  // Navigation state
  navigationHistory = $state<OnboardingStep[]>(['welcome']);
  isLoading = $state(false);
  isSaving = $state(false);

  constructor(initialUserData?: { name?: string; email?: string }) {
    // Initialize with user data if provided
    if (initialUserData?.name || initialUserData?.email) {
      this.formData.basicInfo = {
        name: initialUserData.name || '',
        email: initialUserData.email || '',
        profileImage: null,
        location: '',
        bio: '',
        jobTitle: '',
        industry: '',
        education: '',
        phone: '',
        twitterHandle: '',
        linkedinUrl: '',
        githubProfile: '',
        portfolioWebsite: '',
        city: '',
        timezone: '',
        languages: [],
        employmentStatus: ''
      };
    }

    // Load progress from localStorage on initialization
    if (browser) {
      this.loadProgress();
    }
  }

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  get availableSteps(): OnboardingStep[] {
    const baseSteps: OnboardingStep[] = ['welcome', 'role-selection'];

    if (!this.formData.role) {
      return baseSteps;
    }

    const commonSteps: OnboardingStep[] = ['basic-info', 'role-specific', 'goals', 'skills', 'preferences', 'review', 'completion'];

    //console.log("availableSteps", baseSteps, commonSteps);

    return [...baseSteps, ...commonSteps];
  }

  get currentStepIndex(): number {
    return this.availableSteps.indexOf(this.currentStep);
  }

  get totalSteps(): number {
    return this.availableSteps.length;
  }

  get progressPercentage(): number {
    if (this.totalSteps === 0) return 0;
    return Math.round(((this.currentStepIndex + 1) / this.totalSteps) * 100);
  }

  get completedStepsCount(): number {
    return Object.values(this.stepCompletion).filter(Boolean).length;
  }

  get canGoBack(): boolean {
    return this.currentStepIndex > 0;
  }

  get canGoForward(): boolean {
    return this.currentStepIndex < this.totalSteps - 1 && this.isCurrentStepValid();
  }

  get nextStep(): OnboardingStep | null {
    const nextIndex = this.currentStepIndex + 1;
    return nextIndex < this.availableSteps.length ? this.availableSteps[nextIndex] : null;
  }

  get previousStep(): OnboardingStep | null {
    const prevIndex = this.currentStepIndex - 1;
    return prevIndex >= 0 ? this.availableSteps[prevIndex] : null;
  }

  // =============================================================================
  // NAVIGATION METHODS
  // =============================================================================

  async goToStep(step: OnboardingStep): Promise<void> {
    if (!this.canNavigateToStep(step)) {
      console.warn(`Cannot navigate to step: ${step}`);
      return;
    }

    // Save current progress before navigating
    await this.saveProgress();

    // Update navigation history
    if (!this.navigationHistory.includes(step)) {
      this.navigationHistory.push(step);
    }

    this.currentStep = step;
  }

  async goNext(): Promise<void> {
    console.log("goNext", this.currentStep, this.canGoForward);

    // Mark current step as complete if valid
    if (this.isCurrentStepValid()) {
      this.markStepComplete(this.currentStep);
    }

    const next = this.nextStep;
    if (next) {
      console.log("Navigating to next step:", next);
      await this.goToStep(next);
    } else {
      console.log("No next step available");
    }
  }

  async goBack(): Promise<void> {
    if (!this.canGoBack) return;

    const previous = this.previousStep;
    if (previous) {
      await this.goToStep(previous);
    }
  }

  canNavigateToStep(step: OnboardingStep): boolean {
    const stepIndex = this.availableSteps.indexOf(step);

    // Can't navigate to non-existent step
    if (stepIndex === -1) return false;

    // Can always go back to previous steps
    if (stepIndex <= this.currentStepIndex) return true;

    // Can only go forward if current step is valid
    if (stepIndex === this.currentStepIndex + 1) {
      return this.isCurrentStepValid();
    }

    // Can't skip steps
    return false;
  }

  // =============================================================================
  // VALIDATION METHODS
  // =============================================================================

  isCurrentStepValid(): boolean {
    return this.validateStep(this.currentStep).isValid;
  }

  validateStep(step: OnboardingStep): StepValidationResult {
    switch (step) {
      case 'welcome':
        return { isValid: true };

      case 'role-selection':
        try {
          roleSelectionSchema.parse({ role: this.formData.role });
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Invalid role selection']
          };
        }

      case 'basic-info':
        // If basicInfo is not set at all, consider it valid (user hasn't started this step)
        if (!this.formData.basicInfo) {
          return { isValid: true };
        }

        try {
          // Check if required fields are present
          const basicInfo = this.formData.basicInfo;
          if (!basicInfo || !basicInfo.name || !basicInfo.email) {
            return { isValid: false, errors: ['Name and email are required'] };
          }
          const result = basicInfoSchema.parse(basicInfo);
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Invalid basic information']
          };
        }

      case 'role-specific':
        return this.validateRoleSpecificData();

      case 'goals':
        try {
          goalsSchema.parse(this.formData.goals || {});
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Invalid goals']
          };
        }

      case 'skills':
        try {
          skillsSchema.parse(this.formData.skills || {});
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Invalid skills']
          };
        }

      case 'preferences':
        try {
          preferencesSchema.parse(this.formData.preferences || {});
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Invalid preferences']
          };
        }

      case 'review':
        try {
          onboardingSchema.parse(this.formData);
          return { isValid: true };
        } catch (error: any) {
          return {
            isValid: false,
            errors: error.errors?.map((e: any) => e.message) || ['Please complete all required fields']
          };
        }

      case 'completion':
        return { isValid: true };

      default:
        return { isValid: false, errors: ['Unknown step'] };
    }
  }

  private validateRoleSpecificData(): StepValidationResult {
    if (!this.formData.role) {
      return { isValid: false, errors: ['Please select a role first'] };
    }

    try {
      switch (this.formData.role) {
        case 'investor':
          if (this.formData.investorInfo) {
            investorSchema.parse(this.formData.investorInfo);
          }
          // investorInfo is optional in schema, so we don't require it
          break;
        case 'support':
          if (this.formData.supporterInfo) {
            supporterSchema.parse(this.formData.supporterInfo);
          }
          // supporterInfo is optional in schema, so we don't require it
          break;
        case 'founder':
          // No specific validation needed for founder yet
          return { isValid: true };
        default:
          return { isValid: false, errors: ['Invalid role selected'] };
      }
      return { isValid: true };
    } catch (error: any) {
      return {
        isValid: false,
        errors: error.errors?.map((e: any) => e.message) || ['Invalid role-specific information']
      };
    }
  }

  // =============================================================================
  // DATA MANAGEMENT
  // =============================================================================

  updateFormData(stepData: Partial<OnboardingData>): void {
    this.formData = { ...this.formData, ...stepData };

    // Auto-save progress
    if (browser) {
      this.saveProgress();
    }
  }

  updateRoleSpecificData(role: UserRole, data: any): void {
    switch (role) {
      case 'investor':
        this.formData.investorInfo = data;
        break;
      case 'support':
        this.formData.supporterInfo = data;
        break;
      case 'founder':
        // Future implementation
        break;
    }

    if (browser) {
      this.saveProgress();
    }
  }

  markStepComplete(step: OnboardingStep): void {
    this.stepCompletion[step] = true;
  }

  // =============================================================================
  // PERSISTENCE METHODS
  // =============================================================================

  async saveProgress(): Promise<void> {
    if (!browser) return;

    this.isSaving = true;

    try {
      const progressData = {
        currentStep: this.currentStep,
        formData: this.formData,
        stepCompletion: this.stepCompletion,
        navigationHistory: this.navigationHistory,
        lastSaved: new Date().toISOString()
      };

      console.log(progressData);
      //localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));

      // TODO: Also save to API endpoint for cross-device sync
      // await this.saveToAPI(progressData);
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    } finally {
      this.isSaving = false;
    }
  }

  loadProgress(): void {
    if (!browser) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const progressData = JSON.parse(saved);

      // Validate that the saved data has the correct structure
      if (typeof progressData !== 'object' || progressData === null) {
        console.warn('Invalid onboarding progress data format');
        this.clearProgress();
        return;
      }

      // Validate formData structure
      if (progressData.formData && typeof progressData.formData === 'object') {
        // Ensure all required fields exist with proper defaults
        this.formData = {
          role: progressData.formData.role,
          basicInfo: progressData.formData.basicInfo ? {
            ...progressData.formData.basicInfo,
            // Ensure languages is always an array
            languages: Array.isArray(progressData.formData.basicInfo.languages)
              ? progressData.formData.basicInfo.languages
              : typeof progressData.formData.basicInfo.languages === 'string'
                ? progressData.formData.basicInfo.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0)
                : []
          } : undefined,
          goals: {
            personalGoals: Array.isArray(progressData.formData.goals?.personalGoals)
              ? progressData.formData.goals.personalGoals
              : [],
            platformGoals: Array.isArray(progressData.formData.goals?.platformGoals)
              ? progressData.formData.goals.platformGoals
              : [],
            specificNeeds: Array.isArray(progressData.formData.goals?.specificNeeds)
              ? progressData.formData.goals.specificNeeds
              : [],
            primaryGoal: typeof progressData.formData.goals?.primaryGoal === 'string'
              ? progressData.formData.goals.primaryGoal
              : '',
            timeCommitment: typeof progressData.formData.goals?.timeCommitment === 'string'
              ? progressData.formData.goals.timeCommitment
              : ''
          },
          skills: {
            skills: Array.isArray(progressData.formData.skills?.skills)
              ? progressData.formData.skills.skills
              : [],
            industries: Array.isArray(progressData.formData.skills?.industries)
              ? progressData.formData.skills.industries
              : [],
            experienceLevel: typeof progressData.formData.skills?.experienceLevel === 'string'
              ? progressData.formData.skills.experienceLevel
              : 'beginner'
          },
          preferences: {
            communicationMethods: Array.isArray(progressData.formData.preferences?.communicationMethods)
              ? progressData.formData.preferences.communicationMethods
              : [],
            notificationTypes: Array.isArray(progressData.formData.preferences?.notificationTypes)
              ? progressData.formData.preferences.notificationTypes
              : [],
            communicationFrequency: typeof progressData.formData.preferences?.communicationFrequency === 'string'
              ? progressData.formData.preferences.communicationFrequency
              : '',
            themePreference: typeof progressData.formData.preferences?.themePreference === 'string'
              ? progressData.formData.preferences.themePreference
              : ''
          },
          investorInfo: progressData.formData.investorInfo,
          supporterInfo: progressData.formData.supporterInfo
        };
      }

      // Validate currentStep is a valid step
      const validSteps: OnboardingStep[] = [
        'welcome', 'role-selection', 'basic-info', 'role-specific',
        'goals', 'skills', 'preferences', 'review', 'completion'
      ];
      if (progressData.currentStep && validSteps.includes(progressData.currentStep)) {
        this.currentStep = progressData.currentStep;
      } else {
        this.currentStep = 'welcome';
      }

      // Validate stepCompletion structure
      if (progressData.stepCompletion && typeof progressData.stepCompletion === 'object') {
        const completion: Record<OnboardingStep, boolean> = {
          'welcome': Boolean(progressData.stepCompletion['welcome']),
          'role-selection': Boolean(progressData.stepCompletion['role-selection']),
          'basic-info': Boolean(progressData.stepCompletion['basic-info']),
          'role-specific': Boolean(progressData.stepCompletion['role-specific']),
          'goals': Boolean(progressData.stepCompletion['goals']),
          'skills': Boolean(progressData.stepCompletion['skills']),
          'preferences': Boolean(progressData.stepCompletion['preferences']),
          'review': Boolean(progressData.stepCompletion['review']),
          'completion': Boolean(progressData.stepCompletion['completion'])
        };
        this.stepCompletion = completion;
      }

      // Validate navigationHistory structure
      if (Array.isArray(progressData.navigationHistory)) {
        const validHistory = progressData.navigationHistory.filter((step: any) =>
          validSteps.includes(step)
        );
        if (validHistory.length > 0) {
          this.navigationHistory = validHistory as OnboardingStep[];
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
      // Clear corrupted data
      this.clearProgress();
    }
  }

  clearProgress(): void {
    if (browser) {
      localStorage.removeItem(STORAGE_KEY);
    }

    // Reset to initial state
    this.currentStep = 'welcome';
    this.formData = {
      role: undefined,
      basicInfo: undefined,
      goals: {
        personalGoals: [],
        platformGoals: [],
        specificNeeds: [],
        primaryGoal: '',
        timeCommitment: ''
      },
      skills: {
        skills: [],
        industries: [],
        experienceLevel: 'beginner'
      },
      preferences: {
        communicationMethods: [],
        notificationTypes: [],
        communicationFrequency: '',
        themePreference: ''
      },
      investorInfo: undefined,
      supporterInfo: undefined
    };
    this.stepCompletion = {
      'welcome': false,
      'role-selection': false,
      'basic-info': false,
      'role-specific': false,
      'goals': false,
      'skills': false,
      'preferences': false,
      'review': false,
      'completion': false
    };
    this.navigationHistory = ['welcome'];
  }

  // =============================================================================
  // API INTEGRATION
  // =============================================================================

  async submitOnboarding(): Promise<{ success: boolean; error?: string }> {
    this.isLoading = true;

    try {
      // Final validation
      const validation = this.validateStep('review');
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors?.join(', ') || 'Please complete all required fields'
        };
      }

      // Submit to API
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit onboarding');
      }

      // Mark as complete and clear progress
      this.markStepComplete('completion');
      this.currentStep = 'completion';

      return { success: true };
    } catch (error: any) {
      console.error('Failed to submit onboarding:', error);
      return { success: false, error: error.message };
    } finally {
      this.isLoading = false;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getStepTitle(step: OnboardingStep): string {
    const titles: Record<OnboardingStep, string> = {
      'welcome': 'Welcome',
      'role-selection': 'Choose Your Role',
      'basic-info': 'Basic Information',
      'role-specific': 'Role-Specific Details',
      'goals': 'Your Goals',
      'skills': 'Skills & Experience',
      'preferences': 'Preferences',
      'review': 'Review & Confirm',
      'completion': 'Welcome to Startup Connect!'
    };
    return titles[step];
  }

  getStepDescription(step: OnboardingStep): string {
    const descriptions: Record<OnboardingStep, string> = {
      'welcome': 'Let\'s get you set up on Startup Connect',
      'role-selection': 'Tell us how you\'d like to participate',
      'basic-info': 'Share some information about yourself',
      'role-specific': 'Tell us more about your specific interests',
      'goals': 'What do you hope to achieve?',
      'skills': 'What expertise do you bring?',
      'preferences': 'How would you like to communicate?',
      'review': 'Make sure everything looks good',
      'completion': 'You\'re all set!'
    };
    return descriptions[step];
  }

  hasUnsavedChanges(): boolean {
    // Simple check - in a real app you might want more sophisticated change detection
    return Object.values(this.formData).some(value =>
      value && (typeof value === 'object' ? Object.keys(value).length > 0 : true)
    );
  }
}

// =============================================================================
// SINGLETON INSTANCE & EXPORT
// =============================================================================

export { OnboardingState };

let onboardingState: OnboardingState;

export function getOnboardingState(initialUserData?: { name?: string; email?: string }): OnboardingState {
  if (!onboardingState) {
    onboardingState = new OnboardingState(initialUserData);
  }
  return onboardingState;
}

// Export for convenience
export const useOnboarding = getOnboardingState;
