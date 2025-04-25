<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Startup } from '@/data/startups'
import { Building2, DollarSign, MapPin } from 'lucide-vue-next'

const props = defineProps<{
  startup: Startup
}>()
</script>

<template>
  <Card class="w-full hover:shadow-lg transition-shadow">
    <CardHeader>
      <div class="flex items-center gap-4">
        <img :src="startup.logo" :alt="startup.name" class="w-12 h-12 rounded-lg object-cover" />
        <div>
          <CardTitle>{{ startup.name }}</CardTitle>
          <CardDescription>{{ startup.industry }}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground line-clamp-2">{{ startup.description }}</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <Badge variant="secondary" class="flex items-center gap-1">
          <MapPin class="w-3 h-3" />
          {{ startup.location }}
        </Badge>
        <Badge variant="secondary" class="flex items-center gap-1">
          <DollarSign class="w-3 h-3" />
          {{ startup.fundingStage }}
        </Badge>
        <Badge variant="secondary" class="flex items-center gap-1">
          <Building2 class="w-3 h-3" />
          Founded {{ startup.foundedYear }}
        </Badge>
      </div>
    </CardContent>
    <CardFooter>
      <NuxtLink :to="`/startups/${startup.id}`" class="w-full">
        <Button variant="outline" class="w-full">
          View Details
        </Button>
      </NuxtLink>
    </CardFooter>
  </Card>
</template> 