<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import {
	Building2,
	Edit,
	Plus,
	Users,
	DollarSign,
	Calendar,
	MapPin
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  // Mock startup data - in real app, this would come from API
  const startupData = {
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    stage: 'Seed',
    founded: '2023',
    location: 'San Francisco, CA',
    teamSize: 8,
    fundingRaised: 250000,
    fundingGoal: 500000,
    description: 'TechFlow Solutions is a cutting-edge SaaS platform that streamlines workflow management for growing businesses.',
    website: 'https://techflow.com',
    linkedin: 'https://linkedin.com/company/techflow'
  };
</script>

<svelte:head>
  <title>My Startup - StartupConnect</title>
  <meta name="description" content="Manage your startup profile and details" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">My Startup</h1>
        <p class="text-muted-foreground text-lg">
          Manage your startup profile and showcase your business
        </p>
      </div>
      <Button>
        <Edit class="h-4 w-4 mr-2" />
        Edit Profile
      </Button>
    </div>

    <!-- Startup Overview -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 class="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle class="text-2xl">{startupData.name}</CardTitle>
            <div class="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{startupData.industry}</Badge>
              <Badge variant="outline">{startupData.stage}</Badge>
              <Badge variant="outline">{startupData.founded}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground mb-6">{startupData.description}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <MapPin class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">{startupData.location}</span>
            </div>
            <div class="flex items-center space-x-3">
              <Users class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">{startupData.teamSize} team members</span>
            </div>
            <div class="flex items-center space-x-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">Founded {startupData.founded}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <DollarSign class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">${(startupData.fundingRaised / 1000).toFixed(0)}K raised</span>
            </div>
            <div class="flex items-center space-x-3">
              <DollarSign class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">${(startupData.fundingGoal / 1000).toFixed(0)}K goal</span>
            </div>
            <div class="flex items-center space-x-3">
              <Building2 class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm">{startupData.website}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card class="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-blue-500 text-white">
              <Edit class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Edit Profile</CardTitle>
              <CardDescription>Update startup information</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card class="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-green-500 text-white">
              <Plus class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Add Team</CardTitle>
              <CardDescription>Invite team members</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card class="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-purple-500 text-white">
              <DollarSign class="h-5 w-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Funding</CardTitle>
              <CardDescription>Update funding status</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>

    <!-- Coming Soon Notice -->
    <Card class="text-center">
      <CardHeader>
        <CardTitle>More Features Coming Soon</CardTitle>
        <CardDescription>
          We're working on additional startup management features including team collaboration, 
          milestone tracking, and investor relations management.
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
