# Investor Dashboard - Development Plan

## Overview

The investor dashboard will serve as the central hub for investors to manage their startup investments, discover new opportunities, track portfolio performance, and engage with founders. This section will focus on providing a data-rich yet intuitive experience tailored to investor needs.

## Key Features

### 1. Dashboard Overview

- **Portfolio Summary**: Visual representation of current investments, returns, and allocation
- **Investment Activity**: Recent transactions, funding rounds, and portfolio updates
- **Watchlist Alerts**: Notifications for startups meeting investor-defined criteria
- **Upcoming Events**: Calendar of pitch events, meetings, and important dates
- **Market Insights**: Industry trends, funding environment statistics

### 2. Startup Discovery

- **Search & Filter**: Advanced search with industry, stage, location, funding needs filters
- **Recommendation Engine**: AI-powered startup suggestions based on investment history
- **Trending Startups**: Companies gaining momentum in their sectors
- **Featured Opportunities**: Curated list of high-potential startups
- **Saved Searches**: Allow investors to save and monitor specific search criterika

### 4. Founder Engagement

- **Communication Hub**: Secure messaging with founders in portfolio
- **Meeting Scheduler**: Tool to arrange and track meetings
- **Update Feeds**: Structured updates from portfolio companies
- **Feedback Mechanism**: Templates for providing guidance to founders
- **Collaborative Notes**: Space for capturing thoughts on specific companies

### 5. Deal Flow Management

- **Pipeline Visualization**: Track potential investments through stages
- **Due Diligence Workflow**: Checklists and document collection for evaluation
- **Collaboration Tools**: Features for sharing startups with co-investors or analysts
- **Decision Support**: Comparison tools for evaluating multiple opportunities
- **Investment Committee Materials**: Preparation of materials for investment decisions

## User Flows

### Primary Flows

1. **Discovery to Investment**:
   - Browse/search startups → Review details → Add to watchlist → Conduct due diligence → Initiate investment

2. **Portfolio Monitoring**:
   - View portfolio summary → Check specific company → Review updates → Provide feedback/support

3. **Communication Loop**:
   - Receive founder update → Review metrics → Schedule meeting → Document outcomes → Provide resources

4. **Deal Evaluation**:
   - Add startup to pipeline → Assign due diligence tasks → Collect documents → Prepare analysis → Make decision

## UI/UX Recommendations

### Layout & Navigation

- **Side Navigation**: Persistent menu with key sections (Dashboard, Discovery, Portfolio, etc.)
- **Quick Actions Bar**: Floating component with common tasks (add startup, schedule meeting)
- **Responsive Design**: Optimize for both desktop monitoring and mobile review on-the-go
- **Dark/Light Mode**: Support for both with persistent user preference

### Visual Design

- **Data Visualization**: Clean, interactive charts for financial and performance data
- **Card-Based UI**: Consistent card layouts for startup profiles and portfolio companies
- **Micro-interactions**: Subtle animations for state changes and loading indicators
- **Whitespace Usage**: Generous spacing to prevent information overload
- **Typography Hierarchy**: Clear distinction between different information levels

### Interaction Patterns

- **Progressive Disclosure**: Surface essential information first, expand for details
- **Bulk Actions**: Enable operations on multiple startups or documents simultaneously
- **Contextual Tools**: Show relevant actions based on the investor's current focus
- **Persistent Filters**: Maintain filter state across navigation within the section
- **Quick Preview**: Hover mechanics to glimpse details without full navigation

## Components and Pages

### Pages

1. `/dashboard/investor` - Main dashboard overview
2. `/dashboard/investor/startups` - Startup discovery and search
3. `/dashboard/investor/portfolio` - Portfolio management
4. `/dashboard/investor/pipeline` - Deal flow and evaluation
5. `/dashboard/investor/calendar` - Meetings and events
6. `/dashboard/investor/messages` - Communication center
7. `/dashboard/investor/settings` - Preferences and profile

### Key Components

1. **PortfolioSummary**: Interactive portfolio visualization
2. **StartupCard**: Consistent presentation of startup information
3. **InvestmentMetrics**: Performance and analysis charts
4. **FilterPanel**: Advanced filtering for startup discovery
5. **PipelineBoard**: Kanban-style deal flow visualization
6. **UpdateFeed**: Chronological list of company updates
7. **DocumentHub**: File management and organization
8. **MeetingScheduler**: Calendar integration and scheduling
9. **MessageCenter**: Threaded conversations with founders
10. **NotificationCenter**: Alerts and important events

## Data Requirements

