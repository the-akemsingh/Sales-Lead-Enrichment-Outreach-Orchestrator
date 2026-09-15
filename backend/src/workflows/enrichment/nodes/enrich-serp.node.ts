import type { GraphNode } from "@langchain/langgraph";
import { fetchSerpJobs } from "../utils/fetch-serp-jobs";
import { fetchSerpNews } from "../utils/fetch-serp-news";
import type { State } from "../schemas/enrichment-state.schema";


export const enrichSerp: GraphNode<typeof State> = async (state) => {
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
            throw new Error("One or more SERP news requests failed")
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
    } catch (error) {
        console.log("Error in serp node - ", error)
        throw error
    }
};