import type { PageServerLoad } from "./$types";

export interface Founder {
	id: string;
	name: string;
	avatar: string;
	company: string;
	status: 'online' | 'offline';
	lastMessageDate: string;
	lastMessage: string;
	unread: number;
}

export interface Message {
	id: string;
	senderId: string; // Can be 'investor' or a founder's ID
	receiverId?: string; // The ID of the recipient (if not a group message, etc.)
	text: string;
	timestamp: string;
	isRead: boolean;
	status?: "sent" | "delivered" | "read";
	reactions?: { [emoji: string]: string[] }; // User IDs who reacted
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Fetch founder data
	const founders: Founder[] = [
		{
			id: "founder-1",
			name: "Elena Rodriguez",
			avatar: "/placeholder-user.jpg",
			company: "TechFlow AI",
			status: "online",
			lastMessageDate: "10:30 AM",
			lastMessage: "Just sent over the Q3 report.",
			unread: 2,
		},
		{
			id: "founder-2",
			name: "Marcus Chen",
			avatar: "/placeholder-user.jpg",
			company: "HealthNova",
			status: "offline",
			lastMessageDate: "Yesterday",
			lastMessage: "We're on track for the Alpha launch.",
			unread: 0,
		},
		{
			id: "founder-3",
			name: "Aisha Khan",
			avatar: "/placeholder-user.jpg",
			company: "FinLeap",
			status: "online",
			lastMessageDate: "Mon",
			lastMessage: "Can we schedule a quick sync?",
			unread: 1,
		},
	];

	// Fetch messages
	const messages: Message[] = [
		{
			id: "msg-1",
			senderId: "founder-1",
			receiverId: "investor",
			text: "Just sent over the Q3 report.",
			timestamp: "10:30 AM",
			isRead: false,
		},
		{
			id: "msg-2",
			senderId: "investor",
			receiverId: "founder-1",
			text: "Thanks, Elena! Will review it shortly.",
			timestamp: "10:32 AM",
			isRead: true,
		},
		{
			id: "msg-3",
			senderId: "founder-1",
			receiverId: "investor",
			text: "Great, let me know if you have questions.",
			timestamp: "10:33 AM",
			isRead: false,
		},
		{
			id: "msg-4",
			senderId: "founder-2",
			receiverId: "investor",
			text: "We're on track for the Alpha launch.",
			timestamp: "Yesterday",
			isRead: true,
		},
		{
			id: "msg-5",
			senderId: "investor",
			receiverId: "founder-2",
			text: "Excellent news, Marcus! Keep up the great work.",
			timestamp: "Yesterday",
			isRead: true,
		},
		{
			id: "msg-6",
			senderId: "founder-3",
			receiverId: "investor",
			text: "Can we schedule a quick sync?",
			timestamp: "Mon",
			isRead: false,
		},
	];

	return {
		founders,
		messages,
	};
}; 