<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  import {
	Briefcase,
	TrendingUp,
	Building2,
	DollarSign,
	Plus,
	Eye,
	BarChart3
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  // Mock portfolio data - in real app, this would come from API
  const portfolioData = {
    totalInvested: 2500000,
    currentValue: 3200000,
    totalReturn: 28,
    activeInvestments: 8,
    exitedInvestments: 3
  };

  const investments = [
    {
      startup: 'TechFlow Solutions',
      industry: 'SaaS',
      stage: 'Series A',
      invested: 500000,
      currentValue: 750000,
      return: 50,
      status: 'active',
      date: '2023-06'
    },
    {
      startup: 'GreenEnergy Corp',
      industry: 'CleanTech',
      stage: 'Series B',
      invested: 750000,
      currentValue: 1200000,
      return: 60,
      status: 'active',
      date: '2023-03'
    },
    {
      startup: 'HealthTech Innovations',
      industry: 'HealthTech',
      stage: 'Seed',
      invested: 300000,
      currentValue: 450000,
      return: 50,
      status: 'active',
      date: '2023-09'
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
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  }

  function getStatusText(status: string) {
    return status === 'active' ? 'Active' : 'Exited';
  }
</script>

<svelte:head>
  <title>Portfolio - StartupConnect</title>
  <meta name="description" content="View and manage your investment portfolio" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Investment Portfolio</h1>
        <p class="text-muted-foreground text-lg">
          Track your investments and monitor performance
        </p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Add Investment
      </Button>
    </div>

    <!-- Portfolio Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Invested</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{formatCurrency(portfolioData.totalInvested)}</div>
          <p class="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Current Value</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{formatCurrency(portfolioData.currentValue)}</div>
          <p class="text-xs text-green-600">+{portfolioData.totalReturn}% return</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Investments</CardTitle>
          <Briefcase class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{portfolioData.activeInvestments}</div>
          <p class="text-xs text-muted-foreground">Companies</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Exited</CardTitle>
          <Building2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{portfolioData.exitedInvestments}</div>
          <p class="text-xs text-muted-foreground">Companies</p>
        </CardContent>
      </Card>
    </div>

    <!-- Portfolio Performance Chart Placeholder -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <BarChart3 class="h-5 w-5" />
          <span>Portfolio Performance</span>
        </CardTitle>
        <CardDescription>Your investment performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
          <div class="text-center text-muted-foreground">
            <BarChart3 class="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Performance chart coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Investment List -->
    <Card>
      <CardHeader>
        <CardTitle>Active Investments</CardTitle>
        <CardDescription>Your current portfolio companies</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each investments as investment}
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-medium">{investment.startup}</h3>
                  <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{investment.industry}</span>
                    <span>•</span>
                    <span>{investment.stage}</span>
                    <span>•</span>
                    <span>{investment.date}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-6">
                <div class="text-right">
                  <div class="text-sm font-medium">{formatCurrency(investment.invested)}</div>
                  <div class="text-xs text-muted-foreground">Invested</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium">{formatCurrency(investment.currentValue)}</div>
                  <div class="text-xs text-muted-foreground">Current Value</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-green-600">+{investment.return}%</div>
                  <div class="text-xs text-muted-foreground">Return</div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class={`w-2 h-2 rounded-full ${getStatusColor(investment.status)}`}></div>
                  <Badge variant="secondary" class="text-xs">
                    {getStatusText(investment.status)}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye class="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- Coming Soon Notice -->
    <Card class="mt-8 text-center">
      <CardHeader>
        <CardTitle>More Portfolio Features Coming Soon</CardTitle>
        <CardDescription>
          We're working on additional portfolio management features including detailed analytics, 
          performance tracking, and automated reporting.
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
