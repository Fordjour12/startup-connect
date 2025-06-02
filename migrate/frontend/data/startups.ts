export interface Startup {
  id: number
  name: string
  description: string
  industry: string
  location: string
  fundingStage: string
  logo: string
  foundedYear: number
  teamSize: number
  website: string
  funding: {
    total: string
    lastRound: string
    investors: string[]
  }
  metrics: {
    revenue: string
    growth: string
    customers: string
  }
}

export const startups: Startup[] = [
  {
    id: 1,
    name: 'TechFlow',
    description: 'Revolutionary AI-powered workflow automation platform for enterprises. Our platform helps businesses streamline their operations, reduce costs, and increase productivity through intelligent automation and machine learning.',
    industry: 'Technology',
    location: 'San Francisco',
    fundingStage: 'Series A',
    logo: 'https://picsum.photos/200',
    foundedYear: 2020,
    teamSize: 25,
    website: 'https://techflow.example.com',
    funding: {
      total: '$5M',
      lastRound: 'Series A',
      investors: ['Sequoia Capital', 'Andreessen Horowitz', 'Y Combinator']
    },
    metrics: {
      revenue: '$2M ARR',
      growth: '300% YoY',
      customers: '50+ Enterprise Clients'
    }
  },
  {
    id: 2,
    name: 'HealthTech Solutions',
    description: 'Innovative healthcare management system using blockchain technology.',
    industry: 'Healthcare',
    location: 'New York',
    fundingStage: 'Seed',
    logo: 'https://picsum.photos/201',
    foundedYear: 2021,
    teamSize: 15,
    website: 'https://healthtech.example.com',
    funding: {
      total: '$2M',
      lastRound: 'Seed',
      investors: ['First Round Capital', 'Founders Fund']
    },
    metrics: {
      revenue: '$500K ARR',
      growth: '200% YoY',
      customers: '20+ Healthcare Providers'
    }
  },
  {
    id: 3,
    name: 'FinWise',
    description: 'Next-generation financial planning and investment platform.',
    industry: 'Fintech',
    location: 'London',
    fundingStage: 'Series B',
    logo: 'https://picsum.photos/202',
    foundedYear: 2019,
    teamSize: 35,
    website: 'https://finwise.example.com',
    funding: {
      total: '$10M',
      lastRound: 'Series B',
      investors: ['Accel', 'Index Ventures', 'Balderton Capital']
    },
    metrics: {
      revenue: '$5M ARR',
      growth: '400% YoY',
      customers: '100+ Financial Institutions'
    }
  },
  {
    id: 4,
    name: 'EcoEnergy',
    description: 'Sustainable energy solutions for residential and commercial buildings.',
    industry: 'Clean Energy',
    location: 'Berlin',
    fundingStage: 'Pre-seed',
    logo: 'https://picsum.photos/203',
    foundedYear: 2022,
    teamSize: 8,
    website: 'https://ecoenergy.example.com',
    funding: {
      total: '$500K',
      lastRound: 'Pre-seed',
      investors: ['Climate Tech Fund', 'Green Ventures']
    },
    metrics: {
      revenue: '$100K ARR',
      growth: '150% YoY',
      customers: '10+ Commercial Buildings'
    }
  }
]

// Helper functions for filtering and querying
export const getStartupById = (id: number): Startup | undefined => {
  return startups.find(startup => startup.id === id)
}

export const getStartupsByIndustry = (industry: string): Startup[] => {
  return startups.filter(startup => startup.industry === industry)
}

export const getStartupsByLocation = (location: string): Startup[] => {
  return startups.filter(startup => startup.location === location)
}

export const getStartupsByFundingStage = (stage: string): Startup[] => {
  return startups.filter(startup => startup.fundingStage === stage)
}

export const searchStartups = (query: string): Startup[] => {
  const lowerQuery = query.toLowerCase()
  return startups.filter(startup => 
    startup.name.toLowerCase().includes(lowerQuery) ||
    startup.description.toLowerCase().includes(lowerQuery)
  )
} 