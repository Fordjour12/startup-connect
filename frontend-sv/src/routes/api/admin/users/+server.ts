import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

// Mock admin user data
const mockUsers = [
	{
		id: 1,
		name: "John Doe",
		email: "john.doe@example.com",
		role: "founder",
		status: "active",
		createdAt: "2024-01-15",
		lastLogin: "2024-01-20"
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane.smith@example.com",
		role: "investor",
		status: "active",
		createdAt: "2024-01-10",
		lastLogin: "2024-01-19"
	},
	{
		id: 3,
		name: "Mike Johnson",
		email: "mike.johnson@example.com",
		role: "support",
		status: "inactive",
		createdAt: "2024-01-05",
		lastLogin: "2024-01-18"
	}
];

// GET /api/admin/users - List all users
export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search');
	const role = url.searchParams.get('role');
	const status = url.searchParams.get('status');

	let filteredUsers = [...mockUsers];

	if (search) {
		filteredUsers = filteredUsers.filter(user =>
			user.name.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase())
		);
	}

	if (role && role !== 'all') {
		filteredUsers = filteredUsers.filter(user => user.role === role);
	}

	if (status && status !== 'all') {
		filteredUsers = filteredUsers.filter(user => user.status === status);
	}

	return json({
		users: filteredUsers,
		total: filteredUsers.length,
		success: true
	});
};

// POST /api/admin/users - Create new user
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const newUser = {
		id: mockUsers.length + 1,
		name: body.name,
		email: body.email,
		role: body.role || 'founder',
		status: 'active',
		createdAt: new Date().toISOString().split('T')[0],
		lastLogin: new Date().toISOString().split('T')[0]
	};

	mockUsers.push(newUser);

	return json({
		user: newUser,
		success: true,
		message: 'User created successfully'
	});
};
