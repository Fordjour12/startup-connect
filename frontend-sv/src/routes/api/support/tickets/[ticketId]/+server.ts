import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	supportTickets,
	ticketMessages,
	ticketActivityLog,
	TICKET_STATUS,
	TICKET_PRIORITY,
	type SupportTicket,
	type TicketMessage,
	type NewTicketMessage,
	type NewTicketActivityLog
} from '$lib/db/schema';

// Mock database - replace with real database operations
let tickets: SupportTicket[] = [
	{
		id: 'ticket-1',
		ticketNumber: 'SUP-001',
		title: 'Login issue with email verification',
		description: 'Customer cannot login despite entering correct credentials. Error shows email verification failed.',
		status: TICKET_STATUS.OPEN,
		priority: TICKET_PRIORITY.HIGH,
		category: 'Authentication',
		tags: ['login', 'email', 'verification'],
		customerId: 'customer-1',
		customerEmail: 'john.doe@example.com',
		customerName: 'John Doe',
		assignedTo: 'agent-1',
		assignedBy: 'manager-1',
		assignedAt: new Date('2024-12-15T10:00:00Z'),
		createdAt: new Date('2024-12-15T09:00:00Z'),
		updatedAt: new Date('2024-12-15T10:00:00Z'),
		resolvedAt: null,
		closedAt: null,
		slaBreachTime: null,
		firstResponseTime: new Date('2024-12-15T09:30:00Z'),
		resolutionTime: null,
		source: 'email',
		satisfactionRating: null,
		feedback: null
	}
];

let messages: TicketMessage[] = [
	{
		id: 'msg-1',
		ticketId: 'ticket-1',
		authorId: 'customer-1',
		authorType: 'customer',
		message: 'Hi, I\'m having trouble logging into my account. I keep getting an error about email verification even though I\'ve already verified my email.',
		isInternal: false,
		attachments: [],
		createdAt: new Date('2024-12-15T09:00:00Z'),
		updatedAt: new Date('2024-12-15T09:00:00Z')
	},
	{
		id: 'msg-2',
		ticketId: 'ticket-1',
		authorId: 'agent-1',
		authorType: 'agent',
		message: 'Hello John, I\'m sorry to hear you\'re having trouble with login. Let me help you troubleshoot this. Can you tell me what browser you\'re using and if you\'ve tried clearing your cache?',
		isInternal: false,
		attachments: [],
		createdAt: new Date('2024-12-15T09:30:00Z'),
		updatedAt: new Date('2024-12-15T09:30:00Z')
	}
];

let activityLog: any[] = [
	{
		id: 'activity-1',
		ticketId: 'ticket-1',
		userId: 'system',
		action: 'created',
		oldValue: null,
		newValue: null,
		description: 'Ticket created via email integration',
		createdAt: new Date('2024-12-15T09:00:00Z')
	},
	{
		id: 'activity-2',
		ticketId: 'ticket-1',
		userId: 'manager-1',
		action: 'assigned',
		oldValue: null,
		newValue: 'agent-1',
		description: 'Ticket assigned to Sarah Johnson',
		createdAt: new Date('2024-12-15T10:00:00Z')
	}
];

// GET /api/support/tickets/[ticketId] - Get ticket details with messages
export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const { ticketId } = params;

		const ticket = tickets.find(t => t.id === ticketId);

		if (!ticket) {
			return json({
				success: false,
				error: 'Ticket not found'
			}, { status: 404 });
		}

		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:read')) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		// Get ticket messages
		const ticketMessages = messages.filter(m => m.ticketId === ticketId)
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

		// Get activity log
		const ticketActivity = activityLog.filter(a => a.ticketId === ticketId)
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		return json({
			success: true,
			data: {
				...ticket,
				messages: ticketMessages,
				activity: ticketActivity
			}
		});
	} catch (err) {
		console.error('Error fetching ticket:', err);
		return json({
			success: false,
			error: 'Failed to fetch ticket'
		}, { status: 500 });
	}
};

