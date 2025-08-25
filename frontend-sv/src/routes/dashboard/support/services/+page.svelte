<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import {
	Briefcase,
	Plus,
	Edit,
	Trash2,
	Eye,
	DollarSign,
	Clock,
	Star
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  // Mock services data - in real app, this would come from API
  const services = [
    {
      id: 1,
      name: 'Website Design & Development',
      category: 'Web Development',
      description: 'Custom website design and development for startups and small businesses',
      price: 5000,
      duration: '4-6 weeks',
      status: 'active',
      rating: 4.8,
      projects: 12
    },
    {
      id: 2,
      name: 'Brand Identity Design',
      category: 'Branding',
      description: 'Complete brand identity including logo, colors, and brand guidelines',
      price: 3000,
      duration: '2-3 weeks',
      status: 'active',
      rating: 4.9,
      projects: 8
    },
    {
      id: 3,
      name: 'Marketing Strategy',
      category: 'Marketing',
      description: 'Comprehensive marketing strategy and implementation plan',
      price: 4000,
      duration: '3-4 weeks',
      status: 'draft',
      rating: 0,
      projects: 0
    }
  ];

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  }
</script>

<svelte:head>
  <title>Services - StartupConnect</title>
  <meta name="description" content="Manage your service offerings" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">My Services</h1>
        <p class="text-muted-foreground text-lg">
          Manage your service offerings and showcase your expertise
        </p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Add Service
      </Button>
    </div>

    <!-- Services Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Services</CardTitle>
          <Briefcase class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{services.length}</div>
          <p class="text-xs text-muted-foreground">Active services</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Projects</CardTitle>
          <Briefcase class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{services.reduce((sum, service) => sum + service.projects, 0)}</div>
          <p class="text-xs text-muted-foreground">Completed projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Average Rating</CardTitle>
          <Star class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {(services.filter(s => s.rating > 0).reduce((sum, service) => sum + service.rating, 0) / 
              services.filter(s => s.rating > 0).length).toFixed(1)}
          </div>
          <p class="text-xs text-muted-foreground">Out of 5.0</p>
        </CardContent>
      </Card>
    </div>

    <!-- Services List -->
    <div class="space-y-6">
      {#each services as service}
        <Card>
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-xl font-semibold">{service.name}</h3>
                  <Badge variant="outline">{service.category}</Badge>
                  <div class="flex items-center space-x-2">
                    <div class={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                    <Badge variant="secondary" class="text-xs">
                      {getStatusText(service.status)}
                    </Badge>
                  </div>
                </div>
                
                <p class="text-muted-foreground mb-4">{service.description}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div class="flex items-center space-x-2">
                    <DollarSign class="h-4 w-4 text-muted-foreground" />
                    <span class="font-medium">{formatCurrency(service.price)}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Clock class="h-4 w-4 text-muted-foreground" />
                    <span>{service.duration}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Star class="h-4 w-4 text-muted-foreground" />
                    <span>{service.rating > 0 ? service.rating : 'No rating'}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Briefcase class="h-4 w-4 text-muted-foreground" />
                    <span>{service.projects} projects</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-6">
                <Button variant="outline" size="sm">
                  <Eye class="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit class="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" class="text-red-600 hover:text-red-700">
                  <Trash2 class="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Add Service Form Placeholder -->
    <Card class="mt-8">
      <CardHeader>
        <CardTitle>Add New Service</CardTitle>
        <CardDescription>Create a new service offering to showcase your expertise</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="serviceName" class="text-sm font-medium">Service Name</label>
              <input 
                id="serviceName"
                type="text" 
                placeholder="e.g., Website Design & Development"
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label for="category" class="text-sm font-medium">Category</label>
              <select id="category" class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background">
                <option>Web Development</option>
                <option>Branding</option>
                <option>Marketing</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="description" class="text-sm font-medium">Description</label>
            <textarea 
              id="description"
              placeholder="Describe your service in detail..."
              rows={3}
              class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="price" class="text-sm font-medium">Price (USD)</label>
              <input 
                id="price"
                type="number" 
                placeholder="5000"
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label for="duration" class="text-sm font-medium">Duration</label>
              <input 
                id="duration"
                type="text" 
                placeholder="e.g., 4-6 weeks"
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label for="status" class="text-sm font-medium">Status</label>
              <select id="status" class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background">
                <option>Active</option>
                <option>Draft</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Create Service</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Coming Soon Notice -->
    <Card class="mt-8 text-center">
      <CardHeader>
        <CardTitle>More Service Management Features Coming Soon</CardTitle>
        <CardDescription>
          We're working on additional service management features including automated pricing, 
          client management, and project tracking integration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" disabled>
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  </div>
</div>
