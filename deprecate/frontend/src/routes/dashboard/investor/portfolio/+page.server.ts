import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // In a real application, these would be API calls to your backend
  // For now, we'll simulate the data
  
  // Fetch investment data
  const investments = [
    {
      id: 1,
      company: "TechFlow AI",
      date: "2022-03-15",
      amount: 50000,
      currentValue: 65000,
      roi: 30,
      stage: "Seed",
      riskLevel: "High"
    },
    {
      id: 2,
      company: "HealthNova",
      date: "2022-05-20",
      amount: 75000,
      currentValue: 95000,
      roi: 26.7,
      stage: "Series A",
      riskLevel: "Medium"
    },
    {
      id: 3,
      company: "FinLeap",
      date: "2022-08-10",
      amount: 60000,
      currentValue: 66000,
      roi: 10,
      stage: "Seed",
      riskLevel: "Medium"
    },
    {
      id: 4,
      company: "GreenScale",
      date: "2023-01-05",
      amount: 40000,
      currentValue: 38000,
      roi: -5,
      stage: "Pre-seed",
      riskLevel: "High"
    },
    {
      id: 5,
      company: "DataMesh",
      date: "2023-02-28",
      amount: 80000,
      currentValue: 94000,
      roi: 17.5,
      stage: "Series A",
      riskLevel: "Low"
    },
    {
      id: 6,
      company: "CloudSecure",
      date: "2023-05-12",
      amount: 45000,
      currentValue: 52000,
      roi: 15.6,
      stage: "Seed",
      riskLevel: "Medium"
    },
    {
      id: 7,
      company: "EcoSolutions",
      date: "2023-07-20",
      amount: 55000,
      currentValue: 60000,
      roi: 9.1,
      stage: "Seed",
      riskLevel: "Low"
    }
  ];

  // Fetch document data
  const documents = [
    {
      id: 1,
      title: "Investment Agreement",
      company: "TechFlow AI",
      type: "contract",
      description: "Initial investment terms and conditions",
      dateAdded: "2022-03-15",
      url: "/documents/techflow-agreement.pdf"
    },
    {
      id: 2,
      title: "Financial Projections",
      company: "HealthNova",
      type: "spreadsheet",
      description: "Five-year financial forecasts",
      dateAdded: "2022-05-22",
      url: "/documents/healthnova-projections.xlsx"
    },
    {
      id: 3,
      title: "Product Roadmap",
      company: "FinLeap",
      type: "presentation",
      description: "Product development timeline and milestones",
      dateAdded: "2022-08-15",
      url: "/documents/finleap-roadmap.pptx"
    },
    {
      id: 4,
      title: "Due Diligence Report",
      company: "GreenScale",
      type: "pdf",
      description: "Comprehensive analysis of technology and market",
      dateAdded: "2023-01-03",
      url: "/documents/greenscale-dd.pdf"
    },
    {
      id: 5,
      title: "Term Sheet",
      company: "DataMesh",
      type: "contract",
      description: "Key terms for the investment round",
      dateAdded: "2023-02-25",
      url: "/documents/datamesh-termsheet.pdf"
    },
    {
      id: 6,
      title: "Legal Review",
      company: "CloudSecure",
      type: "pdf",
      description: "Legal assessment of intellectual property",
      dateAdded: "2023-05-10",
      url: "/documents/cloudsecure-legal.pdf"
    }
  ];
  
  // Fetch metrics data
  const metrics = {
    overallROI: 18.5,
    bestPerformer: "HealthNova",
    bestPerformerROI: 26.7,
    averageAnnualReturn: 15.2,
    benchmarkComparison: 4.3 // Outperforming benchmark by 4.3%
  };

  // Fetch exit plan data
  const exitPlan = {
    potentialExits: [
      {
        company: "TechFlow AI",
        potentialValue: 250000,
        expectedROI: 400,
        timeline: "3-4 years",
        likelihood: "Medium",
        exitType: "Acquisition",
        readiness: 45
      },
      {
        company: "HealthNova",
        potentialValue: 450000,
        expectedROI: 500,
        timeline: "2-3 years",
        likelihood: "High",
        exitType: "Acquisition",
        readiness: 70
      },
      {
        company: "FinLeap",
        potentialValue: 180000,
        expectedROI: 200,
        timeline: "4-5 years",
        likelihood: "Medium",
        exitType: "IPO",
        readiness: 30
      }
    ],
    scenarios: [
      {
        name: "Conservative",
        timeline: "5+ years",
        returnMultiple: 2.5,
        probability: 60
      },
      {
        name: "Base Case",
        timeline: "3-5 years",
        returnMultiple: 4.0,
        probability: 30
      },
      {
        name: "Optimistic",
        timeline: "2-3 years",
        returnMultiple: 6.0,
        probability: 10
      }
    ]
  };

  // Fetch risk assessment data
  const riskAssessment = {
    highRiskAllocation: 30.0,
    mediumRiskAllocation: 45.5,
    lowRiskAllocation: 24.5,
    sectorDiversification: {
      "Technology": 40.5,
      "Healthcare": 25.0,
      "Fintech": 15.5,
      "Green Energy": 12.0,
      "Consumer": 7.0
    },
    riskFactors: [
      {
        name: "Market Competition",
        impactLevel: "High",
        description: "Increased competition in AI sector could impact growth trajectory of TechFlow AI",
        mitigationStrategy: "Focus on unique IP and building strategic partnerships"
      },
      {
        name: "Regulatory Changes",
        impactLevel: "Medium",
        description: "Potential healthcare regulations affecting HealthNova's go-to-market strategy",
        mitigationStrategy: "Maintain active dialogue with regulatory bodies and build compliance buffer into timeline"
      },
      {
        name: "Technical Execution",
        impactLevel: "Medium",
        description: "Development challenges in scaling FinLeap's platform to enterprise level",
        mitigationStrategy: "Regular technical reviews and milestone-based funding approach"
      },
      {
        name: "Funding Environment",
        impactLevel: "Low",
        description: "Changes in the funding landscape affecting follow-on rounds",
        mitigationStrategy: "Extend runway through revenue growth and maintain relationships with multiple investors"
      },
      {
        name: "Economic Downturn",
        impactLevel: "High",
        description: "Potential recession impacting growth and future funding rounds",
        mitigationStrategy: "Focus on path to profitability and maintaining adequate cash reserves"
      },
      {
        name: "Talent Retention",
        impactLevel: "Medium",
        description: "Loss of key talent in competitive job market",
        mitigationStrategy: "Ensure proper equity incentives and competitive compensation packages"
      }
    ]
  };

  return {
    investments,
    documents,
    metrics,
    exitPlan,
    riskAssessment
  };
}; 