export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface State {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  ready: boolean;
}
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


export interface Startup {
  name: string;
  description: string;
  industry: string;
  location: string;
  funding_stage: string;
  funding_goal: number;
  founded_year: string;
  team_size: number;
  website: string;
  logo_url: string;
  pitch_deck_url: string;
  business_model: string;
  target_market: string;
  competitors: string;
  id: string;
  founder_id: string;
  team_members: {
    "additionalProp1": {}
  },
  funding: {
    "additionalProp1": {}
  },
  metrics: {
    "additionalProp1": {}
  },
  social_media: {
    "additionalProp1": {}
  },
  contact: {
    "additionalProp1": {}
  },
  traction: {
    "additionalProp1": {}
  },
  use_of_funds: {
    "additionalProp1": {}
  },
  timeline: {
    "additionalProp1": {}
  }
}