// PUT /api/support/tickets/[ticketId] - Update ticket
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { ticketId } = params;
		const data = await request.json();

		const ticketIndex = tickets.findIndex(t => t.id === ticketId);

		if (ticketIndex === -1) {
			return json({
				success: false,
				error: 'Ticket not found'
			}, { status: 404 });
		}

		const ticket = tickets[ticketIndex];

		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:update')) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Track changes for activity log
		const changes = [];
		let updatedTicket = { ...ticket };

		// Handle status changes
		if (data.status && data.status !== ticket.status) {
			changes.push({
				field: 'status',
				oldValue: ticket.status,
				newValue: data.status
			});

			updatedTicket.status = data.status;
			updatedTicket.updatedAt = new Date();

			// Handle specific status change logic
			if (data.status === TICKET_STATUS.RESOLVED && ticket.status !== TICKET_STATUS.RESOLVED) {
				updatedTicket.resolvedAt = new Date();
				updatedTicket.resolutionTime = new Date();
			} else if (data.status === TICKET_STATUS.CLOSED && ticket.status !== TICKET_STATUS.CLOSED) {
				updatedTicket.closedAt = new Date();
			}
		}

		// Handle priority changes
		if (data.priority && data.priority !== ticket.priority) {
			changes.push({
				field: 'priority',
				oldValue: ticket.priority,
				newValue: data.priority
			});
			updatedTicket.priority = data.priority;
		}

		// Handle assignment changes
		if (data.assignedTo !== ticket.assignedTo) {
			changes.push({
				field: 'assignedTo',
				oldValue: ticket.assignedTo,
				newValue: data.assignedTo
			});
			updatedTicket.assignedTo = data.assignedTo;
			updatedTicket.assignedBy = locals.user?.id || 'system';
			updatedTicket.assignedAt = new Date();
		}

		// Handle other field updates
		const updatableFields = ['title', 'description', 'category', 'tags', 'satisfactionRating', 'feedback'];
		updatableFields.forEach(field => {
			if (data[field] !== undefined && data[field] !== ticket[field]) {
				changes.push({
					field,
					oldValue: ticket[field],
					newValue: data[field]
				});
				updatedTicket[field] = data[field];
			}
		});

		updatedTicket.updatedAt = new Date();
		tickets[ticketIndex] = updatedTicket;

		// Log activities
		changes.forEach(change => {
			const activity = {
				id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				ticketId,
				userId: locals.user?.id || 'system',
				action: 'updated',
				oldValue: change.oldValue,
				newValue: change.newValue,
				description: `${change.field} changed from "${change.oldValue || 'empty'}" to "${change.newValue || 'empty'}"`,
				createdAt: new Date()
			};
			activityLog.push(activity);
		});

		return json({
			success: true,
			data: updatedTicket
		});
	} catch (err) {
		console.error('Error updating ticket:', err);
		return json({
			success: false,
			error: 'Failed to update ticket'
		}, { status: 500 });
	}
};

// DELETE /api/support/tickets/[ticketId] - Delete ticket
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const { ticketId } = params;

		const ticketIndex = tickets.findIndex(t => t.id === ticketId);

		if (ticketIndex === -1) {
			return json({
				success: false,
				error: 'Ticket not found'
			}, { status: 404 });
		}

		// In a real app, check user permissions (usually managers only)
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:delete')) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Remove ticket
		tickets.splice(ticketIndex, 1);

		// Remove associated messages and activity logs
		messages = messages.filter(m => m.ticketId !== ticketId);
		activityLog = activityLog.filter(a => a.ticketId !== ticketId);

		return json({
			success: true,
			message: 'Ticket deleted successfully'
		});
	} catch (err) {
		console.error('Error deleting ticket:', err);
		return json({
			success: false,
			error: 'Failed to delete ticket'
		}, { status: 500 });
	}
};
