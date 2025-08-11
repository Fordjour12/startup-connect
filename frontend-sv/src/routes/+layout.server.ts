import type { MetaTagsProps } from 'svelte-meta-tags';
import { auth } from '@/auth';

export const load = async ({ url, request }: { url: URL; request: Request }) => {
	// Get session from Better Auth
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const baseMetaTags = Object.freeze({
		title: 'Startup Connect - Connecting Visionary Startups with Strategic Investors',
		description:
			'Join our platform to connect with the right investors, streamline your fundraising, and accelerate your startup\'s growth with our AI-powered tools.',
		url: url.origin,
		image: `${url.origin}/logo.svg`,
		type: 'website',
		og: {
			title: 'Startup Connect - Connecting Visionary Startups with Strategic Investors',
			description:
				'Join our platform to connect with the right investors, streamline your fundraising, and accelerate your startup\'s growth with our AI-powered tools.',
			image: `${url.origin}/logo.svg`,
			imageAlt: 'Startup Connect Logo',
			type: 'website',
			url: url.origin
		},
		twitter: {
			title: 'Startup Connect - Connecting Visionary Startups with Strategic Investors',
			description:
				'Join our platform to connect with the right investors, streamline your fundraising, and accelerate your startup\'s growth with our AI-powered tools.',
			image: `${url.origin}/logo.svg`,
			imageAlt: 'Startup Connect Logo',
			card: 'summary_large_image'
		}
	}) satisfies MetaTagsProps;

	return {
		metaTags: baseMetaTags,
		user: session?.user || null,
		isLoggedIn: !!session?.user
	};
};