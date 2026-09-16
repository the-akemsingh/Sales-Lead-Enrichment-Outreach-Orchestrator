import type { GraphNode } from "@langchain/langgraph";
import { config } from "../../../config/env.config";
import type { State } from "../schemas/enrichment-state.schema";

export const emailQualityDeterminer: GraphNode<typeof State> = async (state) => {
    try {


        return {

        }
    }
    catch (error) {
        console.log("Error occured in verifyEmail node:", error)
        throw error
    }
};