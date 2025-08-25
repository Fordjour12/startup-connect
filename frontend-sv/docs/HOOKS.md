# Role-Based Navigation Hooks

This document explains how to use the role-based navigation hooks in StartupConnect to automatically redirect users based on their role and onboarding status.

## Overview

The hooks system provides both server-side and client-side navigation guards that automatically redirect users to appropriate pages based on their authentication status, role, and onboarding completion.

## Server-Side Hooks (`src/hooks.server.ts`)

### What It Does

- **Onboarding Protection**: Redirects users without completed profiles to `/onboarding`
- **Role-Based Redirects**: Redirects users with completed profiles to `/dashboard` from generic pages
- **Access Control**: Prevents users from accessing onboarding after completion
- **Role Validation**: Ensures users only access appropriate content for their role

### How It Works

1. **Authentication Check**: Verifies user session on every request
2. **Onboarding Status**: Checks if user has completed onboarding
3. **Role Validation**: Validates user role against allowed roles
4. **Automatic Redirects**: Redirects users to appropriate pages

### Routes Handled

- `/` → `/dashboard` (for users with completed profiles)
- `/home` → `/dashboard` (for users with completed profiles)
- `/landing` → `/dashboard` (for users with completed profiles)
- `/dashboard` → `/onboarding` (for users without completed profiles)
- `/onboarding` → `/dashboard` (for users who already completed onboarding)

## Client-Side Hooks (`src/hooks.client.ts`)

### What It Does

- **Client Navigation**: Handles navigation after authentication state changes
- **Role Validation**: Checks user role on the client side
- **Conditional Rendering**: Provides utility functions for components
- **Error Handling**: Manages client-side errors and 404s
- **Navigation Events**: Intercepts and processes navigation events

### Usage

#### Basic Usage

```typescript
import { onMount } from 'svelte';
import { handleClientNavigation } from '$hooks.client';

onMount(() => {
  handleClientNavigation();
});
```

#### SvelteKit Client Hooks

The file automatically exports these SvelteKit client hooks:

```typescript
// Error handling hook
export const handleError: HandleClientError = async ({ error, event, status, message }) => {
  // Handles client-side errors and 404s
};

// Navigation hook  
export const handleNavigate = async ({ to, from, cancel }) => {
  // Intercepts navigation events and applies role-based logic
};
```

#### Utility Functions

```typescript
import { hasCompletedOnboarding, shouldRedirectToOnboarding } from '$hooks.client';

// Check if user has completed onboarding
if (hasCompletedOnboarding(user.role)) {
  // Show dashboard content
} else {
  // Show onboarding prompt
}

// Check if user should be redirected
if (shouldRedirectToOnboarding(user.role)) {
  // Redirect to onboarding
}
```

## Role Types

The system recognizes these user roles:

- **`founder`**: Startup founders and entrepreneurs
- **`investor`**: Angel investors and venture capitalists  
- **`support`**: Service providers and consultants
- **`user`**: Default role for incomplete profiles

## Onboarding Flow

1. **New User**: Redirected to `/onboarding`
2. **During Onboarding**: Can access onboarding steps
3. **Completed Onboarding**: Automatically redirected to `/dashboard`
4. **Dashboard Access**: Role-specific content is rendered dynamically

## Dashboard Behavior

The `/dashboard` route dynamically renders content based on user role:

- **Founders**: See `FounderDashboard` component
- **Investors**: See `InvestorDashboard` component
- **Supporters**: See `SupportDashboard` component
- **Incomplete Profiles**: See `DefaultDashboard` component

## Configuration

### Skip Routes

These routes are excluded from hook processing:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/onboarding`
- `/api/*`
- `/static/*`
- `/_app/*`

### Redirect Logic

```typescript
// Server-side redirects
if (hasValidRole && onGenericPage) {
  redirect(302, '/dashboard');
}

if (incompleteProfile && onDashboard) {
  redirect(302, '/onboarding');
}

if (completedProfile && onOnboarding) {
  redirect(302, '/dashboard');
}
```

## Debugging

### Server-Side Logs

Look for `[Hooks]` prefixed logs in your server console:

```
[Hooks] Redirecting founder from / to /dashboard (completed onboarding)
[Hooks] Redirecting user from /dashboard to /onboarding (incomplete profile)
```

### Client-Side Logs

Look for `[Client Hooks]` prefixed logs in your browser console:

```
[Client Hooks] Redirecting investor from / to /dashboard
[Client Hooks] Redirecting user from /dashboard to /onboarding (incomplete profile)
```

## Best Practices

1. **Always use the hooks**: Don't bypass the navigation system
2. **Handle loading states**: Show loading indicators during redirects
3. **Error handling**: Implement fallbacks for hook failures
4. **Testing**: Test all role combinations and onboarding states

## Troubleshooting

### Common Issues

1. **Infinite Redirects**: Check if hooks are calling each other
2. **Missing Redirects**: Verify user role and onboarding status
3. **Type Errors**: Ensure proper TypeScript types for user data

### Debug Steps

1. Check server console for `[Hooks]` logs
2. Check browser console for `[Client Hooks]` logs
3. Verify user session and role data
4. Check onboarding completion status

## Example Implementation

```typescript
// In a layout or root component
import { onMount } from 'svelte';
import { handleClientNavigation } from '$hooks.client';

onMount(() => {
  // Handle initial navigation
  handleClientNavigation();
  
  // Listen for auth state changes
  authClient.onAuthStateChange(() => {
    handleClientNavigation();
  });
});
```

This ensures users are always directed to the appropriate page based on their current status.
