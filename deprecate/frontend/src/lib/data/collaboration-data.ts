// Mock data for Collaboration & Communication dashboard section
export const collaborationData = {
    investorUpdates: {
        upcoming: [
            {
                id: "IU-001",
                title: "Q4 2023 Investor Update",
                scheduledFor: "2023-12-15",
                status: "draft",
                recipients: 24,
            },
            {
                id: "IU-002",
                title: "Product Launch Update",
                scheduledFor: "2023-11-30",
                status: "scheduled",
                recipients: 18,
            }
        ],
        recent: [
            {
                id: "IU-003",
                title: "Q3 2023 Investor Update",
                sentDate: "2023-10-15",
                openRate: 92,
                engagement: 78,
                feedback: 8,
            },
            {
                id: "IU-004",
                title: "Funding Round Close Update",
                sentDate: "2023-09-30",
                openRate: 95,
                engagement: 85,
                feedback: 12,
            }
        ],
        metrics: {
            averageOpenRate: 94,
            averageEngagement: 82,
            totalUpdates: 12,
            topPerforming: "Q3 2023 Investor Update"
        }
    },
    teamCollaboration: {
        recentComments: [
            {
                id: "CM-001",
                user: {
                    name: "Sarah Chen",
                    avatar: "/avatars/sarah.jpg",
                    role: "Product Lead"
                },
                content: "Our NPS score has improved significantly after the latest feature release.",
                target: "Customer Metrics",
                timestamp: "2023-10-28T14:30:00Z",
                reactions: 3
            },
            {
                id: "CM-002",
                user: {
                    name: "Mike Johnson",
                    avatar: "/avatars/mike.jpg",
                    role: "Sales Director"
                },
                content: "We should highlight the enterprise customer growth in the next board meeting.",
                target: "Sales Metrics",
                timestamp: "2023-10-27T16:45:00Z",
                reactions: 5
            }
        ],
        tasks: [
            {
                id: "TK-001",
                title: "Review Q4 revenue projections",
                assignee: "Financial Team",
                dueDate: "2023-11-05",
                status: "in-progress",
                priority: "high"
            },
            {
                id: "TK-002",
                title: "Prepare customer success stories",
                assignee: "Marketing Team",
                dueDate: "2023-11-10",
                status: "pending",
                priority: "medium"
            }
        ],
        decisions: [
            {
                id: "DC-001",
                title: "Q4 Marketing Budget Allocation",
                date: "2023-10-20",
                context: "Based on Q3 performance metrics and growth targets",
                outcome: "Increased digital marketing budget by 25%",
                stakeholders: ["Marketing", "Finance", "Executive"]
            },
            {
                id: "DC-002",
                title: "New Feature Prioritization",
                date: "2023-10-15",
                context: "Customer feedback analysis and market research",
                outcome: "Prioritized API integration features for Q4",
                stakeholders: ["Product", "Engineering", "Sales"]
            }
        ]
    },
    boardManagement: {
        upcomingMeeting: {
            date: "2023-11-15",
            time: "14:00",
            type: "Quarterly Board Meeting",
            attendees: 8,
            agenda: [
                "Q3 Performance Review",
                "Q4 Strategy and Targets",
                "Funding Round Planning",
                "Product Roadmap Update"
            ]
        },
        materials: [
            {
                id: "BM-001",
                title: "Q3 2023 Board Deck",
                lastModified: "2023-10-25",
                status: "draft",
                contributors: 3
            },
            {
                id: "BM-002",
                title: "Product Strategy Presentation",
                lastModified: "2023-10-20",
                status: "ready",
                contributors: 2
            }
        ],
        resolutions: [
            {
                id: "BR-001",
                title: "Approval of Series A Terms",
                date: "2023-09-15",
                status: "implemented",
                nextSteps: "Complete documentation with legal team"
            },
            {
                id: "BR-002",
                title: "Executive Team Expansion",
                date: "2023-09-15",
                status: "in-progress",
                nextSteps: "Finalize CTO candidate selection"
            }
        ],
        metrics: {
            meetingsThisYear: 4,
            averageAttendance: 92,
            resolutionsImplemented: 8,
            documentsShared: 24
        }
    }
}; 