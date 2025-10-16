import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	supportTickets,
	supportCustomers,
	ticketMessages,
	supportTeamMembers,
	TICKET_STATUS,
	TICKET_PRIORITY,
	type SupportTicket,
	type NewSupportTicket,
	type NewSupportCustomer,
	type NewTicketMessage
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
	},
	{
		id: 'ticket-2',
		ticketNumber: 'SUP-002',
		title: 'Feature request: Dark mode toggle',
		description: 'Customer is requesting a dark mode feature for the dashboard.',
		status: TICKET_STATUS.IN_PROGRESS,
		priority: TICKET_PRIORITY.MEDIUM,
		category: 'Feature Request',
		tags: ['feature', 'ui', 'dark-mode'],
		customerId: 'customer-2',
		customerEmail: 'sarah.smith@company.com',
		customerName: 'Sarah Smith',
		assignedTo: 'agent-2',
		assignedBy: 'manager-1',
		assignedAt: new Date('2024-12-14T14:00:00Z'),
		createdAt: new Date('2024-12-14T13:00:00Z'),
		updatedAt: new Date('2024-12-15T11:00:00Z'),
		resolvedAt: null,
		closedAt: null,
		slaBreachTime: null,
		firstResponseTime: new Date('2024-12-14T13:15:00Z'),
		resolutionTime: null,
		source: 'chat',
		satisfactionRating: null,
		feedback: null
	},
	{
		id: 'ticket-3',
		ticketNumber: 'SUP-003',
		title: 'Billing discrepancy - charged twice',
		description: 'Customer was charged twice for the same subscription period.',
		status: TICKET_STATUS.RESOLVED,
		priority: TICKET_PRIORITY.CRITICAL,
		category: 'Billing',
		tags: ['billing', 'refund', 'duplicate-charge'],
		customerId: 'customer-3',
		customerEmail: 'mike.johnson@enterprise.com',
		customerName: 'Mike Johnson',
		assignedTo: 'agent-1',
		assignedBy: 'manager-1',
		assignedAt: new Date('2024-12-13T08:00:00Z'),
		createdAt: new Date('2024-12-13T07:30:00Z'),
		updatedAt: new Date('2024-12-14T16:00:00Z'),
		resolvedAt: new Date('2024-12-14T15:00:00Z'),
		closedAt: new Date('2024-12-14T16:00:00Z'),
		slaBreachTime: null,
		firstResponseTime: new Date('2024-12-13T08:00:00Z'),
		resolutionTime: new Date('2024-12-14T15:00:00Z'),
		source: 'phone',
		satisfactionRating: 5,
		feedback: 'Excellent support, very fast resolution!'
	}
];

let ticketCounter = 4;

// Generate next ticket number
function generateTicketNumber(): string {
	const number = ticketCounter.toString().padStart(3, '0');
	ticketCounter++;
	return `SUP-${number}`;
}

// GET /api/support/tickets - Get all tickets with filtering and pagination
export const GET: RequestHandler = async ({ locals, url }) => {
	try {
		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:read')) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		const search = url.searchParams.get('search');
		const status = url.searchParams.get('status');
		const priority = url.searchParams.get('priority');
		const category = url.searchParams.get('category');
		const assignedTo = url.searchParams.get('assignedTo');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');

		let filteredTickets = [...tickets];

		// Apply filters
		if (search) {
			const searchLower = search.toLowerCase();
			filteredTickets = filteredTickets.filter(ticket =>
				ticket.title.toLowerCase().includes(searchLower) ||
				ticket.description.toLowerCase().includes(searchLower) ||
				ticket.customerName.toLowerCase().includes(searchLower) ||
				ticket.customerEmail.toLowerCase().includes(searchLower) ||
				ticket.ticketNumber.toLowerCase().includes(searchLower)
			);
		}

		if (status && status !== 'all') {
			filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
		}

		if (priority && priority !== 'all') {
			filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
		}

		if (category && category !== 'all') {
			filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
		}

		if (assignedTo && assignedTo !== 'all') {
			if (assignedTo === 'unassigned') {
				filteredTickets = filteredTickets.filter(ticket => !ticket.assignedTo);
			} else {
				filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === assignedTo);
			}
		}

		// Sort by creation date (newest first)
		filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		// Pagination
		const total = filteredTickets.length;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

		// Calculate statistics
		const stats = {
			total,
			open: tickets.filter(t => t.status === TICKET_STATUS.OPEN).length,
			inProgress: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
			pending: tickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
			resolved: tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
			closed: tickets.filter(t => t.status === TICKET_STATUS.CLOSED).length,
			unassigned: tickets.filter(t => !t.assignedTo).length
		};

		return json({
			success: true,
			data: {
				tickets: paginatedTickets,
				stats,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			}
		});
	} catch (err) {
		console.error('Error fetching tickets:', err);
		return json({
			success: false,
			error: 'Failed to fetch tickets'
		}, { status: 500 });
	}
};

// POST /api/support/tickets - Create new ticket
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.title || !data.description || !data.customerEmail || !data.customerName) {
			return json({
				success: false,
				error: 'Title, description, customer email, and customer name are required'
			}, { status: 400 });
		}

		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'tickets:create')) {
		//   return json({ success: false, error: 'Permission denied' }, { status: 403 });
		// }

		// Create or find customer
		let customerId = null;
		// In real implementation, you'd search for existing customer or create new one

		const newTicket: SupportTicket = {
			id: `ticket-${Date.now()}`,
			ticketNumber: generateTicketNumber(),
			title: data.title,
			description: data.description,
			status: TICKET_STATUS.OPEN,
			priority: data.priority || TICKET_PRIORITY.MEDIUM,
			category: data.category || null,
			tags: data.tags || [],
			customerId,
			customerEmail: data.customerEmail,
			customerName: data.customerName,
			assignedTo: data.assignedTo || null,
			assignedBy: data.assignedTo ? locals.user?.id || 'system' : null,
			assignedAt: data.assignedTo ? new Date() : null,
			createdAt: new Date(),
			updatedAt: new Date(),
			resolvedAt: null,
			closedAt: null,
			slaBreachTime: null,
			firstResponseTime: null,
			resolutionTime: null,
			source: data.source || 'manual',
			satisfactionRating: null,
			feedback: null
		};

		tickets.push(newTicket);

		return json({
			success: true,
			data: newTicket
		}, { status: 201 });
	} catch (err) {
		console.error('Error creating ticket:', err);
		return json({
			success: false,
			error: 'Failed to create ticket'
		}, { status: 500 });
	}
};
