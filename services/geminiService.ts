
import { GoogleGenAI, Type } from "@google/genai";

// Strictly adhering to system instructions: Use process.env.API_KEY for Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async optimizeTagline(name: string, description: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a catchy 1-sentence tagline for a product called "${name}" which is described as: "${description}". The product is for the Muslim tech community.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text?.replace(/"/g, '').trim() || '';
    } catch (error) {
      console.error("Gemini optimization failed:", error);
      return '';
    }
  },

  async getCategorySuggestion(description: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Categorize this product description into one of these: Spirituality, Travel, Finance, Social, Education, Productivity, Food, Health. Description: "${description}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING }
            }
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      return data.category || 'Productivity';
    } catch (error) {
      return 'Productivity';
    }
  }
};
