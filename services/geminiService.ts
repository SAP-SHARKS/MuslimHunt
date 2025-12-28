import { GoogleGenAI, Type } from "@google/genai";

/* 
 * Guideline: Always use process.env.API_KEY directly in initialization.
 * Must use the named parameter format: { apiKey: process.env.API_KEY }.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Optimizes a product tagline using Gemini.
   */
  async optimizeTagline(name: string, description: string): Promise<string> {
    try {
      /* Guideline: Use 'gemini-3-flash-preview' for basic text tasks. */
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a catchy 1-sentence tagline for a product called "${name}" which is described as: "${description}". The product is for the Muslim tech community.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      /* Guideline: Directly access the .text property (it is a property, not a method). */
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
      /* Guideline: Use 'gemini-3-flash-preview' with responseSchema for JSON output. */
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
      
      /* Guideline: Access response.text and parse the JSON string. */
      const jsonStr = response.text?.trim();
      if (!jsonStr) {
        return 'Productivity';
      }
      
      const data = JSON.parse(jsonStr);
      return data.category || 'Productivity';
    } catch (error) {
      console.error("Gemini category suggestion failed:", error);
      return 'Productivity';
    }
  }
};