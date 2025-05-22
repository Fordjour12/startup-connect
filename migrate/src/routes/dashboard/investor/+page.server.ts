import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // In a real application, these would be API calls to your backend
  // For now, we'll simulate the data
  
  // Fetch portfolio data
  const portfolioData = {
    totalInvested: 250000,
    currentValue: 320000,
    returns: 28,
    allocation: {
      tech: 40,
      health: 25,
      fintech: 20,
      consumer: 15
    },
    historicalValues: [250000, 255000, 248000, 260000, 275000, 290000, 285000, 305000, 310000, 320000]
  };

  // Fetch recent activity
  const recentActivity = [
    { 
      id: 1, 
      type: "investment", 
      company: "TechFlow AI", 
      amount: 50000, 
      date: "2023-10-15",
      status: "completed"
    },
    { 
      id: 2, 
      type: "funding_round", 
      company: "HealthNova", 
      round: "Series A", 
      participation: true,
      date: "2023-10-08"
    },
    { 
      id: 3, 
      type: "valuation_update", 
      company: "FinLeap", 
      newValuation: "4.2M",
      previousValuation: "3.5M", 
      date: "2023-09-30"
    },
    { 
      id: 4, 
      type: "exit_opportunity", 
      company: "GreenScale", 
      potential: "High",
      date: "2023-09-22"
    }
  ];

  // Fetch watchlist alerts
  const watchlistAlerts = [
    {
      id: 1,
      company: "DataMesh",
      alert: "Reached milestone: $1M ARR",
      date: "2023-10-14",
      priority: "high"
    },
    {
      id: 2,
      company: "EcoSolutions",
      alert: "New funding round opening",
      date: "2023-10-12",
      priority: "medium"
    },
    {
      id: 3,
      company: "ArtificialMinds",
      alert: "Released new product",
      date: "2023-10-10",
      priority: "medium"
    },
    {
      id: 4,
      company: "CloudSecure",
      alert: "Featured in TechCrunch",
      date: "2023-10-05",
      priority: "low"
    }
  ];

  // Fetch upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Pitch Day: AI Startups",
      date: "2023-10-25",
      time: "10:00 AM",
      location: "Virtual",
      type: "pitch"
    },
    {
      id: 2,
      title: "Meeting with HealthNova Founders",
      date: "2023-10-28",
      time: "2:00 PM",
      location: "Office",
      type: "meeting"
    },
    {
      id: 3,
      title: "Q3 Portfolio Review",
      date: "2023-11-05",
      time: "9:00 AM",
      location: "Conference Room A",
      type: "internal"
    },
    {
      id: 4,
      title: "Tech Startup Conference",
      date: "2023-11-10",
      time: "All day",
      location: "Convention Center",
      type: "conference"
    }
  ];

  // Fetch market insights
  const marketInsights = [
    {
      id: 1,
      title: "AI Startup Funding Increased by 35% in Q3",
      source: "TechCrunch",
      date: "2023-10-13"
    },
    {
      id: 2,
      title: "Healthcare Innovations Leading Seed Rounds",
      source: "VentureBeat",
      date: "2023-10-10"
    },
    {
      id: 3,
      title: "Average Seed Valuations Down 5% in Current Quarter",
      source: "PitchBook",
      date: "2023-10-08"
    },
    {
      id: 4,
      title: "Sustainable Tech Seeing Surge in Corporate Investment",
      source: "Forbes",
      date: "2023-10-05"
    }
  ];

  return {
    portfolioData,
    recentActivity,
    watchlistAlerts,
    upcomingEvents,
    marketInsights
  };
};