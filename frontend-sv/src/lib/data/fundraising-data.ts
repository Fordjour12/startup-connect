// Mock data for Fundraising Enhancements dashboard section
export const fundraisingData = {
    pipeline: {
        stages: [
            {
                name: "Contacted",
                count: 34,
                amount: 8500000,
                color: "#60a5fa" // blue-400
            },
            {
                name: "Pitched",
                count: 18,
                amount: 6200000,
                color: "#a78bfa" // violet-400
            },
            {
                name: "Due Diligence",
                count: 8,
                amount: 3500000,
                color: "#f472b6" // pink-400
            },
            {
                name: "Committed",
                count: 5,
                amount: 2100000,
                color: "#4ade80" // green-400
            }
        ],
        conversionRates: [
            { from: "Contacted", to: "Pitched", rate: 52.9 },
            { from: "Pitched", to: "Due Diligence", rate: 44.4 },
            { from: "Due Diligence", to: "Committed", rate: 62.5 }
        ],
        recentInvestors: [
            {
                id: "INV-001",
                name: "Sequoia Capital",
                stage: "Due Diligence",
                amount: 750000,
                lastContact: "2023-10-25",
                notes: "Completing financial review, follow-up scheduled for next week",
                priority: "high"
            },
            {
                id: "INV-002",
                name: "Andreessen Horowitz",
                stage: "Pitched",
                amount: 1000000,
                lastContact: "2023-10-22",
                notes: "Positive feedback on pitch, waiting for partner meeting",
                priority: "medium"
            },
            {
                id: "INV-003",
                name: "Y Combinator",
                stage: "Committed",
                amount: 500000,
                lastContact: "2023-10-18",
                notes: "Term sheet received, legal review in progress",
                priority: "high"
            }
        ],
        targetLists: [
            {
                id: "TL-001",
                name: "Series A Strategic Investors",
                description: "Investors with expertise in enterprise SaaS",
                count: 24,
                lastUpdated: "2023-10-20"
            },
            {
                id: "TL-002",
                name: "Angel Investors",
                description: "High net worth individuals in tech industry",
                count: 18,
                lastUpdated: "2023-10-15"
            }
        ]
    },
    terms: {
        activeComparisons: [
            {
                id: "TC-001",
                name: "Series A Term Sheet Comparison",
                createdAt: "2023-10-22",
                offers: [
                    {
                        investor: "Sequoia Capital",
                        valuation: 12000000,
                        amount: 3000000,
                        equity: 20,
                        proRata: true,
                        boardSeat: true,
                        liquidationPreference: "1x",
                        participationCap: "1x",
                        offerValidUntil: "2023-11-15"
                    },
                    {
                        investor: "Andreessen Horowitz",
                        valuation: 15000000,
                        amount: 3500000,
                        equity: 18.9,
                        proRata: true,
                        boardSeat: true,
                        liquidationPreference: "1x",
                        participationCap: "None",
                        offerValidUntil: "2023-11-10"
                    }
                ]
            }
        ],
        capTableScenarios: [
            {
                id: "CTS-001",
                name: "Current Cap Table",
                totalShares: 10000000,
                ownership: [
                    { holder: "Founders", shares: 6500000, percentage: 65 },
                    { holder: "Early Investors", shares: 2000000, percentage: 20 },
                    { holder: "Employee Pool", shares: 1500000, percentage: 15 }
                ]
            },
            {
                id: "CTS-002",
                name: "Post Series A (Sequoia)",
                totalShares: 12500000,
                ownership: [
                    { holder: "Founders", shares: 6500000, percentage: 52 },
                    { holder: "Early Investors", shares: 2000000, percentage: 16 },
                    { holder: "Employee Pool", shares: 1500000, percentage: 12 },
                    { holder: "Sequoia Capital", shares: 2500000, percentage: 20 }
                ]
            },
            {
                id: "CTS-003",
                name: "Post Series A (A16Z)",
                totalShares: 12345679,
                ownership: [
                    { holder: "Founders", shares: 6500000, percentage: 52.65 },
                    { holder: "Early Investors", shares: 2000000, percentage: 16.2 },
                    { holder: "Employee Pool", shares: 1500000, percentage: 12.15 },
                    { holder: "Andreessen Horowitz", shares: 2345679, percentage: 19 }
                ]
            }
        ],
        valuationMethods: [
            {
                method: "Discounted Cash Flow",
                value: 14200000,
                multiplier: "5x Revenue"
            },
            {
                method: "Comparable Companies",
                value: 15500000,
                multiplier: "6x Revenue"
            },
            {
                method: "Venture Capital Method",
                value: 12800000,
                multiplier: "10x Exit in 5 years"
            }
        ],
        safeNoteCalculations: [
            {
                id: "SN-001",
                type: "SAFE",
                amount: 500000,
                valuation: 8000000,
                discount: 20,
                cap: 10000000,
                conversionScenario: "Series A at $15M valuation",
                sharesReceived: 625000,
                effectiveValuation: 8000000
            },
            {
                id: "SN-002",
                type: "Convertible Note",
                amount: 250000,
                valuation: null,
                interestRate: 5,
                term: 24,
                discount: 15,
                cap: 8000000,
                conversionScenario: "Series A at $12M valuation",
                sharesReceived: 275000,
                effectiveValuation: 6800000
            }
        ]
    },
    documentation: {
        templates: [
            {
                id: "DOC-001",
                name: "SAFE Agreement",
                description: "Simple Agreement for Future Equity",
                category: "Investment",
                lastUpdated: "2023-09-10",
                downloads: 12
            },
            {
                id: "DOC-002",
                name: "Series A Term Sheet",
                description: "Standard term sheet for Series A financing",
                category: "Term Sheet",
                lastUpdated: "2023-09-15",
                downloads: 8
            },
            {
                id: "DOC-003",
                name: "Investor Update Template",
                description: "Monthly investor update email template",
                category: "Communication",
                lastUpdated: "2023-09-20",
                downloads: 15
            },
            {
                id: "DOC-004",
                name: "Due Diligence Checklist",
                description: "Comprehensive list of documents for due diligence",
                category: "Due Diligence",
                lastUpdated: "2023-09-25",
                downloads: 10
            }
        ],
        activeDocuments: [
            {
                id: "ACTIVE-001",
                name: "Series A Term Sheet - Sequoia",
                category: "Term Sheet",
                status: "In Negotiation",
                versions: 3,
                lastUpdated: "2023-10-24",
                sharedWith: ["Legal Team", "Sequoia Capital"]
            },
            {
                id: "ACTIVE-002",
                name: "SAFE Agreement - Angel Investor",
                category: "Investment",
                status: "Ready for Signature",
                versions: 2,
                lastUpdated: "2023-10-22",
                sharedWith: ["Legal Team", "John Smith (Angel)"]
            }
        ],
        complianceChecklist: [
            {
                id: "COMP-001",
                requirement: "Form D Filing (SEC)",
                description: "Required for securities exemption under Regulation D",
                status: "Completed",
                dueDate: "2023-09-15"
            },
            {
                id: "COMP-002",
                requirement: "Investor Accreditation",
                description: "Verify accredited investor status for all participants",
                status: "In Progress",
                dueDate: "2023-11-01"
            },
            {
                id: "COMP-003",
                requirement: "Board Approval",
                description: "Board resolution approving fundraising terms",
                status: "Pending",
                dueDate: "2023-10-30"
            },
            {
                id: "COMP-004",
                requirement: "State Securities Filings",
                description: "Blue sky filings in relevant states",
                status: "Not Started",
                dueDate: "2023-11-15"
            }
        ]
    }
}; 