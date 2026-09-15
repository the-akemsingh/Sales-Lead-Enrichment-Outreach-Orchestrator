import type { parsedApolloResponseType } from "../../../types/apollo/parsed-apollo-response.schema";

export function parseApolloResponse(orgData: any): parsedApolloResponseType {
    return {
        name: orgData.name,
        industry: orgData.industry,
        employeeCount: orgData.estimated_num_employees,
        sixMonthGrowth: orgData.organization_headcount_six_month_growth * 100,
        location: `${orgData.city}, ${orgData.country}`,
        foundedYear: orgData.founded_year,
        techStack: orgData.technology_names,
        description: orgData.short_description,
        keywords: orgData.keywords.slice(0, 20), // top 20 only
        teamBreakdown: orgData.departmental_head_count,
        fundingStage: orgData.latest_funding_stage ?? "bootstrapped/unknown",
        totalFunding: orgData.total_funding ?? 0,
    }
}