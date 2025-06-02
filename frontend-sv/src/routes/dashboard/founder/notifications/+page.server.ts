import type { PageServerLoad } from './$types';
import { founderNotifications, getNotificationStats } from '$lib/data/founder-notifications';

export const load: PageServerLoad = async () => {
	// In a real application, this would fetch from a database
	// We're using the mock data for demonstration

	return {
		notifications: founderNotifications,
		stats: getNotificationStats(founderNotifications)
	};
}; 