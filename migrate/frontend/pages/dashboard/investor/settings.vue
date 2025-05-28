<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

// Investment Questionnaire
const investmentQuestionnaire = ref({
  experienceLevel: '',
  primaryObjective: '',
  riskTolerance: '',
  investmentHorizon: '',
  preferredInvolvement: '',
  exitPreferences: [] as string[],
  expectedReturns: '',
  portfolioDiversification: '',
  coinvestmentInterest: false,
  syndicateParticipation: false
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

// Investment Experience Levels
const experienceLevels = [
  { value: 'novice', label: 'Novice (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)' },
  { value: 'experienced', label: 'Experienced (5-10 years)' },
  { value: 'expert', label: 'Expert (10+ years)' }
]

// Investment Objectives
const investmentObjectives = [
  { value: 'growth', label: 'Capital Growth' },
  { value: 'income', label: 'Regular Income' },
  { value: 'balanced', label: 'Balanced Growth & Income' },
  { value: 'strategic', label: 'Strategic Partnerships' }
]

// Risk Tolerance Levels
const riskToleranceLevels = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'opportunistic', label: 'Opportunistic' }
]

// Investment Horizons
const investmentHorizons = [
  { value: 'short', label: '1-3 years' },
  { value: 'medium', label: '3-5 years' },
  { value: 'long', label: '5-7 years' },
  { value: 'very-long', label: '7+ years' }
]

// Involvement Levels
const involvementLevels = [
  { value: 'passive', label: 'Passive (Financial Investment Only)' },
  { value: 'light', label: 'Light (Quarterly Reviews)' },
  { value: 'active', label: 'Active (Monthly Engagement)' },
  { value: 'hands-on', label: 'Hands-on (Weekly Involvement)' }
]

// Exit Preferences
const exitPreferences = [
  { value: 'acquisition', label: 'Strategic Acquisition' },
  { value: 'ipo', label: 'Initial Public Offering (IPO)' },
  { value: 'secondary', label: 'Secondary Sale' },
  { value: 'buyback', label: 'Company Buyback' }
]

// Expected Returns
const expectedReturns = [
  { value: 'conservative', label: '10-20% IRR' },
  { value: 'moderate', label: '20-30% IRR' },
  { value: 'aggressive', label: '30-40% IRR' },
  { value: 'venture', label: '40%+ IRR' }
]

// Portfolio Diversification
const portfolioDiversification = [
  { value: 'focused', label: 'Focused (1-3 investments)' },
  { value: 'selective', label: 'Selective (4-8 investments)' },
  { value: 'diversified', label: 'Diversified (9-15 investments)' },
  { value: 'broad', label: 'Broad (15+ investments)' }
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

  // Add questionnaire mock data
  investmentQuestionnaire.value = {
    experienceLevel: 'experienced',
    primaryObjective: 'growth',
    riskTolerance: 'aggressive',
    investmentHorizon: 'medium',
    preferredInvolvement: 'active',
    exitPreferences: ['acquisition', 'ipo'],
    expectedReturns: 'aggressive',
    portfolioDiversification: 'selective',
    coinvestmentInterest: true,
    syndicateParticipation: true
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

      <!-- Tabbed Layout -->
      <Tabs default-value="profile" class="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" class="flex gap-2">
            <i class="i-lucide-user" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="investment" class="flex gap-2">
            <i class="i-lucide-trending-up" />
            Investment Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" class="flex gap-2">
            <i class="i-lucide-bell" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <!-- Profile Tab -->
        <TabsContent value="profile">
          <Card>
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
        </TabsContent>

        <!-- Investment Preferences Tab -->
        <TabsContent value="investment">
          <!-- Investment Experience -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>Investment Profile Questionnaire</CardTitle>
              <CardDescription>Help us understand your investment style and preferences</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Experience Level -->
              <div class="space-y-2">
                <Label>What is your level of investment experience?</Label>
                <Select v-model="investmentQuestionnaire.experienceLevel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="level in experienceLevels" :key="level.value" :value="level.value">
                      {{ level.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Primary Investment Objective -->
              <div class="space-y-2">
                <Label>What is your primary investment objective?</Label>
                <Select v-model="investmentQuestionnaire.primaryObjective">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="objective in investmentObjectives" :key="objective.value" :value="objective.value">
                      {{ objective.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Risk Tolerance -->
              <div class="space-y-2">
                <Label>How would you describe your risk tolerance?</Label>
                <Select v-model="investmentQuestionnaire.riskTolerance">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="risk in riskToleranceLevels" :key="risk.value" :value="risk.value">
                      {{ risk.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Investment Horizon -->
              <div class="space-y-2">
                <Label>What is your typical investment horizon?</Label>
                <Select v-model="investmentQuestionnaire.investmentHorizon">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="horizon in investmentHorizons" :key="horizon.value" :value="horizon.value">
                      {{ horizon.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Preferred Involvement -->
              <div class="space-y-2">
                <Label>What level of involvement do you prefer with your portfolio companies?</Label>
                <Select v-model="investmentQuestionnaire.preferredInvolvement">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred involvement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="level in involvementLevels" :key="level.value" :value="level.value">
                      {{ level.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Exit Preferences -->
              <div class="space-y-2">
                <Label>What are your preferred exit strategies? (Select multiple)</Label>
                <Select v-model="investmentQuestionnaire.exitPreferences" multiple>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exit preferences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="exit in exitPreferences" :key="exit.value" :value="exit.value">
                      {{ exit.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Expected Returns -->
              <div class="space-y-2">
                <Label>What are your return expectations?</Label>
                <Select v-model="investmentQuestionnaire.expectedReturns">
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected returns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="returns in expectedReturns" :key="returns.value" :value="returns.value">
                      {{ returns.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Portfolio Diversification -->
              <div class="space-y-2">
                <Label>What is your preferred portfolio diversification strategy?</Label>
                <Select v-model="investmentQuestionnaire.portfolioDiversification">
                  <SelectTrigger>
                    <SelectValue placeholder="Select diversification strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="strategy in portfolioDiversification" :key="strategy.value" :value="strategy.value">
                      {{ strategy.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Additional Preferences -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label>Co-investment Interest</Label>
                    <p class="text-sm text-muted-foreground">Are you interested in co-investment opportunities?</p>
                  </div>
                  <Switch v-model="investmentQuestionnaire.coinvestmentInterest" />
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label>Syndicate Participation</Label>
                    <p class="text-sm text-muted-foreground">Would you like to participate in syndicate deals?</p>
                  </div>
                  <Switch v-model="investmentQuestionnaire.syndicateParticipation" />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Traditional Investment Preferences -->
          <Card>
            <CardHeader>
              <CardTitle>Specific Investment Criteria</CardTitle>
              <CardDescription>Set your detailed investment preferences</CardDescription>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Notifications Tab -->
        <TabsContent value="notifications">
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
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template> 