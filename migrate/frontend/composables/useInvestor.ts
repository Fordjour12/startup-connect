import { ref } from 'vue'

export interface InvestmentHistory {
  company: string
  amount: number
  date: string
  stage: string
  status: 'active' | 'exited' | 'failed'
}

export interface InvestmentPreferences {
  industries: string[]
  stages: string[]
  regions: string[]
  minInvestment: number
  maxInvestment: number
  preferredMetrics: string[]
}

export interface Investor {
  id: string
  name: string
  email: string
  bio: string
  company: string
  position: string
  location: string
  website: string
  linkedin: string
  twitter: string
  investmentHistory: InvestmentHistory[]
  expertise: string[]
  preferences: InvestmentPreferences
}

export interface Portfolio {
  totalInvestments: number
  activeInvestments: number
  totalValue: number
  investments: {
    id: string
    company: string
    stage: string
    amount: number
    currentValue: number
    roi: number
  }[]
}

export interface MatchedStartup {
  id: string
  name: string
  industry: string
  stage: string
  location: string
  fundingNeeded: number
  description: string
  matchScore: number
}

export const useInvestor = () => {
  const investor = ref<Investor | null>(null)
  const portfolio = ref<Portfolio | null>(null)
  const matchedStartups = ref<MatchedStartup[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchInvestor = async () => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/investor/profile')
      const data = await response.json()
      investor.value = data
    } catch (e) {
      error.value = 'Failed to fetch investor data'
    } finally {
      isLoading.value = false
    }
  }

  const updateInvestor = async (investorData: Partial<Investor>) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/investor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      })
      const data = await response.json()
      investor.value = { ...investor.value, ...data } as Investor
      return true
    } catch (e) {
      error.value = 'Failed to update investor data'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (preferences: InvestmentPreferences) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/investor/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })
      const data = await response.json()
      if (investor.value) {
        investor.value.preferences = data
      }
      return true
    } catch (e) {
      error.value = 'Failed to update preferences'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchPortfolio = async () => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/investor/portfolio')
      const data = await response.json()
      portfolio.value = data
    } catch (e) {
      error.value = 'Failed to fetch portfolio data'
    } finally {
      isLoading.value = false
    }
  }

  const fetchMatchedStartups = async () => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/investor/matches')
      const data = await response.json()
      matchedStartups.value = data
    } catch (e) {
      error.value = 'Failed to fetch matched startups'
    } finally {
      isLoading.value = false
    }
  }

  return {
    investor,
    portfolio,
    matchedStartups,
    isLoading,
    error,
    fetchInvestor,
    updateInvestor,
    updatePreferences,
    fetchPortfolio,
    fetchMatchedStartups,
  }
} 