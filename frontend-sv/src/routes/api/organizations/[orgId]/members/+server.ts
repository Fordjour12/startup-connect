import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database - replace with real database operations
let organizationMembers = [
	{
		id: 'member-1',
		userId: 'user-1',
		organizationId: 'org-123',
		role: 'owner',
		joinedAt: '2024-01-15T10:00:00Z',
		invitedBy: null,
		permissions: ['read', 'write', 'delete', 'admin'],
		user: {
			name: 'John Doe',
			email: 'john@techventure.com',
			avatar: null
		}
	},
	{
		id: 'member-2',
		userId: 'user-2',
		organizationId: 'org-123',
		role: 'investment_partner',
		joinedAt: '2024-02-01T09:00:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write'],
		user: {
			name: 'Sarah Johnson',
			email: 'sarah@techventure.com',
			avatar: null
		}
	},
	{
		id: 'member-3',
		userId: 'user-3',
		organizationId: 'org-123',
		role: 'investment_analyst',
		joinedAt: '2024-02-15T14:30:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write'],
		user: {
			name: 'Mike Chen',
			email: 'mike@techventure.com',
			avatar: null
		}
	},
	{
		id: 'member-4',
		userId: 'user-4',
		organizationId: 'org-123',
		role: 'operations',
		joinedAt: '2024-03-01T11:15:00Z',
		invitedBy: 'user-1',
		permissions: ['read', 'write'],
		user: {
			name: 'Emily Rodriguez',
			email: 'emily@techventure.com',
			avatar: null
		}
	}
];

let invitations = [
	{
		id: 'inv-1',
		email: 'alex@techventure.com',
		organizationId: 'org-123',
		role: 'investment_analyst',
		status: 'pending',
		invitedAt: '2024-12-15T10:00:00Z',
		expiresAt: '2024-12-22T10:00:00Z',
		invitedBy: 'user-1',
		message: 'Welcome to our team!'
	},
	{
		id: 'inv-2',
		email: 'lisa@techventure.com',
		organizationId: 'org-123',
		role: 'member',
		status: 'accepted',
		invitedAt: '2024-12-10T09:00:00Z',
		expiresAt: '2024-12-17T09:00:00Z',
		invitedBy: 'user-1',
		message: 'Excited to have you join us!'
	}
];

// GET /api/organizations/[orgId]/members - Get all members and invitations
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

		let filteredMembers = organizationMembers.filter(member => member.organizationId === orgId);
		let filteredInvitations = invitations.filter(inv => inv.organizationId === orgId);

		if (search) {
			filteredMembers = filteredMembers.filter(member =>
				member.user.name.toLowerCase().includes(search.toLowerCase()) ||
				member.user.email.toLowerCase().includes(search.toLowerCase())
			);
			filteredInvitations = filteredInvitations.filter(inv =>
				inv.email.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (status && status !== 'all') {
			if (status === 'active') {
				filteredMembers = filteredMembers.filter(member => member.role !== 'inactive');
			} else if (status === 'pending') {
				filteredMembers = [];
				filteredInvitations = filteredInvitations.filter(inv => inv.status === 'pending');
			}
		}

		return json({
			success: true,
			data: {
				members: filteredMembers,
				invitations: filteredInvitations
			}
		});
	} catch (err) {
		console.error('Error fetching members:', err);
		return json({
			success: false,
			error: 'Failed to fetch members'
		}, { status: 500 });
	}
};

// POST /api/organizations/[orgId]/members - Invite new member
export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId } = params;
		const data = await request.json();

		// Validate required fields
		if (!data.email || !data.role) {
			return json({
				success: false,
				error: 'Email and role are required'
			}, { status: 400 });
		}

		// In a real app, check if user has permission to invite members
		// const hasPermission = await checkInvitePermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Check if user is already a member
		const existingMember = organizationMembers.find(
			member => member.organizationId === orgId && member.user.email === data.email
		);

		if (existingMember) {
			return json({
				success: false,
				error: 'User is already a member of this organization'
			}, { status: 400 });
		}

		// Check if invitation already exists
		const existingInvitation = invitations.find(
			inv => inv.organizationId === orgId && inv.email === data.email && inv.status === 'pending'
		);

		if (existingInvitation) {
			return json({
				success: false,
				error: 'Invitation already sent to this email'
			}, { status: 400 });
		}

		// Create invitation
		const invitation = {
			id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			email: data.email,
			organizationId: orgId,
			role: data.role,
			status: 'pending',
			invitedAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
			invitedBy: locals.user?.id || 'user-1',
			message: data.message || ''
		};

		invitations.push(invitation);

		return json({
			success: true,
			data: invitation
		}, { status: 201 });
	} catch (err) {
		console.error('Error inviting member:', err);
		return json({
			success: false,
			error: 'Failed to send invitation'
		}, { status: 500 });
	}
};
