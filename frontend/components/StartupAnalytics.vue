<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Eye, Heart, LineChart, PieChart, Users } from 'lucide-vue-next'

interface AnalyticsData {
  views: {
    total: number
    change: number
    daily: { date: string; count: number }[]
  }
  investors: {
    total: number
    change: number
    interested: number
    contacted: number
  }
  engagement: {
    likes: number
    shares: number
    comments: number
    change: number
  }
  demographics: {
    investors: { type: string; count: number }[]
    locations: { location: string; count: number }[]
  }
}

const props = defineProps<{
  startupId: number
}>()

// Dummy data for analytics
const analytics = ref<AnalyticsData>({
  views: {
    total: 1245,
    change: 12.5,
    daily: [
      { date: 'Mon', count: 120 },
      { date: 'Tue', count: 150 },
      { date: 'Wed', count: 180 },
      { date: 'Thu', count: 210 },
      { date: 'Fri', count: 240 },
      { date: 'Sat', count: 180 },
      { date: 'Sun', count: 165 }
    ]
  },
  investors: {
    total: 45,
    change: 8.2,
    interested: 28,
    contacted: 12
  },
  engagement: {
    likes: 320,
    shares: 45,
    comments: 89,
    change: 15.3
  },
  demographics: {
    investors: [
      { type: 'Angel Investors', count: 15 },
      { type: 'VC Firms', count: 20 },
      { type: 'Corporate', count: 10 }
    ],
    locations: [
      { location: 'San Francisco', count: 25 },
      { location: 'New York', count: 15 },
      { location: 'London', count: 10 },
      { location: 'Singapore', count: 8 },
      { location: 'Berlin', count: 7 }
    ]
  }
})

// Helper function to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Helper function to format percentage
const formatPercentage = (num: number) => {
  return `${num > 0 ? '+' : ''}${num}%`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Views</p>
              <h2 class="text-2xl font-bold mt-1">{{ formatNumber(analytics.views.total) }}</h2>
              <p class="text-sm text-green-500 mt-1">{{ formatPercentage(analytics.views.change) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Investor Interest</p>
              <h2 class="text-2xl font-bold mt-1">{{ formatNumber(analytics.investors.total) }}</h2>
              <p class="text-sm text-green-500 mt-1">{{ formatPercentage(analytics.investors.change) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Engagement</p>
              <h2 class="text-2xl font-bold mt-1">{{ formatNumber(analytics.engagement.likes) }}</h2>
              <p class="text-sm text-green-500 mt-1">{{ formatPercentage(analytics.engagement.change) }}</p>
            </div>
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Detailed Analytics -->
    <Tabs default-value="views" class="space-y-4">
      <TabsList>
        <TabsTrigger value="views">Views</TabsTrigger>
        <TabsTrigger value="investors">Investors</TabsTrigger>
        <TabsTrigger value="demographics">Demographics</TabsTrigger>
      </TabsList>

      <!-- Views Tab -->
      <TabsContent value="views">
        <Card>
          <CardHeader>
            <CardTitle>View Analytics</CardTitle>
            <CardDescription>Daily view counts and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] flex items-center justify-center">
              <LineChart class="h-8 w-8 text-muted-foreground" />
              <p class="text-muted-foreground ml-2">View trend chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Investors Tab -->
      <TabsContent value="investors">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Interest</CardTitle>
              <CardDescription>Breakdown of investor engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Interested Investors</span>
                  <Badge variant="secondary">{{ analytics.investors.interested }}</Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Contacted Investors</span>
                  <Badge variant="secondary">{{ analytics.investors.contacted }}</Badge>
                </div>
                <div class="h-[200px] flex items-center justify-center">
                  <PieChart class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground ml-2">Investor distribution chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Platform engagement statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Likes</span>
                  <Badge variant="secondary">{{ analytics.engagement.likes }}</Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Shares</span>
                  <Badge variant="secondary">{{ analytics.engagement.shares }}</Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Comments</span>
                  <Badge variant="secondary">{{ analytics.engagement.comments }}</Badge>
                </div>
                <div class="h-[200px] flex items-center justify-center">
                  <BarChart class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground ml-2">Engagement trend chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Demographics Tab -->
      <TabsContent value="demographics">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Types</CardTitle>
              <CardDescription>Distribution of investor categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="investor in analytics.demographics.investors" :key="investor.type" class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">{{ investor.type }}</span>
                  <Badge variant="secondary">{{ investor.count }}</Badge>
                </div>
                <div class="h-[200px] flex items-center justify-center">
                  <PieChart class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground ml-2">Investor type distribution chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Investor locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="location in analytics.demographics.locations" :key="location.location" class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">{{ location.location }}</span>
                  <Badge variant="secondary">{{ location.count }}</Badge>
                </div>
                <div class="h-[200px] flex items-center justify-center">
                  <BarChart class="h-8 w-8 text-muted-foreground" />
                  <p class="text-muted-foreground ml-2">Location distribution chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template> 