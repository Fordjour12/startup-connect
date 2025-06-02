<template>
  <Card 
    class="cursor-pointer hover:shadow-md transition-shadow duration-200"
    @click="navigateToDetail"
  >
    <CardContent class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img 
            :src="startup.logoUrl" 
            :alt="startup.name"
            class="w-10 h-10 rounded-lg object-cover bg-gray-50"
          />
          <div class="flex-grow">
            <div class="flex items-center space-x-2">
              <h3 class="font-semibold text-gray-900">{{ startup.name }}</h3>
              <Badge :variant="getStageVariant(startup.stage)" class="text-xs">
                {{ startup.stage }}
              </Badge>
            </div>
            <p class="text-sm text-gray-500">{{ startup.location }} • {{ startup.industry }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="hidden md:block text-right">
            <div class="text-sm font-medium text-gray-900">
              {{ startup.teamSize }} team members
            </div>
            <div v-if="startup.fundingAmount" class="text-sm text-gray-500">
              ${{ formatFunding(startup.fundingAmount) }} raised
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronRightIcon class="w-5 h-5" />
          </Button>
        </div>
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