import { StateGraph, START, END } from "@langchain/langgraph";
import { verifyEmail } from "./nodes/verify-email.node";
import { State } from "./schemas/enrichment-state.schema";
import { enrichApollo } from "./nodes/enrich-apollo.node";
import { enrichSerp } from "./nodes/enrich-serp.node";
import { icpScorer } from "./nodes/score-icp.node";



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
    .addNode("enrichApollo", enrichApollo)
    .addNode("enrichSerp", enrichSerp)
    .addNode("verifyEmail", verifyEmail)
    .addNode("icpScorer", icpScorer)
    // .addNode("generateEmails", generateEmails)
    // .addNode("emailQualityDeterminer", emailQualityDeterminer)

    .addEdge(START, "enrichApollo")
    .addEdge("enrichApollo", "enrichSerp")
    .addEdge("enrichSerp", "verifyEmail")
    .addEdge("verifyEmail", "icpScorer")
    .addEdge("icpScorer", END)
    // .addEdge("enrichApollo", "enrichSerp")
    // .addEdge("enrichSerp", "verifyEmail")

    .compile();