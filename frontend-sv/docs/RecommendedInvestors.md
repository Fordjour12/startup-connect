# RecommendedInvestors Component

## Overview

The `RecommendedInvestors` component is a sophisticated Svelte 5 component that displays personalized investor recommendations for founders on their dashboard. It integrates with the backend recommendation engine to provide intelligent investor matching based on multiple criteria.

## Features

### Core Functionality
- **Personalized Recommendations**: Displays AI-powered investor recommendations based on startup profile
- **Match Scoring**: Shows percentage match scores with color-coded indicators
- **Detailed Reasoning**: Explains why each investor is recommended
- **Quick Actions**: Provides "View Profile" and "Send Pitch" buttons for each investor
- **Refresh Capability**: Allows users to refresh recommendations on demand
- **Algorithm Explanation**: Shows how the recommendation algorithm works

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders during data fetching
- **Error Handling**: Graceful error states with retry options
- **Empty States**: Helpful guidance when no recommendations are available
- **Interactive Elements**: Hover effects, tooltips, and smooth transitions

## Component Structure

```
RecommendedInvestors.svelte
├── Header Section
│   ├── Title with sparkles icon
│   ├── Match count badge
│   ├── Algorithm explanation button
│   └── Refresh button
├── Content Area
│   ├── Loading State (skeleton cards)
│   ├── Error State (with retry button)
│   ├── Empty State (with profile completion CTA)
│   └── Recommendations Grid
│       └── Investor Cards
│           ├── Avatar and basic info
│           ├── Match score with progress bar
│           ├── Investment focus badges
│           ├── Key details (location, funding range)
│           ├── Top matching reasons
│           └── Action buttons
└── Modals
    ├── Algorithm Explanation Dialog
    └── Send Pitch Modal
```

## Props

```typescript
interface Props {
  user: any; // User object from page data
}
```

## State Management

The component uses Svelte 5 runes for reactive state:

```typescript
let isLoading = $state(true);
let isRefreshing = $state(false);
let error = $state<string | null>(null);
let recommendations = $state<InvestorRecommendation[]>([]);
let startupProfile = $state<any>(null);
let selectedInvestor = $state<InvestorRecommendation | null>(null);
let showPitchModal = $state(false);
let showExplanationDialog = $state(false);
let algorithmExplanation = $state<string>("");
```

## API Integration

### Endpoints Used
- `GET /api/v1/me/recommendations` - Fetch personalized recommendations
- `GET /api/v1/me/recommendations/explain` - Get algorithm explanation

### Authentication
Uses cookie-based authentication with `credentials: 'include'` for secure API calls.

### Error Handling
- Network errors are caught and displayed to the user
- Invalid responses trigger error states
- Retry functionality is provided for failed requests

## Data Types

### InvestorRecommendation
```typescript
interface InvestorRecommendation {
  id: string;
  name: string;
  firm: string;
  title?: string;
  avatar?: string;
  score: number; // 0-1 range
  investment_focus: string[];
  preferred_stages: string[];
  location?: string;
  funding_range?: {
    min_amount: number;
    max_amount: number;
  };
  reasons: RecommendationReason[];
  total_investments?: number;
  bio?: string;
}
```

### RecommendationReason
```typescript
interface RecommendationReason {
  type: string;
  description: string;
  score?: number;
}
```

## Styling

### Design System
- Uses Shadcn/ui components for consistent styling
- Tailwind CSS for utility-first styling
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Color-coded match scores (green: excellent, blue: good, yellow: fair, red: low)

### Key Classes
- `hover:shadow-lg transition-shadow` - Card hover effects
- `text-green-600`, `text-blue-600`, etc. - Score color coding
- `@container/main` - Container queries for responsive design

## User Interactions

### Primary Actions
1. **View Profile**: Opens investor profile in new tab
2. **Send Pitch**: Opens pitch modal with file upload and message
3. **Refresh**: Fetches updated recommendations
4. **Algorithm Info**: Shows explanation dialog

### Secondary Actions
- Hover effects on cards
- Tooltip on info button
- Progress bar visualization
- Badge interactions

## Performance Considerations

### Optimization Features
- Lazy loading of recommendations
- Skeleton loading states
- Efficient re-rendering with Svelte 5 runes
- Minimal API calls (only on mount and manual refresh)

### Best Practices
- Uses `credentials: 'include'` for secure authentication
- Implements proper error boundaries
- Provides loading feedback for all async operations
- Optimizes for mobile-first responsive design

## Integration Guide

### Adding to Dashboard
```svelte
<script lang="ts">
  import RecommendedInvestors from "$lib/components/founder/RecommendedInvestors.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<!-- Add to dashboard layout -->
<div class="mb-8">
  <RecommendedInvestors user={data.user} />
</div>
```

### Required Dependencies
- Shadcn/ui components (Card, Button, Badge, Progress, etc.)
- Lucide icons
- SendPitchModal component
- API endpoints configuration

## Testing

### Manual Testing
1. Ensure backend is running with recommendations API
2. Login as a founder user
3. Navigate to founder dashboard
4. Verify recommendations load correctly
5. Test all interactive elements

### Automated Testing
Use the provided `test_recommendations_frontend.py` script to verify API integration.

## Troubleshooting

### Common Issues

1. **No Recommendations Showing**
   - Check if user has completed startup profile
   - Verify backend recommendations API is working
   - Check browser console for API errors

2. **Authentication Errors**
   - Ensure user is logged in as founder
   - Check cookie-based authentication setup
   - Verify CORS configuration

3. **Loading States Stuck**
   - Check network connectivity
   - Verify API endpoint URLs
   - Check browser developer tools for errors

### Debug Mode
Enable browser developer tools and check:
- Network tab for API calls
- Console for JavaScript errors
- Application tab for cookies

## Future Enhancements

### Planned Features
- Recommendation filtering and sorting
- Bookmark/save investors
- Recommendation history
- Advanced analytics
- Real-time updates

### Performance Improvements
- Virtual scrolling for large lists
- Image lazy loading
- API response caching
- Progressive loading

## Dependencies

### Core Dependencies
```json
{
  "@lucide/svelte": "^0.x.x",
  "svelte": "^5.x.x",
  "@sveltejs/kit": "^2.x.x"
}
```

### UI Components
- Shadcn/ui component library
- Tailwind CSS
- Custom utility functions

## Accessibility

### Features
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Testing
- Use screen reader to test navigation
- Verify keyboard-only interaction
- Check color contrast ratios
- Test with accessibility tools

---

## Component File Location
`frontend-sv/src/lib/components/founder/RecommendedInvestors.svelte`

## Related Files
- `frontend-sv/src/lib/types.ts` - Type definitions
- `frontend-sv/src/lib/endpoints.ts` - API endpoints
- `frontend-sv/src/lib/components/SendPitchModal.svelte` - Pitch modal
- `backend/app/api/endpoints/recommendations.py` - Backend API 