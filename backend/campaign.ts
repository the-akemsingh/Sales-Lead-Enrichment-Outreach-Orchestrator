// campaign.ts
// Fictional company: DeployKit
// Product: AI-powered CI/CD pipeline optimization and deployment monitoring SaaS
// This is the campaign config used across all LangGraph nodes — enrichment,
// ICP scoring, email generation, and quality checking all read from here.

export interface ScoringCriterion {
    maxPoints: number;
    description: string;
    min?: number;
    max?: number;
}

export interface Campaign {
    // --- Who we are ---
    companyName: string;
    productName: string;
    productDescription: string;
    painPointsSolved: string[];
    keyFeatures: string[];
    cta: string;
    tone: "formal" | "casual" | "direct";
    senderName: string;
    senderRole: string;

    // --- Who we sell to ---
    targetPersona: string;
    targetRoles: string[]; // used to assess lead's role if available

    // --- ICP definition (used by deterministic scoring) ---
    icp: {
        industries: string[];           // must contain at least one
        minEmployees: number;
        maxEmployees: number;
        targetTechStack: string[];      // Apollo tech_names signals
        idealFundingStages: string[];   // "Series A", "Series B", "bootstrapped" etc
        targetCountries: string[];      // empty = all countries
    };

    // --- ICP rubric (used by deterministic scorer) ---
    // LLM handles personaFit (0-20) and buyingSignal (0-10) on top of these
    scoringRubric: {
        [key: string]: ScoringCriterion
    };

    // --- Quality checker rules (used by qualityCheckerNode) ---
    qualityRules: {
        maxWordsPerEmail: number;
        requiredCtaCount: number;       // exactly 1
        spamTriggerWords: string[];
        mustReferenceCompanySignal: boolean;
    };

    // --- Sequence structure ---
    sequence: {
        step: number;
        dayOffset: number;              // days after step 1
        angle: string;                  // what angle this email takes — passed to LLM
    }[];
}

export const campaign: Campaign = {
    // --- Who we are ---
    companyName: "DeployKit",
    productName: "DeployKit",
    productDescription:
        "DeployKit is a CI/CD optimization platform that cuts deployment times by 60% and reduces pipeline failures using AI-driven build analysis. It integrates with GitHub Actions, GitLab CI, and Jenkins in under 10 minutes — no infra changes required.",
    painPointsSolved: [
        "Slow CI/CD pipelines blocking engineering velocity",
        "Flaky tests and non-deterministic build failures wasting engineering hours",
        "No visibility into why pipelines fail or which steps are the bottleneck",
        "Deployments breaking production with no early warning system",
        "Engineering teams spending more time on DevOps toil than shipping features",
    ],
    keyFeatures: [
        "AI build analyzer that identifies root cause of failures in seconds",
        "Parallel test execution that cuts test time by up to 70%",
        "Real-time pipeline observability dashboard",
        "Automated flaky test detection and quarantine",
        "One-click rollback with deployment health scoring",
    ],
    cta: "Book a 20-minute demo to see it on your actual pipeline",
    tone: "casual",
    senderName: "Akem Singh",
    senderRole: "Head of Growth, DeployKit",

    // --- Who we sell to ---
    targetPersona:
        "Engineering leaders (CTO, VP Engineering, Head of DevOps, Engineering Manager) at B2B SaaS or tech-first companies with 10–500 employees who are scaling their engineering team and shipping software frequently. They care deeply about developer productivity and deployment reliability.",
    targetRoles: [
        "CTO",
        "VP Engineering",
        "VP of Engineering",
        "Head of DevOps",
        "Engineering Manager",
        "Platform Engineer",
        "DevOps Engineer",
        "Software Engineering Manager",
        "Director of Engineering",
    ],

    // --- ICP definition ---
    icp: {
        industries: [
            "information technology & services",
            "computer software",
            "internet",
            "saas",
            "fintech",
            "healthtech",
            "edtech",
            "cybersecurity",
            "developer tools",
            "cloud computing",
            "artificial intelligence",
        ],
        minEmployees: 10,
        maxEmployees: 500,
        targetTechStack: [
            // CI/CD tools — already using something, ripe for switching/upgrading
            "GitHub Actions",
            "GitLab",
            "Jenkins",
            "CircleCI",
            "Travis CI",
            "Bitbucket Pipelines",
            // Cloud infra — means they're deploying real software
            "Amazon AWS",
            "Amazon EC2",
            "Google Cloud",
            "Azure",
            // Containers — means they have a real deployment pipeline
            "Docker",
            "Kubernetes",
            // Modern dev stack — signals an engineering-first culture
            "Node.js",
            "React",
            "GraphQL",
            "Redis",
            "MongoDB",
        ],
        idealFundingStages: [
            "Seed",
            "Series A",
            "Series B",
            "Series C",
            "bootstrapped/unknown", // bootstrapped companies also buy if pain is real
        ],
        targetCountries: [], // empty = global, no restriction
    },

    // --- Scoring rubric (deterministic part, code handles these) ---
    // LLM adds personaFit (0–20) and buyingSignal (0–10) on top
    // Total possible: 70 (deterministic) + 30 (LLM) = 100
    scoringRubric: {
        "employeeScore": {
            maxPoints: 10,
            description: "Company headcount is within ICP range",
            min: 10,
            max: 500,
        },
        "emailQuality": {
            maxPoints: 15,
            description: "Email is deliverable and not a disposable address",
        },
        "industryMatch": {
            maxPoints: 15,
            description: "Company industry matches one of the target industries",
            // reads from icp.industries — no extra params needed, it's a list match
        },
        "techStackSignal": {
            maxPoints: 10,
            description: "Company uses at least N tools from the target tech stack list",
            min: 2, // how many stack overlaps needed to get full points
        },
        "headcountGrowth": {
            maxPoints: 10,
            description: "Company grew headcount above threshold in last 6 months",
            min: 0.05, // 5%
        },
        "fundingScore": {
            maxPoints: 10,
            description: "Company has received funding or not"
        }
    },
    // --- Quality checker rules ---
    qualityRules: {
        maxWordsPerEmail: 150,
        requiredCtaCount: 1,
        spamTriggerWords: [
            "free",
            "guaranteed",
            "limited time",
            "act now",
            "click here",
            "no risk",
            "100%",
            "amazing",
            "incredible",
            "you won't believe",
            "congratulations",
            "winner",
            "urgent",
            "make money",
            "best price",
        ],
        mustReferenceCompanySignal: true, // email 1 must reference something specific
    },

    // --- Sequence structure ---
    // Each step's angle is passed to the LLM so each email takes a different approach
    // rather than repeating the same pitch three times
    sequence: [
        {
            step: 1,
            dayOffset: 0,
            angle:
                "Lead with a specific insight about their company or a pain signal you found (hiring, tech stack, growth). Connect it naturally to the problem DeployKit solves. One clear CTA. Do not oversell — this is about starting a conversation, not closing a deal.",
        },
        {
            step: 2,
            dayOffset: 4,
            angle:
                "Take a different angle — lead with a concrete result or a customer story (keep it anonymous). Something like 'a team similar to yours cut their deploy time by X'. No mention of the previous email. Soft CTA — offer something useful (a benchmark, a loom walkthrough, a doc).",
        },
        {
            step: 3,
            dayOffset: 10,
            angle:
                "Breakup email. Short, direct, slightly self-aware. Acknowledge they're busy. Give them one last low-friction option (reply with a number 1-3 to tell us where they are). No hard sell. Leave on a positive note.",
        },
    ],
};