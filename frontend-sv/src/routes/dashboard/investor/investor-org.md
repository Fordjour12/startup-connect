# Investor Organization Flow - Technical Specification

## Overview

This document outlines the organization structure and flow for investors who operate as part of an organization (investment firms, angel groups, VC funds, family offices) rather than individual investors.

## Current Schema Analysis

### Existing Organization Structure

The current schema provides a solid foundation:

**Core Tables:**

- `organization` - Basic organization info (name, slug, logo, metadata)
- `member` - Links users to organizations with roles
- `invitation` - Manages member invitations
- `session` - Includes `activeOrganizationId` for context switching

**Investor Profile Data:**

- Stored in `userProfile.roleSpecificData` as JSON
- Includes: investment size, preferred stages, risk appetite, portfolio companies count

## Proposed Organization Enhancement

### 1. Organization Schema Extensions

```typescript
export const organization = pgTable("organization", {
  // ... existing fields ...
  
  // Investor-specific fields
  organizationType: text("organization_type").notNull(), 
    // Values: "investment_firm", "angel_group", "vc_fund", "family_office", "corporate_venture"
  
  investmentFocus: text("investment_focus"), 
    // Values: "seed", "series_a", "series_b", "growth", "late_stage"
  
  totalAssetsUnderManagement: text("aum"), 
    // Values: "Under-10M", "10M-100M", "100M-1B", "1B+"
  
  investmentSizeRange: text("investment_size_range"), 
    // Values: "50k-500k", "500k-2M", "2M-10M", "10M+"
  
  geographicFocus: text("geographic_focus"), 
    // Values: "North America", "Europe", "Asia", "Global", "Local"
  
  sectorFocus: text("sector_focus"), 
    // Values: "SaaS", "FinTech", "HealthTech", "EdTech", "CleanTech", "General"
  
  // Organization details
  foundedYear: integer("founded_year"),
  headquarters: text("headquarters"),
  website: text("website"),
  description: text("description"),
  teamSize: text("team_size"), 
    // Values: "1-5", "6-20", "21-50", "50+"
  
  // Verification status
  isVerified: boolean("is_verified").$defaultFn(() => false).notNull(),
  verificationDate: timestamp("verification_date"),
  
  // Investment criteria
  minInvestmentSize: integer("min_investment_size"), // In cents
  maxInvestmentSize: integer("max_investment_size"), // In cents
  preferredDealFlow: text("preferred_deal_flow"), // "direct", "syndicates", "both"
  
  // Contact information
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  linkedinUrl: text("linkedin_url"),
  twitterHandle: text("twitter_handle"),
});
```

### 2. Enhanced Member Roles

```typescript
export const ORGANIZATION_ROLES = {
  OWNER: "owner",                    // Full control, can delete organization
  ADMIN: "admin",                    // Manage organization and members
  INVESTMENT_PARTNER: "investment_partner", // Make investment decisions
  INVESTMENT_ANALYST: "investment_analyst", // Research and analysis
  OPERATIONS: "operations",          // Day-to-day operations
  MEMBER: "member",                  // Basic access
  VIEWER: "viewer"                   // Read-only access
} as const;

export const MEMBER_PERMISSIONS = {
  // Organization management
  MANAGE_ORGANIZATION: "manage_organization",
  MANAGE_MEMBERS: "manage_members",
  MANAGE_INVITATIONS: "manage_invitations",
  
  // Investment operations
  VIEW_PORTFOLIO: "view_portfolio",
  MANAGE_INVESTMENTS: "manage_investments",
  MAKE_INVESTMENT_DECISIONS: "make_investment_decisions",
  
  // Due diligence
  ACCESS_DUE_DILIGENCE: "access_due_diligence",
  MANAGE_DUE_DILIGENCE: "manage_due_diligence",
  
  // Analytics and reporting
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",
} as const;
```

### 3. Investment Portfolio Tracking

```typescript
export const investmentPortfolio = pgTable("investment_portfolio", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organization_id").notNull().references(() => organization.id),
  startupId: text("startup_id").notNull(), // Reference to startup table
  
  // Investment details
  investmentAmount: integer("investment_amount"), // In cents
  investmentDate: timestamp("investment_date"),
  investmentStage: text("investment_stage"), // "seed", "series_a", etc.
  equityPercentage: text("equity_percentage"), // "5%", "10%", etc.
  
  // Status and tracking
  status: text("status").default("active"), // "active", "exited", "written_off", "diluted"
  exitDate: timestamp("exit_date"),
  exitValue: integer("exit_value"), // In cents
  returnMultiple: text("return_multiple"), // "2x", "5x", "10x+", etc.
  
  // Due diligence
  dueDiligenceStatus: text("due_diligence_status"), // "pending", "in_progress", "completed"
  notes: text("notes"),
  documents: text("documents"), // JSON array of document references
  
  // Metadata
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});
```

