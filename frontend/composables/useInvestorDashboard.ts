import { computed, ref } from 'vue'
import type { DashboardMetrics, InvestmentTrend } from '~/types'

export function useInvestorDashboard() {
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
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const topPerformingInvestments = computed(() => {
    // This would be populated from the server response
    return []
  })

  async function fetchDashboardData() {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await useFetch('/api/investor/dashboard', {
        query: {
          timeRange: selectedTimeRange.value
        }
      })

      if (data.value) {
        metrics.value = data.value.metrics
        investmentTrends.value = data.value.trends
      }
    } catch (err) {
      error.value = 'Failed to fetch dashboard data'
      console.error('Error fetching dashboard data:', err)
    } finally {
      isLoading.value = false
    }
  }

  function updateTimeRange(range: 'week' | 'month' | 'year') {
    selectedTimeRange.value = range
    fetchDashboardData()
  }

  return {
    metrics,
    investmentTrends,
    selectedTimeRange,
    selectedMetric,
    topPerformingInvestments,
    isLoading,
    error,
    fetchDashboardData,
    updateTimeRange
  }
} 