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
	}
];

// PUT /api/organizations/[orgId]/members/[memberId] - Update member role
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { orgId, memberId } = params;
		const data = await request.json();

		const memberIndex = organizationMembers.findIndex(
			member => member.id === memberId && member.organizationId === orgId
		);

		if (memberIndex === -1) {
			return json({
				success: false,
				error: 'Member not found'
			}, { status: 404 });
		}

		const member = organizationMembers[memberIndex];

		// Prevent changing owner role
		if (member.role === 'owner' && data.role && data.role !== 'owner') {
			return json({
				success: false,
				error: 'Cannot change owner role'
			}, { status: 400 });
		}

		// In a real app, check if user has permission to update members
		// const hasPermission = await checkUpdateMemberPermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Update member
		organizationMembers[memberIndex] = {
			...member,
			...data,
			updatedAt: new Date().toISOString()
		};

		return json({
			success: true,
			data: organizationMembers[memberIndex]
		});
	} catch (err) {
		console.error('Error updating member:', err);
		return json({
			success: false,
			error: 'Failed to update member'
		}, { status: 500 });
	}
};

// DELETE /api/organizations/[orgId]/members/[memberId] - Remove member
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const { orgId, memberId } = params;

		const memberIndex = organizationMembers.findIndex(
			member => member.id === memberId && member.organizationId === orgId
		);

		if (memberIndex === -1) {
			return json({
				success: false,
				error: 'Member not found'
			}, { status: 404 });
		}

		const member = organizationMembers[memberIndex];

		// Prevent removing owner
		if (member.role === 'owner') {
			return json({
				success: false,
				error: 'Cannot remove organization owner'
			}, { status: 400 });
		}

		// In a real app, check if user has permission to remove members
		// const hasPermission = await checkRemoveMemberPermission(locals.user.id, orgId);
		// if (!hasPermission) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Remove member
		organizationMembers.splice(memberIndex, 1);

		return json({
			success: true,
			message: 'Member removed successfully'
		});
	} catch (err) {
		console.error('Error removing member:', err);
		return json({
			success: false,
			error: 'Failed to remove member'
		}, { status: 500 });
	}
};
