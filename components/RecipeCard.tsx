import React, { useState } from 'react';
import { Clock, BarChart, ChevronDown, ChevronUp, Flame, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  labels: {
    option: string;
    ingredients: string;
    instructions: string;
    chefTip: string;
  };
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, labels }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
      <div 
        className="p-5 flex items-start justify-between cursor-pointer bg-gradient-to-r from-white to-slate-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              {labels.option} {index + 1}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{recipe.title}</h3>
          </div>
          <p className="text-slate-600 text-sm line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.cookingTime}
            </div>
            <div className="flex items-center gap-1">
              <BarChart size={14} />
              {recipe.difficulty}
            </div>
            {recipe.calories && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                {recipe.calories}
              </div>
            )}
          </div>
        </div>
        <button className="text-slate-400 p-2">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-slate-100 bg-white animate-fadeIn">
          {/* Ingredients Section */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              {labels.ingredients}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">{ing.name}</span>
                  <span className="text-slate-500 text-sm">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Section */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              {labels.instructions}
            </h4>
            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div key={step.stepNumber} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm border border-slate-200">
                    {step.stepNumber}
                  </div>
                  <p className="text-slate-700 leading-relaxed mt-1">{step.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Tip */}
          {recipe.chefTips && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <ChefHat className="text-amber-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h5 className="text-amber-800 font-bold text-sm mb-1">{labels.chefTip}</h5>
                <p className="text-amber-700 text-sm italic">{recipe.chefTips}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};