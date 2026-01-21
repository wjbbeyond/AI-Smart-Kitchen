export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories?: string;
  ingredients: Ingredient[];
  steps: Step[];
  chefTips: string;
}

export interface GenerationResponse {
  analysis: string; // What the AI saw in the image
  recipes: Recipe[];
}

export type AppMode = 'ingredients' | 'dish';

export type Language = 'en' | 'zh';

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}