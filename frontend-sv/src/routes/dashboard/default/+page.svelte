<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Progress } from '$lib/components/ui/progress';
  import {
	Target,
	User,
	Building2,
	TrendingUp,
	Users,
	ArrowRight,
	CheckCircle,
	Circle
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  // Mock onboarding progress - in real app, this would come from API
  const onboardingSteps = [
    { id: 'basic-info', title: 'Basic Information', completed: true, description: 'Personal details and contact information' },
    { id: 'role-selection', title: 'Role Selection', completed: true, description: 'Choose your primary role on the platform' },
    { id: 'goals', title: 'Goals & Objectives', completed: false, description: 'Define what you want to achieve' },
    { id: 'skills', title: 'Skills & Expertise', completed: false, description: 'Showcase your professional skills' },
    { id: 'preferences', title: 'Preferences', completed: false, description: 'Set your communication preferences' },
    { id: 'review', title: 'Review & Complete', completed: false, description: 'Finalize your profile setup' }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  function getStepIcon(completed: boolean) {
    return completed ? CheckCircle : Circle;
  }

  function getStepColor(completed: boolean) {
    return completed ? 'text-green-600' : 'text-muted-foreground';
  }
</script>

<svelte:head>
  <title>Complete Your Profile - StartupConnect</title>
  <meta name="description" content="Complete your profile to unlock all features" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Welcome to StartupConnect!</h1>
      <p class="text-muted-foreground text-lg">
        Complete your profile to unlock all the features and start connecting with the startup ecosystem
      </p>
    </div>

    <!-- Progress Overview -->
    <Card class="mb-8">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Profile Completion</CardTitle>
        <CardDescription>
          You're {progressPercentage}% of the way to unlocking your full dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Overall Progress</span>
            <span class="text-sm text-muted-foreground">{completedSteps} of {totalSteps} steps</span>
          </div>
          <Progress value={progressPercentage} class="h-3" />
          <div class="text-center">
            <span class="text-2xl font-bold text-primary">{progressPercentage}%</span>
            <p class="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Onboarding Steps -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {#each onboardingSteps as step}
        <Card class={`${step.completed ? 'border-green-200 bg-green-50/50' : 'border-muted'}`}>
          <CardHeader class="pb-3">
            <div class="flex items-center space-x-3">
              <svelte:component 
                this={getStepIcon(step.completed)} 
                class={`h-5 w-5 ${getStepColor(step.completed)}`} 
              />
              <div>
                <CardTitle class="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {#if step.completed}
              <div class="flex items-center space-x-2 text-green-600">
                <CheckCircle class="h-4 w-4" />
                <span class="text-sm font-medium">Completed</span>
              </div>
            {:else}
              <a href="/onboarding" class="flex items-center justify-center">
                <Button variant="outline" class="w-full">
                  Complete Step
                  <ArrowRight class="ml-2 h-4 w-4" />
                </Button>
              </a>
            {/if}
          </CardContent>
        </Card>
      {/each}
    </div>

    <!-- Call to Action -->
    <Card class="text-center">
      <CardHeader>
        <CardTitle class="text-xl">Ready to Get Started?</CardTitle>
        <CardDescription>
          Complete your profile setup to access your personalized dashboard and start connecting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <a href="/onboarding" class="flex items-center justify-center">
            <Button size="lg" class="w-full md:w-auto">
              Continue Profile Setup
              <ArrowRight class="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p class="text-sm text-muted-foreground">
            This will only take a few minutes and will unlock all dashboard features
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Benefits Preview -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-center mb-8">What You'll Unlock</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="text-center">
          <CardHeader>
            <div class="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 class="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Startup Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Manage your startup profile, track fundraising progress, and showcase your business
            </p>
          </CardContent>
        </Card>

        <Card class="text-center">
          <CardHeader>
            <div class="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users class="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Network Building</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Connect with investors, mentors, and other founders in the startup ecosystem
            </p>
          </CardContent>
        </Card>

        <Card class="text-center">
          <CardHeader>
            <div class="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Access funding opportunities, mentorship programs, and business development resources
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
