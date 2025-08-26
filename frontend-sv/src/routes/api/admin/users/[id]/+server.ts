import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

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

// GET /api/admin/users/[id] - Get specific user
export const GET: RequestHandler = async ({ params }) => {
	const userId = parseInt(params.id);
	const user = mockUsers.find(u => u.id === userId);

	if (!user) {
		throw error(404, 'User not found');
	}

	return json({
		user,
		success: true
	});
};

// PUT /api/admin/users/[id] - Update user
export const PUT: RequestHandler = async ({ params, request }) => {
	const userId = parseInt(params.id);
	const body = await request.json();

	const userIndex = mockUsers.findIndex(u => u.id === userId);

	if (userIndex === -1) {
		throw error(404, 'User not found');
	}

	// Update user with new data
	mockUsers[userIndex] = {
		...mockUsers[userIndex],
		...body
	};

	return json({
		user: mockUsers[userIndex],
		success: true,
		message: 'User updated successfully'
	});
};

// DELETE /api/admin/users/[id] - Delete user
export const DELETE: RequestHandler = async ({ params }) => {
	const userId = parseInt(params.id);
	const userIndex = mockUsers.findIndex(u => u.id === userId);

	if (userIndex === -1) {
		throw error(404, 'User not found');
	}

	const deletedUser = mockUsers.splice(userIndex, 1)[0];

	return json({
		user: deletedUser,
		success: true,
		message: 'User deleted successfully'
	});
};
