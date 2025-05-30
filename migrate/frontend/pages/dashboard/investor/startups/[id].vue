<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useInvestor } from '@/composables/useInvestor'
import { toast } from 'vue-sonner'

interface Startup {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  stage: string
  industry: string
  region: string
  fundingNeeded: string
  fundingRaised: number
  teamSize: number
  foundedYear: number
  metrics: {
    revenue?: number
    growth?: number
    burnRate?: number
    mrr?: number
    arr?: number
    cac?: number
    ltv?: number
  }
  team: {
    name: string
    role: string
    bio: string
    linkedin?: string
  }[]
  documents: {
    id: string
    name: string
    type: string
    size: string
    uploadedAt: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
  pitchDeck?: {
    id: string
    name: string
    slides: number
    lastUpdated: string
  }
  financials: {
    year: number
    revenue: number
    expenses: number
    profit: number
    projections: {
      year: number
      revenue: number
      expenses: number
      profit: number
    }[]
  }
  tags: string[]
  socialLinks: {
    website?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
  timeline: {
    date: string
    event: string
    description: string
  }[]
}

const route = useRoute()
const { investor, isLoading, error } = useInvestor()

const startup = ref<Startup | null>(null)
const isSaving = ref(false)
const isSaved = ref(false)

onMounted(async () => {
  const startupId = route.params.id
  // TODO: Implement API call to fetch startup details
  // For now, using mock data
  startup.value = {
    id: startupId as string,
    name: 'TechStart AI',
    shortDescription: 'AI-powered business analytics platform',
    longDescription: 'TechStart AI is revolutionizing how businesses analyze and act on their data. Our platform uses advanced machine learning algorithms to provide actionable insights and predictions, helping companies make data-driven decisions with confidence.',
    stage: 'Series A',
    industry: 'Technology',
    region: 'North America',
    fundingNeeded: '$5M',
    fundingRaised: 2000000,
    teamSize: 25,
    foundedYear: 2022,
    metrics: {
      revenue: 500000,
      growth: 150,
      burnRate: 15,
      mrr: 50000,
      arr: 600000,
      cac: 5000,
      ltv: 50000
    },
    team: [
      {
        name: 'John Doe',
        role: 'CEO & Co-founder',
        bio: 'Former Tech Lead at Google, 10+ years in AI/ML',
        linkedin: 'https://linkedin.com/in/johndoe'
      },
      {
        name: 'Jane Smith',
        role: 'CTO & Co-founder',
        bio: 'PhD in Computer Science, AI researcher',
        linkedin: 'https://linkedin.com/in/janesmith'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Business Plan',
        type: 'PDF',
        size: '2.5 MB',
        uploadedAt: '2024-03-15',
        status: 'approved'
      },
      {
        id: '2',
        name: 'Financial Projections',
        type: 'XLSX',
        size: '1.2 MB',
        uploadedAt: '2024-03-15',
        status: 'approved'
      }
    ],
    pitchDeck: {
      id: '1',
      name: 'TechStart AI Pitch Deck',
      slides: 15,
      lastUpdated: '2024-03-15'
    },
    financials: {
      year: 2023,
      revenue: 500000,
      expenses: 300000,
      profit: 200000,
      projections: [
        {
          year: 2024,
          revenue: 1200000,
          expenses: 600000,
          profit: 600000
        },
        {
          year: 2025,
          revenue: 3000000,
          expenses: 1500000,
          profit: 1500000
        }
      ]
    },
    tags: ['B2B', 'AI/ML', 'SaaS'],
    socialLinks: {
      website: 'https://techstart.ai',
      linkedin: 'https://linkedin.com/company/techstart-ai',
      twitter: 'https://twitter.com/techstart_ai'
    },
    timeline: [
      {
        date: '2022-01',
        event: 'Company Founded',
        description: 'TechStart AI was founded by John Doe and Jane Smith'
      },
      {
        date: '2022-06',
        event: 'Seed Round',
        description: 'Raised $2M in seed funding'
      },
      {
        date: '2023-01',
        event: 'Product Launch',
        description: 'Launched first version of the platform'
      }
    ]
  }
})

const handleSave = async () => {
  if (!startup.value) return
  
  isSaving.value = true
  try {
    // TODO: Implement save functionality
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    isSaved.value = true
    toast.success('Startup saved to your portfolio')
  } catch (error) {
    toast.error('Failed to save startup')
  } finally {
    isSaving.value = false
  }
}

const handleContact = () => {
  // TODO: Implement contact functionality
  toast.info('Contact form will be implemented')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
    <div v-else-if="startup" class="space-y-8">
      <!-- Header Section -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold">{{ startup.name }}</h1>
          <p class="text-muted-foreground mt-2">{{ startup.shortDescription }}</p>
          <div class="flex gap-2 mt-4">
            <Badge>{{ startup.stage }}</Badge>
            <Badge variant="secondary">{{ startup.industry }}</Badge>
            <Badge variant="secondary">{{ startup.region }}</Badge>
            <Badge v-for="tag in startup.tags" :key="tag" variant="outline">
              {{ tag }}
            </Badge>
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="handleContact">Contact Founder</Button>
          <Button :disabled="isSaving" @click="handleSave">
            {{ isSaved ? 'Saved' : 'Save to Portfolio' }}
          </Button>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <Tabs default-value="overview" class="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <!-- Overview Tab -->
        <TabsContent value="overview" class="space-y-6">
          <!-- Description -->
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">{{ startup.longDescription }}</p>
            </CardContent>
          </Card>

          <!-- Key Metrics -->
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                  <p class="text-2xl font-bold">{{ formatCurrency(startup.metrics.mrr || 0) }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                  <p class="text-2xl font-bold">{{ formatCurrency(startup.metrics.arr || 0) }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Customer Acquisition Cost</p>
                  <p class="text-2xl font-bold">{{ formatCurrency(startup.metrics.cac || 0) }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Lifetime Value</p>
                  <p class="text-2xl font-bold">{{ formatCurrency(startup.metrics.ltv || 0) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Funding -->
          <Card>
            <CardHeader>
              <CardTitle>Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-muted-foreground">Funding Needed</p>
                  <p class="text-2xl font-bold">{{ startup.fundingNeeded }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Funding Raised</p>
                  <p class="text-2xl font-bold">{{ formatCurrency(startup.fundingRaised) }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Progress</p>
                  <Progress :value="(startup.fundingRaised / parseFloat(startup.fundingNeeded.replace(/[^0-9.]/g, ''))) * 100" class="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Social Links -->
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-4">
                <a v-if="startup.socialLinks.website" :href="startup.socialLinks.website" target="_blank" class="text-primary hover:underline">
                  Website
                </a>
                <a v-if="startup.socialLinks.linkedin" :href="startup.socialLinks.linkedin" target="_blank" class="text-primary hover:underline">
                  LinkedIn
                </a>
                <a v-if="startup.socialLinks.twitter" :href="startup.socialLinks.twitter" target="_blank" class="text-primary hover:underline">
                  Twitter
                </a>
                <a v-if="startup.socialLinks.github" :href="startup.socialLinks.github" target="_blank" class="text-primary hover:underline">
                  GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Team Tab -->
        <TabsContent value="team">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card v-for="member in startup.team" :key="member.name">
              <CardContent class="pt-6">
                <div class="space-y-4">
                  <div>
                    <h3 class="text-lg font-semibold">{{ member.name }}</h3>
                    <p class="text-muted-foreground">{{ member.role }}</p>
                  </div>
                  <p>{{ member.bio }}</p>
                  <a v-if="member.linkedin" :href="member.linkedin" target="_blank" class="text-primary hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Documents Tab -->
        <TabsContent value="documents">
          <div class="space-y-4">
            <!-- Pitch Deck -->
            <Card v-if="startup.pitchDeck">
              <CardContent class="pt-6">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-semibold">{{ startup.pitchDeck.name }}</h3>
                    <p class="text-muted-foreground">{{ startup.pitchDeck.slides }} slides • Updated {{ formatDate(startup.pitchDeck.lastUpdated) }}</p>
                  </div>
                  <Button>View Pitch Deck</Button>
                </div>
              </CardContent>
            </Card>

            <!-- Other Documents -->
            <Card v-for="doc in startup.documents" :key="doc.id">
              <CardContent class="pt-6">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-semibold">{{ doc.name }}</h3>
                    <p class="text-muted-foreground">{{ doc.type }} • {{ doc.size }} • Uploaded {{ formatDate(doc.uploadedAt) }}</p>
                  </div>
                  <div class="flex gap-2">
                    <Badge :variant="doc.status === 'approved' ? 'default' : 'secondary'">
                      {{ doc.status }}
                    </Badge>
                    <Button variant="outline">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Financials Tab -->
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <!-- Current Year -->
                <div>
                  <h3 class="text-lg font-semibold mb-4">{{ startup.financials.year }} Financials</h3>
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <p class="text-sm text-muted-foreground">Revenue</p>
                      <p class="text-xl font-bold">{{ formatCurrency(startup.financials.revenue) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Expenses</p>
                      <p class="text-xl font-bold">{{ formatCurrency(startup.financials.expenses) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Profit</p>
                      <p class="text-xl font-bold">{{ formatCurrency(startup.financials.profit) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Projections -->
                <div>
                  <h3 class="text-lg font-semibold mb-4">Financial Projections</h3>
                  <div class="space-y-4">
                    <div v-for="projection in startup.financials.projections" :key="projection.year" class="grid grid-cols-4 gap-4">
                      <div>
                        <p class="text-sm text-muted-foreground">Year</p>
                        <p class="font-medium">{{ projection.year }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Revenue</p>
                        <p class="font-medium">{{ formatCurrency(projection.revenue) }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Expenses</p>
                        <p class="font-medium">{{ formatCurrency(projection.expenses) }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Profit</p>
                        <p class="font-medium">{{ formatCurrency(projection.profit) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Timeline Tab -->
        <TabsContent value="timeline">
          <Card>
            <CardContent class="pt-6">
              <div class="space-y-4">
                <div v-for="event in startup.timeline" :key="event.date" class="flex gap-4">
                  <div class="w-24 flex-shrink-0">
                    <p class="text-sm font-medium">{{ formatDate(event.date) }}</p>
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ event.event }}</h3>
                    <p class="text-muted-foreground">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template> 