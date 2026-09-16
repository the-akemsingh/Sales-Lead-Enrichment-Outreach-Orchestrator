import type { ConditionalEdgeRouter } from "@langchain/langgraph";
import type { State } from "../schemas/enrichment-state.schema";

export const emailQualityRouter: ConditionalEdgeRouter<typeof State> = (state) => {
    // if quality not upto mark, re-generate emails. only 2 times we generate. if quality is still not gud, there is issue with prompt/model/data
    return "disqualified";
};