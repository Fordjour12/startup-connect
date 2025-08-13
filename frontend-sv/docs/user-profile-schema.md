# User Profile Schema

This document describes the new user profile schema that stores onboarding and profile information for users.

## Overview

The `user_profile` table is designed to store comprehensive user information collected during the onboarding process, while maintaining a clean relationship with the main `user` table. This prevents duplication of user data and provides a structured way to store role-specific information.

## Table Structure

### Core Fields

- `id`: Primary key (CUID2)
- `userId`: Foreign key to user table (unique constraint)
- `name`, `email`: Basic user information
- `profileImage`: User's profile picture URL
- `location`, `city`, `timezone`: Geographic information
- `bio`, `jobTitle`, `industry`, `education`: Professional information
- `phone`, `twitterHandle`, `linkedinUrl`, `githubProfile`, `portfolioWebsite`: Contact and social links
- `languages`, `employmentStatus`: Additional personal information

### Role-Specific Data

- `roleSpecificData`: JSONB field containing role-specific information:
  - **Investor**: investment size, preferred stages, risk appetite, etc.
  - **Supporter**: support type, availability, hourly rate, expertise
  - **Founder**: (can be extended as needed)

### Goals and Skills

- `personalGoals`, `platformGoals`: User's personal and platform goals
- `primaryGoal`, `specificNeeds`, `timeCommitment`: Goal-related information
- `skills`, `experienceLevel`, `industries`: Skills and experience
- `achievements`, `expertiseAreas`, `certifications`: Professional achievements

### Preferences

- `communicationMethods`, `communicationFrequency`: Communication preferences
- `notificationTypes`, `themePreference`: UI and notification preferences

### Metadata

- `isOnboardingComplete`: Boolean flag for onboarding completion
- `onboardingStep`: Current step in onboarding process
- `createdAt`, `updatedAt`: Timestamps

## Key Features

### 1. One-to-One Relationship

Each user can have only one profile, enforced by the unique constraint on `userId`.

### 2. Cascade Delete

When a user is deleted, their profile is automatically removed.

### 3. Flexible Role Data

Role-specific information is stored in a JSONB field, allowing for easy extension without schema changes.

### 4. Array Storage

Arrays are stored as comma-separated strings in the database and converted back to arrays in the application layer.

## Usage Examples

### Creating a User Profile

```typescript
import { createUserProfile } from '@/lib/db';

const onboardingData = {
  role: 'investor',
  basicInfo: { /* ... */ },
  goals: { /* ... */ },
  skills: { /* ... */ },
  preferences: { /* ... */ },
  investorInfo: { /* ... */ }
};

const result = await createUserProfile(onboardingData, userId);
if (result.success) {
  console.log('Profile created:', result.profile);
}
```

### Fetching User Profile

```typescript
import { getUserProfile } from '@/lib/db';

const result = await getUserProfile(userId);
if (result.success) {
  const profile = result.profile;
  // Use profile data
}
```

### Updating Onboarding Step

```typescript
import { updateOnboardingStep } from '@/lib/db';

const result = await updateOnboardingStep(userId, 3);
if (result.success) {
  console.log('Step updated to:', result.profile.onboardingStep);
}
```

## Data Transformation

The schema includes utility functions to transform data between the onboarding form format and the database format:

- `transformOnboardingToProfile()`: Converts onboarding data to database format
- `transformProfileToOnboarding()`: Converts database data back to onboarding format
- `arrayToString()`: Converts arrays to comma-separated strings
- `stringToArray()`: Converts comma-separated strings back to arrays

## Migration

The schema is automatically generated using Drizzle Kit. To apply the migration:

```bash
bun run drizzle-kit push
```

## Benefits

1. **No Data Duplication**: User basic info is stored once in the user table
2. **Flexible Schema**: JSONB allows for easy extension of role-specific data
3. **Type Safety**: Full TypeScript support with inferred types
4. **Performance**: Efficient queries with proper indexing
5. **Maintainability**: Clean separation of concerns between auth and profile data

## Future Extensions

- Add indexes for frequently queried fields
- Implement soft deletes if needed
- Add validation triggers for data integrity
- Consider partitioning for large datasets
