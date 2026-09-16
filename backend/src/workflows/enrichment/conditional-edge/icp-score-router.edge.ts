import type { ConditionalEdgeRouter } from "@langchain/langgraph";
import type { State } from "../schemas/enrichment-state.schema";

export const icpScoreRouter: ConditionalEdgeRouter<typeof State> = (state) => {
    const score = state.icpResult.icpScore;

    if (score >= 80) return "generateEmails";
    if (score >= 50) return "pendingReview";
    return "disqualified";
};