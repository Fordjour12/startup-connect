<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'toggleFilters'): void
}>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="flex gap-2">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        placeholder="Search startups..."
        class="pl-9"
        @keyup.enter="handleSearch"
      />
    </div>
    <Button variant="outline" @click="$emit('toggleFilters')">
      <SlidersHorizontal class="h-4 w-4 mr-2" />
      Filters
    </Button>
  </div>
</template> 