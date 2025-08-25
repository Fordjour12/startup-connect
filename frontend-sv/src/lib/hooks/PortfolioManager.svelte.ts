export class PortfolioManager {
	investments = $state<any[]>([]);
	documents = $state<any[]>([]);
	metrics = $state<any>({});
	exitPlan = $state<any>({});
	riskAssessment = $state<any>({});

	updateInvestment(investment: any) {
		const index = this.investments.findIndex(inv => inv.id === investment.id);
		if (index !== -1) {
			this.investments[index] = investment;
		} else {
			this.investments.push(investment);
		}
	}

	removeInvestment(id: string) {
		this.investments = this.investments.filter(inv => inv.id !== id);
	}

	addDocument(document: any) {
		this.documents.push(document);
	}

	updateMetrics(newMetrics: any) {
		this.metrics = { ...this.metrics, ...newMetrics };
	}

	updateExitPlan(plan: any) {
		this.exitPlan = plan;
	}

	updateRiskAssessment(assessment: any) {
		this.riskAssessment = assessment;
	}
}

export const portfolioManager = new PortfolioManager();
