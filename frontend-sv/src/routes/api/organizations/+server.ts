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
		updatedAt: '2024-01-15T10:00:00Z'
	}
];

// GET /api/organizations - Get all organizations for the current user
export const GET: RequestHandler = async ({ locals, url }) => {
	try {
		// In a real app, you'd filter by user's organizations
		// const userId = locals.user.id;
		// const userOrganizations = await getUserOrganizations(userId);

		const search = url.searchParams.get('search');
		const type = url.searchParams.get('type');

		let filteredOrganizations = organizations;

		if (search) {
			filteredOrganizations = filteredOrganizations.filter(org =>
				org.name.toLowerCase().includes(search.toLowerCase()) ||
				org.description.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (type && type !== 'all') {
			filteredOrganizations = filteredOrganizations.filter(org => org.type === type);
		}

		return json({
			success: true,
			data: filteredOrganizations
		});
	} catch (err) {
		console.error('Error fetching organizations:', err);
		return json({
			success: false,
			error: 'Failed to fetch organizations'
		}, { status: 500 });
	}
};

// POST /api/organizations - Create a new organization
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.name || !data.type) {
			return json({
				success: false,
				error: 'Name and type are required'
			}, { status: 400 });
		}

		// Generate organization ID
		const orgId = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const newOrganization = {
			id: orgId,
			name: data.name,
			type: data.type,
			description: data.description || '',
			verified: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			...data
		};

		organizations.push(newOrganization);

		return json({
			success: true,
			data: newOrganization
		}, { status: 201 });
	} catch (err) {
		console.error('Error creating organization:', err);
		return json({
			success: false,
			error: 'Failed to create organization'
		}, { status: 500 });
	}
};