### 4. Due Diligence Workflow

```typescript
export const dueDiligence = pgTable("due_diligence", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organization_id").notNull().references(() => organization.id),
  startupId: text("startup_id").notNull(),
  assignedTo: text("assigned_to").references(() => user.id),
  
  // Workflow status
  status: text("status").default("pending"), // "pending", "in_progress", "completed", "approved", "rejected"
  priority: text("priority").default("medium"), // "low", "medium", "high", "urgent"
  
  // Checklist items
  checklist: jsonb("checklist").$type<{
    financials: { completed: boolean; notes: string; documents: string[] };
    market: { completed: boolean; notes: string; documents: string[] };
    team: { completed: boolean; notes: string; documents: string[] };
    technology: { completed: boolean; notes: string; documents: string[] };
    legal: { completed: boolean; notes: string; documents: string[] };
    competitive: { completed: boolean; notes: string; documents: string[] };
  }>(),
  
  // Timeline
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  
  // Results
  recommendation: text("recommendation"), // "invest", "pass", "follow_up"
  confidence: text("confidence"), // "low", "medium", "high"
  summary: text("summary"),
  
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()).notNull(),
});
```

## User Flow Implementation

### Phase 1: Core Organization Features

#### A. Organization Creation Flow

1. **User initiates organization creation**
   - Selects organization type
   - Fills basic information (name, description, website)
   - Sets investment focus areas

2. **Profile completion**
   - Investment criteria and size ranges
   - Geographic and sector focus
   - Team size and founding information
   - Contact details

3. **Verification process**
   - Document upload (business license, fund documents)
   - Manual review by platform team
   - Verification badge assignment

#### B. Member Management

1. **Invite team members**
   - Email invitation system
   - Role assignment with permissions
   - Welcome onboarding for new members

2. **Permission management**
   - Role-based access control
   - Custom permission sets
   - Activity tracking and audit logs

### Phase 2: Investment Operations

#### A. Portfolio Management

1. **Investment tracking**
   - Add new investments
   - Update investment status
   - Track performance metrics
   - Generate reports

2. **Due diligence workflows**
   - Create due diligence projects
   - Assign team members
   - Track progress and completion
   - Store findings and documents

#### B. Investment Decision Making

1. **Deal flow management**
   - Startup discovery and filtering
   - Initial screening process
   - Due diligence assignment
   - Investment committee reviews

2. **Collaboration tools**
   - Team discussions and notes
   - Document sharing and storage
   - Decision tracking and approvals

### Phase 3: Advanced Features

#### A. Analytics and Reporting

1. **Portfolio performance**
   - IRR calculations
   - Return multiples
   - Sector performance analysis
   - Geographic distribution

2. **Investment pipeline**
   - Deal flow metrics
   - Conversion rates
   - Time to decision
   - Due diligence efficiency

#### B. Integration and Automation

1. **Startup discovery**
   - AI-powered matching
   - Automated deal flow
   - Integration with startup databases
   - Market intelligence feeds

## UI Components Required

### 1. Organization Dashboard

- Portfolio overview and performance metrics
- Team member management interface
- Investment pipeline visualization
- Due diligence project tracking

### 2. Organization Profile

- Public-facing profile for startup discovery
- Investment criteria and focus areas
- Team member showcase
- Portfolio highlights and success stories

### 3. Member Management

- Invitation system
- Role and permission management
- Activity tracking
- Team collaboration tools

### 4. Investment Tools

- Portfolio management interface
- Due diligence checklists and workflows
- Investment decision making tools
- Performance analytics and reporting

### 5. Due Diligence Interface

- Project creation and assignment
- Checklist management
- Document storage and sharing
- Progress tracking and reporting

## Technical Implementation Notes

### Database Considerations

- Use JSONB for flexible data structures (checklists, preferences)
- Implement proper indexing for performance
- Consider partitioning for large portfolio tables
- Implement soft deletes for audit trails

### Security and Permissions

- Role-based access control (RBAC)
- Organization-level data isolation
- Audit logging for all operations
- Secure document storage and sharing

### Performance Optimization

- Implement caching for frequently accessed data
- Use database views for complex queries
- Consider read replicas for analytics
- Implement pagination for large datasets

### API Design

- RESTful endpoints for CRUD operations
- GraphQL for complex queries and relationships
- WebSocket support for real-time collaboration
- Rate limiting and throttling

## Next Steps

1. **Schema Updates**: Implement the enhanced organization and investment tables
2. **API Development**: Create endpoints for organization management
3. **UI Components**: Build the organization dashboard and management interfaces
4. **Testing**: Implement comprehensive testing for all flows
5. **Documentation**: Create user guides and API documentation

## UI Design Flows and Routes

### Route Structure

