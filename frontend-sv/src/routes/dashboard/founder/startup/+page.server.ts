import { env } from '$env/dynamic/private';
import { ApiEndpoint } from '@/endpoints';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '@/auth';

export const load: PageServerLoad = async ({ fetch, cookies, request }) => {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user?.id) {
    throw error(401, 'User not authenticated');
  }

  // Get the access token from cookies
  const accessToken = cookies.get('access_token');

  if (!accessToken) {
    throw error(401, 'Access token not found');
  }

  try {
    // Fetch founder's startups using the founder_id
    const founderStartupResponse = await fetch(
      `${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_FOUNDER_STARTUPS.replace('{founder_id}', String(session.user.id))}`,
      {
        headers: {
          'Authorization': `bearer ${accessToken}`
        }
      }
    );

    console.log('Request URL:', `${env.DEPLOYMENT_API_URL}${ApiEndpoint.GET_FOUNDER_STARTUPS.replace('{founder_id}', String(session.user.id))}`);
    console.log('User ID:', session.user.id);
    console.log('Response status:', founderStartupResponse.status);

    const industryOptions = [
      { label: "All Industries", value: "all" },
      { label: "Fintech", value: "fintech" },
      { label: "Healthcare", value: "healthcare" },
      { label: "E-commerce", value: "ecommerce" },
      { label: "SaaS", value: "saas" },
      { label: "AI/ML", value: "ai-ml" },
    ];

    const stageOptions = [
      { label: "All Stages", value: "all" },
      { label: "Idea", value: "idea" },
      { label: "MVP", value: "mvp" },
      { label: "Seed", value: "seed" },
      { label: "Series A", value: "series_a" },
      { label: "Series B+", value: "series_b_plus" },
    ];

    const sortOptions = [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Most Funding", value: "funding" },
      { label: "Name A-Z", value: "name_asc" },
      { label: "Name Z-A", value: "name_desc" },
    ];

    if (!founderStartupResponse.ok) {
      const errorText = await founderStartupResponse.text();
      console.error('API Error Response:', errorText);

      if (founderStartupResponse.status === 404) {
        // No startups found for this founder - return empty array
        const startups: any[] = [];
        return {
          startups,
          industryOptions,
          stageOptions,
          sortOptions,
        };
      }

      if (founderStartupResponse.status === 422) {
        console.error('Validation error - check founder_id type and format');
        console.error('Founder ID being sent:', session.user.id, 'Type:', typeof session.user.id);
      }

      throw error(founderStartupResponse.status, `Failed to fetch founder startups: ${errorText}`);
    }

    const startups = await founderStartupResponse.json();

    return {
      startups,
      industryOptions,
      stageOptions,
      sortOptions,
    };
  } catch (err) {
    console.error('Error fetching founder startups:', err);
    throw error(500, 'Internal server error');
  }
};
