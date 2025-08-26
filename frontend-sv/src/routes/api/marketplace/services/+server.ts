import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@lib/db';
import { services, supporters } from '@lib/db/schema';
import { eq, and, like, gte, lte, desc, asc } from 'drizzle-orm';

// GET /api/marketplace/services - Discover and search services
export const GET: RequestHandler = async ({ url }) => {
	try {
		const searchParams = url.searchParams;
		const category = searchParams.get('category');
		const search = searchParams.get('search');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const sortBy = searchParams.get('sortBy') || 'createdAt';
		const sortOrder = searchParams.get('sortOrder') || 'desc';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// Build where conditions
		const whereConditions = [eq(services.status, 'active')];

		if (category) {
			whereConditions.push(eq(services.category, category));
		}

		if (search) {
			whereConditions.push(
				like(services.title, `%${search}%`)
			);
		}

		if (minPrice) {
			whereConditions.push(gte(services.pricing.amount, parseFloat(minPrice)));
		}

		if (maxPrice) {
			whereConditions.push(lte(services.pricing.amount, parseFloat(maxPrice)));
		}

		// Build order by
		let orderByClause;
		if (sortBy === 'price') {
			orderByClause = sortOrder === 'asc'
				? [asc(services.pricing.amount)]
				: [desc(services.pricing.amount)];
		} else if (sortBy === 'rating') {
			// TODO: Implement rating-based sorting
			orderByClause = [desc(services.createdAt)];
		} else {
			orderByClause = sortOrder === 'asc'
				? [asc(services.createdAt)]
				: [desc(services.createdAt)];
		}

		// Get services with supporter information
		const marketplaceServices = await db.query.services.findMany({
			where: and(...whereConditions),
			with: {
				supporter: {
					with: {
						user: {
							columns: {
								name: true,
								email: true
							}
						}
					}
				}
			},
			orderBy: orderByClause,
			limit,
			offset
		});

		// Get total count for pagination
		const totalCount = await db
			.select({ count: db.fn.count() })
			.from(services)
			.where(and(...whereConditions));

		return json({
			services: marketplaceServices,
			pagination: {
				page,
				limit,
				total: totalCount[0]?.count || 0,
				totalPages: Math.ceil((totalCount[0]?.count || 0) / limit)
			}
		});
	} catch (error) {
		console.error('Error fetching marketplace services:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
