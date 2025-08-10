// Types for founder notifications system
export interface FounderNotification {
	id: number;
	title: string;
	description: string;
	timestamp: string;
	read: boolean;
	type: FounderNotificationType;
	priority: 'high' | 'medium' | 'low';
	actionRequired: boolean;
	actionText?: string;
	actionUrl?: string;
	relatedEntity?: {
		type: 'investor' | 'team' | 'customer' | 'metric' | 'task';
		id: string | number;
		name: string;
	};
}

export type FounderNotificationType =
	'investor_update' |
	'funding_opportunity' |
	'customer_feedback' |
	'team_update' |
	'milestone_achieved' |
	'metric_alert' |
	'document_shared' |
	'meeting_scheduled' |
	'task_assigned' |
	'task_completed' |
	'feature_request';

export interface NotificationStats {
	total: number;
	unread: number;
	highPriority: number;
	actionRequired: number;
}

// Mock data for founder notifications
export const founderNotifications: FounderNotification[] = [
	{
		id: 1,
		title: "New investment interest",
		description: "Angels Capital has expressed interest in your startup.",
		timestamp: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
		read: false,
		type: "funding_opportunity",
		priority: "high",
		actionRequired: true,
		actionText: "Review details",
		actionUrl: "/dashboard/founder/fundraising",
		relatedEntity: {
			type: "investor",
			id: 101,
			name: "Angels Capital"
		}
	},
	{
		id: 2,
		title: "Customer NPS score increased",
		description: "Your NPS score has increased by 15 points this month.",
		timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
		read: false,
		type: "metric_alert",
		priority: "medium",
		actionRequired: false,
		relatedEntity: {
			type: "metric",
			id: "nps",
			name: "NPS Score"
		}
	},
	{
		id: 3,
		title: "Q2 Investor Update due",
		description: "Your quarterly investor update is due in 3 days.",
		timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
		read: true,
		type: "investor_update",
		priority: "high",
		actionRequired: true,
		actionText: "Prepare update",
		actionUrl: "/dashboard/founder/collaboration"
	},
	{
		id: 4,
		title: "New feature request from Enterprise customer",
		description: "TechCorp has requested API integration features.",
		timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
		read: false,
		type: "feature_request",
		priority: "high",
		actionRequired: true,
		actionText: "Review request",
		actionUrl: "/dashboard/founder/insights",
		relatedEntity: {
			type: "customer",
			id: 42,
			name: "TechCorp"
		}
	},
	{
		id: 5,
		title: "Team member completed onboarding",
		description: "Sarah Johnson has completed all onboarding tasks.",
		timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
		read: true,
		type: "team_update",
		priority: "medium",
		actionRequired: false,
		relatedEntity: {
			type: "team",
			id: 12,
			name: "Sarah Johnson"
		}
	},
	{
		id: 6,
		title: "Monthly growth metrics report available",
		description: "Your April 2023 growth metrics report is ready for review.",
		timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
		read: true,
		type: "metric_alert",
		priority: "medium",
		actionRequired: true,
		actionText: "View report",
		actionUrl: "/dashboard/founder/growth"
	},
	{
		id: 7,
		title: "Customer feedback needs attention",
		description: "Several customers have reported issues with the new checkout flow.",
		timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
		read: false,
		type: "customer_feedback",
		priority: "high",
		actionRequired: true,
		actionText: "Review feedback",
		actionUrl: "/dashboard/founder/insights"
	},
	{
		id: 8,
		title: "Milestone achieved: 1,000 users",
		description: "Congratulations! Your startup has reached 1,000 active users.",
		timestamp: new Date(Date.now() - 6 * 86400000).toISOString(), // 6 days ago
		read: true,
		type: "milestone_achieved",
		priority: "low",
		actionRequired: false
	},
	{
		id: 9,
		title: "Board meeting scheduled",
		description: "A board meeting has been scheduled for May 15th at 2:00 PM.",
		timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
		read: true,
		type: "meeting_scheduled",
		priority: "medium",
		actionRequired: true,
		actionText: "Prepare agenda",
		actionUrl: "/dashboard/founder/collaboration"
	},
	{
		id: 10,
		title: "New competitor analysis",
		description: "Your team has shared a new competitor analysis document.",
		timestamp: new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago
		read: false,
		type: "document_shared",
		priority: "medium",
		actionRequired: true,
		actionText: "View document",
		actionUrl: "/dashboard/founder/insights"
	}
];

// Generate stats from notifications
export function getNotificationStats(notifications: FounderNotification[]): NotificationStats {
	return {
		total: notifications.length,
		unread: notifications.filter(n => !n.read).length,
		highPriority: notifications.filter(n => n.priority === 'high').length,
		actionRequired: notifications.filter(n => n.actionRequired).length
	};
}

// Group notifications by date
export function groupNotificationsByDate(notifications: FounderNotification[]): Record<string, FounderNotification[]> {
	const grouped: Record<string, FounderNotification[]> = {};

	notifications.forEach(notification => {
		const date = new Date(notification.timestamp);
		const now = new Date();
		const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

		let groupKey: string;

		if (diffInDays === 0) {
			groupKey = "Today";
		} else if (diffInDays === 1) {
			groupKey = "Yesterday";
		} else if (diffInDays < 7) {
			groupKey = "This Week";
		} else if (diffInDays < 30) {
			groupKey = "This Month";
		} else {
			groupKey = "Older";
		}

		if (!grouped[groupKey]) {
			grouped[groupKey] = [];
		}

		grouped[groupKey].push(notification);
	});

	// Sort notifications by timestamp within each group
	Object.keys(grouped).forEach(key => {
		grouped[key].sort((a, b) =>
			new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
	});

	return grouped;
}

// Format time ago from timestamp
export function formatTimeAgo(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} sec ago`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} min ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hr ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays === 1) {
		return "Yesterday";
	}

	if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	}

	const formatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric'
	});

	return formatter.format(date);
}

// Get notification type information (icon and styling)
export function getNotificationTypeInfo(type: FounderNotificationType): { icon: string; class: string } {
	switch (type) {
		case "funding_opportunity":
			return {
				icon: "💰",
				class: "bg-green-100 text-green-600"
			};
		case "investor_update":
			return {
				icon: "📊",
				class: "bg-blue-100 text-blue-600"
			};
		case "customer_feedback":
			return {
				icon: "💬",
				class: "bg-amber-100 text-amber-600"
			};
		case "team_update":
			return {
				icon: "👥",
				class: "bg-indigo-100 text-indigo-600"
			};
		case "milestone_achieved":
			return {
				icon: "🏆",
				class: "bg-purple-100 text-purple-600"
			};
		case "metric_alert":
			return {
				icon: "📈",
				class: "bg-blue-100 text-blue-600"
			};
		case "document_shared":
			return {
				icon: "📄",
				class: "bg-slate-100 text-slate-600"
			};
		case "meeting_scheduled":
			return {
				icon: "📅",
				class: "bg-red-100 text-red-600"
			};
		case "task_assigned":
			return {
				icon: "✅",
				class: "bg-amber-100 text-amber-600"
			};
		case "task_completed":
			return {
				icon: "✓",
				class: "bg-green-100 text-green-600"
			};
		case "feature_request":
			return {
				icon: "🔍",
				class: "bg-violet-100 text-violet-600"
			};
		default:
			return {
				icon: "📌",
				class: "bg-gray-100 text-gray-600"
			};
	}
} 