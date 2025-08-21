import { browser } from '$app/environment';
import type { OnboardingData, UserRole } from '@/z-schema/onboarding-schema';

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

const STORAGE_KEY = 'startup_connect_onboarding_progress';
const STATE_VERSION = '0.0.1';
const MAX_RETRY_ATTEMPTS = 3;

// Storage operation result type
type StorageResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// State validation result type
type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

// Error types for better error handling
enum OnboardingError {
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  DATA_CORRUPTED = 'DATA_CORRUPTED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  MIGRATION_FAILED = 'MIGRATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Safely parse JSON with error handling
 */
function safeJsonParse(data: string): { success: boolean; data?: any; error?: string } {
  try {
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return {
      success: false,
      error: `JSON parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (!browser) return false;

  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage quota information
 */
function getStorageQuota(): { used: number; available: number; total: number } | null {
  if (!browser) return null;

  try {
    // Try to estimate storage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Estimate available space (rough approximation)
    const maxSize = 5 * 1024 * 1024; // 5MB is a common limit
    return {
      used: totalSize,
      available: Math.max(0, maxSize - totalSize),
      total: maxSize
    };
  } catch {
    return null;
  }
}

// =============================================================================
// DATA VALIDATION
// =============================================================================

class DataValidator {
  /**
   * Validate onboarding data structure
   */
  static validateOnboardingData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check basic structure
    if (!data || typeof data !== 'object') {
      errors.push('Data must be an object');
      return { isValid: false, errors, warnings };
    }

    // Validate currentStep
    if (!data.currentStep) {
      errors.push('Missing currentStep');
    } else if (!this.isValidStep(data.currentStep)) {
      errors.push(`Invalid currentStep: ${data.currentStep}`);
    }

    // Validate formData
    if (!data.formData) {
      errors.push('Missing formData');
    } else {
      // Validate role if present
      if (data.formData.role && !['founder', 'investor', 'support'].includes(data.formData.role)) {
        errors.push(`Invalid role: ${data.formData.role}`);
      }
    }

    // Validate completedSteps
    if (!Array.isArray(data.completedSteps)) {
      errors.push('completedSteps must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if step is valid
   */
  private static isValidStep(step: string): boolean {
    const validSteps: OnboardingStep[] = [
      'welcome', 'role-selection', 'basic-info', 'role-specific',
      'goals', 'skills', 'preferences', 'review', 'completion'
    ];
    return validSteps.includes(step as OnboardingStep);
  }
}

// =============================================================================
// STORAGE MANAGER
// =============================================================================

class StorageManager {
  private retryAttempts: Map<string, number> = new Map();

  /**
   * Load data from localStorage with error handling
   */
  async load<T>(key: string, defaultValue: T): Promise<StorageResult<T>> {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: OnboardingError.STORAGE_UNAVAILABLE
      };
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return { success: true, data: defaultValue };
      }

      const parseResult = safeJsonParse(item);
      if (!parseResult.success) {
        throw new Error(parseResult.error);
      }

      // Validate data structure
      const validation = DataValidator.validateOnboardingData(parseResult.data);
      if (!validation.isValid) {
        console.warn(`Data validation failed for key ${key}:`, validation.errors);
        // Use default value if validation fails
        return { success: true, data: defaultValue };
      }

      return { success: true, data: parseResult.data };

    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      return {
        success: false,
        error: `Load failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Save data to localStorage with error handling
   */
  async save<T>(key: string, data: T): Promise<StorageResult<void>> {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: OnboardingError.STORAGE_UNAVAILABLE
      };
    }

    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      return { success: true };

    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);

      // Handle specific storage errors
      if (error instanceof DOMException) {
        if (error.code === 22 || error.name === 'QuotaExceededError') {
          return {
            success: false,
            error: OnboardingError.STORAGE_QUOTA_EXCEEDED
          };
        }
      }

      return {
        success: false,
        error: `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Clear data from localStorage
   */
  clear(key: string): StorageResult<void> {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: OnboardingError.STORAGE_UNAVAILABLE
      };
    }

    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// =============================================================================
// PRODUCTION-GRADE ONBOARDING STATE CLASS
// =============================================================================

class OnboardingState {
  // Storage manager instance
  private storageManager: StorageManager;

  // Core state
  currentStep = $state<OnboardingStep>('welcome');
  formData = $state<Partial<OnboardingData>>({
    role: undefined,
    basicInfo: undefined,
    goals: {
      personalGoals: ['Build Network'], // Default personal goal
      platformGoals: [],
      specificNeeds: ['Mentorship'], // Default specific need
      primaryGoal: '',
      timeCommitment: ''
    },
    skills: {
      skills: ['Communication'], // Default skill
      industries: ['Technology'], // Default industry
      experienceLevel: 'Beginner'
    },
    preferences: {
      communicationMethods: ['Email'], // Default communication method
      notificationTypes: ['New Matches', 'Messages'], // Default notification types
      communicationFrequency: '',
      themePreference: ''
    },
    investorInfo: undefined,
    supporterInfo: undefined
  });

  // Track completed steps for validation
  completedSteps = $state<Set<OnboardingStep>>(new Set(['welcome']));

  // State management
  isLoading = $state(false);
  lastSavedAt = $state<Date | null>(null);
  errors = $state<string[]>([]);
  storageAvailable = $state(true);

  // Debug info
  private debugMode = $state(false);
  private stateHistory = $state<Array<{ timestamp: Date; action: string; step: OnboardingStep }>>([]);

  constructor(initialUserData?: { name?: string; email?: string }) {
    this.storageManager = new StorageManager();

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

    // Initialize storage availability
    this.storageAvailable = isStorageAvailable();

    // Load progress from localStorage on initialization
    if (browser && this.storageAvailable) {
      // Initialize from storage asynchronously
      this.initializeFromStorage().catch(error => {
        console.error('Failed to initialize from storage:', error);
      });
    }
  }

  /**
   * Initialize state from storage with error handling
   */
  async initializeFromStorage(): Promise<void> {
    try {
      const loadResult = await this.storageManager.load(STORAGE_KEY, this.getDefaultState());

      if (loadResult.success && loadResult.data) {
        this.applyLoadedData(loadResult.data);
      } else {
        console.warn('Failed to load saved data, using defaults:', loadResult.error);
        this.errors.push(`Storage load failed: ${loadResult.error}`);
      }

      // Validate and repair any corrupted data
      this.validateAndRepairData();

      // Ensure user is on a valid step
      this.ensureValidStep();

    } catch (error) {
      console.error('Failed to initialize from storage:', error);
      this.errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get default state structure
   */
  private getDefaultState() {
    return {
      currentStep: 'welcome' as OnboardingStep,
      formData: this.formData,
      completedSteps: Array.from(this.completedSteps),
      version: STATE_VERSION,
      lastSaved: new Date().toISOString()
    };
  }

  /**
   * Apply loaded data to current state
   */
  private applyLoadedData(data: any): void {
    try {
      if (data.currentStep && this.isStepAccessible(data.currentStep)) {
        this.currentStep = data.currentStep;
      }

      if (data.formData) {
        // Merge form data carefully
        this.formData = { ...this.formData, ...data.formData };
      }

      if (data.completedSteps && Array.isArray(data.completedSteps)) {
        const validSteps = data.completedSteps.filter((step: string) =>
          this.isStepAccessible(step as OnboardingStep)
        );
        this.completedSteps = new Set(validSteps.map((step: string) => step as OnboardingStep));
      }

      if (data.lastSaved) {
        this.lastSavedAt = new Date(data.lastSaved);
      }

      this.addToHistory('load', this.currentStep);

    } catch (error) {
      console.error('Failed to apply loaded data:', error);
      this.errors.push(`Data application failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate and repair any corrupted data
   */
  private validateAndRepairData(): void {
    try {
      // Check if we have a role but no completed steps for it
      if (this.formData.role && !this.completedSteps.has('role-selection')) {
        console.warn('Detected role data without completed role selection step. Resetting to role selection.');
        this.currentStep = 'role-selection';
        this.completedSteps = new Set(['welcome']);
      }

      // Ensure welcome step is always completed
      if (!this.completedSteps.has('welcome')) {
        this.completedSteps.add('welcome');
      }

      // Ensure current step is accessible
      if (!this.isStepAccessible(this.currentStep)) {
        console.warn(`Current step ${this.currentStep} is not accessible. Finding first accessible step.`);
        this.currentStep = this.findFirstAccessibleStep();
      }

    } catch (error) {
      console.error('Failed to validate and repair data:', error);
      this.errors.push(`Data repair failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure user is on a valid step
   */
  private ensureValidStep(): void {
    if (!this.isStepAccessible(this.currentStep)) {
      this.currentStep = this.findFirstAccessibleStep();
    }
  }

  /**
   * Add action to state history for debugging
   */
  private addToHistory(action: string, step: OnboardingStep): void {
    if (this.debugMode) {
      this.stateHistory.push({
        timestamp: new Date(),
        action,
        step
      });

      // Keep only last 50 actions
      if (this.stateHistory.length > 50) {
        this.stateHistory = this.stateHistory.slice(-50);
      }
    }
  }

  // =============================================================================
  // STEP VALIDATION METHODS
  // =============================================================================

  // Check if a specific step is accessible
  isStepAccessible(step: OnboardingStep): boolean {
    const result = (() => {
      switch (step) {
        case 'welcome':
          return true; // Always accessible
        case 'role-selection':
          return this.completedSteps.has('welcome');
        case 'basic-info':
          return this.completedSteps.has('role-selection') && !!this.formData.role;
        case 'role-specific':
          return this.completedSteps.has('basic-info') &&
            !!this.formData.role &&
            this.isBasicInfoComplete();
        case 'goals':
          return this.completedSteps.has('role-specific') &&
            this.isRoleSpecificComplete();
        case 'skills':
          return this.completedSteps.has('goals') &&
            this.isGoalsComplete();
        case 'preferences':
          return this.completedSteps.has('skills') &&
            this.isSkillsComplete();
        case 'review':
          return this.completedSteps.has('preferences') &&
            this.isPreferencesComplete();
        case 'completion':
          return this.completedSteps.has('review');
        default:
          return false;
      }
    })();

    console.log(`OnboardingState: isStepAccessible('${step}') = ${result}`, {
      step,
      completedSteps: Array.from(this.completedSteps),
      hasRole: !!this.formData.role,
      role: this.formData.role
    });

    return result;
  }

  // Check if basic info step is complete
  private isBasicInfoComplete(): boolean {
    const basicInfo = this.formData.basicInfo;
    return !!(basicInfo?.name?.trim() &&
      basicInfo?.email?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicInfo.email.trim()));
  }

  // Check if role-specific step is complete
  private isRoleSpecificComplete(): boolean {
    if (!this.formData.role) return false;

    switch (this.formData.role) {
      case 'investor':
        return !!(this.formData.investorInfo &&
          this.formData.investorInfo.investmentSize &&
          this.formData.investorInfo.preferredStages?.length > 0 &&
          this.formData.investorInfo.riskAppetite);
      case 'support':
        return !!(this.formData.supporterInfo &&
          this.formData.supporterInfo.supportType?.length > 0 &&
          this.formData.supporterInfo.availability);
      case 'founder':
        return !!(this.formData.basicInfo &&
          this.formData.basicInfo.industry &&
          this.formData.basicInfo.jobTitle);
      default:
        return false;
    }
  }

  // Check if goals step is complete
  private isGoalsComplete(): boolean {
    const goals = this.formData.goals;
    return !!(goals?.primaryGoal?.trim() &&
      goals?.timeCommitment?.trim() &&
      goals?.personalGoals && goals.personalGoals.length > 0);
  }

  // Check if skills step is complete
  private isSkillsComplete(): boolean {
    const skills = this.formData.skills;
    return !!(skills?.skills && skills.skills.length > 0 &&
      skills?.industries && skills.industries.length > 0 &&
      skills?.experienceLevel);
  }

  // Check if preferences step is complete
  private isPreferencesComplete(): boolean {
    const preferences = this.formData.preferences;
    return !!(preferences?.communicationMethods && preferences.communicationMethods.length > 0 &&
      preferences?.communicationFrequency?.trim());
  }

  /**
   * Mark a step as complete with validation and error handling
   */
  async markStepComplete(step: OnboardingStep): Promise<boolean> {
    try {
      console.log(`Marking step '${step}' as complete`);

      // Validate that the step can be completed
      if (!this.canCompleteCurrentStep()) {
        const errorMsg = `Cannot complete step ${step} - validation failed`;
        console.warn(errorMsg);
        this.errors.push(errorMsg);
        return false;
      }

      const previousCompletedSteps = new Set(this.completedSteps);
      this.completedSteps.add(step);
      this.addToHistory('complete', step);

      console.log(`Step '${step}' marked complete. Previous:`, Array.from(previousCompletedSteps));
      console.log(`Step '${step}' marked complete. Current:`, Array.from(this.completedSteps));

      // Save progress
      const saveSuccess = await this.saveProgress();
      if (!saveSuccess) {
        console.warn('Failed to save progress after marking step complete');
      }

      return true;

    } catch (error) {
      const errorMsg = `Error marking step complete: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  // =============================================================================
  // SIMPLIFIED COMPUTED PROPERTIES
  // =============================================================================

  get availableSteps(): OnboardingStep[] {
    const allSteps: OnboardingStep[] = ['welcome', 'role-selection', 'basic-info', 'role-specific', 'goals', 'skills', 'preferences', 'review', 'completion'];

    // Only return steps that are accessible based on completion status
    const accessibleSteps = allSteps.filter(step => this.isStepAccessible(step));
    console.log(`OnboardingState: availableSteps computed:`, {
      allSteps,
      accessibleSteps,
      completedSteps: Array.from(this.completedSteps),
      currentRole: this.formData.role
    });
    return accessibleSteps;
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

  get canGoBack(): boolean {
    return this.currentStepIndex > 0;
  }

  get canGoForward(): boolean {
    // Only allow forward navigation if current step is complete
    return this.currentStepIndex < this.totalSteps - 1 &&
      this.completedSteps.has(this.currentStep);
  }

  // =============================================================================
  // PRODUCTION-GRADE NAVIGATION METHODS
  // =============================================================================

  /**
   * Navigate to a specific step with validation and error handling
   */
  async goToStep(step: OnboardingStep): Promise<boolean> {
    try {
      // Only allow navigation to accessible steps
      if (!this.isStepAccessible(step)) {
        const errorMsg = `Cannot navigate to step ${step} - not accessible`;
        console.warn(errorMsg);
        this.errors.push(errorMsg);
        return false;
      }

      const previousStep = this.currentStep;
      this.currentStep = step;
      this.addToHistory('navigate', step);

      // Save progress and handle any errors
      const saveSuccess = await this.saveProgress();
      if (!saveSuccess) {
        console.warn('Failed to save progress after navigation');
        // Continue anyway, but log the issue
      }

      console.log(`Successfully navigated from '${previousStep}' to '${step}'`);
      return true;

    } catch (error) {
      const errorMsg = `Navigation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Navigate to next step with validation
   */
  async goNext(): Promise<boolean> {
    try {
      console.log(`goNext() called from step '${this.currentStep}'`);
      console.log(`Current step completed:`, this.completedSteps.has(this.currentStep));
      console.log(`Available steps:`, this.availableSteps);

      // Only allow next if current step is complete
      if (!this.completedSteps.has(this.currentStep)) {
        const errorMsg = `Cannot proceed - step ${this.currentStep} is not complete`;
        console.warn(errorMsg);
        this.errors.push(errorMsg);
        return false;
      }

      const nextIndex = this.currentStepIndex + 1;
      console.log(`Next index: ${nextIndex}, total available steps: ${this.availableSteps.length}`);

      if (nextIndex >= this.availableSteps.length) {
        console.log(`Already at last step, cannot go next`);
        return false;
      }

      const nextStep = this.availableSteps[nextIndex];
      console.log(`Moving to next step: '${nextStep}'`);

      return await this.goToStep(nextStep);

    } catch (error) {
      const errorMsg = `goNext error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Navigate to previous step
   */
  async goBack(): Promise<boolean> {
    try {
      const prevIndex = this.currentStepIndex - 1;
      if (prevIndex < 0) {
        console.log('Already at first step, cannot go back');
        return false;
      }

      const prevStep = this.availableSteps[prevIndex];
      console.log(`Moving to previous step: '${prevStep}'`);

      return await this.goToStep(prevStep);

    } catch (error) {
      const errorMsg = `goBack error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Force navigation to a step (admin/debugging purposes)
   */
  async forceGoToStep(step: OnboardingStep): Promise<boolean> {
    try {
      console.warn(`Force navigating to step: ${step}`);
      const previousStep = this.currentStep;
      this.currentStep = step;

      // Ensure the step is marked as accessible
      if (!this.completedSteps.has(step)) {
        this.completedSteps.add(step);
      }

      this.addToHistory('force-navigate', step);

      const saveSuccess = await this.saveProgress();
      if (!saveSuccess) {
        console.warn('Failed to save progress after force navigation');
      }

      console.log(`Force navigated from '${previousStep}' to '${step}'`);
      return true;

    } catch (error) {
      const errorMsg = `Force navigation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  // =============================================================================
  // PRODUCTION-GRADE DATA MANAGEMENT
  // =============================================================================

  /**
   * Update form data with validation and error handling
   */
  async updateFormData(stepData: Partial<OnboardingData>): Promise<boolean> {
    try {
      this.clearErrors();

      // Validate the data before applying
      const validation = this.validateStepData(stepData);
      if (!validation.isValid) {
        const errorMsg = `Invalid form data: ${validation.errors.join(', ')}`;
        console.warn(errorMsg);
        this.errors.push(errorMsg);
        return false;
      }

      const previousData = { ...this.formData };
      this.formData = { ...this.formData, ...stepData };

      console.log('Form data updated:', {
        previous: previousData,
        updated: stepData,
        current: this.formData
      });

      // Save progress
      const saveSuccess = await this.saveProgress();
      if (!saveSuccess) {
        console.warn('Failed to save progress after form data update');
      }

      return true;

    } catch (error) {
      const errorMsg = `Form data update error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Update role-specific data with validation
   */
  async updateRoleSpecificData(role: UserRole, data: any): Promise<boolean> {
    try {
      this.clearErrors();

      // Validate role-specific data
      const validation = this.validateRoleSpecificData(role, data);
      if (!validation.isValid) {
        const errorMsg = `Invalid role-specific data: ${validation.errors.join(', ')}`;
        console.warn(errorMsg);
        this.errors.push(errorMsg);
        return false;
      }

      switch (role) {
        case 'investor':
          this.formData.investorInfo = data;
          break;
        case 'support':
          this.formData.supporterInfo = data;
          break;
        default:
          const errorMsg = `Unsupported role: ${role}`;
          console.warn(errorMsg);
          this.errors.push(errorMsg);
          return false;
      }

      console.log(`Role-specific data updated for ${role}:`, data);

      // Save progress
      const saveSuccess = await this.saveProgress();
      if (!saveSuccess) {
        console.warn('Failed to save progress after role-specific data update');
      }

      return true;

    } catch (error) {
      const errorMsg = `Role-specific data update error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Validate step data before applying
   */
  private validateStepData(data: Partial<OnboardingData>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation - add more specific validation as needed
    if (data.basicInfo) {
      if (data.basicInfo.email && !this.isValidEmail(data.basicInfo.email)) {
        errors.push('Invalid email format');
      }
    }

    if (data.role && !['founder', 'investor', 'support'].includes(data.role)) {
      errors.push(`Invalid role: ${data.role}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate role-specific data
   */
  private validateRoleSpecificData(role: UserRole, data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (role) {
      case 'investor':
        if (!data) errors.push('Investor data is required');
        else {
          if (!data.investmentSize) errors.push('Investment size is required');
          if (!data.preferredStages || data.preferredStages.length === 0) {
            errors.push('Preferred stages are required');
          }
          if (!data.riskAppetite) errors.push('Risk appetite is required');
        }
        break;

      case 'support':
        if (!data) errors.push('Supporter data is required');
        else {
          if (!data.supportType || data.supportType.length === 0) {
            errors.push('Support type is required');
          }
          if (!data.availability) errors.push('Availability is required');
        }
        break;

      case 'founder':
        // Founder-specific validation can be added here
        break;

      default:
        errors.push(`Unknown role: ${role}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Check if email is valid
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // =============================================================================
  // PRODUCTION-GRADE PERSISTENCE
  // =============================================================================

  /**
   * Save current progress with error handling and retry logic
   */
  async saveProgress(): Promise<boolean> {
    if (!browser || !this.storageAvailable) {
      console.warn('Storage not available, skipping save');
      return false;
    }

    try {
      this.isLoading = true;
      this.clearErrors();

      const progressData = {
        currentStep: this.currentStep,
        formData: this.formData,
        completedSteps: Array.from(this.completedSteps),
        version: STATE_VERSION,
        lastSaved: new Date().toISOString()
      };

      const saveResult = await this.storageManager.save(STORAGE_KEY, progressData);

      if (saveResult.success) {
        this.lastSavedAt = new Date();
        this.addToHistory('save', this.currentStep);
        return true;
      } else {
        const errorMsg = `Save failed: ${saveResult.error}`;
        console.error(errorMsg);
        this.errors.push(errorMsg);

        // Handle specific storage errors
        if (saveResult.error === OnboardingError.STORAGE_QUOTA_EXCEEDED) {
          console.warn('Storage quota exceeded, clearing old data and retrying...');
          await this.handleStorageQuotaExceeded();
        }

        return false;
      }
    } catch (error) {
      const errorMsg = `Unexpected save error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load progress from storage
   */
  async loadProgress(): Promise<boolean> {
    if (!browser || !this.storageAvailable) {
      console.warn('Storage not available, skipping load');
      return false;
    }

    try {
      const loadResult = await this.storageManager.load(STORAGE_KEY, null);

      if (loadResult.success && loadResult.data) {
        this.applyLoadedData(loadResult.data);
        return true;
      } else {
        console.warn('No saved progress found or load failed');
        return false;
      }
    } catch (error) {
      const errorMsg = `Load error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    }
  }

  /**
   * Clear all progress and reset to initial state
   */
  async clearProgress(): Promise<boolean> {
    if (!browser) return true;

    try {
      this.isLoading = true;
      this.clearErrors();

      // Reset state to initial values
      this.currentStep = 'welcome';
      this.completedSteps = new Set(['welcome']);
      this.formData = {
        role: undefined,
        basicInfo: undefined,
        goals: { personalGoals: [], platformGoals: [], specificNeeds: [], primaryGoal: '', timeCommitment: '' },
        skills: { skills: [], industries: [], experienceLevel: 'Beginner' },
        preferences: { communicationMethods: [], notificationTypes: [], communicationFrequency: '', themePreference: '' },
        investorInfo: undefined,
        supporterInfo: undefined
      };
      this.lastSavedAt = null;
      this.stateHistory = [];

      // Clear storage
      const clearResult = this.storageManager.clear(STORAGE_KEY);
      if (!clearResult.success) {
        console.warn('Failed to clear storage:', clearResult.error);
      }

      this.addToHistory('clear', this.currentStep);
      return true;

    } catch (error) {
      const errorMsg = `Clear error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Handle storage quota exceeded error
   */
  private async handleStorageQuotaExceeded(): Promise<void> {
    try {
      // Clear old data and try to save minimal state
      const minimalState = {
        currentStep: this.currentStep,
        formData: {
          role: this.formData.role,
          basicInfo: this.formData.basicInfo
        },
        completedSteps: Array.from(this.completedSteps),
        version: STATE_VERSION,
        lastSaved: new Date().toISOString(),
        storageOptimized: true
      };

      const saveResult = await this.storageManager.save(STORAGE_KEY, minimalState);
      if (saveResult.success) {
        console.log('Successfully saved optimized state after quota exceeded');
      } else {
        console.error('Failed to save even minimal state');
        this.errors.push('Storage quota exceeded and recovery failed');
      }
    } catch (error) {
      console.error('Failed to handle storage quota exceeded:', error);
      this.errors.push('Storage recovery failed');
    }
  }

  /**
   * Clear current errors
   */
  private clearErrors(): void {
    this.errors = [];
  }

  /**
   * Export current state for debugging
   */
  exportCurrentState(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      currentStep: this.currentStep,
      formData: this.formData,
      completedSteps: Array.from(this.completedSteps),
      errors: this.errors,
      lastSavedAt: this.lastSavedAt,
      storageAvailable: this.storageAvailable,
      stateHistory: this.debugMode ? this.stateHistory : undefined
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    if (enabled) {
      console.log('Onboarding debug mode enabled');
    }
  }

  /**
   * Get storage information
   */
  getStorageInfo(): { available: boolean; quota?: { used: number; available: number; total: number } } {
    return {
      available: this.storageAvailable,
      quota: this.storageAvailable ? getStorageQuota() || undefined : undefined
    };
  }

  // =============================================================================
  // PRODUCTION-GRADE API INTEGRATION
  // =============================================================================

  /**
   * Submit onboarding data to the API with comprehensive error handling
   */
  async submitOnboarding(): Promise<{ success: boolean; error?: string }> {
    try {
      this.isLoading = true;
      this.clearErrors();

      console.log('Submitting onboarding data:', {
        currentStep: this.currentStep,
        formData: this.formData,
        completedSteps: Array.from(this.completedSteps)
      });

      // Validate all required data before submission
      const validation = this.validateSubmissionData();
      if (!validation.isValid) {
        const errorMsg = `Submission validation failed: ${validation.errors.join(', ')}`;
        console.error(errorMsg);
        this.errors.push(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Log the exact data being sent to API
      console.log('Data being sent to API:', JSON.stringify(this.formData, null, 2));

      // Log validation details
      console.log('Validation details:', {
        role: this.formData.role,
        basicInfo: this.formData.basicInfo,
        goals: this.formData.goals,
        skills: this.formData.skills,
        preferences: this.formData.preferences,
        investorInfo: this.formData.investorInfo,
        supporterInfo: this.formData.supporterInfo
      });

      // Submit to API with timeout and retry logic
      console.log('About to submit with retry...');
      const submitResult = await this.submitWithRetry();
      console.log('Submit result:', submitResult);

      if (submitResult.success) {
        // First mark review step as complete (if not already)
        if (!this.completedSteps.has('review')) {
          await this.markStepComplete('review');
        }

        // Then mark completion step as complete and navigate
        await this.markStepComplete('completion');
        const navigationSuccess = await this.goToStep('completion');

        if (!navigationSuccess) {
          console.warn('Failed to navigate to completion step, but submission was successful');
        }

        console.log('Onboarding submitted successfully');
        return { success: true };
      } else {
        const errorMsg = `Submission failed: ${submitResult.error}`;
        console.error(errorMsg);
        this.errors.push(errorMsg);
        return { success: false, error: errorMsg };
      }

    } catch (error: any) {
      const errorMsg = `Unexpected submission error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      this.errors.push(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Submit data with retry logic and timeout
   */
  private async submitWithRetry(maxRetries = 3): Promise<{ success: boolean; error?: string }> {
    const timeoutMs = 10000; // 10 second timeout

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Submission attempt ${attempt}/${maxRetries}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const requestBody = JSON.stringify(this.formData);
        console.log(`Request body being sent:`, requestBody);

        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(`HTTP ${response.status}: ${response.statusText}`);
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('Error response data:', errorData);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Submission successful:', result);
        return { success: true };

      } catch (error: any) {
        console.warn(`Submission attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          if (error.name === 'AbortError') {
            return { success: false, error: 'Request timeout - please try again' };
          }
          return { success: false, error: error.message || 'Failed to submit onboarding' };
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return { success: false, error: 'All submission attempts failed' };
  }

  /**
   * Validate data before submission
   */
  private validateSubmissionData(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if all steps are completed
    const requiredSteps: OnboardingStep[] = ['welcome', 'role-selection', 'basic-info', 'role-specific', 'goals', 'skills', 'preferences'];
    for (const step of requiredSteps) {
      if (!this.completedSteps.has(step)) {
        errors.push(`Step '${step}' is not completed`);
      }
    }

    // Validate form data completeness
    if (!this.formData.role) {
      errors.push('User role is required');
    }

    if (!this.formData.basicInfo?.name || !this.formData.basicInfo?.email) {
      errors.push('Basic info (name and email) is required');
    }

    // Goals validation (required by schema)
    if (!this.formData.goals?.primaryGoal?.trim()) {
      errors.push('Primary goal is required');
    }
    if (!this.formData.goals?.specificNeeds || this.formData.goals.specificNeeds.length === 0) {
      errors.push('At least one specific need is required');
    }
    if (!this.formData.goals?.timeCommitment?.trim()) {
      errors.push('Time commitment is required');
    }

    // Skills validation (required by schema)
    if (!this.formData.skills?.skills || this.formData.skills.skills.length === 0) {
      errors.push('At least one skill is required');
    }
    if (!this.formData.skills?.industries || this.formData.skills.industries.length === 0) {
      errors.push('At least one industry is required');
    }
    if (!this.formData.skills?.experienceLevel) {
      errors.push('Experience level is required');
    }

    // Preferences validation (required by schema)
    if (!this.formData.preferences?.communicationMethods || this.formData.preferences.communicationMethods.length === 0) {
      errors.push('At least one communication method is required');
    }
    if (!this.formData.preferences?.notificationTypes || this.formData.preferences.notificationTypes.length === 0) {
      errors.push('At least one notification type is required');
    }

    // Role-specific validation
    if (this.formData.role === 'investor' && !this.formData.investorInfo) {
      errors.push('Investor information is required');
    }

    if (this.formData.role === 'support' && !this.formData.supporterInfo) {
      errors.push('Supporter information is required');
    }

    return { isValid: errors.length === 0, errors, warnings };
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

  // Check if a step is completed
  isStepCompleted(step: OnboardingStep): boolean {
    return this.completedSteps.has(step);
  }

  // Check if current step can be completed
  canCompleteCurrentStep(): boolean {
    switch (this.currentStep) {
      case 'welcome':
        return true; // Welcome step is always completable
      case 'role-selection':
        return !!this.formData.role;
      case 'basic-info':
        return this.isBasicInfoComplete();
      case 'role-specific':
        return this.isRoleSpecificComplete();
      case 'goals':
        return this.isGoalsComplete();
      case 'skills':
        return this.isSkillsComplete();
      case 'preferences':
        return this.isPreferencesComplete();
      case 'review':
        return true; // Review step is always completable
      case 'completion':
        return true; // Completion step is always completable
      default:
        return false;
    }
  }

  // Find the first accessible step for the user
  private findFirstAccessibleStep(): OnboardingStep {
    const allSteps: OnboardingStep[] = ['welcome', 'role-selection', 'basic-info', 'role-specific', 'goals', 'skills', 'preferences', 'review', 'completion'];

    for (const step of allSteps) {
      if (this.isStepAccessible(step)) {
        return step;
      }
    }

    return 'welcome'; // Fallback to welcome step
  }

  // Reset onboarding progress and start fresh
  resetOnboarding(): void {
    this.clearProgress();
    this.currentStep = 'welcome';
    this.completedSteps = new Set(['welcome']);
  }



  // Export current onboarding data (useful before resetting)
  exportOnboardingData(): string {
    const exportData = {
      formData: this.formData,
      completedSteps: Array.from(this.completedSteps),
      currentStep: this.currentStep,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get raw localStorage data for debugging
   */
  getRawLocalStorageData(): any {
    if (!browser) return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
      return null;
    }
  }

  /**
   * Validate localStorage data structure
   */
  validateLocalStorageData(): { isValid: boolean; errors: string[]; warnings: string[] } {
    const rawData = this.getRawLocalStorageData();
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rawData) {
      return { isValid: true, errors: [], warnings: ['No localStorage data found'] };
    }

    // Check required fields
    if (!rawData.currentStep) {
      errors.push('Missing currentStep');
    }
    if (!rawData.formData) {
      errors.push('Missing formData');
    }
    if (!rawData.completedSteps) {
      errors.push('Missing completedSteps');
    }

    // Validate step accessibility
    if (rawData.currentStep && !this.isStepAccessible(rawData.currentStep as OnboardingStep)) {
      warnings.push(`Current step '${rawData.currentStep}' is not accessible`);
    }

    // Validate completed steps
    if (rawData.completedSteps && Array.isArray(rawData.completedSteps)) {
      for (const step of rawData.completedSteps) {
        if (!this.isStepAccessible(step as OnboardingStep)) {
          warnings.push(`Completed step '${step}' is not accessible`);
        }
      }
    }

    // Validate form data consistency
    if (rawData.formData) {
      if (rawData.formData.role && !['founder', 'investor', 'support'].includes(rawData.formData.role)) {
        errors.push(`Invalid role: ${rawData.formData.role}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// =============================================================================
// SINGLETON INSTANCE & EXPORT
// =============================================================================

export { OnboardingState };

// Browser-only singleton to prevent SSR data leakage
let browserOnboardingState: OnboardingState | null = null;
let browserInitializationPromise: Promise<void> | null = null;

/**
 * Get onboarding state - SSR safe singleton
 * Returns a new instance on server, singleton on client
 */
export function getOnboardingState(initialUserData?: { name?: string; email?: string }): OnboardingState {
  // Server-side: Always return a new instance to prevent data leakage
  if (!browser) {
    return new OnboardingState(initialUserData);
  }

  // Client-side: Use singleton pattern
  if (!browserOnboardingState) {
    browserOnboardingState = new OnboardingState(initialUserData);
  }
  return browserOnboardingState;
}

/**
 * Initialize onboarding state asynchronously - SSR safe
 */
export async function initializeOnboardingState(initialUserData?: { name?: string; email?: string }): Promise<OnboardingState> {
  // Server-side: Always return a new instance
  if (!browser) {
    const state = new OnboardingState(initialUserData);
    await state.initializeFromStorage();
    return state;
  }

  // Client-side: Use singleton with initialization
  if (browserOnboardingState) {
    return browserOnboardingState;
  }

  if (browserInitializationPromise) {
    await browserInitializationPromise;
    return browserOnboardingState!;
  }

  // Create state instance
  browserOnboardingState = new OnboardingState(initialUserData);

  // Wait for initialization to complete
  browserInitializationPromise = browserOnboardingState.initializeFromStorage();
  await browserInitializationPromise;

  return browserOnboardingState;
}

// Export for convenience
export const useOnboarding = getOnboardingState;

/**
 * Get onboarding state synchronously - SSR safe
 */
export function getOnboardingStateSync(initialUserData?: { name?: string; email?: string }): OnboardingState {
  return getOnboardingState(initialUserData);
}
