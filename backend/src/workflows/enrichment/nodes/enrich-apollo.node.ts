import type { GraphNode } from "@langchain/langgraph";
import { parseApolloResponse } from "../utils/parse-apollo-response";
import { config } from "../../../config/env.config";
import type { State } from "../schemas/enrichment-state.schema";
import { ApolloResponse } from "../../../types/apollo/apolloResponse.type";

export const enrichApollo: GraphNode<typeof State> = async (state) => {
    try {

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
        const enrichedCompanyData = parseApolloResponse(data.organization);
        return {
            apolloResponse: JSON.stringify(data),
            parsedApolloResponse: enrichedCompanyData
        }
    }
    catch (error) {
        console.log("Error occured in enrichApollo node:", error)
        throw error
    }
};