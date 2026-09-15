import { StateSchema } from "@langchain/langgraph";
import { z } from "zod";
import { Lead } from "../../../types/lead.schema";
import { parsedApolloResponseSchema } from "../../../types/apollo/parsed-apollo-response.schema";
import { SerpApiJobsResponse } from "../../../types/serp-api/serp-api-job-response.schema";
import { SerpApiNewsResponse } from "../../../types/serp-api/serp-api-news-response.schema";

const SerpApiNewsResults = z.object({
    company_query_result: SerpApiNewsResponse,
    funding_query_result: SerpApiNewsResponse,
    hiring_query_result: SerpApiNewsResponse,
    founder_query_result: SerpApiNewsResponse,
});

export const State = new StateSchema({
    rawLead: Lead,
    apolloResponse: z.string(),
    parsedApolloResponse: parsedApolloResponseSchema,
    serpApiJobResponse: SerpApiJobsResponse,
    serpApiNewsResponse: SerpApiNewsResults,
    emailInfo: z.object({
        deliverability: z.enum(["deliverable", "undeliverable", "unknown"]),
        isDisposable: z.boolean(),
        isRole: z.boolean(),
        isFreeEmail: z.boolean(),
        qualityScore: z.number(),
    }),
    icpResult: z.object({
        icpScore: z.number(),
        icpBreakdown: z.object({
            employeeScore: z.number(),
            emailQuality: z.number(),
            industryMatch: z.number(),
            techStackSignal: z.number(),
            headcountGrowth: z.number(),
            fundingScore: z.number(),
            personaFit: z.number(),
            buyingSignal: z.number(),
            reasons: z.object({
                personaFit: z.string(),
                buyingSignal: z.string(),
            })
        })
    }),
    response: z.string()
});