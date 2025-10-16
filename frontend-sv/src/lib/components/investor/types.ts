export interface Founder {
	id: number;
	name: string;
	company: string;
	avatar: string;
	status: 'online' | 'offline';
	lastMessage: string;
	lastMessageDate: string;
	unread: number;
}

export interface Message {
	id: number;
	senderId: string;
	text: string;
	timestamp: string;
	isRead: boolean;
}

export interface Meeting {
	id: number;
	type: string;
	date: string;
	time: string;
	location: string;
	founder: string;
	company: string;
	agenda: string;
}

export interface Update {
	id: number;
	title: string;
	company: string;
	date: string;
	read: boolean;
	metrics: {
		revenue: string;
		users: string;
		burn: string;
		runway: string;
	};
	highlights: string[];
	challenges: string[];
}

export interface Note {
	id: number;
	company: string;
	date: string;
	title: string;
	content: string;
	tags: string[];
}

export interface NewNote {
	company: string;
	title: string;
	content: string;
	tags: string;
} 