<script lang="ts">
  import { onMount } from "svelte";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { TICKET_STATUS, TICKET_PRIORITY } from "$lib/db/schema";

  let analytics = $state(null);
  let recentTickets = $state([]);
  let isLoading = $state(true);

  // Mock data - replace with real API calls
  onMount(async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      analytics = {
        overview: {
          totalTickets: 247,
          periodTotalTickets: 47,
          activeTickets: 23,
          averageResponseTime: 15, // minutes
          averageResolutionTime: 4.2, // hours
          customerSatisfaction: 4.6,
          activeAgents: 8,
          onlineAgents: 6,
        },
        statusBreakdown: {
          open: 12,
          inProgress: 8,
          pending: 3,
          resolved: 156,
          closed: 68,
        },
        priorityBreakdown: {
          critical: 2,
          high: 8,
          medium: 15,
          low: 27,
        },
        trends: {
          ticketsThisWeek: 47,
          ticketsLastWeek: 38,
          responseTimeChange: -2, // -2 minutes improvement
          resolutionTimeChange: 0.5, // +30 minutes (worse)
          satisfactionChange: 0.2, // +0.2 improvement
        },
      };

      recentTickets = [
        {
          id: "ticket-1",
          ticketNumber: "SUP-001",
          title: "Login issue with email verification",
          customerName: "John Doe",
          customerEmail: "john.doe@example.com",
          status: TICKET_STATUS.OPEN,
          priority: TICKET_PRIORITY.HIGH,
          assignedTo: "Sarah Johnson",
          createdAt: new Date("2024-12-15T09:00:00Z"),
          updatedAt: new Date("2024-12-15T10:00:00Z"),
          category: "Authentication",
        },
        {
          id: "ticket-2",
          ticketNumber: "SUP-002",
          title: "Feature request: Dark mode toggle",
          customerName: "Sarah Smith",
          customerEmail: "sarah.smith@company.com",
          status: TICKET_STATUS.IN_PROGRESS,
          priority: TICKET_PRIORITY.MEDIUM,
          assignedTo: "Mike Chen",
          createdAt: new Date("2024-12-14T13:00:00Z"),
          updatedAt: new Date("2024-12-15T11:00:00Z"),
          category: "Feature Request",
        },
        {
          id: "ticket-3",
          ticketNumber: "SUP-003",
          title: "Billing discrepancy - charged twice",
          customerName: "Mike Johnson",
          customerEmail: "mike.johnson@enterprise.com",
          status: TICKET_STATUS.RESOLVED,
          priority: TICKET_PRIORITY.CRITICAL,
          assignedTo: "Sarah Johnson",
          createdAt: new Date("2024-12-13T07:30:00Z"),
          updatedAt: new Date("2024-12-14T16:00:00Z"),
          category: "Billing",
        },
        {
          id: "ticket-4",
          ticketNumber: "SUP-004",
          title: "API documentation unclear",
          customerName: "Emily Rodriguez",
          customerEmail: "emily@startup.io",
          status: TICKET_STATUS.PENDING,
          priority: TICKET_PRIORITY.LOW,
          assignedTo: null,
          createdAt: new Date("2024-12-15T08:15:00Z"),
          updatedAt: new Date("2024-12-15T08:15:00Z"),
          category: "Documentation",
        },
      ];
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      isLoading = false;
    }
  });

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      [TICKET_STATUS.OPEN]: "bg-blue-100 text-blue-800",
      [TICKET_STATUS.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
      [TICKET_STATUS.PENDING]: "bg-orange-100 text-orange-800",
      [TICKET_STATUS.RESOLVED]: "bg-green-100 text-green-800",
      [TICKET_STATUS.CLOSED]: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      [TICKET_PRIORITY.CRITICAL]: "bg-red-100 text-red-800",
      [TICKET_PRIORITY.HIGH]: "bg-orange-100 text-orange-800",
      [TICKET_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [TICKET_PRIORITY.LOW]: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  }

  function formatTimeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60),
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

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Support Overview</h1>
      <p class="text-muted-foreground">
        Welcome back! Here's what's happening with customer support.
      </p>
    </div>
    <div class="flex space-x-3">
      <Button variant="outline">
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export Report
      </Button>
      <Button>
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Ticket
      </Button>
    </div>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each Array(4) as _}
        <Card>
          <CardHeader class="pb-2">
            <div class="h-4 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div class="h-8 bg-muted rounded animate-pulse mb-2"></div>
            <div class="h-3 bg-muted rounded animate-pulse w-3/4"></div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if analytics}
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Tickets Today -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Tickets Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {analytics.overview.periodTotalTickets}
          </div>
          <p class="text-xs text-muted-foreground">
            {analytics.trends.ticketsThisWeek > analytics.trends.ticketsLastWeek
              ? "+"
              : ""}
            {Math.round(
              ((analytics.trends.ticketsThisWeek -
                analytics.trends.ticketsLastWeek) /
                analytics.trends.ticketsLastWeek) *
                100,
            )}% from last week
          </p>
        </CardContent>
      </Card>

      <!-- Active Tickets -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Active Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {analytics.overview.activeTickets}
          </div>
          <p class="text-xs text-muted-foreground">
            {analytics.statusBreakdown.open} open, {analytics.statusBreakdown
              .inProgress} in progress
          </p>
        </CardContent>
      </Card>

      <!-- Average Response Time -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Avg Response Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {analytics.overview.averageResponseTime}m
          </div>
          <p
            class={`text-xs ${analytics.trends.responseTimeChange < 0 ? "text-green-600" : "text-red-600"}`}
          >
            {analytics.trends.responseTimeChange > 0 ? "+" : ""}{analytics
              .trends.responseTimeChange}m from last week
          </p>
        </CardContent>
      </Card>

      <!-- Customer Satisfaction -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Customer Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {analytics.overview.customerSatisfaction}/5
          </div>
          <p class="text-xs text-green-600">
            +{analytics.trends.satisfactionChange} from last week
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Status Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Ticket Status Breakdown -->
      <Card>
        <CardHeader>
          <CardTitle>Ticket Status</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm">Open</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  style="width: {(analytics.statusBreakdown.open /
                    analytics.overview.totalTickets) *
                    100}%"
                ></div>
              </div>
              <span class="text-sm font-medium w-8 text-right"
                >{analytics.statusBreakdown.open}</span
              >
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">In Progress</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-yellow-600 h-2 rounded-full"
                  style="width: {(analytics.statusBreakdown.inProgress /
                    analytics.overview.totalTickets) *
                    100}%"
                ></div>
              </div>
              <span class="text-sm font-medium w-8 text-right"
                >{analytics.statusBreakdown.inProgress}</span
              >
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">Resolved</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  style="width: {(analytics.statusBreakdown.resolved /
                    analytics.overview.totalTickets) *
                    100}%"
                ></div>
              </div>
              <span class="text-sm font-medium w-8 text-right"
                >{analytics.statusBreakdown.resolved}</span
              >
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">Closed</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gray-600 h-2 rounded-full"
                  style="width: {(analytics.statusBreakdown.closed /
                    analytics.overview.totalTickets) *
                    100}%"
                ></div>
              </div>
              <span class="text-sm font-medium w-8 text-right"
                >{analytics.statusBreakdown.closed}</span
              >
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Priority Breakdown -->
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm">Critical</span>
            </div>
            <span class="text-sm font-medium"
              >{analytics.priorityBreakdown.critical}</span
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span class="text-sm">High</span>
            </div>
            <span class="text-sm font-medium"
              >{analytics.priorityBreakdown.high}</span
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm">Medium</span>
            </div>
            <span class="text-sm font-medium"
              >{analytics.priorityBreakdown.medium}</span
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm">Low</span>
            </div>
            <span class="text-sm font-medium"
              >{analytics.priorityBreakdown.low}</span
            >
          </div>
        </CardContent>
      </Card>

      <!-- Team Performance -->
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm">Active Agents</span>
            <span class="text-sm font-medium"
              >{analytics.overview.onlineAgents}/{analytics.overview
                .activeAgents}</span
            >
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">Avg Resolution Time</span>
            <span class="text-sm font-medium"
              >{analytics.overview.averageResolutionTime}h</span
            >
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">Unassigned Tickets</span>
            <span class="text-sm font-medium"
              >{analytics.statusBreakdown.open +
                analytics.statusBreakdown.pending}</span
            >
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm">SLA Compliance</span>
            <span class="text-sm font-medium text-green-600">98.5%</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Tickets -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each recentTickets.slice(0, 5) as ticket}
            <div
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center space-x-4 flex-1">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span class="text-xs font-medium text-primary">
                      {ticket.customerName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-sm font-medium truncate"
                      >{ticket.ticketNumber}</span
                    >
                    <Badge
                      class={getPriorityColor(ticket.priority)}
                      variant="secondary"
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      class={getStatusColor(ticket.status)}
                      variant="outline"
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p class="text-sm text-muted-foreground truncate">
                    {ticket.title}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-xs text-muted-foreground"
                      >{ticket.customerName}</span
                    >
                    <span class="text-xs text-muted-foreground">•</span>
                    <span class="text-xs text-muted-foreground"
                      >{ticket.category}</span
                    >
                    <span class="text-xs text-muted-foreground">•</span>
                    <span class="text-xs text-muted-foreground"
                      >{formatTimeAgo(ticket.createdAt)}</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                {#if ticket.assignedTo}
                  <span class="text-xs text-muted-foreground"
                    >{ticket.assignedTo}</span
                  >
                {:else}
                  <Badge variant="outline" class="text-xs">Unassigned</Badge>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <div class="pt-4">
          <Button
            variant="ghost"
            class="w-full"
            onclick={() =>
              (window.location.href = "/dashboard/support/tickets")}
          >
            View All Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  {/if}
</div>