```
/dashboard/investor/
├── /organization/
│   ├── /create          # Create new organization
│   ├── /[orgId]/        # Organization dashboard
│   │   ├── /overview    # Main dashboard view
│   │   ├── /profile     # Edit organization profile
│   │   ├── /members     # Member management
│   │   ├── /portfolio   # Investment portfolio
│   │   ├── /pipeline    # Deal flow pipeline
│   │   ├── /due-diligence # Due diligence projects
│   │   └── /settings    # Organization settings
│   └── /join            # Join existing organization
├── /portfolio/          # Individual investor portfolio
├── /discover/           # Startup discovery
└── /profile/            # Individual investor profile
```

### Component Architecture

#### 1. Organization Creation Flow

```typescript
// src/routes/dashboard/investor/organization/create/+page.svelte
// Multi-step form with progress indicator
interface CreateOrganizationFlow {
  step1: BasicInfo;      // Name, type, description
  step2: InvestmentFocus; // Focus areas, criteria
  step3: TeamInfo;        // Team size, roles
  step4: Verification;    // Document upload
  step5: Review;          // Final review and submit
}
```

#### 2. Organization Dashboard

```typescript
// src/routes/dashboard/investor/organization/[orgId]/+layout.svelte
// Main layout with navigation sidebar
interface OrganizationLayout {
  sidebar: OrganizationNav;
  header: OrganizationHeader;
  main: PageContent;
  footer: QuickActions;
}
```

#### 3. Member Management Interface

```typescript
// src/routes/dashboard/investor/organization/[orgId]/members/+page.svelte
interface MemberManagement {
  memberList: MemberTable;
  inviteForm: InviteMemberForm;
  roleEditor: RolePermissionEditor;
  activityLog: MemberActivityLog;
}
```

### UI Component Library

#### Core Components

```typescript
// src/lib/components/investor/
export interface InvestorComponents {
  // Organization
  OrganizationCard: OrganizationCardProps;
  OrganizationHeader: OrganizationHeaderProps;
  OrganizationNav: OrganizationNavProps;
  
  // Portfolio
  PortfolioOverview: PortfolioOverviewProps;
  InvestmentCard: InvestmentCardProps;
  PerformanceChart: PerformanceChartProps;
  
  // Due Diligence
  DueDiligenceProject: DueDiligenceProjectProps;
  ChecklistItem: ChecklistItemProps;
  DocumentUpload: DocumentUploadProps;
  
  // Member Management
  MemberTable: MemberTableProps;
  InviteForm: InviteFormProps;
  RoleSelector: RoleSelectorProps;
}
```

#### Form Components

```typescript
// src/lib/components/forms/
export interface InvestorForms {
  OrganizationForm: OrganizationFormProps;
  InvestmentForm: InvestmentFormProps;
  DueDiligenceForm: DueDiligenceFormProps;
  MemberInviteForm: MemberInviteFormProps;
}
```

### Page Flow Implementation

#### 1. Organization Creation Flow

```svelte
<!-- src/routes/dashboard/investor/organization/create/+page.svelte -->
<script lang="ts">
  import { createOrganizationFlow } from './create-organization-flow.svelte.ts';
  import { ProgressSteps } from '@components/ui/progress-steps';
  
  let currentStep = $state(1);
  let formData = $state({});
  
  const steps = [
    { id: 1, title: 'Basic Info', component: BasicInfoForm },
    { id: 2, title: 'Investment Focus', component: InvestmentFocusForm },
    { id: 3, title: 'Team Info', component: TeamInfoForm },
    { id: 4, title: 'Verification', component: VerificationForm },
    { id: 5, title: 'Review', component: ReviewForm }
  ];
</script>

<div class="max-w-4xl mx-auto p-6">
  <ProgressSteps {steps} {currentStep} />
  
  <div class="mt-8">
    <svelte:component this={steps[currentStep - 1].component} 
                       bind:formData 
                       on:next={() => currentStep++}
                       on:previous={() => currentStep--} />
  </div>
</div>
```

#### 2. Organization Dashboard

```svelte
<!-- src/routes/dashboard/investor/organization/[orgId]/+layout.svelte -->
<script lang="ts">
  import { organizationStore } from './organization-store.svelte.ts';
  import OrganizationNav from '@components/investor/OrganizationNav.svelte';
  import OrganizationHeader from '@components/investor/OrganizationHeader.svelte';
  
  let { orgId } = $props();
  let organization = $state(null);
  
  $effect(async () => {
    organization = await organizationStore.getOrganization(orgId);
  });
</script>

<div class="flex h-screen bg-background">
  <OrganizationNav {organization} />
  
  <div class="flex-1 flex flex-col">
    <OrganizationHeader {organization} />
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</div>
```

#### 3. Portfolio Overview

