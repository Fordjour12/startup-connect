import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database - replace with real database operations
let organizations = [
	{
		id: 'org-123',
		name: 'TechVenture Capital',
		type: 'vc_fund',
		description: 'Leading early-stage venture capital firm',
		verified: false,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
		// Extended fields for organization profile
		website: 'https://techventure.com',
		headquarters: 'San Francisco, CA',
		foundedYear: 2020,
		teamSize: '6-20',
		totalAssetsUnderManagement: '100M-1B',
		investmentFocus: ['seed', 'series_a'],
		geographicFocus: 'North America',
		sectorFocus: ['SaaS', 'FinTech'],
		minInvestmentSize: 50000, // in cents
		maxInvestmentSize: 2000000, // in cents
		contactEmail: 'contact@techventure.com',
		contactPhone: '+1-555-0123',
		linkedinUrl: 'https://linkedin.com/company/techventure',
		twitterHandle: '@techventure',
		isVerified: false,
		verificationDate: null
	}
];

let organizationMembers = [
	{
		id: 'member-1',
		userId: 'user-1',
		organizationId: 'org-123',
		role: 'owner',
		joinedAt: '2024-01-15T10:00:00Z',
		invitedBy: null,
		permissions: ['read', 'write', 'delete', 'admin']
	},
	{
		id: 'member-2',
		userId: 'user-2',
		organizationId: 'org-123',
		role: 'investment_partner',
		joinedAt: '2024-02-01T09:00:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write']
	},
	{
		id: 'member-3',
		userId: 'user-3',
		organizationId: 'org-123',
		role: 'investment_analyst',
		joinedAt: '2024-02-15T14:30:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write']
	},
	{
		id: 'member-4',
		userId: 'user-4',
		organizationId: 'org-123',
		role: 'operations',
		joinedAt: '2024-03-01T11:15:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write']
	}
];

// GET /api/organizations/[orgId] - Get specific organization
export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const { orgId } = params;

		const organization = organizations.find(org => org.id === orgId);

		if (!organization) {
			return json({
				success: false,
				error: 'Organization not found'
			}, { status: 404 });
		}

		// In a real app, check if user has access to this organization
		// const hasAccess = await checkOrganizationAccess(locals.user.id, orgId);
		// if (!hasAccess) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		// Get organization members
		const members = organizationMembers.filter(member => member.organizationId === orgId);

		return json({
			success: true,
			data: {
				...organization,
				members
			}
		});
	} catch (err) {
		console.error('Error fetching organization:', err);
		return json({
			success: false,
			error: 'Failed to fetch organization'
		}, { status: 500 });
	}
};

// PUT /api/organizations/[orgId] - Update organization
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId } = params;
		const data = await request.json();

		const orgIndex = organizations.findIndex(org => org.id === orgId);

		if (orgIndex === -1) {
			return json({
				success: false,
				error: 'Organization not found'
			}, { status: 404 });
		}

		// In a real app, check if user has permission to update
		// const hasPermission = await checkUpdatePermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Update organization
		organizations[orgIndex] = {
			...organizations[orgIndex],
			...data,
			updatedAt: new Date().toISOString()
		};

		return json({
			success: true,
			data: organizations[orgIndex]
		});
	} catch (err) {
		console.error('Error updating organization:', err);
		return json({
			success: false,
			error: 'Failed to update organization'
		}, { status: 500 });
	}
};

// DELETE /api/organizations/[orgId] - Delete organization
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const { orgId } = params;

		const orgIndex = organizations.findIndex(org => org.id === orgId);

		if (orgIndex === -1) {
			return json({
				success: false,
				error: 'Organization not found'
			}, { status: 404 });
		}

		// In a real app, check if user has permission to delete (usually owner only)
		// const hasPermission = await checkDeletePermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Remove organization
		organizations.splice(orgIndex, 1);

		// Remove all members
		organizationMembers = organizationMembers.filter(member => member.organizationId !== orgId);

		return json({
			success: true,
			message: 'Organization deleted successfully'
		});
	} catch (err) {
		console.error('Error deleting organization:', err);
		return json({
			success: false,
			error: 'Failed to delete organization'
		}, { status: 500 });
	}
};
