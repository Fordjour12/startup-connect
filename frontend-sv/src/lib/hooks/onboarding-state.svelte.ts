import { z } from 'zod';
import { stepSchemas, getRoleSpecificSchema, type UserRole, type OnboardingData } from '@/schemas/onboarding-schema';
import type {
  OnboardingStep,
  OnboardingError,
  OnboardingProgress,
  ProgressResponse,
  SubmissionResponse
} from '@/types/onboarding';

// OnboardingStep interface is now imported from types file

// Time utilities for better time handling
export class TimeUtils {
  static now(): Date {
    return new Date();
  }

  static timestamp(): number {
    return Date.now();
  }

  static addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  static differenceInSeconds(later: Date, earlier: Date): number {
    return Math.floor((later.getTime() - earlier.getTime()) / 1000);
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }

  static fromISOString(isoString: string): Date {
    return new Date(isoString);
  }
}

// Auto-save configuration
interface AutoSaveConfig {
  intervalSeconds: number;
  minTimeBetweenSavesSeconds: number;
  enabled: boolean;
  maxRetries: number;
  retryDelaySeconds: number;
}

// Progress data structure, API response types, and Error types are now imported from types file

export class OnboardingState {
  // Current step tracking
  currentStepIndex = $state(0);
  completedSteps = $state<Set<string>>(new Set());

  // Form data with proper typing
  formData = $state<Partial<OnboardingData>>({});

  // UI state
  isSubmitting = $state(false);
  errors = $state<Record<string, OnboardingError>>({});
  isLoading = $state(false);

  // Time tracking with proper Date objects
  private lastSaveTime = $state<Date | null>(null);
  private lastAutoSaveAttempt = $state<Date | null>(null);
  private createdAt: Date;

  // Auto-save management with better typing
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null;
  private isPageVisible = $state(true);
  private cleanupVisibilityListeners: (() => void) | null = null;

  private readonly autoSaveConfig: AutoSaveConfig = {
    enabled: true,
    intervalSeconds: 30,
    minTimeBetweenSavesSeconds: 10,
    maxRetries: 3,
    retryDelaySeconds: 5
  };

