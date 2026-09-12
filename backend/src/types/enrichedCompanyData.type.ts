import z from "zod";

export const parsedApolloResponseSchema = z.object({
    name: z.string(),
    industry: z.string(),
    employeeCount: z.number(),
    sixMonthGrowth: z.number(),
    location: z.string(),
    foundedYear: z.number(),
    techStack: z.array(z.string()),
    description: z.string(),
    keywords: z.array(z.string()),
    teamBreakdown: z.record(z.string(), z.number()),
    fundingStage: z.string(),
    totalFunding: z.number(),
});

export type parsedApolloResponseType = z.infer<typeof parsedApolloResponseSchema>;