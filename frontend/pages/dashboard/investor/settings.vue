<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useInvestor } from '@/composables/useInvestor'
import { toast } from 'vue-sonner'

const { investor, isLoading, error } = useInvestor()

// Account Settings
const accountSettings = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  bio: ''
})

// Investment Preferences
const investmentPreferences = ref({
  preferredStages: [] as string[],
  preferredIndustries: [] as string[],
  preferredRegions: [] as string[],
  minInvestmentAmount: '',
  maxInvestmentAmount: '',
  investmentFocus: [] as string[],
  dealFlowPreferences: [] as string[]
})

// Notification Settings
const notificationSettings = ref({
  emailNotifications: true,
  newStartupMatches: true,
  savedStartupUpdates: true,
  investmentOpportunities: true,
  marketInsights: true,
  weeklyDigest: true,
  pushNotifications: true
})

// Available options for preferences
const stages = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Growth'
]

const industries = [
  'Technology',
  'Healthcare',
  'Fintech',
  'E-commerce',
  'AI/ML',
  'CleanTech',
  'EdTech',
  'Biotech',
  'SaaS',
  'Hardware'
]

const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa'
]

const investmentFocus = [
  'Early Stage',
  'Growth Stage',
  'Late Stage',
  'Acquisition',
  'IPO'
]

const dealFlowPreferences = [
  'Direct Investment',
  'Syndicate',
  'Fund Investment',
  'Co-investment'
]

onMounted(async () => {
  // TODO: Implement API call to fetch investor settings
  // For now, using mock data
  accountSettings.value = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Ventures Capital',
    position: 'Managing Partner',
    bio: 'Experienced investor with a focus on early-stage technology companies.'
  }

  investmentPreferences.value = {
    preferredStages: ['Seed', 'Series A'],
    preferredIndustries: ['Technology', 'AI/ML'],
    preferredRegions: ['North America', 'Europe'],
    minInvestmentAmount: '100000',
    maxInvestmentAmount: '1000000',
    investmentFocus: ['Early Stage', 'Growth Stage'],
    dealFlowPreferences: ['Direct Investment', 'Syndicate']
  }
})

const handleSaveSettings = async () => {
  try {
    // TODO: Implement API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings')
  }
}

const handleResetSettings = () => {
  // TODO: Implement reset functionality
  toast.info('Settings reset to default values')
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else>
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Account Settings</h1>
          <p class="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="handleResetSettings">Reset to Default</Button>
          <Button @click="handleSaveSettings">Save Changes</Button>
        </div>
      </div>

      <!-- Account Settings -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal and professional information</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input id="firstName" v-model="accountSettings.firstName" />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input id="lastName" v-model="accountSettings.lastName" />
            </div>
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="accountSettings.email" />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input id="phone" type="tel" v-model="accountSettings.phone" />
            </div>
            <div class="space-y-2">
              <Label for="company">Company</Label>
              <Input id="company" v-model="accountSettings.company" />
            </div>
            <div class="space-y-2">
              <Label for="position">Position</Label>
              <Input id="position" v-model="accountSettings.position" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="bio">Bio</Label>
              <Textarea id="bio" v-model="accountSettings.bio" rows="4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Investment Preferences -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Investment Preferences</CardTitle>
          <CardDescription>Customize your investment criteria and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div class="space-y-2">
              <Label>Preferred Investment Stages</Label>
              <Select v-model="investmentPreferences.preferredStages" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="stage in stages" :key="stage" :value="stage">
                    {{ stage }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Preferred Industries</Label>
              <Select v-model="investmentPreferences.preferredIndustries" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="industry in industries" :key="industry" :value="industry">
                    {{ industry }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Preferred Regions</Label>
              <Select v-model="investmentPreferences.preferredRegions" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="region in regions" :key="region" :value="region">
                    {{ region }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="minInvestment">Minimum Investment Amount</Label>
                <Input id="minInvestment" type="number" v-model="investmentPreferences.minInvestmentAmount" />
              </div>
              <div class="space-y-2">
                <Label for="maxInvestment">Maximum Investment Amount</Label>
                <Input id="maxInvestment" type="number" v-model="investmentPreferences.maxInvestmentAmount" />
              </div>
            </div>

            <div class="space-y-2">
              <Label>Investment Focus</Label>
              <Select v-model="investmentPreferences.investmentFocus" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select focus areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="focus in investmentFocus" :key="focus" :value="focus">
                    {{ focus }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Deal Flow Preferences</Label>
              <Select v-model="investmentPreferences.dealFlowPreferences" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal flow preferences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="pref in dealFlowPreferences" :key="pref" :value="pref">
                    {{ pref }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Notification Settings -->
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Email Notifications</Label>
                <p class="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch v-model="notificationSettings.emailNotifications" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>New Startup Matches</Label>
                <p class="text-sm text-muted-foreground">Get notified about new startups matching your criteria</p>
              </div>
              <Switch v-model="notificationSettings.newStartupMatches" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Saved Startup Updates</Label>
                <p class="text-sm text-muted-foreground">Receive updates about your saved startups</p>
              </div>
              <Switch v-model="notificationSettings.savedStartupUpdates" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Investment Opportunities</Label>
                <p class="text-sm text-muted-foreground">Get notified about new investment opportunities</p>
              </div>
              <Switch v-model="notificationSettings.investmentOpportunities" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Market Insights</Label>
                <p class="text-sm text-muted-foreground">Receive market insights and industry updates</p>
              </div>
              <Switch v-model="notificationSettings.marketInsights" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p class="text-sm text-muted-foreground">Get a weekly summary of important updates</p>
              </div>
              <Switch v-model="notificationSettings.weeklyDigest" />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>Push Notifications</Label>
                <p class="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <Switch v-model="notificationSettings.pushNotifications" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 