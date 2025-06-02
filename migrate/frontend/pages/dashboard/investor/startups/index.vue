<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useInvestor } from '@/composables/useInvestor'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

interface Startup {
  id: string
  name: string
  shortDescription: string
  stage: string
  industry: string
  region: string
  fundingNeeded: string
  fundingRaised: number
  teamSize: number
  foundedYear: number
  metrics: {
    revenue?: number
    growth?: number
    burnRate?: number
  }
  tags: string[]
}

const { investor, isLoading, error } = useInvestor()

// State for startups
const startups = ref<Startup[]>([])
const filteredStartups = ref<Startup[]>([])

// Filter states
const searchQuery = ref('')
const selectedIndustry = ref('all')
const selectedStage = ref('all')
const selectedRegion = ref('all')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const fundingRange = ref([0, 10000000])
const teamSizeRange = ref([1, 100])
const selectedTags = ref<string[]>([])

// Available options
const industries = [
  'Technology',
  'Healthcare',
  'FinTech',
  'E-commerce',
  'AI/ML',
  'CleanTech',
  'EdTech',
  'SaaS',
  'Biotech',
  'Consumer'
]

const stages = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+'
]

const regions = [
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Africa',
  'Oceania'
]

const tags = [
  'B2B',
  'B2C',
  'Marketplace',
  'Mobile',
  'Web',
  'Enterprise',
  'Deep Tech',
  'Social Impact',
  'Hardware',
  'Blockchain'
]

// Computed properties for filtering
const filteredResults = computed(() => {
  let results = [...startups.value]

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(startup => 
      startup.name.toLowerCase().includes(query) ||
      startup.shortDescription.toLowerCase().includes(query) ||
      startup.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply industry filter
  if (selectedIndustry.value) {
    results = results.filter(startup => startup.industry === selectedIndustry.value)
  }

  // Apply stage filter
  if (selectedStage.value) {
    results = results.filter(startup => startup.stage === selectedStage.value)
  }

  // Apply region filter
  if (selectedRegion.value) {
    results = results.filter(startup => startup.region === selectedRegion.value)
  }

  // Apply funding range filter
  results = results.filter(startup => {
    const funding = parseFloat(startup.fundingNeeded.replace(/[^0-9.]/g, ''))
    return funding >= fundingRange.value[0] && funding <= fundingRange.value[1]
  })

  // Apply team size filter
  results = results.filter(startup => 
    startup.teamSize >= teamSizeRange.value[0] && 
    startup.teamSize <= teamSizeRange.value[1]
  )

  // Apply tags filter
  if (selectedTags.value.length > 0) {
    results = results.filter(startup => 
      selectedTags.value.every(tag => startup.tags.includes(tag))
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      results.sort((a, b) => b.foundedYear - a.foundedYear)
      break
    case 'funding':
      results.sort((a, b) => b.fundingRaised - a.fundingRaised)
      break
    case 'growth':
      results.sort((a, b) => (b.metrics.growth || 0) - (a.metrics.growth || 0))
      break
  }

  return results
})

onMounted(async () => {
  // TODO: Implement API call to fetch startups
  // For now, using mock data
  startups.value = [
    {
      id: '1',
      name: 'TechStart AI',
      shortDescription: 'AI-powered business analytics platform',
      stage: 'Series A',
      industry: 'Technology',
      region: 'North America',
      fundingNeeded: '$5M',
      fundingRaised: 2000000,
      teamSize: 25,
      foundedYear: 2022,
      metrics: {
        revenue: 500000,
        growth: 150,
        burnRate: 15
      },
      tags: ['B2B', 'AI/ML', 'SaaS']
    },
    // Add more mock startups here
  ]
})

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
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
          <h1 class="text-3xl font-bold">Startup Directory</h1>
          <p class="text-muted-foreground">Browse and discover promising startups</p>
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

      <!-- Filter Section -->
      <Card class="mb-8">
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="col-span-full">
              <Input
                v-model="searchQuery"
                placeholder="Search startups by name, description, or tags..."
                class="w-full"
              />
            </div>

            <!-- Industry -->
            <div>
              <label class="text-sm font-medium mb-2 block">Industry</label>
              <Select v-model="selectedIndustry">
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem v-for="industry in industries" :key="industry" :value="industry">
                    {{ industry }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Stage -->
            <div>
              <label class="text-sm font-medium mb-2 block">Stage</label>
              <Select v-model="selectedStage">
                <SelectTrigger>
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem v-for="stage in stages" :key="stage" :value="stage">
                    {{ stage }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Region -->
            <div>
              <label class="text-sm font-medium mb-2 block">Region</label>
              <Select v-model="selectedRegion">
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem v-for="region in regions" :key="region" :value="region">
                    {{ region }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Funding Range -->
            <div>
              <label class="text-sm font-medium mb-2 block">
                Funding Needed: {{ formatCurrency(fundingRange[0]) }} - {{ formatCurrency(fundingRange[1]) }}
              </label>
              <Slider
                v-model="fundingRange"
                :min="0"
                :max="10000000"
                :step="100000"
                class="w-full"
              />
            </div>

            <!-- Team Size -->
            <div>
              <label class="text-sm font-medium mb-2 block">
                Team Size: {{ teamSizeRange[0] }} - {{ teamSizeRange[1] }}
              </label>
              <Slider
                v-model="teamSizeRange"
                :min="1"
                :max="100"
                :step="1"
                class="w-full"
              />
            </div>

            <!-- Sort By -->
            <div>
              <label class="text-sm font-medium mb-2 block">Sort By</label>
              <Select v-model="sortBy">
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="funding">Funding Amount</SelectItem>
                  <SelectItem value="growth">Growth Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Tags -->
            <div class="col-span-full">
              <label class="text-sm font-medium mb-2 block">Tags</label>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tag in tags"
                  :key="tag"
                  :variant="selectedTags.includes(tag) ? 'default' : 'outline'"
                  class="cursor-pointer"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Results Count -->
      <div class="mb-4">
        <p class="text-sm text-muted-foreground">
          Showing {{ filteredResults.length }} startups
        </p>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="startup in filteredResults" :key="startup.id" class="hover:shadow-lg transition-shadow">
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
                <Badge v-for="tag in startup.tags" :key="tag" variant="outline">
                  {{ tag }}
                </Badge>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-muted-foreground">Funding Needed</p>
                  <p class="font-medium">{{ startup.fundingNeeded }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Team Size</p>
                  <p class="font-medium">{{ startup.teamSize }} people</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Founded</p>
                  <p class="font-medium">{{ startup.foundedYear }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Growth</p>
                  <p class="font-medium">{{ startup.metrics.growth }}%</p>
                </div>
              </div>

              <div class="flex justify-between items-center pt-4">
                <Button variant="outline">View Details</Button>
                <Button>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <Card v-for="startup in filteredResults" :key="startup.id" class="hover:shadow-lg transition-shadow">
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
                  <Badge v-for="tag in startup.tags" :key="tag" variant="outline">
                    {{ tag }}
                  </Badge>
                </div>
                <div class="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-muted-foreground">Funding Needed</p>
                    <p class="font-medium">{{ startup.fundingNeeded }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Team Size</p>
                    <p class="font-medium">{{ startup.teamSize }} people</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Founded</p>
                    <p class="font-medium">{{ startup.foundedYear }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Growth</p>
                    <p class="font-medium">{{ startup.metrics.growth }}%</p>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <Button variant="outline">View Details</Button>
                <Button>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template> 