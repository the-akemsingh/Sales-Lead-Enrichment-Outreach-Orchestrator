import { config } from "../config/env.config";
import { SerpApiJobsResponse } from "../types/serpApi/serpApiJobResponse.type";

const SERP_API_URL = "https://serpapi.com/search.json";


export async function fetchSerpJobs(company: string) {
    try {

        const params = new URLSearchParams({
            engine: "google",
            q: `"${company}" hiring jobs`,
            api_key: config.get("serpApiKey"),
        });
        const response = await fetch(`${SERP_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`SERP News API error: ${response.status}`);
        }
        const rawData = await response.json();
        const data = SerpApiJobsResponse.parse(rawData)
        return data;
    } catch (e) {
        console.log("Error on serpJon functoin", e)
    }
}