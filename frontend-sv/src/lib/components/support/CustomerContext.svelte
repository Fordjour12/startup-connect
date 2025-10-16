<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";

  interface Customer {
    id: string;
    name: string;
    email: string;
    type: 'Founder' | 'Investor';
    company?: string;
    avatar?: string;
    profile: {
      // Founder specific fields
      industry?: string;
      fundingStage?: string;
      teamSize?: number;
      location?: string;
      // Investor specific fields
      investmentFocus?: string[];
      investmentRange?: string;
      portfolioSize?: number;
    };
    stats: {
      ticketsCreated: number;
      ticketsResolved: number;
      avgResponseTime: number;
      lastActivity: Date;
      satisfactionScore: number;
    };
    recentTickets: Array<{
      id: string;
      title: string;
      status: string;
      createdAt: Date;
    }>;
  }

  interface Props {
    customer: Customer;
    onViewProfile?: () => void;
    onViewTickets?: () => void;
    onStartChat?: () => void;
  }

  let { customer, onViewProfile, onViewTickets, onStartChat }: Props = $props();

  function getCustomerTypeColor(type: string): string {
    return type === "Founder"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  }
</script>

<div class="space-y-4">
  <!-- Customer Header -->
  <Card>
    <CardContent class="pt-6">
      <div class="flex items-start space-x-4">
        <Avatar class="w-16 h-16">
          <AvatarFallback class="bg-primary/10 text-lg">
            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <h3 class="text-xl font-semibold">{customer.name}</h3>
            <Badge class={getCustomerTypeColor(customer.type)} variant="secondary">
              {customer.type}
            </Badge>
          </div>

          <p class="text-muted-foreground mb-1">{customer.email}</p>
          {#if customer.company}
            <p class="text-sm text-muted-foreground">{customer.company}</p>
          {/if}
        </div>

        <div class="flex space-x-2">
          {#if onViewProfile}
            <Button variant="outline" size="sm" onclick={onViewProfile}>
              View Profile
            </Button>
          {/if}
          {#if onStartChat}
            <Button size="sm" onclick={onStartChat}>
              Start Chat
            </Button>
          {/if}
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Profile Information -->
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Profile Information</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      {#if customer.type === 'Founder'}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#if customer.profile.industry}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Industry</label>
              <p class="text-sm">{customer.profile.industry}</p>
            </div>
          {/if}
          {#if customer.profile.fundingStage}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Funding Stage</label>
              <p class="text-sm">{customer.profile.fundingStage}</p>
            </div>
          {/if}
          {#if customer.profile.teamSize}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Team Size</label>
              <p class="text-sm">{customer.profile.teamSize} members</p>
            </div>
          {/if}
          {#if customer.profile.location}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Location</label>
              <p class="text-sm">{customer.profile.location}</p>
            </div>
          {/if}
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#if customer.profile.investmentFocus && customer.profile.investmentFocus.length > 0}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Investment Focus</label>
              <div class="flex flex-wrap gap-1 mt-1">
                {#each customer.profile.investmentFocus as focus}
                  <Badge variant="outline" class="text-xs">{focus}</Badge>
                {/each}
              </div>
            </div>
          {/if}
          {#if customer.profile.investmentRange}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Investment Range</label>
              <p class="text-sm">{customer.profile.investmentRange}</p>
            </div>
          {/if}
          {#if customer.profile.portfolioSize}
            <div>
              <label class="text-sm font-medium text-muted-foreground">Portfolio Size</label>
              <p class="text-sm">{customer.profile.portfolioSize} companies</p>
            </div>
          {/if}
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Support Statistics -->
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Support History</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{customer.stats.ticketsCreated}</div>
          <p class="text-xs text-muted-foreground">Tickets Created</p>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{customer.stats.ticketsResolved}</div>
          <p class="text-xs text-muted-foreground">Resolved</p>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{customer.stats.avgResponseTime}m</div>
          <p class="text-xs text-muted-foreground">Avg Response</p>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{customer.stats.satisfactionScore}/5</div>
          <p class="text-xs text-muted-foreground">Satisfaction</p>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Last Activity:</span>
          <span>{formatTimeAgo(customer.stats.lastActivity)}</span>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Recent Tickets -->
  {#if customer.recentTickets && customer.recentTickets.length > 0}
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg">Recent Tickets</CardTitle>
          {#if onViewTickets}
            <Button variant="ghost" size="sm" onclick={onViewTickets}>
              View All
            </Button>
          {/if}
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          {#each customer.recentTickets.slice(0, 3) as ticket}
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium mb-1">{ticket.title}</p>
                <p class="text-xs text-muted-foreground">{formatTimeAgo(ticket.createdAt)}</p>
              </div>
              <Badge variant="outline" class="text-xs">
                {ticket.status}
              </Badge>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}
</div>
