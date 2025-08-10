import { GoogleGenAI } from '@google/genai';
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Make sure this is set in your .env.local

const ai = new GoogleGenAI({
    apiKey // Only apiKey needed for Gemini API
});
const model = 'gemini-2.5-flash';

const generationConfig = {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }
    ],
};

/**
 * Get a Gemini response for a prompt.
 * @param {string} prompt - The user prompt or question.
 * @returns {Promise<string>} - The model's response as a string.
 */
export async function getGeminiResponse(prompt) {
    const req = {
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: generationConfig,
    };

    const streamingResp = await ai.models.generateContentStream(req);

    let result = '';
    for await (const chunk of streamingResp) {
        if (chunk.text) {
            result += chunk.text;
        }
    }
    return result;
}