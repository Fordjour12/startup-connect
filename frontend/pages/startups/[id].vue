<script setup lang="ts">
import FileUpload from '@/components/FileUpload.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getStartupById, type Startup } from '@/data/startups'
import { Building2, Calendar, DollarSign, Globe, MapPin, Users } from 'lucide-vue-next'

const route = useRoute()
const startupId = Number(route.params.id)

// Get startup by ID
const startup = ref<Startup | undefined>(getStartupById(startupId))

// If startup is not found, show error
if (!startup.value) {
  throw createError({
    statusCode: 404,
    message: 'Startup not found'
  })
}

// Now we can safely use startup.value as it's guaranteed to be defined
const startupData = startup.value

// Handle file uploads
const handleFileUpload = (files: File[]) => {
  // In a real application, you would upload the files to your server
  console.log('Uploading files:', files)
}

const handleFileRemove = (fileId: string) => {
  // In a real application, you would remove the file from your server
  console.log('Removing file:', fileId)
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex flex-col gap-8">
      <div class="flex items-center gap-4">
        <Button variant="outline" @click="$router.back()">
          Back to Startups
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <div class="flex items-center gap-4">
                <img :src="startupData.logo" :alt="startupData.name" class="w-16 h-16 rounded-lg object-cover" >
                <div>
                  <CardTitle class="text-2xl">{{ startupData.name }}</CardTitle>
                  <CardDescription>{{ startupData.industry }}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">About</h3>
                <p class="text-muted-foreground">{{ startupData.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold">Key Metrics</h3>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <DollarSign class="w-4 h-4 text-muted-foreground" />
                      <span>{{ startupData.metrics.revenue }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Users class="w-4 h-4 text-muted-foreground" />
                      <span>{{ startupData.metrics.customers }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Calendar class="w-4 h-4 text-muted-foreground" />
                      <span>{{ startupData.metrics.growth }}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold">Funding</h3>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <DollarSign class="w-4 h-4 text-muted-foreground" />
                      <span>{{ startupData.funding.total }} Total</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Building2 class="w-4 h-4 text-muted-foreground" />
                      <span>{{ startupData.funding.lastRound }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Investors</h3>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="investor in startupData.funding.investors" :key="investor" variant="secondary">
                    {{ investor }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Documents Section -->
          <Card class="mt-8">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Pitch decks, financial reports, and other documents</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                :max-size="10"
                :multiple="true"
                @upload="handleFileUpload"
                @remove="handleFileRemove"
              />
            </CardContent>
          </Card>
        </div>

        <div class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-muted-foreground" />
                <span>{{ startupData.location }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Building2 class="w-4 h-4 text-muted-foreground" />
                <span>{{ startupData.teamSize }} employees</span>
              </div>
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-muted-foreground" />
                <span>Founded {{ startupData.foundedYear }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4 text-muted-foreground" />
                <a :href="startupData.website" target="_blank" class="text-primary hover:underline">
                  {{ startupData.website }}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <Button class="w-full">
                Contact Founder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template> 