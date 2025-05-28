import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface Startup {
  id: string
  name: string
  logoUrl: string
  industry: string
  stage: string
  location: string
  description: string
  foundedDate: string
  teamSize: number
  fundingAmount?: number
  website?: string
}

export interface FilterOptions {
  search: string
  industry: string
  stage: string
  sortBy: string
}

export function useStartupList() {
  const startups: Ref<Startup[]> = ref([])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const filterOptions = ref<FilterOptions>({
    search: '',
    industry: '',
    stage: '',
    sortBy: 'newest'
  })

  // Mock data for development - replace with actual API call
  const fetchStartups = async () => {
    pending.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/startups')
      const data = await response.json()
      startups.value = data
    } catch (err) {
      error.value = err as Error
      console.error('Failed to fetch startups:', err)
    } finally {
      pending.value = false
    }
  }

  // Initial fetch
  fetchStartups()

  const filteredStartups = computed(() => {
    let result = [...startups.value]

    // Apply search filter
    if (filterOptions.value.search) {
      const searchTerm = filterOptions.value.search.toLowerCase()
      result = result.filter(startup => 
        startup.name.toLowerCase().includes(searchTerm) ||
        startup.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply industry filter
    if (filterOptions.value.industry) {
      result = result.filter(startup => 
        startup.industry === filterOptions.value.industry
      )
    }

    // Apply stage filter
    if (filterOptions.value.stage) {
      result = result.filter(startup => 
        startup.stage === filterOptions.value.stage
      )
    }

    // Apply sorting
    switch (filterOptions.value.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.foundedDate).getTime() - new Date(a.foundedDate).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime())
        break
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  })

  const refresh = () => {
    fetchStartups()
  }

  return {
    startups: filteredStartups,
    filterOptions,
    pending,
    error,
    refresh
  }
} 