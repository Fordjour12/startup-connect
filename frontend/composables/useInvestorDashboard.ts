import { computed, ref } from 'vue'
import { useInvestor } from './useInvestor'

export interface DashboardMetrics {
  totalInvestments: number
  activeInvestments: number
  totalPortfolioValue: number
  averageROI: number
  recentActivity: {
    type: 'investment' | 'match' | 'update'
    title: string
    date: string
    details: string
  }[]
}

export interface InvestmentTrend {
  date: string
  amount: number
  count: number
}

export const useInvestorDashboard = () => {
  const { investor, portfolio, matchedStartups, isLoading, error, fetchInvestor, fetchPortfolio, fetchMatchedStartups } = useInvestor()
  
  const metrics = ref<DashboardMetrics>({
    totalInvestments: 0,
    activeInvestments: 0,
    totalPortfolioValue: 0,
    averageROI: 0,
    recentActivity: []
  })

  const investmentTrends = ref<InvestmentTrend[]>([])
  const selectedTimeRange = ref<'week' | 'month' | 'year'>('month')
  const selectedMetric = ref<'amount' | 'count'>('amount')

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchInvestor(),
      fetchPortfolio(),
      fetchMatchedStartups()
    ])
    updateMetrics()
    fetchInvestmentTrends()
  }

  const updateMetrics = () => {
    if (!portfolio.value) return

    metrics.value = {
      totalInvestments: portfolio.value.totalInvestments,
      activeInvestments: portfolio.value.activeInvestments,
      totalPortfolioValue: portfolio.value.totalValue,
      averageROI: portfolio.value.investments.reduce((acc, inv) => acc + inv.roi, 0) / portfolio.value.investments.length,
      recentActivity: generateRecentActivity()
    }
  }

  const generateRecentActivity = () => {
    const activities = []

    // Add recent investments
    if (portfolio.value) {
      portfolio.value.investments
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .forEach(inv => {
          activities.push({
            type: 'investment',
            title: `Invested in ${inv.company}`,
            date: new Date(inv.date).toISOString(),
            details: `Amount: $${inv.amount.toLocaleString()}`
          })
        })
    }

    // Add recent matches
    matchedStartups.value
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
      .forEach(startup => {
        activities.push({
          type: 'match',
          title: `New match: ${startup.name}`,
          date: new Date().toISOString(),
          details: `Match score: ${startup.matchScore}%`
        })
      })

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const fetchInvestmentTrends = async () => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/investor/trends?timeRange=${selectedTimeRange.value}`)
    const data = await response.json()
    investmentTrends.value = data
  }

  const updateTimeRange = (range: 'week' | 'month' | 'year') => {
    selectedTimeRange.value = range
    fetchInvestmentTrends()
  }

  const updateMetric = (metric: 'amount' | 'count') => {
    selectedMetric.value = metric
  }

  const topPerformingInvestments = computed(() => {
    if (!portfolio.value) return []
    return [...portfolio.value.investments]
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5)
  })

  const recentMatches = computed(() => {
    return [...matchedStartups.value]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
  })

  return {
    metrics,
    investmentTrends,
    selectedTimeRange,
    selectedMetric,
    topPerformingInvestments,
    recentMatches,
    isLoading,
    error,
    fetchDashboardData,
    updateTimeRange,
    updateMetric
  }
} 