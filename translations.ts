import { Language } from "./types";

type TranslationStructure = {
  appTitle: string;
  startOver: string;
  hero: {
    ingredientsTitle: string;
    ingredientsHighlight: string;
    ingredientsSubtitle: string;
    dishTitle: string;
    dishHighlight: string;
    dishSubtitle: string;
  };
  mode: {
    ingredients: string;
    dish: string;
  };
  upload: {
    ingredientsTitle: string;
    ingredientsSubtitle: string;
    dishTitle: string;
    dishSubtitle: string;
    dragDrop: string;
    ready: string;
  };
  preferences: {
    ingredientsLabel: string;
    ingredientsPlaceholder: string;
    dishLabel: string;
    dishPlaceholder: string;
  };
  buttons: {
    getRecipes: string;
    recreateDish: string;
    analyzeAnother: string;
    processing: string;
    tryAgain: string;
  };
  error: {
    title: string;
    generic: string;
  };
  results: {
    ingredientsDetected: string;
    dishIdentified: string;
    suggestedRecipes: string;
    howToMake: string;
    found: string;
  };
  card: {
    option: string;
    ingredients: string;
    instructions: string;
    chefTip: string;
  };
};

export const translations: Record<Language, TranslationStructure> = {
  en: {
    appTitle: "AI Smart Kitchen",
    startOver: "Start Over",
    hero: {
      ingredientsTitle: "Turn Ingredients into",
      ingredientsHighlight: "Delicious Meals",
      ingredientsSubtitle: "Snap a photo of your groceries or what's in your fridge. Let AI be your sous-chef.",
      dishTitle: "Recreate Your Favorite",
      dishHighlight: "Dishes at Home",
      dishSubtitle: "Upload a photo of a finished dish, and we'll tell you exactly how to cook it."
    },
    mode: {
      ingredients: "Ingredients",
      dish: "Scan Dish"
    },
    upload: {
      ingredientsTitle: "Take a photo of ingredients",
      ingredientsSubtitle: "Upload groceries, vegetables, or meats.",
      dishTitle: "Take a photo of a dish",
      dishSubtitle: "Upload a finished plate of food to get the recipe.",
      dragDrop: "Click to browse or drag and drop your image here. Supports JPG, PNG, WebP.",
      ready: "Image ready for analysis"
    },
    preferences: {
      ingredientsLabel: "Any preferences? (Optional)",
      ingredientsPlaceholder: "e.g., I want something spicy, make 3 different dishes, suitable for kids...",
      dishLabel: "Notes or adjustments? (Optional)",
      dishPlaceholder: "e.g., It was too salty last time, I want a vegan version, or tell me the secret ingredient..."
    },
    buttons: {
      getRecipes: "Get Recipes",
      recreateDish: "Recreate Dish",
      analyzeAnother: "Analyze Another Image",
      processing: "Processing...",
      tryAgain: "Try again"
    },
    error: {
      title: "Something went wrong",
      generic: "Failed to generate recipes. Please try again. Make sure your API key is valid."
    },
    results: {
      ingredientsDetected: "Ingredients Detected",
      dishIdentified: "Dish Identified",
      suggestedRecipes: "Suggested Recipes",
      howToMake: "How to Make It",
      found: "found",
    },
    card: {
      option: "Option",
      ingredients: "Ingredients",
      instructions: "Instructions",
      chefTip: "Chef's Tip"
    }
  },
  zh: {
    appTitle: "AI 智慧厨房",
    startOver: "重新开始",
    hero: {
      ingredientsTitle: "将食材变身",
      ingredientsHighlight: "美味佳肴",
      ingredientsSubtitle: "拍一张食材的照片，让 AI 成为您的私人大厨。",
      dishTitle: "在家复刻",
      dishHighlight: "经典美食",
      dishSubtitle: "上传一张成品菜肴的照片，我们将告诉您具体的烹饪方法。"
    },
    mode: {
      ingredients: "食材模式",
      dish: "菜品复刻"
    },
    upload: {
      ingredientsTitle: "拍摄食材照片",
      ingredientsSubtitle: "上传蔬菜、肉类或杂货的照片。",
      dishTitle: "拍摄菜品照片",
      dishSubtitle: "上传做好的菜品照片以获取食谱。",
      dragDrop: "点击上传或拖拽图片至此。支持 JPG, PNG, WebP。",
      ready: "图片已就绪"
    },
    preferences: {
      ingredientsLabel: "有什么偏好吗？（选填）",
      ingredientsPlaceholder: "例如：想吃辣的，做3个不同的菜，适合孩子吃...",
      dishLabel: "备注或调整？（选填）",
      dishPlaceholder: "例如：上次吃的太咸了，我想要素食版本，或者告诉我秘制酱料..."
    },
    buttons: {
      getRecipes: "生成食谱",
      recreateDish: "复刻美食",
      analyzeAnother: "分析另一张",
      processing: "AI 思考中...",
      tryAgain: "重试"
    },
    error: {
      title: "出错了",
      generic: "生成食谱失败。请检查 API Key 并重试。"
    },
    results: {
      ingredientsDetected: "识别到的食材",
      dishIdentified: "识别到的菜品",
      suggestedRecipes: "推荐食谱",
      howToMake: "制作方法",
      found: "个结果",
    },
    card: {
      option: "选项",
      ingredients: "食材清单",
      instructions: "烹饪步骤",
      chefTip: "大厨贴士"
    }
  }
};