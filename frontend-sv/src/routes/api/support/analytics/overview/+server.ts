import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	supportTickets,
	supportTeamMembers,
	TICKET_STATUS,
	TICKET_PRIORITY,
	SUPPORT_ROLES,
	type SupportTicket,
	type SupportTeamMember
} from '$lib/db/schema';

// Mock database - replace with real database operations
let tickets: SupportTicket[] = [
	{
		id: 'ticket-1',
		ticketNumber: 'SUP-001',
		title: 'Login issue',
		description: 'Cannot login',
		status: TICKET_STATUS.OPEN,
		priority: TICKET_PRIORITY.HIGH,
		category: 'Authentication',
		tags: ['login'],
		customerId: 'customer-1',
		customerEmail: 'john@example.com',
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
		title: 'Feature request',
		description: 'Dark mode request',
		status: TICKET_STATUS.IN_PROGRESS,
		priority: TICKET_PRIORITY.MEDIUM,
		category: 'Feature Request',
		tags: ['feature'],
		customerId: 'customer-2',
		customerEmail: 'sarah@example.com',
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
		title: 'Billing issue',
		description: 'Double charge',
		status: TICKET_STATUS.RESOLVED,
		priority: TICKET_PRIORITY.CRITICAL,
		category: 'Billing',
		tags: ['billing'],
		customerId: 'customer-3',
		customerEmail: 'mike@example.com',
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
		feedback: 'Excellent support!'
	}
];

let teamMembers: SupportTeamMember[] = [
	{
		id: 'member-1',
		userId: 'manager-1',
		name: 'Manager One',
		email: 'manager@example.com',
		role: SUPPORT_ROLES.MANAGER,
		permissions: ['read', 'write', 'manage'],
		isActive: true,
		isOnline: true,
		maxTicketsPerDay: 20,
		workingHours: { start: '09:00', end: '17:00' },
		ticketsResolved: 45,
		averageResponseTime: 15,
		customerSatisfaction: 4.5,
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-12-15T10:00:00Z'),
		lastActiveAt: new Date('2024-12-15T10:00:00Z')
	},
	{
		id: 'member-2',
		userId: 'agent-1',
		name: 'Agent One',
		email: 'agent1@example.com',
		role: SUPPORT_ROLES.AGENT,
		permissions: ['read', 'write'],
		isActive: true,
		isOnline: true,
		maxTicketsPerDay: 15,
		workingHours: { start: '09:00', end: '17:00' },
		ticketsResolved: 32,
		averageResponseTime: 12,
		customerSatisfaction: 4.2,
		createdAt: new Date('2024-02-01T00:00:00Z'),
		updatedAt: new Date('2024-12-15T10:00:00Z'),
		lastActiveAt: new Date('2024-12-15T09:45:00Z')
	},
	{
		id: 'member-3',
		userId: 'agent-2',
		name: 'Agent Two',
		email: 'agent2@example.com',
		role: SUPPORT_ROLES.AGENT,
		permissions: ['read', 'write'],
		isActive: true,
		isOnline: false,
		maxTicketsPerDay: 15,
		workingHours: { start: '10:00', end: '18:00' },
		ticketsResolved: 28,
		averageResponseTime: 18,
		customerSatisfaction: 4.0,
		createdAt: new Date('2024-03-01T00:00:00Z'),
		updatedAt: new Date('2024-12-14T17:00:00Z'),
		lastActiveAt: new Date('2024-12-14T17:00:00Z')
	}
];

// Helper functions for calculations
function calculateAverageResponseTime(tickets: SupportTicket[]): number {
	const ticketsWithResponse = tickets.filter(t => t.firstResponseTime);
	if (ticketsWithResponse.length === 0) return 0;

	const totalResponseTime = ticketsWithResponse.reduce((sum, ticket) => {
		const responseTime = new Date(ticket.firstResponseTime!).getTime();
		const createdTime = new Date(ticket.createdAt).getTime();
		return sum + (responseTime - createdTime);
	}, 0);

	return Math.round(totalResponseTime / ticketsWithResponse.length / (1000 * 60)); // in minutes
}

function calculateAverageResolutionTime(tickets: SupportTicket[]): number {
	const resolvedTickets = tickets.filter(t => t.resolvedAt && t.createdAt);
	if (resolvedTickets.length === 0) return 0;

	const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
		const resolutionTime = new Date(ticket.resolvedAt!).getTime();
		const createdTime = new Date(ticket.createdAt).getTime();
		return sum + (resolutionTime - createdTime);
	}, 0);

	return Math.round(totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60)); // in hours
}

function calculateCustomerSatisfaction(tickets: SupportTicket[]): number {
	const ratedTickets = tickets.filter(t => t.satisfactionRating !== null);
	if (ratedTickets.length === 0) return 0;

	const totalRating = ratedTickets.reduce((sum, ticket) => sum + (ticket.satisfactionRating || 0), 0);
	return Math.round((totalRating / ratedTickets.length) * 10) / 10;
}

function getTicketsLast24Hours(tickets: SupportTicket[]): SupportTicket[] {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return tickets.filter(ticket => new Date(ticket.createdAt) >= yesterday);
}

