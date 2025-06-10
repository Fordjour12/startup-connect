<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Progress } from "$lib/components/ui/progress";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Avatar } from "$lib/components/ui/avatar";
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
    Rocket,
    Calendar,
    MapPin,
    TrendingUp
  } from "@lucide/svelte/icons";

  // Define startup props with types
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
    color?: string;
    metrics?: {
      revenue?: number;
      users?: number;
      growth?: number;
    }
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

  // Calculate funding progress percentage
  let progress = startup.fundingProgress || 
    (startup.fundingGoal ? Math.round((startup.fundingRaised / startup.fundingGoal) * 100) : 70);

  // Format founding date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  }

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

<Card.Root class="overflow-hidden h-full transition duration-200 hover:shadow-md flex flex-col">
  <Card.Header class="pb-3">
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-3">
        <div class="relative h-14 w-14 flex-shrink-0 rounded-md bg-muted overflow-hidden">
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
        <div>
          <div class="flex items-center gap-2">
            <Card.Title>
              {startup.name}
            </Card.Title>
            {#if startup.featured}
              <Tooltip.Root>
                <div>
                  <span>
                    <Star class="h-4 w-4 fill-amber-400 text-amber-400" />
                  </span>
                </div>
                <Tooltip.Content>
                  <p class="text-xs">Featured startup</p>
                </Tooltip.Content>
              </Tooltip.Root>
            {/if}
          </div>
          <div class="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" class={getStageColor(startup.stage)}>
              {getStageDisplay(startup.stage)}
            </Badge>
            <span class="flex items-center gap-1">
              <MapPin class="h-3 w-3" />
              {startup.location}
            </span>
          </div>
        </div>
      </div>
      
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
  </Card.Header>
  
  <Card.Content class="flex-grow">
    <p class="text-sm text-muted-foreground line-clamp-3">
      {startup.description}
    </p>
    
    <div class="mt-4 space-y-4">
      <!-- Funding Progress -->
      <div class="space-y-1">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground flex items-center gap-1">
            <DollarSign class="h-3.5 w-3.5" />
            Funding Progress
          </span>
          <span class="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} class="h-1.5" />
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>Raised: {formatCurrency(startup.fundingRaised)}</span>
          {#if startup.fundingGoal}
            <span>Goal: {formatCurrency(startup.fundingGoal)}</span>
          {/if}
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="grid grid-cols-3 gap-2 pt-2">
        <div class="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
          <span class="text-xs text-muted-foreground">Founded</span>
          <div class="flex items-center gap-1 mt-1">
            <Calendar class="h-3 w-3 text-primary" />
            <!-- <span class="font-semibold">{formatDate(startup.foundedDate)}</span> -->
          </div>
        </div>
        
        <div class="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
          <span class="text-xs text-muted-foreground">Team</span>
          <div class="flex items-center gap-1 mt-1">
            <Users class="h-3 w-3 text-primary" />
            <span class="font-semibold">{startup.team}</span>
          </div>
        </div>
        
        {#if startup.metrics?.growth !== undefined}
          <div class="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
            <span class="text-xs text-muted-foreground">Growth</span>
            <div class="flex items-center gap-1 mt-1">
              <TrendingUp class="h-3 w-3 text-primary" />
              <span class="font-semibold">{startup.metrics.growth}%</span>
            </div>
          </div>
        {:else}
          <div class="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
            <span class="text-xs text-muted-foreground">Industry</span>
            <div class="flex items-center gap-1 mt-1">
              <Rocket class="h-3 w-3 text-primary" />
              <span class="font-semibold text-xs capitalize">{startup.industry}</span>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </Card.Content>
  
  <Card.Footer class="pt-0 mt-auto">
      <Button variant="outline" class="w-full" onclick={() => window.location.href = '/dashboard/founder/startup/' + startup.id}>
        View Details
      </Button>
  </Card.Footer>
</Card.Root>