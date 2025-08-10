import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Mock data for development
const mockStartups = [
    {
        id: '1',
        name: 'EcoTech Solutions',
        description: 'Developing sustainable technologies for waste management and recycling with AI-powered sorting systems.',
        logo: null,
        industry: 'sustainability',
        stage: 'seed',
        location: 'san_francisco',
        foundedDate: '2021-05-15',
        fundingRaised: 750000,
        fundingGoal: 1500000,
        fundingProgress: 50,
        team: 8,
        featured: true,
        metrics: {
            growth: 32
        }
    },
    {
        id: '2',
        name: 'MediSync',
        description: 'Healthcare platform connecting patients with specialists for virtual consultations and continuous remote monitoring.',
        logo: null,
        industry: 'health',
        stage: 'series_a',
        location: 'boston',
        foundedDate: '2020-02-10',
        fundingRaised: 4000000,
        fundingGoal: 5000000,
        fundingProgress: 80,
        team: 24,
        featured: true,
        metrics: {
            growth: 85
        }
    },
    {
        id: '3',
        name: 'FinLearn',
        description: 'Financial education platform providing personalized learning paths for investment knowledge and market understanding.',
        logo: null,
        industry: 'fintech',
        stage: 'mvp',
        location: 'new_york',
        foundedDate: '2022-09-22',
        fundingRaised: 250000,
        fundingGoal: 1000000,
        fundingProgress: 25,
        team: 5,
        featured: false,
        metrics: {
            growth: 18
        }
    },
    {
        id: '4',
        name: 'CloudScale',
        description: 'Enterprise cloud infrastructure optimization tool that automatically manages resources to reduce costs and environmental impact.',
        logo: null,
        industry: 'tech',
        stage: 'series_a',
        location: 'austin',
        foundedDate: '2019-11-05',
        fundingRaised: 3500000,
        fundingGoal: 7000000,
        fundingProgress: 50,
        team: 18,
        featured: false,
        metrics: {
            growth: 42
        }
    },
    {
        id: '5',
        name: 'LearnLoop',
        description: 'Adaptive learning platform for K-12 students using AI to customize educational content based on individual learning patterns.',
        logo: null,
        industry: 'edtech',
        stage: 'seed',
        location: 'chicago',
        foundedDate: '2021-08-12',
        fundingRaised: 1200000,
        fundingGoal: 2000000,
        fundingProgress: 60,
        team: 12,
        featured: true,
        metrics: {
            growth: 56
        }
    },
    {
        id: '6',
        name: 'ShopStream',
        description: 'E-commerce live streaming platform connecting small businesses with customers through interactive shopping experiences.',
        logo: null,
        industry: 'ecommerce',
        stage: 'seed',
        location: 'remote',
        foundedDate: '2022-03-18',
        fundingRaised: 800000,
        fundingGoal: 1500000,
        fundingProgress: 53,
        team: 9,
        featured: false,
        metrics: {
            growth: 68
        }
    }
];

// Mock saved searches for development
const mockSavedSearches = [
    { id: '1', name: 'Early stage tech in SF', filters: { industries: ['tech'], stages: ['idea', 'mvp', 'seed'], locations: ['san_francisco'] } },
    { id: '2', name: 'Sustainable startups', filters: { industries: ['sustainability'] } },
    { id: '3', name: 'Healthcare growth', filters: { industries: ['health'], stages: ['series_a', 'series_b_plus'] } }
];

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    try {
        // In a real implementation, these would be API calls to a backend service
        // const response = await fetch('/api/startups');
        // const startups = await response.json();
        
        // For now, using mock data
        // Simulate different sorting/filtering for different categories
        const trending = [...mockStartups].sort((a, b) => (b.metrics?.growth || 0) - (a.metrics?.growth || 0));
        const featured = mockStartups.filter(startup => startup.featured);
        const recommendations = [...mockStartups].sort(() => Math.random() - 0.5).slice(0, 3); // Random for mock
        
        return {
            startups: mockStartups,
            trending,
            featured,
            recommendations,
            savedSearches: mockSavedSearches
        };
    } catch (err) {
        console.error('Error loading startup data:', err);
        throw error(500, 'Failed to load startup data');
    }
}; 