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

// Investor recommendation types
export interface RecommendationReason {
	type: string;
	description: string;
	score?: number;
}

export interface InvestorRecommendation {
	id: string;
	name: string;
	firm: string;
	title?: string;
	avatar?: string;
	score: number;
	investment_focus: string[];
	preferred_stages: string[];
	location?: string;
	funding_range?: {
		min_amount: number;
		max_amount: number;
	};
	reasons: RecommendationReason[];
	total_investments?: number;
	bio?: string;
}

export interface RecommendationResponse {
	recommendations: InvestorRecommendation[];
	startup_profile: {
		name: string;
		industry: string;
		funding_stage: string;
		location?: string;
	};
	total_count: number;
	algorithm_version: string;
} 