function getTicketsLast7Days(tickets: SupportTicket[]): SupportTicket[] {
	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	return tickets.filter(ticket => new Date(ticket.createdAt) >= weekAgo);
}

function getTicketsLast30Days(tickets: SupportTicket[]): SupportTicket[] {
	const monthAgo = new Date();
	monthAgo.setDate(monthAgo.getDate() - 30);
	return tickets.filter(ticket => new Date(ticket.createdAt) >= monthAgo);
}

// GET /api/support/analytics/overview - Get dashboard analytics overview
export const GET: RequestHandler = async ({ locals, url }) => {
	try {
		// In a real app, check user permissions
		// const userRole = await getUserRole(locals.user.id);
		// if (!hasPermission(userRole, 'analytics:read')) {
		//   return json({ success: false, error: 'Access denied' }, { status: 403 });
		// }

		const period = url.searchParams.get('period') || '30d'; // 24h, 7d, 30d

		// Get tickets based on period
		let periodTickets: SupportTicket[] = tickets;
		switch (period) {
			case '24h':
				periodTickets = getTicketsLast24Hours(tickets);
				break;
			case '7d':
				periodTickets = getTicketsLast7Days(tickets);
				break;
			case '30d':
			default:
				periodTickets = getTicketsLast30Days(tickets);
				break;
		}

		// Calculate key metrics
		const totalTickets = tickets.length;
		const periodTotalTickets = periodTickets.length;

		const statusCounts = {
			open: tickets.filter(t => t.status === TICKET_STATUS.OPEN).length,
			inProgress: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
			pending: tickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
			resolved: tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
			closed: tickets.filter(t => t.status === TICKET_STATUS.CLOSED).length
		};

		const priorityCounts = {
			critical: tickets.filter(t => t.priority === TICKET_PRIORITY.CRITICAL).length,
			high: tickets.filter(t => t.priority === TICKET_PRIORITY.HIGH).length,
			medium: tickets.filter(t => t.priority === TICKET_PRIORITY.MEDIUM).length,
			low: tickets.filter(t => t.priority === TICKET_PRIORITY.LOW).length
		};

		// Calculate performance metrics
		const avgResponseTime = calculateAverageResponseTime(tickets);
		const avgResolutionTime = calculateAverageResolutionTime(tickets);
		const customerSatisfaction = calculateCustomerSatisfaction(tickets);

		// Calculate agent performance
		const activeAgents = teamMembers.filter(m => m.isActive);
		const onlineAgents = teamMembers.filter(m => m.isOnline);

		const agentPerformance = activeAgents.map(agent => {
			const agentTickets = tickets.filter(t => t.assignedTo === agent.userId);
			const resolvedTickets = agentTickets.filter(t => t.status === TICKET_STATUS.RESOLVED || t.status === TICKET_STATUS.CLOSED);

			return {
				id: agent.userId,
				name: agent.name,
				role: agent.role,
				isOnline: agent.isOnline,
				totalTickets: agentTickets.length,
				resolvedTickets: resolvedTickets.length,
				averageResponseTime: agent.averageResponseTime || 0,
				customerSatisfaction: agent.customerSatisfaction || 0
			};
		});

		// Calculate trends (mock data for demonstration)
		const trends = {
			ticketsThisWeek: period === '7d' ? periodTickets.length : getTicketsLast7Days(tickets).length,
			ticketsLastWeek: 23, // Mock data
			responseTimeChange: -5, // -5 minutes improvement
			resolutionTimeChange: 2, // +2 hours (worse)
			satisfactionChange: 0.1 // +0.1 improvement
		};

		// Category breakdown
		const categoryBreakdown = tickets.reduce((acc, ticket) => {
			const category = ticket.category || 'Uncategorized';
			acc[category] = (acc[category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Source breakdown
		const sourceBreakdown = tickets.reduce((acc, ticket) => {
			const source = ticket.source || 'unknown';
			acc[source] = (acc[source] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return json({
			success: true,
			data: {
				// Overview metrics
				overview: {
					totalTickets,
					periodTotalTickets,
					activeTickets: statusCounts.open + statusCounts.inProgress,
					averageResponseTime: avgResponseTime,
					averageResolutionTime: avgResolutionTime,
					customerSatisfaction,
					activeAgents: activeAgents.length,
					onlineAgents: onlineAgents.length
				},

				// Status breakdown
				statusBreakdown: statusCounts,

				// Priority breakdown
				priorityBreakdown: priorityCounts,

				// Agent performance
				agentPerformance,

				// Trends
				trends,

				// Breakdowns
				breakdowns: {
					categories: categoryBreakdown,
					sources: sourceBreakdown
				},

				// Metadata
				metadata: {
					period,
					calculatedAt: new Date().toISOString(),
					totalAgents: teamMembers.length,
					activeAgentsCount: activeAgents.length
				}
			}
		});
	} catch (err) {
		console.error('Error fetching analytics:', err);
		return json({
			success: false,
			error: 'Failed to fetch analytics'
		}, { status: 500 });
	}
};
