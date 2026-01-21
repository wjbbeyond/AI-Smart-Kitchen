import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse, AppMode, Language } from "../types";

// Define the schema for structured output to ensure consistent UI rendering
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "A brief description of what was identified in the image (ingredients or specific dish).",
    },
    recipes: {
      type: Type.ARRAY,
      description: "A list of suggested recipes.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "Short appetizing description" },
          cookingTime: { type: Type.STRING, description: "e.g., '30 mins'" },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          calories: { type: Type.STRING, description: "Approximate calories per serving" },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
              },
            },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                instruction: { type: Type.STRING },
              },
            },
          },
          chefTips: { type: Type.STRING, description: "A pro tip for this specific dish." },
        },
        required: ["title", "ingredients", "steps", "cookingTime", "difficulty"],
      },
    },
  },
  required: ["analysis", "recipes"],
};

export const generateRecipes = async (
  base64Image: string,
  userPreference: string,
  mode: AppMode,
  language: Language
): Promise<GenerationResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const langInstruction = language === 'zh' 
      ? "IMPORTANT: You MUST output all text in Simplified Chinese (简体中文)." 
      : "IMPORTANT: You MUST output all text in English.";

    let prompt = "";

    if (mode === 'ingredients') {
      prompt = `
        You are a world-class chef assistant. 
        1. Analyze the attached image to identify the raw ingredients (vegetables, meats, etc.).
        2. Consider the user's specific request/preferences: "${userPreference || "Suggest something delicious"}".
        3. Generate tailored recipes that use the identified ingredients. 
        If the user asks for multiple dishes (e.g., "3 dishes"), provide that many. 
        Ensure the recipes are practical and appetizing.
        ${langInstruction}
      `;
    } else {
      prompt = `
        You are a world-class chef assistant.
        1. Analyze the attached image which shows a FINISHED DISH. Identify the dish name, cuisine style, and key components.
        2. Provide the recipe to recreate this specific dish.
        3. Incorporate user preferences: "${userPreference || "How to make this?"}".
        If the user wants a variation (e.g. "make it healthier", "spicier"), adapt the traditional recipe accordingly.
        Provide the main recipe and potentially a variation if appropriate.
        ${langInstruction}
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", 
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: `You are a helpful, creative, and precise culinary AI. ${langInstruction}`,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GenerationResponse;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};