// Mock data for Growth & Traction Tools dashboard section
export const growthData = {
    metrics: {
        northStar: {
            name: "Monthly Active Users",
            current: 12580,
            previous: 10450,
            growth: 20.4,
            target: 15000,
            progressPercentage: 83.9,
            history: [8200, 9100, 9800, 10450, 11200, 12580],
            contributingFactors: [
                {
                    name: "Organic Acquisition",
                    value: 4830,
                    change: 18.2,
                    impact: 38.4
                },
                {
                    name: "Paid Acquisition",
                    value: 3220,
                    change: 24.8,
                    impact: 25.6
                },
                {
                    name: "Referrals",
                    value: 2890,
                    change: 15.6,
                    impact: 23.0
                },
                {
                    name: "Reactivation",
                    value: 1640,
                    change: 22.4,
                    impact: 13.0
                }
            ]
        },
        growthModels: [
            {
                id: "GM-001",
                name: "Baseline Growth Model",
                description: "Conservative growth projection based on current metrics",
                inputs: [
                    { name: "Monthly Growth Rate", value: 8, unit: "%" },
                    { name: "Churn Rate", value: 3.5, unit: "%" },
                    { name: "Starting Users", value: 12580, unit: "" },
                    { name: "Timeframe", value: 12, unit: "months" }
                ],
                projections: [12580, 13340, 14150, 15000, 15910, 16880, 17910, 19000, 20170, 21400, 22720, 24120, 25600],
                isActive: true
            },
            {
                id: "GM-002",
                name: "Aggressive Growth Model",
                description: "Optimistic growth scenario with increased marketing spend",
                inputs: [
                    { name: "Monthly Growth Rate", value: 12, unit: "%" },
                    { name: "Churn Rate", value: 3, unit: "%" },
                    { name: "Starting Users", value: 12580, unit: "" },
                    { name: "Timeframe", value: 12, unit: "months" }
                ],
                projections: [12580, 13700, 14900, 16250, 17750, 19350, 21100, 23000, 25050, 27300, 29780, 32460, 35380],
                isActive: false
            }
        ],
        experiments: [
            {
                id: "EXP-001",
                name: "Referral Program Incentive Increase",
                status: "completed",
                hypothesis: "Increasing referral reward from $10 to $25 will improve referral conversion by 30%",
                startDate: "2023-09-01",
                endDate: "2023-09-30",
                metrics: [
                    { name: "Referral Sends", before: 1240, after: 1380, change: 11.3 },
                    { name: "Referral Conversion", before: 18.5, after: 24.2, change: 30.8 },
                    { name: "CAC", before: 42, after: 38, change: -9.5 }
                ],
                conclusion: "Hypothesis validated. The increased incentive improved conversion by 30.8%, exceeding our target of 30%.",
                nextSteps: "Roll out the increased referral reward permanently and consider testing tiered rewards."
            },
            {
                id: "EXP-002",
                name: "Onboarding Flow Redesign",
                status: "in-progress",
                hypothesis: "Simplifying onboarding from 5 steps to 3 will improve activation rate by 15%",
                startDate: "2023-10-15",
                endDate: "2023-11-15",
                metrics: [
                    { name: "Completion Rate", before: 68, after: null, change: null },
                    { name: "Time to Complete", before: 240, after: null, change: null },
                    { name: "Activation Rate", before: 42, after: null, change: null }
                ],
                conclusion: null,
                nextSteps: null
            }
        ],
        retention: {
            cohorts: [
                {
                    name: "Jul 2023",
                    size: 2450,
                    retention: [100, 82, 74, 68, 64, 61]
                },
                {
                    name: "Aug 2023",
                    size: 2780,
                    retention: [100, 84, 76, 71, 67]
                },
                {
                    name: "Sep 2023",
                    size: 3120,
                    retention: [100, 86, 78, 73]
                },
                {
                    name: "Oct 2023",
                    size: 3580,
                    retention: [100, 88, 80]
                },
                {
                    name: "Nov 2023",
                    size: 4050,
                    retention: [100, 89]
                }
            ],
            retentionStages: ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
        }
    },
    marketing: {
        channelPerformance: [
            {
                channel: "Paid Search",
                spend: 18500,
                visitors: 12400,
                leads: 620,
                customers: 124,
                cac: 149.2,
                roi: 220
            },
            {
                channel: "Social Media",
                spend: 14200,
                visitors: 28600,
                leads: 715,
                customers: 86,
                cac: 165.1,
                roi: 180
            },
            {
                channel: "Content Marketing",
                spend: 9800,
                visitors: 32400,
                leads: 810,
                customers: 162,
                cac: 60.5,
                roi: 490
            },
            {
                channel: "Email Marketing",
                spend: 6200,
                visitors: 14500,
                leads: 580,
                customers: 145,
                cac: 42.8,
                roi: 690
            },
            {
                channel: "Referral Program",
                spend: 5400,
                visitors: 8200,
                leads: 410,
                customers: 123,
                cac: 43.9,
                roi: 670
            }
        ],
        campaigns: [
            {
                id: "CAM-001",
                name: "Fall Product Launch",
                status: "active",
                startDate: "2023-10-01",
                endDate: "2023-11-15",
                budget: 24000,
                spent: 18600,
                channels: ["Paid Search", "Social Media", "Email"],
                performance: {
                    impressions: 842000,
                    clicks: 42100,
                    leads: 2105,
                    customers: 316,
                    revenue: 94800
                }
            },
            {
                id: "CAM-002",
                name: "Enterprise Solution Webinar",
                status: "completed",
                startDate: "2023-09-15",
                endDate: "2023-10-15",
                budget: 12000,
                spent: 12000,
                channels: ["Email", "Content Marketing", "Paid Search"],
                performance: {
                    impressions: 520000,
                    clicks: 26000,
                    leads: 1820,
                    customers: 182,
                    revenue: 218400
                }
            }
        ],
        contentPerformance: [
            {
                id: "CONT-001",
                title: "Ultimate Guide to Product Analytics",
                type: "Blog Post",
                published: "2023-10-10",
                views: 12400,
                engagement: 4.2,
                conversionRate: 3.8,
                leads: 471
            },
            {
                id: "CONT-002",
                title: "How to Build a Data-Driven Culture",
                type: "Whitepaper",
                published: "2023-09-20",
                views: 5800,
                engagement: 6.8,
                conversionRate: 8.2,
                leads: 476
            },
            {
                id: "CONT-003",
                title: "Product Demo Webinar",
                type: "Webinar",
                published: "2023-10-25",
                views: 3200,
                engagement: 32.5,
                conversionRate: 12.4,
                leads: 397
            },
            {
                id: "CONT-004",
                title: "Customer Success Stories",
                type: "Case Study",
                published: "2023-10-05",
                views: 4100,
                engagement: 5.6,
                conversionRate: 7.5,
                leads: 308
            }
        ],
        optimizationSuggestions: [
            {
                id: "OPT-001",
                title: "Increase Content Marketing Budget",
                description: "Content marketing has the lowest CAC ($60.5) and highest ROI (490%). Consider reallocating 15% of the paid search budget to content marketing.",
                potential: "Could lower overall CAC by 8% and increase ROI by 12%",
                difficulty: "medium"
            },
            {
                id: "OPT-002",
                title: "Optimize Social Media Targeting",
                description: "Social media has high visitor numbers but low conversion. Refining audience targeting could improve lead quality.",
                potential: "Could increase social media conversion by 25-40%",
                difficulty: "high"
            },
            {
                id: "OPT-003",
                title: "Expand Email Marketing Efforts",
                description: "Email marketing shows strong ROI (690%) but has relatively low budget allocation.",
                potential: "Doubling email budget could yield 85% more customers at similar CAC",
                difficulty: "low"
            }
        ]
    },
    sales: {
        pipeline: {
            stages: [
                {
                    name: "Lead",
                    count: 520,
                    value: 7800000,
                    conversion: null
                },
                {
                    name: "Qualified",
                    count: 320,
                    value: 4800000,
                    conversion: 61.5
                },
                {
                    name: "Demo",
                    count: 180,
                    value: 2700000,
                    conversion: 56.3
                },
                {
                    name: "Proposal",
                    count: 85,
                    value: 1275000,
                    conversion: 47.2
                },
                {
                    name: "Negotiation",
                    count: 42,
                    value: 630000,
                    conversion: 49.4
                },
                {
                    name: "Closed Won",
                    count: 28,
                    value: 420000,
                    conversion: 66.7
                }
            ],
            velocityDays: 48,
            winRate: 33.0,
            avgDealSize: 15000
        },
        deals: [
            {
                id: "DEAL-001",
                company: "Enterprise Solutions Inc.",
                value: 120000,
                stage: "Negotiation",
                probability: 80,
                expectedValue: 96000,
                nextStep: "Contract review",
                owner: "Sarah Johnson",
                closeDate: "2023-11-30"
            },
            {
                id: "DEAL-002",
                company: "Tech Innovators",
                value: 85000,
                stage: "Demo",
                probability: 50,
                expectedValue: 42500,
                nextStep: "Technical validation call",
                owner: "Michael Chen",
                closeDate: "2023-12-15"
            },
            {
                id: "DEAL-003",
                company: "Global Services Co",
                value: 150000,
                stage: "Proposal",
                probability: 60,
                expectedValue: 90000,
                nextStep: "Executive presentation",
                owner: "Jessica Williams",
                closeDate: "2023-12-05"
            },
            {
                id: "DEAL-004",
                company: "Digital Solutions Ltd",
                value: 72000,
                stage: "Qualified",
                probability: 30,
                expectedValue: 21600,
                nextStep: "Discovery call",
                owner: "David Rodriguez",
                closeDate: "2024-01-10"
            }
        ],
        forecast: {
            thisQuarter: {
                pipeline: 2850000,
                weighted: 1140000,
                target: 1000000,
                closed: 680000,
                projected: 1080000,
                attainment: 108
            },
            nextQuarter: {
                pipeline: 3400000,
                weighted: 1190000,
                target: 1250000,
                closed: 0,
                projected: 950000,
                attainment: 76
            },
            byMonth: [
                { month: "Oct 2023", projected: 340000, actual: 320000 },
                { month: "Nov 2023", projected: 360000, actual: 360000 },
                { month: "Dec 2023", projected: 380000, actual: null },
                { month: "Jan 2024", projected: 320000, actual: null },
                { month: "Feb 2024", projected: 310000, actual: null },
                { month: "Mar 2024", projected: 320000, actual: null }
            ]
        },
        teamPerformance: [
            {
                name: "Sarah Johnson",
                role: "Enterprise Account Executive",
                deals: 8,
                pipeline: 720000,
                closed: 280000,
                attainment: 112,
                avgDealSize: 35000,
                winRate: 42
            },
            {
                name: "Michael Chen",
                role: "SMB Account Executive",
                deals: 14,
                pipeline: 420000,
                closed: 180000,
                attainment: 90,
                avgDealSize: 12850,
                winRate: 38
            },
            {
                name: "Jessica Williams",
                role: "Enterprise Account Executive",
                deals: 6,
                pipeline: 680000,
                closed: 250000,
                attainment: 100,
                avgDealSize: 41600,
                winRate: 36
            },
            {
                name: "David Rodriguez",
                role: "SMB Account Executive",
                deals: 18,
                pipeline: 520000,
                closed: 220000,
                attainment: 110,
                avgDealSize: 12200,
                winRate: 44
            }
        ]
    }
}; 