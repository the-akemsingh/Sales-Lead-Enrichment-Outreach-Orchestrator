// src/graph/nodes/icpScorer.node.ts

import type { GraphNode } from "@langchain/langgraph"
import callLLM from "../llm"
import { criterionScorers, type ScorerData } from "../utils/criterion-scorers"
import type { State } from "../schemas/enrichment-state.schema"
import { campaign } from "../../../../campaign"

export const icpScorer: GraphNode<typeof State> = async (state) => {
    try {
        let deterministicScore = 0
        let deterministicMaxPossible = 0
        const breakdown: any = {}
        // const missing: string[] = []

        //data on which, we will score the lead
        const scorerData: ScorerData = {
            apolloData: state.parsedApolloResponse,
            emailInfo: state.emailInfo,
        }

        // iterate rubric — scorer doesn't know or care what criteria exist
        for (const [key, criterion] of Object.entries(campaign.scoringRubric)) {
            const scorerFn = criterionScorers[key]

            if (!scorerFn) {
                // criterion exists in campaign config but no scorer implemented for it yet
                // missing.push(key)
                continue
            }

            const points = scorerFn(criterion, scorerData)
            deterministicScore += points
            deterministicMaxPossible += criterion.maxPoints
            breakdown[key] = points
        }

        // LLM portion — always 30 points max (personaFit 20 + buyingSignal 10)
        const LLM_MAX = 30

        const llmResult = await callLLM({
            system: `You are an ICP (Ideal Customer Profile) scoring assistant for a B2B sales platform.
Your job is to evaluate how well a company matches a campaign's target persona and whether there are active buying signals.
You must be strict and realistic — do not give high scores just because data is present. 
Only award high scores when there is genuine, specific evidence of fit or intent.
You always respond with valid JSON only. No explanation, no markdown, no preamble.`,

            prompt: `
You are scoring a lead company against our campaign's ICP. Evaluate two dimensions only.

--- CAMPAIGN CONTEXT ---
Product: ${campaign.productName}
What it does: ${campaign.productDescription}
Target persona: ${campaign.targetPersona}
Problems we solve: ${campaign.painPointsSolved.join(" | ")}

--- LEAD COMPANY DATA ---
Description: ${state.parsedApolloResponse.description ?? "not available"}
Industry: ${state.parsedApolloResponse.industry ?? "unknown"}
Employee count: ${state.parsedApolloResponse.employeeCount ?? "unknown"}
Tech stack: ${state.parsedApolloResponse.techStack?.slice(0, 10).join(", ") ?? "none found"}
Keywords / focus areas: ${state.parsedApolloResponse.keywords?.slice(0, 15).join(", ") ?? "none found"}
6-month headcount growth: ${state.parsedApolloResponse.sixMonthGrowth != null ? `${(state.parsedApolloResponse.sixMonthGrowth * 100).toFixed(1)}%` : "unknown"}
Funding: ${state.parsedApolloResponse.totalFunding > 0 ? `$${state.parsedApolloResponse.totalFunding}` : "no funding data"}

--- RECENT SIGNALS ---
Recent news: ${state.serpApiNewsResponse.company_query_result.news_results?.[0]?.snippet ?? "none found"}
Hiring signals (recent job titles): ${state.serpApiJobResponse?.organic_results?.slice(0, 3).map(j => j.title).join(", ") ?? "none found"}

--- SCORING INSTRUCTIONS ---

Score PERSONA FIT (0 to 20):
- 17-20: Company clearly matches the target persona. Description, industry, and keywords strongly align with who we sell to.
- 12-16: Good match with minor gaps. Core business fits but persona is not perfect.
- 6-11: Partial match. Some signals align but company may not feel the pain we solve directly.
- 0-5: Poor match. Company is in a different space or has no visible alignment with our target persona.

Score BUYING SIGNAL (0 to 10):
- 8-10: Strong signal. Actively hiring relevant roles, recent expansion, funding event, or news directly related to the problem we solve.
- 5-7: Moderate signal. Growing team or some tech stack alignment but no direct trigger found.
- 2-4: Weak signal. Company looks relevant but no active indicators of urgency or intent.
- 0-1: No signal. Flat headcount, no relevant news, no hiring activity.

Important:
- If a data field says "none found" or "not available", do not assume or invent signals. Score lower for missing data.
- Base your reasoning on what is explicitly present in the data above.
- personaFitReason and buyingSignalReason must each be ONE specific sentence referencing actual data from above. Not generic statements.

Respond with this exact JSON and nothing else:
{
  "personaFit": <number 0-20>,
  "personaFitReason": "<one sentence referencing specific data>",
  "buyingSignal": <number 0-10>,
  "buyingSignalReason": "<one sentence referencing specific data>"
}
`
        })

        const llmScore = llmResult.personaFit + llmResult.buyingSignal
        const totalPossible = deterministicMaxPossible + LLM_MAX
        const rawScore = deterministicScore + llmScore

        // normalize to 0-100 regardless of how many criteria the campaign has
        const icpScore = Math.round((rawScore / totalPossible) * 100)

        const icpResult = {
            icpScore,
            icpBreakdown: {
                ...breakdown,
                personaFit: llmResult.personaFit,
                buyingSignal: llmResult.buyingSignal,
                reasons: {
                    personaFit: llmResult.personaFitReason,
                    buyingSignal: llmResult.buyingSignalReason,
                },
                // _meta: {
                //   rawScore,
                //   totalPossible,
                //   missingScorerKeys: missing, // criteria in config with no scorer fn yet
                // }
            }
        }
        console.log("icp node result - ", JSON.stringify(icpResult))
        return {
            icpResult
        }
    }
    catch (error) {
        console.log("Error occured in icpScorer node:", error)
        throw error
    }
}