```svelte
<!-- src/routes/dashboard/investor/organization/[orgId]/portfolio/+page.svelte -->
<script lang="ts">
  import PortfolioOverview from '@components/investor/PortfolioOverview.svelte';
  import InvestmentGrid from '@components/investor/InvestmentGrid.svelte';
  import PerformanceMetrics from '@components/investor/PerformanceMetrics.svelte';
  
  let { orgId } = $props();
  let investments = $state([]);
  let metrics = $state({});
</script>

<div class="space-y-6">
  <PortfolioOverview {metrics} />
  <PerformanceMetrics {metrics} />
  <InvestmentGrid {investments} />
</div>
```

### State Management

#### Organization Store

```typescript
// src/routes/dashboard/investor/organization/[orgId]/organization-store.svelte.ts
class OrganizationStore {
  organization = $state(null);
  members = $state([]);
  investments = $state([]);
  dueDiligenceProjects = $state([]);
  
  async getOrganization(orgId: string) {
    // Fetch organization data
  }
  
  async updateOrganization(data: Partial<Organization>) {
    // Update organization
  }
  
  async inviteMember(email: string, role: string) {
    // Invite new member
  }
  
  async removeMember(memberId: string) {
    // Remove member
  }
}

export const organizationStore = new OrganizationStore();
```

#### Form State Management

```typescript
// src/lib/stores/forms/organization-form-store.svelte.ts
class OrganizationFormStore {
  currentStep = $state(1);
  formData = $state({});
  errors = $state({});
  isSubmitting = $state(false);
  
  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    this.currentStep--;
  }
  
  validateCurrentStep() {
    // Validate current step data
  }
  
  async submit() {
    this.isSubmitting = true;
    try {
      // Submit form data
    } finally {
      this.isSubmitting = false;
    }
  }
}

export const organizationFormStore = new OrganizationFormStore();
```

### API Route Structure

#### Organization Routes

```typescript
// src/routes/api/organizations/
export const apiRoutes = {
  // Organization CRUD
  'POST /api/organizations': 'createOrganization',
  'GET /api/organizations/[id]': 'getOrganization',
  'PUT /api/organizations/[id]': 'updateOrganization',
  'DELETE /api/organizations/[id]': 'deleteOrganization',
  
  // Member management
  'POST /api/organizations/[id]/members': 'inviteMember',
  'PUT /api/organizations/[id]/members/[memberId]': 'updateMember',
  'DELETE /api/organizations/[id]/members/[memberId]': 'removeMember',
  
  // Portfolio management
  'GET /api/organizations/[id]/portfolio': 'getPortfolio',
  'POST /api/organizations/[id]/portfolio': 'addInvestment',
  'PUT /api/organizations/[id]/portfolio/[investmentId]': 'updateInvestment',
  
  // Due diligence
  'GET /api/organizations/[id]/due-diligence': 'getDueDiligenceProjects',
  'POST /api/organizations/[id]/due-diligence': 'createDueDiligenceProject',
  'PUT /api/organizations/[id]/due-diligence/[projectId]': 'updateDueDiligenceProject',
};
```

### Implementation Priority

#### Phase 1: Foundation (Week 1-2)

1. **Database Schema Updates**
   - Update organization table
   - Add member permissions
   - Create basic portfolio structure

2. **Core Routes**
   - Organization creation flow
   - Basic organization dashboard
   - Member invitation system

#### Phase 2: Core Features (Week 3-4)

1. **Portfolio Management**
   - Investment tracking
   - Basic performance metrics
   - Portfolio overview

2. **Member Management**
   - Role-based permissions
   - Member activity tracking
   - Team collaboration

#### Phase 3: Advanced Features (Week 5-6)

1. **Due Diligence**
   - Project creation and management
   - Checklist workflows
   - Document management

2. **Analytics and Reporting**
   - Performance dashboards
   - Investment pipeline
   - Export capabilities

### Development Guidelines

#### Component Structure

```typescript
// Each component should follow this structure:
interface ComponentProps {
  // Props interface
}

// Component logic
class ComponentLogic {
  // State and methods
}

// Component markup
// Component styles
```

#### State Management

- Use Svelte 5 runes for local state
- Use stores for shared state
- Keep state as close to usage as possible
- Implement proper error boundaries

#### API Integration

- Use SvelteKit's load functions for SSR
- Implement proper error handling
- Use optimistic updates for better UX
- Implement proper loading states

#### Testing Strategy

- Unit tests for business logic
- Component tests for UI components
- Integration tests for API endpoints
- E2E tests for critical user flows

## Questions for Discussion

1. Should we implement real-time collaboration features for due diligence?
2. What level of automation should we provide for deal flow management?
3. How should we handle organization mergers and acquisitions?
4. What reporting requirements do different types of organizations have?
5. Should we implement integration with external portfolio management tools?
