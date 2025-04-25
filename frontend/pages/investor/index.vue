<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInvestor } from '@/composables/useInvestor'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const { investor, isLoading, error, fetchInvestor, updateInvestor, updatePreferences } = useInvestor()

// Form states
const formData = ref({
  name: '',
  email: '',
  bio: '',
  company: '',
  position: '',
  location: '',
  website: '',
  linkedin: '',
  twitter: '',
  investmentHistory: [],
  expertise: [],
  preferences: {
    industries: [],
    stages: [],
    regions: [],
    minInvestment: 0,
    maxInvestment: 0,
    preferredMetrics: []
  }
})

// Portfolio state
const portfolio = ref({
  totalInvestments: 0,
  activeInvestments: 0,
  totalValue: 0,
  investments: []
})

// Matching state
const matchedStartups = ref([])

onMounted(() => {
  fetchInvestor()
})

// Update form data when investor data is loaded
watch(investor, (newInvestor) => {
  if (newInvestor) {
    formData.value = {
      ...newInvestor,
      preferences: newInvestor.preferences || {
        industries: [],
        stages: [],
        regions: [],
        minInvestment: 0,
        maxInvestment: 0,
        preferredMetrics: []
      }
    }
  }
}, { immediate: true })

// Profile update handler
const updateProfile = async () => {
  if (!investor.value) return
  
  const success = await updateInvestor({
    ...formData.value,
    preferences: formData.value.preferences
  })

  if (success) {
    toast.success('Profile Updated', {
      description: 'Your profile has been successfully updated.',
    })
  } else {
    toast.error('Error', {
      description: 'Failed to update profile. Please try again.',
    })
  }
}

// Preferences update handler
const updateInvestmentPreferences = async () => {
  if (!investor.value) return
  
  const success = await updatePreferences(formData.value.preferences)

  if (success) {
    toast.success('Preferences Updated', {
      description: 'Your investment preferences have been updated.',
    })
  } else {
    toast.error('Error', {
      description: 'Failed to update preferences. Please try again.',
    })
  }
}

// Add investment history
const addInvestmentHistory = () => {
  formData.value.investmentHistory.push({
    company: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    stage: '',
    status: 'active'
  })
}

// Remove investment history
const removeInvestmentHistory = (index: number) => {
  formData.value.investmentHistory.splice(index, 1)
}

// Add expertise
const addExpertise = () => {
  formData.value.expertise.push('')
}

// Remove expertise
const removeExpertise = (index: number) => {
  formData.value.expertise.splice(index, 1)
}

// Add industry preference
const addIndustryPreference = () => {
  formData.value.preferences.industries.push('')
}

// Remove industry preference
const removeIndustryPreference = (index: number) => {
  formData.value.preferences.industries.splice(index, 1)
}

// Add stage preference
const addStagePreference = () => {
  formData.value.preferences.stages.push('')
}

// Remove stage preference
const removeStagePreference = (index: number) => {
  formData.value.preferences.stages.splice(index, 1)
}

// Add region preference
const addRegionPreference = () => {
  formData.value.preferences.regions.push('')
}

