import type { OnboardingData } from '@/schemas/onboarding-schema';

export interface OnboardingProgress {
  formData: Partial<OnboardingData>;
  currentStepIndex: number;
  completedSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface SaveProgressRequest {
  formData: Partial<OnboardingData>;
  currentStepIndex: number;
  completedSteps: string[];
}

export interface SubmitOnboardingRequest {
  onboardingData: OnboardingData;
}

// API utility functions
export const onboardingApi = {
  // Save progress
  async saveProgress(data: SaveProgressRequest): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      return {
        success: false,
        error: 'Failed to save progress'
      };
    }
  },

  // Load progress
  async loadProgress(): Promise<ApiResponse<OnboardingProgress>> {
    try {
      const response = await fetch('/api/onboarding/load', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      return {
        success: false,
        error: 'Failed to load progress'
      };
    }
  },

  // Submit completed onboarding
  async submitOnboarding(data: OnboardingData): Promise<ApiResponse<{ role: string }>> {
    try {
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      return {
        success: false,
        error: 'Failed to submit onboarding data'
      };
    }
  },

  // Clear progress (for testing/reset)
  async clearProgress(): Promise<ApiResponse> {
    try {
      const response = await fetch('/api/onboarding/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error clearing onboarding progress:', error);
      return {
        success: false,
        error: 'Failed to clear progress'
      };
    }
  }
};
