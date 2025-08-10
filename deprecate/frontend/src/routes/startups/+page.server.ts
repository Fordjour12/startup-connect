import type { PageServerLoad } from './$types';

// Define the Startup type
export interface Startup {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
    funding_stage: string;
    funding_goal: number;
    founded_year: string;
    team_size: number;
    website: string;
    logo_url: string;
    pitch_deck_url: string;
    business_model: string;
    target_market: string;
    competitors: string;
    founder_id: string;
    team_members: {
        additionalProp1: Record<string, unknown>;
    };
    funding: {
        additionalProp1: Record<string, unknown>;
    };
    metrics: {
        additionalProp1: Record<string, unknown>;
    };
    social_media: {
        additionalProp1: Record<string, unknown>;
    };
    contact: {
        additionalProp1: Record<string, unknown>;
    };
    traction: {
        additionalProp1: Record<string, unknown>;
    };
    use_of_funds: {
        additionalProp1: Record<string, unknown>;
    };
    timeline: {
        additionalProp1: Record<string, unknown>;
    };
}

// In a real app, this would come from a database or API
// We're mocking the data for now
const mockStartups: Startup[] = [
    {
        id: '1',
        name: 'EcoImpact',
        description: 'Sustainable energy solutions for residential properties',
        logo_url: 'https://placehold.co/200',
        industry: 'Cleantech',
        funding_stage: 'Series A',
        funding_goal: 5000000,
        location: 'San Francisco, CA',
        founded_year: '2019',
        team_size: 12,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'B2C Subscription',
        target_market: 'Homeowners in urban areas',
        competitors: 'GreenHome, EcoSolutions',
        founder_id: 'f001',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    },
    {
        id: '2',
        name: 'MedConnect',
        description: 'AI-powered telehealth platform connecting patients with specialists',
        logo_url: 'https://placehold.co/200',
        industry: 'Healthtech',
        funding_stage: 'Seed',
        funding_goal: 2000000,
        location: 'Boston, MA',
        founded_year: '2020',
        team_size: 8,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'B2B SaaS',
        target_market: 'Healthcare providers',
        competitors: 'TeleDoc, HealthPlus',
        founder_id: 'f002',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    },
    {
        id: '3',
        name: 'FinLedger',
        description: 'Blockchain-based financial management for small businesses',
        logo_url: 'https://placehold.co/200',
        industry: 'Fintech',
        funding_stage: 'Series B',
        funding_goal: 10000000,
        location: 'New York, NY',
        founded_year: '2018',
        team_size: 22,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'Freemium',
        target_market: 'SMBs and startups',
        competitors: 'QuickBooks, Xero',
        founder_id: 'f003',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    },
    {
        id: '4',
        name: 'LearnAI',
        description: 'Personalized learning platform using artificial intelligence',
        logo_url: 'https://placehold.co/200',
        industry: 'Edtech',
        funding_stage: 'Seed',
        funding_goal: 1500000,
        location: 'Austin, TX',
        founded_year: '2021',
        team_size: 5,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'B2C Subscription',
        target_market: 'K-12 students and parents',
        competitors: 'Khan Academy, Duolingo',
        founder_id: 'f004',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    },
    {
        id: '5',
        name: 'DataSphere',
        description: 'Enterprise data analytics and visualization platform',
        logo_url: 'https://placehold.co/200',
        industry: 'SaaS',
        funding_stage: 'Series A',
        funding_goal: 7000000,
        location: 'Seattle, WA',
        founded_year: '2019',
        team_size: 15,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'Enterprise SaaS',
        target_market: 'Fortune 500 companies',
        competitors: 'Tableau, PowerBI',
        founder_id: 'f005',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    },
    {
        id: '6',
        name: 'NexusAI',
        description: 'AI assistant for business process automation',
        logo_url: 'https://placehold.co/200',
        industry: 'AI',
        funding_stage: 'Series C',
        funding_goal: 15000000,
        location: 'San Jose, CA',
        founded_year: '2017',
        team_size: 35,
        website: 'https://example.com',
        pitch_deck_url: 'https://example.com/pitch',
        business_model: 'Enterprise SaaS',
        target_market: 'Medium to large businesses',
        competitors: 'Automation Anywhere, UiPath',
        founder_id: 'f006',
        team_members: {
            additionalProp1: {}
        },
        funding: {
            additionalProp1: {}
        },
        metrics: {
            additionalProp1: {}
        },
        social_media: {
            additionalProp1: {}
        },
        contact: {
            additionalProp1: {}
        },
        traction: {
            additionalProp1: {}
        },
        use_of_funds: {
            additionalProp1: {}
        },
        timeline: {
            additionalProp1: {}
        }
    }
];

// Function to extract unique values from an array of objects
function extractUniqueValues<T>(data: T[], key: keyof T): string[] {
    const values = data.map(item => String(item[key]));
    return [...new Set(values)];
}

export const load = (async () => {
    // In a real app, you would fetch data from an API or database here
    // For example: const startups = await db.startups.findMany();

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract unique industries and funding stages for filters
    const industries = extractUniqueValues(mockStartups, 'industry');
    const fundingStages = extractUniqueValues(mockStartups, 'funding_stage');

    return {
        startups: mockStartups,
        industries,
        fundingStages
    };
}) satisfies PageServerLoad;
