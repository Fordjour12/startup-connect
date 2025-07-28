# Improved Onboarding State Documentation

## Overview

The onboarding state has been completely rewritten to address type safety issues and improve time handling throughout the application. This document outlines the key improvements and how to use the new type-safe onboarding system.

## Key Improvements

### 1. Enhanced Type Safety

#### Before (Issues)
- Used `any` types in role validation
- Unsafe type assertions when accessing stepSchemas
- Basic `Date.now()` for time tracking
- Inconsistent error handling

#### After (Improvements)
- **Strict typing** for all user roles and form data
- **Type guards** and discriminated unions for role-specific validation
- **Proper Date objects** with utility functions for time operations
- **Structured error types** with timestamps and categorization

### 2. Better Time Handling

#### TimeUtils Class
```typescript
export class TimeUtils {
  static now(): Date
  static timestamp(): number
  static addSeconds(date: Date, seconds: number): Date
  static differenceInSeconds(later: Date, earlier: Date): number
  static toISOString(date: Date): string
  static fromISOString(isoString: string): Date
}
```

#### Time Tracking Features
- **Proper Date objects** instead of timestamps
- **Time zone aware** serialization/deserialization
- **Auto-save timing** with configurable intervals
- **Session duration** tracking
- **Step completion times** for analytics

### 3. Type-Safe Schema Handling

#### Role-Specific Validation
```typescript
// Old (unsafe)
validation: stepSchemas[role as keyof typeof stepSchemas]

// New (type-safe)
function getRoleSpecificSchema(role: UserRole): z.ZodSchema {
  const schemas = {
    founder: founderSchema,
    investor: investorSchema,
    supporter: supporterSchema
  } as const;
  return schemas[role];
}
```

#### Discriminated Union Schema
```typescript
export const onboardingSchema = z.discriminatedUnion('role', [
  founderOnboardingSchema,
  investorOnboardingSchema,
  supporterOnboardingSchema
]);
```

### 4. Enhanced Error Handling

#### Structured Error Types
```typescript
interface OnboardingError {
  type: 'validation' | 'network' | 'server' | 'general';
  message: string;
  field?: string;
  timestamp: Date;
}
```

#### Error Categorization
- **Validation errors**: Form field validation issues
- **Network errors**: API communication problems
- **Server errors**: Backend processing issues
- **General errors**: Unexpected application errors

### 5. Improved Auto-Save System

#### Configuration Options
```typescript
interface AutoSaveConfig {
  enabled: boolean;
  intervalSeconds: number;
  minTimeBetweenSavesSeconds: number;
  maxRetries: number;
  retryDelaySeconds: number;
}
```

#### Features
- **Page visibility detection** - pauses when tab is hidden
- **Debounced saving** - prevents excessive API calls
- **Retry logic** with exponential backoff
- **Graceful degradation** on network issues
- **Sync save on page unload** using `sendBeacon`

## Usage Examples

### Basic Usage

```typescript
import { onboardingState } from '@/components/onboarding/onboarding-state.svelte.ts';
import type { UserRole } from '@/types/onboarding';

// Type-safe role selection
function selectRole(role: UserRole) {
  onboardingState.updateFormData({ role });
}

// Navigation with error handling
function nextStep() {
  const success = onboardingState.nextStep();
  if (!success) {
    console.error('Cannot proceed to next step');
  }
}

// Type-safe form updates
function updateBasicInfo(data: { fullName: string; email: string }) {
  onboardingState.updateFormData(data);
}
```

### Error Handling

```typescript
// Get current validation errors
const errors = onboardingState.errors;
const validationErrors = Object.entries(errors)
  .filter(([_, error]) => error.type === 'validation')
  .map(([field, error]) => ({ field, message: error.message }));

// Check for specific error types
function hasNetworkErrors(): boolean {
  return Object.values(onboardingState.errors)
    .some(error => error.type === 'network');
}
```

### Progress Tracking

```typescript
// Get detailed progress information
const progress = onboardingState.getStepProgress();
console.log(`${progress.completed}/${progress.total} steps completed`);

// Time tracking
const timeSpent = onboardingState.getTimeSpentOnboarding();
console.log(`Time spent: ${Math.floor(timeSpent / 60)} minutes`);
```

### Reactive State in Svelte

```svelte
<script>
  import { onboardingState } from '@/components/onboarding/onboarding-state.svelte.ts';

  // Reactive derivations
  let currentStep = $derived(onboardingState.currentStep());
  let formData = $derived(onboardingState.formData);
  let errors = $derived(onboardingState.errors);
  let isSubmitting = $derived(onboardingState.isSubmitting);
  let progressPercentage = $derived(onboardingState.progressPercentage);
</script>

{#if currentStep}
  <h2>{currentStep.title}</h2>
  <p>{currentStep.description}</p>

  {#if currentStep.estimatedMinutes}
    <small>Estimated time: {currentStep.estimatedMinutes} minutes</small>
  {/if}
{/if}
```

