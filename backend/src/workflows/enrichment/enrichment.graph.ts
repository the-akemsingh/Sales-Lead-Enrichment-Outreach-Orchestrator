import { StateGraph, START, END } from "@langchain/langgraph";
import { verifyEmail } from "./nodes/verify-email.node";
import { State } from "./schemas/enrichment-state.schema";
import { enrichApollo } from "./nodes/enrich-apollo.node";
import { enrichSerp } from "./nodes/enrich-serp.node";
import { icpScorer } from "./nodes/score-icp.node";
import { icpScoreRouter } from "./conditional-edge/icp-score-router.edge";
import { generateEmails } from "./nodes/generate-emails.node";
import { emailQualityDeterminer } from "./nodes/email-quality-determiner.node";

const setDisqualified = async (state: typeof State.State) => {
    // todo — later this updates lead status in DB
    console.log(`Lead disqualified. Score: ${state.icpResult.icpScore}`);
    console.log("Breakdown:", state.icpResult.icpBreakdown);
    return {};
};

const setPendingReview = async (state: typeof State.State) => {
    // todo — later this updates lead status in DB + notifies human queue
    console.log(`Lead sent to human review. Score: ${state.icpResult.icpScore}`);
    return {};
};

export const graph = new StateGraph(State)
    .addNode("enrichApollo", enrichApollo)
    .addNode("enrichSerp", enrichSerp)
    .addNode("verifyEmail", verifyEmail)
    .addNode("icpScorer", icpScorer)
    .addNode("disqualified", setDisqualified)
    .addNode("pendingReview", setPendingReview)
    .addNode("generateEmails", generateEmails)
    .addNode("emailQualityDeterminer", emailQualityDeterminer)

    .addEdge(START, "enrichApollo")
    .addEdge("enrichApollo", "enrichSerp")
    .addEdge("enrichSerp", "verifyEmail")
    .addEdge("verifyEmail", "icpScorer")
    .addConditionalEdges("icpScorer", icpScoreRouter, {
        "generateEmails": "generateEmails",
        "pendingReview": "pendingReview",
        "disqualified": "disqualified",
    })
    .addEdge("generateEmails", END) // in place of this, add a conditional edge - emailQualityRouter
    .addEdge("pendingReview", END)
    .addEdge("disqualified", END)

    .compile();