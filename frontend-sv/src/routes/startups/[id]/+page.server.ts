import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface StartupData {
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

export const load = (async ({ params, fetch }) => {
    const id = params.id;

    try {
        // In a real app, replace this with your actual API call
        // const response = await fetch(`/api/startups/${id}`);
        // if (!response.ok) throw new Error('Failed to fetch startup data');
        // const startup = await response.json();

        // For now, simulate a successful API response with mock data
        const startup: StartupData = {
            name: "InnovateTech",
            description: "A revolutionary AI-powered platform that helps businesses automate their customer service operations and improve customer satisfaction.",
            industry: "Artificial Intelligence",
            location: "San Francisco, CA",
            funding_stage: "Seed",
            funding_goal: 1500000,
            founded_year: "2021",
            team_size: 12,
            website: "https://innovatetech.example.com",
            logo_url: "https://via.placeholder.com/150",
            pitch_deck_url: "https://example.com/pitch.pdf",
            business_model: "SaaS subscription model with tiered pricing based on usage volume.",
            target_market: "Small to medium-sized businesses in the retail and e-commerce sectors.",
            competitors: "ServiceBot, AICompanion, CustomerGenius",
            founder_id: "user123",
            team_members: { additionalProp1: {} },
            funding: { additionalProp1: {} },
            metrics: { additionalProp1: {} },
            social_media: { additionalProp1: {} },
            contact: { additionalProp1: {} },
            traction: { additionalProp1: {} },
            use_of_funds: { additionalProp1: {} },
            timeline: { additionalProp1: {} }
        };

        return { startup };
    } catch (err) {
        throw error(404, {
            message: 'Startup not found'
        });
    }
}) satisfies PageServerLoad; 