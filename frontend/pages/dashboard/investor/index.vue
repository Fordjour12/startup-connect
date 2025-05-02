<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useInvestor } from '@/composables/useInvestor'

const { investor, isLoading, error } = useInvestor()

// State for startups
const startups = ref([])
const savedStartups = ref([])
const newOpportunities = ref([])
const messages = ref([])

// Filter states
const searchQuery = ref('')
const selectedIndustry = ref('')
const selectedStage = ref('')
const selectedRegion = ref('')
const sortBy = ref('newest')

// Stats
const stats = ref({
  totalOpportunities: 0,
  savedStartups: 0,
  unreadMessages: 0,
  matches: 0
})

onMounted(async () => {
  // TODO: Implement data fetching
  // This would typically fetch from your API
  startups.value = []
  savedStartups.value = []
  newOpportunities.value = []
  messages.value = []
})

const applyFilters = () => {
  // TODO: Implement filtering logic
}

const sortStartups = () => {
  // TODO: Implement sorting logic
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
          <p class="text-muted-foreground">Discover and manage your startup opportunities</p>
        </div>
        <Button>New Search</Button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold">{{ stats.totalOpportunities }}</div>
            <p class="text-sm text-gray-500">New Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold">{{ stats.savedStartups }}</div>
            <p class="text-sm text-gray-500">Saved Startups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold">{{ stats.unreadMessages }}</div>
            <p class="text-sm text-gray-500">Unread Messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold">{{ stats.matches }}</div>
            <p class="text-sm text-gray-500">Matches</p>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content -->
      <Tabs default-value="opportunities" class="w-full">
        <TabsList>
          <TabsTrigger value="opportunities">New Opportunities</TabsTrigger>
          <TabsTrigger value="saved">Saved Startups</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <!-- Filter Bar -->
        <div class="flex gap-4 my-4 w-full">
          <Input
            v-model="searchQuery"
            placeholder="Search startups..."
            class="max-w-3xl"
          />
          <Select v-model="selectedIndustry">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <!-- Add more industries -->
            </SelectContent>
          </Select>
          <Select v-model="selectedStage">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              <SelectItem value="series-b">Series B</SelectItem>
              <!-- Add more stages -->
            </SelectContent>
          </Select>
          <Select v-model="selectedRegion">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <!-- Add more regions -->
            </SelectContent>
          </Select>
          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="funding">Funding Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Opportunities Tab -->
        <TabsContent value="opportunities">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="startup in newOpportunities" :key="startup.id" class="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div class="flex justify-between items-start">
                  <div>
                    <CardTitle>{{ startup.name }}</CardTitle>
                    <CardDescription>{{ startup.shortDescription }}</CardDescription>
                  </div>
                  <Badge>{{ startup.stage }}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <Badge variant="secondary">{{ startup.industry }}</Badge>
                    <Badge variant="secondary">{{ startup.region }}</Badge>
                  </div>
                  <p class="text-sm text-gray-500">{{ startup.fundingNeeded }}</p>
                  <div class="flex justify-between items-center mt-4">
                    <Button variant="outline">View Details</Button>
                    <Button>Save</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Saved Startups Tab -->
        <TabsContent value="saved">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Similar card structure as opportunities -->
          </div>
        </TabsContent>

        <!-- Messages Tab -->
        <TabsContent value="messages">
          <div class="space-y-4">
            <!-- Message list structure -->
          </div>
        </TabsContent>

        <!-- Matches Tab -->
        <TabsContent value="matches">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Similar card structure as opportunities -->
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template> 