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
        required: ["title", "description", "calories", "chefTips", "ingredients", "steps", "cookingTime", "difficulty"],
      },
    },
  },
  required: ["analysis", "recipes"],
};

export const generateRecipes = async (
  base64Image: string,
  userPreference: string,
  mode: AppMode,
  language: Language,
  apiKey: string
): Promise<GenerationResponse> => {
  try {
    if (!apiKey.trim()) throw new Error('Enter your personal Google API key');
    if (userPreference.length > 4000) throw new Error('Preferences are too long');
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const image = parseImage(base64Image);

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
              mimeType: image.mimeType,
              data: image.data,
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
      return validateRecipes(JSON.parse(response.text));
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    throw new Error('Recipe generation failed. Check your image, key and connection, then retry.');
  }
};
export function parseImage(value: string) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length > 7 * 1024 * 1024) throw new Error('Use a JPEG, PNG or WebP under 5 MB');
  return { mimeType: match[1], data: match[2] };
}

export function validateRecipes(value: any): GenerationResponse {
  const text = (v: unknown) => typeof v === 'string' && v.length <= 10000;
  if (!value || !text(value.analysis) || !Array.isArray(value.recipes) || !value.recipes.length || value.recipes.length > 10 ||
      value.recipes.some((r: any) => !r || !text(r.title) || !text(r.description) || !text(r.cookingTime) ||
        !text(r.calories) || !text(r.chefTips) || !['Easy','Medium','Hard'].includes(r.difficulty) ||
        !Array.isArray(r.ingredients) || !r.ingredients.length || r.ingredients.length > 100 ||
        r.ingredients.some((i: any) => !i || !text(i.name) || !text(i.amount)) ||
        !Array.isArray(r.steps) || !r.steps.length || r.steps.length > 100 ||
        r.steps.some((s: any) => !s || !Number.isInteger(s.stepNumber) || s.stepNumber < 1 || !text(s.instruction)))) {
    throw new Error('Invalid recipe response');
  }
  return value;
}
