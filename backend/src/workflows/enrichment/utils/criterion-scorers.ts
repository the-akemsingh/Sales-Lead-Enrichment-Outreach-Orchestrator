import { campaign, type ScoringCriterion } from "../../../../campaign"
import type { parsedApolloResponseType } from "../../../types/apollo/parsed-apollo-response.schema"


export type ScorerData = {
    apolloData: parsedApolloResponseType
    emailInfo: { isDisposable: boolean, deliverability: string, isRole: boolean, isFreeEmail: boolean, qualityScore: number }
}

type ScorerFn = (
    criterion: ScoringCriterion,
    data: ScorerData
) => number


export const criterionScorers: Record<string, ScorerFn> = {

    employeeScore: (criterion, data) => {
        if (!criterion.min || !criterion.max) return 0
        const count = data.apolloData.employeeCount
        return count >= criterion.min && count <= criterion.max
            ? criterion.maxPoints
            : 0
    },

    emailQuality: (criterion, data) => {
        if (data.emailInfo.isDisposable) return 0
        if (data.emailInfo.deliverability !== "deliverable") return 0
        if (data.emailInfo.isFreeEmail) return Math.floor(criterion.maxPoints * 0.5) // gmail/yahoo = half points, real but low intent signal
        return criterion.maxPoints
    },

    industryMatch: (criterion, data) => {
        const industry = data.apolloData.industry?.toLowerCase() ?? ""
        return campaign.icp.industries.some(i => industry.includes(i.toLowerCase()))
            ? criterion.maxPoints
            : 0
    },

    techStackSignal: (criterion, data) => {
        if (!criterion.min) return 0
        const matches = data.apolloData.techStack?.filter(t =>
            campaign.icp.targetTechStack.includes(t)
        ).length ?? 0
        return matches >= criterion.min ? criterion.maxPoints : 0
    },

    headcountGrowth: (criterion, data) => {
        if (!criterion.min) return 0
        return data.apolloData.sixMonthGrowth >= criterion.min
            ? criterion.maxPoints
            : 0
    },

    fundingScore: (criterion, data) => {
        return data.apolloData.totalFunding > 0
            ? criterion.maxPoints
            : 0
    },
}