// Remove region preference
const removeRegionPreference = (index: number) => {
  formData.value.preferences.regions.splice(index, 1)
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    
    <Tabs v-else default-value="profile" class="w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
      </TabsList>
      
      <!-- Profile Tab -->
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Investor Profile</CardTitle>
            <CardDescription>
              Update your profile information and showcase your expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Basic Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Basic Information</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Name</label>
                    <Input v-model="formData.name" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Email</label>
                    <Input v-model="formData.email" type="email" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Company</label>
                    <Input v-model="formData.company" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Position</label>
                    <Input v-model="formData.position" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Location</label>
                    <Input v-model="formData.location" class="mt-1" />
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Social Links</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Website</label>
                    <Input v-model="formData.website" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">LinkedIn</label>
                    <Input v-model="formData.linkedin" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Twitter</label>
                    <Input v-model="formData.twitter" class="mt-1" />
                  </div>
                </div>
              </div>

              <!-- Bio -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Bio</h3>
                <div>
                  <label class="text-sm font-medium">About</label>
                  <Input v-model="formData.bio" class="mt-1" />
                </div>
              </div>

              <!-- Investment History -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium">Investment History</h3>
                  <Button @click="addInvestmentHistory">Add Investment</Button>
                </div>
                <div v-for="(investment, index) in formData.investmentHistory" :key="index" class="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <label class="text-sm font-medium">Company</label>
                    <Input v-model="investment.company" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Amount</label>
                    <Input v-model="investment.amount" type="number" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Date</label>
                    <Input v-model="investment.date" type="date" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Stage</label>
                    <Input v-model="investment.stage" class="mt-1" />
                  </div>
                  <Button @click="() => removeInvestmentHistory(index)" variant="destructive">Remove</Button>
                </div>
              </div>

              <!-- Expertise -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium">Areas of Expertise</h3>
                  <Button @click="addExpertise">Add Expertise</Button>
                </div>
                <div v-for="(expertise, index) in formData.expertise" :key="index" class="flex gap-4">
                  <Input v-model="formData.expertise[index]" class="mt-1" />
                  <Button @click="() => removeExpertise(index)" variant="destructive">Remove</Button>
                </div>
              </div>

              <Button @click="updateProfile">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Portfolio Tab -->
      <TabsContent value="portfolio">
        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>
              Track your current investments and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Portfolio Summary -->
              <div class="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Investments</CardTitle>
                    <CardDescription>{{ portfolio.totalInvestments }}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Active Investments</CardTitle>
                    <CardDescription>{{ portfolio.activeInvestments }}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Value</CardTitle>
                    <CardDescription>${{ portfolio.totalValue.toLocaleString() }}</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <!-- Investment List -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Current Investments</h3>
                <div v-for="investment in portfolio.investments" :key="investment.id" class="p-4 border rounded-lg">
                  <div class="grid grid-cols-4 gap-4">
                    <div>
                      <h4 class="font-medium">{{ investment.company }}</h4>
                      <p class="text-sm text-gray-500">{{ investment.stage }}</p>
                    </div>
                    <div>
                      <p class="text-sm">Investment Amount</p>
                      <p class="font-medium">${{ investment.amount.toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-sm">Current Value</p>
                      <p class="font-medium">${{ investment.currentValue.toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-sm">ROI</p>
                      <p class="font-medium" :class="investment.roi >= 0 ? 'text-green-500' : 'text-red-500'">
                        {{ investment.roi }}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Preferences Tab -->
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Investment Preferences</CardTitle>
            <CardDescription>
              Specify your investment criteria and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Industry Focus -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium">Industry Focus</h3>
                  <Button @click="addIndustryPreference">Add Industry</Button>
                </div>
                <div v-for="(industry, index) in formData.preferences.industries" :key="index" class="flex gap-4">
                  <Input v-model="formData.preferences.industries[index]" class="mt-1" />
                  <Button @click="() => removeIndustryPreference(index)" variant="destructive">Remove</Button>
                </div>
              </div>

              <!-- Investment Stages -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium">Preferred Investment Stages</h3>
                  <Button @click="addStagePreference">Add Stage</Button>
                </div>
                <div v-for="(stage, index) in formData.preferences.stages" :key="index" class="flex gap-4">
                  <Input v-model="formData.preferences.stages[index]" class="mt-1" />
                  <Button @click="() => removeStagePreference(index)" variant="destructive">Remove</Button>
                </div>
              </div>

              <!-- Geographical Regions -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium">Geographical Regions</h3>
                  <Button @click="addRegionPreference">Add Region</Button>
                </div>
                <div v-for="(region, index) in formData.preferences.regions" :key="index" class="flex gap-4">
                  <Input v-model="formData.preferences.regions[index]" class="mt-1" />
                  <Button @click="() => removeRegionPreference(index)" variant="destructive">Remove</Button>
                </div>
              </div>

              <!-- Investment Range -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Investment Range</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium">Minimum Investment</label>
                    <Input v-model="formData.preferences.minInvestment" type="number" class="mt-1" />
                  </div>
                  <div>
                    <label class="text-sm font-medium">Maximum Investment</label>
                    <Input v-model="formData.preferences.maxInvestment" type="number" class="mt-1" />
                  </div>
                </div>
              </div>

              <Button @click="updateInvestmentPreferences">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Matches Tab -->
      <TabsContent value="matches">
        <Card>
          <CardHeader>
            <CardTitle>Startup Matches</CardTitle>
            <CardDescription>
              Discover startups that match your investment criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div v-for="startup in matchedStartups" :key="startup.id" class="p-4 border rounded-lg">
                <div class="grid grid-cols-4 gap-4">
                  <div>
                    <h4 class="font-medium">{{ startup.name }}</h4>
                    <p class="text-sm text-gray-500">{{ startup.industry }}</p>
                  </div>
                  <div>
                    <p class="text-sm">Stage</p>
                    <p class="font-medium">{{ startup.stage }}</p>
                  </div>
                  <div>
                    <p class="text-sm">Location</p>
                    <p class="font-medium">{{ startup.location }}</p>
                  </div>
                  <div>
                    <p class="text-sm">Funding Needed</p>
                    <p class="font-medium">${{ startup.fundingNeeded.toLocaleString() }}</p>
                  </div>
                </div>
                <div class="mt-4">
                  <p class="text-sm">{{ startup.description }}</p>
                </div>
                <div class="mt-4 flex gap-4">
                  <Button>View Details</Button>
                  <Button variant="outline">Contact</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 