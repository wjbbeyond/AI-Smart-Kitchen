import React, { useState } from 'react';
import { ChefHat, Sparkles, UtensilsCrossed, AlertCircle, ShoppingBasket, Search, Globe } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { RecipeCard } from './components/RecipeCard';
import { generateRecipes } from './services/geminiService';
import { AppState, GenerationResponse, AppMode, Language } from './types';
import { translations } from './translations';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [mode, setMode] = useState<AppMode>('ingredients');
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese as per request context
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const handleGenerate = async () => {
    if (!image) return;

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await generateRecipes(image, userPrompt, mode, language);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setError(t.error.generic);
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setImage(null);
    setUserPrompt('');
    setResult(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  const handleModeChange = (newMode: AppMode) => {
    if (appState === AppState.IDLE) {
      setMode(newMode);
      setImage(null);
      setUserPrompt('');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <ChefHat size={28} strokeWidth={2.5} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.appTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
            >
              <Globe size={16} />
              {language === 'en' ? 'EN' : '中文'}
            </button>
            
            {appState === AppState.SUCCESS && (
              <button 
                onClick={reset}
                className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
              >
                {t.startOver}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Intro Section - Only show when IDLE */}
        {appState === AppState.IDLE && !image && (
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              {mode === 'ingredients' ? (
                <>{t.hero.ingredientsTitle} <br /><span className="text-emerald-600">{t.hero.ingredientsHighlight}</span></>
              ) : (
                <>{t.hero.dishTitle} <br /><span className="text-orange-600">{t.hero.dishHighlight}</span></>
              )}
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              {mode === 'ingredients' ? t.hero.ingredientsSubtitle : t.hero.dishSubtitle}
            </p>
          </div>
        )}

        {/* Mode Switcher */}
        <div className={`flex justify-center mb-8 transition-all duration-500 ${appState === AppState.SUCCESS ? 'hidden' : 'block'}`}>
          <div className="bg-slate-100 p-1 rounded-xl inline-flex shadow-inner">
            <button
              onClick={() => handleModeChange('ingredients')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'ingredients' 
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingBasket size={18} />
              {t.mode.ingredients}
            </button>
            <button
              onClick={() => handleModeChange('dish')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'dish' 
                  ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Search size={18} />
              {t.mode.dish}
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className={`space-y-6 transition-all duration-500 ${appState === AppState.SUCCESS ? 'hidden' : 'block'}`}>
          
          {/* 1. Image Upload */}
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
            <ImageUpload 
              selectedImage={image} 
              onImageSelected={setImage} 
              onClear={() => setImage(null)}
              title={mode === 'ingredients' ? t.upload.ingredientsTitle : t.upload.dishTitle}
              subtitle={mode === 'ingredients' ? t.upload.ingredientsSubtitle : t.upload.dishSubtitle}
              dragText={t.upload.dragDrop}
              readyText={t.upload.ready}
            />
          </div>

          {/* 2. User Preferences */}
          <div className={`transition-all duration-500 ${image ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                {mode === 'ingredients' ? t.preferences.ingredientsLabel : t.preferences.dishLabel}
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={mode === 'ingredients' ? t.preferences.ingredientsPlaceholder : t.preferences.dishPlaceholder}
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none bg-slate-50 text-slate-700 placeholder:text-slate-400"
              />
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={appState === AppState.ANALYZING}
                  loadingText={t.buttons.processing}
                  disabled={!image}
                  className="w-full md:w-auto"
                  variant={mode === 'ingredients' ? 'primary' : 'secondary'}
                >
                  <UtensilsCrossed size={18} />
                  {mode === 'ingredients' ? t.buttons.getRecipes : t.buttons.recreateDish}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {appState === AppState.ERROR && error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700 items-start animate-fadeIn">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t.error.title}</p>
              <p className="text-sm">{error}</p>
              <button onClick={() => setAppState(AppState.IDLE)} className="text-sm underline mt-2 hover:text-red-800">{t.buttons.tryAgain}</button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {appState === AppState.SUCCESS && result && (
          <div className="animate-fadeIn space-y-8">
            {/* Analysis Summary */}
            <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 ${mode === 'ingredients' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
              <h3 className={`font-bold uppercase tracking-wider text-sm mb-2 ${mode === 'ingredients' ? 'text-emerald-400' : 'text-orange-400'}`}>
                {mode === 'ingredients' ? t.results.ingredientsDetected : t.results.dishIdentified}
              </h3>
              <p className="text-lg leading-relaxed font-light">{result.analysis}</p>
            </div>

            {/* Recipes List */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                {mode === 'ingredients' ? t.results.suggestedRecipes : t.results.howToMake}
                <span className="bg-slate-100 text-slate-600 text-sm font-normal py-1 px-3 rounded-full">
                  {result.recipes.length} {t.results.found}
                </span>
              </h3>
              
              {result.recipes.map((recipe, idx) => (
                <RecipeCard key={idx} recipe={recipe} index={idx} labels={t.card} />
              ))}
            </div>

            <div className="flex justify-center pt-8">
               <Button onClick={reset} variant="outline">
                 {t.buttons.analyzeAnother}
               </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;