  // Step definitions with strict typing
  private readonly stepDefinitions: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with StartupConnect',
      isRequired: true,
      canSkip: false,
      order: 0,
      estimatedMinutes: 1,
      icon: 'welcome',
      category: 'basic'
    },
    {
      id: 'role',
      title: 'Your Role',
      description: 'Choose how you want to participate',
      isRequired: true,
      canSkip: false,
      order: 1,
      validation: stepSchemas.role,
      estimatedMinutes: 2,
      icon: 'role',
      category: 'basic'
    },
    {
      id: 'basicInfo',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      isRequired: true,
      canSkip: false,
      order: 2,
      validation: stepSchemas.basicInfo,
      estimatedMinutes: 5,
      icon: 'user',
      category: 'basic'
    },
    {
      id: 'goals',
      title: 'Goals & Objectives',
      description: 'What are you looking to achieve?',
      isRequired: true,
      canSkip: false,
      order: 3,
      validation: stepSchemas.goals,
      estimatedMinutes: 3,
      icon: 'target',
      category: 'preferences'
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      description: 'What do you bring to the table?',
      isRequired: false,
      canSkip: true,
      order: 4,
      validation: stepSchemas.skills,
      estimatedMinutes: 4,
      icon: 'skills',
      category: 'preferences'
    },
    {
      id: 'preferences',
      title: 'Matching Preferences',
      description: 'How do you prefer to connect?',
      isRequired: false,
      canSkip: true,
      order: 5,
      validation: stepSchemas.preferences,
      estimatedMinutes: 3,
      icon: 'preferences',
      category: 'preferences'
    },
    {
      id: 'roleSpecific',
      title: 'Role Details',
      description: 'Tell us more about your specific role',
      isRequired: true,
      canSkip: false,
      order: 6,
      dependsOn: ['role'],
      estimatedMinutes: 8,
      icon: 'details',
      category: 'role_specific'
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Complete your profile',
      isRequired: true,
      canSkip: false,
      order: 7,
      estimatedMinutes: 2,
      icon: 'check',
      category: 'verification'
    }
  ];

  // Computed properties with proper typing
  steps = $derived((): OnboardingStep[] => {
    const role = this.formData.role;
    if (!role) {
      return this.stepDefinitions;
    }

    // Map database role to onboarding role
    const roleMapping: Record<string, string> = {
      'founder': 'founder',
      'investor': 'investor',
      'support': 'supporter', // Map database 'support' to onboarding 'supporter'
      'user': 'founder' // Map Better Auth default 'user' to 'founder'
    };

    const mappedRole = roleMapping[role] || role;

    // Get role-specific step based on mapped role
    let roleSpecificStep: OnboardingStep | undefined;

    try {
      const validation = getRoleSpecificSchema(mappedRole as UserRole);

      const roleConfig = {
        founder: {
          title: 'Startup Details',
          description: 'Tell us about your startup'
        },
        investor: {
          title: 'Investment Profile',
          description: 'Tell us about your investment criteria'
        },
        supporter: {
          title: 'Support Services',
          description: 'Tell us about the support you can provide'
        }
      } as const;

      if (mappedRole in roleConfig) {
        roleSpecificStep = {
          id: 'roleSpecific',
          title: roleConfig[mappedRole as keyof typeof roleConfig].title,
          description: roleConfig[mappedRole as keyof typeof roleConfig].description,
          isRequired: true,
          canSkip: false,
          order: 6,
          validation,
          category: 'role_specific'
        };
      }
    } catch (error) {
      console.warn(`Invalid role for step validation: ${role} (mapped to: ${mappedRole})`, error);
    }

    if (roleSpecificStep) {
      return this.stepDefinitions.map(step =>
        step.id === 'roleSpecific' ? roleSpecificStep : step
      );
    }
    return this.stepDefinitions;
  });

  totalSteps = $derived(this.steps().length);
  progressPercentage = $derived(
    this.totalSteps > 0 ? Math.round((this.currentStepIndex / this.totalSteps) * 100) : 0
  );
  isComplete = $derived(this.currentStepIndex >= this.totalSteps - 1);
  currentStep = $derived((): OnboardingStep | undefined => this.steps()[this.currentStepIndex]);
  nextStepData = $derived((): OnboardingStep | undefined => this.steps()[this.currentStepIndex + 1]);
  previousStepData = $derived((): OnboardingStep | undefined => this.steps()[this.currentStepIndex - 1]);
  canGoNext = $derived(this.validateCurrentStep());
  canGoPrevious = $derived(this.currentStepIndex > 0);

  constructor() {
    this.createdAt = TimeUtils.now();

    // Initialize state
    this.initializeState();
  }

  private async initializeState(): Promise<void> {
    try {
      this.isLoading = true;

      // Load saved progress from database
      await this.loadProgress();

      // Initialize auto-save functionality
      this.initializeAutoSave();

      // Set up page visibility detection
      this.setupVisibilityDetection();
    } catch (error) {
      this.handleError({
        type: 'general',
        message: 'Failed to initialize onboarding state',
        field: 'initialization'
      });
    } finally {
      this.isLoading = false;
    }
  }

  // Auto-save management with better time handling
  private initializeAutoSave(): void {
    if (!this.autoSaveConfig.enabled) return;

    // Clear any existing interval
    this.clearAutoSaveInterval();

    // Start auto-save interval
    this.autoSaveInterval = setInterval(() => {
      this.performAutoSave();
    }, this.autoSaveConfig.intervalSeconds * 1000);
  }

  private clearAutoSaveInterval(): void {
    if (this.autoSaveInterval !== null) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  private setupVisibilityDetection(): void {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      this.isPageVisible = !document.hidden;

      if (this.isPageVisible) {
        // Resume auto-save when page becomes visible
        this.initializeAutoSave();
      } else {
        // Pause auto-save and save current state when page is hidden
        this.clearAutoSaveInterval();
        this.performAutoSave();
      }
    };

    const handleBeforeUnload = () => {
      this.clearAutoSaveInterval();
      // Force save on page unload (synchronous)
      this.saveProgressSync();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Store cleanup function
    this.cleanupVisibilityListeners = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }

  private async performAutoSave(): Promise<void> {
    // Only auto-save if page is visible and enabled
    if (!this.isPageVisible || !this.autoSaveConfig.enabled) return;

    const now = TimeUtils.now();

    // Check if enough time has passed since last save
    if (this.lastSaveTime) {
      const timeSinceLastSave = TimeUtils.differenceInSeconds(now, this.lastSaveTime);
      if (timeSinceLastSave < this.autoSaveConfig.minTimeBetweenSavesSeconds) return;
    }

    // Check if we recently attempted an auto-save (prevent spam)
    if (this.lastAutoSaveAttempt) {
      const timeSinceLastAttempt = TimeUtils.differenceInSeconds(now, this.lastAutoSaveAttempt);
      if (timeSinceLastAttempt < 5) return; // Don't attempt more than once every 5 seconds
    }

    this.lastAutoSaveAttempt = now;

    try {
      await this.saveProgress();
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show user-facing errors for auto-save failures
    }
  }

  // Cleanup method
  destroy(): void {
    this.clearAutoSaveInterval();
    if (this.cleanupVisibilityListeners) {
      this.cleanupVisibilityListeners();
    }
  }

  // Navigation methods with better error handling
  nextStep(): boolean {
    if (!this.canGoNext || this.currentStepIndex >= this.totalSteps - 1) {
      return false;
    }

    try {
      this.completeCurrentStep();
      this.currentStepIndex++;
      this.clearErrors();
      return true;
    } catch (error) {
      this.handleError({
        type: 'general',
        message: 'Failed to proceed to next step'
      });
      return false;
    }
  }

  previousStep(): boolean {
    if (!this.canGoPrevious) {
      return false;
    }

    try {
      this.currentStepIndex--;
      this.clearErrors();
      return true;
    } catch (error) {
      this.handleError({
        type: 'general',
        message: 'Failed to go to previous step'
      });
      return false;
    }
  }

  goToStep(stepIndex: number): boolean {
    if (stepIndex < 0 || stepIndex >= this.totalSteps) {
      return false;
    }

    try {
      this.currentStepIndex = stepIndex;
      this.clearErrors();
      return true;
    } catch (error) {
      this.handleError({
        type: 'general',
        message: 'Failed to navigate to step'
      });
      return false;
    }
  }

  // Step completion with time tracking
  completeCurrentStep(): void {
    const current = this.currentStep();
    if (!current) return;

    this.completedSteps.add(current.id);
    this.saveProgress(); // Save immediately when step is completed
  }

  isStepCompleted(stepId: string): boolean {
    return this.completedSteps.has(stepId);
  }

  // Enhanced validation with better error handling
  validateCurrentStep(): boolean {
    const step = this.currentStep();
    if (!step?.validation) return true;

    try {
      step.validation.parse(this.formData);
      // Clear validation errors for this step if validation passes
      this.clearValidationErrors();
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const validationErrors: Record<string, OnboardingError> = {};
        error.errors.forEach(err => {
          const fieldPath = err.path.join('.');
          validationErrors[fieldPath] = {
            type: 'validation',
            message: err.message,
            field: fieldPath,
            timestamp: TimeUtils.now()
          };
        });
        this.errors = { ...this.errors, ...validationErrors };
      }
      return false;
    }
  }

  validateStep(stepId: string): boolean {
    const step = this.steps().find((s: OnboardingStep) => s.id === stepId);
    if (!step?.validation) return true;

    try {
      step.validation.parse(this.formData);
      return true;
    } catch {
      return false;
    }
  }

  // Form data management with time tracking
  updateFormData(data: Partial<OnboardingData>): void {
    this.formData = { ...this.formData, ...data };
    // Debounced save - will be handled by auto-save
  }

  setFormData(data: Partial<OnboardingData>): void {
    this.formData = data;
    this.saveProgress(); // Save immediately when setting complete form data
  }

  // Enhanced error handling
  private handleError(error: Omit<OnboardingError, 'timestamp'>): void {
    const errorWithTimestamp: OnboardingError = {
      ...error,
      timestamp: TimeUtils.now()
    };

    if (error.field) {
      this.errors[error.field] = errorWithTimestamp;
    } else {
      this.errors['general'] = errorWithTimestamp;
    }
  }

  setError(field: string, message: string, type: OnboardingError['type'] = 'general'): void {
    this.errors[field] = {
      type,
      message,
      field,
      timestamp: TimeUtils.now()
    };
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearValidationErrors(): void {
    const filteredErrors: Record<string, OnboardingError> = {};
    Object.entries(this.errors).forEach(([key, error]) => {
      if (error.type !== 'validation') {
        filteredErrors[key] = error;
      }
    });
    this.errors = filteredErrors;
  }

  getError(field: string): OnboardingError | undefined {
    return this.errors[field];
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  // Progress persistence with better error handling and time tracking
  async saveProgress(): Promise<boolean> {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return false;

      const now = TimeUtils.now();
      const progressData = {
        formData: this.formData,
        currentStepIndex: this.currentStepIndex,
        completedSteps: Array.from(this.completedSteps)
      };

      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save progress');
      }

      // Update last save time on success
      this.lastSaveTime = now;
      return true;
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
      this.handleError({
        type: 'network',
        message: 'Failed to save progress. Your changes may be lost.',
        field: 'save'
      });
      return false;
    }
  }

  // Synchronous save for page unload
  private saveProgressSync(): void {
    try {
      if (typeof window === 'undefined') return;

      const now = TimeUtils.now();
      const progressData = {
        formData: this.formData,
        currentStepIndex: this.currentStepIndex,
        completedSteps: Array.from(this.completedSteps)
      };

      // Use sendBeacon for reliable delivery during page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/onboarding/save', JSON.stringify(progressData));
      }
    } catch (error) {
      console.error('Failed to save progress synchronously:', error);
    }
  }

  async loadProgress(): Promise<void> {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return;

      const response = await fetch('/api/onboarding/load', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          this.currentStepIndex = data.data.currentStepIndex || 0;
          this.completedSteps = new Set(data.data.completedSteps || []);
          this.formData = data.data.formData || {};

          // Parse the last updated time
          if (data.data.updatedAt) {
            this.lastSaveTime = new Date(data.data.updatedAt);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
      this.handleError({
        type: 'network',
        message: 'Failed to load saved progress',
        field: 'load'
      });
    }
  }

  async clearProgress(): Promise<boolean> {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return false;

      const response = await fetch('/api/onboarding/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear progress');
      }

      // Reset local state
      this.currentStepIndex = 0;
      this.completedSteps.clear();
      this.formData = {};
      this.errors = {};
      this.lastSaveTime = null;
      this.lastAutoSaveAttempt = null;

      return true;
    } catch (error) {
      console.error('Failed to clear onboarding progress:', error);
      this.handleError({
        type: 'network',
        message: 'Failed to clear progress',
        field: 'clear'
      });
      return false;
    }
  }

  // Enhanced submission with better error handling
  async submit(): Promise<SubmissionResponse> {
    this.isSubmitting = true;
    this.clearErrors();

    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        throw new Error('Cannot submit from server side');
      }

      // Validate all required steps
      const invalidSteps: string[] = [];
      for (const step of this.steps()) {
        if (step.isRequired && !this.validateStep(step.id)) {
          invalidSteps.push(step.title);
        }
      }

      if (invalidSteps.length > 0) {
        throw new Error(`Please complete the following required steps: ${invalidSteps.join(', ')}`);
      }

      // Submit onboarding data via API
      const response = await fetch('/api/onboarding/submit', {
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

      return {
        success: true,
        profileId: result.profileId,
        timestamp: TimeUtils.toISOString(TimeUtils.now())
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      this.handleError({
        type: 'server',
        message: errorMessage,
        field: 'submission'
      });
      return {
        success: false,
        error: errorMessage,
        timestamp: TimeUtils.toISOString(TimeUtils.now())
      };
    } finally {
      this.isSubmitting = false;
    }
  }



  // Utility methods
  getStepProgress(): { completed: number; total: number; percentage: number } {
    const completed = this.completedSteps.size;
    const total = this.steps().filter((step: OnboardingStep) => step.isRequired).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  getTimeSpentOnboarding(): number {
    const now = TimeUtils.now();
    return TimeUtils.differenceInSeconds(now, this.createdAt);
  }

  canSkipCurrentStep(): boolean {
    const current = this.currentStep();
    return current?.canSkip ?? false;
  }

  skipCurrentStep(): boolean {
    if (!this.canSkipCurrentStep()) return false;

    return this.nextStep();
  }
}

// Export singleton instance
export const onboardingState = new OnboardingState();
