export interface Founder {
	id: string;
	name: string;
	company: string;
	avatar: string;
	status: "online" | "offline";
	lastMessage: string;
	lastMessageDate: string;
	unread: number;
}

// Type for messages as loaded from the server/PageData
export interface ServerMessage {
	id: string;
	senderId: string;
	receiverId: string; // Mock data consistently provides this
	text: string;
	timestamp: string;
	isRead: boolean;
}

// Client-side rich Message type used within the Svelte component
export interface Message extends ServerMessage {
	// receiverId is already required in ServerMessage based on mock data
	status?: "sent" | "delivered" | "read";
	reactions?: { [emoji: string]: string[] }; // User IDs who reacted
} 