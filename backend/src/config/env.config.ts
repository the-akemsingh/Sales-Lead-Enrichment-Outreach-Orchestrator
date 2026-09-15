import dotenv from 'dotenv';
dotenv.config();

interface Config {
    apiServerPort: number;
    dbUrl: string
    apolloApiKey: string
    serpApiKey: string
    abstractApiKey: string
    geminiApiKey: string
}

class ConfigLoader {
    private static instance: ConfigLoader;
    private config: Config;

    private constructor() {
        this.config = {
            apiServerPort: Number(process.env.API_SERVER_PORT) || 400,
            dbUrl: String(process.env.DATABASE_URL),
            apolloApiKey: String(process.env.APOLLO_API_KEY),
            serpApiKey: String(process.env.SERP_API_KEY),
            abstractApiKey: String(process.env.ABSTRACT_API_KEY),
            geminiApiKey: String(process.env.GEMINI_API_KEY),
        };
    }

    public static getInstance(): ConfigLoader {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = new ConfigLoader();
        }
        return ConfigLoader.instance;
    }

    public get<K extends keyof Config>(key: K): Config[K] {
        return this.config[key];
    }

    public validate(): void {
        if (!this.config.apiServerPort) {
            throw new Error('API_SERVER_PORT is required');
        }
        else if (!this.config.dbUrl) {
            throw new Error('DATABASE_URL is required');
        }
        else if (!this.config.apolloApiKey) {
            throw new Error('APOLLO_API_KEY is required');
        }
        else if (!this.config.serpApiKey) {
            throw new Error('SERP_API_KEY is required');
        }
        else if (!this.config.abstractApiKey) {
            throw new Error('ABSTRACT_API_KEY is required');
        }
        else if (!this.config.geminiApiKey) {
            throw new Error('GEMINI_API_KEY is required');
        }
    }
}

export const config = ConfigLoader.getInstance();