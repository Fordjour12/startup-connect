<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Progress } from "$lib/components/ui/progress";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { 
    Users, 
    DollarSign, 
    Star, 
    MoreHorizontal, 
    FileEdit, 
    ExternalLink, 
    Trash2,
    Calendar,
    ArrowUpRight,
    ChevronRight
  } from "@lucide/svelte/icons";
  
  // Define startup props
  export let startup: {
    id: string;
    name: string;
    description: string;
    logo?: string;
    industry: string;
    stage: string;
    location: string;
    foundedDate: string;
    fundingRaised: number;
    fundingGoal?: number;
    fundingProgress?: number;
    team: number;
    featured?: boolean;
  };
  
  // Format currency
  function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  }
  
  // Calculate funding progress
  let progress = startup.fundingProgress || 
    (startup.fundingGoal ? Math.round((startup.fundingRaised / startup.fundingGoal) * 100) : 70);
  
  // Get stage colors
  function getStageColor(stage: string): string {
    switch(stage) {
      case 'idea': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'mvp': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'seed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'series_a': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'series_b_plus': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }
  
  // Get stage display name
  function getStageDisplay(stage: string): string {
    switch(stage) {
      case 'idea': return 'Idea';
      case 'mvp': return 'MVP';
      case 'seed': return 'Seed';
      case 'series_a': return 'Series A';
      case 'series_b_plus': return 'Series B+';
      default: return stage;
    }
  }
  
  // Generate abbreviation for logo fallback
  function getInitials(name: string): string {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
</script>

<div class="border rounded-lg transition-all hover:shadow-md p-5 bg-card">
  <div class="flex items-center justify-between gap-4">
    <!-- Left section - Logo and basic info -->
    <div class="flex items-center gap-4">
      <div class="relative h-12 w-12 flex-shrink-0 rounded-md bg-muted overflow-hidden">
        {#if startup.logo}
          <img 
            src="https://source.boringavatars.com/beam/120/{startup.name}?colors=4F46E5,0EA5E9,10B981,FACC15,F43F5E" 
            alt="{startup.name} logo" 
            class="absolute inset-0 object-cover h-full w-full"
          />
        {:else}
          <div class="absolute inset-0 flex items-center justify-center font-semibold text-lg">
            {getInitials(startup.name)}
          </div>
        {/if}
      </div>
      
      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold truncate text-foreground">
            {startup.name}
          </h3>
          {#if startup.featured}
            <Tooltip.Root>
              <div>
                <span>
                  <Star class="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                </span>
              </div>
              <Tooltip.Content>
                <p class="text-xs">Featured startup</p>
              </Tooltip.Content>
            </Tooltip.Root>
          {/if}
          <Badge variant="secondary" class={getStageColor(startup.stage) + " ml-1"}>
            {getStageDisplay(startup.stage)}
          </Badge>
        </div>
        
        <p class="text-sm text-muted-foreground truncate md:max-w-[450px]">
          {startup.description}
        </p>
        
        <!-- Metrics for medium+ screens -->
        <div class="hidden md:flex items-center gap-4 mt-2">
          <div class="flex items-center gap-1.5 text-sm">
            <DollarSign class="h-3.5 w-3.5 text-primary" />
            <span>{formatCurrency(startup.fundingRaised)}</span>
          </div>
          
          <div class="flex items-center gap-1.5 text-sm">
            <Calendar class="h-3.5 w-3.5 text-primary" />
            <span>Founded {new Date(startup.foundedDate).getFullYear()}</span>
          </div>
          
          <div class="flex items-center gap-1.5 text-sm">
            <Users class="h-3.5 w-3.5 text-primary" />
            <span>{startup.team} team members</span>
          </div>
          
          <!-- Funding Progress for larger screens -->
          <div class="hidden lg:flex items-center gap-2 flex-grow max-w-xs">
            <div class="w-full">
              <Progress value={progress} class="h-1.5" />
            </div>
            <span class="text-xs whitespace-nowrap">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right section - Actions -->
    <div class="flex items-center gap-2">
      <a href="/dashboard/founder/startup/{startup.id}" class="hidden md:block">
        <Button variant="outline" size="sm" class="flex items-center gap-1">
          <span>View</span>
          <ArrowUpRight class="h-3.5 w-3.5" />
        </Button>
      </a>
      
      <a href="/dashboard/founder/startup/{startup.id}" class="md:hidden">
        <Button variant="ghost" size="icon" class="h-8 w-8">
          <ChevronRight class="h-4 w-4" />
        </Button>
      </a>
      
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" size="icon" class="h-8 w-8">
            <MoreHorizontal class="h-4 w-4" />
            <span class="sr-only">Open menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-[200px]">
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <div class="flex items-center w-full">
              <ExternalLink class="mr-2 h-4 w-4" />
              <span>View Details</span>
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <div class="flex items-center w-full">
              <FileEdit class="mr-2 h-4 w-4" />
              <span>Edit Startup</span>
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item class="text-destructive focus:text-destructive">
            <Trash2 class="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
  
  <!-- Mobile metrics row -->
  <div class="flex items-center justify-between mt-4 md:hidden">
    <div class="flex items-center gap-1.5 text-sm">
      <DollarSign class="h-3.5 w-3.5 text-primary" />
      <span>{formatCurrency(startup.fundingRaised)}</span>
    </div>
    
    <div class="flex items-center gap-1.5 text-sm">
      <Users class="h-3.5 w-3.5 text-primary" />
      <span>{startup.team}</span>
    </div>
    
    <div class="flex items-center gap-1 flex-grow max-w-[100px]">
      <div class="w-full">
        <Progress value={progress} class="h-1.5" />
      </div>
      <span class="text-xs whitespace-nowrap">{progress}%</span>
    </div>
  </div>
</div>