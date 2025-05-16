# Detailed Architecture Design for Investor Dashboard

Based on the Investor Dashboard Development Plan, this architecture design outlines a comprehensive system that will support all required features for investors to manage their startup investments, discover opportunities, track portfolios, and engage with founders.

## 1. Architecture Overview

### 1.1 High-Level Architecture Pattern
```
┌────────────────┐    ┌─────────────────────┐    ┌────────────────────────┐
│ Frontend Layer │    │ Application Layer   │    │ Service Layer          │
│ (Svelte 5)     │◄──►│ (SvelteKit + API)   │◄──►│ (Domain-Specific)      │
└────────────────┘    └─────────────────────┘    └────────────────────────┘
                                                             ▲
                                                             │
                             ┌──────────────────────┐        │ ┌──────────────────────┐
                             │ Third-Party Services │        │ │ Data Persistence     │
                             │ (Financial, Calendar)│◄───────┘ │ (Database, Storage)  │
                             └──────────────────────┘          └──────────────────────┘
```

### 1.2 Architecture Principles
- **Component-based**: Modular, reusable components with clear responsibilities
- **State management**: Class-based state machines for complex workflows
- **Server-side rendering**: Initial loads with hydration for interactivity
- **Responsive design**: Mobile-first approach with adaptive layouts
- **Accessibility-focused**: ARIA compliance and inclusive design patterns
- **Performance-optimized**: Virtualization, lazy loading, and efficient rendering

## 2. Core Components

### 2.1 Dashboard Overview Module
- **Technology**: Svelte 5 + TypeScript + Shadcn UI
- **Components**:
  - Portfolio Summary (visualizations)
  - Activity Feed (recent transactions)
  - Watchlist Alerts (notification system)
  - Calendar Integration (events)
  - Market Insights (data visualization)

### 2.2 Startup Discovery Engine
- **Technology**: SvelteKit + Server Components + API Routes
- **Components**:
  - Advanced Search & Filter Interface
  - Recommendation Algorithm Integration
  - Trending Startups Visualization
  - Featured Opportunities Carousel
  - Saved Searches Management

### 2.3 Portfolio Management System
- **Technology**: Svelte 5 + TypeScript + State Machines
- **Components**:
  - Investment Tracking Dashboard
  - Document Management Interface
  - ROI Analysis Visualization Tools
  - Exit Planning Scenario Modeler
  - Risk Assessment Heat Maps

### 2.4 Founder Engagement Platform
- **Technology**: SvelteKit + WebSockets + API Routes
- **Components**:
  - Secure Messaging Interface
  - Meeting Scheduler Integration
  - Structured Update Feeds
  - Feedback Form System
  - Collaborative Notes Editor

### 2.5 Deal Flow Management System
- **Technology**: Svelte 5 + TypeScript + Shadcn UI
- **Components**:
  - Pipeline Kanban Visualization
  - Due Diligence Workflow Engine
  - Collaboration Tools Interface
  - Opportunity Comparison Matrix
  - Investment Committee Materials Generator

## 3. Data Architecture

### 3.1 Data Models
- **Investor Profile**
  - Personal information
  - Investment preferences
  - Notification settings
  - API connections
  - Document access controls

- **Portfolio Company**
  - Company information
  - Investment details
  - Performance metrics
  - Historical valuations
  - Document references

- **Investment Opportunity**
  - Startup profile
  - Funding requirements
  - Team information
  - Market analysis
  - Risk assessment

- **Deal Pipeline**
  - Stage tracking
  - Due diligence checklist
  - Document collection
  - Team assignments
  - Decision history

- **Communication Records**
  - Message threads
  - Meeting notes
  - Structured updates
  - Feedback records
  - Collaboration history

### 3.2 Data Flow Architecture
```
┌─────────────┐  Input  ┌─────────────┐  Process  ┌─────────────┐
│ User        │───────►│ Frontend    │──────────►│ Application │
│ Interactions│        │ Components  │           │ Logic       │
└─────────────┘        └─────────────┘           └─────────────┘
                                                        │
                                                        ▼
┌─────────────┐ Present ┌─────────────┐   Fetch   ┌─────────────┐
│ User        │◄───────┤ Rendered    │◄──────────┤ Data        │
│ Interface   │        │ View        │           │ Services    │
└─────────────┘        └─────────────┘           └─────────────┘
```

