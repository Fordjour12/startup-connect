<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Your Startups</h1>
        <div class="flex items-center space-x-4">
          <Button variant="outline" class="hidden md:flex" @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'">
            <ListIcon v-if="viewMode === 'grid'" class="w-5 h-5 mr-2" />
            <LayoutGridIcon v-else class="w-5 h-5 mr-2" />
            {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
          </Button>
          <Button class="hidden md:flex" as-child>
            <NuxtLink to="/dashboard/founder/startup/create-new-startup">
              <PlusIcon class="size-5 mr-2" />
              Add Startup
            </NuxtLink>
          </Button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <Input 
            v-model="filterOptions.search" 
            placeholder="Search startups..." 
            class="pl-10 max-w-3xl"
          />
          <SearchIcon class="size-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <Select v-model="filterOptions.industry">
          <SelectTrigger class="w-full md:w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Industries</SelectLabel>
              <SelectItem v-for="option in industryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select v-model="filterOptions.stage">
          <SelectTrigger class="w-full md:w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Stages</SelectLabel>
              <SelectItem v-for="option in stageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select v-model="filterOptions.sortBy">
          <SelectTrigger class="w-full md:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort Options</SelectLabel>
              <SelectItem v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <ArrowPathIcon class="w-8 h-8 animate-spin text-primary" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
        <CircleAlert class="w-12 h-12 text-red-500 mb-4" />
        <p class="text-gray-600">Failed to load startups. Please try again later.</p>
        <Button variant="outline" class="mt-4" @click="refreshData">
          Retry
        </Button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredStartups.length" class="flex flex-col items-center justify-center py-12">
        <FolderOpenIcon class="w-12 h-12 text-gray-400 mb-4" />
        <p class="text-gray-600">No startups found matching your criteria.</p>
      </div>

      <!-- Startup Grid/List -->
      <div v-else>
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StartupCard 
            v-for="startup in filteredStartups" 
            :key="startup.id" 
            :startup="startup"
            class="h-full"
          />
        </div>
        <div v-else class="flex flex-col space-y-4">
          <StartupListItem 
            v-for="startup in filteredStartups" 
            :key="startup.id" 
            :startup="startup"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  ListIcon, 
  SearchIcon,
  CircleAlert,
  FolderOpenIcon,
  LayoutGridIcon,
  PlusIcon
} from 'lucide-vue-next'
import { useStartupList } from '@/composables/useStartupList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// View mode state
const viewMode = ref<'grid' | 'list'>('grid')

// Filter options
const industryOptions = [
  { label: 'All Industries', value: 'all' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'SaaS', value: 'saas' },
  { label: 'AI/ML', value: 'ai-ml' },
]

const stageOptions = [
  { label: 'All Stages', value: 'all' },
  { label: 'Idea', value: 'idea' },
  { label: 'MVP', value: 'mvp' },
  { label: 'Seed', value: 'seed' },
  { label: 'Series A', value: 'series_a' },
  { label: 'Series B+', value: 'series_b_plus' },
]

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
]

// Use the startup list composable
const { startups: filteredStartups, filterOptions, pending, error, refresh: refreshData } = useStartupList()

// Initialize filter options with 'all' values
filterOptions.value = {
  search: '',
  industry: 'all',
  stage: 'all',
  sortBy: 'newest'
}
</script>
