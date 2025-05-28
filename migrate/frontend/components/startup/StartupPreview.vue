<template>
  <div class="bg-card shadow-sm rounded-lg border p-6">
    <h3 class="text-lg font-medium text-foreground mb-4">Preview</h3>
    
    <!-- Basic Info -->
    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-medium text-muted-foreground">Startup Name</h4>
        <p class="mt-1 text-sm text-foreground">{{ startup.name || 'Not provided' }}</p>
      </div>
      
      <div>
        <h4 class="text-sm font-medium text-muted-foreground">Website</h4>
        <p class="mt-1 text-sm text-foreground">
          <a v-if="startup.website" :href="startup.website" target="_blank" class="text-primary hover:text-primary/80">
            {{ startup.website }}
          </a>
          <span v-else>Not provided</span>
        </p>
      </div>
      
      <div>
        <h4 class="text-sm font-medium text-muted-foreground">Description</h4>
        <p class="mt-1 text-sm text-foreground">{{ startup.description || 'Not provided' }}</p>
      </div>
    </div>

    <!-- Industry & Stage -->
    <div class="mt-6 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium text-muted-foreground">Industry</h4>
          <p class="mt-1 text-sm text-foreground">{{ startup.industry || 'Not provided' }}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-muted-foreground">Stage</h4>
          <p class="mt-1 text-sm text-foreground">{{ startup.stage || 'Not provided' }}</p>
        </div>
      </div>
    </div>

    <!-- Funding -->
    <div class="mt-6 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium text-muted-foreground">Funding Round</h4>
          <p class="mt-1 text-sm text-foreground">{{ startup.fundingRound || 'Not provided' }}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-muted-foreground">Funding Amount</h4>
          <p class="mt-1 text-sm text-foreground">
            {{ startup.fundingAmount ? `$${startup.fundingAmount.toLocaleString()}` : 'Not provided' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  startup: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script> 