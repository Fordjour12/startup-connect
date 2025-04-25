<script setup lang="ts">
import FilterPanel from '@/components/FilterPanel.vue'
import SearchBar from '@/components/SearchBar.vue'
import StartupCard from '@/components/StartupCard.vue'
import { searchStartups, startups } from '@/data/startups'

const showFilters = ref(false)
const searchQuery = ref('')
const activeFilters = ref({
  industry: '',
  location: '',
  fundingStage: ''
})

const filteredStartups = computed(() => {
  let result = startups

  // Apply search
  if (searchQuery.value) {
    result = searchStartups(searchQuery.value)
  }

  // Apply filters
  if (activeFilters.value.industry) {
    result = result.filter(startup => startup.industry === activeFilters.value.industry)
  }
  if (activeFilters.value.location) {
    result = result.filter(startup => startup.location === activeFilters.value.location)
  }
  if (activeFilters.value.fundingStage) {
    result = result.filter(startup => startup.fundingStage === activeFilters.value.fundingStage)
  }

  return result
})

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleFilters = (filters: any) => {
  activeFilters.value = filters
  showFilters.value = false
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex flex-col gap-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Startups</h1>
        <p class="text-muted-foreground">Discover innovative startups and connect with founders</p>
      </div>

      <div class="flex flex-col gap-4">
        <SearchBar
          @search="handleSearch"
          @toggle-filters="showFilters = !showFilters"
        />

        <div class="flex gap-4">
          <div class="flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StartupCard
                v-for="startup in filteredStartups"
                :key="startup.id"
                :startup="startup"
              />
            </div>
          </div>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-4"
          >
            <div v-if="showFilters" class="w-80">
              <FilterPanel
                @close="showFilters = false"
                @apply="handleFilters"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template> 