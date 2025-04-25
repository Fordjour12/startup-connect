<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: any): void
}>()

const industries = [
  'Technology',
  'Healthcare',
  'Fintech',
  'E-commerce',
  'Education',
  'AI/ML',
  'Clean Energy',
  'Biotech'
]

const locations = [
  'San Francisco',
  'New York',
  'London',
  'Berlin',
  'Singapore',
  'Tokyo',
  'Bangalore',
  'Tel Aviv'
]

const fundingStages = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'IPO'
]

const filters = ref({
  industry: '',
  location: '',
  fundingStage: ''
})

const applyFilters = () => {
  emit('apply', filters.value)
}
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Filters</CardTitle>
      <Button variant="ghost" size="icon" @click="$emit('close')">
        <X class="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label>Industry</Label>
        <Select v-model="filters.industry">
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="industry in industries" :key="industry" :value="industry">
              {{ industry }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label>Location</Label>
        <Select v-model="filters.location">
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label>Funding Stage</Label>
        <Select v-model="filters.fundingStage">
          <SelectTrigger>
            <SelectValue placeholder="Select funding stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="stage in fundingStages" :key="stage" :value="stage">
              {{ stage }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button class="w-full" @click="applyFilters">
        Apply Filters
      </Button>
    </CardContent>
  </Card>
</template> 