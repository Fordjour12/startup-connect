// Portfolio Manager State Machine
// Manages the state and operations for investor portfolio


// Define types for the portfolio data
export interface Investment {
  id: number;
  company: string;
  date: string;
  amount: number;
  currentValue: number;
  roi: number;
  stage: string;
  riskLevel: string;
}

export interface Document {
  id: number;
  title: string;
  company: string;
  type: string;
  description: string;
  dateAdded: string;
  url: string;
}

export interface Metrics {
  overallROI: number;
  bestPerformer: string;
  bestPerformerROI: number;
  averageAnnualReturn: number;
  benchmarkComparison: number;
}

export interface ExitPlan {
  potentialExits: PotentialExit[];
  scenarios: ExitScenario[];
}

export interface PotentialExit {
  company: string;
  potentialValue: number;
  expectedROI: number;
  timeline: string;
  likelihood: string;
  exitType: string;
  readiness: number;
}

export interface ExitScenario {
  name: string;
  timeline: string;
  returnMultiple: number;
  probability: number;
}

export interface RiskAssessment {
  highRiskAllocation: number;
  mediumRiskAllocation: number;
  lowRiskAllocation: number;
  sectorDiversification: Record<string, number>;
  riskFactors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  impactLevel: string;
  description: string;
  mitigationStrategy: string;
}

// Portfolio Manager class
class PortfolioManager {
  // State using Svelte 5 runes
  investments = $state<Investment[]>([]);
  documents = $state<Document[]>([]);
  metrics = $state<Metrics>({
    overallROI: 0,
    bestPerformer: "",
    bestPerformerROI: 0,
    averageAnnualReturn: 0,
    benchmarkComparison: 0
  });
  exitPlan = $state<ExitPlan>({
    potentialExits: [],
    scenarios: []
  });
  riskAssessment = $state<RiskAssessment>({
    highRiskAllocation: 0,
    mediumRiskAllocation: 0,
    lowRiskAllocation: 0,
    sectorDiversification: {},
    riskFactors: []
  });
  isLoading = $state(false);
  error = $state<string | null>(null);

  // Fetch portfolio data from the server
  async loadPortfolio() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const response = await fetch('/api/investor/portfolio');
      if (!response.ok) {
        throw new Error('Failed to load portfolio data');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      this.investments = data.investments;
      this.documents = data.documents;
      this.metrics = data.metrics;
      this.exitPlan = data.exitPlan;
      this.riskAssessment = data.riskAssessment;
      
      // Calculate derived metrics
      this.calculateMetrics();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error loading portfolio:', err);
    } finally {
      this.isLoading = false;
    }
  }
  
  // Calculate metrics based on investment data
  calculateMetrics() {
    if (this.investments.length === 0) return;
    
    // Calculate overall ROI
    const totalInvested = this.investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCurrentValue = this.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const overallROI = ((totalCurrentValue - totalInvested) / totalInvested) * 100;
    
    // Find best performer
    const bestPerformer = [...this.investments].sort((a, b) => b.roi - a.roi)[0];
    
    // Calculate average annual return (simplified - would normally consider time period)
    const totalROI = this.investments.reduce((sum, inv) => sum + inv.roi, 0);
    const averageAnnualReturn = totalROI / this.investments.length;
    
    // Update metrics
    this.metrics = {
      ...this.metrics,
      overallROI,
      bestPerformer: bestPerformer?.company || '',
      bestPerformerROI: bestPerformer?.roi || 0,
      averageAnnualReturn
    };
  }
  
  // Add a new investment
  addInvestment(investment: Omit<Investment, 'id' | 'roi'>) {
    // In a real app, this would call an API to persist data
    const newId = this.investments.length > 0 
      ? Math.max(...this.investments.map(inv => inv.id)) + 1 
      : 1;
    
    const roi = ((investment.currentValue - investment.amount) / investment.amount) * 100;
    
    const newInvestment: Investment = {
      id: newId,
      roi,
      ...investment
    };
    
    this.investments = [...this.investments, newInvestment];
    this.calculateMetrics();
    this.recalculateRiskAllocation();
  }
  
  // Update an existing investment
  updateInvestment(id: number, updates: Partial<Omit<Investment, 'id'>>) {
    const index = this.investments.findIndex(inv => inv.id === id);
    if (index === -1) return;
    
    const updatedInvestment = { ...this.investments[index], ...updates };
    
    // Recalculate ROI if amount or currentValue has changed
    if (updates.amount || updates.currentValue) {
      updatedInvestment.roi = ((updatedInvestment.currentValue - updatedInvestment.amount) / updatedInvestment.amount) * 100;
    }
    
    this.investments = [
      ...this.investments.slice(0, index),
      updatedInvestment,
      ...this.investments.slice(index + 1)
    ];
    
    this.calculateMetrics();
    this.recalculateRiskAllocation();
  }
  
  // Add a new document
  addDocument(document: Omit<Document, 'id'>) {
    const newId = this.documents.length > 0 
      ? Math.max(...this.documents.map(doc => doc.id)) + 1 
      : 1;
    
    const newDocument: Document = {
      id: newId,
      ...document
    };
    
    this.documents = [...this.documents, newDocument];
  }
  
  // Recalculate risk allocation after investments change
  recalculateRiskAllocation() {
    const totalValue = this.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    // Calculate risk allocation
    const highRiskValue = this.investments
      .filter(inv => inv.riskLevel.toLowerCase() === 'high')
      .reduce((sum, inv) => sum + inv.currentValue, 0);
      
    const mediumRiskValue = this.investments
      .filter(inv => inv.riskLevel.toLowerCase() === 'medium')
      .reduce((sum, inv) => sum + inv.currentValue, 0);
      
    const lowRiskValue = this.investments
      .filter(inv => inv.riskLevel.toLowerCase() === 'low')
      .reduce((sum, inv) => sum + inv.currentValue, 0);
    
    this.riskAssessment = {
      ...this.riskAssessment,
      highRiskAllocation: (highRiskValue / totalValue) * 100,
      mediumRiskAllocation: (mediumRiskValue / totalValue) * 100,
      lowRiskAllocation: (lowRiskValue / totalValue) * 100
    };
  }
  
  // Run exit simulation with custom parameters
  runExitSimulation(params: { 
    timeframe: number; 
    growthRate: number; 
    exitMultiple: number;
  }) {
    // This would typically involve more complex calculations
    // based on the current portfolio and provided parameters
    
    // For demo purposes, we're just adding a new scenario
    const newScenario: ExitScenario = {
      name: `Custom Scenario (${new Date().toLocaleDateString()})`,
      timeline: `${params.timeframe} years`,
      returnMultiple: params.exitMultiple,
      probability: 50 // Default probability for custom scenarios
    };
    
    this.exitPlan = {
      ...this.exitPlan,
      scenarios: [...this.exitPlan.scenarios, newScenario]
    };
    
    return newScenario;
  }
}

// Export a singleton instance of the Portfolio Manager
export const portfolioManager = new PortfolioManager(); 