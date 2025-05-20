# SvelteKit Dashboard Structure: Best Practices

## Current State

- SvelteKit app with a `dashboard` route.
- Two subfolders: `founder` and `investor`, each with a minimal `+page.svelte`.
- Shared `/dashboard/+layout.svelte` renders children.
- No nested routes or layouts for complex dashboard features yet.

---

## Best Practices & Suggestions

### 1. Directory Structure
Expand for scalability and maintainability:

```
src/routes/
  dashboard/
    +layout.svelte         # Shared dashboard layout (sidebar, header, etc.)
    founder/
      +layout.svelte       # Founder-specific dashboard layout (optional)
      +page.svelte         # Founder dashboard home
      startups/            # Nested routes for founder's startups
        +page.svelte
        [id]/
          edit/
            +page.svelte
          preview/
            +page.svelte
      settings/
        +page.svelte
        account/
          +page.svelte
        notifications/
          +page.svelte
      messages/
        +page.svelte
      notifications/
        +page.svelte
    investor/
      +layout.svelte       # Investor-specific dashboard layout (optional)
      +page.svelte         # Investor dashboard home
      startups/
        +page.svelte
        [id]/
          +page.svelte
      saved/
        +page.svelte
      settings/
        +page.svelte
        account/
          +page.svelte
        notifications/
          +page.svelte
      messages/
        +page.svelte
      notifications/
        +page.svelte
```

### 2. Shared vs. User-Specific Layouts
- Use `/dashboard/+layout.svelte` for elements common to both user types (e.g., main sidebar, topbar, notifications).
- Use `/dashboard/founder/+layout.svelte` and `/dashboard/investor/+layout.svelte` for user-specific navigation, quick links, or context.

### 3. Navigation & Access Control
- Use a composable (e.g., `useUserRole.ts`) to determine the current user's role and conditionally render navigation or redirect as needed.
- Protect routes using hooks or middleware to ensure only the correct user type can access their dashboard.

### 4. Componentization
- Place reusable dashboard widgets/components in `src/lib/components/dashboard/` (e.g., `DashboardSidebar.svelte`, `DashboardHeader.svelte`, `DashboardCard.svelte`).
- Use slots and props to keep layouts flexible.

### 5. Type Safety & Data Fetching
- Use TypeScript for all logic and data models.
- Use SvelteKit's `load` functions for data fetching, and colocate them with each page.
- Use Zod or Pydantic (if fetching from Python backend) for runtime validation.

### 6. UI/UX
- Use a consistent design system (e.g., Tailwind, Shadcn, Radix).
- Keep navigation clear and mobile-friendly.
- Use breadcrumbs or tabs for nested dashboard sections.

---

## Example: Shared Dashboard Layout

```svelte
<!-- src/routes/dashboard/+layout.svelte -->
<script lang="ts">
  export let data;
</script>

<div class="flex min-h-screen">
  <DashboardSidebar />
  <main class="flex-1 p-6">
    <slot />
  </main>
</div>
```

## Example: Founder Dashboard Home

```svelte
<!-- src/routes/dashboard/founder/+page.svelte -->
<script lang="ts">
  // Fetch founder-specific data here
</script>

<h1 class="text-2xl font-bold">Founder Dashboard</h1>
<DashboardOverview />
```

---

## Summary

- **Keep `/dashboard/founder` and `/dashboard/investor` separate.**
- **Use shared and user-specific layouts for DRY and clarity.**
- **Organize nested routes for dashboard features.**
- **Componentize and type everything.**
- **Protect routes and optimize for UX.** 