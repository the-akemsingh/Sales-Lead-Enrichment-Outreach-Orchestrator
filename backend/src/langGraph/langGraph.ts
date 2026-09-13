import { StateSchema, type GraphNode, StateGraph, START, END, type ConditionalEdgeRouter } from "@langchain/langgraph";
import { z } from "zod";
import { config } from "../config/env.config";
import { ApolloResponse } from "../types/apollo/apolloResponse.type";
import { parsedApolloResponseSchema } from "../types/enrichedCompanyData.type";
import { Lead } from "../types/lead.type";
import { parseApolloResponse } from "./parseApolloResponse";
import { SerpApiJobsResponse } from "../types/serpApi/serpApiJobResponse.type";
import { SerpApiNewsResponse } from "../types/serpApi/serpApiNewsResponse.type";
import { fetchSerpJobs } from "./fetchSerpJobs";
import { fetchSerpNews } from "./fetchSerpNews";


const SerpApiNewsResults = z.object({
    company_query_result: SerpApiNewsResponse,
    funding_query_result: SerpApiNewsResponse,
    hiring_query_result: SerpApiNewsResponse,
    founder_query_result: SerpApiNewsResponse,
});

const State = new StateSchema({
    rawLead: Lead,
    apolloResponse: z.string(),
    parsedApolloResponse: parsedApolloResponseSchema,
    serpApiJobResponse: SerpApiJobsResponse,
    serpApiNewsResponse: SerpApiNewsResults,
    emailInfo: z.object({
        status: z.enum(["valid_email", "invalid_mailbox"]),
        isDisposable: z.boolean()
    }),
    response: z.string()
});

const enrichApollo: GraphNode<typeof State> = async (state) => {
    const domain = state.rawLead.email.split("@")[1]
    const response = await fetch(
        `https://api.apollo.io/api/v1/organizations/enrich?domain=${domain}`,
        {
            headers: {
                "x-api-key": config.get("apolloApiKey"),
                "accept": "application/json",
            },
        }
    );

    const rawData = await response.json();
    if (!response.ok) {
        throw new Error(`Apollo API error: ${response.status}`);
    }

    const data = ApolloResponse.parse(rawData);
    console.log("data - ", data)
    const enrichedCompanyData = parseApolloResponse(data.organization);
    return {
        apolloResponse: JSON.stringify(data),
        parsedApolloResponse: enrichedCompanyData
    }
};

const enrichSerp: GraphNode<typeof State> = async (state) => {
    try {

        const company = state.rawLead.company

        const jobData = await fetchSerpJobs(company)

        const newsQueries = [
            `"${company}"`,
            `"${company}" funding`,
            `"${company}" hiring`,
            `"${company}" founder`,
        ];
        const [
            companyQueryResult,
            fundingQueryResult,
            hiringQueryResult,
            founderQueryResult
        ] = await Promise.all(
            newsQueries.map(query => fetchSerpNews(query))
        );
        if (!companyQueryResult || !fundingQueryResult || !hiringQueryResult || !founderQueryResult) {
            return {}
        }
        return {
            serpApiJobResponse: jobData,
            serpApiNewsResponse: {
                company_query_result: companyQueryResult,
                funding_query_result: fundingQueryResult,
                hiring_query_result: hiringQueryResult,
                founder_query_result: founderQueryResult,
            }
        };
    } catch (e) {
        console.log("Error in serp node - ", e)
        return {}
    }
};

const verifyEmail: GraphNode<typeof State> = async (state) => {
    const response = await fetch(`https://emailreputation.abstractapi.com/v1/?api_key=${config.get("abstractApiKey")}&email=${state.rawLead.email}`)

    const emailStats = await response.json() as any

    const status = emailStats.email_deliverability.status_detail || "invalid_mailbox"

    const isDisposable = emailStats.email_quality.is_disposable || true

    return {
        emailInfo: {
            status: status,
            isDisposable: isDisposable
        }
    };
};

// const icpScorer: GraphNode<typeof State> = (state) => {
//     return { response: "ok" };
// };
// const icpScoreChecker: ConditionalEdgeRouter<typeof State> = (state) => {
//     return ""
// }
// const generateEmails: GraphNode<typeof State> = (state) => {
//     return { response: "ok" };
// };
// const emailQualityDeterminer: GraphNode<typeof State> = (state) => {
//     return { response: "ok" };
// };
// const emailQuality: ConditionalEdgeRouter<typeof State> = (state) => {
//     return ""
// }

export const graph = new StateGraph(State)
    // .addNode("enrichApollo", enrichApollo)
    // .addNode("enrichSerp", enrichSerp)
    .addNode("verifyEmail", verifyEmail)
    // .addNode("icpScorer", icpScorer)
    // .addNode("generateEmails", generateEmails)
    // .addNode("emailQualityDeterminer", emailQualityDeterminer)

    .addEdge(START, "verifyEmail")
    .addEdge("verifyEmail", END)
    // .addEdge("enrichApollo", "enrichSerp")
    // .addEdge("enrichSerp", "verifyEmail")

    .compile();