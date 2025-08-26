import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	ticketMessages,
	supportTickets,
	TICKET_STATUS,
	type TicketMessage,
	type NewTicketMessage,
	type SupportTicket
} from '$lib/db/schema';

// Mock database - replace with real database operations
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

let tickets: SupportTicket[] = [
	{
		id: 'ticket-1',
		ticketNumber: 'SUP-001',
		title: 'Login issue with email verification',
		description: 'Customer cannot login despite entering correct credentials.',
		status: TICKET_STATUS.OPEN,
		priority: 'high',
		category: 'Authentication',
		tags: ['login', 'email'],
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

// GET /api/support/tickets/[ticketId]/messages - Get all messages for a ticket
export const GET: RequestHandler = async ({ params, locals, url }) => {
	try {
		const { ticketId } = params;

		// Check if ticket exists
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

		// Get messages with optional filtering
		let ticketMessages = messages.filter(m => m.ticketId === ticketId);

		// Filter internal messages based on user role
		const userRole = locals.user?.role || 'viewer';
		if (userRole === 'viewer') {
			// Viewers can only see non-internal messages
			ticketMessages = ticketMessages.filter(m => !m.isInternal);
		}

		// Sort by creation time
		ticketMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

		// Pagination
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedMessages = ticketMessages.slice(startIndex, endIndex);

		return json({
			success: true,
			data: {
				messages: paginatedMessages,
				pagination: {
					page,
					limit,
					total: ticketMessages.length,
					totalPages: Math.ceil(ticketMessages.length / limit)
				}
			}
		});
	} catch (err) {
		console.error('Error fetching messages:', err);
		return json({
			success: false,
			error: 'Failed to fetch messages'
		}, { status: 500 });
	}
};

// POST /api/support/tickets/[ticketId]/messages - Add new message to ticket
export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { ticketId } = params;
		const data = await request.json();

		// Check if ticket exists
		const ticketIndex = tickets.findIndex(t => t.id === ticketId);
		if (ticketIndex === -1) {
			return json({
				success: false,
				error: 'Ticket not found'
			}, { status: 404 });
		}

		const ticket = tickets[ticketIndex];

		// Validate required fields
		if (!data.message || !data.message.trim()) {
			return json({
				success: false,
				error: 'Message content is required'
			}, { status: 400 });
		}

		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:update')) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Determine author type and validate
		let authorType: 'customer' | 'agent' | 'system' = 'agent';
		let authorId = locals.user?.id || 'system';

		if (data.authorType) {
			if (!['customer', 'agent', 'system'].includes(data.authorType)) {
				return json({
					success: false,
					error: 'Invalid author type'
				}, { status: 400 });
			}
			authorType = data.authorType;
		}

		// If customer message, use customer ID from ticket
		if (authorType === 'customer') {
			authorId = ticket.customerId || 'unknown-customer';
		}

		// Create new message
		const newMessage: TicketMessage = {
			id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			ticketId,
			authorId,
			authorType,
			message: data.message.trim(),
			isInternal: data.isInternal || false,
			attachments: data.attachments || [],
			createdAt: new Date(),
			updatedAt: new Date()
		};

		messages.push(newMessage);

		// Update ticket's first response time if this is the first agent response
		if (authorType === 'agent' && !ticket.firstResponseTime) {
			tickets[ticketIndex].firstResponseTime = new Date();
			tickets[ticketIndex].updatedAt = new Date();
		}

		// Update ticket's last updated time
		tickets[ticketIndex].updatedAt = new Date();

		// Log activity if internal note
		if (newMessage.isInternal) {
			// In real implementation, you'd log this to activity log
			console.log(`Internal note added to ticket ${ticketId} by ${authorId}`);
		}

		return json({
			success: true,
			data: newMessage
		}, { status: 201 });
	} catch (err) {
		console.error('Error creating message:', err);
		return json({
			success: false,
			error: 'Failed to create message'
		}, { status: 500 });
	}
};
