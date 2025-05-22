import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data with mock data

	// Fetch founder data
	const founders = [
		{
			id: 1,
			name: "Alex Johnson",
			company: "TechFlow AI",
			avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
			unread: 3,
			lastMessage: "I've prepared the monthly update report you requested.",
			lastMessageDate: "Today at 10:23 AM",
			status: "online"
		},
		{
			id: 2,
			name: "Sarah Chen",
			company: "HealthNova",
			avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=3CB371&color=fff",
			unread: 0,
			lastMessage: "Thanks for the feedback on our pitch deck!",
			lastMessageDate: "Yesterday at 3:45 PM",
			status: "offline"
		},
		{
			id: 3,
			name: "Michael Rodriguez",
			company: "FinLeap",
			avatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=9370DB&color=fff",
			unread: 1,
			lastMessage: "Can we schedule a call to discuss the Q3 results?",
			lastMessageDate: "Oct 18, 2023",
			status: "online"
		},
		{
			id: 4,
			name: "Emma Wilson",
			company: "GreenScale",
			avatar: "https://ui-avatars.com/api/?name=Emma+Wilson&background=F4A460&color=fff",
			unread: 0,
			lastMessage: "Let me know your thoughts on the new product feature.",
			lastMessageDate: "Oct 15, 2023",
			status: "offline"
		}
	];

	// Fetch messages for the first founder (default selected)
	const messages = [
		{
			id: 1,
			senderId: 1, // Founder
			text: "Hi there! I wanted to share our latest product metrics with you.",
			timestamp: "10:15 AM",
			isRead: true
		},
		{
			id: 2,
			senderId: "investor", // Current user (investor)
			text: "That sounds great! How's the user acquisition looking?",
			timestamp: "10:18 AM",
			isRead: true
		},
		{
			id: 3,
			senderId: 1,
			text: "We've seen a 25% increase in sign-ups since implementing the new onboarding flow you suggested.",
			timestamp: "10:20 AM",
			isRead: true
		},
		{
			id: 4,
			senderId: 1,
			text: "I've prepared the monthly update report you requested. Would you like me to walk you through it on a call?",
			timestamp: "10:23 AM",
			isRead: false
		}
	];

	// Fetch upcoming meetings
	const meetings = [
		{
			id: 1,
			founder: "Sarah Chen",
			company: "HealthNova",
			date: "Oct 25, 2023",
			time: "2:00 PM - 3:00 PM",
			type: "Board Meeting",
			location: "Virtual (Zoom)",
			agenda: "Q3 Results Review"
		},
		{
			id: 2,
			founder: "Alex Johnson",
			company: "TechFlow AI",
			date: "Oct 28, 2023",
			time: "10:30 AM - 11:30 AM",
			type: "Strategy Session",
			location: "Office",
			agenda: "Product Roadmap Discussion"
		},
		{
			id: 3,
			founder: "Michael Rodriguez",
			company: "FinLeap",
			date: "Nov 2, 2023",
			time: "1:00 PM - 2:00 PM",
			type: "Progress Update",
			location: "Virtual (Google Meet)",
			agenda: "Financial Review"
		}
	];

	// Fetch company updates
	const updates = [
		{
			id: 1,
			company: "TechFlow AI",
			date: "Oct 20, 2023",
			title: "Monthly Update - October 2023",
			metrics: {
				revenue: "$85,000 (+15% MoM)",
				users: "12,500 (+25% MoM)",
				burn: "$45,000",
				runway: "18 months"
			},
			highlights: [
				"Launched new AI feature with 60% user adoption",
				"Featured in TechCrunch article",
				"Hired new CTO from Google"
			],
			challenges: [
				"Slight delay in mobile app development",
				"Increasing customer acquisition costs"
			],
			read: false
		},
		{
			id: 2,
			company: "HealthNova",
			date: "Oct 15, 2023",
			title: "Q3 2023 Quarterly Report",
			metrics: {
				revenue: "$120,000 (+10% QoQ)",
				users: "5,200 (+8% QoQ)",
				burn: "$60,000",
				runway: "14 months"
			},
			highlights: [
				"FDA approval for main product",
				"Partnership with major hospital chain",
				"Successful Series A close"
			],
			challenges: [
				"Supply chain issues affecting hardware delivery",
				"Key engineering position still unfilled"
			],
			read: true
		}
	];

	// Fetch notes
	const notes = [
		{
			id: 1,
			company: "TechFlow AI",
			date: "Oct 18, 2023",
			title: "Product Strategy Notes",
			content: "Team shows strong execution on AI features. Consider introducing them to potential enterprise clients in our network. CEO is responsive to feedback and implements suggestions quickly.",
			tags: ["AI", "Product", "Growth"]
		},
		{
			id: 2,
			company: "HealthNova",
			date: "Oct 10, 2023",
			title: "Funding Strategy",
			content: "HealthNova should focus on metrics around patient outcomes before approaching Series B. Their regulatory strategy is sound, but they'll need support with commercial partnerships.",
			tags: ["Healthcare", "Regulatory", "Series B"]
		},
		{
			id: 3,
			company: "FinLeap",
			date: "Oct 5, 2023",
			title: "Team Assessment",
			content: "Strong technical team but still need a experienced CMO. Founders work well together but could use mentorship on go-to-market strategy.",
			tags: ["Team", "Marketing", "Hiring"]
		}
	];

	return {
		founders,
		messages,
		meetings,
		updates,
		notes
	};
}; 