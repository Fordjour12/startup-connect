import { z } from 'zod';
import type { OnboardingData } from '@/schemas/onboarding-schema';
import { stepSchemas } from '@/schemas/onboarding-schema';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  canSkip: boolean;
  validation?: z.ZodSchema;
  dependsOn?: string; // Step that must be completed first
}

export class OnboardingState {
  // Current step tracking
  currentStepIndex = $state(0);
  completedSteps = $state<Set<string>>(new Set());

  // Form data
  formData = $state<Partial<OnboardingData>>({});

  // UI state
  isSubmitting = $state(false);
  errors = $state<Record<string, string>>({});

  // Progress tracking
  totalSteps = $derived(this.steps.length);
  progressPercentage = $derived((this.currentStepIndex / this.totalSteps) * 100);
  isComplete = $derived(this.currentStepIndex >= this.totalSteps - 1);

  // Step definitions
  steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with StartupConnect',
      isRequired: true,
      canSkip: false
    },
    {
      id: 'role',
      title: 'Your Role',
      description: 'Choose how you want to participate',
      isRequired: true,
      canSkip: false,
      validation: stepSchemas.role
    },
    {
      id: 'basicInfo',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      isRequired: true,
      canSkip: false,
      validation: stepSchemas.basicInfo
    },
    {
      id: 'goals',
      title: 'Goals & Objectives',
      description: 'What are you looking to achieve?',
      isRequired: true,
      canSkip: false,
      validation: stepSchemas.goals
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      description: 'What do you bring to the table?',
      isRequired: false,
      canSkip: true,
      validation: stepSchemas.skills
    },
    {
      id: 'preferences',
      title: 'Matching Preferences',
      description: 'How do you prefer to connect?',
      isRequired: false,
      canSkip: true,
      validation: stepSchemas.preferences
    },
    {
      id: 'roleSpecific',
      title: 'Role Details',
      description: 'Tell us more about your specific role',
      isRequired: true,
      canSkip: false,
      dependsOn: 'role'
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Complete your profile',
      isRequired: true,
      canSkip: false
    }
  ];

  // Computed properties
  currentStep = $derived(this.steps[this.currentStepIndex]);
  nextStepData = $derived(this.steps[this.currentStepIndex + 1]);
  previousStepData = $derived(this.steps[this.currentStepIndex - 1]);
  canGoNext = $derived(this.validateCurrentStep());
  canGoPrevious = $derived(this.currentStepIndex > 0);

  constructor() {
    // Load saved progress from database
    this.loadProgress();

    // Auto-save progress every 30 seconds
    setInterval(() => {
      this.saveProgress();
    }, 30000);
  }

  // Navigation methods
  nextStep() {
    if (this.canGoNext && this.currentStepIndex < this.totalSteps - 1) {
      this.completeCurrentStep();
      this.currentStepIndex++;
      this.clearErrors();
    }
  }

  previousStep() {
    if (this.canGoPrevious) {
      this.currentStepIndex--;
      this.clearErrors();
    }
  }

  goToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < this.totalSteps) {
      this.currentStepIndex = stepIndex;
      this.clearErrors();
    }
  }

  // Step completion
  completeCurrentStep() {
    this.completedSteps.add(this.currentStep.id);
    this.saveProgress();
  }

  isStepCompleted(stepId: string): boolean {
    return this.completedSteps.has(stepId);
  }

  // Validation
  validateCurrentStep(): boolean {
    const step = this.currentStep;
    if (!step.validation) return true;

    try {
      step.validation.parse(this.formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {} as Record<string, string>);
      }
      return false;
    }
  }

  validateStep(stepId: string): boolean {
    const step = this.steps.find(s => s.id === stepId);
    if (!step?.validation) return true;

    try {
      step.validation.parse(this.formData);
      return true;
    } catch {
      return false;
    }
  }

  // Form data management
  updateFormData(data: Partial<OnboardingData>) {
    this.formData = { ...this.formData, ...data };
    this.saveProgress();
  }

  setFormData(data: Partial<OnboardingData>) {
    this.formData = data;
    this.saveProgress();
  }

  // Error handling
  setError(field: string, message: string) {
    this.errors[field] = message;
  }

  clearErrors() {
    this.errors = {};
  }

  getError(field: string): string | undefined {
    return this.errors[field];
  }

  // Progress persistence
  async saveProgress() {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStepIndex: this.currentStepIndex,
          completedSteps: Array.from(this.completedSteps),
          formData: this.formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  }

  async loadProgress() {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const { progress } = await response.json();
        if (progress) {
          this.currentStepIndex = progress.currentStepIndex || 0;
          this.completedSteps = new Set(progress.completedSteps || []);
          this.formData = progress.formData || {};
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    }
  }

  async clearProgress() {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear progress');
      }
    } catch (error) {
      console.error('Failed to clear onboarding progress:', error);
    }

    this.currentStepIndex = 0;
    this.completedSteps.clear();
    this.formData = {};
    this.errors = {};
  }



  // Submission
  async submit() {
    this.isSubmitting = true;
    this.clearErrors();

    try {
      // Validate all required steps
      for (const step of this.steps) {
        if (step.isRequired && !this.validateStep(step.id)) {
          throw new Error(`Step "${step.title}" is not complete`);
        }
      }

      // Submit onboarding data via API
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const result = await response.json();

      // Clear progress after successful submission
      await this.clearProgress();

      return { success: true, profileId: result.profileId };
    } catch (error) {
      this.setError('general', error instanceof Error ? error.message : 'An unexpected error occurred');
      return { success: false, error };
    } finally {
      this.isSubmitting = false;
    }
  }

  // Role-specific step handling
  getRoleSpecificStep(): OnboardingStep | undefined {
    const role = this.formData.role;
    if (!role) return undefined;

    return {
      id: 'roleSpecific',
      title: role === 'founder' ? 'Startup Details' :
        role === 'investor' ? 'Investment Profile' : 'Support Services',
      description: role === 'founder' ? 'Tell us about your startup' :
        role === 'investor' ? 'Tell us about your investment criteria' :
          'Tell us about the support you can provide',
      isRequired: true,
      canSkip: false,
      validation: stepSchemas[role as keyof typeof stepSchemas]
    };
  }
}

// Export singleton instance
export const onboardingState = new OnboardingState();