## Type Definitions

### Core Types

```typescript
export type UserRole = 'founder' | 'investor' | 'supporter';
export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type OnboardingErrorType = 'validation' | 'network' | 'server' | 'general';

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
```

### Progress Data

```typescript
export interface OnboardingProgress {
  id?: string;
  userId?: string;
  currentStepIndex: number;
  completedSteps: string[];
  formData: Partial<OnboardingData>;
  stepProgress: Record<string, StepProgress>;
  timeInfo: TimeInfo;
  version: number;
  lastUpdated: string;
  isComplete: boolean;
  metadata?: Record<string, unknown>;
}
```

## API Changes

### Request Formats

#### Save Progress
```typescript
POST /api/onboarding/progress
{
  currentStepIndex: number;
  completedSteps: string[];
  formData: Partial<OnboardingData>;
  lastUpdated: string; // ISO timestamp
}
```

#### Submit Onboarding
```typescript
POST /api/onboarding/complete
{
  ...formData,
  submittedAt: string; // ISO timestamp
}
```

### Response Formats

#### Progress Response
```typescript
{
  success: boolean;
  data?: OnboardingProgress;
  error?: string;
  timestamp: string;
}
```

#### Submission Response
```typescript
{
  success: boolean;
  profileId?: string;
  redirectUrl?: string;
  timestamp: string;
}
```

## Migration Guide

### From Old Version

1. **Update imports**:
   ```typescript
   // Old
   import { onboardingState } from './onboarding-state.svelte.ts';

   // New
   import { onboardingState } from './onboarding-state.svelte.ts';
   import type { UserRole } from '@/types/onboarding';
   ```

2. **Update role handling**:
   ```typescript
   // Old
   const role = formData.role as any;

   // New
   const role = formData.role as UserRole | undefined;
   if (role && isUserRole(role)) {
     // Type-safe role operations
   }
   ```

3. **Update error handling**:
   ```typescript
   // Old
   const errorMessage = errors[field];

   // New
   const error = errors[field];
   const errorMessage = error?.message;
   const errorType = error?.type;
   ```

4. **Update step access**:
   ```typescript
   // Old
   const currentStep = onboardingState.currentStep;

   // New
   const currentStep = onboardingState.currentStep();
   ```

## Performance Improvements

### Auto-Save Optimizations
- **Debounced updates** prevent excessive API calls
- **Page visibility detection** reduces unnecessary saves
- **Minimum time intervals** between saves
- **Batched error handling** for better UX

### Memory Management
- **Proper cleanup** of intervals and event listeners
- **Lazy evaluation** of computed properties
- **Efficient state updates** with minimal re-renders

### Network Efficiency
- **SendBeacon API** for reliable page unload saves
- **Retry logic** with exponential backoff
- **Optimistic updates** for better perceived performance

## Testing

### Example Test Cases

```typescript
import { onboardingState, TimeUtils } from './onboarding-state.svelte.ts';

describe('OnboardingState', () => {
  test('should handle role selection with type safety', () => {
    onboardingState.updateFormData({ role: 'founder' });
    expect(onboardingState.formData.role).toBe('founder');

    const roleSpecificStep = onboardingState.getRoleSpecificStep();
    expect(roleSpecificStep?.title).toBe('Startup Details');
  });

  test('should track time correctly', () => {
    const start = TimeUtils.now();
    // ... simulate passage of time
    const timeSpent = onboardingState.getTimeSpentOnboarding();
    expect(timeSpent).toBeGreaterThan(0);
  });

  test('should handle validation errors properly', () => {
    onboardingState.updateFormData({ email: 'invalid-email' });
    const isValid = onboardingState.validateCurrentStep();
    expect(isValid).toBe(false);

    const errors = onboardingState.errors;
    expect(errors.email?.type).toBe('validation');
  });
});
```

## Best Practices

### Type Safety
- Always use the provided type guards
- Leverage discriminated unions for role-specific logic
- Use proper TypeScript strict mode settings

### Error Handling
- Check return values of navigation methods
- Handle different error types appropriately
- Provide user-friendly error messages

### Performance
- Use reactive derivations efficiently
- Clean up resources properly
- Implement proper loading states

### Accessibility
- Provide proper ARIA labels
- Handle keyboard navigation
- Include proper focus management

## Conclusion

The improved onboarding state provides a robust, type-safe foundation for the onboarding process with better time handling, error management, and user experience. The new architecture ensures maintainability and extensibility while providing excellent developer experience through comprehensive typing and clear APIs.
