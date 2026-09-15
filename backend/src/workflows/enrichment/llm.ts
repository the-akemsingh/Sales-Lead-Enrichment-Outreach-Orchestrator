import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.config';

const llmClient = new GoogleGenAI({
    apiKey: config.get("geminiApiKey")
});

async function callLLM({ system, prompt }: { system: string, prompt: string }) {
    const response = await llmClient.models.generateContent({
        model: "gemini-3.5-flash-lite",
        config: {
            systemInstruction: system,
            temperature: 0.2,
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = response.text ?? ""

    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim()

    try {
        return JSON.parse(cleaned)
    } catch (e) {
        throw new Error(`LLM returned non-parseable JSON: ${raw}`)
    }
}

export default callLLM;