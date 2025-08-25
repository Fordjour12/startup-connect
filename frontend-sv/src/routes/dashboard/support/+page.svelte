<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Progress } from '$lib/components/ui/progress';
  import { Badge } from '$lib/components/ui/badge';
  import {
	Briefcase,
	Users,
	Building2,
	DollarSign,
	Target,
	Calendar,
	ArrowRight,
	Plus,
	Star,
	Clock
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  // Mock data - in real app, this would come from API
  const supportStats = {
    activeProjects: 8,
    totalClients: 24,
    monthlyRevenue: 45000,
    clientSatisfaction: 4.8,
    upcomingDeadlines: 3,
    newInquiries: 7
  };

  const recentProjects = [
    {
      client: 'TechFlow Solutions',
      project: 'Website Redesign',
      status: 'in_progress',
      deadline: '2024-02-15',
      value: 15000,
      rating: 4.9
    },
    {
      client: 'GreenEnergy Corp',
      project: 'Brand Identity',
      status: 'review',
      deadline: '2024-02-20',
      value: 8000,
      rating: 4.7
    },
    {
      client: 'HealthTech Innovations',
      project: 'Marketing Strategy',
      status: 'planning',
      deadline: '2024-03-01',
      value: 12000,
      rating: 4.8
    }
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'planning': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'planning': return 'Planning';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Support Dashboard - StartupConnect</title>
  <meta name="description" content="Manage your services, clients, and projects" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Support Dashboard</h1>
      <p class="text-muted-foreground text-lg">
        Manage your services, track projects, and grow your client relationships
      </p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Projects</CardTitle>
          <Building2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{supportStats.activeProjects}</div>
          <p class="text-xs text-muted-foreground">Currently working</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Clients</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{supportStats.totalClients}</div>
          <p class="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{formatCurrency(supportStats.monthlyRevenue)}</div>
          <p class="text-xs text-green-600">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Client Satisfaction</CardTitle>
          <Star class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{supportStats.clientSatisfaction}</div>
          <p class="text-xs text-muted-foreground">Out of 5.0</p>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card class="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-blue-500 text-white">
              <Briefcase class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Services</CardTitle>
              <CardDescription>Manage your service offerings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <a href="/dashboard/support/services" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Manage Services
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-green-500 text-white">
              <Users class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Clients</CardTitle>
              <CardDescription>View and manage client relationships</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <a href="/dashboard/support/clients" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Manage Clients
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-purple-500 text-white">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Projects</CardTitle>
              <CardDescription>Track ongoing and completed projects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <a href="/dashboard/support/projects" class="flex items-center justify-center">
            <Button variant="outline" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Projects
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Projects & Upcoming -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Projects -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Recent Projects</span>
            <Button variant="outline" size="sm">
              <Plus class="h-4 w-4 mr-2" />
              New Project
            </Button>
          </CardTitle>
          <CardDescription>Your latest project activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            {#each recentProjects as project}
              <div class="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div class="w-2 h-2 rounded-full {getStatusColor(project.status)}"></div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium">{project.client}</p>
                    <div class="flex items-center space-x-1">
                      <Star class="h-3 w-3 text-yellow-500 fill-current" />
                      <span class="text-xs text-muted-foreground">{project.rating}</span>
                    </div>
                  </div>
                  <p class="text-xs text-muted-foreground mb-1">{project.project}</p>
                  <div class="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatCurrency(project.value)}</span>
                    <span>•</span>
                    <span>Due: {formatDate(project.deadline)}</span>
                  </div>
                  <div class="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" class="text-xs">
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>

      <!-- Upcoming Deadlines -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Upcoming Deadlines</span>
            <Button variant="outline" size="sm">
              <Plus class="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </CardTitle>
          <CardDescription>Projects with approaching deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <Clock class="h-5 w-5 text-red-600" />
              <div class="flex-1">
                <p class="text-sm font-medium">TechFlow Website Redesign</p>
                <p class="text-xs text-muted-foreground">Due: Feb 15, 2024</p>
              </div>
              <Badge variant="outline" class="text-xs text-red-600">Urgent</Badge>
            </div>
            
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock class="h-5 w-5 text-yellow-600" />
              <div class="flex-1">
                <p class="text-sm font-medium">GreenEnergy Brand Identity</p>
                <p class="text-xs text-muted-foreground">Due: Feb 20, 2024</p>
              </div>
              <Badge variant="outline" class="text-xs text-yellow-600">Due Soon</Badge>
            </div>
            
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Clock class="h-5 w-5 text-blue-600" />
              <div class="flex-1">
                <p class="text-sm font-medium">HealthTech Marketing Strategy</p>
                <p class="text-xs text-muted-foreground">Due: Mar 1, 2024</p>
              </div>
              <Badge variant="outline" class="text-xs">Planning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
