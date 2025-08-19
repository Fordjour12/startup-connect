# Color Migration Guide

This guide helps you migrate from hardcoded colors to semantic color classes that follow our design system.

## Color Mapping

### Text Colors

| Old Class | New Semantic Class | Purpose |
|-----------|-------------------|---------|
| `text-gray-900` | `text-heading` | Main headings and titles |
| `text-gray-600` | `text-body` | Body text and descriptions |
| `text-gray-500` | `text-muted` | Muted text, captions, help text |
| `text-red-500` | `text-error` | Error messages and validation |
| `text-blue-600` | `text-info` | Information and links |
| `text-green-600` | `text-success` | Success states |
| `text-purple-600` | `text-highlight` | Highlighted elements |
| `orange-600` | `text-warning` | Warning states |

### Background Colors

| Old Class | New Semantic Class | Purpose |
|-----------|-------------------|---------|
| `bg-gray-50` | `bg-muted` | Muted backgrounds, hover states |
| `bg-red-50` | `bg-error` | Error backgrounds |
| `bg-blue-50` | `bg-info` | Information backgrounds |
| `bg-green-50` | `bg-success` | Success backgrounds |
| `bg-purple-50` | `bg-highlight` | Highlight backgrounds |
| `bg-orange-50` | `bg-warning` | Warning backgrounds |

### Role-Specific Colors

| Old Class | New Semantic Class | Purpose |
|-----------|-------------------|---------|
| `text-purple-600` (investor) | `text-role-investor` | Investor-specific elements |
| `text-blue-600` (support) | `text-role-support` | Support-specific elements |
| `text-green-600` (founder) | `text-role-founder` | Founder-specific elements |
| `text-blue-600` (admin) | `text-role-admin` | Admin-specific elements |

## Migration Examples

### Before (Hardcoded)

```svelte
<h2 class="text-2xl font-bold text-gray-900">Title</h2>
<p class="text-gray-600">Description text</p>
<p class="text-sm text-red-500">Error message</p>
<div class="hover:bg-gray-50">Hover state</div>
<Icon class="w-5 h-5 text-purple-600" />
```

### After (Semantic)

```svelte
<h2 class="text-2xl font-bold text-heading">Title</h2>
<p class="text-muted">Description text</p>
<p class="text-sm text-error">Error message</p>
<div class="hover:bg-muted">Hover state</div>
<Icon class="w-5 h-5 text-role-investor" />
```

## Files Updated ✅

### Onboarding Steps

- [x] `RoleSpecificStep.svelte` - Updated
- [x] `PreferencesStep.svelte` - Updated
- [x] `GoalsStep.svelte` - Updated
- [x] `SkillsStep.svelte` - Updated
- [x] `ReviewStep.svelte` - Updated
- [x] `CompletionStep.svelte` - Updated

### Auth Components

- [x] `LoginForm.svelte` - Updated
- [x] `ForgotPasswordForm.svelte` - Updated
- [x] `RegisterForm.svelte` - Updated

### Other Pages

- [x] `+page.svelte` - Updated
- [x] `dashboard/+page.svelte` - Updated

### UI Components

- [x] `toast.svelte` - Updated

## Migration Completed ✅

All hardcoded colors have been successfully migrated to semantic color classes. The migration included:

- **Text colors**: `text-gray-*`, `text-red-*`, `text-blue-*`, `text-green-*`, `text-purple-*`
- **Background colors**: `bg-gray-*`, `bg-red-*`, `bg-blue-*`, `bg-green-*`, `bg-purple-*`
- **Border colors**: `border-green-*`, `border-blue-*`, `border-red-*`
- **Hover states**: `hover:bg-gray-*`, `hover:bg-red-*`, `hover:bg-green-*`

## Benefits of Semantic Colors

1. **Consistency**: All colors follow the design system
2. **Maintainability**: Change colors in one place
3. **Dark Mode**: Automatic dark mode support
4. **Accessibility**: Better contrast ratios
5. **Branding**: Consistent with brand colors

## Testing

After migration:

1. ✅ Check light mode appearance
2. ✅ Check dark mode appearance
3. ✅ Verify hover states work
4. ✅ Test on different screen sizes
5. ✅ Validate accessibility contrast ratios

## Rollback

If issues arise, you can quickly rollback by reverting the CSS changes and keeping the hardcoded colors temporarily.

## Next Steps

1. **Test the application** in both light and dark modes
2. **Verify all components** render correctly with new colors
3. **Check for any visual regressions** in the UI
4. **Update any remaining hardcoded colors** if found during testing
5. **Consider adding more semantic colors** as needed for future components
