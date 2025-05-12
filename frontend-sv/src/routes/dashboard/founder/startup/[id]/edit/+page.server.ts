import { startupSchema } from "$lib/schemas/startup-schema";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

// Mock database - replace with actual data fetching logic
// In a real app, this would fetch from your database
// const mockStartups: Record<string, Omit<Startup, 'id'>> = {
const mockStartups: Record<string, any> = {
    "1": {
        name: "Innovatech Solutions",
        description: "Pioneering AI-driven solutions for the future of sustainable energy. Our platform optimizes energy consumption for large industrial complexes, reducing costs and carbon footprint significantly.",
        industry: "Clean Energy",
        location: "San Francisco, USA",
        fundingStage: "Series A",
        foundedYear: 2021,
        teamSize: 25,
        website: "https://innovatech.example.com",
        teamMembers: [
            { name: "Alice Johnson", role: "CEO", bio: "Ex-Google AI lead, passionate about climate tech.", linkedin: "https://linkedin.com/in/alicejohnson" },
            { name: "Bob Williams", role: "CTO", bio: "Hardware expert with 15 years in energy systems.", linkedin: "https://linkedin.com/in/bobwilliams" },
        ],
        funding: {
            total: "$5M",
            lastRound: "Series A",
            investors: "EcoVentures, FutureTech Capital"
        },
        metrics: {
            revenue: "$1M ARR",
            growth: "150% YoY",
            customers: "30+ Industrial Clients"
        },
        socialMedia: {
            twitter: "https://twitter.com/innovatech",
            linkedin: "https://linkedin.com/company/innovatech"
        },
        contact: {
            email: "contact@innovatech.example.com",
            phone: "+1 415-555-1234",
            address: "1 Tech Plaza, San Francisco, CA 94107"
        },
        businessModel: "SaaS subscription based on energy savings achieved.",
        targetMarket: "Large industrial facilities in North America and Europe.",
        competitors: "Legacy energy management systems, Siemens Energy.",
        traction: {
            users: "30+ Pilot Customers",
            revenue: "$1M ARR",
            growth: "150% YoY Customer Growth",
            partnerships: "Partnership with Major Utility Provider"
        },
        useOfFunds: {
            product: "Expand AI capabilities, develop predictive maintenance features.",
            marketing: "Increase presence in European markets, attend industry conferences.",
            operations: "Scale cloud infrastructure, streamline customer onboarding.",
            team: "Hire 5 senior engineers, 3 sales representatives."
        },
        timeline: {
            past: [
                { date: "June 2021", title: "Founded", description: "Company established.", type: "other" },
                { date: "March 2022", title: "Seed Funding", description: "Raised $1M seed round.", type: "funding" },
                { date: "January 2023", title: "Product Launch", description: "Launched V1 platform.", type: "product" }
            ],
            future: [
                { date: "Q4 2024", title: "Series B Funding", description: "Plan to raise $15M Series B.", type: "funding" },
                { date: "Q1 2025", title: "European Expansion", description: "Launch operations in Germany and UK.", type: "launch" }
            ]
        }
    },
    // Add more mock startups if needed
};

export const load: PageServerLoad = async ({ params }) => {
    const startupId = params.id;
    const startupData = mockStartups[startupId];

    if (!startupData) {
        error(404, "Startup not found");
    }

    // Initialize the form with the fetched data
    const form = await superValidate(startupData, zod(startupSchema));

    return {
        form,
        startupId, // Pass the ID to the page if needed (e.g., for the form action)
    };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const startupId = params.id;
        const existingData = mockStartups[startupId]; // Get existing data for context if needed

        if (!existingData) {
             error(404, "Startup not found during update attempt");
        }

        const form = await superValidate(request, zod(startupSchema));

        if (!form.valid) {
            // Return validation errors
            return fail(400, { form });
        }

        // TODO: Update the actual data in your database
        console.log("Updating startup:", startupId, form.data);
        // Example: Update mock data (won't persist across requests unless handled differently)
        // mockStartups[startupId] = { ...existingData, ...form.data };

        // Return the validated form data on success
        return { form };
    },
};