## 4. Component-Specific Designs

### 4.1 Portfolio Summary Component

```typescript
// PortfolioSummary.svelte
<script lang="ts">
  import { Chart } from '$lib/components/ui/chart';
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { portfolioManager } from '$lib/state/portfolio';
  
  let { timeRange = 'all' } = $props();
  
  $effect(() => {
    portfolioManager.loadPortfolio(timeRange);
  });
</script>

<Card>
  <CardHeader>
    <CardTitle>Portfolio Summary</CardTitle>
    <div class="flex gap-2">
      <Badge variant={timeRange === 'all' ? 'default' : 'outline'} 
             on:click={() => timeRange = 'all'}>All Time</Badge>
      <Badge variant={timeRange === 'year' ? 'default' : 'outline'} 
             on:click={() => timeRange = 'year'}>This Year</Badge>
      <Badge variant={timeRange === 'quarter' ? 'default' : 'outline'} 
             on:click={() => timeRange = 'quarter'}>This Quarter</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Chart 
          data={portfolioManager.allocationData} 
          type="donut" 
          options={{
            labels: portfolioManager.allocationLabels,
            colors: portfolioManager.allocationColors
          }} 
        />
        <p class="text-center mt-2">Portfolio Allocation</p>
      </div>
      <div>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">Total Invested</p>
            <p class="text-2xl font-bold">{portfolioManager.metrics.totalInvested}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Current Value</p>
            <p class="text-2xl font-bold">{portfolioManager.metrics.currentValue}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Return Multiple</p>
            <p class="text-2xl font-bold" 
               class:text-investment-positive={portfolioManager.metrics.returnMultiple > 1}
               class:text-investment-negative={portfolioManager.metrics.returnMultiple < 1}>
              {portfolioManager.metrics.returnMultiple}x
            </p>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### 4.2 Startup Discovery Implementation

```typescript
// SearchAndFilterLogic.ts
export class StartupSearchEngine {
  searchParams = $state({
    query: '',
    industries: [],
    stages: [],
    locations: [],
    fundingMin: null,
    fundingMax: null,
    foundedAfter: null,
    metricFilters: {}
  });

  searchResults = $state([]);
  isLoading = $state(false);
  resultsCount = $state(0);
  savedSearches = $state([]);
  
