import { defineEventHandler } from "h3";

interface Startup {
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
    id: string;
    founder_id: string;
    team_members: {
      "additionalProp1": {}
    },
    funding: {
      "additionalProp1": {}
    },
    metrics: {
      "additionalProp1": {}
    },
    social_media: {
      "additionalProp1": {}
    },
    contact: {
      "additionalProp1": {}
    },
    traction: {
      "additionalProp1": {}
    },
    use_of_funds: {
      "additionalProp1": {}
    },
    timeline: {
      "additionalProp1": {}
    }
  }
  



export default defineEventHandler(async (event) => {

const config = useRuntimeConfig();
const getAllStartups = async () => {
    const token = getRequestHeader(event, 'Authorization');
    const startups = $fetch<Startup[]>(`${config.public.apiBase}startups`,{
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    console.log(startups);
    return startups;
}
return getAllStartups();
});
