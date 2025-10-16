import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@lib/db';
import { supporters, services, engagements } from '@lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/supporters - Get supporter profile
export const GET: RequestHandler = async ({ locals }) => {
	try {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get supporter profile for current user
		const supporter = await db.query.supporters.findFirst({
			where: eq(supporters.userId, session.user.id),
			with: {
				services: true
			}
		});

		if (!supporter) {
			return json({ error: 'Supporter profile not found' }, { status: 404 });
		}

		return json({ supporter });
	} catch (error) {
		console.error('Error fetching supporter profile:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// POST /api/supporters - Create or update supporter profile
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { profileData } = body;

		// Check if supporter profile already exists
		const existingSupporter = await db.query.supporters.findFirst({
			where: eq(supporters.userId, session.user.id)
		});

		if (existingSupporter) {
			// Update existing profile
			const updatedSupporter = await db
				.update(supporters)
				.set({
					profileData,
					updatedAt: new Date()
				})
				.where(eq(supporters.id, existingSupporter.id))
				.returning();

			return json({ supporter: updatedSupporter[0] });
		} else {
			// Create new profile
			const newSupporter = await db
				.insert(supporters)
				.values({
					userId: session.user.id,
					profileData,
					verificationStatus: 'pending'
				})
				.returning();

			return json({ supporter: newSupporter[0] });
		}
	} catch (error) {
		console.error('Error creating/updating supporter profile:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// PUT /api/supporters - Update supporter profile
export const PUT: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { profileData } = body;

		// Update supporter profile
		const updatedSupporter = await db
			.update(supporters)
			.set({
				profileData,
				updatedAt: new Date()
			})
			.where(eq(supporters.userId, session.user.id))
			.returning();

		if (updatedSupporter.length === 0) {
			return json({ error: 'Supporter profile not found' }, { status: 404 });
		}

		return json({ supporter: updatedSupporter[0] });
	} catch (error) {
		console.error('Error updating supporter profile:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
