<template>
  <div class="p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Investments"
          :value="metrics.totalInvestments"
          icon="chart-bar"
        />
        <MetricCard
          title="Active Investments"
          :value="metrics.activeInvestments"
          icon="chart-line"
        />
        <MetricCard
          title="Portfolio Value"
          :value="`$${metrics.totalPortfolioValue.toLocaleString()}`"
          icon="wallet"
        />
        <MetricCard
          title="Average ROI"
          :value="`${metrics.averageROI.toFixed(1)}%`"
          icon="trending-up"
        />
      </div>

      <!-- Investment Trends -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Investment Trends</h2>
          <div class="flex space-x-2">
            <button
              v-for="range in ['week', 'month', 'year']"
              :key="range"
              :class="[
                'px-3 py-1 rounded',
                selectedTimeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="updateTimeRange(range as 'week' | 'month' | 'year')"
            >
              {{ range.charAt(0).toUpperCase() + range.slice(1) }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <LineChart
            :data="investmentTrends"
            :metric="selectedMetric"
            :timeRange="selectedTimeRange"
          />
        </div>
      </div>

      <!-- Recent Activity and Top Investments -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div
              v-for="activity in metrics.recentActivity"
              :key="activity.date"
              class="flex items-start space-x-4"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full mt-2',
                  activity.type === 'investment'
                    ? 'bg-green-500'
                    : activity.type === 'match'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
                ]"
              ></div>
              <div>
                <p class="font-medium">{{ activity.title }}</p>
                <p class="text-sm text-gray-600">{{ activity.details }}</p>
                <p class="text-xs text-gray-500">
                  {{ new Date(activity.date).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performing Investments -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Top Performing Investments</h2>
          <div class="space-y-4">
            <div
              v-for="investment in topPerformingInvestments"
              :key="investment.id"
              class="flex justify-between items-center"
            >
              <div>
                <p class="font-medium">{{ investment.company }}</p>
                <p class="text-sm text-gray-600">
                  Invested: ${{ investment.amount.toLocaleString() }}
                </p>
              </div>
              <div class="text-right">
                <p
                  :class="[
                    'font-medium',
                    investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ investment.roi.toFixed(1) }}% ROI
                </p>
                <p class="text-sm text-gray-600">
                  {{ new Date(investment.date).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import LineChart from '@/components/ui/LineChart.vue'
// import MetricCard from '@/components/ui/MetricCard.vue'
import { useInvestorDashboard } from '@/composables/useInvestorDashboard'

const {
  metrics,
  investmentTrends,
  selectedTimeRange,
  selectedMetric,
  topPerformingInvestments,
  isLoading,
  error,
  fetchDashboardData,
  updateTimeRange,
  // updateMetric
} = useInvestorDashboard()

onMounted(() => {
  fetchDashboardData()
})
</script> 