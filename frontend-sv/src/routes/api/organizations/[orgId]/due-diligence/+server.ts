import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DUE_DILIGENCE_STATUS } from '$lib/db/schema';

// Mock database - replace with real database operations
let dueDiligenceProjects = [
	{
		id: 'dd-1',
		organizationId: 'org-123',
		startupName: 'EduTech Platform',
		startupId: 'startup-1',
		assignedTo: 'user-2',
		assigneeName: 'Sarah Johnson',
		status: DUE_DILIGENCE_STATUS.IN_PROGRESS,
		priority: 'high',
		startDate: '2024-12-10T00:00:00Z',
		dueDate: '2024-12-24T00:00:00Z',
		completedDate: null,
		recommendation: null,
		confidence: null,
		summary: null,
		checklist: {
			financials: { completed: true, notes: 'Financials look strong', documents: ['fin_report.pdf'] },
			market: { completed: true, notes: 'Market opportunity validated', documents: ['market_analysis.pdf'] },
			team: { completed: false, notes: 'Need to verify team background', documents: [] },
			technology: { completed: true, notes: 'Tech stack is solid', documents: ['tech_due_diligence.pdf'] },
			legal: { completed: false, notes: 'IP review pending', documents: [] },
			competitive: { completed: true, notes: 'Competitive advantage clear', documents: ['competitor_analysis.pdf'] }
		},
		progress: 67,
		createdAt: '2024-12-01T10:00:00Z',
		updatedAt: '2024-12-15T10:00:00Z'
	},
	{
		id: 'dd-2',
		organizationId: 'org-123',
		startupName: 'Logistics AI',
		startupId: 'startup-2',
		assignedTo: 'user-3',
		assigneeName: 'Mike Chen',
		status: DUE_DILIGENCE_STATUS.PENDING,
		priority: 'medium',
		startDate: null,
		dueDate: null,
		completedDate: null,
		recommendation: null,
		confidence: null,
		summary: null,
		checklist: {
			financials: { completed: false, notes: '', documents: [] },
			market: { completed: false, notes: '', documents: [] },
			team: { completed: false, notes: '', documents: [] },
			technology: { completed: false, notes: '', documents: [] },
			legal: { completed: false, notes: '', documents: [] },
			competitive: { completed: false, notes: '', documents: [] }
		},
		progress: 0,
		createdAt: '2024-12-05T10:00:00Z',
		updatedAt: '2024-12-05T10:00:00Z'
	},
	{
		id: 'dd-3',
		organizationId: 'org-123',
		startupName: 'Retail Analytics',
		startupId: 'startup-3',
		assignedTo: 'user-4',
		assigneeName: 'Emily Rodriguez',
		status: DUE_DILIGENCE_STATUS.COMPLETED,
		priority: 'high',
		startDate: '2024-11-15T00:00:00Z',
		dueDate: '2024-12-01T00:00:00Z',
		completedDate: '2024-11-28T00:00:00Z',
		recommendation: 'invest',
		confidence: 'high',
		summary: 'Strong fundamentals with clear market opportunity. Recommended for investment.',
		checklist: {
			financials: { completed: true, notes: 'Revenue growing 40% YoY', documents: ['financials.pdf'] },
			market: { completed: true, notes: 'Market size: $50B by 2027', documents: ['market_report.pdf'] },
			team: { completed: true, notes: 'Experienced founding team', documents: ['team_background.pdf'] },
			technology: { completed: true, notes: 'Proprietary ML algorithms', documents: ['tech_review.pdf'] },
			legal: { completed: true, notes: 'All IP secured', documents: ['legal_review.pdf'] },
			competitive: { completed: true, notes: 'First mover advantage', documents: ['competitive_analysis.pdf'] }
		},
		progress: 100,
		createdAt: '2024-11-10T10:00:00Z',
		updatedAt: '2024-11-28T10:00:00Z'
	}
];

// GET /api/organizations/[orgId]/due-diligence - Get all due diligence projects
export const GET: RequestHandler = async ({ params, locals, url }) => {
	try {
		const { orgId } = params;

		// In a real app, check if user has access to this organization
		// const hasAccess = await checkOrganizationAccess(locals.user.id, orgId);
		// if (!hasAccess) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		const search = url.searchParams.get('search');
		const status = url.searchParams.get('status');
		const priority = url.searchParams.get('priority');

		let filteredProjects = dueDiligenceProjects.filter(project => project.organizationId === orgId);

		if (search) {
			filteredProjects = filteredProjects.filter(project =>
				project.startupName.toLowerCase().includes(search.toLowerCase()) ||
				project.assigneeName.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (status && status !== 'all') {
			filteredProjects = filteredProjects.filter(project => project.status === status);
		}

		if (priority && priority !== 'all') {
			filteredProjects = filteredProjects.filter(project => project.priority === priority);
		}

		// Calculate statistics
		const stats = {
			total: dueDiligenceProjects.filter(p => p.organizationId === orgId).length,
			pending: dueDiligenceProjects.filter(p => p.organizationId === orgId && p.status === DUE_DILIGENCE_STATUS.PENDING).length,
			inProgress: dueDiligenceProjects.filter(p => p.organizationId === orgId && p.status === DUE_DILIGENCE_STATUS.IN_PROGRESS).length,
			completed: dueDiligenceProjects.filter(p => p.organizationId === orgId && p.status === DUE_DILIGENCE_STATUS.COMPLETED).length
		};

		return json({
			success: true,
			data: {
				projects: filteredProjects,
				stats
			}
		});
	} catch (err) {
		console.error('Error fetching due diligence projects:', err);
		return json({
			success: false,
			error: 'Failed to fetch due diligence projects'
		}, { status: 500 });
	}
};

// POST /api/organizations/[orgId]/due-diligence - Create new due diligence project
export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId } = params;
		const data = await request.json();

		// Validate required fields
		if (!data.startupName || !data.assignedTo) {
			return json({
				success: false,
				error: 'Startup name and assigned user are required'
			}, { status: 400 });
		}

		// In a real app, check if user has permission to create due diligence projects
		// const hasPermission = await checkCreateDueDiligencePermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Generate project ID
		const projectId = `dd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const newProject = {
			id: projectId,
			organizationId: orgId,
			startupName: data.startupName,
			startupId: data.startupId || `startup-${Date.now()}`,
			assignedTo: data.assignedTo,
			assigneeName: data.assigneeName || 'Unknown User',
			status: DUE_DILIGENCE_STATUS.PENDING,
			priority: data.priority || 'medium',
			startDate: null,
			dueDate: data.dueDate || null,
			completedDate: null,
			recommendation: null,
			confidence: null,
			summary: null,
			checklist: {
				financials: { completed: false, notes: '', documents: [] },
				market: { completed: false, notes: '', documents: [] },
				team: { completed: false, notes: '', documents: [] },
				technology: { completed: false, notes: '', documents: [] },
				legal: { completed: false, notes: '', documents: [] },
				competitive: { completed: false, notes: '', documents: [] }
			},
			progress: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		dueDiligenceProjects.push(newProject);

		return json({
			success: true,
			data: newProject
		}, { status: 201 });
	} catch (err) {
		console.error('Error creating due diligence project:', err);
		return json({
			success: false,
			error: 'Failed to create due diligence project'
		}, { status: 500 });
	}
};
