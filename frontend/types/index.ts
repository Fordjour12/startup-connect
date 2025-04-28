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

export interface Investment {
  id: string
  company: string
  amount: number
  date: string
  roi: number
  status: 'active' | 'completed' | 'pending'
}

export interface MatchedStartup {
  id: string
  name: string
  matchScore: number
  industry: string
  stage: string
  description: string
} 