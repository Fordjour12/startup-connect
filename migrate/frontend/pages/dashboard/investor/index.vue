<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useInvestor } from '@/composables/useInvestor'

interface Startup {
  id: string
  name: string
  shortDescription: string
  stage: string
  industry: string
  region: string
  fundingNeeded: string
  teamSize: number
  foundedYear: number
  metrics: {
    mrr: number
    growth: number
    users: number
  }
  lastActive: string
  matchScore: number
}

interface InvestorStats {
  totalOpportunities: number
  savedStartups: number
  unreadMessages: number
  matches: number
  portfolioValue: number
  activeDeals: number
  totalInvested: number
  averageTicketSize: number
}

const { investor, isLoading, error } = useInvestor()

// State for startups
const startups = ref<Startup[]>([])
const savedStartups = ref<Startup[]>([])
const newOpportunities = ref<Startup[]>([])
const messages = ref<any[]>([])

// Filter states
const searchQuery = ref('')
const selectedIndustry = ref('all')
const selectedStage = ref('all')
const selectedRegion = ref('all')
const sortBy = ref('newest')

// Enhanced Stats
const stats = ref<InvestorStats>({
  totalOpportunities: 156,
  savedStartups: 24,
  unreadMessages: 8,
  matches: 12,
  portfolioValue: 2500000,
  activeDeals: 5,
  totalInvested: 1200000,
  averageTicketSize: 150000
})

// Mock data for demonstration
const mockStartup: Startup = {
  id: '1',
  name: 'TechCorp AI',
  shortDescription: 'AI-powered business intelligence platform',
  stage: 'Series A',
  industry: 'AI/ML',
  region: 'North America',
  fundingNeeded: '$5M',
  teamSize: 15,
  foundedYear: 2022,
  metrics: {
    mrr: 125000,
    growth: 25,
    users: 1500
  },
  lastActive: '2h ago',
  matchScore: 92
}

onMounted(async () => {
  // TODO: Implement data fetching
  // This would typically fetch from your API
  newOpportunities.value = Array(6).fill(mockStartup).map((s, i) => ({
    ...s,
    id: String(i + 1),
    matchScore: Math.floor(85 + Math.random() * 15)
  }))
})

const applyFilters = () => {
  // TODO: Implement filtering logic
}

const sortStartups = () => {
  // TODO: Implement sorting logic
}

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <!-- Main Dashboard -->
    <div v-else>
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Investor Dashboard</h1>
          <p class="text-muted-foreground">Welcome back! Here's your investment overview</p>
        </div>
        <Button size="lg" class="gap-2">
          <i class="i-lucide-plus-circle" />
          New Search
        </Button>
      </div>

      <!-- Enhanced Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Investment Overview Card -->
        <Card class="col-span-2">
          <CardHeader>
            <CardTitle>Investment Overview</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Portfolio Value</p>
              <p class="text-2xl font-bold">{{ formatCurrency(stats.portfolioValue) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Total Invested</p>
              <p class="text-2xl font-bold">{{ formatCurrency(stats.totalInvested) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Active Deals</p>
              <p class="text-2xl font-bold">{{ stats.activeDeals }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Avg. Ticket Size</p>
              <p class="text-2xl font-bold">{{ formatCurrency(stats.averageTicketSize) }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Activity Stats -->
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Activity</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">New Opportunities</span>
                <Badge variant="secondary">{{ stats.totalOpportunities }}</Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Saved Startups</span>
                <Badge variant="secondary">{{ stats.savedStartups }}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Communication Stats -->
        <Card>
          <CardHeader>
            <CardTitle>Communications</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Unread Messages</span>
                <Badge>{{ stats.unreadMessages }}</Badge>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Active Matches</span>
                <Badge variant="secondary">{{ stats.matches }}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content -->
      <Tabs default-value="opportunities" class="w-full">
        <TabsList >
          <TabsTrigger value="opportunities" class="flex gap-2">
            <i class="i-lucide-sparkles" />
            New Opportunities
          </TabsTrigger>
          <TabsTrigger value="saved" class="flex gap-2">
            <i class="i-lucide-bookmark" />
            Saved Startups
          </TabsTrigger>
          <TabsTrigger value="messages" class="flex gap-2">
            <i class="i-lucide-mail" />
            Messages
            <Badge v-if="stats.unreadMessages" variant="secondary" class="ml-1">
              {{ stats.unreadMessages }}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="matches" class="flex gap-2">
            <i class="i-lucide-heart" />
            Matches
          </TabsTrigger>
        </TabsList>

        <!-- Filter Bar -->
        <div class="flex flex-wrap gap-4 my-6">
          <Input
            v-model="searchQuery"
            placeholder="Search startups..."
            class="flex-1 min-w-[200px]"
          >
            <template #prefix>
              <i class="i-lucide-search text-muted-foreground" />
            </template>
          </Input>
          <Select v-model="selectedIndustry">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <SelectItem value="ai">AI/ML</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedStage">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              <SelectItem value="series-b">Series B</SelectItem>
              <SelectItem value="series-c">Series C</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedRegion">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="latam">Latin America</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="funding">Funding Amount</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Opportunities Tab -->
        <TabsContent value="opportunities">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="startup in newOpportunities" :key="startup.id" class="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div class="flex justify-between items-start">
                  <div class="space-y-1.5">
                    <CardTitle class="flex items-center gap-2">
                      {{ startup.name }}
                      <Badge variant="default" class="text-xs">
                        {{ startup.matchScore }}% Match
                      </Badge>
                    </CardTitle>
                    <CardDescription>{{ startup.shortDescription }}</CardDescription>
                  </div>
                  <Badge>{{ startup.stage }}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <Badge variant="secondary">{{ startup.industry }}</Badge>
                    <Badge variant="secondary">{{ startup.region }}</Badge>
                    <Badge variant="outline">{{ startup.teamSize }} team members</Badge>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 py-2">
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">MRR</p>
                      <p class="font-medium">{{ formatCurrency(startup.metrics.mrr) }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Growth</p>
                      <p class="font-medium">+{{ startup.metrics.growth }}%</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-muted-foreground">Users</p>
                      <p class="font-medium">{{ startup.metrics.users }}</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <p class="text-sm text-muted-foreground">Seeking {{ startup.fundingNeeded }}</p>
                    <p class="text-sm text-muted-foreground">Active {{ startup.lastActive }}</p>
                  </div>

                  <div class="flex justify-between items-center gap-2">
                    <Button variant="outline" class="flex-1">View Profile</Button>
                    <Button class="flex-1">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Other tabs remain the same -->
        <TabsContent value="saved">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Similar card structure as opportunities -->
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div class="space-y-4">
            <!-- Message list structure -->
          </div>
        </TabsContent>

        <TabsContent value="matches">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Similar card structure as opportunities -->
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template> 