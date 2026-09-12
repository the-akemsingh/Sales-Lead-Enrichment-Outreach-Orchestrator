import z from "zod";

export const Lead = z.object({
    name: z.string(),
    email: z.string(),
    company: z.string(),
});