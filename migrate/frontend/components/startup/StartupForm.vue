<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Basic Information -->
    <div class="space-y-6">
      <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Startup Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Enter your startup name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="website">
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="url" placeholder="https://your-startup.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-6">
      <h3 class="text-lg font-medium text-foreground">Description</h3>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Brief Description</FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" placeholder="Describe your startup" class="min-h-[100px]" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Industry & Stage -->
    <div class="space-y-6">
      <h3 class="text-lg font-medium text-foreground">Industry & Stage</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField v-slot="{ componentField }" name="industry">
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="industry in industries" :key="industry" :value="industry">
                  {{ industry }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="stage">
          <FormItem>
            <FormLabel>Stage</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="stage in stages" :key="stage" :value="stage">
                  {{ stage }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Funding -->
    <div class="space-y-6">
      <h3 class="text-lg font-medium text-foreground">Funding</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField v-slot="{ componentField }" name="fundingRound">
          <FormItem>
            <FormLabel>Current Funding Round</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="round in fundingRounds" :key="round" :value="round">
                  {{ round }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="fundingAmount">
          <FormItem>
            <FormLabel>Funding Amount (USD)</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="Enter amount" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <Button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {{ isSubmitting ? 'Creating...' : 'Create Startup' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const emit = defineEmits(['submit'])

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Startup name must be at least 2 characters'),
  website: z.string().url('Please enter a valid website URL'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  stage: z.string().min(1, 'Please select a stage'),
  fundingRound: z.string().min(1, 'Please select a funding round'),
  fundingAmount: z.number().min(0, 'Funding amount must be positive')
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    website: '',
    description: '',
    industry: '',
    stage: '',
    fundingRound: '',
    fundingAmount: null
  }
})

const isSubmitting = ref(false)

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'AI/ML',
  'Clean Energy',
  'Biotech',
  'Other'
]

const stages = [
  'Idea',
  'MVP',
  'Early Stage',
  'Growth',
  'Scale-up'
]

const fundingRounds = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+'
]

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const { valid, data } = await form.validate()
    if (valid) {
      await emit('submit', data)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script> 