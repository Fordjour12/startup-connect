<template>
  <Card class="h-full">
    <CardContent class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <img 
            :src="startup.logoUrl" 
            :alt="startup.name"
            class="w-12 h-12 rounded-lg object-cover bg-gray-50"
          />
          <div>
            <h3 class="font-semibold text-gray-900">{{ startup.name }}</h3>
            <p class="text-sm text-gray-500">{{ startup.location }}</p>
          </div>
        </div>
        <Badge :variant="getStageVariant(startup.stage)">
          {{ startup.stage }}
        </Badge>
      </div>

      <p class="mt-4 text-sm text-gray-600 line-clamp-2">
        {{ startup.description }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" class="text-xs">
          {{ startup.industry }}
        </Badge>
        <Badge variant="secondary" class="text-xs">
          {{ startup.teamSize }} team members
        </Badge>
        <Badge v-if="startup.fundingAmount" variant="secondary" class="text-xs">
          ${{ formatFunding(startup.fundingAmount) }} raised
        </Badge>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" class="w-full" @click="navigateToDetail">
          View Details
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Startup } from '@/composables/useStartupList'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps<{
  startup: Startup
}>()

const router = useRouter()

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const getStageVariant = (stage: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'idea': 'default',
    'mvp': 'secondary',
    'seed': 'default',
    'series_a': 'secondary',
    'series_b_plus': 'destructive'
  }
  return variants[stage] || 'default'
}

const formatFunding = (amount: number) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K'
  }
  return amount.toString()
}

const navigateToDetail = () => {
  router.push(`/dashboard/founder/startup/${props.startup.id}`)
}
</script> 