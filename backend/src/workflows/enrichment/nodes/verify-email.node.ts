import type { GraphNode } from "@langchain/langgraph";
import { config } from "../../../config/env.config";
import type { State } from "../schemas/enrichment-state.schema";

export const verifyEmail: GraphNode<typeof State> = async (state) => {
    try {
        const response = await fetch(`https://emailreputation.abstractapi.com/v1/?api_key=${config.get("abstractApiKey")}&email=${state.rawLead.email}`)

        const emailStats = await response.json() as any

        return {
            emailInfo: {
                deliverability: emailStats.email_deliverability.status,
                isDisposable: emailStats.email_quality.is_disposable,
                isRole: emailStats.email_quality.is_role,
                isFreeEmail: emailStats.email_quality.is_free_email,
                qualityScore: emailStats.email_quality.score,
            }
        }
    }
    catch (error) {
        console.log("Error occured in verifyEmail node:", error)
        throw error
    }
};