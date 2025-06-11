import { env } from '$env/dynamic/private';
import { ApiEndpoint } from '@/endpoints';
import type { Token } from '@/types/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = String(data.get('email') || '');
		const password = String(data.get('password') || '');

		const response = await fetch(`${env.DEPLOYMENT_API_URL}${ApiEndpoint.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				username: email,
				password: password
			}).toString(),
		});

		if (!response.ok) {
			return fail(400, {
				message: "Invalid email or password"
			});
		}

		const tokenData: Token = await response.json();

		// Set secure HTTP-only cookie
		cookies.set('access_token', tokenData.access_token, {
			path: '/',
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		const accessToken = tokenData.access_token;

		// Get user info after successful login
		const userResponse = await fetch(
			`${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_USER}`,
			{
				headers: {
					Authorization: `bearer ${accessToken}`,
				},
			},
		);

		let redirectPath = '/dashboard';

		if (userResponse.ok) {
			let userData;
			try {
				const userResponseText = await userResponse.text();
				userData = userResponseText ? JSON.parse(userResponseText) : {};
			} catch (parseError) {
				userData = {};
			}

			// Store user info in a separate cookie for client-side access
			cookies.set("user", JSON.stringify(userData), {
				path: "/",
				httpOnly: false,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			// Redirect to dashboard based on user role
			redirectPath =
				userData.role === "founder"
					? "/dashboard/founder"
					: userData.role === "investor"
						? "/dashboard/investor"
						: "/dashboard/supporter";
		}

		redirect(302, redirectPath);
	},
} satisfies Actions;