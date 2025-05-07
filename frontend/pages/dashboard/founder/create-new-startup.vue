<template>
  <div class="min-h-screen bg-background py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate">
              Create New Startup
            </h2>
          </div>
        </div>

        <div class="bg-card shadow-sm rounded-lg border">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Form Section -->
              <div>
                <StartupForm @submit="handleSubmit" />
              </div>

              <!-- Preview Section -->
              <div class="lg:sticky lg:top-6">
                <StartupPreview :startup="formData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {toast} from "vue-sonner"
import StartupForm from '@/components/startup/StartupForm.vue'
import StartupPreview from '@/components/startup/StartupPreview.vue'

// definePageMeta({
//   middleware: 'auth'
// })

const router = useRouter()

const formData = ref({
  name: '',
  website: '',
  description: '',
  industry: '',
  stage: '',
  fundingRound: '',
  fundingAmount: null
})

const handleSubmit = async (data) => {
  try {
    // TODO: Implement API call to create startup
    console.log('Creating startup:', data)
    
    // For now, just show success message and redirect
    toast.success('Startup created successfully!')
    router.push('/dashboard/founder')
  } catch (error) {
    console.error('Error creating startup:', error)
    toast.error('Failed to create startup. Please try again.')
  }
}
</script> 