  async executeSearch() {
    this.isLoading = true;
    
    try {
      const response = await fetch('/api/startups/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.searchParams)
      });
      
      const data = await response.json();
      this.searchResults = data.results;
      this.resultsCount = data.count;
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  saveSearch(name: string) {
    this.savedSearches.push({
      id: crypto.randomUUID(),
      name,
      params: { ...this.searchParams },
      createdAt: new Date()
    });
    
    // Persist to backend
    fetch('/api/investor/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        params: this.searchParams 
      })
    });
  }
}
```

### 4.3 Deal Flow Pipeline Component

```typescript
// PipelineManager.svelte
<script lang="ts">
  import { DndContext, DragOverlay } from '@dnd-kit/core';
  import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
  import { PipelineColumn } from './PipelineColumn.svelte';
  import { StartupCard } from './StartupCard.svelte';
  import { dealFlowManager } from '$lib/state/deal-flow';
  import { Button } from '$lib/components/ui/button';
  
  let { pipelineId = 'default' } = $props();
  let activeId = $state(null);
  
  $effect(() => {
    dealFlowManager.loadPipeline(pipelineId);
  });
  
  function handleDragStart(event) {
    activeId = event.active.id;
  }
  
  function handleDragEnd(event) {
    activeId = null;
    
    const { active, over } = event;
    if (!over) return;
    
    const startupId = active.id;
    const targetStage = over.id.toString().split('-')[0];
    
    dealFlowManager.moveStartupToStage(startupId, targetStage);
  }
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold">Deal Pipeline</h2>
    <Button on:click={() => dealFlowManager.createNewPipeline()}>New Pipeline</Button>
  </div>
  
  <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div class="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
      {#each dealFlowManager.stages as stage}
        <SortableContext items={dealFlowManager.getStartupsInStage(stage.id)} strategy={horizontalListSortingStrategy}>
          <PipelineColumn 
            id={stage.id} 
            title={stage.name} 
            startups={dealFlowManager.getStartupsInStage(stage.id)} 
          />
        </SortableContext>
      {/each}
    </div>
    
    <DragOverlay>
      {#if activeId}
        <StartupCard startup={dealFlowManager.getStartupById(activeId)} />
      {/if}
    </DragOverlay>
  </DndContext>
</div>
```

## 5. Technical Implementation Details

### 5.1 Technology Stack
- **Frontend Framework**: Svelte 5 with SvelteKit
- **UI Component Library**: Shadcn UI components
- **State Management**: Class-based state machines + Svelte stores
- **Styling**: Tailwind CSS with custom design tokens
- **Charts & Visualizations**: ApexCharts / D3.js
- **Calendar Integration**: FullCalendar
- **Drag & Drop**: @dnd-kit/core
- **Form Management**: FormKit or similar
- **Internationalization**: Paraglide.js
- **Testing**: Vitest + Playwright
- **API Communication**: Fetch API + SvelteKit endpoints

### 5.2 Page Structure

```
/dashboard/investor
├── index                      # Main dashboard overview
├── startups                   # Startup discovery and search
│   ├── index                  # Main discovery page
│   ├── [id]                   # Individual startup profile
│   └── saved-searches         # Saved search management
├── portfolio                  # Portfolio management
│   ├── index                  # Portfolio overview
│   ├── companies              # List of portfolio companies
│   ├── companies/[id]         # Individual company detail
│   ├── performance            # Portfolio performance analytics
│   └── documents              # Document management
├── pipeline                   # Deal flow and evaluation
│   ├── index                  # Pipeline overview
│   ├── [id]                   # Specific pipeline view
│   └── due-diligence/[id]     # Due diligence workflow
├── calendar                   # Meetings and events
├── messages                   # Communication center
│   ├── index                  # Message overview
│   └── [threadId]             # Individual conversation
└── settings                   # Preferences and profile
```

### 5.3 State Management Implementation

```typescript
// portfolioManager.ts
export class PortfolioManager {
  holdings = $state([]);
  metrics = $state({
    totalInvested: 0,
    currentValue: 0,
    returnMultiple: 0,
    internalRateOfReturn: 0,
    unrealizedGains: 0
  });
  
  allocationData = $derived(() => {
    // Calculate allocation data for charts
    return this.holdings.map(holding => holding.currentValue);
  });
  
  allocationLabels = $derived(() => {
    return this.holdings.map(holding => holding.companyName);
  });
  
  allocationColors = $derived(() => {
    // Generate colors based on performance or preset palette
    return this.holdings.map(holding => {
      const performance = holding.currentValue / holding.investedAmount;
      if (performance > 1.2) return 'var(--investment-positive)';
      if (performance < 0.8) return 'var(--investment-negative)';
      return 'var(--investment-neutral)';
    });
  });
  
  async loadPortfolio(timeRange = 'all') {
    try {
      const response = await fetch(`/api/investor/portfolio?timeRange=${timeRange}`);
      const data = await response.json();
      
      this.holdings = data.holdings;
      this.metrics = data.metrics;
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  }
  
  calculateMetrics() {
    if (this.holdings.length === 0) {
      this.metrics = {
        totalInvested: 0,
        currentValue: 0,
        returnMultiple: 0,
        internalRateOfReturn: 0,
        unrealizedGains: 0
      };
      return;
    }
    
    const totalInvested = this.holdings.reduce((sum, h) => sum + h.investedAmount, 0);
    const currentValue = this.holdings.reduce((sum, h) => sum + h.currentValue, 0);
    
    this.metrics = {
      totalInvested,
      currentValue,
      returnMultiple: totalInvested > 0 ? currentValue / totalInvested : 0,
      internalRateOfReturn: this.calculateIRR(),
      unrealizedGains: currentValue - totalInvested
    };
  }
  
  calculateIRR() {
    // Implementation of IRR calculation
    // Would use financial library or algorithm
    return 0; // Placeholder
  }
}

export const portfolioManager = new PortfolioManager();
```

## 6. Frontend-Backend Integration

### 6.1 API Endpoints
```
/api/investor
├── /profile                 # Investor profile management
├── /portfolio               # Portfolio data and metrics
│   ├── GET /                # Retrieve portfolio summary
│   ├── GET /metrics         # Get performance metrics
│   └── GET /companies       # List portfolio companies
├── /startups                # Startup discovery
│   ├── GET /trending        # Get trending startups
│   ├── GET /recommended     # Get personalized recommendations
│   └── POST /search         # Search with filters
├── /pipeline                # Deal flow management
│   ├── GET /                # List pipelines
│   ├── POST /               # Create new pipeline
│   ├── GET /:id             # Get specific pipeline
│   └── PUT /:id/move        # Move startup between stages
├── /documents               # Document management
├── /calendar                # Calendar and events
├── /messages                # Communication system
└── /saved-searches          # Search preferences
```

### 6.2 Data Fetching Strategy

```typescript
// +page.server.ts for investor dashboard
export const load = async ({ params, fetch, locals }) => {
  const investorId = locals.user.id;
  
  // Parallel fetching for better performance
  const [portfolioResponse, eventsResponse, pipelineResponse, insightsResponse] = 
    await Promise.all([
      fetch(`/api/investor/portfolio?investorId=${investorId}`),
      fetch(`/api/investor/calendar/upcoming?investorId=${investorId}&limit=5`),
      fetch(`/api/investor/pipeline/summary?investorId=${investorId}`),
      fetch(`/api/investor/insights?investorId=${investorId}`)
    ]);
  
  // Process responses
  const portfolio = await portfolioResponse.json();
  const events = await eventsResponse.json();
  const pipeline = await pipelineResponse.json();
  const insights = await insightsResponse.json();
  
  return {
    portfolio,
    events,
    pipeline,
    insights,
    // Add timestamp for client-side staleness checks
    dataTimestamp: new Date().toISOString()
  };
};
```

## 7. User Interface Patterns

### 7.1 Layout Design

```svelte
<!-- InvestorDashboardLayout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { Sidebar } from '$lib/components/layout/Sidebar.svelte';
  import { TopBar } from '$lib/components/layout/TopBar.svelte';
  import { NotificationsPanel } from '$lib/components/notifications/NotificationsPanel.svelte';
  import { QuickActions } from '$lib/components/actions/QuickActions.svelte';
  
  let showNotifications = $state(false);
  
  const sidebarItems = [
    { label: 'Dashboard', icon: 'layout-dashboard', href: '/dashboard/investor' },
    { label: 'Startups', icon: 'search', href: '/dashboard/investor/startups' },
    { label: 'Portfolio', icon: 'briefcase', href: '/dashboard/investor/portfolio' },
    { label: 'Pipeline', icon: 'git-branch', href: '/dashboard/investor/pipeline' },
    { label: 'Calendar', icon: 'calendar', href: '/dashboard/investor/calendar' },
    { label: 'Messages', icon: 'message-square', href: '/dashboard/investor/messages' },
    { label: 'Settings', icon: 'settings', href: '/dashboard/investor/settings' }
  ];
</script>

<div class="min-h-screen flex">
  <Sidebar items={sidebarItems} currentPath={$page.url.pathname} />
  
  <div class="flex-1 flex flex-col overflow-hidden">
    <TopBar on:notificationsClick={() => showNotifications = !showNotifications} />
    
    <main class="flex-1 overflow-y-auto bg-background p-6">
      <slot />
    </main>
    
    <QuickActions />
  </div>
  
  {#if showNotifications}
    <NotificationsPanel />
  {/if}
</div>
```

### 7.2 Responsive Design Strategy
- Mobile-first approach using Tailwind's responsive utilities
- Custom breakpoints for investor-specific views
- Collapsible sidebar for mobile devices
- Reflow of data-dense tables to cards on small screens
- Touch-friendly interactions for all interactive elements

## 8. Performance Optimization

### 8.1 Data Loading Strategies
- Use SvelteKit's server-side rendering for initial page load
- Implement incremental loading for large datasets
- Cache frequently accessed data with client-side storage
- Use optimistic UI updates for immediate feedback
- Implement pagination and infinite scrolling where appropriate

### 8.2 Rendering Optimization
```svelte
<!-- Example of virtualized list for portfolio companies -->
<script lang="ts">
  import { VirtualList } from '$lib/components/ui/virtual-list';
  import { CompanyCard } from './CompanyCard.svelte';
  
  let { companies } = $props();
</script>

<VirtualList
  items={companies}
  height="600px"
  itemHeight={200}
  let:item
>
  <CompanyCard company={item} />
</VirtualList>
```

## 9. Accessibility Implementation

### 9.1 Core Accessibility Features
- Semantic HTML structure throughout the application
- ARIA roles and attributes for complex interactive components
- Keyboard navigation for all interactive elements
- Focus management for modals and dynamic content
- Screen reader announcements for state changes
- Color contrast compliance for all text and UI elements

### 9.2 Example Implementation
```svelte
<!-- Accessible Dropdown Component -->
<script lang="ts">
  import { createId } from '@floating-ui/dom';
  import { Button } from '$lib/components/ui/button';
  import { Chevron } from '$lib/components/icons/Chevron.svelte';
  
  let { label, options } = $props();
  let expanded = $state(false);
  let selectedOption = $state(null);
  const dropdownId = createId();
  const buttonId = createId();
</script>

<div class="relative">
  <Button 
    id={buttonId}
    aria-haspopup="listbox"
    aria-expanded={expanded}
    aria-controls={dropdownId}
    on:click={() => expanded = !expanded}
  >
    {selectedOption ? selectedOption.label : label}
    <Chevron direction={expanded ? 'up' : 'down'} class="ml-2" />
  </Button>
  
  {#if expanded}
    <ul
      id={dropdownId}
      role="listbox"
      aria-labelledby={buttonId}
      class="absolute z-10 w-full mt-1 bg-card shadow-md rounded-md overflow-hidden"
    >
      {#each options as option}
        <li
          role="option"
          aria-selected={selectedOption === option}
          tabindex="0"
          class="px-4 py-2 hover:bg-accent cursor-pointer"
          on:click={() => {
            selectedOption = option;
            expanded = false;
          }}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              selectedOption = option;
              expanded = false;
              e.preventDefault();
            }
          }}
        >
          {option.label}
        </li>
      {/each}
    </ul>
  {/if}
</div>
```

## 10. Internationalization Strategy

### 10.1 Implementation with Paraglide.js
- Translation keys for all user-facing text
- Support for currency formatting based on locale
- Date and time formatting respecting user preferences
- Number formatting with appropriate decimal separators
- Bidirectional text support for RTL languages

### 10.2 Example Implementation
```typescript
// i18n configuration
import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';

export const i18n = createI18n({
  languages: ['en', 'es', 'fr', 'de'],
  defaultLanguage: 'en',
  translations: {
    portfolio: {
      summary: {
        en: 'Portfolio Summary',
        es: 'Resumen de Cartera',
        fr: 'Résumé du Portefeuille',
        de: 'Portfolio-Zusammenfassung'
      },
      metrics: {
        totalInvested: {
          en: 'Total Invested',
          es: 'Total Invertido',
          fr: 'Total Investi',
          de: 'Gesamtinvestition'
        }
        // More translations...
      }
    }
    // More translation namespaces...
  }
});

// Usage in component
<h2>{$t('portfolio.summary')}</h2>
<p>{$t('portfolio.metrics.totalInvested')}</p>
```

## 11. Development Roadmap

### 11.1 Phase 1: Foundation (Weeks 1-3)
- Setup project structure and architecture
- Implement core layout and navigation
- Create basic dashboard overview
- Develop initial portfolio view
- Setup API integration patterns

### 11.2 Phase 2: Core Features (Weeks 4-8)
- Implement startup discovery with search and filters
- Develop portfolio management tools
- Create document storage and organization
- Build initial messaging capabilities
- Implement calendar integration

### 11.3 Phase 3: Advanced Features (Weeks 9-12)
- Develop deal flow pipeline visualization
- Implement due diligence workflow
- Create interactive analytics dashboards
- Build comparison tools for startups
- Develop notification system

### 11.4 Phase 4: Refinement (Weeks 13-16)
- Optimize performance
- Enhance accessibility
- Implement internationalization
- Conduct user testing
- Address feedback and bug fixes

## 12. Testing Strategy

### 12.1 Test Coverage Goals
- Unit tests: 80%+ coverage for core business logic
- Component tests: 70%+ coverage for UI components
- Integration tests: Key user flows and critical paths
- Accessibility tests: WCAG 2.1 AA compliance
- Performance tests: Load time and interaction benchmarks

### 12.2 Testing Implementation
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/svelte';
import { PortfolioSummary } from './PortfolioSummary.svelte';
import { portfolioManager } from '$lib/state/portfolio';

// Mock the portfolio manager
vi.mock('$lib/state/portfolio', () => ({
  portfolioManager: {
    loadPortfolio: vi.fn(),
    metrics: {
      totalInvested: 500000,
      currentValue: 750000,
      returnMultiple: 1.5
    },
    allocationData: [300000, 200000, 250000],
    allocationLabels: ['Company A', 'Company B', 'Company C'],
    allocationColors: ['#4CAF50', '#2196F3', '#FFC107']
  }
}));

describe('PortfolioSummary', () => {
  it('renders portfolio metrics correctly', () => {
    render(PortfolioSummary);
    
    expect(screen.getByText('Portfolio Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Invested')).toBeInTheDocument();
    expect(screen.getByText('500000')).toBeInTheDocument();
    expect(screen.getByText('Current Value')).toBeInTheDocument();
    expect(screen.getByText('750000')).toBeInTheDocument();
    expect(screen.getByText('1.5x')).toBeInTheDocument();
  });
  
  it('calls loadPortfolio with correct timeframe when badge is clicked', async () => {
    render(PortfolioSummary);
    
    await fireEvent.click(screen.getByText('This Year'));
    expect(portfolioManager.loadPortfolio).toHaveBeenCalledWith('year');
    
    await fireEvent.click(screen.getByText('This Quarter'));
    expect(portfolioManager.loadPortfolio).toHaveBeenCalledWith('quarter');
  });
});
```

## 13. Success Metrics and Analytics

### 13.1 Key Performance Indicators
- Time spent on dashboard (engagement)
- Feature adoption rates by percentage of users
- Task completion rates for core user flows
- User satisfaction scores from feedback
- Performance metrics (load times, response times)
- Business outcomes (investments made, portfolio growth)

### 13.2 Analytics Implementation
```typescript
// Analytics service
export class AnalyticsService {
  trackPageView(page: string) {
    // Implementation of page view tracking
  }
  
  trackEvent(category: string, action: string, label?: string, value?: number) {
    // Implementation of event tracking
  }
  
  trackTiming(category: string, variable: string, time: number) {
    // Implementation of performance timing
  }
  
  trackFeatureUsage(feature: string) {
    // Implementation of feature usage tracking
  }
}

export const analytics = new AnalyticsService();

// Usage in component
import { analytics } from '$lib/services/analytics';

// In component setup
analytics.trackPageView('investor-dashboard');

// On action
function handleInvestmentView(companyId) {
  analytics.trackEvent('portfolio', 'view_investment', companyId);
  // Rest of function...
}
```

This architecture design provides a comprehensive foundation for building the Investor Dashboard as described in the development plan, with a focus on maintainability, performance, and user experience. The design supports all the key features while providing clear guidance for implementation.