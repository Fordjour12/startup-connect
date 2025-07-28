// Enhanced type definitions for onboarding system

import type { z } from 'zod';
import type { OnboardingData } from '@/schemas/onboarding-schema';

// User roles with strict typing
export type UserRole = 'founder' | 'investor' | 'supporter';

// Step status tracking
export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

// Error types for better error handling
export type OnboardingErrorType = 'validation' | 'network' | 'server' | 'general' | 'timeout';

export interface OnboardingError {
  type: OnboardingErrorType;
  message: string;
  field?: string;
  code?: string;
  timestamp: Date;
}

// Step definition with enhanced typing
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  canSkip: boolean;
  order: number;
  validation?: z.ZodSchema;
  dependsOn?: string[];
  estimatedMinutes?: number;
  icon?: string;
  category?: 'basic' | 'role_specific' | 'preferences' | 'verification';
}

// Progress tracking
export interface StepProgress {
  stepId: string;
  status: StepStatus;
  startedAt?: Date;
  completedAt?: Date;
  skippedAt?: Date;
  validationErrors?: Record<string, string>;
  timeSpentSeconds?: number;
}

// Time utilities interface
export interface TimeInfo {
  createdAt: Date;
  lastUpdated: Date;
  totalTimeSpent: number; // in seconds
  averageTimePerStep: number; // in seconds
  estimatedTimeRemaining: number; // in seconds
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean;
  intervalSeconds: number;
  minTimeBetweenSavesSeconds: number;
  maxRetries: number;
  retryDelaySeconds: number;
}

// Onboarding progress data structure
export interface OnboardingProgress {
  id?: string;
  userId?: string;
  currentStepIndex: number;
  completedSteps: string[];
  formData: Partial<OnboardingData>;
  stepProgress: Record<string, StepProgress>;
  timeInfo: TimeInfo;
  version: number; // for handling schema migrations
  lastUpdated: string; // ISO string
  isComplete: boolean;
  metadata?: Record<string, unknown>;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export interface ProgressResponse extends ApiResponse<OnboardingProgress> {
  progress?: OnboardingProgress; // Legacy support
}

export interface SubmissionResponse extends ApiResponse {
  profileId?: string;
  redirectUrl?: string;
  timestamp: string;
}

export interface ValidationResponse extends ApiResponse {
  isValid: boolean;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}

// State management types
export interface OnboardingStateConfig {
  autoSave: AutoSaveConfig;
  enableAnalytics: boolean;
  debugMode: boolean;
  validateOnChange: boolean;
  persistToLocalStorage: boolean;
}

// Navigation types
export interface NavigationOptions {
  skipValidation?: boolean;
  saveProgress?: boolean;
  showConfirmation?: boolean;
}

// Role-specific configuration
export interface RoleConfig {
  role: UserRole;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  requiredSteps: string[];
  optionalSteps: string[];
  customValidation?: z.ZodSchema;
}

// Validation context
export interface ValidationContext {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingData>;
  completedSteps: Set<string>;
  userRole?: UserRole;
}

// Analytics and tracking
export interface OnboardingAnalytics {
  sessionId: string;
  startTime: Date;
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  timeSpentPerStep: Record<string, number>;
  errors: OnboardingError[];
  abandonedAt?: Date;
  completedAt?: Date;
  userAgent: string;
  referrer?: string;
}

// Event types for analytics
export type OnboardingEvent =
  | 'step_started'
  | 'step_completed'
  | 'step_skipped'
  | 'validation_failed'
  | 'auto_save_success'
  | 'auto_save_failed'
  | 'progress_loaded'
  | 'onboarding_completed'
  | 'onboarding_abandoned'
  | 'error_occurred';

export interface OnboardingEventData {
  event: OnboardingEvent;
  stepId?: string;
  timestamp: Date;
  data?: Record<string, unknown>;
  error?: OnboardingError;
}

// Form field types for better validation
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'select' | 'multiselect' | 'textarea' | 'number' | 'boolean' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: z.ZodSchema;
  options?: Array<{ value: string; label: string }>;
  dependsOn?: string;
  conditional?: (formData: Partial<OnboardingData>) => boolean;
}

// Step component props
export interface StepComponentProps {
  step: OnboardingStep;
  formData: Partial<OnboardingData>;
  errors: Record<string, OnboardingError>;
  isLoading: boolean;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
}

// Utility types for better type inference
export type StepId = OnboardingStep['id'];
export type FormDataKey = keyof OnboardingData;
export type ErrorField = string;

// Type guards
export function isUserRole(role: string): role is UserRole {
  return ['founder', 'investor', 'supporter'].includes(role);
}

export function isOnboardingError(error: unknown): error is OnboardingError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

export function isValidStepStatus(status: string): status is StepStatus {
  return ['not_started', 'in_progress', 'completed', 'skipped'].includes(status);
}

// Constants
export const ONBOARDING_CONSTANTS = {
  MAX_STEPS: 10,
  MIN_AUTO_SAVE_INTERVAL: 10, // seconds
  MAX_AUTO_SAVE_INTERVAL: 300, // seconds
  SESSION_TIMEOUT: 3600, // seconds (1 hour)
  MAX_RETRIES: 3,
  DEBOUNCE_DELAY: 500, // milliseconds
  LOCAL_STORAGE_KEY: 'onboarding_progress',
  ANALYTICS_BATCH_SIZE: 10,
} as const;

// Schema version for handling migrations
export const ONBOARDING_SCHEMA_VERSION = 1;

// Default configurations
export const DEFAULT_AUTO_SAVE_CONFIG: AutoSaveConfig = {
  enabled: true,
  intervalSeconds: 30,
  minTimeBetweenSavesSeconds: 10,
  maxRetries: 3,
  retryDelaySeconds: 5,
};

export const DEFAULT_STATE_CONFIG: OnboardingStateConfig = {
  autoSave: DEFAULT_AUTO_SAVE_CONFIG,
  enableAnalytics: true,
  debugMode: false,
  validateOnChange: true,
  persistToLocalStorage: true,
};
