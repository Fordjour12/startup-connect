# Onboarding Flow Documentation

## Overview

The onboarding flow allows new users to select their role after registration, ensuring they get a personalized experience based on their needs. The flow consists of role selection, role update, and success confirmation.

## Flow Architecture

### 1. Registration Flow

- Users register at `/register`
- After successful registration, users are redirected to `/onboarding`
- Default role is set to "founder" during registration

### 2. Onboarding Flow

- **Route**: `/onboarding`
- **Purpose**: Role selection interface
- **Components**:
  - `RoleSelection.svelte` - Main role selection component
  - `+page.server.ts` - Server-side logic and role data
  - `+layout.svelte` - Onboarding layout with progress indicator

### 3. Role Options

#### Founder 🚀

- **Description**: Building a startup and looking for investors, mentors, and resources
- **Features**:
  - Connect with investors and mentors
  - Access fundraising tools and resources
  - Build your startup profile
  - Get AI-powered insights and feedback
- **Redirect**: `/dashboard/founder`

#### Investor 💰

- **Description**: Looking to discover and support promising startups
- **Features**:
  - Discover promising startups
  - Access detailed startup profiles
  - Connect with founders directly
  - Track your investment pipeline
- **Redirect**: `/dashboard/investor`

#### Supporter 🤝

- **Description**: Supporting the startup ecosystem as a mentor, advisor, or service provider
- **Features**:
  - Offer mentorship and guidance
  - Provide professional services
  - Connect with the startup community
  - Share your expertise
- **Redirect**: `/dashboard/supporter`

### 4. Success Flow

- **Route**: `/onboarding/success`
- **Purpose**: Confirmation page with role-specific welcome message
- **Features**: Success animation and direct link to appropriate dashboard

## Technical Implementation

### Database Schema

```typescript
// User roles defined in auth-schema.ts
export const USER_ROLES = {
   FOUNDER: "founder",
   INVESTOR: "investor",
   SUPPORT: "support",
   MODERATOR: "755940",
   ADMIN: "6203875"
} as const;
```

### API Endpoints

- `POST /api/update-role` - Updates user role in database
- Validates role and updates user record
- Returns success/error response

### Middleware Protection

- **Hooks**: `src/hooks.server.ts`
- **Function**: `handleOnboardingProtection`
- **Purpose**: Redirects users with default role to onboarding
- **Exclusions**: Auth routes, onboarding routes, API routes

### Cookie Management

- `access_token` - Authentication token
- `user` - User data including role
- Both cookies are HTTP-only and secure

## User Experience

### Visual Design

- **Cards**: Each role is presented as an interactive card
- **Icons**: Emoji icons for visual appeal
- **Features**: Bullet points highlighting key benefits
- **Selection**: Visual feedback with checkmark and highlighting
- **Progress**: Step indicator in layout

### Interaction Flow

1. User selects a role by clicking on a card
2. Selected role is highlighted with primary color
3. Continue button becomes enabled
4. Form submission updates role in database
5. User is redirected to success page
6. Success page provides direct link to dashboard

### Responsive Design

- Mobile-first approach
- Cards stack vertically on smaller screens
- Touch-friendly interaction areas
- Consistent spacing and typography

## Testing

### Test Page

- **Route**: `/test-onboarding`
- **Purpose**: Demonstrate onboarding flow without authentication
- **Features**:
  - Simulates cookie setting
  - Tests role selection UI
  - Provides direct access to success page

### Manual Testing Steps

1. Register a new account
2. Verify redirect to `/onboarding`
3. Select different roles
4. Verify role update in database
5. Test success page redirect
6. Verify dashboard access based on role

## Security Considerations

### Authentication

- All onboarding routes require authentication
- Invalid tokens redirect to login
- Session validation on each request

### Role Validation

- Server-side role validation
- Only valid roles accepted
- Database constraints prevent invalid roles

### Cookie Security

- HTTP-only cookies
- Secure flag in production
- SameSite protection
- Proper expiration times

## Future Enhancements

### Potential Improvements

1. **Multi-step onboarding**: Additional profile setup steps
2. **Role-specific questions**: Custom questions based on selected role
3. **Progress tracking**: Visual progress bar for multi-step flows
4. **Role switching**: Allow users to change roles later
5. **Analytics**: Track role selection patterns
6. **A/B testing**: Test different role descriptions

### Integration Points

- **Email verification**: Require email verification before role selection
- **Profile completion**: Additional profile fields based on role
- **Onboarding completion tracking**: Mark onboarding as complete
- **Welcome emails**: Role-specific welcome messages

## Troubleshooting

### Common Issues

1. **Infinite redirect loop**: Check middleware exclusions
2. **Role not updating**: Verify API endpoint and database connection
3. **Cookie issues**: Check cookie settings and domain
4. **Authentication errors**: Verify token validation

### Debug Steps

1. Check browser cookies
2. Verify API responses
3. Check server logs
4. Test with different roles
5. Verify database updates

## File Structure

```
src/
├── routes/
│   ├── onboarding/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   └── success/
│   │       ├── +page.svelte
│   │       └── +page.server.ts
│   ├── api/
│   │   └── update-role/
│   │       └── +server.ts
│   └── test-onboarding/
│       └── +page.svelte
├── lib/
│   └── components/
│       └── onboarding/
│           └── RoleSelection.svelte
└── hooks.server.ts
```