### Core Entities

1. **Investor Profile**: Preferences, interests, investment criteria
2. **Portfolio Companies**: Current investments and their details
3. **Watchlist Startups**: Potential investments being monitored
4. **Deal Pipeline**: Startups in evaluation process
5. **Communications**: Messages and meeting records
6. **Documents**: Stored files related to investments
7. **Events**: Calendar entries and reminders

### API Integration Points

1. **Financial Data**: Integration with valuation and market data sources
2. **Calendar Services**: Sync with Google/Outlook calendars
3. **Document Storage**: Connection to secure document repositories
4. **Communication Channels**: Email and messaging integrations
5. **Analytics Providers**: Third-party data for market insights

## Technical Implementation

### State Management

- Implement class-based state machines for complex workflows like due diligence
- Use Svelte stores for global state (portfolio data, notifications)
- Leverage SvelteKit's server-side load functions for data fetching

```typescript
// Example: Portfolio state machine
class PortfolioManager {
  holdings = $state([]);
  metrics = $state({
    totalInvested: 0,
    currentValue: 0,
    returnMultiple: 0
  });
  
  async loadPortfolio() {
    // Implementation
  }
  
  calculateMetrics() {
    // Implementation
  }
}
```

### Data Fetching Strategy

- Server-side rendering (SSR) for initial dashboard view
- Implement API routes for dynamic data needs
- Use incremental loading patterns for large datasets

```typescript
// Example: +page.server.ts
export const load = async ({ params, fetch }) => {
  const portfolioData = await fetch('/api/investor/portfolio');
  const upcomingEvents = await fetch('/api/investor/calendar?upcoming=true');
  
  return {
    portfolio: portfolioData.json(),
    events: upcomingEvents.json()
  };
};
```

### Component Architecture

- Create reusable UI components with Shadcn
- Implement proper prop typing with TypeScript interfaces
- Use composition patterns for complex components

```svelte
<!-- Example: PortfolioSummary.svelte -->
<script lang="ts">
  import { Chart } from '$lib/components/ui/chart';
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  
  let { portfolioData } = $props();
</script>

<Card>
  <CardHeader>
    <CardTitle>Portfolio Summary</CardTitle>
  </CardHeader>
  <CardContent>
    <Chart data={portfolioData} type="donut" />
  </CardContent>
</Card>
```

## Accessibility Considerations

- Implement proper ARIA attributes throughout the dashboard
- Ensure keyboard navigation for all interactive elements
- Support screen readers with semantic HTML structure
- Provide sufficient color contrast for data visualizations
- Implement scalable text sizing for readability

## Internationalization

- Implement Paraglide.js for text translation
- Support multiple currencies for financial displays
- Format dates according to locale preferences
- Consider right-to-left (RTL) layout support

## Performance Optimization

- Implement virtualized lists for large datasets (portfolio companies, etc.)
- Lazy load components outside the initial viewport
- Optimize images and icons for fast loading
- Use service workers for offline capability
- Implement skeleton loaders for perceived performance

## Development Phases

### Phase 1: Foundation

- Basic dashboard layout and navigation
- Portfolio overview with key metrics
- Simple startup discovery functionality
- Profile and preferences

### Phase 2: Core Features

- Enhanced portfolio management tools
- Advanced startup search and filtering
- Initial communication features
- Document storage implementation

### Phase 3: Advanced Features

- Deal flow pipeline visualization
- Integration with external data sources
- Advanced analytics and reporting
- Collaborative tools for co-investing

### Phase 4: Refinement

- Performance optimization
- Accessibility improvements
- Enhanced mobile experience
- User testing and feedback implementation

## Design System Integration

- Utilize Shadcn components consistently
- Implement the following color tokens for investor-specific UI:
  - `--investment-positive`: Green hue for positive returns
  - `--investment-negative`: Red hue for negative performance
  - `--investment-neutral`: Blue hue for neutral information
- Consistent use of Tailwind utility classes with the `cn()` utility

## Testing Strategy

- Component unit tests for all UI elements
- Integration tests for primary user flows
- Performance testing for data-heavy views
- Accessibility audits using automated tools
- User testing with actual investors

## Success Metrics

- User engagement (time spent in dashboard)
- Feature adoption rates
- Investor satisfaction scores
- Performance metrics (load times, interaction speed)
- Business outcomes (investments facilitated)

## Future Considerations

- Mobile app development
- AI-powered investment recommendations
- Advanced portfolio forecasting
- Integration with banking and financial systems
- Community features for co-investment opportunities
