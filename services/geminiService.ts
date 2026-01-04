
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Optimizes a product tagline using Gemini.
   */
  async optimizeTagline(name: string, description: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a catchy 1-sentence tagline for a product called "${name}" which is described as: "${description}". The product is for the Muslim tech community.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      // Accessing .text property directly as per guidelines
      const tagline = response.text?.replace(/"/g, '').trim();
      return tagline || `${name} - Your trusted solution`;
    } catch (error) {
      console.error("Gemini optimization failed:", error);
      return `${name} - Your trusted solution`;
    }
  },

  /**
   * Suggests a category for a product based on its description.
   */
  async getCategorySuggestion(description: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Categorize this product description into one of these: Spirituality, Travel, Finance, Social, Education, Productivity, Food, Health. Description: "${description}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { 
                type: Type.STRING,
                description: 'The suggested category for the product.'
              }
            },
            required: ['category'],
            propertyOrdering: ["category"]
          }
        }
      });
      
      // Accessing .text property directly as per guidelines
      const jsonStr = response.text?.trim();
      const data = JSON.parse(jsonStr || '{}');
      return data.category || 'Productivity';
    } catch (error) {
      console.error("Gemini category suggestion failed:", error);
      return 'Productivity';
    }
  }
};
