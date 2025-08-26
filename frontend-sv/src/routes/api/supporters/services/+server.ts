import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@lib/db';
import { services, supporters } from '@lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/supporters/services - Get all services for current supporter
export const GET: RequestHandler = async ({ locals }) => {
	try {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get supporter ID
		const supporter = await db.query.supporters.findFirst({
			where: eq(supporters.userId, session.user.id)
		});

		if (!supporter) {
			return json({ error: 'Supporter profile not found' }, { status: 404 });
		}

		// Get all services for this supporter
		const supporterServices = await db.query.services.findMany({
			where: eq(services.supporterId, supporter.id),
			orderBy: (services, { desc }) => [desc(services.createdAt)]
		});

		return json({ services: supporterServices });
	} catch (error) {
		console.error('Error fetching supporter services:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// POST /api/supporters/services - Create new service
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { title, description, category, subcategory, pricing, availability, features, deliverables, requirements } = body;

		// Get supporter ID
		const supporter = await db.query.supporters.findFirst({
			where: eq(supporters.userId, session.user.id)
		});

		if (!supporter) {
			return json({ error: 'Supporter profile not found' }, { status: 404 });
		}

		// Create new service
		const newService = await db
			.insert(services)
			.values({
				supporterId: supporter.id,
				title,
				description,
				category,
				subcategory,
				pricing: {
					type: pricing.type,
					amount: pricing.amount,
					currency: pricing.currency,
					details: pricing.details || ''
				},
				availability: {
					workingHours: availability.workingHours || {},
					timezone: availability.timezone,
					responseTime: availability.responseTime
				},
				status: 'active'
			})
			.returning();

		return json({ service: newService[0] });
	} catch (error) {
		console.error('Error creating service:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
