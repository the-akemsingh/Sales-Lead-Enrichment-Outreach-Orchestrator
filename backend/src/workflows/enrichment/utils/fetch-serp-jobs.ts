import { config } from "../../../config/env.config";
import { SerpApiJobsResponse } from "../../../types/serp-api/serp-api-job-response.schema";

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
            throw new Error(`SERP Jobs API error: ${response.status}`);
        }
        const rawData = await response.json();
        const data = SerpApiJobsResponse.parse(rawData)
        return data;
    } catch (error) {
        console.log("Error on serpJob function", error)
        throw error
    }
}