<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import {
    TICKET_STATUS,
    TICKET_PRIORITY,
    SUPPORT_ROLES,
    type SupportCustomer,
    type SupportTicket
  } from "$lib/db/schema";
  import { createSupportPermissionManager } from "$lib/utils/support-permissions";

  let currentUser = $state({
    id: "user-1",
    name: "John Smith",
    email: "john@support.com",
    role: SUPPORT_ROLES.MANAGER
  });

  let permissionManager = $state(null);
  let customer = $state<SupportCustomer | null>(null);
  let customerTickets = $state<SupportTicket[]>([]);
  let isLoading = $state(true);
  let activeTab = $state("overview");

  // Mock data - replace with real API calls
  onMount(async () => {
    try {
      permissionManager = createSupportPermissionManager(currentUser.role, currentUser.id);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get customer ID from URL
      const customerId = $page.params.customerId;

      // Mock customer data
      customer = {
        id: customerId,
        email: "john.doe@example.com",
        name: "John Doe",
        company: "Acme Corp",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        timezone: "America/New_York",
        language: "en",
        createdAt: new Date("2023-01-15T10:00:00Z"),
        updatedAt: new Date("2024-12-15T10:00:00Z"),
        lastLoginAt: new Date("2024-12-14T15:30:00Z"),
        isActive: true,
        totalTickets: 8,
        openTickets: 2,
        resolvedTickets: 6,
        averageResponseTime: 2.5,
        satisfactionRating: 4.2,
        tags: ["enterprise", "high-value"],
        customFields: {
          industry: "Technology",
          employeeCount: "500-1000",
          supportPlan: "Premium"
        }
      };

      // Mock customer tickets
      customerTickets = [
        {
          id: "ticket-1",
          ticketNumber: "SUP-001",
          title: "Login issue with email verification",
          description: "Customer cannot login despite entering correct credentials. Error shows email verification failed.",
          status: TICKET_STATUS.OPEN,
          priority: TICKET_PRIORITY.HIGH,
          category: "Authentication",
          tags: ["login", "email", "verification"],
          customerId: customerId,
          customerEmail: customer.email,
          customerName: customer.name,
          assignedTo: "agent-1",
          assignedBy: "manager-1",
          assignedAt: new Date("2024-12-15T10:00:00Z"),
          createdAt: new Date("2024-12-15T09:00:00Z"),
          updatedAt: new Date("2024-12-15T10:00:00Z"),
          resolvedAt: null,
          closedAt: null,
          slaBreachTime: null,
          firstResponseTime: new Date("2024-12-15T09:30:00Z"),
          resolutionTime: null,
          source: "email",
          satisfactionRating: null,
          feedback: null
        },
        {
          id: "ticket-2",
          ticketNumber: "SUP-008",
          title: "API rate limiting questions",
          description: "Customer is asking about API rate limits and how to optimize their integration.",
          status: TICKET_STATUS.RESOLVED,
          priority: TICKET_PRIORITY.MEDIUM,
          category: "API Support",
          tags: ["api", "rate-limits", "integration"],
          customerId: customerId,
          customerEmail: customer.email,
          customerName: customer.name,
          assignedTo: "agent-2",
          assignedBy: "manager-1",
          assignedAt: new Date("2024-12-10T14:00:00Z"),
          createdAt: new Date("2024-12-10T11:30:00Z"),
          updatedAt: new Date("2024-12-12T16:00:00Z"),
          resolvedAt: new Date("2024-12-12T15:30:00Z"),
          closedAt: new Date("2024-12-12T16:00:00Z"),
          slaBreachTime: null,
          firstResponseTime: new Date("2024-12-10T12:15:00Z"),
          resolutionTime: new Date("2024-12-12T15:30:00Z"),
          source: "chat",
          satisfactionRating: 5,
          feedback: "Very helpful and detailed response!"
        },
        {
          id: "ticket-3",
          ticketNumber: "SUP-015",
          title: "Data export functionality",
          description: "Request for information about bulk data export capabilities and format options.",
          status: TICKET_STATUS.CLOSED,
          priority: TICKET_PRIORITY.LOW,
          category: "Feature Request",
          tags: ["data-export", "bulk", "api"],
          customerId: customerId,
          customerEmail: customer.email,
          customerName: customer.name,
          assignedTo: "agent-1",
          assignedBy: "manager-1",
          assignedAt: new Date("2024-11-28T09:00:00Z"),
          createdAt: new Date("2024-11-28T08:45:00Z"),
          updatedAt: new Date("2024-12-01T17:00:00Z"),
          resolvedAt: new Date("2024-12-01T16:30:00Z"),
          closedAt: new Date("2024-12-01T17:00:00Z"),
          slaBreachTime: null,
          firstResponseTime: new Date("2024-11-28T09:30:00Z"),
          resolutionTime: new Date("2024-12-01T16:30:00Z"),
          source: "email",
          satisfactionRating: 4,
          feedback: "Good information, but documentation could be clearer."
        },
        {
          id: "ticket-4",
          ticketNumber: "SUP-022",
          title: "Billing discrepancy - December invoice",
          description: "Customer reports discrepancy in December billing cycle - overcharged by $150.",
          status: TICKET_STATUS.RESOLVED,
          priority: TICKET_PRIORITY.CRITICAL,
          category: "Billing",
          tags: ["billing", "discrepancy", "refund"],
          customerId: customerId,
          customerEmail: customer.email,
          customerName: customer.name,
          assignedTo: "agent-1",
          assignedBy: "manager-1",
          assignedAt: new Date("2024-12-05T10:30:00Z"),
          createdAt: new Date("2024-12-05T10:00:00Z"),
          updatedAt: new Date("2024-12-07T14:30:00Z"),
          resolvedAt: new Date("2024-12-07T14:00:00Z"),
          closedAt: new Date("2024-12-07T14:30:00Z"),
          slaBreachTime: null,
          firstResponseTime: new Date("2024-12-05T10:45:00Z"),
          resolutionTime: new Date("2024-12-07T14:00:00Z"),
          source: "phone",
          satisfactionRating: 5,
          feedback: "Excellent resolution time and customer service!"
        },
        {
          id: "ticket-5",
          ticketNumber: "SUP-028",
          title: "Webhook configuration help",
          description: "Assistance needed with configuring webhooks for real-time notifications.",
          status: TICKET_STATUS.IN_PROGRESS,
          priority: TICKET_PRIORITY.MEDIUM,
          category: "Technical Support",
          tags: ["webhooks", "configuration", "real-time"],
          customerId: customerId,
          customerEmail: customer.email,
          customerName: customer.name,
          assignedTo: "agent-3",
          assignedBy: "manager-1",
          assignedAt: new Date("2024-12-12T13:00:00Z"),
          createdAt: new Date("2024-12-12T11:15:00Z"),
          updatedAt: new Date("2024-12-15T09:00:00Z"),
          resolvedAt: null,
          closedAt: null,
          slaBreachTime: null,
          firstResponseTime: new Date("2024-12-12T13:30:00Z"),
          resolutionTime: null,
          source: "chat",
          satisfactionRating: null,
          feedback: null
        }
      ];
    } catch (error) {
      console.error("Error loading customer:", error);
    } finally {
      isLoading = false;
    }
  });

  function formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  }

  function formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      [TICKET_STATUS.OPEN]: "bg-blue-100 text-blue-800",
      [TICKET_STATUS.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
      [TICKET_STATUS.PENDING]: "bg-orange-100 text-orange-800",
      [TICKET_STATUS.RESOLVED]: "bg-green-100 text-green-800",
      [TICKET_STATUS.CLOSED]: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      [TICKET_PRIORITY.CRITICAL]: "bg-red-100 text-red-800",
      [TICKET_PRIORITY.HIGH]: "bg-orange-100 text-orange-800",
      [TICKET_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [TICKET_PRIORITY.LOW]: "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  }

  function getSatisfactionColor(rating: number): string {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  }

  function getSatisfactionEmoji(rating: number): string {
    if (rating >= 4.5) return "😊";
    if (rating >= 4.0) return "🙂";
    if (rating >= 3.5) return "😐";
    return "😞";
  }

  function calculateResolutionTime(created: Date, resolved: Date): string {
    const diffInHours = Math.floor((resolved.getTime() - created.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      const remainingHours = diffInHours % 24;
      return `${days}d ${remainingHours}h`;
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <Button variant="ghost" onclick={() => goto("/dashboard/support/customers")}>
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Customers
      </Button>
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <h1 class="text-2xl font-bold text-foreground">{customer?.name}</h1>
          {#if customer?.isActive}
            <Badge variant="secondary" class="text-xs">Active</Badge>
          {:else}
            <Badge variant="outline" class="text-xs">Inactive</Badge>
          {/if}
        </div>
        <p class="text-muted-foreground">{customer?.email}</p>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      {#if permissionManager?.hasPermission("customers:update")}
        <Button variant="outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </Button>
      {/if}
      {#if permissionManager?.hasPermission("tickets:create")}
        <Button onclick={() => goto(`/dashboard/support/tickets/new?customer=${customer?.id}`)}>
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </Button>
      {/if}
    </div>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {#each Array(3) as _}
        <Card>
          <CardContent class="p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-muted rounded w-1/2"></div>
              <div class="h-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if customer}
    <!-- Customer Profile -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Tabs -->
        <Tabs bind:value={activeTab} class="w-full">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Tickets ({customerTickets.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <!-- Overview Tab -->
          <TabsContent value="overview" class="space-y-6">
            <!-- Profile Information -->
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-xl font-medium text-primary">
                      {customer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </span>
                  </div>
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <div>
                        <span class="text-sm font-medium text-muted-foreground">Full Name</span>
                        <p class="text-sm">{customer.name}</p>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-muted-foreground">Email</span>
                        <p class="text-sm">{customer.email}</p>
                      </div>
                      {#if customer.company}
                        <div>
                          <span class="text-sm font-medium text-muted-foreground">Company</span>
                          <p class="text-sm">{customer.company}</p>
                        </div>
                      {/if}
                    </div>
                    <div class="space-y-2">
                      {#if customer.phone}
                        <div>
                          <span class="text-sm font-medium text-muted-foreground">Phone</span>
                          <p class="text-sm">{customer.phone}</p>
                        </div>
                      {/if}
                      {#if customer.location}
                        <div>
                          <span class="text-sm font-medium text-muted-foreground">Location</span>
                          <p class="text-sm">{customer.location}</p>
                        </div>
                      {/if}
                      <div>
                        <span class="text-sm font-medium text-muted-foreground">Timezone</span>
                        <p class="text-sm">{customer.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Custom Fields -->
                {#if customer.customFields && Object.keys(customer.customFields).length > 0}
                  <div class="border-t pt-4">
                    <h4 class="text-sm font-medium mb-3">Additional Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {#each Object.entries(customer.customFields) as [key, value]}
                        <div>
                          <span class="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <p class="text-sm">{value}</p>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}

                <!-- Tags -->
                {#if customer.tags && customer.tags.length > 0}
                  <div class="border-t pt-4">
                    <h4 class="text-sm font-medium mb-3">Tags</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each customer.tags as tag}
                        <Badge variant="secondary" class="text-xs">#{tag}</Badge>
                      {/each}
                    </div>
                  </div>
                {/if}
              </CardContent>
            </Card>

            <!-- Account Activity -->
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div class="text-2xl font-bold text-foreground">{customer.totalTickets}</div>
                    <div class="text-sm text-muted-foreground">Total Tickets</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-yellow-600">{customer.openTickets}</div>
                    <div class="text-sm text-muted-foreground">Open Tickets</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-green-600">{customer.resolvedTickets}</div>
                    <div class="text-sm text-muted-foreground">Resolved</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold {getSatisfactionColor(customer.satisfactionRating || 0)}">
                      {customer.satisfactionRating?.toFixed(1) || "N/A"}
                    </div>
                    <div class="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Tickets Tab -->
          <TabsContent value="tickets" class="space-y-4">
            <div class="space-y-4">
              {#each customerTickets as ticket}
                <Card class="hover:shadow-md transition-shadow cursor-pointer" onclick={() => goto(`/dashboard/support/tickets/${ticket.id}`)}>
                  <CardContent class="p-4">
                    <div class="flex items-start justify-between">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 mb-2">
                          <span class="font-medium text-foreground">{ticket.ticketNumber}</span>
                          <Badge class={getPriorityColor(ticket.priority)} variant="secondary" class="text-xs">
                            {ticket.priority}
                          </Badge>
                          <Badge class={getStatusColor(ticket.status)} variant="outline" class="text-xs">
                            {ticket.status.replace("_", " ")}
                          </Badge>
                          {#if ticket.category}
                            <Badge variant="outline" class="text-xs">{ticket.category}</Badge>
                          {/if}
                        </div>

                        <h3 class="font-medium mb-2">{ticket.title}</h3>
                        <p class="text-sm text-muted-foreground mb-3 line-clamp-2">{ticket.description}</p>

                        <div class="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Created: {formatTimeAgo(ticket.createdAt)}</span>
                          {#if ticket.firstResponseTime}
                            <span>•</span>
                            <span>First response: {formatTimeAgo(ticket.firstResponseTime)}</span>
                          {/if}
                          {#if ticket.resolvedAt}
                            <span>•</span>
                            <span>Resolved: {calculateResolutionTime(new Date(ticket.createdAt), new Date(ticket.resolvedAt))}</span>
                          {/if}
                        </div>
                      </div>

                      <div class="flex flex-col items-end space-y-2 ml-4">
                        {#if ticket.assignedTo}
                          <div class="text-xs text-muted-foreground">{ticket.assignedTo}</div>
                        {/if}
                        {#if ticket.satisfactionRating}
                          <div class="flex items-center space-x-1">
                            <span class="text-xs">{ticket.satisfactionRating}/5</span>
                            <span class="text-xs">{getSatisfactionEmoji(ticket.satisfactionRating)}</span>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              {/each}
            </div>
          </TabsContent>

          <!-- Activity Tab -->
          <TabsContent value="activity" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <!-- Mock activity feed -->
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm">New ticket created: SUP-001</p>
                      <p class="text-xs text-muted-foreground">{formatTimeAgo(new Date("2024-12-15T09:00:00Z"))}</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm">Ticket assigned to agent-1</p>
                      <p class="text-xs text-muted-foreground">{formatTimeAgo(new Date("2024-12-15T10:00:00Z"))}</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm">First response sent</p>
                      <p class="text-xs text-muted-foreground">{formatTimeAgo(new Date("2024-12-15T09:30:00Z"))}</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm">Customer profile updated</p>
                      <p class="text-xs text-muted-foreground">{formatTimeAgo(new Date("2024-12-15T10:00:00Z"))}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Analytics Tab -->
          <TabsContent value="analytics" class="space-y-6">
            <!-- Satisfaction Trend -->
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-center py-8">
                  <div class="text-3xl mb-2">{getSatisfactionEmoji(customer.satisfactionRating || 0)}</div>
                  <div class="text-2xl font-bold mb-1">{customer.satisfactionRating?.toFixed(1) || "N/A"}/5</div>
                  <div class="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            <!-- Response Time Analytics -->
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-foreground">{customer.averageResponseTime?.toFixed(1) || "N/A"}</div>
                    <div class="text-sm text-muted-foreground">Avg Response Time (hrs)</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">
                      {customerTickets.filter(t => t.firstResponseTime && new Date(t.firstResponseTime).getTime() - new Date(t.createdAt).getTime() < 2 * 60 * 60 * 1000).length}
                    </div>
                    <div class="text-sm text-muted-foreground">Within 2 Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Ticket Categories -->
            <Card>
              <CardHeader>
                <CardTitle>Support Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  {#each [...new Set(customerTickets.map(t => t.category).filter(Boolean))] as category}
                    <div class="flex items-center justify-between">
                      <span class="text-sm">{category}</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-20 bg-muted rounded-full h-2">
                          <div
                            class="bg-primary h-2 rounded-full"
                            style="width: {(customerTickets.filter(t => t.category === category).length / customerTickets.length) * 100}%"
                          ></div>
                        </div>
                        <span class="text-sm font-medium w-8 text-right">
                          {customerTickets.filter(t => t.category === category).length}
                        </span>
                      </div>
                    </div>
                  {/each}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Account Summary -->
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Status:</span>
                <Badge variant={customer.isActive ? "secondary" : "outline"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Member since:</span>
                <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Last login:</span>
                <span>{customer.lastLoginAt ? formatTimeAgo(customer.lastLoginAt) : "Never"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Language:</span>
                <span>{customer.language?.toUpperCase()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            {#if permissionManager?.hasPermission("customers:contact")}
              <Button variant="outline" class="w-full justify-start">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </Button>
            {/if}

            {#if customer.phone && permissionManager?.hasPermission("customers:contact")}
              <Button variant="outline" class="w-full justify-start">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Customer
              </Button>
            {/if}

            <Button variant="outline" class="w-full justify-start">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
