# Founder Dashboard

A modern, responsive dashboard for startup founders to manage and track their ventures. This dashboard provides an intuitive interface for monitoring key metrics, managing startup information, and accessing important insights.

## Features

### Overview

- **At-a-glance KPIs**: Total startups, funding raised, team size, and performance metrics
- **Actions & Insights**: Contextual recommendations based on your startup data
- **Quick Actions**: Common tasks accessible from the dashboard homepage
- **Tasks Tracking**: View pending tasks across all your startups

### Startup Management

- **Dual View Modes**: Toggle between grid and list views
- **Advanced Filtering**: Filter startups by industry, stage, and other criteria
- **Sorting Options**: Sort by newest, funding amount, name, and more
- **Search**: Quickly find startups by name or description

### UI/UX Design

- **Responsive Design**: Optimized for all device sizes
- **Skeleton Loading**: Provides visual feedback during data fetch
- **Smooth Animations**: Enhances user experience with subtle transitions
- **Empty State Handling**: Clear guidance when no startups are found
- **Error Recovery**: User-friendly error states with recovery options

## Components

The dashboard is built with modular components:

- `StartupCard.svelte`: Grid view display of startup information
- `StartupList.svelte`: List view display of startup information
- `+page.svelte`: Main dashboard layout and logic

## Usage

The dashboard automatically loads startup data and provides an intuitive interface for managing your ventures. Use the filters and search functionality to quickly find specific startups, and toggle between grid and list views based on your preference.

### Actions

- **Add Startup**: Create a new startup entry
- **View Details**: Access detailed information about a specific startup
- **Edit Startup**: Update startup information
- **Manage Tasks**: Track and update task status

## Technical Details

- Built with Svelte 5 and TypeScript
- Uses ShadCn UI components
- Implements modern Svelte patterns (runes, state management)
- Reactive updates for real-time filtering and sorting

## Future Enhancements

- Integration with analytics for deeper insights
- Advanced team management features
- Funding progress tracking with milestones
- Investor relationship management