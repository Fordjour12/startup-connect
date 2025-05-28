<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useInvestor } from '@/composables/useInvestor'
import { toast } from 'vue-sonner'

interface SavedStartup {
  id: string
  name: string
  shortDescription: string
  stage: string
  industry: string
  region: string
  fundingNeeded: string
  savedAt: string
  lastViewed: string
  status: 'saved' | 'contacted' | 'interested' | 'not_interested'
  notes?: string
}

const { investor, isLoading, error } = useInvestor()

// State for saved startups
const savedStartups = ref<SavedStartup[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const sortBy = ref('recently_saved')
const statusFilter = ref('')

// Available statuses
const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'saved', label: 'Saved' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' }
]

// Computed properties for filtering and sorting
const filteredStartups = computed(() => {
  let results = [...savedStartups.value]

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(startup => 
      startup.name.toLowerCase().includes(query) ||
      startup.shortDescription.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    results = results.filter(startup => startup.status === statusFilter.value)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'recently_saved':
      results.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
      break
    case 'recently_viewed':
      results.sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
      break
    case 'name':
      results.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return results
})

onMounted(async () => {
  // TODO: Implement API call to fetch saved startups
  // For now, using mock data
  savedStartups.value = [
    {
      id: '1',
      name: 'TechStart AI',
      shortDescription: 'AI-powered business analytics platform',
      stage: 'Series A',
      industry: 'Technology',
      region: 'North America',
      fundingNeeded: '$5M',
      savedAt: '2024-03-15T10:00:00Z',
      lastViewed: '2024-03-16T15:30:00Z',
      status: 'interested',
      notes: 'Strong team, impressive growth metrics'
    },
    {
      id: '2',
      name: 'HealthTech Solutions',
      shortDescription: 'Digital health platform for remote patient monitoring',
      stage: 'Seed',
      industry: 'Healthcare',
      region: 'Europe',
      fundingNeeded: '$2M',
      savedAt: '2024-03-14T14:20:00Z',
      lastViewed: '2024-03-14T14:20:00Z',
      status: 'saved'
    }
  ]
})

const handleRemove = async (startupId: string) => {
  try {
    // TODO: Implement remove functionality
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulated API call
    savedStartups.value = savedStartups.value.filter(s => s.id !== startupId)
    toast.success('Startup removed from saved list')
  } catch (error) {
    toast.error('Failed to remove startup')
  }
}

const handleStatusChange = async (startupId: string, newStatus: SavedStartup['status']) => {
  try {
    // TODO: Implement status update functionality
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulated API call
    const startup = savedStartups.value.find(s => s.id === startupId)
    if (startup) {
      startup.status = newStatus
    }
    toast.success('Status updated successfully')
  } catch (error) {
    toast.error('Failed to update status')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

    <!-- Main Content -->
    <div v-else>
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Saved Startups</h1>
          <p class="text-muted-foreground">Manage your saved startup opportunities</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="viewMode = 'grid'">
            <i class="fas fa-th-large mr-2"></i>Grid
          </Button>
          <Button variant="outline" @click="viewMode = 'list'">
            <i class="fas fa-list mr-2"></i>List
          </Button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex gap-4 mb-8">
        <Input
          v-model="searchQuery"
          placeholder="Search saved startups..."
          class="max-w-sm"
        />
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="sortBy">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recently_saved">Recently Saved</SelectItem>
            <SelectItem value="recently_viewed">Recently Viewed</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Results Count -->
      <div class="mb-4">
        <p class="text-sm text-muted-foreground">
          Showing {{ filteredStartups.length }} saved startups
        </p>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="startup in filteredStartups" :key="startup.id" class="hover:shadow-lg transition-shadow">
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
            <div class="space-y-4">
              <div class="flex gap-2 flex-wrap">
                <Badge variant="secondary">{{ startup.industry }}</Badge>
                <Badge variant="secondary">{{ startup.region }}</Badge>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-muted-foreground">Funding Needed</p>
                  <p class="font-medium">{{ startup.fundingNeeded }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Saved On</p>
                  <p class="font-medium">{{ formatDate(startup.savedAt) }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Last Viewed</p>
                  <p class="font-medium">{{ formatDate(startup.lastViewed) }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Status</p>
                  <Select
                    :value="startup.status"
                    @update:value="(value) => handleStatusChange(startup.id, value)"
                  >
                    <SelectTrigger class="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="status in statuses.filter(s => s.value)" :key="status.value" :value="status.value">
                        {{ status.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div v-if="startup.notes" class="text-sm">
                <p class="text-muted-foreground">Notes</p>
                <p>{{ startup.notes }}</p>
              </div>

              <div class="flex justify-between items-center pt-4">
                <Button variant="outline" :to="`/dashboard/investor/startup/${startup.id}`">View Details</Button>
                <Button variant="destructive" @click="handleRemove(startup.id)">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <Card v-for="startup in filteredStartups" :key="startup.id" class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div class="space-y-4 flex-1">
                <div class="flex items-center gap-4">
                  <h3 class="text-lg font-semibold">{{ startup.name }}</h3>
                  <Badge>{{ startup.stage }}</Badge>
                </div>
                <p class="text-muted-foreground">{{ startup.shortDescription }}</p>
                <div class="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{{ startup.industry }}</Badge>
                  <Badge variant="secondary">{{ startup.region }}</Badge>
                </div>
                <div class="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-muted-foreground">Funding Needed</p>
                    <p class="font-medium">{{ startup.fundingNeeded }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Saved On</p>
                    <p class="font-medium">{{ formatDate(startup.savedAt) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Last Viewed</p>
                    <p class="font-medium">{{ formatDate(startup.lastViewed) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Status</p>
                    <Select
                      :value="startup.status"
                      @update:value="(value) => handleStatusChange(startup.id, value)"
                    >
                      <SelectTrigger class="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="status in statuses.filter(s => s.value)" :key="status.value" :value="status.value">
                          {{ status.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div v-if="startup.notes" class="text-sm">
                  <p class="text-muted-foreground">Notes</p>
                  <p>{{ startup.notes }}</p>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <Button variant="outline" :to="`/dashboard/investor/startup/${startup.id}`">View Details</Button>
                <Button variant="destructive" @click="handleRemove(startup.id)">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template> 