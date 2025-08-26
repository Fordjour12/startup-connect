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
	}
];

// GET /api/organizations/[orgId]/due-diligence/[projectId] - Get specific project
export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const { orgId, projectId } = params;

		const project = dueDiligenceProjects.find(
			p => p.id === projectId && p.organizationId === orgId
		);

		if (!project) {
			return json({
				success: false,
				error: 'Due diligence project not found'
			}, { status: 404 });
		}

		// In a real app, check if user has access to this project
		// const hasAccess = await checkProjectAccess(locals.user.id, orgId, projectId);
		// if (!hasAccess) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		return json({
			success: true,
			data: project
		});
	} catch (err) {
		console.error('Error fetching due diligence project:', err);
		return json({
			success: false,
			error: 'Failed to fetch due diligence project'
		}, { status: 500 });
	}
};

// PUT /api/organizations/[orgId]/due-diligence/[projectId] - Update project
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId, projectId } = params;
		const data = await request.json();

		const projectIndex = dueDiligenceProjects.findIndex(
			p => p.id === projectId && p.organizationId === orgId
		);

		if (projectIndex === -1) {
			return json({
				success: false,
				error: 'Due diligence project not found'
			}, { status: 404 });
		}

		const project = dueDiligenceProjects[projectIndex];

		// In a real app, check if user has permission to update this project
		// const hasPermission = await checkUpdateProjectPermission(locals.user.id, orgId, projectId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Handle status changes
		if (data.status) {
			if (data.status === DUE_DILIGENCE_STATUS.IN_PROGRESS && project.status === DUE_DILIGENCE_STATUS.PENDING) {
				// Starting project
				data.startDate = new Date().toISOString();
			} else if (data.status === DUE_DILIGENCE_STATUS.COMPLETED && project.status !== DUE_DILIGENCE_STATUS.COMPLETED) {
				// Completing project
				data.completedDate = new Date().toISOString();
			}
		}

		// Update checklist progress
		if (data.checklist) {
			const completedItems = Object.values(data.checklist).filter((item: any) => item.completed).length;
			data.progress = Math.round((completedItems / 6) * 100);
		}

		// Update project
		dueDiligenceProjects[projectIndex] = {
			...project,
			...data,
			updatedAt: new Date().toISOString()
		};

		return json({
			success: true,
			data: dueDiligenceProjects[projectIndex]
		});
	} catch (err) {
		console.error('Error updating due diligence project:', err);
		return json({
			success: false,
			error: 'Failed to update due diligence project'
		}, { status: 500 });
	}
};

// DELETE /api/organizations/[orgId]/due-diligence/[projectId] - Delete project
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const { orgId, projectId } = params;

		const projectIndex = dueDiligenceProjects.findIndex(
			p => p.id === projectId && p.organizationId === orgId
		);

		if (projectIndex === -1) {
			return json({
				success: false,
				error: 'Due diligence project not found'
			}, { status: 404 });
		}

		// In a real app, check if user has permission to delete this project
		// const hasPermission = await checkDeleteProjectPermission(locals.user.id, orgId, projectId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Remove project
		dueDiligenceProjects.splice(projectIndex, 1);

		return json({
			success: true,
			message: 'Due diligence project deleted successfully'
		});
	} catch (err) {
		console.error('Error deleting due diligence project:', err);
		return json({
			success: false,
			error: 'Failed to delete due diligence project'
		}, { status: 500 });
	}
};
