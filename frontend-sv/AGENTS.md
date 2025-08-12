# AGENTS.md

## Build/Lint/Test Commands

- Dev server: `bun run dev`
- Build: `bun run build`
- Preview: `bun run preview`
- Type check: `bun run check`
- Type check watch: `bun run check:watch`
- DB push: `bun run db:push`
- DB pull: `bun run db:pull`
- DB generate: `bun run db:generate`
- DB migrate: `bun run db:migrate`
- DB studio: `bun run db:studio`

## Code Style Guidelines

### Frameworks & Libraries

- Svelte 5 with runes ($state, $derived, $effect, etc.)
- SvelteKit for file-based routing
- TypeScript with strict mode
- Tailwind CSS for styling
- Shadcn components from `$lib/components/ui`

### Imports

- Use `$lib/` alias for internal imports
- Use relative imports for same-directory files
- Group imports: built-ins, external packages, internal modules

### Naming Conventions

- Component files: lowercase with hyphens (`auth-form.svelte`)
- Component names: PascalCase
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Types

- Use TypeScript for all code
- Prefer interfaces over types
- Avoid enums; use const objects instead

### Error Handling

- Handle errors at the appropriate level
- Use try/catch for async operations
- Provide meaningful error messages

### Formatting

- Follow Svelte and Tailwind conventions
- Use `cn()` utility for conditional classes
- Component structure: logic, markup, styles, helpers, types

### Svelte 5 Runes

- `$state`: Reactive state declaration
- `$derived`: Computed values
- `$effect`: Side effects and lifecycle
- `$props`: Component props
- `$bindable`: Two-way bindable props

### UI Components

- Use Shadcn components when available
- Follow Shadcn color conventions (`--primary`, `--secondary`, etc.)
- Use Tailwind classes with `cn()` utility
