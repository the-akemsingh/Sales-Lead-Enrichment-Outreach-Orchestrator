import { config } from "../config/env.config";
import { SerpApiNewsResponse } from "../types/serpApi/serpApiNewsResponse.type";


const SERP_API_URL = "https://serpapi.com/search.json";


export async function fetchSerpNews(company: string) {
    try {
        const params = new URLSearchParams({
            engine: "google",
            q: company,
            tbm: "nws",
            api_key: config.get("serpApiKey")

        })
        const response = await fetch(`${SERP_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`SERP News API error: ${response.status}`);
        }
        const rawdata = await response.json();
        const data = SerpApiNewsResponse.parse(rawdata);
        return data;
    } catch (e) {
        console.log("Error in news api - ", e)
    }
}
