import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database - replace with real database operations
let portfolio = [
	{
		id: '1',
		organizationId: 'org-123',
		startupName: 'TechFlow Inc.',
		startupLogo: null,
		industry: 'SaaS',
		stage: 'series_a',
		investmentAmount: 250000,
		investmentDate: '2024-01-15T00:00:00Z',
		equityPercentage: 8.5,
		currentValue: 320000,
		status: 'active',
		lastUpdated: '2024-12-15T00:00:00Z',
		description: 'AI-powered workflow automation platform',
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-12-15T10:00:00Z'
	},
	{
		id: '2',
		organizationId: 'org-123',
		startupName: 'GreenEnergy Solutions',
		startupLogo: null,
		industry: 'CleanTech',
		stage: 'seed',
		investmentAmount: 150000,
		investmentDate: '2024-03-01T00:00:00Z',
		equityPercentage: 12.0,
		currentValue: 180000,
		status: 'active',
		lastUpdated: '2024-12-10T00:00:00Z',
		description: 'Renewable energy optimization software',
		createdAt: '2024-03-01T10:00:00Z',
		updatedAt: '2024-12-10T10:00:00Z'
	},
	{
		id: '3',
		organizationId: 'org-123',
		startupName: 'HealthTech Analytics',
		startupLogo: null,
		industry: 'HealthTech',
		stage: 'series_b',
		investmentAmount: 500000,
		investmentDate: '2024-06-15T00:00:00Z',
		equityPercentage: 6.8,
		currentValue: 650000,
		status: 'active',
		lastUpdated: '2024-12-12T00:00:00Z',
		description: 'Healthcare data analytics platform',
		createdAt: '2024-06-15T10:00:00Z',
		updatedAt: '2024-12-12T10:00:00Z'
	}
];

let pipeline = [
	{
		id: 'p1',
		organizationId: 'org-123',
		startupName: 'EduTech Platform',
		stage: 'due_diligence',
		proposedAmount: 200000,
		priority: 'high',
		lastUpdated: '2024-12-14T00:00:00Z',
		createdAt: '2024-12-01T10:00:00Z',
		updatedAt: '2024-12-14T10:00:00Z'
	},
	{
		id: 'p2',
		organizationId: 'org-123',
		startupName: 'Logistics AI',
		stage: 'initial_screening',
		proposedAmount: 400000,
		priority: 'medium',
		lastUpdated: '2024-12-13T00:00:00Z',
		createdAt: '2024-12-05T10:00:00Z',
		updatedAt: '2024-12-13T10:00:00Z'
	}
];

// GET /api/organizations/[orgId]/portfolio - Get portfolio and pipeline
export const GET: RequestHandler = async ({ params, locals, url }) => {
	try {
		const { orgId } = params;

		// In a real app, check if user has access to this organization
		// const hasAccess = await checkOrganizationAccess(locals.user.id, orgId);
		// if (!hasAccess) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		const search = url.searchParams.get('search');
		const stage = url.searchParams.get('stage');
		const type = url.searchParams.get('type'); // 'portfolio' or 'pipeline'

		let filteredPortfolio = portfolio.filter(inv => inv.organizationId === orgId);
		let filteredPipeline = pipeline.filter(deal => deal.organizationId === orgId);

		if (search) {
			filteredPortfolio = filteredPortfolio.filter(investment =>
				investment.startupName.toLowerCase().includes(search.toLowerCase()) ||
				investment.industry.toLowerCase().includes(search.toLowerCase()) ||
				investment.description.toLowerCase().includes(search.toLowerCase())
			);
			filteredPipeline = filteredPipeline.filter(deal =>
				deal.startupName.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (stage && stage !== 'all') {
			filteredPortfolio = filteredPortfolio.filter(investment => investment.stage === stage);
			filteredPipeline = filteredPipeline.filter(deal => deal.stage === stage);
		}

		// Calculate metrics
		const metrics = {
			totalInvested: filteredPortfolio.reduce((sum, inv) => sum + inv.investmentAmount, 0),
			currentValue: filteredPortfolio.reduce((sum, inv) => sum + inv.currentValue, 0),
			totalReturn: filteredPortfolio.reduce((sum, inv) => sum + (inv.currentValue - inv.investmentAmount), 0),
			activeInvestments: filteredPortfolio.filter(inv => inv.status === 'active').length,
			pipelineDeals: filteredPipeline.length,
			averageReturn: 0
		};

		if (metrics.totalInvested > 0) {
			metrics.averageReturn = (metrics.totalReturn / metrics.totalInvested) * 100;
		}

		return json({
			success: true,
			data: {
				portfolio: filteredPortfolio,
				pipeline: filteredPipeline,
				metrics
			}
		});
	} catch (err) {
		console.error('Error fetching portfolio:', err);
		return json({
			success: false,
			error: 'Failed to fetch portfolio'
		}, { status: 500 });
	}
};

// POST /api/organizations/[orgId]/portfolio - Add new investment
export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId } = params;
		const data = await request.json();

		// Validate required fields
		if (!data.startupName || !data.investmentAmount) {
			return json({
				success: false,
				error: 'Startup name and investment amount are required'
			}, { status: 400 });
		}

		// In a real app, check if user has permission to add investments
		// const hasPermission = await checkAddInvestmentPermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Generate investment ID
		const investmentId = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const newInvestment = {
			id: investmentId,
			organizationId: orgId,
			startupName: data.startupName,
			startupLogo: data.startupLogo || null,
			industry: data.industry || '',
			stage: data.stage || 'seed',
			investmentAmount: parseInt(data.investmentAmount),
			investmentDate: data.investmentDate || new Date().toISOString(),
			equityPercentage: parseFloat(data.equityPercentage) || 0,
			currentValue: parseInt(data.investmentAmount), // Start with invested amount
			status: 'active',
			lastUpdated: new Date().toISOString(),
			description: data.description || '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		portfolio.push(newInvestment);

		return json({
			success: true,
			data: newInvestment
		}, { status: 201 });
	} catch (err) {
		console.error('Error adding investment:', err);
		return json({
			success: false,
			error: 'Failed to add investment'
		}, { status: 500 });
	}
};
